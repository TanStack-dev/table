---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T17:11:08.700Z'
title: 表格状态
---
## 表格状态管理 (Svelte) 指南

TanStack Table 的核心是**框架无关 (framework agnostic)** 的，这意味着无论您使用哪种框架，其 API 都保持一致。根据您使用的框架，提供了适配器 (Adapters) 来简化与表格核心的交互。可用的适配器请参阅 Adapters 菜单。

### 访问表格状态

无需特殊设置即可使用表格状态功能。如果不向 `state`、`initialState` 或任何 `on[State]Change` 表格选项中传递任何内容，表格将在内部自行管理状态。您可以通过 `table.getState()` 表格实例 API 访问内部状态的任何部分。

```jsx
const options = writable({
  columns,
  data,
  //...
})

const table = createSvelteTable(options)

console.log(table.getState()) //访问整个内部状态
console.log(table.getState().rowSelection) //仅访问行选中状态
```

### 自定义初始状态

如果仅需为某些状态定制其初始默认值，您仍然无需自行管理任何状态。只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
const options = writable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //自定义初始列顺序
    columnVisibility: {
      id: false //默认隐藏 id 列
    },
    expanded: true, //默认展开所有行
    sorting: [
      {
        id: 'age',
        desc: true //默认按年龄降序排序
      }
    ]
  },
  //...
})

const table = createSvelteTable(options)
```

> **注意**：每个特定状态只能在 `initialState` 或 `state` 中指定，不能同时存在于两者。如果某个状态值同时传递给 `initialState` 和 `state`，`state` 中的初始化状态将覆盖 `initialState` 中的对应值。

### 受控状态

如果需要在应用程序的其他区域轻松访问表格状态，TanStack Table 允许您在自己的状态管理系统中轻松控制和管理表格的全部或部分状态。通过将自己的状态和状态管理函数传递给 `state` 和 `on[State]Change` 表格选项即可实现。

#### 部分受控状态

您可以仅控制需要轻松访问的状态。如果不需要，不必控制所有表格状态。建议根据具体情况仅控制所需状态。

为了控制特定状态，您需要将对应的 `state` 值和 `on[State]Change` 函数传递给表格实例。

以“手动”服务端数据获取场景中的筛选、排序和分页为例。您可以将筛选、排序和分页状态存储在自己的状态管理中，但如果您的 API 不关心列顺序、列可见性等其他状态，则可以忽略它们。

```ts
let sorting = [
  {
    id: 'age',
    desc: true, //默认按年龄降序排序
  },
]
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}

let columnFilters = [] //无默认筛选条件
const setColumnFilters = updater => {
  if (updater instanceof Function) {
    columnFilters = updater(columnFilters)
  } else {
    columnFilters = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      columnFilters,
    },
  }))
}

let pagination = { pageIndex: 0, pageSize: 15 } //默认分页
const setPagination = updater => {
  if (updater instanceof Function) {
    pagination = updater(pagination)
  } else {
    pagination = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      pagination,
    },
  }))
}

//使用受控状态值获取数据
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const options = writable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //将受控状态传回表格（覆盖内部状态）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //将 columnFilters 状态提升至自己的状态管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})

const table = createSvelteTable(options)
//...
```

#### 完全受控状态

或者，您可以使用 `onStateChange` 表格选项控制整个表格状态。这将把整个表格状态提升至您自己的状态管理系统。使用此方法需谨慎，因为将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升至 Svelte 树中可能会导致性能问题。

可能需要一些额外技巧来实现这一点。如果使用 `onStateChange` 表格选项，`state` 的初始值必须填充您想使用的所有相关状态值。您可以手动输入所有初始状态值，或如下所示特殊方式使用 `table.setOptions` API。

```jsx
//创建带有默认状态值的表格实例
const options = writable({
  columns,
  data,
  //... 注意：尚未传递 `state` 值
})
const table = createSvelteTable(options)

let state = {
  ...table.initialState, //用表格实例的所有默认状态值填充初始状态
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可选自定义初始分页状态
  }
}
const setState = updater => {
  if (updater instanceof Function) {
    state = updater(state)
  } else {
    state = updater
  }
  options.update(old => ({
    ...old,
    state,
  }))
}

//使用 table.setOptions API 将完全受控状态合并到表格实例
table.setOptions(prev => ({
  ...prev, //保留上面设置的任何其他选项
  state, //完全受控状态覆盖内部状态
  onStateChange: setState //任何状态变更将推送至自己的状态管理
}))
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项如何将表格状态变更“提升”至我们自己的状态管理。但使用这些选项时需要注意以下几点。

#### 1. **状态变更回调必须在其对应的 `state` 选项中有相应的状态值**。

指定 `on[State]Change` 回调会告知表格实例这是一个受控状态。如果未指定对应的 `state` 值，该状态将“冻结”为其初始值。

```ts
let sorting = []
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
//...
const options = writable({
  columns,
  data,
  //...
  state: {
    sorting, //必须因为我们正在使用 `onSortingChange`
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
const table = createSvelteTable(options)
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新状态值，也可以是接收先前状态值并返回新状态值的回调函数。

这意味着什么？如果想在任何 `on[State]Change` 回调中添加额外逻辑，可以这样做，但需要检查新传入的更新器值是函数还是值。

这就是为什么在上面的示例中 `setState` 函数会有 `if (updater instanceof Function)` 检查。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，您可以导入并使用。这有助于确保您为控制的状态值使用正确的数据结构和属性。

```ts
import { createSvelteTable, type SortingState, type Updater } from '@tanstack/svelte-table'
//...
let sorting: SortingState[] = [
  {
    id: 'age', //您应该能获得 `id` 和 `desc` 属性的自动补全
    desc: true,
  }
]
const setSorting = (updater: Updater<SortingState>)  => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
```
