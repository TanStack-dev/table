---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:43:33.690Z'
title: 行选择
id: row-selection
---
## 状态 (State)

行选择状态 (Row Selection) 在表格中使用以下结构存储：

```tsx
export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}
```

默认情况下，行选择状态使用每行的索引作为行标识符。也可以通过向表格传入自定义的 [getRowId](../core/table.md#getrowid) 函数，使用自定义的唯一行 ID 来跟踪行选择状态。

## 表格选项 (Table Options)

### `enableRowSelection`

```tsx
enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 启用/禁用表格中所有行的行选择功能，或
- 一个接收行数据并返回是否启用该行选择功能的函数

### `enableMultiRowSelection`

```tsx
enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 启用/禁用表格中所有行的多行选择功能，或
- 一个接收行数据并返回是否启用该行的子行/孙行多行选择功能的函数

### `enableSubRowSelection`

```tsx
enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

启用/禁用当父行被选中时自动选择子行的功能，或一个为每行启用/禁用自动子行选择功能的函数。

（需与展开或分组功能结合使用）

### `onRowSelectionChange`

```tsx
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

如果提供，当 `state.rowSelection` 发生变化时，此函数将被调用并传入一个 `updaterFn`。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分地持久化状态变更。

## 表格 API (Table API)

### `getToggleAllRowsSelectedHandler`

```tsx
getToggleAllRowsSelectedHandler: () => (event: unknown) => void
```

返回一个可用于切换表格中所有行选择状态的处理器。

### `getToggleAllPageRowsSelectedHandler`

```tsx
getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
```

返回一个可用于切换当前页所有行选择状态的处理器。

### `setRowSelection`

```tsx
setRowSelection: (updater: Updater<RowSelectionState>) => void
```

设置或更新 `state.rowSelection` 状态。

### `resetRowSelection`

```tsx
resetRowSelection: (defaultState?: boolean) => void
```

将 **rowSelection** 状态重置为 `initialState.rowSelection`，或传入 `true` 强制重置为默认空状态 `{}`。

### `getIsAllRowsSelected`

```tsx
getIsAllRowsSelected: () => boolean
```

返回表格中所有行是否均被选中。

### `getIsAllPageRowsSelected`

```tsx
getIsAllPageRowsSelected: () => boolean
```

返回当前页所有行是否均被选中。

### `getIsSomeRowsSelected`

```tsx
getIsSomeRowsSelected: () => boolean
```

返回表格中是否有任意行被选中。

注意：如果所有行均被选中则返回 `false`。

### `getIsSomePageRowsSelected`

```tsx
getIsSomePageRowsSelected: () => boolean
```

返回当前页是否有任意行被选中。

### `toggleAllRowsSelected`

```tsx
toggleAllRowsSelected: (value: boolean) => void
```

选中/取消选中表格中所有行。

### `toggleAllPageRowsSelected`

```tsx
toggleAllPageRowsSelected: (value: boolean) => void
```

选中/取消选中当前页所有行。

### `getPreSelectedRowModel`

```tsx
getPreSelectedRowModel: () => RowModel<TData>
```

### `getSelectedRowModel`

```tsx
getSelectedRowModel: () => RowModel<TData>
```

### `getFilteredSelectedRowModel`

```tsx
getFilteredSelectedRowModel: () => RowModel<TData>
```

### `getGroupedSelectedRowModel`

```tsx
getGroupedSelectedRowModel: () => RowModel<TData>
```

## 行 API (Row API)

### `getIsSelected`

```tsx
getIsSelected: () => boolean
```

返回该行是否被选中。

### `getIsSomeSelected`

```tsx
getIsSomeSelected: () => boolean
```

返回该行的部分子行是否被选中。

### `getIsAllSubRowsSelected`

```tsx
getIsAllSubRowsSelected: () => boolean
```

返回该行的所有子行是否均被选中。

### `getCanSelect`

```tsx
getCanSelect: () => boolean
```

返回该行是否可被选中。

### `getCanMultiSelect`

```tsx
getCanMultiSelect: () => boolean
```

返回该行是否支持多选。

### `getCanSelectSubRows`

```tsx
getCanSelectSubRows: () => boolean
```

返回当父行被选中时是否自动选择子行。

### `toggleSelected`

```tsx
toggleSelected: (value?: boolean) => void
```

选中/取消选中该行。

### `getToggleSelectedHandler`

```tsx
getToggleSelectedHandler: () => (event: unknown) => void
```

返回一个可用于切换该行选择状态的处理器。
