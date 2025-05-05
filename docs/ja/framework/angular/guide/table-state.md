---
source-updated-at: '2024-07-27T18:15:45.000Z'
translation-updated-at: '2025-05-05T19:26:12.183Z'
title: テーブル状態
---
## テーブルステート (Angular) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部ステート管理システムを備えています。また、独自のステート管理で管理が必要な状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法について説明します。

### テーブルステートへのアクセス

テーブルステートを機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```ts
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  //...
}))

someHandler() {
  console.log(this.table.getState()) //内部状態全体にアクセス
  console.log(this.table.getState().rowSelection) //行選択状態のみにアクセス
}
```

### カスタム初期状態

特定の状態について初期値をカスタマイズするだけでよい場合、依然としてステートを自分で管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```jsx
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //初期カラム順をカスタマイズ
    columnVisibility: {
      id: false //デフォルトでidカラムを非表示
    },
    expanded: true, //デフォルトですべての行を展開
    sorting: [
      {
        id: 'age',
        desc: true //デフォルトでageで降順ソート
      }
    ]
  },
  //...
}))
```

> **注**: 各状態は`initialState`または`state`のいずれか一方でのみ指定してください。特定の状態値を`initialState`と`state`の両方に渡した場合、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御されたステート

アプリケーションの他の領域でテーブルステートに簡単にアクセスする必要がある場合、TanStack Tableでは独自のステート管理システムでテーブルステートの一部または全部を簡単に制御・管理できます。これは、`state`と`on[State]Change`テーブルオプションに独自のステートとステート管理関数を渡すことで実現します。

#### 個別に制御されたステート

必要なステートのみを制御できます。すべてのテーブルステートを制御する必要はありません。ケースバイケースで必要なステートのみを制御することを推奨します。

特定のステートを制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

「手動」のサーバーサイドデータ取得シナリオで、フィルタリング、ソート、ページネーションを例に挙げましょう。フィルタリング、ソート、ページネーションの状態は独自のステート管理で保存できますが、APIが関心を持たないカラム順序やカラム表示状態などは除外できます。

```ts
import {signal} from '@angular/core';
import {SortingState, ColumnFiltersState, PaginationState} from '@tanstack/angular-table'
import {toObservable} from "@angular/core/rxjs-interop";
import {combineLatest, switchMap} from 'rxjs';

class TableComponent {
  readonly columnFilters = signal<ColumnFiltersState>([]) //デフォルトフィルターなし
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: true, //デフォルトでageで降順ソート
    }
  ])
  readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 15
  })

  //制御されたステート値を使用してデータを取得
  readonly data$ = combineLatest({
    filters: toObservable(this.columnFilters),
    sorting: toObservable(this.sorting),
    pagination: toObservable(this.pagination)
  }).pipe(
    switchMap(({filters, sorting, pagination}) => fetchData(filters, sorting, pagination))
  )
  readonly data = toSignal(this.data$);

  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      columnFilters: this.columnFilters(), //制御されたステートをテーブルに戻す（内部状態を上書き）
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onColumnFiltersChange: updater => { //columnFiltersステートを独自のステート管理に引き上げ
      updater instanceof Function
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
    onSortingChange: updater => {
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    },
    onPaginationChange: updater => {
      updater instanceof Function
        ? this.pagination.update(updater)
        : this.pagination.set(updater)
    },
  }))
}

//...
```

#### 完全に制御されたステート

あるいは、`onStateChange`テーブルオプションでテーブルステート全体を制御できます。これにより、テーブルステート全体が独自のステート管理システムに引き上げられます。ただし、`columnSizingInfo`ステートのように頻繁に変更される状態値をコンポーネントツリーの上位に引き上げるとパフォーマンス問題を引き起こす可能性があるため、このアプローチには注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要かもしれません。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には、使用したいすべての機能に関連するすべてのステート値を入力する必要があります。すべての初期状態値を手動で入力するか、以下のように特別な方法でコンストラクターを使用できます。

```ts
class TableComponent {
  // 空のテーブルステートを作成、後で上書きします
  readonly state = signal({} as TableState);

  // デフォルトのステート値でテーブルインスタンスを作成
  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    // 完全に制御されたステートが内部状態を上書き
    state: this.state(),
    onStateChange: updater => {
      // 状態変更は独自のステート管理に反映されます
      this.state.set(
        updater instanceof Function ? updater(this.state()) : updater
      )
    }
  }))

  constructor() {
    // 初期テーブルステートを設定
    this.state.set({
      // テーブルインスタンスからすべてのデフォルトステート値を取り込む
      ...this.table.initialState,
      pagination: {
        pageIndex: 0,
        pageSize: 15, // オプションで初期ページネーション状態をカスタマイズ
      },
    })
  }
}
```

### ステート変更コールバック

これまで、`on[State]Change`と`onStateChange`テーブルオプションが、テーブルステートの変更を独自のステート管理に「引き上げる」働きを見てきました。しかし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **ステート変更コールバックには、`state`オプションに対応するステート値が必要です**

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御されたステートであると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```ts
class TableComponent {
  sorting = signal<SortingState>([])

  table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      sorting: this.sorting(), // `onSortingChange`を使用するため必須
    },
    onSortingChange: updater => { // `state.sorting`を制御
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    }
  }))
}
```

#### 2. **アップデータは生の値またはコールバック関数のいずれかです**

`on[State]Change`と`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しいステート値か、前のステート値を受け取って新しいステート値を返すコールバック関数のいずれかになります。

これにはどのような意味があるでしょうか？ `on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があるということです。

これが、上記の例で`updater instanceof Function ? this.state.update(updater) : this.state.set(updater)`というパターンが見られる理由です。このパターンは、アップデータが関数かどうかをチェックし、関数の場合は前のステート値で関数を呼び出して新しいステート値を取得します。そうでない場合、シグナルは`signal.set`ではなく`signal.update`をアップデータで呼び出す必要があります。

### ステートタイプ

TanStack Tableのすべての複雑なステートには、インポートして使用できる独自のTypeScriptタイプがあります。これは、制御しているステート値に対して正しいデータ構造とプロパティを使用していることを確認するのに便利です。

```ts
import {createAngularTable, type SortingState} from '@tanstack/angular-table'

class TableComponent {
  readonly sorting = signal<SortingState>([
    {
      id: 'age', // `id`と`desc`プロパティのオートコンプリートが得られます
      desc: true,
    }
  ])
}
```
