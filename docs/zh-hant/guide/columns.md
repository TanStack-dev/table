---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:16.794Z'
title: 欄位
---
## API

[欄位 API](../api/core/column)

## 欄位指南

> 注意：本指南討論的是表格實例中實際生成的 `column` 物件，而非設定表格的 [欄位定義](../guide/column-defs)。

本快速指南將討論在 TanStack Table 中獲取及操作 `column` 物件的各種方式。

### 獲取欄位的來源

`column` 物件可在多處取得，它們通常附屬於：

#### 表頭與儲存格物件

在調用 `table` 實例 API 前，請先考慮是否需要取得 [表頭](../guide/headers) 或 [儲存格](../guide/cells) 而非直接取得 `columns`。若需渲染表格標記，通常應使用返回表頭或儲存格的 API 而非欄位物件。欄位物件本身並非直接用於渲染表頭或儲存格，但 `header` 和 `cell` 物件會包含這些 `column` 物件的參照，從而衍生出渲染 UI 所需的資訊。

```js
const column = cell.column; // 從儲存格取得欄位
const column = header.column; // 從表頭取得欄位
```

#### 欄位表格實例 API

表格實例提供數十種 API 用於取得欄位，具體使用哪些 API 取決於表格功能與使用情境。

##### 取得單一欄位

若需透過 ID 取得單一欄位，可使用 `table.getColumn` API。

```js
const column = table.getColumn('firstName');
```

##### 取得多個欄位

最基礎的欄位 API 是 `table.getAllColumns`，它會返回表格中所有欄位的列表。但此 API 搭配其他功能與表格狀態時，還有數十種衍生 API 可用，例如：`table.getAllFlatColumns`、`table.getAllLeafColumns`、`getCenterLeafColumns`、`table.getLeftVisibleLeafColumns` 等，這些 API 常與欄位可見性或固定欄位功能搭配使用。

### 欄位物件

欄位物件並非直接用於渲染表格 UI，因此不會與表格中的 `<th>` 或 `<td>` 元素一一對應，但它們包含許多實用屬性和方法，可用於操作表格狀態。

#### 欄位 ID

每個欄位在對應的 [欄位定義](../guide/column-defs) 中都必須有唯一的 `id`。通常需自行定義此 `id`，或由欄位定義中的 `accessorKey` 或 `header` 屬性衍生而來。

#### ColumnDef

欄位物件始終保留原始 `columnDef` 物件的參照，該物件用於建立此欄位。

#### 巢狀群組欄位屬性

若欄位屬於巢狀或群組結構，以下屬性將特別有用：

- `columns`：屬於群組欄位的子欄位陣列。
- `depth`：欄位群組所屬的表頭群組「列索引」。
- `parent`：欄位的父欄位。若為頂層欄位，此值為 `undefined`。

### 更多欄位 API

數十種欄位 API 可用於操作表格狀態，並根據表格狀態提取儲存格值。詳情請參閱各功能的欄位 API 文件。

### 欄位渲染

不應直接使用 `column` 物件渲染 `headers` 或 `cells`，而應使用上述的 [`header`](../guide/headers) 和 [`cell`](../guide/cells) 物件。

但若需在 UI 其他地方渲染欄位列表（例如欄位可見性選單），可直接遍歷欄位陣列並照常渲染 UI。
