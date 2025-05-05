---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:29.613Z'
title: カラムフィルタリング
---
## 例

実装に直接進みたい場合は、以下の例を参照してください:

- [列フィルタリング](../framework/react/examples/filters)
- [ファセットフィルタリング](../framework/react/examples/filters-faceted) (オートコンプリートと範囲フィルタ)
- [ファジー検索](../framework/react/examples/filters-fuzzy) (Match Sorter)
- [編集可能なデータ](../framework/react/examples/editable-data)
- [展開](../framework/react/examples/expanding) (サブ行からのフィルタリング)
- [グループ化](../framework/react/examples/grouping)
- [ページネーション](../framework/react/examples/pagination)
- [行選択](../framework/react/examples/row-selection)

## API

[列フィルタリング API](../api/features/column-filtering)

## 列フィルタリングガイド

フィルタリングには2つの種類があります: 列フィルタリングとグローバルフィルタリングです。

このガイドでは、単一列のアクセサ値に適用されるフィルタである列フィルタリングに焦点を当てます。

TanStackテーブルはクライアントサイドと手動サーバーサイドの両方のフィルタリングをサポートしています。このガイドでは、両方を実装およびカスタマイズする方法と、どのユースケースに最適かを判断する手助けをします。

### クライアントサイド vs サーバーサイドフィルタリング

大規模なデータセットがある場合、すべてのデータをクライアントのブラウザに読み込んでフィルタリングしたくないかもしれません。その場合、サーバーサイドフィルタリング、ソート、ページネーションなどを実装するのが適切でしょう。

ただし、[ページネーションガイド](../guide/pagination#should-you-use-client-side-pagination)でも述べられているように、多くの開発者はクライアントサイドでパフォーマンスに影響を与えずに処理できる行数を過小評価しています。TanStackテーブルの例では、100,000行以上のデータでもクライアントサイドのフィルタリング、ソート、ページネーション、グループ化が十分なパフォーマンスで動作することがよくテストされています。これは必ずしもあなたのアプリがそれだけの行数を処理できるという意味ではありませんが、テーブルが最大でも数千行程度であれば、TanStackテーブルが提供するクライアントサイドのフィルタリング、ソート、ページネーション、グループ化を活用できるかもしれません。

> TanStackテーブルは数千行のクライアントサイド処理を良好なパフォーマンスで処理できます。少し考える前にクライアントサイドのフィルタリング、ページネーション、ソートなどを除外しないでください。

すべてのユースケースは異なり、テーブルの複雑さ、列の数、各データのサイズなどによって異なります。注意すべき主なボトルネックは以下の通りです:

1. サーバーがすべてのデータを合理的な時間（およびコスト）でクエリできるか？
2. フェッチするデータの総サイズは？（列が多くない場合、思ったほど悪くスケールしないかもしれません）
3. すべてのデータを一度に読み込むとクライアントのブラウザがメモリを使いすぎるか？

わからない場合は、まずクライアントサイドのフィルタリングとページネーションから始め、データが増えるにつれて将来サーバーサイドの戦略に切り替えることができます。

### 手動サーバーサイドフィルタリング

組み込みのクライアントサイドフィルタリングではなく、サーバーサイドフィルタリングを実装する必要があると判断した場合、その方法を説明します。

手動サーバーサイドフィルタリングには`getFilteredRowModel`テーブルオプションは必要ありません。代わりに、テーブルに渡す`data`は既にフィルタリングされている必要があります。ただし、`getFilteredRowModel`テーブルオプションを渡した場合、`manualFiltering`オプションを`true`に設定することでテーブルにそれをスキップするように指示できます。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getFilteredRowModel: getFilteredRowModel(), // 手動サーバーサイドフィルタリングには不要
  manualFiltering: true,
})
```

> **注:** 手動フィルタリングを使用する場合、このガイドの残りの部分で説明する多くのオプションは効果がありません。`manualFiltering`が`true`に設定されている場合、テーブルインスタンスは渡された行にフィルタリングロジックを適用しません。代わりに、行は既にフィルタリングされていると仮定し、渡された`data`をそのまま使用します。

### クライアントサイドフィルタリング

組み込みのクライアントサイドフィルタリング機能を使用する場合、まず`getFilteredRowModel`関数をテーブルオプションに渡す必要があります。この関数はテーブルがデータをフィルタリングする必要があるときに呼び出されます。TanStackテーブルからデフォルトの`getFilteredRowModel`関数をインポートするか、独自の関数を作成できます。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // クライアントサイドフィルタリングに必要
})
```

### 列フィルタ状態

クライアントサイドまたはサーバーサイドのフィルタリングを使用するかどうかにかかわらず、TanStackテーブルが提供する組み込みの列フィルタ状態管理を活用できます。フィルタ状態を変更および操作し、列フィルタ状態を取得するための多くのテーブルおよび列APIがあります。

列フィルタ状態は以下の形状のオブジェクトの配列として定義されます:

```ts
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]
```

列フィルタ状態はオブジェクトの配列であるため、複数の列フィルタを同時に適用できます。

#### 列フィルタ状態へのアクセス

`table.getState()` APIを使用して、他のテーブル状態と同様にテーブルインスタンスから列フィルタ状態にアクセスできます。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().columnFilters) // テーブルインスタンスから列フィルタ状態にアクセス
```

ただし、テーブルが初期化される前に列フィルタ状態にアクセスする必要がある場合は、以下のように列フィルタ状態を「制御」できます。

### 制御された列フィルタ状態

列フィルタ状態に簡単にアクセスする必要がある場合は、`state.columnFilters`と`onColumnFiltersChange`テーブルオプションを使用して、独自の状態管理で列フィルタ状態を制御/管理できます。

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // ここで初期列フィルタ状態を設定可能
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
})
```

#### 初期列フィルタ状態

独自の状態管理やスコープで列フィルタ状態を制御する必要がないが、初期列フィルタ状態を設定したい場合は、`state`の代わりに`initialState`テーブルオプションを使用できます。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // デフォルトでname列を'John'でフィルタ
      },
    ],
  },
})
```

> **注**: `initialState.columnFilters`と`state.columnFilters`を同時に使用しないでください。`state.columnFilters`で初期化された状態が`initialState.columnFilters`を上書きします。

### フィルタ関数

各列は独自のフィルタリングロジックを持つことができます。TanStackテーブルが提供するフィルタ関数から選択するか、独自の関数を作成できます。

デフォルトで10の組み込みフィルタ関数が利用可能です:

- `includesString` - 大文字小文字を区別しない文字列包含
- `includesStringSensitive` - 大文字小文字を区別する文字列包含
- `equalsString` - 大文字小文字を区別しない文字列一致
- `equalsStringSensitive` - 大文字小文字を区別する文字列一致
- `arrIncludes` - 配列内のアイテム包含
- `arrIncludesAll` - 配列内のすべてのアイテム包含
- `arrIncludesSome` - 配列内の一部のアイテム包含
- `equals` - オブジェクト/参照等価性 `Object.is`/`===`
- `weakEquals` - 弱いオブジェクト/参照等価性 `==`
- `inNumberRange` - 数値範囲包含

`filterFn`列オプションまたは`filterFns`テーブルオプションを使用して、カスタムフィルタ関数を定義することもできます。

#### カスタムフィルタ関数

> **注:** これらのフィルタ関数はクライアントサイドフィルタリング時のみ実行されます。

`filterFn`列オプションまたは`filterFns`テーブルオプションでカスタムフィルタ関数を定義する場合、以下のシグネチャを持つ必要があります:

```ts
const myCustomFilterFn: FilterFn = (row: Row, columnId: string, filterValue: any, addMeta: (meta: any) => void) => boolean
```

各フィルタ関数は以下を受け取ります:

- フィルタする行
- 行の値を取得するためのcolumnId
- フィルタ値

そして、行がフィルタされた行に含まれるべき場合は`true`を、削除されるべき場合は`false`を返す必要があります。

```jsx
const columns = [
  {
    header: () => '名前',
    accessorKey: 'name',
    filterFn: 'includesString', // 組み込みフィルタ関数を使用
  },
  {
    header: () => '年齢',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => '誕生日',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // カスタムグローバルフィルタ関数を使用
  },
  {
    header: () => 'プロフィール',
    accessorKey: 'profile',
    // 直接カスタムフィルタ関数を使用
    filterFn: (row, columnId, filterValue) => {
      return // カスタムロジックに基づいてtrueまたはfalse
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: { // カスタムグローバルフィルタ関数を追加
    myCustomFilterFn: (row, columnId, filterValue) => { // ここでインライン定義
      return // カスタムロジックに基づいてtrueまたはfalse
    },
    startsWith: startsWithFilterFn, // 別途定義
  },
})
```

##### フィルタ関数の動作をカスタマイズ

フィルタ関数にいくつかの追加プロパティをアタッチして動作をカスタマイズできます:

- `filterFn.resolveFilterValue` - 任意の`filterFn`に追加できるこのオプショナルな「ハンギング」メソッドは、フィルタ値がフィルタ関数に渡される前に変換/サニタイズ/フォーマットすることを許可します。

- `filterFn.autoRemove` - 任意の`filterFn`に追加できるこのオプショナルな「ハンギング」メソッドは、フィルタ値がフィルタ状態から削除されるべきかどうかを判断するために使用されます。例えば、ブールスタイルのフィルタは、フィルタ値が`false`に設定されている場合、フィルタ値をテーブル状態から削除したい場合があります。

```tsx
const startsWithFilterFn = <TData extends MRT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string, //resolveFilterValueはこれを文字列に変換します
) =>
  row
    .getValue<number | string>(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // `resolveFilterValue`でフィルタ値をtoString、toLowerCase、trim

// フィルタ値がfalsy（この場合は空文字列）の場合、フィルタ状態から削除
startsWithFilterFn.autoRemove = (val: any) => !val; 

// フィルタ値がフィルタ関数に渡される前に変換/サニタイズ/フォーマット
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim(); 
```

### 列フィルタリングのカスタマイズ

列フィルタリング動作をさらにカスタマイズするために使用できる多くのテーブルおよび列オプションがあります。

#### 列フィルタリングの無効化

デフォルトでは、すべての列で列フィルタリングが有効になっています。`enableColumnFilters`テーブルオプションまたは`enableColumnFilter`列オプションを使用して、すべての列または特定の列で列フィルタリングを無効にできます。また、`enableFilters`テーブルオプションを`false`に設定することで、列フィルタリングとグローバルフィルタリングの両方を無効にできます。

列のフィルタリングを無効にすると、その列に対して`column.getCanFilter` APIは`false`を返します。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableColumnFilter: false, // この列のフィルタリングを無効化
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableColumnFilters: false, // すべての列のフィルタリングを無効化
})
```

#### サブ行のフィルタリング（展開）

展開、グループ化、集計などの機能を使用する際の列フィルタリング動作をカスタマイズするためのいくつかの追加テーブルオプションがあります。

##### リーフ行からフィルタリング

デフォルトでは、フィルタリングは親行から下に向かって行われるため、親行がフィルタリングされると、すべての子サブ行もフィルタリングされます。ユースケースによっては、トップレベルの行のみを検索させ、サブ行は検索させない場合に望ましい動作です。これはまた最もパフォーマンスの高いオプションです。

ただし、親行がフィルタリングされているかどうかに関係なく、サブ行をフィルタリングおよび検索できるようにしたい場合は、`filterFromLeafRows`テーブルオプションを`true`に設定できます。このオプションを`true`に設定すると、フィルタリングはリーフ行から上に向かって行われるため、子または孫の行が含まれている限り、親行も含まれます。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // サブ行をフィルタリングおよび検索
})
```

##### 最大リーフ行フィルタ深度

デフォルトでは、ツリー内のすべての行に対してフィルタリングが行われます。`maxLeafRowFilterDepth`テーブルオプションを`0`に設定すると、フィルタリングはルートレベルの親行にのみ適用され、すべてのサブ行はフィルタリングされません。同様に、このオプションを`1`に設定すると、フィルタリングは1レベルの深さの子リーフ行にのみ適用されます。

親行がフィルタを通過している間、親行のサブ行がフィルタリングされないようにするには、`maxLeafRowFilterDepth: 0`を使用します。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  maxLeafRowFilterDepth: 0, // ルートレベルの親行のみをフィルタリング
})
```

### 列フィルタAPI

列フィルタ状態と対話し、UIコンポーネントに接続するために使用できる多くの列およびテーブルAPIがあります。以下は利用可能なAPIとその最も一般的な使用例のリストです:

- `table.setColumnFilters` - 列フィルタ状態全体を新しい状態で上書きします。
- `table.resetColumnFilters` - 「すべてクリア/リセット」ボタ
