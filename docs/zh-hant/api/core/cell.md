---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:44:14.582Z'
title: 儲存格
---
這是適用於所有儲存格 (cell) 的**核心**選項與 API 屬性。更多選項與 API 屬性可參閱其他[表格功能](../guide/features)。

## 儲存格 API (Cell API)

所有儲存格物件皆具備以下屬性：

### `id`

```tsx
id: string
```

此儲存格在整個表格中的唯一識別碼 (ID)。

### `getValue`

```tsx
getValue: () => any
```

透過關聯欄位 (column) 的存取器鍵 (accessor key) 或存取器函式 (accessor function) 取得儲存格的值並回傳。

### `renderValue`

```tsx
renderValue: () => any
```

與 `getValue` 相同會回傳儲存格的值，但若找不到值時會回傳 `renderFallbackValue`。

### `row`

```tsx
row: Row<TData>
```

此儲存格所關聯的列物件 (Row object)。

### `column`

```tsx
column: Column<TData>
```

此儲存格所關聯的欄位物件 (Column object)。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  column: Column<TData, TValue>
  row: Row<TData>
  cell: Cell<TData, TValue>
  getValue: <TTValue = TValue,>() => TTValue
  renderValue: <TTValue = TValue,>() => TTValue | null
}
```

回傳儲存格型元件 (如儲存格與聚合儲存格) 的渲染上下文 (rendering context) 或屬性 (props)。可搭配您框架的 `flexRender` 工具使用這些屬性，並依照選擇的模板進行渲染：

```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
```
