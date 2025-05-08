---
source-updated-at: '2024-03-22T01:02:38.000Z'
translation-updated-at: '2025-05-08T23:44:15.675Z'
title: 欄位定義
---
欄位定義 (ColumnDef) 是包含以下選項的純物件：

## 選項

### `id`

```tsx
id: string
```

欄位的唯一識別符。

> 🧠 在以下情況下，欄位 ID 是選填的：
>
> - 使用物件鍵存取器 (object key accessor) 建立存取器欄位時
> - 欄位標頭定義為字串時

### `accessorKey`

```tsx
accessorKey?: string & typeof TData
```

從資料列物件中提取欄位值時使用的鍵名。

### `accessorFn`

```tsx
accessorFn?: (originalRow: TData, index: number) => any
```

從每個資料列中提取欄位值時使用的存取器函式。

### `columns`

```tsx
columns?: ColumnDef<TData>[]
```

群組欄位中包含的子欄位定義。

### `header`

```tsx
header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

欄位顯示的標頭內容。若傳入字串，可作為欄位 ID 的預設值。若傳入函式，將會接收標頭的 props 物件，並應返回渲染後的標頭值（具體類型取決於使用的適配器）。

### `footer`

```tsx
footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

欄位顯示的頁尾內容。若傳入函式，將會接收頁尾的 props 物件，並應返回渲染後的頁尾值（具體類型取決於使用的適配器）。

### `cell`

```tsx
cell?:
  | string
  | ((props: {
      table: Table<TData>
      row: Row<TData>
      column: Column<TData>
      cell: Cell<TData>
      getValue: () => any
      renderValue: () => any
    }) => unknown)
```

欄位在每個資料列中顯示的儲存格內容。若傳入函式，將會接收儲存格的 props 物件，並應返回渲染後的儲存格值（具體類型取決於使用的適配器）。

### `meta`

```tsx
meta?: ColumnMeta // 此介面可透過宣告合併 (declaration merging) 擴展。見下方說明！
```

與欄位關聯的中繼資料 (meta data)。當欄位可用時，可透過 `column.columnDef.meta` 在任何地方存取此資料。此類型對所有表格都是全域的，並可透過以下方式擴展：

```tsx
import '@tanstack/react-table' // 或 vue、svelte、solid、qwik 等

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    foo: string
  }
}
```
