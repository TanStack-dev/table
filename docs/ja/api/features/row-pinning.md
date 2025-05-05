---
source-updated-at: '2024-06-30T17:39:45.000Z'
translation-updated-at: '2025-05-05T19:29:47.522Z'
title: 行固定
id: row-pinning
---
## 行ピン留め (Row Pinning) API

## ピン留め可能 (Can-Pin)

行を**ピン留め (pinned)** できるかどうかは、以下によって決定されます:

- `options.enableRowPinning` が `true` と解決される
- `options.enablePinning` が `false` に設定されていない

## 状態 (State)

ピン留めの状態は、以下の形式でテーブルに保存されます:

```tsx
export type RowPinningPosition = false | 'top' | 'bottom'

export type RowPinningState = {
  top?: string[]
  bottom?: string[]
}

export type RowPinningRowState = {
  rowPinning: RowPinningState
}
```

## テーブルオプション (Table Options)

### `enableRowPinning`

```tsx
enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
```

テーブル内のすべての行に対して行ピン留めを有効/無効にします。

### `keepPinnedRows`

```tsx
keepPinnedRows?: boolean
```

`false`の場合、ピン留めされた行がフィルタリングまたはページネーションによってテーブルから除外されると表示されません。`true`の場合、ピン留めされた行はフィルタリングやページネーションに関係なく常に表示されます。デフォルトは`true`です。

### `onRowPinningChange`

```tsx
onRowPinningChange?: OnChangeFn<RowPinningState>
```

この関数が提供されると、`state.rowPinning`が変更されたときに`updaterFn`とともに呼び出されます。これによりデフォルトの内部状態管理が上書きされるため、`state.rowPinning`を自身で管理する必要があります。

## テーブルAPI (Table API)

### `setRowPinning`

```tsx
setRowPinning: (updater: Updater<RowPinningState>) => void
```

`state.rowPinning`の状態を設定または更新します。

### `resetRowPinning`

```tsx
resetRowPinning: (defaultState?: boolean) => void
```

**rowPinning**の状態を`initialState.rowPinning`にリセットします。`true`を渡すと、デフォルトの空白状態`{}`に強制的にリセットされます。

### `getIsSomeRowsPinned`

```tsx
getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
```

ピン留めされた行があるかどうかを返します。オプションで`top`または`bottom`の位置にあるピン留めされた行のみをチェックできます。

### `getTopRows`

```tsx
getTopRows: () => Row<TData>[]
```

上部にピン留めされたすべての行を返します。

### `getBottomRows`

```tsx
getBottomRows: () => Row<TData>[]
```

下部にピン留めされたすべての行を返します。

### `getCenterRows`

```tsx
getCenterRows: () => Row<TData>[]
```

上部または下部にピン留めされていないすべての行を返します。

## 行API (Row API)

### `pin`

```tsx
pin: (position: RowPinningPosition) => void
```

行を`'top'`または`'bottom'`にピン留めします。`false`を渡すと中央にピン留めを解除します。

### `getCanPin`

```tsx
getCanPin: () => boolean
```

行がピン留め可能かどうかを返します。

### `getIsPinned`

```tsx
getIsPinned: () => RowPinningPosition
```

行のピン留め位置を返します。（`'top'`、`'bottom'`または`false`）

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

ピン留めされた行グループ内での行の数値インデックスを返します。
