---
source-updated-at: '2024-03-10T17:31:15.000Z'
translation-updated-at: '2025-05-05T19:29:16.704Z'
title: カラム固定
id: column-pinning
---
## ピン留め可能 (Can-Pin)

列が**ピン留め (pinned)** 可能かどうかは、以下の条件で決まります:

- `options.enablePinning` が `false` に設定されていない
- `options.enableColumnPinning` が `false` に設定されていない  
- `columnDefinition.enablePinning` が `false` に設定されていない

## 状態管理 (State)

ピン留めの状態はテーブル上で以下の形式で保持されます:

```tsx
export type ColumnPinningPosition = false | 'left' | 'right'

export type ColumnPinningState = {
  left?: string[]
  right?: string[]
}


export type ColumnPinningTableState = {
  columnPinning: ColumnPinningState
}
```

## テーブルオプション (Table Options)

### `enableColumnPinning`

```tsx
enableColumnPinning?: boolean
```

テーブル内のすべての列に対してピン留めを有効/無効にします。

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

提供された場合、`state.columnPinning` が変更されると `updaterFn` と共にこの関数が呼び出されます。これによりデフォルトの内部状態管理が上書きされるため、自身で管理する状態から `state.columnPinning` を提供する必要があります。

## 列定義オプション (Column Def Options)

### `enablePinning`

```tsx
enablePinning?: boolean
```

列のピン留めを有効/無効にします。

## テーブルAPI (Table API)

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

`state.columnPinning` の状態を設定または更新します。

### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

**columnPinning** の状態を `initialState.columnPinning` にリセットします。`true` を渡すとデフォルトの空状態 `{ left: [], right: [], }` に強制リセットされます。

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

いずれかの列がピン留めされているかどうかを返します。オプションで `left` または `right` の位置にあるピン留め列のみをチェックできます。

_注: 列の可視性は考慮されません_

### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup<TData>[]
```

テーブルの左側にピン留めされたヘッダーグループを返します。

### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup<TData>[]
```

ピン留めされていない/中央のヘッダーグループを返します。

### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup<TData>[]
```

テーブルの右側にピン留めされたヘッダーグループを返します。

### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup<TData>[]
```

テーブルの左側にピン留めされたフッターグループを返します。

### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup<TData>[]
```

ピン留めされていない/中央のフッターグループを返します。

### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup<TData>[]
```

テーブルの右側にピン留めされたフッターグループを返します。

### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header<TData>[]
```

親ヘッダーを含む、左側にピン留めされたヘッダーのフラット配列を返します。

### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header<TData>[]
```

親ヘッダーを含む、ピン留めされていない/中央のヘッダーのフラット配列を返します。

### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header<TData>[]
```

親ヘッダーを含む、右側にピン留めされたヘッダーのフラット配列を返します。

### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header<TData>[]
```

左側にピン留めされたリーフノードヘッダーのフラット配列を返します。

### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header<TData>[]
```

ピン留めされていない/中央のリーフノードヘッダーのフラット配列を返します。

### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header<TData>[]
```

右側にピン留めされたリーフノードヘッダーのフラット配列を返します。

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column<TData>[]
```

左側にピン留めされたすべてのリーフ列を返します。

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column<TData>[]
```

右側にピン留めされたすべてのリーフ列を返します。

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column<TData>[]
```

中央（ピン留めされていない）のすべてのリーフ列を返します。

## 列API (Column API)

### `getCanPin`

```tsx
getCanPin: () => boolean
```

列がピン留め可能かどうかを返します。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

ピン留め列グループ内での列の数値インデックスを返します。

### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

列のピン留め位置を返します (`'left'`, `'right'` または `false`)。

### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

列を `'left'` または `'right'` にピン留めします。`false` を渡すと中央に配置（ピン留め解除）されます。

## 行API (Row API)

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell<TData>[]
```

行内の左側にピン留めされたすべてのリーフセルを返します。

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell<TData>[]
```

行内の右側にピン留めされたすべてのリーフセルを返します。

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell<TData>[]
```

行内の中央（ピン留めされていない）のすべてのリーフセルを返します。
