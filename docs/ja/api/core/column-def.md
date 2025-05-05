---
source-updated-at: '2024-03-22T01:02:38.000Z'
translation-updated-at: '2025-05-05T19:27:36.041Z'
title: カラム定義
---
# ColumnDef API

カラム定義は以下のオプションを持つプレーンオブジェクトです。

## オプション

### `id`

```tsx
id: string
```

カラムの一意な識別子。

> 🧠 カラムIDは以下の場合オプションです:
>
> - オブジェクトキーアクセサーでアクセサーカラムが作成された場合
> - カラムヘッダーが文字列で定義されている場合

### `accessorKey`

```tsx
accessorKey?: string & typeof TData
```

カラムの値を抽出する際に使用する行オブジェクトのキー。

### `accessorFn`

```tsx
accessorFn?: (originalRow: TData, index: number) => any
```

各行からカラムの値を抽出する際に使用するアクセサー関数。

### `columns`

```tsx
columns?: ColumnDef<TData>[]
```

グループカラムに含める子カラム定義。

### `header`

```tsx
header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

カラムに表示するヘッダー。文字列が渡された場合、カラムIDのデフォルトとして使用できます。関数が渡された場合、ヘッダーのpropsオブジェクトが渡され、レンダリングされたヘッダー値を返す必要があります（正確な型は使用するアダプターによって異なります）。

### `footer`

```tsx
footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

カラムに表示するフッター。関数が渡された場合、フッターのpropsオブジェクトが渡され、レンダリングされたフッター値を返す必要があります（正確な型は使用するアダプターによって異なります）。

### `cell`

```tsx
cell?:
  | string
  | ((props: {
      table: Table<TData>
      row: Row<TData>
      column: Column<TData>
      cell: Cell<TData>
      getValue: () => any
      renderValue: () => any
    }) => unknown)
```

カラムの各行に表示するセル。関数が渡された場合、セルのpropsオブジェクトが渡され、レンダリングされたセル値を返す必要があります（正確な型は使用するアダプターによって異なります）。

### `meta`

```tsx
meta?: ColumnMeta // このインターフェースは宣言マージで拡張可能です。下記を参照！
```

カラムに関連付けるメタデータ。`column.columnDef.meta`を通じてカラムが利用可能な場所ならどこからでもアクセスできます。この型はすべてのテーブルでグローバルであり、以下のように拡張できます:

```tsx
import '@tanstack/react-table' // または vue, svelte, solid, qwik など

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    foo: string
  }
}
```
