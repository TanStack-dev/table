---
source-updated-at: '2024-06-30T17:39:45.000Z'
translation-updated-at: '2025-05-08T23:42:53.934Z'
title: 行固定
id: row-pinning
---
## 行固定 (Row Pinning) API

## 可固定 (Can-Pin)

某行是否可被**固定** (pinned) 由以下條件決定：

- `options.enableRowPinning` 解析為 `true`
- `options.enablePinning` 未設定為 `false`

## 狀態 (State)

固定狀態會以以下形式儲存在表格中：

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

## 表格選項 (Table Options)

### `enableRowPinning`

```tsx
enableRowPinning?: boolean | ((row: Row<TData>) => boolean)
```

啟用或停用表格中所有行的固定功能。

### `keepPinnedRows`

```tsx
keepPinnedRows?: boolean
```

當設定為 `false` 時，若固定行因過濾或分頁而被排除在表格外，則不會顯示。當設定為 `true` 時，固定行將始終可見，不受過濾或分頁影響。預設值為 `true`。

### `onRowPinningChange`

```tsx
onRowPinningChange?: OnChangeFn<RowPinningState>
```

若提供此函數，當 `state.rowPinning` 變更時，會以 `updaterFn` 呼叫此函數。這將覆蓋預設的內部狀態管理，因此您需要從自行管理的狀態提供 `state.rowPinning`。

## 表格 API (Table API)

### `setRowPinning`

```tsx
setRowPinning: (updater: Updater<RowPinningState>) => void
```

設定或更新 `state.rowPinning` 狀態。

### `resetRowPinning`

```tsx
resetRowPinning: (defaultState?: boolean) => void
```

將**行固定** (rowPinning) 狀態重置為 `initialState.rowPinning`，或可傳入 `true` 強制重置為預設空白狀態 `{}`。

### `getIsSomeRowsPinned`

```tsx
getIsSomeRowsPinned: (position?: RowPinningPosition) => boolean
```

回傳是否有任何行被固定。可選擇性指定僅檢查 `top` 或 `bottom` 位置的固定行。

### `getTopRows`

```tsx
getTopRows: () => Row<TData>[]
```

回傳所有固定在頂部的行。

### `getBottomRows`

```tsx
getBottomRows: () => Row<TData>[]
```

回傳所有固定在底部的行。

### `getCenterRows`

```tsx
getCenterRows: () => Row<TData>[]
```

回傳所有未固定在頂部或底部的行。

## 行 API (Row API)

### `pin`

```tsx
pin: (position: RowPinningPosition) => void
```

將行固定到 `'top'` 或 `'bottom'`，或傳入 `false` 將行取消固定至中央。

### `getCanPin`

```tsx
getCanPin: () => boolean
```

回傳此行是否可被固定。

### `getIsPinned`

```tsx
getIsPinned: () => RowPinningPosition
```

回傳行的固定位置 (`'top'`、`'bottom'` 或 `false`)。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

回傳行在固定行群組中的數字索引位置。
