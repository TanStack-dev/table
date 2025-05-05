---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-05T19:28:44.701Z'
title: グローバルファセット
id: global-faceting
---
## テーブルAPI (Table API)

### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TData>
```

グローバルフィルター (global filter) 用のファセットされた行モデル (faceted row model) を返します。

### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

グローバルフィルター (global filter) 用のファセットされた一意の値 (faceted unique values) を返します。

### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

グローバルフィルター (global filter) 用のファセットされた最小値と最大値 (faceted min and max values) を返します。
