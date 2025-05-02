---
source-updated-at: '2024-08-10T14:15:46.000Z'
translation-updated-at: '2025-05-02T17:12:25.078Z'
title: 表格状态
---
## 表格状态 (Vue) 指南

TanStack Table 拥有一个简单的基础内部状态管理系统，用于存储和管理表格的状态。它还允许您有选择性地提取需要在自身状态管理中处理的任何状态。本指南将带您了解与表格状态交互和管理的不同方式。

### 访问表格状态

您无需进行任何特殊设置即可使表格状态正常工作。如果未向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传递任何内容，表格将在内部自行管理其状态。您可以通过使用 `table.getState()` 表格实例 API 访问此内部状态的任何部分。

```ts
const table = useVueTable({
  columns,
  data: dataRef, // 响应式数据支持
  //...
})

console.log(table.getState()) // 访问整个内部状态
console.log(table.getState().rowSelection) // 仅访问行选择状态
```

### 使用响应式数据

> **v8.20.0 新增功能**

`useVueTable` 钩子现在支持响应式数据。这意味着您可以向 `data` 选项传递包含数据的 Vue `ref` 或 `computed`。表格将自动响应数据的变化。

```ts
const columns = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' }
]

const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const table = useVueTable({
  columns,
  data: dataRef, // 传递响应式数据 ref
})

// 之后，更新 dataRef 将自动更新表格
dataRef.value = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Doe' }
]
```

> ⚠️ 出于性能考虑，底层使用了 `shallowRef`，这意味着数据不是深度响应式的，只有 `.value` 是。要更新数据，您必须直接修改数据。

```ts
const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// 这不会更新表格 ❌
dataRef.value.push({ id: 4, name: 'John' })

// 这会更新表格 ✅
dataRef.value = [
  ...dataRef.value,
  { id: 4, name: 'John' }
]
```

### 自定义初始状态

如果对于某些状态，您只需要自定义其初始默认值，那么您仍然不需要自行管理任何状态。您只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
const table = useVueTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], // 自定义初始列顺序
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

> **注意**：每个特定的状态只能在 `initialState` 或 `state` 中指定，但不能同时在两者中指定。如果您将特定状态值同时传递给 `initialState` 和 `state`，`state` 中的初始化状态将覆盖 `initialState` 中的任何对应值。

### 受控状态

如果您需要在应用程序的其他区域轻松访问表格状态，TanStack Table 使得在您自己的状态管理系统中控制和管理表格的任何或所有状态变得容易。您可以通过向 `state` 和 `on[State]Change` 表格选项传递自己的状态和状态管理函数来实现这一点。

#### 单独受控状态

您可以仅控制您需要轻松访问的状态。如果不需要，您不必控制所有表格状态。建议根据具体情况仅控制您需要的状态。

为了控制特定状态，您需要同时将相应的 `state` 值和 `on[State]Change` 函数传递给表格实例。

让我们以“手动”服务器端数据获取场景中的过滤、排序和分页为例。您可以将过滤、排序和分页状态存储在您自己的状态管理中，但如果您的 API 不关心列顺序、列可见性等值，则可以忽略这些状态。

```ts
const columnFilters = ref([]) // 无默认过滤器
const sorting = ref([{
  id: 'age',
  desc: true, // 默认按年龄降序排序
}])
const pagination = ref({ pageIndex: 0, pageSize: 15 }

// 使用我们的受控状态值获取数据
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useVueTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    }
  },
  onColumnFiltersChange: updater => {
    columnFilters.value =
      updater instanceof Function
        ? updater(columnFilters.value)
        : updater
  },
  onSortingChange: updater => {
    sorting.value =
      updater instanceof Function
        ? updater(sorting.value)
        : updater
  },
  onPaginationChange: updater => {
    pagination.value =
      updater instanceof Function
        ? updater(pagination.value)
        : updater
  },
})
//...
```

#### 完全受控状态

或者，您可以使用 `onStateChange` 表格选项控制整个表格状态。这将把整个表格状态提升到您自己的状态管理系统中。使用此方法时要小心，因为您可能会发现将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升到 react 树中可能会导致性能问题。

可能需要一些额外的技巧来实现这一点。如果您使用 `onStateChange` 表格选项，`state` 的初始值必须填充您想要使用的所有相关状态值。您可以手动输入所有初始状态值，或者以如下所示的方式使用 `table.setOptions` API。

```jsx
// 使用默认状态值创建表格实例
const table = useVueTable({
  get columns() {
    return columns.value
  },
  data,
  //... 注意：尚未传递 `state` 值
})

const state = ref({
  ...table.initialState,
  pagination: {
    pageIndex: 0,
    pageSize: 15
  }
})
const setState = updater => {
  state.value = updater instanceof Function ? updater(state.value) : updater
}

// 使用 table.setOptions API 将我们的完全受控状态合并到表格实例中
table.setOptions(prev => ({
  ...prev, // 保留我们上面设置的任何其他选项
  get state() {
    return state.value
  },
  onStateChange: setState // 任何状态更改都将推送到我们自己的状态管理
}))
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项将表格状态更改“提升”到我们自己的状态管理中。然而，使用这些选项时有一些需要注意的事项。

#### 1. **状态变更回调必须在 `state` 选项中有相应的状态值**。

指定 `on[State]Change` 回调会告诉表格实例这将是一个受控状态。如果未指定相应的 `state` 值，该状态将“冻结”为其初始值。

```jsx
const sorting = ref([])
const setSorting = updater => {
  sorting.value = updater instanceof Function ? updater(sorting.value) : updater
}
//...
const table = useVueTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting // 必需，因为我们正在使用 `onSortingChange`
    },
  },
  onSortingChange: setSorting, // 使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新的状态值，也可以是接收先前状态值并返回新状态值的回调函数。

这意味着什么？这意味着如果您想在任何一个 `on[State]Change` 回调中添加一些额外的逻辑，您可以这样做，但需要检查新的传入更新器值是函数还是值。

这就是为什么我们在上面的 `setState` 函数中有 `updater instanceof Function` 检查。此检查允许我们在同一个函数中处理原始值和回调函数。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，您可以导入并使用。这对于确保您为控制的状态值使用正确的数据结构和属性非常有用。

```tsx
import { useVueTable, type SortingState } from '@tanstack/vue-table'
//...
const sorting = ref<SortingState[]>([
  {
    id: 'age', // 您应该会获得 `id` 和 `desc` 属性的自动完成
    desc: true,
  }
])
```
