---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:08:52.338Z'
title: 表格状态
---
## 示例

想直接查看实现代码？请参考以下示例：

- [综合示例](../examples/kitchen-sink)
- [完全受控](../examples/fully-controlled)

## 表格状态 (React) 指南

TanStack Table 的核心是 **框架无关 (framework agnostic)** 的，这意味着无论使用哪个框架，其 API 都保持一致。根据所用框架不同，适配器 (Adapters) 可以让表格核心更易使用。可用适配器详见适配器菜单。

### 访问表格状态

无需特殊设置即可使用表格状态功能。如果不向 `state`、`initialState` 或任何 `on[State]Change` 表格选项传入参数，表格将在内部自行管理状态。可通过 `table.getState()` 表格实例 API 访问内部状态。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState()) //访问完整内部状态
console.log(table.getState().rowSelection) //仅访问行选中状态
```

### 自定义初始状态

若只需自定义某些状态的初始默认值，仍无需自行管理状态。只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
const table = useReactTable({
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

> **注意**：每个特定状态只能在 `initialState` 或 `state` 中指定，不能同时存在。若某个状态值同时传入 `initialState` 和 `state`，`state` 中的初始化值将覆盖 `initialState` 中的对应值。

### 受控状态

如需在应用其他区域轻松访问表格状态，TanStack Table 支持将部分或全部表格状态交由外部状态管理系统控制。通过向 `state` 和 `on[State]Change` 表格选项传入自定义状态及管理函数即可实现。

#### 部分受控状态

可以仅控制需要访问的状态，不必全盘接管。建议根据实际需求逐个控制特定状态。

控制特定状态需同时向表格实例传入对应的 `state` 值和 `on[State]Change` 函数。以下以服务端手动获取数据场景中的筛选、排序和分页为例：

```jsx
const [columnFilters, setColumnFilters] = React.useState([]) //无默认筛选
const [sorting, setSorting] = React.useState([{
  id: 'age',
  desc: true, //默认按年龄降序排序
}]) 
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 })

//使用受控状态值获取数据
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useReactTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //将受控状态传回表格（覆盖内部状态）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //将 columnFilters 状态提升至自定义状态管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全受控状态

也可通过 `onStateChange` 表格选项完全控制整个表格状态。此时需注意：将高频变更的状态值（如 `columnSizingInfo`）提升至 React 组件树可能导致性能问题。

实现完全控制需要一些技巧。使用 `onStateChange` 时，`state` 初始值必须包含所有相关状态值。可以手动编写所有初始状态，或如下特殊使用 `table.setOptions` API：

```jsx
//创建带默认状态的表格实例
const table = useReactTable({
  columns,
  data,
  //... 注意：此时未传入 `state` 值
})


const [state, setState] = React.useState({
  ...table.initialState, //用表格实例的默认状态填充初始状态
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可选自定义分页初始状态
  }
})

//使用 table.setOptions API 将完全受控状态合并到表格实例
table.setOptions(prev => ({
  ...prev, //保留之前设置的所有选项
  state, //完全受控状态覆盖内部状态
  onStateChange: setState //状态变更将推送至自定义状态管理
}))
```

### 状态变更回调

前文展示了通过 `on[State]Change` 和 `onStateChange` 将表格状态变更"提升"至自定义状态管理。但使用这些选项时需注意以下几点：

#### 1. **状态变更回调必须对应 `state` 选项中的状态值**

指定 `on[State]Change` 回调即表示该状态将受控。若未指定对应的 `state` 值，该状态将保持初始值不变。

```jsx
const [sorting, setSorting] = React.useState([])
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting, //必须存在，因为我们使用了 `onSortingChange`
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回调函数**

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 的 `setState` 函数完全相同。更新器可以是新状态值，也可以是接收旧状态值并返回新状态值的回调函数。

这意味着可以在 `on[State]Change` 回调中添加额外逻辑，但需判断传入的更新器是函数还是值：

```jsx
const [sorting, setSorting] = React.useState([])
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

const table = useReactTable({
  columns,
  data,
  //...
  state: {
    pagination,
    sorting,
  }
  //语法 1
  onPaginationChange: (updater) => {
    setPagination(old => {
      const newPaginationValue = updater instanceof Function ? updater(old) : updater
      //对新分页值进行操作
      //...
      return newPaginationValue
    })
  },
  //语法 2
  onSortingChange: (updater) => {
    const newSortingValue = updater instanceof Function ? updater(sorting) : updater
    //对新排序值进行操作
    //...
    setSorting(updater) //正常状态更新
  }
})
```

### 状态类型

TanStack Table 中所有复杂状态都有对应的 TypeScript 类型可供导入使用，这有助于确保受控状态值使用正确的数据结构和属性。

```tsx
import { useReactTable, type SortingState } from '@tanstack/react-table'
//...
const [sorting, setSorting] = React.useState<SortingState[]>([
  {
    id: 'age', //可获取 `id` 和 `desc` 属性的自动补全
    desc: true,
  }
])
```
