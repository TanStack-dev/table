---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:39:56.859Z'
title: 行
---
## API

[Row API](../api/core/row)

## 行 (Rows) 指南

本快速指南將討論在 TanStack Table 中獲取及與行物件 (row objects) 互動的不同方式。

### 獲取行的來源

有多種 `table` 實例 API 可用於從表格實例中檢索行。

#### table.getRow

如果需要透過 `id` 存取特定行，可以使用 `table.getRow` 表格實例 API。

```js
const row = table.getRow(rowId)
```

#### 行模型 (Row Models)

`table` 實例會生成 `row` 物件並將其儲存在稱為 ["行模型 (Row Models)"](../guide/row-models) 的實用陣列中。這在 [行模型指南](../guide/row-models) 中有更詳細的討論，以下是存取行模型最常見的方式。

##### 渲染行 (Render Rows)

```jsx
<tbody>
  {table.getRowModel().rows.map(row => (
    <tr key={row.id}>
     {/* ... */}
    </tr>
  ))}
</tbody>
```

##### 獲取選中的行 (Get Selected Rows)

```js
const selectedRows = table.getSelectedRowModel().rows
```

### 行物件 (Row Objects)

每個行物件都包含行資料和許多 API，這些 API 可用於與表格狀態互動或根據表格狀態從行中提取儲存格 (cells)。

#### 行 ID (Row IDs)

每個行物件都有一個 `id` 屬性，使其在表格實例中唯一。預設情況下 `row.id` 與行模型中建立的 `row.index` 相同。然而，用行資料中的唯一識別碼覆蓋每行的 `id` 會很有用。可以使用 `getRowId` 表格選項來實現這一點。

```js
const table = useReactTable({
  columns,
  data,
  getRowId: originalRow => originalRow.uuid, // 使用原始行資料中的 uuid 覆蓋 row.id
})
```

> 注意：在某些功能如分組 (grouping) 和展開 (expanding) 中，`row.id` 會附加額外的字串。

#### 存取行值 (Access Row Values)

存取行中資料值的推薦方式是使用 `row.getValue` 或 `row.renderValue` API。使用這些 API 會快取存取器函數 (accessor functions) 的結果，保持渲染效率。兩者唯一的區別在於，`row.renderValue` 會返回值或 `renderFallbackValue`（如果值為 undefined），而 `row.getValue` 會返回值或 `undefined`（如果值為 undefined）。

```js
// 從任何欄位存取資料
const firstName = row.getValue('firstName') // 從 firstName 欄位讀取行值
const renderedLastName = row.renderValue('lastName') // 渲染 lastName 欄位的值
```

> 注意：`cell.getValue` 和 `cell.renderValue` 分別是 `row.getValue` 和 `row.renderValue` API 的快捷方式。

#### 存取原始行資料 (Access Original Row Data)

對於每個行物件，可以透過 `row.original` 屬性存取傳遞給表格實例的原始對應 `data`。`row.original` 中的任何資料都不會被欄位定義中的存取器修改，因此如果在存取器中進行了任何資料轉換，這些轉換不會反映在 `row.original` 物件中。

```js
// 存取原始行中的任何資料
const firstName = row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 子行 (Sub Rows)

如果使用分組或展開功能，行可能包含子行或父行參考。這在 [展開指南](../guide/expanding) 中有更詳細的討論，以下是處理子行的有用屬性和方法的快速概述。

- `row.subRows`: 行的子行陣列。
- `row.depth`: 行相對於根行陣列的深度（如果嵌套或分組）。根級行為 0，子行為 1，孫行為 2，依此類推。
- `row.parentId`: 行的父行的唯一 ID（包含此行的父行的 subRows 陣列）。
- `row.getParentRow`: 返回行的父行（如果存在）。

### 更多行 API (More Row APIs)

根據表格使用的功能，還有數十個用於與行互動的有用 API。詳情請參閱各功能的相應 API 文件或指南。
