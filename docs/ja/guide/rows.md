---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:24:41.808Z'
title: 行
---
## API

[行 API](../api/core/row)

## 行ガイド

このクイックガイドでは、TanStack Table で行オブジェクトを取得および操作するさまざまな方法について説明します。

### 行の取得方法

テーブルインスタンスから行を取得するために使用できる複数の `table` インスタンス API があります。

#### table.getRow

特定の行を `id` でアクセスする必要がある場合は、`table.getRow` テーブルインスタンス API を使用できます。

```js
const row = table.getRow(rowId)
```

#### 行モデル

`table` インスタンスは `row` オブジェクトを生成し、それらを ["行モデル"](../guide/row-models) と呼ばれる便利な配列に格納します。これについては [行モデルガイド](../guide/row-models) で詳しく説明されていますが、ここでは行モデルにアクセスする最も一般的な方法を紹介します。

##### 行のレンダリング

```jsx
<tbody>
  {table.getRowModel().rows.map(row => (
    <tr key={row.id}>
     {/* ... */}
    </tr>
  ))}
</tbody>
```

##### 選択された行の取得

```js
const selectedRows = table.getSelectedRowModel().rows
```

### 行オブジェクト

各行オブジェクトには行データと、テーブルの状態と対話したり、テーブルの状態に基づいて行からセルを抽出したりするための多くの API が含まれています。

#### 行 ID

各行オブジェクトには、テーブルインスタンス内で一意となる `id` プロパティがあります。デフォルトでは、`row.id` は行モデルで作成された `row.index` と同じです。ただし、行のデータから一意の識別子を使用して各行の `id` をオーバーライドすると便利な場合があります。これを行うには、`getRowId` テーブルオプションを使用できます。

```js
const table = useReactTable({
  columns,
  data,
  getRowId: originalRow => originalRow.uuid, // 行のデータから uuid を使用して row.id をオーバーライド
})
```

> 注: グループ化や展開などの一部の機能では、`row.id` に追加の文字列が付加されます。

#### 行の値へのアクセス

行からデータ値を取得する推奨方法は、`row.getValue` または `row.renderValue` API を使用することです。これらの API のいずれかを使用すると、アクセサー関数の結果がキャッシュされ、レンダリングが効率的になります。両者の唯一の違いは、`row.renderValue` は値が undefined の場合に値または `renderFallbackValue` を返すのに対し、`row.getValue` は値または undefined を返す点です。

```js
// 任意の列からデータにアクセス
const firstName = row.getValue('firstName') // firstName 列から行の値を読み取る
const renderedLastName = row.renderValue('lastName') // lastName 列から値をレンダリング
```

> 注: `cell.getValue` と `cell.renderValue` は、それぞれ `row.getValue` と `row.renderValue` API のショートカットです。

#### 元の行データへのアクセス

各行オブジェクトに対して、`row.original` プロパティを介してテーブルインスタンスに渡された元の対応する `data` にアクセスできます。`row.original` 内のデータは、列定義のアクセサーによって変更されていないため、アクセサーで何らかのデータ変換を行っていた場合、それらは `row.original` オブジェクトには反映されません。

```js
// 元の行から任意のデータにアクセス
const firstName = row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### サブ行

グループ化または展開機能を使用している場合、行にはサブ行または親行参照が含まれることがあります。これについては [展開ガイド](../guide/expanding) で詳しく説明されていますが、ここではサブ行を操作するための便利なプロパティとメソッドの概要を紹介します。

- `row.subRows`: 行のサブ行の配列。
- `row.depth`: 行の深さ（ネストまたはグループ化されている場合）をルート行配列からの相対値で示します。ルートレベルの行は 0、子行は 1、孫行は 2 など。
- `row.parentId`: 行の親行の一意の ID（この行をその subRows 配列に含む行）。
- `row.getParentRow`: 存在する場合、行の親行を返します。

### その他の行 API

テーブルで使用している機能に応じて、行と対話するための数十の便利な API があります。詳細については、各機能の対応する API ドキュメントまたはガイドを参照してください。
