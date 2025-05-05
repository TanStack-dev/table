---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:25:59.411Z'
title: テーブル状態
---
## Table State (Lit) ガイド

TanStack Tableは、テーブルの状態を保存・管理するためのシンプルな内部状態管理システムを備えています。また、独自の状態管理で扱う必要がある状態を選択的に取り出すことも可能です。このガイドでは、テーブルの状態を操作・管理するさまざまな方法について説明します。

### テーブル状態へのアクセス

テーブル状態を機能させるために特別な設定は必要ありません。`state`、`initialState`、または`on[State]Change`テーブルオプションに何も渡さない場合、テーブルは内部で独自に状態を管理します。この内部状態の任意の部分には、`table.getState()`テーブルインスタンスAPIを使用してアクセスできます。

```ts
private tableController = new TableController<Person>(this);

render() {
  const table = this.tableController.table({
    columns,
    data,
    ...
  })

  console.log(table.getState()) //内部状態全体にアクセス
  console.log(table.getState().rowSelection) //行選択状態のみにアクセス
  // ...
}
```

### カスタム初期状態

特定の状態について初期値をカスタマイズするだけでよい場合、依然として状態を自分で管理する必要はありません。テーブルインスタンスの`initialState`オプションに値を設定するだけで済みます。

```ts
render() {
  const table = this.tableController.table({
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
          desc: true //デフォルトでageで降順ソート
        }
      ]
    },
  })

  return html`...`;
}
```

> **注意**: `initialState`と`state`の両方に同じ状態を指定しないでください。特定の状態値を`initialState`と`state`の両方に渡した場合、`state`で初期化された値が`initialState`の対応する値を上書きします。

### 制御された状態

アプリケーションの他の部分でテーブル状態に簡単にアクセスする必要がある場合、TanStack Tableでは独自の状態管理システムでテーブル状態の一部または全部を簡単に制御・管理できます。これを行うには、`state`と`on[State]Change`テーブルオプションに独自の状態と状態管理関数を渡します。

#### 個別に制御された状態

簡単にアクセスが必要な状態のみを制御できます。必要のないテーブル状態をすべて制御する必要はありません。ケースバイケースで必要な状態のみを制御することを推奨します。

特定の状態を制御するには、対応する`state`値と`on[State]Change`関数の両方をテーブルインスタンスに渡す必要があります。

「手動」のサーバーサイドデータフェッチシナリオで、フィルタリング、ソート、ページネーションを例に挙げましょう。フィルタリング、ソート、ページネーションの状態は独自の状態管理に保存できますが、APIが関与しないカラム順序やカラム表示状態などは制御外に残せます。

```jsx
import {html} from "lit";

@customElement('my-component')
class MyComponent extends LitElement {
  @state()
  private _sorting: SortingState = []

  render() {
    const table = this.tableController.table({
      columns,
      data,
      state: {
        sorting: this._sorting,
      },
      onSortingChange: updaterOrValue => {
        if (typeof updaterOrValue === 'function') {
          this._sorting = updaterOrValue(this._sorting)
        } else {
          this._sorting = updaterOrValue
        }
      },
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    })

    return html`...`
  }
}
//...
```

#### 完全に制御された状態

あるいは、`onStateChange`テーブルオプションを使用してテーブル状態全体を制御できます。これにより、テーブル状態全体が独自の状態管理システムに引き上げられます。ただし、`columnSizingInfo`状態のように頻繁に変更される状態値をコンポーネントツリーの上位に引き上げるとパフォーマンス問題を引き起こす可能性があるため、このアプローチには注意が必要です。

これを機能させるには、さらにいくつかの工夫が必要かもしれません。`onStateChange`テーブルオプションを使用する場合、`state`の初期値には使用するすべての機能に関連する状態値を設定する必要があります。すべての初期状態値を手動で入力するか、以下のように`table.setOptions` APIを特別な方法で使用できます。

```ts

private tableController = new TableController<Person>(this);

@state()
private _tableState;

render() {
  const table = this.tableController.table({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })
  const state = { ...table.initialState, ...this._tableState };
  table.setOptions(prev => ({
    ...prev,
    state,
    onStateChange: updater => {
      this._tableState =
        updater instanceof Function ? updater(state) : updater //状態変更が独自の状態管理に反映される
    },
  }))

  return html`...`;
}
```

### 状態変更コールバック

これまで、`on[State]Change`と`onStateChange`テーブルオプションがテーブル状態の変更を独自の状態管理に「引き上げる」働きを見てきました。しかし、これらのオプションを使用する際に注意すべき点がいくつかあります。

#### 1. **状態変更コールバックには、`state`オプションに対応する状態値が必要**

`on[State]Change`コールバックを指定すると、テーブルインスタンスはこれが制御された状態であると認識します。対応する`state`値を指定しない場合、その状態は初期値で「凍結」されます。

```jsx
@state()
private _sorting = [];
//...
render() {
  const table = this.tableController.table({
    columns,
    data,
    state: {
      sorting: this._sorting,
    },
    onSortingChange: updaterOrValue => {
      if (typeof updaterOrValue === 'function') {
        this._sorting = updaterOrValue(this._sorting)
      } else {
        this._sorting = updaterOrValue
      }
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return html`...`;
}
```

#### 2. **アップデータは生の値またはコールバック関数のいずれか**

`on[State]Change`と`onStateChange`コールバックは、Reactの`setState`関数とまったく同じように機能します。アップデータ値は、新しい状態値または前の状態値を受け取って新しい状態値を返すコールバック関数のいずれかになります。

これにはどのような意味があるのでしょうか？`on[State]Change`コールバックに追加のロジックを含めたい場合、新しいアップデータ値が関数か値かを確認する必要があるということです。

これが、上記の例で`updater instanceof Function ? updater(state.value) : updater`というパターンが見られる理由です。このパターンは、アップデータが関数かどうかを確認し、関数であれば前の状態値で呼び出して新しい状態値を取得します。

### 状態の型

TanStack Tableのすべての複雑な状態には、インポートして使用できる独自のTypeScript型があります。これは、制御している状態値に適切なデータ構造とプロパティを使用していることを確認するのに便利です。

```tsx
import { TableController, type SortingState } from '@tanstack/lit-table'
//...
@state()
private _sorting: SortingState = [
  {
    id: 'age', //`id`と`desc`プロパティのオートコンプリートが得られる
    desc: true,
  }
]
```
