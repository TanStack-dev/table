---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:41.889Z'
title: グローバルフィルタリング
---
## サンプル

実装に直接進みたいですか？以下のサンプルを確認してください:

- [グローバルフィルター](../framework/react/examples/filters-global)

## API

[グローバルフィルタリング API](../api/features/global-filtering)

## グローバルフィルタリングガイド

フィルタリングには2つの種類があります: カラムフィルタリングとグローバルフィルタリングです。

このガイドでは、すべてのカラムに適用されるフィルターであるグローバルフィルタリングに焦点を当てます。

### クライアントサイド vs サーバーサイドフィルタリング

大規模なデータセットがある場合、フィルタリングするためにすべてのデータをクライアントのブラウザに読み込みたくないかもしれません。その場合、サーバーサイドフィルタリング、ソート、ページネーションなどを実装する必要があるでしょう。

ただし、[ページネーションガイド](../guide/pagination#should-you-use-client-side-pagination)でも説明されているように、多くの開発者はパフォーマンスに影響を与えずにクライアントサイドで読み込める行数を過小評価しています。TanStackテーブルのサンプルは、多くの場合、最大100,000行以上のクライアントサイドフィルタリング、ソート、ページネーション、グループ化を適切なパフォーマンスで処理できるようにテストされています。これは必ずしもあなたのアプリがそれだけの行数を処理できることを意味するわけではありませんが、テーブルが最大でも数千行しか持たない場合は、TanStackテーブルが提供するクライアントサイドフィルタリング、ソート、ページネーション、グループ化を活用できるかもしれません。

> TanStackテーブルは、数千行のクライアントサイド処理を良好なパフォーマンスで処理できます。クライアントサイドフィルタリング、ページネーション、ソートなどを最初に検討せずに除外しないでください。

各ユースケースは異なり、テーブルの複雑さ、カラムの数、各データのサイズなどによって異なります。主に注意すべきボトルネックは以下の通りです:

1. サーバーがすべてのデータを合理的な時間（およびコスト）でクエリできるか？
2. フェッチの総サイズは？（カラムが多くない場合、思ったほどスケールしないかもしれません。）
3. すべてのデータを一度に読み込んだ場合、クライアントのブラウザが使用するメモリが多すぎないか？

わからない場合は、最初にクライアントサイドフィルタリングとページネーションから始め、データが増えるにつれて将来サーバーサイド戦略に切り替えることができます。

### 手動サーバーサイドグローバルフィルタリング

組み込みのクライアントサイドグローバルフィルタリングを使用する代わりに、サーバーサイドグローバルフィルタリングを実装する必要があると判断した場合の方法です。

手動サーバーサイドグローバルフィルタリングには、`getFilteredRowModel`テーブルオプションは必要ありません。代わりに、テーブルに渡す`data`はすでにフィルタリングされている必要があります。ただし、`getFilteredRowModel`テーブルオプションを渡した場合は、`manualFiltering`オプションを`true`に設定することでテーブルにスキップするように指示できます。

```jsx
const table = useReactTable({
  data,
  columns,
  // getFilteredRowModel: getFilteredRowModel(), // 手動サーバーサイドグローバルフィルタリングには不要
  manualFiltering: true,
})
```

注: 手動グローバルフィルタリングを使用する場合、このガイドの残りの部分で説明されている多くのオプションは効果がありません。`manualFiltering`が`true`に設定されている場合、テーブルインスタンスは渡された行にグローバルフィルタリングロジックを適用しません。代わりに、行がすでにフィルタリングされていると仮定し、渡されたデータをそのまま使用します。

### クライアントサイドグローバルフィルタリング

組み込みのクライアントサイドグローバルフィルタリングを使用する場合、まず`getFilteredRowModel`関数をテーブルオプションに渡す必要があります。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  // その他のオプション...
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // クライアントサイドグローバルフィルタリングに必要
})
```

### グローバルフィルター関数

`globalFilterFn`オプションを使用すると、グローバルフィルタリングに使用するフィルター関数を指定できます。フィルター関数は、組み込みのフィルター関数を参照する文字列、`tableOptions.filterFns`オプションを介して提供されるカスタムフィルター関数を参照する文字列、またはカスタムフィルター関数そのものです。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'text' // 組み込みフィルター関数
})
```

デフォルトで10の組み込みフィルター関数が用意されています:

- includesString - 大文字小文字を区別しない文字列包含
- includesStringSensitive - 大文字小文字を区別する文字列包含
- equalsString - 大文字小文字を区別しない文字列一致
- equalsStringSensitive - 大文字小文字を区別する文字列一致
- arrIncludes - 配列内のアイテム包含
- arrIncludesAll - 配列内のすべてのアイテム包含
- arrIncludesSome - 配列内の一部のアイテム包含
- equals - オブジェクト/参照等価性 Object.is/===
- weakEquals - 弱いオブジェクト/参照等価性 ==
- inNumberRange - 数値範囲包含

また、`globalFilterFn`テーブルオプションとしてカスタムフィルター関数を定義することもできます。

### グローバルフィルター状態

グローバルフィルター状態はテーブルの内部状態に保存され、`table.getState().globalFilter`プロパティを介してアクセスできます。グローバルフィルター状態をテーブルの外部で保持したい場合は、`onGlobalFilterChange`オプションを使用して、グローバルフィルター状態が変更されるたびに呼び出されるコールバック関数を提供できます。

```jsx
const [globalFilter, setGlobalFilter] = useState<any>([])

const table = useReactTable({
  // その他のオプション...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter
})
```

グローバルフィルタリング状態は以下の形状のオブジェクトとして定義されます:

```jsx
interface GlobalFilter {
  globalFilter: any
}
```

### UIへのグローバルフィルター入力の追加

TanStackテーブルはグローバルフィルター入力UIをテーブルに自動的に追加しません。ユーザーがテーブルをフィルタリングできるように、手動でUIに追加する必要があります。たとえば、テーブルの上に入力UIを追加して、ユーザーが検索語を入力できるようにすることができます。

```jsx
return (
  <div>
    <input
      value=""
      onChange={e => table.setGlobalFilter(String(e.target.value))}
      placeholder="検索..."
    />
  </div>
)
```

### カスタムグローバルフィルター関数

カスタムグローバルフィルター関数を使用したい場合は、関数を定義して`globalFilterFn`オプションに渡すことができます。

> **注:** グローバルフィルタリングにファジーフィルタリング関数を使用するのは一般的なアイデアです。これについては[ファジーフィルタリングガイド](./fuzzy-filtering.md)で説明されています。

```jsx
const customFilterFn = (rows, columnId, filterValue) => {
  // カスタムフィルターロジック
}

const table = useReactTable({
  // その他のオプション...
  globalFilterFn: customFilterFn
})
```

### 初期グローバルフィルター状態

テーブルが初期化されたときに初期グローバルフィルター状態を設定したい場合は、`initialState`オプションの一部としてグローバルフィルター状態を渡すことができます。

ただし、`state.globalFilter`オプションで初期グローバルフィルター状態を指定することもできます。

```jsx
const [globalFilter, setGlobalFilter] = useState("検索語") // ここでglobalFilter状態を初期化することを推奨

const table = useReactTable({
  // その他のオプション...
  initialState: {
    globalFilter: '検索語', // globalFilter状態を管理しない場合、ここで初期状態を設定
  }
  state: {
    globalFilter, // 管理されたglobalFilter状態をテーブルに渡す
  }
})
```

> 注意: `initialState.globalFilter`と`state.globalFilter`を同時に使用しないでください。`state.globalFilter`で初期化された状態が`initialState.globalFilter`を上書きします。

### グローバルフィルタリングの無効化

デフォルトでは、すべてのカラムでグローバルフィルタリングが有効になっています。`enableGlobalFilter`テーブルオプションを使用して、すべてのカラムのグローバルフィルタリングを無効にできます。また、`enableFilters`テーブルオプションを`false`に設定することで、カラムフィルタリングとグローバルフィルタリングの両方を無効にすることもできます。

グローバルフィルタリングを無効にすると、`column.getCanGlobalFilter` APIはそのカラムに対して`false`を返します。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableGlobalFilter: false, // このカラムのグローバルフィルタリングを無効化
  },
  //...
]
//...
const table = useReactTable({
  // その他のオプション...
  columns,
  enableGlobalFilter: false, // すべてのカラムのグローバルフィルタリングを無効化
})
```
