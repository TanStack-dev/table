---
source-updated-at: '2024-03-10T17:31:15.000Z'
translation-updated-at: '2025-05-08T23:44:06.335Z'
title: 欄位固定
id: column-pinning
---
## 可釘選 (Can-Pin)

欄位是否能夠被 **釘選 (pinned)** 由以下條件決定：

- `options.enablePinning` 未設定為 `false`
- `options.enableColumnPinning` 未設定為 `false`
- `columnDefinition.enablePinning` 未設定為 `false`

## 狀態 (State)

釘選狀態會以以下結構儲存在表格中：

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

## 表格選項 (Table Options)

### `enableColumnPinning`

```tsx
enableColumnPinning?: boolean
```

啟用或停用表格中所有欄位的釘選功能。

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

若提供此函式，當 `state.columnPinning` 變更時會呼叫此函式並傳入 `updaterFn`。這會覆蓋預設的內部狀態管理，因此您需要自行管理 `state.columnPinning` 狀態。

## 欄位定義選項 (Column Def Options)

### `enablePinning`

```tsx
enablePinning?: boolean
```

啟用或停用該欄位的釘選功能。

## 表格 API (Table API)

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

設定或更新 `state.columnPinning` 狀態。

### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

將 **columnPinning** 狀態重設為 `initialState.columnPinning`，或傳入 `true` 強制重設為預設空白狀態 `{ left: [], right: [], }`。

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

回傳是否有任何欄位被釘選。可選擇性指定僅檢查 `left` 或 `right` 位置的釘選欄位。

_注意：不考慮欄位可見性_

### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup<TData>[]
```

回傳表格中左側釘選的標頭群組 (header groups)。

### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup<TData>[]
```

回傳表格中未釘選/置中的標頭群組。

### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup<TData>[]
```

回傳表格中右側釘選的標頭群組。

### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup<TData>[]
```

回傳表格中左側釘選的頁尾群組 (footer groups)。

### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup<TData>[]
```

回傳表格中未釘選/置中的頁尾群組。

### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup<TData>[]
```

回傳表格中右側釘選的頁尾群組。

### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header<TData>[]
```

回傳表格中左側釘選標頭的扁平陣列，包含父標頭。

### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header<TData>[]
```

回傳表格中未釘選/置中標頭的扁平陣列，包含父標頭。

### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header<TData>[]
```

回傳表格中右側釘選標頭的扁平陣列，包含父標頭。

### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header<TData>[]
```

回傳表格中左側釘選葉節點標頭的扁平陣列。

### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header<TData>[]
```

回傳表格中未釘選/置中葉節點標頭的扁平陣列。

### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header<TData>[]
```

回傳表格中右側釘選葉節點標頭的扁平陣列。

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column<TData>[]
```

回傳所有左側釘選的葉節點欄位。

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column<TData>[]
```

回傳所有右側釘選的葉節點欄位。

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column<TData>[]
```

回傳所有置中釘選 (未釘選) 的葉節點欄位。

## 欄位 API (Column API)

### `getCanPin`

```tsx
getCanPin: () => boolean
```

回傳該欄位是否可被釘選。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

回傳該欄位在所屬釘選欄位群組中的數字索引。

### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

回傳該欄位的釘選位置 (`'left'`、`'right'` 或 `false`)。

### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

將欄位釘選至 `'left'` 或 `'right'`，或傳入 `false` 取消釘選至置中。

## 列 API (Row API)

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell<TData>[]
```

回傳該列中所有左側釘選的葉節點儲存格 (cells)。

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell<TData>[]
```

回傳該列中所有右側釘選的葉節點儲存格。

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell<TData>[]
```

回傳該列中所有置中釘選 (未釘選) 的葉節點儲存格。
