---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-08T23:43:03.449Z'
title: 全域面向
id: global-faceting
---
## 表格 API

### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TData>
```

回傳全域過濾器的分面式 (Faceted) 列模型。

### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

回傳全域過濾器的分面式唯一值 (Faceted Unique Values)。

### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

回傳全域過濾器的分面式最小最大值 (Faceted Min/Max Values)。
