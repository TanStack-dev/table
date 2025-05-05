---
source-updated-at: '2024-04-24T03:41:47.000Z'
translation-updated-at: '2025-05-05T19:24:59.286Z'
title: 行モデル
---
## 行モデル (Row Models) ガイド

TanStack Tableの最も基本的な例を見ると、次のようなコードスニペットがあります:

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //row model
  })
}
```

この`getCoreRowModel`関数とは何でしょうか？そして、なぜTanStack Tableからインポートしただけで、それをそのまま渡す必要があるのでしょうか？

その答えは、TanStack Tableがモジュール型のライブラリであることにあります。すべての機能のコードがデフォルトでcreateTable関数/フックに含まれているわけではありません。使用する機能に基づいて行を正しく生成するために必要なコードのみをインポートして含める必要があります。

### 行モデル (Row Models) とは？

行モデルはTanStack Tableの内部で動作し、フィルタリング、ソート、グループ化、展開、ページネーションなどのデータグリッド機能に必要な有用な方法で元のデータを変換します。画面上に生成されてレンダリングされる行は、必ずしもテーブルに渡した元のデータと1:1で対応するわけではありません。ソート、フィルタリング、ページネーションなどが適用される可能性があります。

### 行モデルのインポート

必要な行モデルのみをインポートする必要があります。以下は利用可能なすべての行モデルです:

```ts
//必要な行モデルのみをインポート
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 行モデルのカスタマイズ/フォーク

TanStack Tableが提供する正確な行モデルを使用する必要はありません。特定の行モデルに高度なカスタマイズが必要な場合は、カスタマイズしたい行モデルの[ソースコード](https://github.com/TanStack/table/tree/main/packages/table-core/src/utils)をコピーして、必要に応じて変更してください。

### 行モデルの使用

テーブルインスタンスが作成されると、必要なすべての行モデルにテーブルインスタンスから直接アクセスできます。インポートしたもの以外にも、さらに多くの派生行モデルが利用可能です。

通常のレンダリングユースケースでは、おそらく`table.getRowModel()`メソッドのみを使用すれば十分です。この行モデルは、有効または無効にした機能に応じて、他のすべて/任意の行モデルを使用します。他のすべての行モデルは、テーブルで行われている基礎的なデータ変換を「掘り下げる」ために利用できます。

### テーブルインスタンスで利用可能な行モデル

- **`getRowModel`** - これはテーブル行のマークアップをレンダリングするために使用する主要な行モデルです。他のすべての行モデルを使用して、テーブル行をレンダリングするために使用する最終的な行モデルを生成します。

- `getCoreRowModel` - テーブルに渡された元のデータと1:1で対応する基本的な行モデルを返します。

- `getFilteredRowModel` - カラムフィルタリングとグローバルフィルタリングを考慮した行モデルを返します。
- `getPreFilteredRowModel` - カラムフィルタリングとグローバルフィルタリングが適用される前の行モデルを返します。

- `getGroupedRowModel` - データにグループ化と集約を適用し、サブ行を作成する行モデルを返します。
- `getPreGroupedRowModel` - グループ化と集約が適用される前の行モデルを返します。

- `getSortedRowModel` - ソートが適用された行モデルを返します。
- `getPreSortedRowModel` - ソートが適用される前の行モデルを返します（行は元の順序です）。

- `getExpandedRowModel` - 展開/非表示のサブ行を考慮した行モデルを返します。
- `getPreExpandedRowModel` - 展開されたサブ行を含まないルートレベルの行のみを含む行モデルを返します。ソートは含まれます。

- `getPaginationRowModel` - ページネーション状態に基づいて現在のページに表示されるべき行のみを含む行モデルを返します。
- `getPrePaginationRowModel` - ページネーションが適用されていない行モデルを返します（すべての行を含みます）。

- `getSelectedRowModel` - 選択されたすべての行の行モデルを返します（ただし、テーブルに渡されたデータに基づきます）。getCoreRowModelの後に実行されます。
- `getPreSelectedRowModel` - 行選択が適用される前の行モデルを返します（getCoreRowModelを返します）。
- `getGroupedSelectedRowModel` - グループ化後に選択された行の行モデルを返します。getFilteredRowModelの後に実行されるgetGroupedRowModelの後に実行されるgetSortedRowModelの後に実行されます。
- `getFilteredSelectedRowModel` - カラムフィルタリングとグローバルフィルタリング後に選択された行の行モデルを返します。getFilteredRowModelの後に実行されます。

### 行モデル実行の順序

TanStack Tableが内部的に行を処理する方法を知ることは、内部で何が起こっているかをよりよく理解し、発生する可能性のある問題をデバッグするのに役立ちます。

内部的には、それぞれの行モデルがデータに適用される順序は次のとおりです（それぞれの機能が有効になっている場合）:

`getCoreRowModel` -> `getFilteredRowModel` -> `getGroupedRowModel` -> `getSortedRowModel` -> `getExpandedRowModel` -> `getPaginationRowModel` -> `getRowModel`

いずれの場合でも、それぞれの機能が無効になっているか、`"manual*"`テーブルオプションでオフになっている場合、そのプロセスのステップでは代わりに`getPre*RowModel`が使用されます。

上記のように、最初にデータがフィルタリングされ、次にグループ化され、ソートされ、展開され、最後にページネーションが最終ステップとして適用されます。

### 行モデルのデータ構造

各
