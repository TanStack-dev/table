---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:22:08.105Z'
title: 展开
---
## 示例

想直接查看实现方式？请参考以下示例：

- [展开功能](../framework/react/examples/expanding)
- [分组功能](../framework/react/examples/grouping)
- [子组件](../framework/react/examples/sub-components)

## API

[展开功能 API](../api/features/expanding)

## 展开功能指南

展开功能允许显示或隐藏与特定行相关的额外数据行。这在处理层级数据时非常有用，可以让用户从高层级向下钻取数据，或者用于展示与某行相关的附加信息。

### 展开功能的不同应用场景

TanStack Table 的展开功能有以下几种常见应用场景：

1. 展开子行（子数据行、聚合行等）
2. 展开自定义 UI（详情面板、子表格等）

### 启用客户端展开功能

要使用客户端展开功能，需要在表格选项中定义 `getExpandedRowModel` 函数，该函数负责返回展开的行模型。

```ts
const table = useReactTable({
  // 其他选项...
  getExpandedRowModel: getExpandedRowModel(),
})
```

展开的数据可以包含表格行或任何你想显示的其他数据。本指南将讨论如何处理这两种情况。

### 使用表格行作为展开数据

展开行本质上是继承父行相同列结构的子行。如果数据对象已包含这些展开行数据，可以使用 `getSubRows` 函数指定这些子行。如果数据对象不包含展开行数据，则可以将它们视为自定义展开数据（下一节讨论）。

例如，如果有如下数据对象：

```ts
type Person = {
  id: number
  name: string
  age: number
  children?: Person[] | undefined
}

const data: Person[] =  [
  { id: 1, 
  name: 'John', 
  age: 30, 
  children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 }
    ] 
  },
  { id: 3,
   name: 'Doe', 
   age: 40, 
    children: [
      { id: 4, name: 'Alice', age: 10 }
    ] 
  },
]
```

然后可以使用 `getSubRows` 函数将每行的 `children` 数组作为展开行返回。表格实例现在会知道在哪里查找每行的子行。

```ts
const table = useReactTable({
  // 其他选项...
  getSubRows: (row) => row.children, // 将 children 数组作为子行返回
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

> **注意：** 你可以编写复杂的 `getSubRows` 函数，但请注意该函数会对每行及其子行运行。如果函数未优化可能会影响性能。不支持异步函数。

### 自定义展开 UI

有时你可能希望显示额外的细节或信息，这些内容可能不属于表格数据对象，比如行的展开数据。这类展开行 UI 有过多种名称，如"可展开行"、"详情面板"、"子组件"等。

默认情况下，`row.getCanExpand()` 行实例 API 会返回 false，除非在行上找到 `subRows`。可以通过在表格实例选项中实现自己的 `getRowCanExpand` 函数来覆盖此行为。

```ts
//...
const table = useReactTable({
  // 其他选项...
  getRowCanExpand: (row) => true, // 添加逻辑判断行是否可展开。true 表示所有行都包含展开数据
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
     {/* 正常行 UI */}
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {/* 如果行已展开，将展开的 UI 渲染为单独的行，其单元格跨整个表格宽度 */}
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // 如果展开数据不是与父行共享相同列的行，则指定要跨越的列数
            // 在此放置自定义 UI
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### 展开行状态

如果需要控制表格中行的展开状态，可以使用 `expanded` 状态和 `onExpandedChange` 选项。这允许你根据需要管理展开状态。

```ts
const [expanded, setExpanded] = useState<ExpandedState>({})

const table = useReactTable({
  // 其他选项...
  state: {
    expanded: expanded, // 必须将展开状态传回表格
  },
  onExpandedChange: setExpanded
})
```

`ExpandedState` 类型定义如下：

```ts
type ExpandedState = true | Record<string, boolean>
```

如果 `ExpandedState` 为 true，表示所有行都已展开。如果是记录类型，则只有 ID 作为记录键且值为 true 的行才会展开。例如，如果展开状态为 { row1: true, row2: false }，表示 ID 为 row1 的行已展开，而 ID 为 row2 的行未展开。表格使用此状态确定哪些行已展开并应显示其子行（如果有）。

### 展开行的 UI 切换处理程序

TanStack Table 不会为展开数据添加切换处理程序 UI 到你的表格中。你应手动在每个行的 UI 中添加它，以允许用户展开和折叠行。例如，可以在列定义中添加按钮 UI。

```ts
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    header: 'Children',
    cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
    },
  },
]
```

### 过滤展开行

默认情况下，过滤过程从父行开始向下移动。这意味着如果父行被过滤器排除，其所有子行也将被排除。但可以通过使用 `filterFromLeafRows` 选项改变此行为。启用此选项后，过滤过程从叶子（子）行开始向上移动。这确保只要至少一个子行或孙行满足过滤条件，父行就会包含在过滤结果中。此外，可以使用 `maxLeafRowFilterDepth` 选项控制过滤器在子层级中的深度。此选项允许指定过滤器应考虑的子行最大深度。

```ts
//...
const table = useReactTable({
  // 其他选项...
  getSubRows: row => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 搜索展开的行
  maxLeafRowFilterDepth: 1, // 限制被搜索的展开行深度
})
```

### 分页展开行

默认情况下，展开行与表格其余部分一起分页（这意味着展开行可能跨越多个页面）。如果想禁用此行为（这意味着展开行将始终在其父页面上渲染，也意味着会渲染比设置页面大小更多的行），可以使用 `paginateExpandedRows` 选项。

```ts
const table = useReactTable({
  // 其他选项...
  paginateExpandedRows: false,
})
```

### 固定展开行

固定展开行与固定常规行的方式相同。可以将展开行固定到表格顶部或底部。有关行固定的更多信息，请参考[固定指南](./pinning.md)。

### 排序展开行

默认情况下，展开行与表格其余部分一起排序。

### 手动展开（服务端）

如果进行服务端展开，可以通过将 `manualExpanding` 选项设置为 true 来启用手动行展开。这意味着 `getExpandedRowModel` 不会用于展开行，你需要在数据模型中自行执行展开操作。

```ts
const table = useReactTable({
  // 其他选项...
  manualExpanding: true,
})
```
