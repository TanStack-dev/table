---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:51.424Z'
title: カラムファセット
---
## 例

実装に直接進みたいですか？以下の例を確認してください：

- [filters-faceted](../framework/react/examples/filters-faceted)

## API

[Column Faceting API](../api/features/column-faceting)

## カラムファセットガイド

カラムファセット (Column Faceting) は、特定のカラムのデータからそのカラムの値のリストを生成できる機能です。例えば、カラム内のすべての行から一意の値のリストを生成し、オートコンプリートフィルターコンポーネントの検索候補として使用できます。または、数値のカラムから最小値と最大値のタプルを生成し、レンジスライダーフィルターコンポーネントの範囲として使用できます。

### カラムファセットの行モデル

カラムファセット機能を使用するには、テーブルオプションに適切な行モデルを含める必要があります。

```ts
//必要な行モデルのみをインポート
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //getFacetedRowModelに依存
  getFacetedUniqueValues, //getFacetedRowModelに依存
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //カラムの値リストが必要な場合（他のファセット行モデルはこれに依存）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //最小/最大値が必要な場合
  getFacetedUniqueValues: getFacetedUniqueValues(), //一意の値リストが必要な場合
  //...
})
```

まず、`getFacetedRowModel` 行モデルを含める必要があります。この行モデルは、指定されたカラムの値リストを生成します。一意の値リストが必要な場合は、`getFacetedUniqueValues` 行モデルを含めてください。最小値と最大値のタプルが必要な場合は、`getFacetedMinMaxValues` 行モデルを含めてください。

### ファセット行モデルの使用

テーブルオプションに適切な行モデルを含めたら、ファセットカラムインスタンスAPIを使用して、ファセット行モデルによって生成された値リストにアクセスできます。

```ts
// オートコンプリートフィルター用の一意の値リスト
const autoCompleteSuggestions = 
 Array.from(column.getFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// レンジフィルター用の最小値と最大値のタプル
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1];
```

### カスタム（サーバーサイド）ファセット

組み込みのクライアントサイドファセット機能の代わりに、サーバーサイドで独自のファセットロジックを実装し、ファセットされた値をクライアントサイドに渡すことができます。`getFacetedUniqueValues` および `getFacetedMinMaxValues` テーブルオプションを使用して、サーバーサイドからファセットされた値を解決できます。

```ts
const facetingQuery = useQuery(
  //...
)

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: (table, columnId) => {
    const uniqueValueMap = new Map<string, number>();
    //...
    return uniqueValueMap;
  },
  getFacetedMinMaxValues: (table, columnId) => {
    //...
    return [min, max];
  },
  //...
})
```

あるいは、ファセットロジックをTanStack Table APIを通じて一切処理する必要はありません。単にリストを取得し、直接フィルターコンポーネントに渡すこともできます。
