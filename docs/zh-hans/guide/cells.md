---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:03:10.945Z'
title: 单元格
---
## API

[Cell API](../api/core/cell)

## Cells 指南

本快速指南将讨论在 TanStack Table 中获取和交互 `cell` 对象的不同方式。

### 从哪里获取 Cells

Cells 来源于 [Rows](../guide/rows)。简单明了，对吧？

根据你使用的功能，可以通过多种 `row` 实例 API 从行中获取对应的 cells。最常见的是使用 `row.getAllCells` 或 `row.getVisibleCells` API（如果你使用了列可见性功能），但还有其他类似的 API 可供使用。

### Cell 对象

每个 cell 对象可以与 UI 中的 `<td>` 或类似单元格元素关联。`cell` 对象上有一些属性和方法，可用于与表格状态交互，并根据表格状态提取单元格值。

#### Cell ID

每个 cell 对象都有一个 `id` 属性，使其在表格实例中唯一。每个 `cell.id` 的构造方式是其父行和列 ID 以下划线连接。

```js
{ id: `${row.id}_${column.id}` }
```

在分组或聚合功能中，`cell.id` 会附加额外的字符串。

#### Cell 父对象

每个 cell 存储了对其父 [row](../guide/rows) 和 [column](../guide/columns) 对象的引用。

#### 访问 Cell 值

推荐使用 `cell.getValue` 或 `cell.renderValue` API 访问 cell 的数据值。这两个 API 都会缓存访问器函数的结果，保持渲染高效。唯一的区别是，`cell.renderValue` 会返回值或 `renderFallbackValue`（如果值为 undefined），而 `cell.getValue` 会返回值或 `undefined`（如果值为 undefined）。

> 注意：`cell.getValue` 和 `cell.renderValue` API 分别是 `row.getValue` 和 `row.renderValue` API 的快捷方式。

```js
// 从任意列访问数据
const firstName = cell.getValue('firstName') // 从 firstName 列读取 cell 值
const renderedLastName = cell.renderValue('lastName') // 渲染 lastName 列的值
```

#### 从任意 Cell 访问其他行数据

由于每个 cell 对象都关联其父行，因此可以通过 `cell.row.original` 访问表格中使用的原始行数据。

```js
// 即使在不同 cell 的作用域中，仍可访问原始行数据
const firstName = cell.row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 更多 Cell API

根据表格使用的功能，还有数十个其他有用的 API 可用于与 cells 交互。更多信息请参阅各功能的 API 文档或指南。

### Cell 渲染

你可以直接使用 `cell.renderValue` 或 `cell.getValue` API 渲染表格的 cells。但这些 API 仅输出原始 cell 值（来自访问器函数）。如果使用了 `cell: () => JSX` 列定义选项，则需要使用适配器中的 `flexRender` API 工具。

使用 `flexRender` API 可以正确渲染 cell 及其额外的标记或 JSX，并以正确的参数调用回调函数。

```jsx
import { flexRender } from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'fullName',
    cell: ({ cell, row }) => {
      return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    }
    //...
  }
]
//...
<tr>
  {row.getVisibleCells().map(cell => {
    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
  })}
</tr>
```
