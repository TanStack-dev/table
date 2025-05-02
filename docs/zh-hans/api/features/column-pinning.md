---
source-updated-at: '2024-03-10T17:31:15.000Z'
translation-updated-at: '2025-05-02T17:35:26.448Z'
title: 列固定
id: column-pinning
---
## 列固定 (Column Pinning) 能力

列是否可被**固定**取决于以下条件：

- `options.enablePinning` 未设置为 `false`
- `options.enableColumnPinning` 未设置为 `false`
- `columnDefinition.enablePinning` 未设置为 `false`

## 状态 (State)

固定状态通过以下结构存储在表格中：

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

## 表格选项 (Table Options)

### `enableColumnPinning`

```tsx
enableColumnPinning?: boolean
```

启用/禁用表格中所有列的固定功能。

### `onColumnPinningChange`

```tsx
onColumnPinningChange?: OnChangeFn<ColumnPinningState>
```

如果提供，当 `state.columnPinning` 发生变化时，此函数会接收一个 `updaterFn` 被调用。这将覆盖默认的内部状态管理，因此您需要从自行管理的状态中提供 `state.columnPinning`。

## 列定义选项 (Column Def Options)

### `enablePinning`

```tsx
enablePinning?: boolean
```

启用/禁用该列的固定功能。

## 表格 API (Table API)

### `setColumnPinning`

```tsx
setColumnPinning: (updater: Updater<ColumnPinningState>) => void
```

设置或更新 `state.columnPinning` 状态。

### `resetColumnPinning`

```tsx
resetColumnPinning: (defaultState?: boolean) => void
```

将 **columnPinning** 状态重置为 `initialState.columnPinning`，或传入 `true` 强制重置为默认空状态 `{ left: [], right: [], }`。

### `getIsSomeColumnsPinned`

```tsx
getIsSomeColumnsPinned: (position?: ColumnPinningPosition) => boolean
```

返回是否有任何列被固定。可指定仅检查 `left` 或 `right` 位置的固定列。

_注意：不考虑列的可见性_

### `getLeftHeaderGroups`

```tsx
getLeftHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格中左侧固定的表头组。

### `getCenterHeaderGroups`

```tsx
getCenterHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格中未固定/居中的表头组。

### `getRightHeaderGroups`

```tsx
getRightHeaderGroups: () => HeaderGroup<TData>[]
```

返回表格中右侧固定的表头组。

### `getLeftFooterGroups`

```tsx
getLeftFooterGroups: () => HeaderGroup<TData>[]
```

返回表格中左侧固定的表尾组。

### `getCenterFooterGroups`

```tsx
getCenterFooterGroups: () => HeaderGroup<TData>[]
```

返回表格中未固定/居中的表尾组。

### `getRightFooterGroups`

```tsx
getRightFooterGroups: () => HeaderGroup<TData>[]
```

返回表格中右侧固定的表尾组。

### `getLeftFlatHeaders`

```tsx
getLeftFlatHeaders: () => Header<TData>[]
```

返回表格中左侧固定的平铺表头数组，包括父表头。

### `getCenterFlatHeaders`

```tsx
getCenterFlatHeaders: () => Header<TData>[]
```

返回表格中未固定/居中的平铺表头数组，包括父表头。

### `getRightFlatHeaders`

```tsx
getRightFlatHeaders: () => Header<TData>[]
```

返回表格中右侧固定的平铺表头数组，包括父表头。

### `getLeftLeafHeaders`

```tsx
getLeftLeafHeaders: () => Header<TData>[]
```

返回表格中左侧固定的叶子节点表头平铺数组。

### `getCenterLeafHeaders`

```tsx
getCenterLeafHeaders: () => Header<TData>[]
```

返回表格中未固定/居中的叶子节点表头平铺数组。

### `getRightLeafHeaders`

```tsx
getRightLeafHeaders: () => Header<TData>[]
```

返回表格中右侧固定的叶子节点表头平铺数组。

### `getLeftLeafColumns`

```tsx
getLeftLeafColumns: () => Column<TData>[]
```

返回所有左侧固定的叶子列。

### `getRightLeafColumns`

```tsx
getRightLeafColumns: () => Column<TData>[]
```

返回所有右侧固定的叶子列。

### `getCenterLeafColumns`

```tsx
getCenterLeafColumns: () => Column<TData>[]
```

返回所有居中固定（未固定）的叶子列。

## 列 API (Column API)

### `getCanPin`

```tsx
getCanPin: () => boolean
```

返回该列是否可被固定。

### `getPinnedIndex`

```tsx
getPinnedIndex: () => number
```

返回列在固定列组中的数字索引。

### `getIsPinned`

```tsx
getIsPinned: () => ColumnPinningPosition
```

返回列的固定位置。（`'left'`、`'right'` 或 `false`）

### `pin`

```tsx
pin: (position: ColumnPinningPosition) => void
```

将列固定到 `'left'` 或 `'right'`，或传入 `false` 取消固定到居中位置。

## 行 API (Row API)

### `getLeftVisibleCells`

```tsx
getLeftVisibleCells: () => Cell<TData>[]
```

返回行中所有左侧固定的叶子单元格。

### `getRightVisibleCells`

```tsx
getRightVisibleCells: () => Cell<TData>[]
```

返回行中所有右侧固定的叶子单元格。

### `getCenterVisibleCells`

```tsx
getCenterVisibleCells: () => Cell<TData>[]
```

返回行中所有居中固定（未固定）的叶子单元格。
