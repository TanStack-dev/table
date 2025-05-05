---
source-updated-at: '2024-08-10T14:15:46.000Z'
translation-updated-at: '2025-05-05T19:26:41.038Z'
title: テーブル状態
---
## テーブルステート (Vue) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部ステート管理システムを備えています。また、独自のステート管理で管理する必要がある状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法について説明します。

### テーブルステートへのアクセス

テーブルステートを機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```ts
const table = useVueTable({
  columns,
  data: dataRef, // リアクティブデータのサポート
  //...
})

console.log(table.getState()) // 内部状態全体にアクセス
console.log(table.getState().rowSelection) // 行選択状態のみにアクセス
```

### リアクティブデータの使用

> **v8.20.0で新機能追加**

`useVueTable`フックはリアクティブデータをサポートするようになりました。これにより、Vueの`ref`や`computed`を含むデータを`data`オプションに渡すことができます。テーブルはデータの変更に自動的に反応します。

```ts
const columns = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' }
]

const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const table = useVueTable({
  columns,
  data: dataRef, // リアクティブデータのrefを渡す
})

// 後でdataRefを更新すると、テーブルが自動的に更新されます
dataRef.value = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Doe' }
]
```

> ⚠️ パフォーマンス上の理由から、内部的に`shallowRef`が使用されています。つまり、データは深くリアクティブではなく、`.value`のみがリアクティブです。データを更新するには、データを直接変更する必要があります。

```ts
const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// これはテーブルを更新しません ❌
dataRef.value.push({ id: 4, name: 'John' })

// これはテーブルを更新します ✅
dataRef.value = [
  ...dataRef.value,
  { id: 4, name: 'John' }
]
```

### カスタム初期状態

特定の状態に対して初期値をカスタマイズするだけでよい場合、独自に状態を管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```jsx
const table = useVueTable({
  columns,
  data,
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], // 初期カラム順序をカスタマイズ
    columnVisibility: {
      id: false // 初期状態でidカラムを非表示
    },
    expanded: true, // 初期状態ですべての行を展開
    sorting: [
      {
        id: 'age',
        desc: true // 初期状態でageで降順ソート
      }
    ]
  },
  //...
})
```

> **注意**: `initialState`と`state`の両方に同じ状態を指定しないでください。両方に渡した場合、`state`で初期化された状態が`initialState`の対応する値を上書きします。

### 制御された状態

アプリケーションの他の部分でテーブル状態に簡単にアクセスする必要がある場合、TanStack Tableでは独自のステート管理システムでテーブル状態を簡単に制御・管理できます。これを行うには、独自の状態と状態管理関数を`state`および`on[State]Change`テーブルオプションに渡します。

#### 個別に制御された状態

簡単にアクセスが必要な状態のみを制御できます。すべてのテーブル状態を制御する必要はありません。必要に応じてケースバイケースで状態を制御することを推奨します。

特定の状態を制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

フィルタリング、ソート、ページネーションを「手動」のサーバーサイドデータ取得シナリオの例として取り上げます。フィルタリング、ソート、ページネーションの状態を独自のステート管理に保存できますが、APIが関与しないカラム順序やカラム表示状態などは除外できます。

```ts
const columnFilters = ref([]) // デフォルトフィルターなし
const sorting = ref([{
  id: 'age',
  desc: true, // デフォルトでageで降順ソート
}])
const pagination = ref({ pageIndex: 0, pageSize: 15 }

// 制御された状態値を使用してデータを取得
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useVueTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    }
  },
  onColumnFiltersChange: updater => {
    columnFilters.value =
      updater instanceof Function
        ? updater(columnFilters.value)
        : updater
  },
  onSortingChange: updater => {
    sorting.value =
      updater instanceof Function
        ? updater(sorting.value)
        : updater
  },
  onPaginationChange: updater => {
    pagination.value =
      updater instanceof Function
        ? updater(pagination.value)
        : updater
  },
})
//...
```

#### 完全に制御された状態

または、`onStateChange`テーブルオプションを使用してテーブル状態全体を制御できます。これにより、テーブル状態全体が独自のステート管理システムに引き上げられます。ただし、`columnSizingInfo`状態のように頻繁に変更される状態値をReactツリーの上位に引き上げると、パフォーマンスの問題を引き起こす可能性があるため、注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要かもしれません。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用したいすべての機能に関連する状態値をすべて設定する必要があります。すべての初期状態値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```jsx
// デフォルト状態値でテーブルインスタンスを作成
const table = useVueTable({
  get columns() {
    return columns.value
  },
  data,
  //... 注: `state`値はまだ渡されていません
})

const state = ref({
  ...table.initialState,
  pagination: {
    pageIndex: 0,
    pageSize: 15
  }
})
const setState = updater => {
  state.value = updater instanceof Function ? updater(state.value) : updater
}

// table.setOptions APIを使用して、完全に制御された状態をテーブルインスタンスにマージ
table.setOptions(prev => ({
  ...prev, // 上記で設定した他のオプションを保持
  get state() {
    return state.value
  },
  onStateChange: setState // 状態変更は独自のステート管理に引き上げられます
}))
```

### 状態変更コールバック

これまで、`on[State]Change`および`onStateChange`テーブルオプションがテーブル状態の変更を独自のステート管理に「引き上げる」仕組みを見てきました。ただし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **状態変更コールバックには、対応する状態値が`state`オプションに含まれている必要があります**。

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御された状態であると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```jsx
const sorting = ref([])
const setSorting = updater => {
  sorting.value = updater instanceof Function ? updater(sorting.value) : updater
}
//...
const table = useVueTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting // `onSortingChange`を使用するため必要
    },
  },
  onSortingChange: setSorting, // `state.sorting`を制御します
})
```

#### 2. **アップデータは生の値またはコールバック関数のいずれかになります**。

`on[State]Change`および`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しい状態値または前の状態値を受け取り新しい状態値を返すコールバック関数のいずれかになります。

これにはどのような意味があるでしょうか？ `on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があることを意味します。

これが、上記の`setState`関数に`updater instanceof Function`チェックがある理由です。このチェックにより、同じ関数内で生の値とコールバック関数の両方を処理できます。

### 状態の型

TanStack Tableのすべての複雑な状態には、インポートして使用できる独自のTypeScript型があります。これは、制御している状態値に対して正しいデータ構造とプロパティを使用していることを確認するのに便利です。

```tsx
import { useVueTable, type SortingState } from '@tanstack/vue-table'
//...
const sorting = ref<SortingState[]>([
  {
    id: 'age', // `id`と`desc`プロパティのオートコンプリートが表示されます
    desc: true,
  }
])
```
