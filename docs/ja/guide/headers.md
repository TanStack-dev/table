---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:25:20.567Z'
title: ヘッダー
---
## API

[Header API](../api/core/header)

## ヘッダーガイド

このクイックガイドでは、TanStack Tableで`header`オブジェクトを取得および操作するさまざまな方法について説明します。

ヘッダーはセルに相当しますが、`<tbody>`セクションではなく`<thead>`セクション向けに設計されています。

### ヘッダーの取得元

ヘッダーは[Header Groups](../guide/header-groups)から取得されます。ヘッダーグループは行に相当しますが、`<tbody>`セクションではなく`<thead>`セクション向けに設計されています。

#### ヘッダーグループのヘッダー

ヘッダーグループ内では、ヘッダーは`headerGroup.headers`プロパティの配列として格納されています。通常はこの配列をマップしてヘッダーをレンダリングします。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // headerGroup.headers配列をマップ
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```

#### ヘッダーテーブルインスタンスAPI

使用する機能に応じて、ヘッダーのリストを取得するための複数の`table`インスタンスAPIが利用可能です。最も一般的なAPIは`table.getFlatHeaders`で、テーブル内のすべてのヘッダーのフラットリストを返しますが、カラム可視性やカラムピニング機能と併用するのに便利なAPIが他にも十数種類あります。`table.getLeftLeafHeaders`や`table.getRightFlatHeaders`などのAPIは、ユースケースに応じて便利です。

### ヘッダーオブジェクト

ヘッダーオブジェクトは[Cell](../guide/cells)オブジェクトと似ていますが、`<tbody>`セクションではなく`<thead>`セクション向けに設計されています。各ヘッダーオブジェクトはUI内の`<th>`または類似のセル要素に関連付けることができます。`header`オブジェクトには、テーブルの状態とやり取りしたり、テーブルの状態に基づいてセル値を抽出したりするために使用できるいくつかのプロパティとメソッドがあります。

#### ヘッダーID

各ヘッダーオブジェクトには、テーブルインスタンス内で一意の`id`プロパティがあります。通常、この`id`はReactのキーとしての一意識別子、または[パフォーマンスの良いカラムリサイズ例](../framework/react/examples/column-resizing-performant)に従う場合にのみ必要です。

高度なネストやグループ化されたヘッダーロジックがない単純なヘッダーの場合、`header.id`は親の`column.id`と同じになります。ただし、ヘッダーがグループカラムまたはプレースホルダーセルの一部である場合、ヘッダーファミリー、深さ/ヘッダー行インデックス、カラムID、ヘッダーグループIDから構築されたより複雑なIDになります。

#### ネストされたグループヘッダーのプロパティ

ヘッダーがネストまたはグループ化されたヘッダー構造の一部である場合にのみ有用ないくつかのプロパティが`header`オブジェクトにあります。これらのプロパティには以下が含まれます：

- `colspan`: ヘッダーがまたがるべきカラム数。`<th>`要素の`colSpan`属性をレンダリングする際に便利です。
- `rowSpan`: ヘッダーがまたがるべき行数。`<th>`要素の`rowSpan`属性をレンダリングする際に便利です（現在、デフォルトのTanStack Tableでは実装されていません）。
- `depth`: ヘッダーグループが属する「行インデックス」。
- `isPlaceholder`: ヘッダーがプレースホルダーヘッダーである場合にtrueとなるブールフラグ。プレースホルダーヘッダーは、カラムが非表示の場合やグループカラムの一部である場合の隙間を埋めるために使用されます。
- `placeholderId`: プレースホルダーヘッダーの一意識別子。
- `subHeaders`: このヘッダーに属するサブ/子ヘッダーの配列。ヘッダーがリーフヘッダーの場合は空になります。

> 注: `header.index`はヘッダーグループ（ヘッダーの行）内でのインデックス、つまり左から右への位置を指します。ヘッダーグループの「行インデックス」を指す`header.depth`とは異なります。

#### ヘッダーの親オブジェクト

各ヘッダーは、その親[column](../guide/columns)オブジェクトと親[header group](../guide/header-groups)オブジェクトへの参照を保持しています。

### その他のヘッダーAPI

ヘッダーには、テーブルの状態とやり取りするのに便利なAPIがいくつか追加されています。そのほとんどはカラムサイズ変更機能に関連しています。詳細は[Column Sizing Guide](../guide/column-sizing)を参照してください。

### ヘッダーのレンダリング

定義した`header`カラムオプションは文字列、JSX、またはそれらを返す関数のいずれかであるため、ヘッダーをレンダリングする最良の方法は、アダプターから`flexRender`ユーティリティを使用することです。これにより、すべてのケースが処理されます。

```jsx
{headerGroup.headers.map(header => (
  <th key={header.id} colSpan={header.colSpan}>
    {/* `header`のすべての可能なカラム定義シナリオを処理 */}
    {flexRender(header.column.columnDef.header, header.getContext())}
  </th>
))}
```
