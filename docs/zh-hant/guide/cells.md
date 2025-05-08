---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:42:22.632Z'
title: 儲存格
---
## API

[Cell API](../api/core/cell)

## Cells 指南

本快速指南將討論在 TanStack Table 中獲取及與 `cell` 物件互動的不同方式。

### 從何處獲取 Cells

Cells 來自 [Rows](../guide/rows)。這樣說就夠清楚了吧？

根據您使用的功能，有多種 `row` 實例 API 可用於從行中獲取對應的 cells。最常見的是使用 `row.getAllCells` 或 `row.getVisibleCells` API（如果您使用欄位可見性功能），但也有其他類似的 API 可供使用。

### Cell 物件

每個 cell 物件都可以與 UI 中的 `<td>` 或類似單元格元素關聯。`cell` 物件上有幾個屬性和方法，可用於與表格狀態互動，並根據表格狀態提取單元格值。

#### Cell IDs

每個 cell 物件都有一個 `id` 屬性，使其在表格實例中唯一。每個 `cell.id` 的結構簡單地是其父行和欄位 ID 的組合，並以下底線分隔。

```js
{ id: `${row.id}_${column.id}` }
```

在分組或聚合功能期間，`cell.id` 會附加額外的字串。

#### Cell 父物件

每個 cell 都儲存了對其父 [row](../guide/rows) 和 [column](../guide/columns) 物件的引用。

#### 存取 Cell 值

從 cell 存取資料值的推薦方式是使用 `cell.getValue` 或 `cell.renderValue` API。使用這些 API 會快取存取函數的結果，保持渲染效率。兩者唯一的區別是，`cell.renderValue` 會返回值或 `renderFallbackValue`（如果值為 undefined），而 `cell.getValue` 會返回值或 `undefined`（如果值為 undefined）。

> 注意：`cell.getValue` 和 `cell.renderValue` API 分別是 `row.getValue` 和 `row.renderValue` API 的快捷方式。

```js
// 從任何欄位存取資料
const firstName = cell.getValue('firstName') // 從 firstName 欄位讀取 cell 值
const renderedLastName = cell.renderValue('lastName') // 渲染 lastName 欄位的值
```

#### 從任何 Cell 存取其他行資料

由於每個 cell 物件都與其父行關聯，您可以使用 `cell.row.original` 存取表格中使用的原始行的任何資料。

```js
// 即使我們處於不同 cell 的作用域中，仍可存取原始行資料
const firstName = cell.row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 更多 Cell API

根據您為表格使用的功能，還有數十個其他有用的 API 可與 cells 互動。詳情請參閱各功能的 API 文件或指南。

### Cell 渲染

您可以直接使用 `cell.renderValue` 或 `cell.getValue` API 來渲染表格的 cells。然而，這些 API 僅會輸出原始 cell 值（來自存取函數）。如果您使用 `cell: () => JSX` 欄位定義選項，則需要使用來自適配器的 `flexRender` API 工具。

使用 `flexRender` API 將允許 cell 正確渲染任何額外的標記或 JSX，並以正確的參數呼叫回調函數。

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
