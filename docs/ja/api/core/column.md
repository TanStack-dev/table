---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:54.156Z'
title: カラム
---
# カラムAPI (Column APIs)

TanStack Tableのコアは**フレームワーク非依存 (framework agnostic)** です。つまり、使用するフレームワークに関係なくAPIは同じです。各フレームワーク向けにアダプターが提供されており、テーブルコアを簡単に操作できます。利用可能なアダプターについては、アダプターメニューを参照してください。

これらはすべてのカラムに適用される**コア**オプションとAPIプロパティです。他の[テーブル機能](../guide/features)については、さらに多くのオプションとAPIプロパティが利用可能です。

## カラムAPI

すべてのカラムオブジェクトは以下のプロパティを持ちます:

### `id`

```tsx
id: string
```

カラムの解決済み一意識別子で、以下の優先順位で決定されます:

- カラム定義からの手動`id`プロパティ
- カラム定義からのアクセサーキー
- カラム定義からのヘッダー文字列

### `depth`

```tsx
depth: number
```

(グループ化されている場合の) ルートカラム定義配列に対するカラムの深さ。

### `accessorFn`

```tsx
accessorFn?: AccessorFn<TData>
```

各行からカラムの値を抽出する際に使用する解決済みアクセサー関数。カラム定義に有効なアクセサーキーまたは関数が定義されている場合のみ設定されます。

### `columnDef`

```tsx
columnDef: ColumnDef<TData>
```

カラムの作成に使用された元のカラム定義。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

(カラムがグループカラムの場合の) 子カラム。カラムがグループカラムでない場合は空の配列になります。

### `parent`

```tsx
parent?: Column<TData>
```

このカラムの親カラム。ルートカラムの場合はundefinedになります。

### `getFlatColumns`

```tsx
type getFlatColumns = () => Column<TData>[]
```

このカラムとすべての子/孫カラムを含む平坦化された配列を返します。

### `getLeafColumns`

```tsx
type getLeafColumns = () => Column<TData>[]
```

このカラムのすべてのリーフノードカラムの配列を返します。カラムに子がない場合、そのカラム自体が唯一のリーフノードカラムとみなされます。
