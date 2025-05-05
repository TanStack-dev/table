---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:29:13.756Z'
title: ソート
---
## 例

実装に直接進みたいですか？以下の例を確認してください:

- [ソート](../framework/react/examples/sorting)
- [フィルター](../framework/react/examples/filters)

## API

[ソート API](../api/features/sorting)

## ソートガイド

TanStack Tableは、あらゆるソートユースケースに対応するソリューションを提供します。このガイドでは、組み込みのクライアントサイドソート機能をカスタマイズするためのさまざまなオプションと、手動のサーバーサイドソートを優先してクライアントサイドソートをオプトアウトする方法について説明します。

### ソート状態

ソート状態は以下の形状のオブジェクトの配列として定義されます:

```tsx
type ColumnSort = {
  id: string
  desc: boolean
}
type SortingState = ColumnSort[]
```

ソート状態は配列であるため、複数の列で同時にソートすることが可能です。[下記](#multi-sorting)でマルチソートのカスタマイズについて詳しく説明します。

#### ソート状態へのアクセス

`table.getState()` APIを使用して、他の状態と同様にソート状態に直接アクセスできます。

```tsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().sorting) // テーブルインスタンスからソート状態にアクセス
```

ただし、テーブルが初期化される前にソート状態にアクセスする必要がある場合は、以下のようにソート状態を「制御」できます。

#### 制御されたソート状態

ソート状態に簡単にアクセスする必要がある場合は、`state.sorting`と`onSortingChange`テーブルオプションを使用して、独自の状態管理でソート状態を制御/管理できます。

```tsx
const [sorting, setSorting] = useState<SortingState>([]) // ここで初期ソート状態を設定可能
//...
// ソート状態を使用してサーバーからデータを取得するなど...
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

#### 初期ソート状態

独自の状態管理やスコープでソート状態を制御する必要がないが、初期ソート状態を設定したい場合は、`state`の代わりに`initialState`テーブルオプションを使用できます。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    sorting: [
      {
        id: 'name',
        desc: true, // デフォルトで名前で降順ソート
      },
    ],
  },
})
```

> **注意**: `initialState.sorting`と`state.sorting`を同時に使用しないでください。`state.sorting`で初期化された状態が`initialState.sorting`を上書きします。

### クライアントサイド vs サーバーサイドソート

クライアントサイドソートとサーバーサイドソートのどちらを使用すべきかは、クライアントサイドまたはサーバーサイドのページネーションやフィルタリングを使用しているかどうかによって完全に異なります。一貫性を保つようにしてください。クライアントサイドソートをサーバーサイドページネーションやフィルタリングと一緒に使用すると、現在ロードされているデータのみがソートされ、データセット全体はソートされません。

### 手動サーバーサイドソート

バックエンドロジックで独自のサーバーサイドソートを使用する予定の場合、ソートされた行モデルを提供する必要はありません。ただし、ソート行モデルを提供しているが無効にしたい場合は、`manualSorting`テーブルオプションを使用できます。

```jsx
const [sorting, setSorting] = useState<SortingState>([])
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  //getSortedRowModel: getSortedRowModel(), // 手動ソートには不要
  manualSorting: true, // ソート済み行モデルの代わりに事前ソート済み行モデルを使用
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

> **注意**: `manualSorting`が`true`に設定されている場合、テーブルは提供されたデータが既にソートされていると見なし、それにソートを適用しません。

### クライアントサイドソート

クライアントサイドソートを実装するには、まずソート行モデルをテーブルに提供する必要があります。TanStack Tableから`getSortedRowModel`関数をインポートすると、行をソート済み行に変換するために使用されます。

```jsx
import { useReactTable } from '@tanstack/react-table'
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // ソート行モデルを提供
})
```

### ソート関数

すべての列のデフォルトのソート関数は、列のデータ型から推測されます。ただし、特にデータがnull許容型である場合や標準的なデータ型でない場合、特定の列に使用する正確なソート関数を定義すると便利です。

`sortingFn`列オプションを使用して、列ごとにカスタムソート関数を決定できます。

デフォルトでは、6つの組み込みソート関数から選択できます:

- `alphanumeric` - 大文字小文字を区別せずに英数字混合値をソート。遅いですが、文字列に自然にソートする必要がある数字が含まれている場合により正確です。
- `alphanumericCaseSensitive` - 大文字小文字を区別して英数字混合値をソート。遅いですが、文字列に自然にソートする必要がある数字が含まれている場合により正確です。
- `text` - 大文字小文字を区別せずにテキスト/文字列値をソート。高速ですが、文字列に自然にソートする必要がある数字が含まれている場合に精度が低くなります。
- `textCaseSensitive` - 大文字小文字を区別してテキスト/文字列値をソート。高速ですが、文字列に自然にソートする必要がある数字が含まれている場合に精度が低くなります。
- `datetime` - 時間でソート。値が`Date`オブジェクトの場合に使用します。
- `basic` - 基本的/標準的な`a > b ? 1 : a < b ? -1 : 0`比較を使用してソート。最も高速なソート関数ですが、最も正確ではない場合があります。

`sortingFn`列オプションとして、または`sortingFns`テーブルオプションを使用してグローバルソート関数として、独自のカスタムソート関数を定義することもできます。

#### カスタムソート関数

`sortingFns`テーブルオプションまたは`sortingFn`列オプションでカスタムソート関数を定義する場合、以下のシグネチャを持つ必要があります:

```tsx
// 必要に応じてSortingFnを使用してパラメータ型を推論
const myCustomSortingFn: SortingFn<TData> = (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
  return // -1, 0, または1 - rowA.originalとrowB.originalを使用して任意の行データにアクセス
}
```

> 注意: 比較関数は、列が降順または昇順であるかどうかを考慮する必要はありません。行モデルがそのロジックを処理します。`sortingFn`関数は一貫した比較を提供するだけでよいです。

すべてのソート関数は2つの行と列IDを受け取り、列IDを使用して2つの行を比較し、昇順で`-1`、`0`、または`1`を返すことが期待されます。以下はチートシートです:

| 戻り値 | 昇順       |
| ------ | ---------- |
| `-1`   | `a < b`    |
| `0`    | `a === b`  |
| `1`    | `a > b`    |

```jsx
const columns = [
  {
    header: () => '名前',
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // 名前で組み込みソート関数を使用
  },
  {
    header: () => '年齢',
    accessorKey: 'age',
    sortingFn: 'myCustomSortingFn', // カスタムグローバルソート関数を使用
  },
  {
    header: () => '誕生日',
    accessorKey: 'birthday',
    sortingFn: 'datetime', // 日付列に推奨
  },
  {
    header: () => 'プロフィール',
    accessorKey: 'profile',
    // 直接カスタムソート関数を使用
    sortingFn: (rowA, rowB, columnId) => {
      return rowA.original.someProperty - rowB.original.someProperty
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns: { // カスタムソート関数を追加
    myCustomSortingFn: (rowA, rowB, columnId) => {
      return rowA.original[columnId] > rowB.original[columnId] ? 1 : rowA.original[columnId] < rowB.original[columnId] ? -1 : 0
    },
  },
})
```

### ソートのカスタマイズ

ソートのUXと動作をさらにカスタマイズするために、多くのテーブルおよび列オプションを使用できます。

#### ソートの無効化

`enableSorting`列オプションまたはテーブルオプションを使用して、特定の列またはテーブル全体のソートを無効にできます。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableSorting: false, // この列のソートを無効化
  },
  {
    header: () => '名前',
    accessorKey: 'name',
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableSorting: false, // テーブル全体のソートを無効化
})
```

#### ソート方向

デフォルトでは、`toggleSorting` APIを使用して列のソートを循環する際の最初のソート方向は、文字列列の場合は昇順、数値列の場合は降順です。`sortDescFirst`列オプションまたはテーブルオプションを使用してこの動作を変更できます。

```jsx
const columns = [
  {
    header: () => '名前',
    accessorKey: 'name',
    sortDescFirst: true, // 名前で最初に降順ソート（文字列列のデフォルトは昇順）
  },
  {
    header: () => '年齢',
    accessorKey: 'age',
    sortDescFirst: false, // 年齢で最初に昇順ソート（数値列のデフォルトは降順）
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  sortDescFirst: true, // すべての列で最初に降順ソート（文字列列のデフォルトは昇順、数値列のデフォルトは降順）
})
```

> **注意**: null許容値を持つ列には、明示的に`sortDescFirst`列オプションを設定することをお勧めします。null許容値が含まれている場合、テーブルは列が数値か文字列かを正しく判断できない場合があります。

#### ソートの反転

ソートの反転は、デフォルトのソート方向の変更と同じではありません。列オプション`invertSorting`が`true`の場合、"desc/asc"ソート状態は通常通り循環しますが、行の実際のソートは反転されます。これは、低い数字が良いことを示す逆のベスト/ワーストスケールを持つ値（例: ランキング（1位、2位、3位）やゴルフのようなスコアリング）に役立ちます。

```jsx
const columns = [
  {
    header: () => 'ランク',
    accessorKey: 'rank',
    invertSorting: true, // この列のソートを反転。"desc"ソートが適用されていても1位 -> 2位 -> 3位 -> ...
  },
  //...
]
```

#### 未定義値のソート

未定義の値は、`sortUndefined`列オプションまたはテーブルオプションに基づいてリストの先頭または末尾にソートされます。特定のユースケースに合わせてこの動作をカスタマイズできます。

指定されていない場合、`sortUndefined`のデフォルト値は`1`で、未定義の値は優先度が低い（降順）としてソートされます。昇順の場合、未定義はリストの末尾に表示されます。

- `'first'` - 未定義の値はリストの先頭にプッシュされます
- `'last'` - 未定義の値はリストの末尾にプッシュされます
- `false` - 未定義の値は同点と見なされ、次の列フィルターまたは元のインデックスでソートする必要があります（適用可能な場合）
- `-1` - 未定義の値は優先度が高い（昇順）としてソートされます（昇順の場合、未定義はリストの先頭に表示されます）
- `1` - 未定義の値は優先度が低い（降順）としてソートされます（昇順の場合、未定義はリストの末尾に表示されます）

> 注意: `'first'`および`'last'`オプションはv8.16.0で新しく追加されました

```jsx
const columns = [
  {
    header: () => 'ランク',
    accessorKey: 'rank',
    sortUndefined: -1, // 'first' | 'last' | 1 | -1 | false
  },
]
```

#### ソートの削除

デフォルトでは、列のソート状態を循環する際にソートを削除する機能が有効になっています。`enableSortingRemoval`テーブルオプションを使用してこの動作を無効にできます。この動作は、少なくとも1つの列が常にソートされていることを保証したい場合に便利です。

`getToggleSortingHandler`または`toggleSorting` APIを使用する場合のデフォルトの動作は、次のようにソート状態を循環します:

`'none' -> 'desc' -> 'asc' -> 'none' -> 'desc' -> 'asc' -> ...`

ソート削除を無効にすると、動作は次のようになります:

`'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...`

一度列がソートされ、`enableSortingRemoval`が`false`の場合、その列のソートを切り替えてもソートが削除されることはありません。ただし、ユーザーが別の列でソートし、それがマルチソートイベントでない場合、前の列のソートは削除され、新しい列にのみ適用されます。

> 少なくとも1つの列が常にソートされていることを保証したい場合は、`enableSortingRemoval`を`false`に設定します。

```jsx
const table = useReactTable({
  columns,
  data,
  enableSortingRemoval: false, // 列のソート削除機能を無効化（常に none -> asc -> desc -> asc）
})
```

#### マルチソート

`column.getToggleSortingHandler` APIを使用している場合、デフォルトで複数列での同時ソートが有効になっています。ユーザーが`Shift`キーを押しながら列ヘッダーをクリックすると、テーブルはその列と既にソートされている列を追加でソートします。`column.toggleSorting` APIを使用する場合は、マルチソートを使用するかどうかを手動で渡す必要があります（`column.toggleSorting(desc, multi)`）。

##### マルチソートの無効化

`enableMultiSort`列オプションまたはテーブルオプションを使用して、特定の列またはテーブル全体のマルチソートを無効にできます。特定の列のマルチソートを無効にすると、既存のすべてのソートが新しい列のソートに置き換えられます。

```jsx
const columns = [
  {
    header: () => '作成日',
    accessorKey: 'createdAt',
    enableMultiSort: false, // この列でソートする場合は常にこの列のみでソート
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableMultiSort: false, // テーブル全体のマルチソートを無効化
})
```

##### マルチソートトリガーのカスタマイズ

デフォルトでは、`Shift`キーがマルチソートのトリガーとして使用されます。`isMultiSortEvent`テーブルオプションを使用してこの動作を変更できます。カスタム関数から`true`を返すことで、すべてのソートイベントがマルチソートをトリガーするように指定することもできます
