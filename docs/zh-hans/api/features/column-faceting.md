---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-02T17:34:18.262Z'
title: 列分面
id: column-faceting
---
## 列 API (Column API)

### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TData>
```

> ⚠️ 需要向 `options.facetedRowModel` 传递有效的 `getFacetedRowModel` 函数。默认实现可通过导出的 `getFacetedRowModel` 函数获取。

返回应用了其他所有列筛选器（不包括自身筛选器）的行模型 (row model)。适用于展示分面结果计数。

### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ 需要向 `options.getFacetedUniqueValues` 传递有效的 `getFacetedUniqueValues` 函数。默认实现可通过导出的 `getFacetedUniqueValues` 函数获取。

该函数会**计算并返回**从 `column.getFacetedRowModel` 派生出的唯一值及其出现次数的 `Map`。适用于展示分面结果值。

### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ 需要向 `options.getFacetedMinMaxValues` 传递有效的 `getFacetedMinMaxValues` 函数。默认实现可通过导出的 `getFacetedMinMaxValues` 函数获取。

该函数会**计算并返回**从 `column.getFacetedRowModel` 派生出的最小/最大元组。适用于展示分面结果值。

## 表格选项 (Table Options)

### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TData>
```

返回指定 columnId 的分面行模型 (faceted row model)。
