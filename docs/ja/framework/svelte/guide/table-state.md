---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:26:25.934Z'
title: テーブル状態
---
## テーブルステート (Svelte) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部ステート管理システムを備えています。また、独自のステート管理で管理が必要な状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法を説明します。

### テーブルステートへのアクセス

テーブルステートを機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、テーブルインスタンスAPIの`table.getState()`を使用してアクセスできます。

```jsx
const options = writable({
  columns,
  data,
  //...
})

const table = createSvelteTable(options)

console.log(table.getState()) //内部状態全体にアクセス
console.log(table.getState().rowSelection) //行選択状態のみにアクセス
```

### カスタム初期状態

特定の状態について初期値をカスタマイズするだけでよい場合、依然としてステートを自分で管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```jsx
const options = writable({
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

const table = createSvelteTable(options)
```

> **注**: 各状態は`initialState`か`state`のどちらか一方でのみ指定してください。両方に同じ状態値を渡した場合、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御されたステート

アプリケーションの他の部分でテーブルステートに簡単にアクセスする必要がある場合、TanStack Tableでは任意またはすべてのテーブルステートを独自のステート管理システムで制御・管理できます。これは、`state`と`on[State]Change`テーブルオプションに独自のステートとステート管理関数を渡すことで実現します。

#### 個別に制御されたステート

必要なステートのみを制御できます。すべてのテーブルステートを制御する必要はありません。ケースバイケースで必要なステートのみを制御することが推奨されます。

特定のステートを制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

「手動」なサーバーサイドデータ取得シナリオで、フィルタリング、ソート、ページネーションを例に取りましょう。フィルタリング、ソート、ページネーションの状態を独自のステート管理に保存しつつ、APIが関与しないカラム順序やカラム表示状態などは除外できます。

```ts
let sorting = [
  {
    id: 'age',
    desc: true, //デフォルトで年齢の降順にソート
  },
]
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}

let columnFilters = [] //デフォルトのフィルタなし
const setColumnFilters = updater => {
  if (updater instanceof Function) {
    columnFilters = updater(columnFilters)
  } else {
    columnFilters = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      columnFilters,
    },
  }))
}

let pagination = { pageIndex: 0, pageSize: 15 } //デフォルトのページネーション
const setPagination = updater => {
  if (updater instanceof Function) {
    pagination = updater(pagination)
  } else {
    pagination = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      pagination,
    },
  }))
}

//制御されたステート値を使用してデータを取得
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const options = writable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //制御されたステートをテーブルに戻す（内部状態を上書き）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //columnFiltersステートを独自のステート管理に引き上げ
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})

const table = createSvelteTable(options)
//...
```

#### 完全に制御されたステート

代わりに、`onStateChange`テーブルオプションを使用してテーブルステート全体を制御できます。これにより、テーブルステート全体が独自のステート管理システムに引き上げられます。ただし、`columnSizingInfo`ステートのように頻繁に変更される状態値をSvelteツリーに引き上げるとパフォーマンスの問題を引き起こす可能性があるため、このアプローチには注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要かもしれません。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用したいすべての機能に関連するステート値をすべて設定する必要があります。すべての初期状態値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```jsx
//デフォルトの状態値でテーブルインスタンスを作成
const options = writable({
  columns,
  data,
  //... 注: `state`値はまだ渡されていない
})
const table = createSvelteTable(options)

let state = {
  ...table.initialState, //テーブルインスタンスからすべてのデフォルト状態値を取得して初期状態を設定
  pagination: {
    pageIndex: 0,
    pageSize: 15 //オプションで初期ページネーション状態をカスタマイズ
  }
}
const setState = updater => {
  if (updater instanceof Function) {
    state = updater(state)
  } else {
    state = updater
  }
  options.update(old => ({
    ...old,
    state,
  }))
}

//table.setOptions APIを使用して、完全に制御されたステートをテーブルインスタンスにマージ
table.setOptions(prev => ({
  ...prev, //上記で設定した他のオプションを保持
  state, //完全に制御されたステートが内部状態を上書き
  onStateChange: setState //状態変更は独自のステート管理に引き上げられる
}))
```

### ステート変更コールバック

これまで、`on[State]Change`と`onStateChange`テーブルオプションがテーブルステートの変更を独自のステート管理に「引き上げる」働きを見てきました。しかし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **ステート変更コールバックには、対応する`state`オプションにステート値が含まれている必要があります**。

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御されたステートであると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```ts
let sorting = []
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
//...
const options = writable({
  columns,
  data,
  //...
  state: {
    sorting, //`onSortingChange`を使用するため必須
  },
  onSortingChange: setSorting, //`state.sorting`を制御する
})
const table = createSvelteTable(options)
```

#### 2. **アップデータは生の値またはコールバック関数のいずれかになります**。

`on[State]Change`と`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しいステート値か、前のステート値を受け取って新しいステート値を返すコールバック関数のいずれかになります。

これにはどのような意味があるのでしょうか？`on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があることを意味します。

これが、上記の例の`setState`関数に`if (updater instanceof Function)`チェックがある理由です。

### ステートの型

TanStack Tableのすべての複雑なステートには、インポートして使用できる独自のTypeScript型があります。これは、制御しているステート値に対して正しいデータ構造とプロパティを使用していることを確認するのに役立ちます。

```ts
import { createSvelteTable, type SortingState, type Updater } from '@tanstack/svelte-table'
//...
let sorting: SortingState[] = [
  {
    id: 'age', //`id`と`desc`プロパティのオートコンプリートが得られる
    desc: true,
  }
]
const setSorting = (updater: Updater<SortingState>)  => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
```
