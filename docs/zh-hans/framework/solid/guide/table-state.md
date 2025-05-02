---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T17:09:57.406Z'
title: 表格状态
---
## 表格状态管理 (Solid) 指南

TanStack Table 的核心是**框架无关 (framework agnostic)** 的，这意味着无论您使用何种框架，其 API 都保持一致。通过适配器 (Adapters) 可以更方便地在不同框架中使用表格核心功能。可用适配器请参阅 Adapters 菜单。

### 访问表格状态

表格状态管理无需特殊设置。如果不向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传递参数，表格将在内部自行管理状态。您可以通过 `table.getState()` 表格实例 API 访问任何内部状态。

```jsx
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //...
})

console.log(table.getState()) // 访问完整内部状态
console.log(table.getState().rowSelection) // 仅访问行选中状态
```

### 自定义初始状态

若只需自定义某些状态的初始默认值，您仍无需自行管理状态。只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
const table = createSolidTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], // 自定义初始列排序
    columnVisibility: {
      id: false // 默认隐藏 id 列
    },
    expanded: true, // 默认展开所有行
    sorting: [
      {
        id: 'age',
        desc: true // 默认按年龄降序排序
      }
    ]
  },
  //...
})
```

> **注意**：每个特定状态只能在 `initialState` 或 `state` 中指定，不能同时存在于两者。若某个状态值同时传递给 `initialState` 和 `state`，`state` 中的初始化值将覆盖 `initialState` 中的对应值。

### 受控状态

如需在应用其他区域轻松访问表格状态，TanStack Table 支持将部分或全部表格状态交由您自己的状态管理系统控制。通过向 `state` 和 `on[State]Change` 表格选项传递自定义状态和管理函数即可实现。

#### 部分受控状态

您可以仅控制需要频繁访问的状态，无需全盘接管。建议根据实际需求按需控制特定状态。

要控制特定状态，需同时向表格实例传递对应的 `state` 值和 `on[State]Change` 函数。以下以服务端手动获取数据场景中的筛选、排序和分页状态为例：

```jsx
const [columnFilters, setColumnFilters] = createSignal([]) // 无默认筛选条件
const [sorting, setSorting] = createSignal([{
  id: 'age',
  desc: true, // 默认按年龄降序排序
}]) 
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 15 })

// 使用受控状态值获取数据
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = createSolidTable({
  columns,
  get data() {
    return tableQuery.data()
  },
  //...
  state: {
    get columnFilters() {
      return columnFilters() // 将受控状态传回表格（覆盖内部状态）
    },
    get sorting() {
      return sorting()
    },
    get pagination() {
      return pagination()
    },
  },
  onColumnFiltersChange: setColumnFilters, // 将 columnFilters 状态提升至自有状态管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全受控状态

也可通过 `onStateChange` 表格选项控制整个表格状态。这会将所有状态提升至您的状态管理系统。需注意：频繁变化的状态值（如 `columnSizingInfo`）可能导致性能问题。

实现完全控制需要一些技巧。使用 `onStateChange` 时，必须为所有要使用的功能预填充 `state` 初始值。可以手动编写所有初始状态，或如下特殊使用 `table.setOptions` API：

```jsx
// 创建带有默认状态值的表格实例
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //... 注意：此时尚未传递 `state` 值
})

const [state, setState] = createSignal({
  ...table.initialState, // 用表格实例的所有默认状态值填充初始状态
  pagination: {
    pageIndex: 0,
    pageSize: 15 // 可选自定义分页初始状态
  }
})

// 使用 table.setOptions API 将完全受控状态合并到表格实例
table.setOptions(prev => ({
  ...prev, // 保留之前设置的所有选项
  get state() {
    return state() // 完全受控状态覆盖内部状态
  },
  onStateChange: setState // 所有状态变更将推送至自有状态管理
}))
```

### 状态变更回调

前文展示了 `on[State]Change` 和 `onStateChange` 如何将表格状态变更"提升"至自有状态管理。但使用这些选项时需注意以下几点：

#### 1. **状态变更回调必须对应 `state` 选项中的状态值**

指定 `on[State]Change` 回调即表示该状态将受控。若未指定对应的 `state` 值，该状态将保持初始值不变。

```jsx
const [sorting, setSorting] = createSignal([])
//...
const table = createSolidTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting() // 必须提供，因为使用了 `onSortingChange`
    },
  },
  onSortingChange: setSorting, // 使 `state.sorting` 成为受控状态
})
```

#### 2. **更新器可以是原始值或回调函数**

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React (Solid Setters) 中的 `setState` 函数完全相同。更新器可以是新状态值，也可以是接收旧状态值并返回新状态值的回调函数。

这意味着您可以在 `on[State]Change` 回调中添加额外逻辑，但需要检查传入的更新器是函数还是值：

```jsx
const [sorting, setSorting] = createSignal([])
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 10 })

const table = createSolidTable({
  get columns() {
    return columns()
  },
  get data() {
    return data()
  },
  //...
  state: {
    get pagination() {
      return pagination()
    },
    get sorting() {
      return sorting()
    },
  }
  // 语法 1
  onPaginationChange: (updater) => {
    setPagination(old => {
      const newPaginationValue = updater instanceof Function ? updater(old) : updater
      // 可对新分页值进行处理
      //...
      return newPaginationValue
    })
  },
  // 语法 2
  onSortingChange: (updater) => {
    const newSortingValue = updater instanceof Function ? updater(sorting) : updater
    // 可对新排序值进行处理
    //...
    setSorting(updater) // 正常状态更新
  }
})
```

### 状态类型

TanStack Table 中所有复杂状态都有对应的 TypeScript 类型可供导入使用。这能确保您为受控状态值使用正确的数据结构和属性。

```tsx
import { createSolidTable, type SortingState } from '@tanstack/solid-table'
//...
const [sorting, setSorting] = createSignal<SortingState[]>([
  {
    id: 'age', // 可自动补全 `id` 和 `desc` 属性
    desc: true,
  }
])
```
