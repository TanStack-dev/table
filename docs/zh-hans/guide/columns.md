---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:04:35.823Z'
title: 列
---
## API

[列 API](../api/core/column)

## 列指南

> 注意：本指南讨论的是表格实例内部生成的实际 `column` 对象，而非如何为表格设置 [列定义](../guide/column-defs)。

本快速指南将介绍在 TanStack Table 中获取和操作 `column` 对象的不同方式。

### 获取列的途径

您可以在多处找到 `column` 对象，它们通常附加于：

#### 表头 (Header) 和单元格 (Cell) 对象

在使用 `table` 实例 API 之前，请考虑是否真的需要获取 `columns`，而不是 [表头](../guide/headers) 或 [单元格](../guide/cells)。如果您正在渲染表格的标记，很可能会需要使用返回表头或单元格的 API，而非列对象本身。列对象并不直接用于渲染表头或单元格，但 `header` 和 `cell` 对象会包含对这些 `column` 对象的引用，从而可以从中派生渲染 UI 所需的信息。

```js
const column = cell.column; // 从单元格获取列
const column = header.column; // 从表头获取列
```

#### 列表格实例 API

有数十种 `table` 实例 API 可用于从表格实例中检索列。具体使用哪些 API 完全取决于表格中使用的功能及您的用例。

##### 获取单个列

如果只需通过 ID 获取单个列，可以使用 `table.getColumn` API。

```js
const column = table.getColumn('firstName');
```

##### 获取多列

最简单的列 API 是 `table.getAllColumns`，它会返回表格中所有列的列表。但还有许多其他列 API 会受到其他功能和表格状态的影响，例如 `table.getAllFlatColumns`、`table.getAllLeafColumns`、`getCenterLeafColumns`、`table.getLeftVisibleLeafColumns` 等，这些 API 可能与列可见性或列固定功能配合使用。

### 列对象

列对象实际上并不直接用于渲染表格 UI，因此它们与表格中的 `<th>` 或 `<td>` 元素并非一一对应。但它们包含许多有用的属性和方法，可用于与表格状态交互。

#### 列 ID

每个列在其关联的 [列定义](../guide/column-defs) 中必须具有唯一的 `id`。通常，您可以自行定义此 `id`，或者它会从列定义中的 `accessorKey` 或 `header` 属性派生。

#### ColumnDef

列对象上始终保留着用于创建该列的原始 `columnDef` 对象的引用。

#### 嵌套分组列属性

如果列是嵌套或分组列结构的一部分，则以下属性会特别有用：

- `columns`：属于分组列的子列数组。
- `depth`：列所属的表头分组“行索引”。
- `parent`：列的父列。如果列是顶级列，则此值为 `undefined`。

### 更多列 API

有数十种列 API 可用于与表格状态交互，并根据表格状态提取单元格值。详细信息请参阅各功能的列 API 文档。

### 列渲染

不要直接使用 `column` 对象来渲染 `headers` 或 `cells`。相反，应使用上述的 [`header`](../guide/headers) 和 [`cell`](../guide/cells) 对象。

但如果您只是在 UI 的其他位置（例如列可见性菜单等）渲染列列表，可以直接遍历列数组并按常规方式渲染 UI。
