---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:44:06.276Z'
title: 行
---
這些是適用於所有列 (row) 的**核心**選項與 API 屬性。更多選項與 API 屬性可參閱其他[表格功能](../guide/features)。

## 列 (Row) API

所有列物件皆具備以下屬性：

### `id`

```tsx
id: string
```
透過 `options.getRowId` 選項解析出的唯一識別符。預設為列的索引（若為子列則為相對索引）。

### `depth`

```tsx
depth: number
```
列相對於根列陣列的嵌套深度（若為嵌套或分組列）。

### `index`

```tsx
index: number
```
列在其父陣列（或根資料陣列）中的索引位置。

### `original`

```tsx
original: TData
```
提供給表格的原始列物件。

> 🧠 若列為分組列，原始列物件將是該分組中的第一個原始物件。

### `parentId`

```tsx
parentId?: string
```
若為嵌套列，此為其父列的 id。

### `getValue`

```tsx
getValue: (columnId: string) => TValue
```
根據指定的 columnId 回傳列中對應的值。

### `renderValue`

```tsx
renderValue: (columnId: string) => TValue
```
渲染列中指定 columnId 的值，若找不到值則回傳 `renderFallbackValue`。

### `getUniqueValues`

```tsx
getUniqueValues: (columnId: string) => TValue[]
```
回傳列中指定 columnId 的唯一值陣列。

### `subRows`

```tsx
type subRows = Row<TData>[]
```
由 `options.getSubRows` 選項回傳並建立的子列陣列。

### `getParentRow`

```tsx
type getParentRow = () => Row<TData> | undefined
```
回傳此列的父列（若存在）。

### `getParentRows`

```tsx
type getParentRows = () => Row<TData>[]
```
回傳此列的所有父列，直至根列。

### `getLeafRows`

```tsx
type getLeafRows = () => Row<TData>[]
```
回傳此列的所有葉子列（不包含任何父列）。

### `originalSubRows`

```tsx
originalSubRows?: TData[]
```
由 `options.getSubRows` 選項回傳的原始子列陣列。

### `getAllCells`

```tsx
type getAllCells = () => Cell<TData>[]
```
回傳此列的所有[儲存格 (Cell)](../api/core/cell)。
