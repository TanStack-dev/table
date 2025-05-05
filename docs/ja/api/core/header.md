---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:38.037Z'
title: ヘッダー
---
以下は翻訳です：

これらはすべてのヘッダーに対する**コア**オプションとAPIプロパティです。他の[テーブル機能](../guide/features)では、さらに多くのオプションとAPIプロパティが利用可能な場合があります。

## ヘッダーAPI

すべてのヘッダーオブジェクトは以下のプロパティを持ちます：

### `id`

```tsx
id: string
```

ヘッダーの一意な識別子。

### `index`

```tsx
index: number
```

ヘッダーグループ内でのヘッダーのインデックス。

### `depth`

```tsx
depth: number
```

ヘッダーの深さ（0から始まるインデックス）。

### `column`

```tsx
column: Column<TData>
```

ヘッダーに関連付けられた[Column](../api/core/column)オブジェクト。

### `headerGroup`

```tsx
headerGroup: HeaderGroup<TData>
```

ヘッダーに関連付けられた[HeaderGroup](../api/core/header-group)オブジェクト。

### `subHeaders`

```tsx
type subHeaders = Header<TData>[]
```

ヘッダーの階層的なサブ/子ヘッダー。ヘッダーに関連付けられたカラムがリーフカラムの場合、空になります。

### `colSpan`

```tsx
colSpan: number
```

ヘッダーのcol-span（列結合数）。

### `rowSpan`

```tsx
rowSpan: number
```

ヘッダーのrow-span（行結合数）。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

このヘッダーの下に階層的にネストされたリーフヘッダーを返します。

### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

ヘッダーがプレースホルダーヘッダーかどうかを示すブール値。

### `placeholderId`

```tsx
placeholderId?: string
```

ヘッダーがプレースホルダーヘッダーの場合、テーブル全体で他のヘッダーと競合しない一意のヘッダーID。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}
```

ヘッダー、フッター、フィルターなどのカラムベースのコンポーネントのレンダリングコンテキスト（またはプロパティ）を返します。これらのプロパティをフレームワークの`flexRender`ユーティリティと共に使用して、選択したテンプレートでこれらをレンダリングします：

```tsx
flexRender(header.column.columnDef.header, header.getContext())
```

## テーブルAPI

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

テーブルのすべてのヘッダーグループを返します。

### `getLeftHeaderGroups`

```tsx
type getLeftHeaderGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、左側にピン留めされたカラムのヘッダーグループを返します。

### `getCenterHeaderGroups`

```tsx
type getCenterHeaderGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、ピン留めされていないカラムのヘッダーグループを返します。

### `getRightHeaderGroups`

```tsx
type getRightHeaderGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、右側にピン留めされたカラムのヘッダーグループを返します。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

テーブルのすべてのフッターグループを返します。

### `getLeftFooterGroups`

```tsx
type getLeftFooterGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、左側にピン留めされたカラムのフッターグループを返します。

### `getCenterFooterGroups`

```tsx
type getCenterFooterGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、ピン留めされていないカラムのフッターグループを返します。

### `getRightFooterGroups`

```tsx
type getRightFooterGroups = () => HeaderGroup<TData>[]
```

ピン留めされている場合、右側にピン留めされたカラムのフッターグループを返します。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData, unknown>[]
```

親ヘッダーを含む、テーブルのすべてのカラムのヘッダーを返します。

### `getLeftFlatHeaders`

```tsx
type getLeftFlatHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含む、左側にピン留めされたすべてのカラムのヘッダーを返します。

### `getCenterFlatHeaders`

```tsx
type getCenterFlatHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含む、ピン留めされていないすべてのカラムのヘッダーを返します。

### `getRightFlatHeaders`

```tsx
type getRightFlatHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含む、右側にピン留めされたすべてのカラムのヘッダーを返します。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData, unknown>[]
```

親ヘッダーを含まない、テーブルのすべてのリーフカラムのヘッダーを返します。

### `getLeftLeafHeaders`

```tsx
type getLeftLeafHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含まない、左側にピン留めされたすべてのリーフカラムのヘッダーを返します。

### `getCenterLeafHeaders`

```tsx
type getCenterLeafHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含まない、ピン留めされていないすべてのカラムのヘッダーを返します。

### `getRightLeafHeaders`

```tsx
type getRightLeafHeaders = () => Header<TData, unknown>[]
```

ピン留めされている場合、親ヘッダーを含まない、右側にピン留めされたすべてのリーフカラムのヘッダーを返します。
