---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:50.442Z'
title: カラムサイズ調整
---
## 例

実装に直接進みたいですか？以下の例を確認してください：

- [column-sizing](../framework/react/examples/column-sizing)
- [column-resizing-performant](../framework/react/examples/column-resizing-performant)

## API

[Column Sizing API](../api/features/column-sizing)

## カラムサイズ設定ガイド

カラムサイズ設定機能を使用すると、各カラムの幅（最小幅と最大幅を含む）をオプションで指定できます。また、ユーザーがカラムヘッダーをドラッグするなどして、すべてのカラムの幅を動的に変更することも可能です。

### カラム幅

デフォルトでは、カラムには以下の測定オプションが設定されています：

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

これらのデフォルト値は、`tableOptions.defaultColumn`と個々のカラム定義の両方で上書きできます（この順序で適用されます）。

```tsx
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //このカラムのサイズを設定
  },
  //...
]

const table = useReactTable({
  //デフォルトのカラムサイズを上書き
  defaultColumn: {
    size: 200, //開始時のカラムサイズ
    minSize: 50, //カラムリサイズ時に適用される最小サイズ
    maxSize: 500, //カラムリサイズ時に適用される最大サイズ
  },
})
```

カラムの「サイズ」は数値としてテーブルの状態に保存され、通常はピクセル単位の値として解釈されますが、これらのカラムサイズ値をCSSスタイルに適切に接続することができます。

ヘッドレスユーティリティとして、カラムサイズ設定のためのテーブルロジックは、実際にはレイアウトに適用できる状態のコレクションに過ぎません（上記の例では、このロジックを2つのスタイルで実装しています）。これらの幅の測定値をさまざまな方法で適用できます：

- セマンティックな`table`要素またはテーブルCSSモードで表示される任意の要素
- `div/span`要素または非テーブルCSSモードで表示される任意の要素
  - 厳密な幅を持つブロックレベル要素
  - 厳密な幅を持つ絶対位置指定要素
  - 緩やかな幅を持つFlexbox配置要素
  - 緩やかな幅を持つGrid配置要素
- セルの幅をテーブル構造に変換できる任意のレイアウトメカニズム

これらの各アプローチには、通常はUI/コンポーネントライブラリやデザインシステムが保持する意見である、独自のトレードオフと制限があります。

### カラムリサイズ

TanStack Tableは、組み込みのカラムリサイズ状態とAPIを提供しており、さまざまなUXとパフォーマンスオプションを使用して、テーブルUIに簡単にカラムリサイズを実装できます。

#### カラムリサイズの有効化

デフォルトでは、`column.getCanResize()` APIはすべてのカラムに対して`true`を返しますが、`enableColumnResizing`テーブルオプションですべてのカラムのリサイズを無効にしたり、`enableResizing`カラムオプションでカラムごとにリサイズを無効にしたりできます。

```tsx
const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, //このカラムのみリサイズを無効化
    size: 200, //開始時のカラムサイズ
  },
  //...
]
```

#### カラムリサイズモード

デフォルトでは、カラムリサイズモードは`"onEnd"`に設定されています。これは、`column.getSize()` APIが、ユーザーがカラムのリサイズ（ドラッグ）を終了するまで新しいカラムサイズを返さないことを意味します。通常、ユーザーがカラムをリサイズしている間、小さなUIインジケーターが表示されます。

React TanStack Tableアダプターでは、テーブルやウェブページの複雑さによっては、60 fpsのカラムリサイズレンダリングを達成することが難しい場合があります。`"onEnd"`カラムリサイズモードは、ユーザーがカラムをリサイズしている間のカクつきや遅延を避けるための良いデフォルトオプションです。ただし、TanStack React Tableを使用しながら60 fpsのカラムリサイズレンダリングを達成できないわけではありませんが、これを達成するには追加のメモ化やその他のパフォーマンス最適化が必要になる場合があります。

> 高度なカラムリサイズのパフォーマンスに関するヒントは、[後述](#advanced-column-resizing-performance)します。

即時のカラムリサイズレンダリングのためにカラムリサイズモードを`"onChange"`に変更するには、`columnResizeMode`テーブルオプションを使用します。

```tsx
const table = useReactTable({
  //...
  columnResizeMode: 'onChange', //カラムリサイズモードを"onChange"に変更
})
```

#### カラムリサイズの方向

デフォルトでは、TanStack Tableはテーブルのマークアップが左から右にレイアウトされていると仮定します。右から左のレイアウトの場合、カラムリサイズの方向を`"rtl"`に変更する必要があるかもしれません。

```tsx
const table = useReactTable({
  //...
  columnResizeDirection: 'rtl', //特定のロケールのためにカラムリサイズ方向を"rtl"に変更
})
```

#### カラムリサイズAPIをUIに接続

カラムリサイズのドラッグ操作をUIに接続するために使用できる便利なAPIがいくつかあります。

##### カラムサイズAPI

カラムヘッドセル、データセル、またはフッターセルにカラムのサイズを適用するには、以下のAPIを使用できます：

```ts
header.getSize()
column.getSize()
cell.column.getSize()
```

これらのサイズスタイルをマークアップに適用する方法はあなた次第ですが、カラムサイズを適用するためにCSS変数またはインラインスタイルを使用することが一般的です。

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

ただし、[高度なカラムリサイズのパフォーマンスセクション](#advanced-column-resizing-performance)で説明したように、マークアップにカラムサイズを適用するためにCSS変数を使用することを検討することをお勧めします。

##### カラムリサイズAPI

TanStack Tableは、ドラッグ操作を簡単に実装するための事前構築済みのイベントハンドラーを提供します。これらのイベントハンドラーは、カラムサイズ設定状態を更新し、テーブルを再レンダリングするために他の内部APIを呼び出す便利な関数です。`header.getResizeHandler()`を使用して、マウスイベントとタッチイベントの両方に対してカラムリサイズのドラッグ操作に接続します。

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} //デスクトップ用
  onTouchStart={header.getResizeHandler()} //モバイル用
/>
```

##### ColumnSizingInfoStateを使用したカラムリサイズインジケーター

TanStack Tableは、`columnSizingInfo`という状態オブジェクトを追跡しており、これを使用してカラムリサイズインジケーターUIをレンダリングできます。

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
      : '',
  }}
/>
```

#### 高度なカラムリサイズのパフォーマンス

大規模または複雑なテーブルを作成している場合（そしてReactを使用している場合😉）、レンダリングロジックに適切なメモ化を追加しないと、ユーザーがカラムをリサイズしている間にパフォーマンスの低下が発生する可能性があります。

[パフォーマンスの高いカラムリサイズの例](../framework/react/examples/column-resizing-performant)を作成しました。この例では、それ以外の場合にはレンダリングが遅くなる可能性のある複雑なテーブルで60 fpsのカラムリサイズレンダリングを達成する方法を示しています。この例を見てどのように行われているかを確認することをお勧めしますが、基本的に留意すべき点は以下の通りです：

1. すべてのヘッダーとすべてのデータセルで`column.getSize()`を使用しないでください。代わりに、すべてのカラム幅を一度に事前に計算し、**メモ化**します！
2. リサイズが進行中の間、テーブルボディをメモ化します。
3. CSS変数を使用して、カラム幅をテーブルセルに伝達します。

これらの手順に従うと、カラムのリサイズ中のパフォーマンスが大幅に向上するはずです。

Reactを使用せず、代わりにSvelte、Vue、またはSolidアダプターを使用している場合、これほど心配する必要はないかもしれませんが、同様の原則が適用されます。
