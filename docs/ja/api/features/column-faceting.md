---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-05T19:28:23.588Z'
title: カラムファセット
id: column-faceting
---
## カラム API (Column API)

### `getFacetedRowModel`

```tsx
type getFacetedRowModel = () => RowModel<TData>
```

> ⚠️ `options.facetedRowModel` に有効な `getFacetedRowModel` 関数を渡す必要があります。デフォルト実装はエクスポートされた `getFacetedRowModel` 関数で提供されます。

自身のフィルターを除く、他のすべてのカラムフィルターが適用された行モデル (Row Model) を返します。ファセットされた結果カウントを表示するのに便利です。

### `getFacetedUniqueValues`

```tsx
getFacetedUniqueValues: () => Map<any, number>
```

> ⚠️ `options.getFacetedUniqueValues` に有効な `getFacetedUniqueValues` 関数を渡す必要があります。デフォルト実装はエクスポートされた `getFacetedUniqueValues` 関数で提供されます。

`column.getFacetedRowModel` から導出されたユニークな値とその出現回数の `Map` を**計算して返す**関数です。ファセットされた結果値を表示するのに便利です。

### `getFacetedMinMaxValues`

```tsx
getFacetedMinMaxValues: () => Map<any, number>
```

> ⚠️ `options.getFacetedMinMaxValues` に有効な `getFacetedMinMaxValues` 関数を渡す必要があります。デフォルト実装はエクスポートされた `getFacetedMinMaxValues` 関数で提供されます。

`column.getFacetedRowModel` から導出された最小値/最大値のタプルを**計算して返す**関数です。ファセットされた結果値を表示するのに便利です。

## テーブルオプション (Table Options)

### `getColumnFacetedRowModel`

```tsx
getColumnFacetedRowModel: (columnId: string) => RowModel<TData>
```

指定された columnId のファセットされた行モデル (Row Model) を返します。
