---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:18:32.792Z'
title: 全局过滤
---
## 示例

想直接查看实现方式？请参考以下示例：

- [全局过滤](../framework/react/examples/filters-global)

## API

[全局过滤 API](../api/features/global-filtering)

## 全局过滤指南

过滤功能分为两种：列过滤 (Column Filtering) 和全局过滤 (Global Filtering)。

本指南将重点介绍全局过滤，即应用于所有列的过滤方式。

### 客户端过滤与服务端过滤 (Client-Side vs Server-Side Filtering)

如果您的数据集较大，可能不希望将所有数据加载到客户端浏览器中进行过滤。这种情况下，您很可能需要实现服务端过滤 (Server-Side Filtering)、排序、分页等功能。

然而，正如[分页指南](../guide/pagination#should-you-use-client-side-pagination)中所述，许多开发者低估了客户端能处理的数据量。TanStack Table 的示例经常测试处理多达 100,000 行甚至更多数据，在客户端过滤、排序、分页和分组方面仍能保持良好的性能。这并不意味着您的应用一定能处理这么多数据，但如果表格最多只有几千行数据，您可以充分利用 TanStack Table 提供的客户端过滤、排序、分页和分组功能。

> TanStack Table 可以高效处理数千行的客户端数据。不要未经思考就排除客户端过滤、分页、排序等方案。

每个用例都不同，具体取决于表格的复杂度、列数、数据大小等因素。需要关注的主要瓶颈包括：

1. 您的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的数据总量是多少？（如果列数不多，实际影响可能比您想象的要小。）
3. 如果一次性加载所有数据，客户端浏览器的内存占用会过高吗？

如果不确定，可以先从客户端过滤和分页开始，随着数据增长再切换到服务端策略。

### 手动实现服务端全局过滤 (Manual Server-Side Global Filtering)

如果您决定需要手动实现服务端全局过滤，而非使用内置的客户端全局过滤，方法如下：

手动服务端全局过滤不需要 `getFilteredRowModel` 表格选项。相反，传递给表格的 `data` 应已预先过滤。但如果已设置 `getFilteredRowModel` 选项，可以通过将 `manualFiltering` 设为 `true` 来跳过该逻辑。

```jsx
const table = useReactTable({
  data,
  columns,
  // getFilteredRowModel: getFilteredRowModel(), // 手动服务端全局过滤不需要此选项
  manualFiltering: true,
})
```

注意：使用手动全局过滤时，本指南后续讨论的许多选项将无效。当 `manualFiltering` 设为 `true` 时，表格实例不会对传入的行应用任何全局过滤逻辑，而是直接使用您提供的数据。

### 客户端全局过滤 (Client-Side Global Filtering)

如果使用内置的客户端全局过滤，首先需要在表格选项中传入 `getFilteredRowModel` 函数。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他选项...
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客户端全局过滤需要此选项
})
```

### 全局过滤函数 (Global Filter Function)

`globalFilterFn` 选项允许您指定用于全局过滤的函数。过滤函数可以是内置过滤函数的名称、通过 `tableOptions.filterFns` 提供的自定义过滤函数名称，或直接传入的自定义函数。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'text' // 内置过滤函数
})
```

默认提供 10 种内置过滤函数：

- includesString - 不区分大小写的字符串包含
- includesStringSensitive - 区分大小写的字符串包含
- equalsString - 不区分大小写的字符串相等
- equalsStringSensitive - 区分大小写的字符串相等
- arrIncludes - 数组元素包含
- arrIncludesAll - 包含所有指定数组元素
- arrIncludesSome - 包含部分指定数组元素
- equals - 对象/引用相等 Object.is/===
- weakEquals - 弱对象/引用相等 ==
- inNumberRange - 数值范围包含

您也可以自定义全局过滤函数并通过 `globalFilterFn` 选项传入。

### 全局过滤状态 (Global Filter State)

全局过滤状态存储在表格内部状态中，可通过 `table.getState().globalFilter` 访问。如果需要持久化全局过滤状态，可以使用 `onGlobalFilterChange` 选项提供回调函数。

```jsx
const [globalFilter, setGlobalFilter] = useState<any>([])

const table = useReactTable({
  // 其他选项...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter
})
```

全局过滤状态的类型定义如下：

```jsx
interface GlobalFilter {
  globalFilter: any
}
```

### 添加全局过滤输入 UI

TanStack Table 不会自动添加全局过滤输入 UI。您需要手动添加以允许用户过滤表格。例如，可以在表格上方添加输入框：

```jsx
return (
  <div>
    <input
      value=""
      onChange={e => table.setGlobalFilter(String(e.target.value))}
      placeholder="搜索..."
    />
  </div>
)
```

### 自定义全局过滤函数 (Custom Global Filter Function)

如需使用自定义全局过滤函数，可以定义函数并通过 `globalFilterFn` 选项传入。

> **注意：** 全局过滤常使用模糊过滤函数 (Fuzzy Filtering)，相关讨论见[模糊过滤指南](./fuzzy-filtering.md)。

```jsx
const customFilterFn = (rows, columnId, filterValue) => {
  // 自定义过滤逻辑
}

const table = useReactTable({
  // 其他选项...
  globalFilterFn: customFilterFn
})
```

### 初始全局过滤状态 (Initial Global Filter State)

如需在表格初始化时设置初始全局过滤状态，可以通过 `initialState` 选项传入。但更推荐直接在 `state.globalFilter` 中管理初始状态。

```jsx
const [globalFilter, setGlobalFilter] = useState("搜索词") // 推荐在此初始化全局过滤状态

const table = useReactTable({
  // 其他选项...
  initialState: {
    globalFilter: '搜索词', // 如果不管理 globalFilter 状态，在此设置初始状态
  }
  state: {
    globalFilter, // 将受控的 globalFilter 状态传递给表格
  }
})
```

> 注意：不要同时使用 `initialState.globalFilter` 和 `state.globalFilter`，因为 `state.globalFilter` 会覆盖 `initialState.globalFilter`。

### 禁用全局过滤 (Disable Global Filtering)

默认情况下，所有列都启用全局过滤。可以通过 `enableGlobalFilter` 表格选项禁用所有列的全局过滤，或通过将 `enableFilters` 设为 `false` 同时禁用列过滤和全局过滤。

禁用全局过滤后，`column.getCanGlobalFilter` API 将返回 `false`。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableGlobalFilter: false, // 禁用此列的全局过滤
  },
  //...
]
//...
const table = useReactTable({
  // 其他选项...
  columns,
  enableGlobalFilter: false, // 禁用所有列的全局过滤
})
```
