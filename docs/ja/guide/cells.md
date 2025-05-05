---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:24:46.938Z'
title: セル
---
## API

[Cell API](../api/core/cell)

## セルガイド

このクイックガイドでは、TanStack Tableで`cell`オブジェクトを取得および操作するさまざまな方法について説明します。

### セルの取得元

セルは[行（Rows）](../guide/rows)から取得されます。これで十分ですよね？

使用している機能に応じて、行インスタンスAPIを使用して適切なセルを取得できます。最も一般的には、`row.getAllCells`または`row.getVisibleCells` APIを使用します（列可視性機能を使用している場合）。ただし、他にもいくつかの類似したAPIが利用可能です。

### セルオブジェクト

各セルオブジェクトは、UI内の`<td>`または類似のセル要素に関連付けることができます。`cell`オブジェクトには、テーブルの状態と連携したり、テーブルの状態に基づいてセル値を抽出したりするために使用できるプロパティやメソッドがいくつかあります。

#### セルID

各セルオブジェクトには、テーブルインスタンス内で一意となる`id`プロパティがあります。各`cell.id`は、親行と列のIDをアンダースコアで区切った単純な結合として構築されます。

```js
{ id: `${row.id}_${column.id}` }
```

グループ化や集計機能を使用している場合、`cell.id`には追加の文字列が付加されます。

#### セルの親オブジェクト

各セルは、親の[行（row）](../guide/rows)と[列（column）](../guide/columns)オブジェクトへの参照を保持しています。

#### セル値へのアクセス

セルからデータ値を取得する推奨方法は、`cell.getValue`または`cell.renderValue` APIを使用することです。これらのAPIを使用すると、アクセサ関数の結果がキャッシュされ、レンダリングが効率的になります。両者の唯一の違いは、`cell.renderValue`は値が未定義の場合に値または`renderFallbackValue`を返すのに対し、`cell.getValue`は値または未定義の場合は`undefined`を返す点です。

> 注: `cell.getValue`と`cell.renderValue` APIは、それぞれ`row.getValue`と`row.renderValue` APIのショートカットです。

```js
// 任意の列からデータにアクセス
const firstName = cell.getValue('firstName') // firstName列からセル値を取得
const renderedLastName = cell.renderValue('lastName') // lastName列から値をレンダリング
```

#### 任意のセルから他の行データにアクセス

各セルオブジェクトは親行に関連付けられているため、`cell.row.original`を使用してテーブルで使用している元の行データにアクセスできます。

```js
// 別のセルのスコープ内にいても、元の行データにアクセス可能
const firstName = cell.row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### その他のセルAPI

テーブルで使用している機能に応じて、セルを操作するための便利なAPIが数十種類あります。詳細については、各機能の対応するAPIドキュメントまたはガイドを参照してください。

### セルのレンダリング

テーブルのセルをレンダリングするには、`cell.renderValue`または`cell.getValue` APIを使用できます。ただし、これらのAPIは生のセル値（アクセサ関数からの値）のみを出力します。`cell: () => JSX`列定義オプションを使用している場合は、アダプタから`flexRender` APIユーティリティを使用する必要があります。

`flexRender` APIを使用すると、セルが追加のマークアップやJSXとともに正しくレンダリングされ、コールバック関数が正しいパラメータで呼び出されます。

```jsx
import { flexRender } from '@tanstack/react-table'

const columns = [
  {
    accessorKey: 'fullName',
    cell: ({ cell, row }) => {
      return <div><strong>{row.original.firstName}</strong> {row.original.lastName}</div>
    }
    //...
  }
]
//...
<tr>
  {row.getVisibleCells().map(cell => {
    return <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
  })}
</tr>
```
