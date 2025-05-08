---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-08T23:43:46.639Z'
title: 欄位面向
id: column-faceting
---
## 欄位 API

### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TData>
```

> ⚠️ 需傳入有效的 `getFacetedRowModel` 函式至 `options.facetedRowModel`。預設實作可透過匯出的 `getFacetedRowModel` 函式取得。

回傳已套用其他欄位篩選條件 (排除自身篩選) 的列模型 (row model)。適用於顯示分面結果計數。

### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ 需傳入有效的 `getFacetedUniqueValues` 函式至 `options.getFacetedUniqueValues`。預設實作可透過匯出的 `getFacetedUniqueValues` 函式取得。

此函式會**計算並回傳**從 `column.getFacetedRowModel` 衍生的唯一值及其出現次數的 `Map`。適用於顯示分面結果值。

### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ 需傳入有效的 `getFacetedMinMaxValues` 函式至 `options.getFacetedMinMaxValues`。預設實作可透過匯出的 `getFacetedMinMaxValues` 函式取得。

此函式會**計算並回傳**從 `column.getFacetedRowModel` 衍生的最小/最大值元組。適用於顯示分面結果值。

## 表格選項

### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TData>
```

回傳指定 columnId 的分面列模型 (faceted row model)。
