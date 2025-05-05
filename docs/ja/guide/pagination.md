---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:23.394Z'
title: ページネーション
---
## 例

実装に直接進みたいですか？以下の例を確認してください:

- [ページネーション](../framework/react/examples/pagination)
- [ページネーション（制御付き、React Query使用）](../framework/react/examples/pagination-controlled)
- [編集可能データ](../framework/react/examples/editable-data)
- [展開](../framework/react/examples/expanding)
- [フィルター](../framework/react/examples/filters)
- [完全制御](../framework/react/examples/fully-controlled)
- [行選択](../framework/react/examples/row-selection)

## API

[ページネーションAPI](../api/features/pagination)

## ページネーションガイド

TanStack Tableはクライアントサイドとサーバーサイドの両方のページネーションをサポートしています。このガイドでは、テーブルにページネーションを実装するさまざまな方法を説明します。

### クライアントサイドページネーション

クライアントサイドページネーションを使用すると、フェッチする`data`にはテーブルの***すべて***の行が含まれ、テーブルインスタンスがフロントエンドでページネーションロジックを処理します。

#### クライアントサイドページネーションを使用すべきか？

クライアントサイドページネーションは、TanStack Tableを使用する際にページネーションを実装する最も簡単な方法ですが、非常に大きなデータセットには実用的ではない場合があります。

ただし、多くの人がクライアントサイドで処理できるデータ量を過小評価しています。テーブルが数千行以下であれば、クライアントサイドページネーションはまだ有効な選択肢です。TanStack Tableは、ページネーション、フィルタリング、ソート、グループ化において、数万行まで良好なパフォーマンスでスケールアップできるように設計されています。[公式のページネーション例](../framework/react/examples/pagination)では10万行を読み込んでも良好なパフォーマンスを発揮しています（ただし、列数は少ない場合です）。

各ユースケースは異なり、テーブルの複雑さ、列の数、データの大きさなどによって異なります。主に注意すべきボトルネックは以下の通りです:

1. サーバーがすべてのデータを合理的な時間（とコスト）でクエリできるか？
2. フェッチの総サイズは？（列が多くない場合、思ったほどスケールしないかもしれません）
3. すべてのデータを一度に読み込むと、クライアントのブラウザがメモリを使いすぎるか？

わからない場合は、まずクライアントサイドページネーションから始めて、データが増えたら後でサーバーサイドページネーションに切り替えることもできます。

#### 代わりに仮想化を使用すべきか？

ページネーションの代わりに、大きなデータセットのすべての行を同じページにレンダリングし、ビューポートに表示されている行のみをブラウザのリソースを使ってレンダリングする方法もあります。この戦略は「仮想化」または「ウィンドウ化」と呼ばれることがあります。TanStackには[TalStack Virtual](https://tanstack.com/virtual/latest)という仮想化ライブラリがあり、TanStack Tableとうまく連携できます。仮想化とページネーションのUI/UXにはそれぞれトレードオフがあるので、ユースケースに最適なものを選択してください。

#### ページネーション行モデル

TanStack Tableの組み込みクライアントサイドページネーションを利用するには、まずページネーション行モデルを渡す必要があります。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), //クライアントサイドページネーションコードを読み込む
});
```

### 手動サーバーサイドページネーション

サーバーサイドページネーションを使用する必要がある場合、以下のように実装できます。

サーバーサイドページネーションにはページネーション行モデルは必要ありませんが、他のテーブルで必要な場合に共有コンポーネントで提供している場合は、`manualPagination`オプションを`true`に設定することでクライアントサイドページネーションをオフにできます。`manualPagination`オプションを`true`に設定すると、テーブルインスタンスは内部的に`table.getPrePaginationRowModel`行モデルを使用し、渡された`data`が既にページネーションされていると仮定します。

#### ページ数と行数

テーブルインスタンスは、バックエンドに合計で何行/何ページあるかを知る方法がないため、明示的に伝える必要があります。`rowCount`または`pageCount`テーブルオプションを提供して、テーブルインスタンスに合計ページ数を伝えます。`rowCount`を提供すると、テーブルインスタンスは`rowCount`と`pageSize`から内部的に`pageCount`を計算します。既に`pageCount`を持っている場合は、直接提供することもできます。ページ数がわからない場合は、`pageCount`に`-1`を渡すことができますが、この場合`getCanNextPage`と`getCanPreviousPage`行モデル関数は常に`true`を返します。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(), //サーバーサイドページネーションには不要
  manualPagination: true, //クライアントサイドページネーションをオフにする
  rowCount: dataQuery.data?.rowCount, //合計行数を渡してテーブルにページ数を伝える（pageCountが提供されていない場合は内部的に計算）
  // pageCount: dataQuery.data?.pageCount, //代わりに直接pageCountを渡すことも可能
});
```

> **注**: `manualPagination`オプションを`true`に設定すると、テーブルインスタンスは渡された`data`が既にページネーションされていると仮定します。

### ページネーション状態

クライアントサイドまたは手動サーバーサイドページネーションのどちらを使用する場合でも、組み込みの`pagination`状態とAPIを使用できます。

`pagination`状態は以下のプロパティを含むオブジェクトです:

- `pageIndex`: 現在のページインデックス（0ベース）。
- `pageSize`: 現在のページサイズ。

`pagination`状態は、テーブルインスタンスの他の状態と同様に管理できます。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const [pagination, setPagination] = useState({
  pageIndex: 0, //初期ページインデックス
  pageSize: 10, //デフォルトページサイズ
});

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: setPagination, //内部APIがページネーション状態を変更したときに更新
  state: {
    //...
    pagination,
  },
});
```

あるいは、`pagination`状態を自身のスコープで管理する必要がなく、`pageIndex`と`pageSize`に異なる初期値を設定したい場合は、`initialState`オプションを使用できます。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 2, //カスタム初期ページインデックス
      pageSize: 25, //カスタムデフォルトページサイズ
    },
  },
});
```

> **注**: `pagination`状態を`state`と`initialState`の両方に渡さないでください。`state`は`initialState`を上書きします。どちらか一方のみを使用してください。

### ページネーションオプション

手動サーバーサイドページネーションに有用な`manualPagination`、`pageCount`、`rowCount`オプション（[上記](#manual-server-side-pagination)で説明）に加えて、理解しておくと便利なテーブルオプションがもう1つあります。

#### ページインデックスの自動リセット

デフォルトでは、`data`が更新されたり、フィルターが変更されたり、グループ化が変更されたりなど、ページに影響を与える状態変更が発生すると、`pageIndex`は`0`にリセットされます。この動作は`manualPagination`がtrueの場合は自動的に無効になりますが、`autoResetPageIndex`テーブルオプションに明示的にブール値を割り当てることで上書きできます。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //pageIndexの自動リセットをオフにする
});
```

ただし、`autoResetPageIndex`をオフにした場合、空のページを表示しないようにするために、`pageIndex`を自分でリセットするロジックを追加する必要があるかもしれないことに注意してください。

### ページネーションAPI

ページネーションUIコンポーネントを接続するのに便利な、いくつかのページネーションテーブルインスタンスAPIがあります。

#### ページネーションボタンAPI

- `getCanPreviousPage`: 最初のページにいる場合に「前のページ」ボタンを無効にするのに便利。
- `getCanNextPage`: これ以上ページがない場合に「次のページ」ボタンを無効にするのに便利。
- `previousPage`: 前のページに移動するのに便利（ボタンクリックハンドラ）。
- `nextPage`: 次のページに移動するのに便利（ボタンクリックハンドラ）。
- `firstPage`: 最初のページに移動するのに便利（ボタンクリックハンドラ）。
- `lastPage`: 最後のページに移動するのに便利（ボタンクリックハンドラ）。
- `setPageIndex`: 「ページに移動」入力に便利。
- `resetPageIndex`: テーブル状態を元のページインデックスにリセットするのに便利。
- `setPageSize`: 「ページサイズ」入力/選択に便利。
- `resetPageSize`: テーブル状態を元のページサイズにリセットするのに便利。
- `setPagination`: ページネーション状態を一度にすべて設定するのに便利。
- `resetPagination`: テーブル状態を元のページネーション状態にリセットするのに便利。

> **注**: これらのAPIの一部は`v8.13.0`で新しく追加されました。

```jsx
<Button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</Button>
<Button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</Button>
<Button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</Button>
<Button
  onClick={() => table.lastPage()}
  disabled={!table.getCanNextPage()}
>
  {'>>'}
</Button>
<select
  value={table.getState().pagination.pageSize}
  onChange={e => {
    table.setPageSize(Number(e.target.value))
  }}
>
  {[10, 20, 30, 40, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
</select>
```

#### ページネーション情報API

- `getPageCount`: 合計ページ数を表示するのに便利。
- `getRowCount`: 合計行数を表示するのに便利。
