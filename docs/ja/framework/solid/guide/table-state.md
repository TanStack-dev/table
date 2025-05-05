---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:26:15.799Z'
title: テーブル状態
---
## Table State (Solid) ガイド

TanStack Tableのコアは**フレームワークに依存しない (framework agnostic)** ため、使用するフレームワークに関係なく同じAPIを提供します。各フレームワーク向けのアダプターが用意されており、テーブルコアを簡単に扱えるようになっています。利用可能なアダプターについては、Adaptersメニューを参照してください。

### テーブルステートへのアクセス

テーブルステートを機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自にステートを管理します。この内部ステートには、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```jsx
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //...
})

console.log(table.getState()) //内部ステート全体にアクセス
console.log(table.getState().rowSelection) //行選択ステートのみにアクセス
```

### カスタム初期ステート

特定のステートについて初期値をカスタマイズするだけでよい場合、ステートを自分で管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```jsx
const table = createSolidTable({
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
        desc: true //デフォルトで年齢の降順ソート
      }
    ]
  },
  //...
})
```

> **注意**: 各ステートは`initialState`または`state`のいずれか一方でのみ指定してください。両方に同じステート値を渡した場合、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御されたステート (Controlled State)

アプリケーションの他の部分でテーブルステートに簡単にアクセスする必要がある場合、TanStack Tableでは任意またはすべてのテーブルステートを独自のステート管理システムで制御・管理できます。これは、`state`と`on[State]Change`テーブルオプションに独自のステートとステート管理関数を渡すことで実現します。

#### 個別に制御されたステート

必要なステートのみを制御できます。すべてのテーブルステートを制御する必要はありません。ケースバイケースで必要なステートのみを制御することを推奨します。

特定のステートを制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

「手動」のサーバーサイドデータ取得シナリオで、フィルタリング、ソート、ページネーションを例に挙げましょう。フィルタリング、ソート、ページネーションのステートは独自のステート管理に保存し、APIが関与しないカラム順序や可視性などの他のステートは除外できます。

```jsx
const [columnFilters, setColumnFilters] = createSignal([]) //デフォルトフィルターなし
const [sorting, setSorting] = createSignal([{
  id: 'age',
  desc: true, //デフォルトで年齢の降順ソート
}]) 
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 15 })

//制御されたステート値を使用してデータを取得
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = createSolidTable({
  columns,
  get data() {
    return tableQuery.data()
  },
  //...
  state: {
    get columnFilters() {
      return columnFilters() //制御されたステートをテーブルに戻す（内部ステートを上書き）
    },
    get sorting() {
      return sorting()
    },
    get pagination() {
      return pagination()
    },
  },
  onColumnFiltersChange: setColumnFilters, //columnFiltersステートを独自のステート管理に引き上げ
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全に制御されたステート

あるいは、`onStateChange`テーブルオプションを使用してテーブルステート全体を制御できます。これにより、テーブルステート全体が独自のステート管理システムに引き上げられます。ただし、`columnSizingInfo`ステートのように頻繁に変更されるステート値をSolidツリーの上位に引き上げると、パフォーマンスの問題が発生する可能性があるため注意が必要です。

これを機能させるには、いくつかの追加の工夫が必要です。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用するすべての機能に関連するステート値を設定する必要があります。すべての初期ステート値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```jsx
//デフォルトステート値でテーブルインスタンスを作成
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //... 注: `state`値はまだ渡されていない
})


const [state, setState] = createSignal({
  ...table.initialState, //テーブルインスタンスからすべてのデフォルトステート値を初期ステートに設定
  pagination: {
    pageIndex: 0,
    pageSize: 15 //必要に応じて初期ページネーションステートをカスタマイズ
  }
})

//table.setOptions APIを使用して、完全に制御されたステートをテーブルインスタンスにマージ
table.setOptions(prev => ({
  ...prev, //上記で設定した他のオプションを保持
  get state() {
    return state() //完全に制御されたステートが内部ステートを上書き
  },
  onStateChange: setState //ステートの変更は独自のステート管理に反映される
}))
```

### ステート変更コールバック

これまで、`on[State]Change`および`onStateChange`テーブルオプションが、テーブルステートの変更を独自のステート管理に「引き上げる」仕組みを見てきました。ただし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **ステート変更コールバックには、対応する`state`オプションのステート値が必要**

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御されたステートであると認識します。対応する`state`値を指定しない場合、そのステートは初期値で「凍結」されます。

```jsx
const [sorting, setSorting] = createSignal([])
//...
const table = createSolidTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting() //`onSortingChange`を使用するため必須
    },
  },
  onSortingChange: setSorting, //`state.sorting`を制御する
})
```

#### 2. **アップデータは生の値またはコールバック関数のいずれか**

`on[State]Change`および`onStateChange`コールバックは、React（Solid Setters）の`setState`関数とまったく同じように機能します。アップデータ値は、新しいステート値または前のステート値を受け取って新しいステート値を返すコールバック関数のいずれかです。

これにはどのような意味があるのでしょうか？つまり、`on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があるということです。

```jsx
const [sorting, setSorting] = createSignal([])
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 10 })

const table = createSolidTable({
  get columns() {
    return columns()
  },
  get data() {
    return data()
  },
  //...
  state: {
    get pagination() {
      return pagination()
    },
    get sorting() {
      return sorting()
    },
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
    setSorting(updater) //通常のステート更新
  }
})
```

### ステートの型

TanStack Tableのすべての複雑なステートには、インポートして使用できる独自のTypeScript型があります。これは、制御するステート値に正しいデータ構造とプロパティを使用していることを確認するのに役立ちます。

```tsx
import { createSolidTable, type SortingState } from '@tanstack/solid-table'
//...
const [sorting, setSorting] = createSignal<SortingState[]>([
  {
    id: 'age', //`id`と`desc`プロパティのオートコンプリートが利用可能
    desc: true,
  }
])
```
