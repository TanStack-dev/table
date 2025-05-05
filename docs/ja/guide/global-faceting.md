---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:02.204Z'
title: グローバルファセット
---
## 例

実装に直接進みたいですか？以下の例を確認してください:

- [filters-faceted](../framework/react/examples/filters)

## API

[グローバルファセットAPI](../api/features/global-faceting)

## グローバルファセットガイド

グローバルファセットを使用すると、テーブルのデータからすべての列の値リストを生成できます。例えば、テーブル内のすべての行と列からユニークな値のリストを生成し、オートコンプリートフィルターコンポーネントの検索候補として使用できます。または、数値テーブルから最小値と最大値のタプルを生成し、レンジスライダーフィルターコンポーネントの範囲として使用できます。

### グローバルファセット行モデル

グローバルファセット機能を使用するには、テーブルオプションに適切な行モデルを含める必要があります。

```ts
//必要な行モデルのみインポート
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //getFacetedRowModelに依存
  getFacetedUniqueValues, //getFacetedRowModelに依存
} from '@tanstack/react-table'
//...
const table = useReactTable({
  // その他のオプション...
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //クライアントサイドファセット用モデル（他のファセットメソッドはこのモデルに依存）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //最小値/最大値が必要な場合
  getFacetedUniqueValues: getFacetedUniqueValues(), //ユニーク値リストが必要な場合
  //...
})
```

### グローバルファセット行モデルの使用

テーブルオプションに適切な行モデルを含めたら、ファセットテーブルインスタンスAPIを使用して、ファセット行モデルによって生成された値リストにアクセスできます。

```ts
// オートコンプリートフィルター用のユニーク値リスト
const autoCompleteSuggestions =
 Array.from(table.getGlobalFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// レンジフィルター用の最小値と最大値のタプル
const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1];
```

### カスタムグローバル（サーバーサイド）ファセット

組み込みのクライアントサイドファセット機能の代わりに、サーバーサイドで独自のファセットロジックを実装し、ファセット値をクライアントサイドに渡すことができます。`getGlobalFacetedUniqueValues`および`getGlobalFacetedMinMaxValues`テーブルオプションを使用して、サーバーサイドからファセット値を解決できます。

```ts
const facetingQuery = useQuery(
  'faceting',
  async () => {
    const response = await fetch('/api/faceting');
    return response.json();
  },
  {
    onSuccess: (data) => {
      table.getGlobalFacetedUniqueValues = () => data.uniqueValues;
      table.getGlobalFacetedMinMaxValues = () => data.minMaxValues;
    },
  }
);
```

この例では、`react-query`の`useQuery`フックを使用してサーバーからファセットデータを取得しています。データが取得されると、`getGlobalFacetedUniqueValues`および`getGlobalFacetedMinMaxValues`テーブルオプションを設定し、サーバー応答からファセット値を返します。これにより、テーブルはサーバーサイドのファセットデータを使用してオートコンプリート候補とレンジフィルターを生成できます。
