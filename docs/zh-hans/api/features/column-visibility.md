---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-02T17:36:53.359Z'
title: 列可见性
id: column-visibility
---
## 状态 (State)

列的可见性状态 (visibility state) 以如下形式存储在表格中：

```tsx
export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}
```

## 列定义选项 (Column Def Options)

### `enableHiding`

```tsx
enableHiding?: boolean
```

启用/禁用列的隐藏功能

## 列 API (Column API)

### `getCanHide`

```tsx
getCanHide: () => boolean
```

返回该列是否可被隐藏

### `getIsVisible`

```tsx
getIsVisible: () => boolean
```

返回该列当前是否可见

### `toggleVisibility`

```tsx
toggleVisibility: (value?: boolean) => void
```

切换列的可见性状态

### `getToggleVisibilityHandler`

```tsx
getToggleVisibilityHandler: () => (event: unknown) => void
```

返回一个用于切换列可见性的函数。该函数可用于将事件处理器绑定到复选框上。

## 表格选项 (Table Options)

### `onColumnVisibilityChange`

```tsx
onColumnVisibilityChange?: OnChangeFn<VisibilityState>
```

当 `state.columnVisibility` 发生变化时，此回调函数会接收一个 `updaterFn`。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态变更。

### `enableHiding`

```tsx
enableHiding?: boolean
```

启用/禁用所有列的隐藏功能

## 表格 API (Table API)

### `getVisibleFlatColumns`

```tsx
getVisibleFlatColumns: () => Column<TData>[]
```

返回包含父列在内的所有可见列的扁平数组

### `getVisibleLeafColumns`

```tsx
getVisibleLeafColumns: () => Column<TData>[]
```

返回所有可见叶子节点列的扁平数组

### `getLeftVisibleLeafColumns`

```tsx
getLeftVisibleLeafColumns: () => Column<TData>[]
```

如果启用了列固定 (column pinning)，返回左侧可见叶子节点列的扁平数组

### `getRightVisibleLeafColumns`

```tsx
getRightVisibleLeafColumns: () => Column<TData>[]
```

如果启用了列固定 (column pinning)，返回右侧可见叶子节点列的扁平数组

### `getCenterVisibleLeafColumns`

```tsx
getCenterVisibleLeafColumns: () => Column<TData>[]
```

如果启用了列固定 (column pinning)，返回未固定/中间区域可见叶子节点列的扁平数组

### `setColumnVisibility`

```tsx
setColumnVisibility: (updater: Updater<VisibilityState>) => void
```

通过更新函数或值来更新列的可见性状态

### `resetColumnVisibility`

```tsx
resetColumnVisibility: (defaultState?: boolean) => void
```

将列的可见性状态重置为初始状态。如果提供了 `defaultState`，状态将被重置为 `{}`

### `toggleAllColumnsVisible`

```tsx
toggleAllColumnsVisible: (value?: boolean) => void
```

切换所有列的可见性状态

### `getIsAllColumnsVisible`

```tsx
getIsAllColumnsVisible: () => boolean
```

返回是否所有列都可见

### `getIsSomeColumnsVisible`

```tsx
getIsSomeColumnsVisible: () => boolean
```

返回是否部分列可见

### `getToggleAllColumnsVisibilityHandler`

```tsx
getToggleAllColumnsVisibilityHandler: () => ((event: unknown) => void)
```

返回用于切换所有列可见性的处理器函数，通常绑定到 `input[type=checkbox]` 元素上

## 行 API (Row API)

### `getVisibleCells`

```tsx
getVisibleCells: () => Cell<TData>[]
```

返回该行中考虑列可见性后的单元格数组
