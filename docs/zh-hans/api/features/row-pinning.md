---
source-updated-at: '2024-06-30T17:39:45.000Z'
translation-updated-at: '2025-05-02T17:42:47.963Z'
title: 行固定
id: row-pinning
---
## 行固定 (Row Pinning) API

## 能否固定 (Can-Pin)

行的**固定**能力由以下条件决定：

- `options.enableRowPinning` 解析为 `true`
- `options.enablePinning` 未设置为 `false`

## 状态 (State)

固定状态以以下形式存储在表格中：

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

## 表格选项 (Table Options)

### `enableRowPinning`

```tsx
enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
```

启用/禁用表格中所有行的固定功能。

### `keepPinnedRows`

```tsx
keepPinnedRows?: boolean
```

当值为 `false` 时，如果固定行被过滤或分页移出表格，它们将不可见。当值为 `true` 时，固定行将始终可见，不受过滤或分页影响。默认为 `true`。

### `onRowPinningChange`

```tsx
onRowPinningChange?: OnChangeFn<RowPinningState>
```

如果提供此函数，当 `state.rowPinning` 发生变化时，将调用该函数并传入 `updaterFn`。这会覆盖默认的内部状态管理，因此您还需要从自己管理的状态中提供 `state.rowPinning`。

## 表格 API (Table API)

### `setRowPinning`

```tsx
setRowPinning: (updater: Updater<RowPinningState>) => void
```

设置或更新 `state.rowPinning` 状态。

### `resetRowPinning`

```tsx
resetRowPinning: (defaultState?: boolean) => void
```

将 **rowPinning** 状态重置为 `initialState.rowPinning`，或者可以传递 `true` 强制重置为默认空状态 `{}`。

### `getIsSomeRowsPinned`

```tsx
getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
```

返回是否有任何行被固定。可选指定仅检查 `top` 或 `bottom` 位置的固定行。

### `getTopRows`

```tsx
getTopRows: () => Row<TData>[]
```

返回所有固定在顶部的行。

### `getBottomRows`

```tsx
getBottomRows: () => Row<TData>[]
```

返回所有固定在底部的行。

### `getCenterRows`

```tsx
getCenterRows: () => Row<TData>[]
```

返回所有未固定在顶部或底部的行。

## 行 API (Row API)

### `pin`

```tsx
pin: (position: RowPinningPosition) => void
```

将行固定在 `'top'` 或 `'bottom'`，如果传入 `false` 则取消固定到中间位置。

### `getCanPin`

```tsx
getCanPin: () => boolean
```

返回该行是否可以被固定。

### `getIsPinned`

```tsx
getIsPinned: () => RowPinningPosition
```

返回行的固定位置（`'top'`、`'bottom'` 或 `false`）。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

返回行在固定行组中的数字索引位置。
