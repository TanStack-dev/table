---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T17:07:50.431Z'
title: 表格状态
---
## 表格状态 (Qwik) 指南

TanStack Table 拥有一个简单的底层内部状态管理系统，用于存储和管理表格状态。它还允许您有选择性地提取需要在自身状态管理中处理的任何状态。本指南将介绍与表格状态交互和管理的不同方式。

### 访问表格状态

您无需进行任何特殊设置即可使表格状态正常工作。如果未向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传入任何内容，表格将在内部自行管理状态。您可以使用 `table.getState()` 表格实例 API 访问这部分内部状态的任何内容。

```jsx
const table = useQwikTable({
  columns,
  data,
  //...
})

console.log(table.getState()) //访问整个内部状态
console.log(table.getState().rowSelection) //仅访问行选中状态
```

### 自定义初始状态

如果仅需为某些状态自定义其初始默认值，您仍无需自行管理任何状态。只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
const table = useQwikTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //自定义初始列排序
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
```

> **注意**：每个特定状态只能在 `initialState` 或 `state` 中指定，不能同时存在于两者。如果向 `initialState` 和 `state` 都传入了特定状态值，`state` 中的初始化状态将覆盖 `initialState` 中的对应值。

### 受控状态

如果需要在应用程序的其他区域轻松访问表格状态，TanStack Table 可让您轻松在自身状态管理系统中控制和管理部分或全部表格状态。通过向 `state` 和 `on[State]Change` 表格选项传入自身状态和状态管理函数即可实现。

#### 单独受控状态

您可以仅控制需要轻松访问的状态。如果不需要，不必控制所有表格状态。建议根据具体情况仅控制所需状态。

为了控制特定状态，您需要向表格实例同时传入对应的 `state` 值和 `on[State]Change` 函数。

以“手动”服务端数据获取场景中的筛选、排序和分页为例。您可以将筛选、排序和分页状态存储在自身状态管理中，但如果 API 不关心列顺序、列可见性等值，则可以忽略这些状态。

```jsx
const columnFilters = Qwik.useSignal([]) //无默认筛选器
const sorting = Qwik.useSignal([{
  id: 'age',
  desc: true, //默认按年龄降序排序
}]) 
const pagination = Qwik.useSignal({ pageIndex: 0, pageSize: 15 })

//使用受控状态值获取数据
const tableQuery = useQuery({
  queryKey: ['users', columnFilters.value, sorting.value, pagination.value],
  queryFn: () => fetchUsers(columnFilters.value, sorting.value, pagination.value),
  //...
})

const table = useQwikTable({
  columns: columns.value,
  data: tableQuery.data,
  //...
  state: {
    columnFilters: columnFilters.value, //将受控状态传回表格（覆盖内部状态）
    sorting: sorting.value,
    pagination: pagination.value,
  },
  onColumnFiltersChange: updater => {
    columnFilters.value = updater instanceof Function ? updater(columnFilters.value) : updater //将 columnFilters 状态提升至自身状态管理
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting.value) : updater
  },
  onPaginationChange: updater => {
    pagination.value = updater instanceof Function ? updater(pagination.value) : updater
  },
})
//...
```

#### 完全受控状态

或者，您可以使用 `onStateChange` 表格选项控制整个表格状态。这会将整个表格状态提升至自身状态管理系统。请注意此方法，因为将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升至组件树可能会导致性能问题。

可能需要更多技巧来实现这一点。如果使用 `onStateChange` 表格选项，`state` 的初始值必须填充所有相关状态值以满足您想使用的所有功能。您可以手动输入所有初始状态值，或如下所示以特殊方式使用 `table.setOptions` API。

```jsx
//创建带有默认状态值的表格实例
const table = useQwikTable({
  columns,
  data,
  //... 注意：此时尚未传入 `state` 值
})


const sate = Qwik.useSignal({
  ...table.initialState, //用表格实例的所有默认状态值填充初始状态
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可选自定义初始分页状态
  }
})

//使用 table.setOptions API 将完全受控状态合并到表格实例
table.setOptions(prev => ({
  ...prev, //保留之前设置的任何其他选项
  state: state.value, //完全受控状态覆盖内部状态
  onStateChange: updater => {
    state.value = updater instanceof Function ? updater(state.value) : updater //任何状态变更都将提升至自身状态管理
  },
}))
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项将表格状态变更“提升”至自身状态管理。但使用这些选项时需要注意以下几点。

#### 1. **状态变更回调必须在 `state` 选项中有对应的状态值**。

指定 `on[State]Change` 回调会告知表格实例该状态为受控状态。如果未指定对应的 `state` 值，该状态将“冻结”为其初始值。

```jsx
const sorting = Qwik.useSignal([])
//...
const table = useQwikTable({
  columns,
  data,
  //...
  state: {
    sorting: sorting.value, //必需，因为我们使用了 `onSortingChange`
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting) : updater //使 `state.sorting` 受控
  }, 
})
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新状态值，也可以是接收先前状态值并返回新状态值的回调函数。

这意味着什么？这意味着如果想在任何 `on[State]Change` 回调中添加额外逻辑，可以这样做，但需要检查新传入的更新器值是函数还是值。

这就是为什么在上面的示例中会看到 `updater instanceof Function ? updater(state.value) : updater` 模式。此模式检查更新器是否为函数，如果是，则调用该函数并传入先前状态值以获取新状态值。

### 状态类型

TanStack Table 中的所有复杂状态都有各自的 TypeScript 类型可供导入和使用。这有助于确保您为控制的状态值使用正确的数据结构和属性。

```tsx
import { useQwikTable, type SortingState } from '@tanstack/qwik-table'
//...
const sorting = Qwik.useSignal<SortingState[]>([
  {
    id: 'age', //应获得 `id` 和 `desc` 属性的自动补全
    desc: true,
  }
])
```
