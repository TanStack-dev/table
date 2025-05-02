---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:17:31.983Z'
title: 列过滤
---
## 示例

想要直接查看实现方式？请参考以下示例：

- [列过滤](../framework/react/examples/filters)
- [多面过滤](../framework/react/examples/filters-faceted)（自动补全和范围过滤）
- [模糊搜索](../framework/react/examples/filters-fuzzy)（匹配排序器）
- [可编辑数据](../framework/react/examples/editable-data)
- [展开](../framework/react/examples/expanding)（从子行过滤）
- [分组](../framework/react/examples/grouping)
- [分页](../framework/react/examples/pagination)
- [行选择](../framework/react/examples/row-selection)

## API

[列过滤 API](../api/features/column-filtering)

## 列过滤指南

过滤功能分为两种：列过滤和全局过滤。

本指南将重点介绍列过滤，即应用于单列访问器值的过滤。

TanStack Table 支持客户端过滤和手动服务端过滤。本指南将介绍如何实现和自定义这两种方式，并帮助您决定哪种方式最适合您的使用场景。

### 客户端过滤 vs 服务端过滤

如果您有一个大型数据集，可能不希望将所有数据加载到客户端浏览器中进行过滤。在这种情况下，您很可能需要实现服务端过滤、排序、分页等功能。

然而，正如[分页指南](../guide/pagination#should-you-use-client-side-pagination)中所讨论的，许多开发者低估了可以在客户端加载的行数而不会影响性能。TanStack Table 的示例通常测试可以处理多达 100,000 行或更多数据，并在客户端过滤、排序、分页和分组方面表现良好。这并不一定意味着您的应用程序能够处理这么多行，但如果您的表格最多只有几千行，您或许可以利用 TanStack Table 提供的客户端过滤、排序、分页和分组功能。

> TanStack Table 可以以良好的性能处理数千行的客户端数据。在未经思考前，不要排除客户端过滤、分页、排序等功能。

每个使用场景都不同，取决于表格的复杂性、列的数量、每条数据的大小等。需要注意的主要瓶颈是：

1. 您的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的总大小是多少？（如果列不多，可能不会像您想象的那么糟糕。）
3. 如果一次性加载所有数据，客户端的浏览器是否会占用过多内存？

如果不确定，可以先从客户端过滤和分页开始，随着数据增长再切换到服务端策略。

### 手动服务端过滤

如果您决定需要实现服务端过滤而不是使用内置的客户端过滤，以下是操作方法。

手动服务端过滤不需要 `getFilteredRowModel` 表格选项。相反，传递给表格的 `data` 应该已经过滤好了。但是，如果您已经传递了 `getFilteredRowModel` 表格选项，可以通过将 `manualFiltering` 选项设置为 `true` 来告诉表格跳过它。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getFilteredRowModel: getFilteredRowModel(), // 手动服务端过滤不需要
  manualFiltering: true,
})
```

> **注意：** 使用手动过滤时，本指南中讨论的许多选项将无效。当 `manualFiltering` 设置为 `true` 时，表格实例不会对传递给它的行应用任何过滤逻辑。相反，它会假设行已经过滤，并按原样使用您传递的 `data`。

### 客户端过滤

如果您使用内置的客户端过滤功能，首先需要将 `getFilteredRowModel` 函数传递给表格选项。每当表格需要过滤数据时，都会调用此函数。您可以从 TanStack Table 导入默认的 `getFilteredRowModel` 函数，或创建自己的函数。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客户端过滤需要
})
```

### 列过滤状态

无论您使用客户端还是服务端过滤，都可以利用 TanStack Table 提供的内置列过滤状态管理。有许多表格和列 API 可以用于修改和交互过滤状态以及检索列过滤状态。

列过滤状态定义为以下形状的对象数组：

```ts
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]
```

由于列过滤状态是一个对象数组，您可以同时应用多个列过滤。

#### 访问列过滤状态

您可以使用 `table.getState()` API 从表格实例中访问列过滤状态，就像访问其他表格状态一样。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().columnFilters) // 从表格实例访问列过滤状态
```

但是，如果需要在表格初始化之前访问列过滤状态，可以像下面这样“控制”列过滤状态。

### 受控列过滤状态

如果需要轻松访问列过滤状态，可以使用 `state.columnFilters` 和 `onColumnFiltersChange` 表格选项在自己的状态管理中控制/管理列过滤状态。

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // 可以在此设置初始列过滤状态
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
})
```

#### 初始列过滤状态

如果不需要在自己的状态管理或作用域中控制列过滤状态，但仍希望设置初始列过滤状态，可以使用 `initialState` 表格选项而不是 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // 默认按 'John' 过滤名称列
      },
    ],
  },
})
```

> **注意**：不要同时使用 `initialState.columnFilters` 和 `state.columnFilters`，因为 `state.columnFilters` 中的初始化状态会覆盖 `initialState.columnFilters`。

### 过滤函数 (FilterFns)

每列可以有自己的独特过滤逻辑。您可以选择 TanStack Table 提供的任何过滤函数，或创建自己的函数。

默认情况下，有 10 种内置过滤函数可供选择：

- `includesString` - 不区分大小写的字符串包含
- `includesStringSensitive` - 区分大小写的字符串包含
- `equalsString` - 不区分大小写的字符串相等
- `equalsStringSensitive` - 区分大小写的字符串相等
- `arrIncludes` - 数组中包含项
- `arrIncludesAll` - 数组中包含所有项
- `arrIncludesSome` - 数组中包含某些项
- `equals` - 对象/引用相等 `Object.is`/`===`
- `weakEquals` - 弱对象/引用相等 `==`
- `inNumberRange` - 数字范围包含

您还可以通过 `filterFn` 列选项或 `filterFns` 表格选项定义自己的自定义过滤函数。

#### 自定义过滤函数

> **注意**：这些过滤函数仅在客户端过滤期间运行。

在 `filterFn` 列选项或 `filterFns` 表格选项中定义自定义过滤函数时，应具有以下签名：

```ts
const myCustomFilterFn: FilterFn = (row: Row, columnId: string, filterValue: any, addMeta: (meta: any) => void) => boolean
```

每个过滤函数接收：

- 要过滤的行
- 用于检索行值的列 ID
- 过滤值

并应返回 `true` 如果行应包含在过滤后的行中，返回 `false` 如果应移除。

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    filterFn: 'includesString', // 使用内置过滤函数
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // 使用自定义全局过滤函数
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // 直接使用自定义过滤函数
    filterFn: (row, columnId, filterValue) => {
      return // 根据自定义逻辑返回 true 或 false
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: { // 添加自定义全局过滤函数
    myCustomFilterFn: (row, columnId, filterValue) => { // 在此内联定义
      return // 根据自定义逻辑返回 true 或 false
    },
    startsWith: startsWithFilterFn, // 在其他地方定义
  },
})
```

##### 自定义过滤函数行为

您可以为过滤函数附加一些其他属性以自定义其行为：

- `filterFn.resolveFilterValue` - 此可选“挂载”方法允许过滤函数在传递过滤值之前对其进行转换/清理/格式化。

- `filterFn.autoRemove` - 此可选“挂载”方法传递一个过滤值，并期望返回 `true` 如果应从过滤状态中移除该过滤值。例如，某些布尔风格的过滤可能希望在过滤值设置为 `false` 时将其从表格状态中移除。

```tsx
const startsWithFilterFn = <TData extends MRT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string, //resolveFilterValue 会将其转换为字符串
) =>
  row
    .getValue<number | string>(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // 在 `resolveFilterValue` 中对过滤值进行 toString、toLowerCase 和 trim 操作

// 如果过滤值为假值（在此例中为空字符串），则从过滤状态中移除
startsWithFilterFn.autoRemove = (val: any) => !val; 

// 在传递过滤值之前对其进行转换/清理/格式化
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim(); 
```

### 自定义列过滤

有许多表格和列选项可用于进一步自定义列过滤行为。

#### 禁用列过滤

默认情况下，所有列都启用了列过滤。您可以使用 `enableColumnFilters` 表格选项或 `enableColumnFilter` 列选项禁用所有列或特定列的列过滤。您还可以通过将 `enableFilters` 表格选项设置为 `false` 来关闭列过滤和全局过滤。

禁用列的列过滤将导致 `column.getCanFilter` API 对该列返回 `false`。

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableColumnFilter: false, // 禁用此列的列过滤
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableColumnFilters: false, // 禁用所有列的列过滤
})
```

#### 过滤子行（展开）

在使用展开、分组和聚合等功能时，还有一些额外的表格选项可以自定义列过滤行为。

##### 从叶子行过滤

默认情况下，过滤是从父行向下进行的，因此如果父行被过滤掉，其所有子行也会被过滤掉。根据您的使用场景，如果您只希望用户搜索顶级行而不搜索子行，这可能是期望的行为。这也是性能最高的选项。

但是，如果您希望允许子行被过滤和搜索，无论父行是否被过滤掉，可以将 `filterFromLeafRows` 表格选项设置为 `true`。将此选项设置为 `true` 将导致过滤从叶子行向上进行，这意味着只要子行或孙行中的一个被包含，父行也会被包含。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 过滤和搜索子行
})
```

##### 最大叶子行过滤深度

默认情况下，过滤应用于树中的所有行，无论它们是根级父行还是父行的子叶子行。将 `maxLeafRowFilterDepth` 表格选项设置为 `0` 将导致过滤仅应用于根级父行，所有子行保持未过滤状态。类似地，将此选项设置为 `1` 将导致过滤仅应用于深度为 1 的子叶子行，依此类推。

如果希望在父行通过过滤时保留父行的子行不被过滤掉，请使用 `maxLeafRowFilterDepth: 0`。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  maxLeafRowFilterDepth: 0, // 仅过滤根级父行
})
```

### 列过滤 API

有许多列和表格 API 可用于与列过滤状态交互并连接到您的 UI 组件。以下是可用 API 及其最常见用例的列表：

- `table.setColumnFilters` - 用新状态覆盖整个列过滤状态。
- `table.resetColumnFilters` - 用于“清除/重置所有过滤”按钮。

- **`column.getFilterValue`** - 用于获取输入的默认初始过滤值，甚至直接为过滤输入提供过滤值。
- **`column.setFilterValue`** - 用于将过滤输入连接到其 `onChange` 或 `onBlur` 处理程序。

- `column.getCanFilter` - 用于禁用/启用过滤输入。
- `column.getIsFiltered` - 用于显示当前正在过滤的列的视觉指示器。
- `column.getFilterIndex` - 用于显示当前过滤应用的顺序。

- `column.getAutoFilterFn` - 内部用于查找列的默认过滤函数（如果未指定）。
- `column.getFilterFn` - 用于显示当前使用的过滤模式或函数。
