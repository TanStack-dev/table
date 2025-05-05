---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:26:07.479Z'
title: テーブル状態
---
## テーブルステート (Qwik) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部ステート管理システムを備えています。また、独自のステート管理で管理する必要がある状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法について説明します。

### テーブルステートへのアクセス

テーブルステートを機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```jsx
const table = useQwikTable({
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
const table = useQwikTable({
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

> **注意**: 各状態は`initialState`または`state`のいずれか一方でのみ指定してください。両方に同じ状態値を渡した場合、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御されたステート

アプリケーションの他の部分でテーブルステートに簡単にアクセスする必要がある場合、TanStack Tableでは独自のステート管理システムでテーブルステートの一部または全部を簡単に制御・管理できます。これを行うには、独自の状態と状態管理関数を`state`および`on[State]Change`テーブルオプションに渡します。

#### 個別に制御されたステート

簡単にアクセスが必要な状態のみを制御できます。必要のないテーブルステートをすべて制御する必要はありません。ケースバイケースで必要な状態のみを制御することを推奨します。

特定の状態を制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

フィルタリング、ソート、ページネーションを「手動」のサーバーサイドデータ取得シナリオで例として取り上げます。フィルタリング、ソート、ページネーションの状態は独自のステート管理に保存できますが、APIが関与しないカラム順序や可視性などの状態は除外できます。

```jsx
const columnFilters = Qwik.useSignal([]) //デフォルトフィルターなし
const sorting = Qwik.useSignal([{
  id: 'age',
  desc: true, //デフォルトで年齢の降順にソート
}]) 
const pagination = Qwik.useSignal({ pageIndex: 0, pageSize: 15 })

//制御された状態値を使用してデータを取得
const tableQuery = useQuery({
  queryKey: ['users', columnFilters.value, sorting.value, pagination.value],
  queryFn: () => fetchUsers(columnFilters.value, sorting.value, pagination.value),
  //...
})

const table = useQwikTable({
  columns: columns.value,
  data: tableQuery.data,
  //...
  state: {
    columnFilters: columnFilters.value, //制御された状態をテーブルに戻す（内部状態を上書き）
    sorting: sorting.value,
    pagination: pagination.value,
  },
  onColumnFiltersChange: updater => {
    columnFilters.value = updater instanceof Function ? updater(columnFilters.value) : updater //columnFilters状態を独自のステート管理に引き上げ
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting.value) : updater
  },
  onPaginationChange: updater => {
    pagination.value = updater instanceof Function ? updater(pagination.value) : updater
  },
})
//...
```

#### 完全に制御されたステート

代わりに、`onStateChange`テーブルオプションを使用してテーブルステート全体を制御できます。これにより、テーブルステート全体が独自のステート管理システムに引き上げられます。ただし、`columnSizingInfo`状態のように頻繁に変更される状態値をコンポーネントツリーの上位に引き上げるとパフォーマンス問題を引き起こす可能性があるため、このアプローチには注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要です。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用するすべての機能に関連する状態値を設定する必要があります。すべての初期状態値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```jsx
//デフォルト状態値でテーブルインスタンスを作成
const table = useQwikTable({
  columns,
  data,
  //... 注: `state`値はまだ渡されていない
})


const sate = Qwik.useSignal({
  ...table.initialState, //テーブルインスタンスからすべてのデフォルト状態値を初期状態に設定
  pagination: {
    pageIndex: 0,
    pageSize: 15 //オプションで初期ページネーション状態をカスタマイズ
  }
})

//table.setOptions APIを使用して、完全に制御された状態をテーブルインスタンスにマージ
table.setOptions(prev => ({
  ...prev, //上記で設定した他のオプションを保持
  state: state.value, //完全に制御された状態が内部状態を上書き
  onStateChange: updater => {
    state.value = updater instanceof Function ? updater(state.value) : updater //状態変更は独自のステート管理に反映
  },
}))
```

### ステート変更コールバック

これまで、`on[State]Change`および`onStateChange`テーブルオプションがテーブル状態の変更を独自のステート管理に「引き上げる」仕組みを見てきました。ただし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **ステート変更コールバックには、対応する`state`オプションに状態値が含まれている必要があります**。

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御された状態であると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```jsx
const sorting = Qwik.useSignal([])
//...
const table = useQwikTable({
  columns,
  data,
  //...
  state: {
    sorting: sorting.value, //`onSortingChange`を使用するため必須
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting) : updater //`state.sorting`を制御
  }, 
})
```

#### 2. **アップデータは生の値またはコールバック関数のいずれかです**。

`on[State]Change`および`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しい状態値または前の状態値を受け取って新しい状態値を返すコールバック関数のいずれかです。

これにはどのような意味があるでしょうか？ `on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があるということです。

これが、上記の例で`updater instanceof Function ? updater(state.value) : updater`というパターンが見られる理由です。このパターンは、アップデータが関数かどうかを確認し、関数の場合は前の状態値を渡して新しい状態値を取得します。

### ステートの型

TanStack Tableのすべての複雑な状態には、インポートして使用できる独自のTypeScript型があります。これは、制御している状態値に正しいデータ構造とプロパティを使用していることを確認するのに役立ちます。

```tsx
import { useQwikTable, type SortingState } from '@tanstack/qwik-table'
//...
const sorting = Qwik.useSignal<SortingState[]>([
  {
    id: 'age', //`id`と`desc`プロパティのオートコンプリートが有効
    desc: true,
  }
])
```
