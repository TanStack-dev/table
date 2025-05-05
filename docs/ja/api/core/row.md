---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:11.843Z'
title: 行
---
以下は翻訳です：

これらはすべての行に対する**コア**オプションとAPIプロパティです。他の[テーブル機能](../guide/features)にはさらに多くのオプションとAPIプロパティが利用可能です。

## 行 (Row) API

すべての行オブジェクトは以下のプロパティを持ちます：

### `id`

```tsx
id: string
```

`options.getRowId`オプションによって解決された、行の一意の識別子。デフォルトでは行のインデックス（またはサブ行の場合は相対インデックス）が使用されます。

### `depth`

```tsx
depth: number
```

ルート行配列に対する行の深さ（ネストまたはグループ化されている場合）。

### `index`

```tsx
index: number
```

親配列（またはルートデータ配列）内での行のインデックス。

### `original`

```tsx
original: TData
```

テーブルに提供された元の行オブジェクト。

> 🧠 行がグループ化された行の場合、元の行オブジェクトはグループ内の最初の元の行になります。

### `parentId`

```tsx
parentId?: string
```

ネストされている場合、この行の親行のID。

### `getValue`

```tsx
getValue: (columnId: string) => TValue
```

指定されたcolumnIdに対応する行の値を返します。

### `renderValue`

```tsx
renderValue: (columnId: string) => TValue
```

指定されたcolumnIdに対応する行の値をレンダリングしますが、値が見つからない場合は`renderFallbackValue`を返します。

### `getUniqueValues`

```tsx
getUniqueValues: (columnId: string) => TValue[]
```

指定されたcolumnIdに対応する行から一意の値の配列を返します。

### `subRows`

```tsx
type subRows = Row<TData>[]
```

`options.getSubRows`オプションによって返され作成された行のサブ行の配列。

### `getParentRow`

```tsx
type getParentRow = () => Row<TData> | undefined
```

存在する場合、行の親行を返します。

### `getParentRows`

```tsx
type getParentRows = () => Row<TData>[]
```

行の親行をルート行まで遡ってすべて返します。

### `getLeafRows`

```tsx
type getLeafRows = () => Row<TData>[]
```

行のリーフ行（親行を含まない）を返します。

### `originalSubRows`

```tsx
originalSubRows?: TData[]
```

`options.getSubRows`オプションによって返された元のサブ行の配列。

### `getAllCells`

```tsx
type getAllCells = () => Cell<TData>[]
```

行のすべての[セル (Cell)](../api/core/cell)を返します。
