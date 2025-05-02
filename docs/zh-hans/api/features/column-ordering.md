---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-02T17:34:36.978Z'
title: 列排序
id: column-ordering
---
## 状态 (State)

列的排序状态 (column ordering) 通过以下结构存储在表格中：

```tsx
export type ColumnOrderTableState = {
  columnOrder: ColumnOrderState
}

export type ColumnOrderState = string[]
```

## 表格选项 (Table Options)

### `onColumnOrderChange`

```tsx
onColumnOrderChange?: OnChangeFn<ColumnOrderState>
```

如果提供此函数，当 `state.columnOrder` 发生变化时会调用该函数并传入 `updaterFn`。这将覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态变更。

## 表格 API (Table API)

### `setColumnOrder`

```tsx
setColumnOrder: (updater: Updater<ColumnOrderState>) => void
```

设置或更新 `state.columnOrder` 状态。

### `resetColumnOrder`

```tsx
resetColumnOrder: (defaultState?: boolean) => void
```

将 **columnOrder** 状态重置为 `initialState.columnOrder`，或传入 `true` 强制重置为默认空状态 `[]`。

## 列 API (Column API)

### `getIndex`

```tsx
getIndex: (position?: ColumnPinningPosition) => number
```

返回当前列在可见列顺序中的索引。可选传入 `position` 参数以获取列在表格子分区中的索引。

### `getIsFirstColumn`

```tsx
getIsFirstColumn: (position?: ColumnPinningPosition) => boolean
```

如果当前列在可见列顺序中处于首位则返回 `true`。可选传入 `position` 参数以检查列是否在表格子分区的首位。

### `getIsLastColumn`

```tsx
getIsLastColumn: (position?: ColumnPinningPosition) => boolean
```

如果当前列在可见列顺序中处于末位则返回 `true`。可选传入 `position` 参数以检查列是否在表格子分区的末位。
