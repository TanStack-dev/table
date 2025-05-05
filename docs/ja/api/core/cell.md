---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:16.242Z'
title: セル
---
# セルAPI (Cell APIs)

TanStack Tableのコアは**フレームワーク非依存 (framework agnostic)** です。つまり、使用するフレームワークに関係なくAPIは同じです。各フレームワークでテーブルコアを簡単に操作できるように、アダプターが提供されています。利用可能なアダプターについては、アダプターメニューを参照してください。

これらはすべてのセルに対する**コア (core)** オプションとAPIプロパティです。他の[テーブル機能](../guide/features)では、さらに多くのオプションとAPIプロパティが利用可能です。

## セルAPI (Cell API)

すべてのセルオブジェクトは以下のプロパティを持ちます:

### `id`

```tsx
id: string
```

テーブル全体で一意のセルID。

### `getValue`

```tsx
getValue: () => any
```

関連するカラムのアクセサーキーまたはアクセサー関数を介して、セルの値を取得します。

### `renderValue`

```tsx
renderValue: () => any
```

`getValue`と同じ方法でセルの値をレンダリングしますが、値が見つからない場合は`renderFallbackValue`を返します。

### `row`

```tsx
row: Row<TData>
```

セルに関連付けられた行オブジェクト。

### `column`

```tsx
column: Column<TData>
```

セルに関連付けられたカラムオブジェクト。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  column: Column<TData, TValue>
  row: Row<TData>
  cell: Cell<TData, TValue>
  getValue: <TTValue = TValue,>() => TTValue
  renderValue: <TTValue = TValue,>() => TTValue | null
}
```

セルや集計セルなどのセルベースのコンポーネントのレンダリングコンテキスト（またはプロパティ）を返します。これらのプロパティをフレームワークの`flexRender`ユーティリティと一緒に使用して、選択したテンプレートでこれらをレンダリングします:

```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
```
