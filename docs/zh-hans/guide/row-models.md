---
source-updated-at: '2024-04-24T03:41:47.000Z'
translation-updated-at: '2025-05-02T17:02:04.700Z'
title: 行模型
---
## 行模型指南

如果查看 TanStack Table 最基础的示例，你会看到类似这样的代码片段：

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //行模型
  })
}
```

这个 `getCoreRowModel` 函数是什么？为什么必须从 TanStack Table 导入它，然后又直接传回给它本身？

答案是：TanStack Table 是一个模块化的库。并非所有功能的代码都默认包含在 createTable 函数/钩子中。你只需要导入并包含那些基于所需功能来正确生成行的代码。

### 什么是行模型？

行模型在 TanStack Table 内部运行，以有用的方式转换原始数据，这些转换是数据网格功能（如筛选、排序、分组、展开和分页）所必需的。最终生成并渲染在屏幕上的行，并不一定与你传给表格的原始数据是 1:1 对应的关系。它们可能经过排序、筛选、分页等处理。

### 导入行模型

你只需导入需要的行模型。以下是所有可用的行模型：

```ts
//仅导入需要的行模型
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 自定义/派生行模型

你不必使用 TanStack Table 提供的标准行模型。如果需要对某些行模型进行高级定制，可以复制想要定制的行模型的[源代码](https://github.com/TanStack/table/tree/main/packages/table-core/src/utils)，然后根据需求修改它。

### 使用行模型

创建表格实例后，你可以直接从该实例访问所有可能需要行模型。除了已导入的行模型外，还有更多派生行模型可用。

对于常规的渲染用例，你可能只需要使用 `table.getRowModel()` 方法，因为这个行模型会根据启用或禁用的功能来使用所有/任何其他行模型。所有其他行模型都可供你“深入”查看表格中发生的一些底层数据转换。

### 表格实例上可用的行模型

- **`getRowModel`** - 这是渲染表格行标记时应使用的主要行模型。它将使用所有其他行模型来生成最终的行模型，用于渲染表格行。

- `getCoreRowModel` - 返回一个基本的行模型，仅与传入表格的原始数据保持 1:1 映射关系。

- `getFilteredRowModel` - 返回一个考虑了列筛选和全局筛选的行模型。
- `getPreFilteredRowModel` - 返回在应用列筛选和全局筛选之前的行模型。

- `getGroupedRowModel` - 返回一个应用了分组和聚合数据并创建子行的行模型。
- `getPreGroupedRowModel` - 返回在应用分组和聚合之前的行模型。

- `getSortedRowModel` - 返回一个已应用排序的行模型。
- `getPreSortedRowModel` - 返回在应用排序之前的行模型（行保持原始顺序）。

- `getExpandedRowModel` - 返回一个考虑了展开/隐藏子行的行模型。
- `getPreExpandedRowModel` - 返回一个仅包含根级别行且不包含展开子行的行模型。但仍然包含排序。

- `getPaginationRowModel` - 返回一个仅包含基于分页状态应在当前页显示的行模型。
- `getPrePaginationRowModel` - 返回一个未应用分页的行模型（包含所有行）。

- `getSelectedRowModel` - 返回所有选中行的行模型（但仅基于传入表格的数据）。在 getCoreRowModel 之后运行。
- `getPreSelectedRowModel` - 返回在应用行选择之前的行模型（仅返回 getCoreRowModel）。
- `getGroupedSelectedRowModel` - 返回分组后选中行的行模型。在 getSortedRowModel 之后运行，而 getSortedRowModel 在 getGroupedRowModel 之后运行，getGroupedRowModel 又在 getFilteredRowModel 之后运行。
- `getFilteredSelectedRowModel` - 返回在应用列筛选和全局筛选后选中行的行模型。在 getFilteredRowModel 之后运行。

### 行模型的执行顺序

了解 TanStack Table 内部如何处理行，可以帮助你更好地理解底层机制，并有助于调试可能遇到的问题。

在内部，如果相应功能已启用，行模型将按以下顺序应用到数据：

`getCoreRowModel` -> `getFilteredRowModel` -> `getGroupedRowModel` -> `getSortedRowModel` -> `getExpandedRowModel` -> `getPaginationRowModel` -> `getRowModel`

如果任何情况下相应功能被禁用或通过 `"manual*"` 表格选项关闭，则该步骤将改用 `getPre*RowModel`。

如上所示，数据首先被筛选，然后分组，接着排序，再展开，最后作为最终步骤进行分页。

### 行模型的数据结构

每个行模型将以 3 种不同的有用格式提供行数据：

1. `rows` - 行的数组。
2. `flatRows` - 行的数组，但所有子行都被展平到顶层。
3. `rowsById` - 行的对象，其中每行按其 `id` 作为键。这对于通过 `id` 快速查找行非常有用，性能更好。

```ts
console.log(table.getRowModel().rows) // 行的数组
console.log(table.getRowModel().flatRows) // 行的数组，但所有子行被展平到顶层
console.log(table.getRowModel().rowsById['row-id']) // 行的对象，其中每行按其 `id` 作为键
```
