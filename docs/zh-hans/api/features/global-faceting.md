---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-02T17:37:01.678Z'
title: 全局分面
id: global-faceting
---
## 表格 API (Table API)

### `getGlobalFacetedRowModel`

```tsx
getGlobalFacetedRowModel: () => RowModel<TData>
```

返回全局筛选器 (global filter) 的分面行模型 (faceted row model)。

### `getGlobalFacetedUniqueValues`

```tsx
getGlobalFacetedUniqueValues: () => Map<any, number>
```

返回全局筛选器 (global filter) 的分面唯一值 (faceted unique values)。

### `getGlobalFacetedMinMaxValues`

```tsx
getGlobalFacetedMinMaxValues: () => [number, number]
```

返回全局筛选器 (global filter) 的分面最小值和最大值 (faceted min and max values)。
