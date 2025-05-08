---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:44:35.771Z'
title: 標題
---
以下是 Header APIs 的繁體中文翻譯：

這些是適用於所有標頭的**核心**選項與 API 屬性。更多選項與 API 屬性可能在其他[表格功能](../guide/features)中提供。

## 標頭 API

所有標頭物件皆具備以下屬性：

### `id`

```tsx
id: string
```

標頭的唯一識別碼。

### `index`

```tsx
index: number
```

標頭在所屬標頭群組中的索引位置。

### `depth`

```tsx
depth: number
```

標頭的層級深度，以零為基底索引。

### `column`

```tsx
column: Column<TData>
```

標頭關聯的[欄位 (Column)](../api/core/column)物件

### `headerGroup`

```tsx
headerGroup: HeaderGroup<TData>
```

標頭關聯的[標頭群組 (HeaderGroup)](../api/core/header-group)物件

### `subHeaders`

```tsx
type subHeaders = Header<TData>[]
```

標頭的階層式子標頭/子節點。若標頭關聯的欄位為葉節點欄位 (leaf-column)，此值將為空陣列。

### `colSpan`

```tsx
colSpan: number
```

標頭的欄位合併跨度 (col-span)。

### `rowSpan`

```tsx
rowSpan: number
```

標頭的列合併跨度 (row-span)。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

回傳此標頭下所有階層式嵌套的葉節點標頭。

### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

標示此標頭是否為佔位標頭的布林值

### `placeholderId`

```tsx
placeholderId?: string
```

若標頭為佔位標頭，此值將為一個不會與表格中其他標頭衝突的唯一標頭 ID

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}
```

回傳用於標頭、頁尾和篩選器等欄位基礎元件的渲染上下文 (或屬性)。將這些屬性與您框架的 `flexRender` 工具函式搭配使用，即可依選擇的模板進行渲染：

```tsx
flexRender(header.column.columnDef.header, header.getContext())
```

## 表格 API

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

回傳表格的所有標頭群組。

### `getLeftHeaderGroups`

```tsx
type getLeftHeaderGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位 (pinning)，回傳左側固定欄位的標頭群組。

### `getCenterHeaderGroups`

```tsx
type getCenterHeaderGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位，回傳未固定欄位的標頭群組。

### `getRightHeaderGroups`

```tsx
type getRightHeaderGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位，回傳右側固定欄位的標頭群組。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

回傳表格的所有頁尾群組。

### `getLeftFooterGroups`

```tsx
type getLeftFooterGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位，回傳左側固定欄位的頁尾群組。

### `getCenterFooterGroups`

```tsx
type getCenterFooterGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位，回傳未固定欄位的頁尾群組。

### `getRightFooterGroups`

```tsx
type getRightFooterGroups = () => HeaderGroup<TData>[]
```

若啟用固定欄位，回傳右側固定欄位的頁尾群組。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData, unknown>[]
```

回傳表格中所有欄位的標頭，包含父標頭。

### `getLeftFlatHeaders`

```tsx
type getLeftFlatHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳表格中所有左側固定欄位的標頭，包含父標頭。

### `getCenterFlatHeaders`

```tsx
type getCenterFlatHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳所有未固定欄位的標頭，包含父標頭。

### `getRightFlatHeaders`

```tsx
type getRightFlatHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳表格中所有右側固定欄位的標頭，包含父標頭。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData, unknown>[]
```

回傳表格中所有葉節點欄位的標頭（不包含父標頭）。

### `getLeftLeafHeaders`

```tsx
type getLeftLeafHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳表格中所有左側固定葉節點欄位的標頭（不包含父標頭）。

### `getCenterLeafHeaders`

```tsx
type getCenterLeafHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳所有未固定欄位的標頭（不包含父標頭）。

### `getRightLeafHeaders`

```tsx
type getRightLeafHeaders = () => Header<TData, unknown>[]
```

若啟用固定欄位，回傳表格中所有右側固定葉節點欄位的標頭（不包含父標頭）。
