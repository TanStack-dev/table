---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:10.916Z'
title: テーブル状態
---
## 例

実装に直接進みたいですか？以下の例を確認してください:

- [キッチンシンク](../examples/kitchen-sink)
- [完全に制御された状態](../examples/fully-controlled)

## テーブル状態 (React) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部状態管理システムを備えています。また、独自の状態管理で管理する必要がある状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法について説明します。

### テーブル状態へのアクセス

テーブル状態を機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState()) //内部状態全体にアクセス
console.log(table.getState().rowSelection) //行選択状態のみにアクセス
```

### カスタム初期状態

特定の状態について初期値をカスタマイズするだけでよい場合、依然として状態を自分で管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```jsx
const table = useReactTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //初期カラム順をカスタマイズ
    columnVisibility: {
      id: false //デフォルトでidカラムを非表示
    },
    expanded: true, //デフォルトですべての行を展開
    sorting: [
      {
        id: 'age',
        desc: true //デフォルトで年齢の降順にソート
      }
    ]
  },
  //...
})
```

> **注**: `initialState`と`state`の両方に同じ状態を指定しないでください。特定の状態値を`initialState`と`state`の両方に渡すと、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御された状態

アプリケーションの他の部分でテーブル状態に簡単にアクセスする必要がある場合、TanStack Tableでは独自の状態管理システムでテーブル状態の一部または全部を簡単に制御・管理できます。これを行うには、独自の状態と状態管理関数を`state`と`on[State]Change`テーブルオプションに渡します。

#### 個別に制御された状態

必要な状態のみを制御できます。すべてのテーブル状態を制御する必要はありません。ケースバイケースで必要な状態のみを制御することを推奨します。

特定の状態を制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

フィルタリング、ソート、ページネーションを「手動」のサーバーサイドデータ取得シナリオで例として見てみましょう。フィルタリング、ソート、ページネーションの状態を独自の状態管理に保存できますが、APIが関与しないカラム順序やカラム表示状態などは除外できます。

```jsx
const [columnFilters, setColumnFilters] = React.useState([]) //デフォルトフィルターなし
const [sorting, setSorting] = React.useState([{
  id: 'age',
  desc: true, //デフォルトで年齢の降順にソート
}]) 
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 })

//制御された状態値を使用してデータを取得
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useReactTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //制御された状態をテーブルに戻す（内部状態を上書き）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //columnFilters状態を独自の状態管理に引き上げ
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全に制御された状態

あるいは、`onStateChange`テーブルオプションを使用してテーブル状態全体を制御できます。これにより、テーブル状態全体が独自の状態管理システムに引き上げられます。ただし、`columnSizingInfo`状態のように頻繁に変更される状態値をReactツリーの上位に引き上げると、パフォーマンスの問題を引き起こす可能性があるため注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要な場合があります。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用したいすべての機能に関連する状態値を設定する必要があります。すべての初期状態値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```jsx
//デフォルト状態値でテーブルインスタンスを作成
const table = useReactTable({
  columns,
  data,
  //... 注: `state`値はまだ渡されていない
})


const [state, setState] = React.useState({
  ...table.initialState, //テーブルインスタンスからすべてのデフォルト状態値を取得して初期状態を設定
  pagination: {
    pageIndex: 0,
    pageSize: 15 //必要に応じて初期ページネーション状態をカスタマイズ
  }
})

//table.setOptions APIを使用して、完全に制御された状態をテーブルインスタンスにマージ
table.setOptions(prev => ({
  ...prev, //上記で設定した他のオプションを保持
  state, //完全に制御された状態が内部状態を上書き
  onStateChange: setState //状態変更が独自の状態管理に引き上げられる
}))
```

### 状態変更コールバック

これまで、`on[State]Change`および`onStateChange`テーブルオプションが、テーブル状態の変更を独自の状態管理に「引き上げる」仕組みを見てきました。しかし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **状態変更コールバックには、`state`オプションに対応する状態値が必要です**。

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御された状態であると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```jsx
const [sorting, setSorting] = React.useState([])
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting, //`onSortingChange`を使用しているため必須
  },
  onSortingChange: setSorting, //`state.sorting`を制御された状態にする
})
```

#### 2. **アップデータは生の値またはコールバック関数のいずれかです**。

`on[State]Change`および`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しい状態値または前の状態値を受け取って新しい状態値を返すコールバック関数のいずれかです。

これにはどのような意味があるのでしょうか？つまり、`on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があるということです。

```jsx
const [sorting, setSorting] = React.useState([])
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

const table = useReactTable({
  columns,
  data,
  //...
  state: {
    pagination,
    sorting,
  }
  //構文1
  onPaginationChange: (updater) => {
    setPagination(old => {
      const newPaginationValue = updater instanceof Function ? updater(old) : updater
      //新しいページネーション値で何かを行う
      //...
      return newPaginationValue
    })
  },
  //構文2
  onSortingChange: (updater) => {
    const newSortingValue = updater instanceof Function ? updater(sorting) : updater
    //新しいソート値で何かを行う
    //...
    setSorting(updater) //通常の状態更新
  }
})
```

### 状態の型

TanStack Tableのすべての複雑な状態には、インポートして使用できる独自のTypeScript型があります。これは、制御している状態値に対して正しいデータ構造とプロパティを使用していることを確認するのに便利です。

```tsx
import { useReactTable, type SortingState } from '@tanstack/react-table'
//...
const [sorting, setSorting] = React.useState<SortingState[]>([
  {
    id: 'age', //`id`と`desc`プロパティのオートコンプリートが可能
    desc: true,
  }
])
```
