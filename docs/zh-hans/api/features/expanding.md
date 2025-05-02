---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-02T17:41:33.285Z'
title: 展开
id: expanding
---
## 展开状态 (Expanded State)

展开状态 (expanded state) 以如下形式存储在表格中：

```tsx
export type ExpandedState = true | Record<string, boolean>

export type ExpandedTableState = {
  expanded: ExpandedState
}
```

## 行 API (Row API)

### `toggleExpanded`

```tsx
toggleExpanded: (expanded?: boolean) => void
```

切换行的展开状态（如果提供了 `expanded` 参数则直接设置该状态）。

### `getIsExpanded`

```tsx
getIsExpanded: () => boolean
```

返回当前行是否处于展开状态。

### `getIsAllParentsExpanded`

```tsx
getIsAllParentsExpanded: () => boolean
```

返回该行的所有父行是否均已展开。

### `getCanExpand`

```tsx
getCanExpand: () => boolean
```

返回该行是否允许被展开。

### `getToggleExpandedHandler`

```tsx
getToggleExpandedHandler: () => () => void
```

返回一个用于切换行展开状态的函数。该函数可用于绑定按钮的事件处理程序。

## 表格选项 (Table Options)

### `manualExpanding`

```tsx
manualExpanding?: boolean
```

启用手动行展开。若设为 `true`，将不会使用 `getExpandedRowModel` 来展开行，而是需要你在自己的数据模型中处理展开逻辑。适用于服务端展开 (server-side expansion) 场景。

### `onExpandedChange`

```tsx
onExpandedChange?: OnChangeFn<ExpandedState>
```

当表格的 `expanded` 状态变化时调用此函数。如果提供了该函数，你需要自行管理此状态。要将托管状态传回表格，需使用 `tableOptions.state.expanded` 选项。

### `autoResetExpanded`

```tsx
autoResetExpanded?: boolean
```

启用此设置可在展开状态变化时自动重置表格的展开状态。

### `enableExpanding`

```tsx
enableExpanding?: boolean
```

为所有行启用/禁用展开功能。

### `getExpandedRowModel`

```tsx
getExpandedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

该函数负责返回展开后的行模型。若未提供，表格将不会展开行。可使用默认导出的 `getExpandedRowModel` 函数获取展开行模型，或自行实现。

### `getIsRowExpanded`

```tsx
getIsRowExpanded?: (row: Row<TData>) => boolean
```

如果提供，可覆盖默认的行展开状态判断逻辑。

### `getRowCanExpand`

```tsx
getRowCanExpand?: (row: Row<TData>) => boolean
```

如果提供，可覆盖默认的行可展开性判断逻辑。

### `paginateExpandedRows`

```tsx
paginateExpandedRows?: boolean
```

设为 `true` 时，展开的行会与其他行一起参与分页（意味着展开的行可能跨越多页）。

设为 `false` 时，展开的行不参与分页（意味着展开的行始终会渲染在其父级所在页面，这会导致实际渲染的行数可能超过设定的页面大小）。

## 表格 API (Table API)

### `setExpanded`

```tsx
setExpanded: (updater: Updater<ExpandedState>) => void
```

通过更新函数或值来更新表格的展开状态。

### `toggleAllRowsExpanded`

```tsx
toggleAllRowsExpanded: (expanded?: boolean) => void
```

切换所有行的展开状态。可选提供参数来直接设置展开状态。

### `resetExpanded`

```tsx
resetExpanded: (defaultState?: boolean) => void
```

将表格的展开状态重置为初始状态。若提供 `defaultState` 参数，展开状态会被重置为 `{}`。

### `getCanSomeRowsExpand`

```tsx
getCanSomeRowsExpand: () => boolean
```

返回是否存在任何可展开的行。

### `getToggleAllRowsExpandedHandler`

```tsx
getToggleAllRowsExpandedHandler: () => (event: unknown) => void
```

返回一个可用于切换所有行展开状态的处理器。该处理器设计用于 `input[type=checkbox]` 元素。

### `getIsSomeRowsExpanded`

```tsx
getIsSomeRowsExpanded: () => boolean
```

返回是否存在任何已展开的行。

### `getIsAllRowsExpanded`

```tsx
getIsAllRowsExpanded: () => boolean
```

返回是否所有行当前均已展开。

### `getExpandedDepth`

```tsx
getExpandedDepth: () => number
```

返回已展开行的最大深度。

### `getExpandedRowModel`

```tsx
getExpandedRowModel: () => RowModel<TData>
```

返回应用展开操作后的行模型。

### `getPreExpandedRowModel`

```tsx
getPreExpandedRowModel: () => RowModel<TData>
```

返回应用展开操作前的原始行模型。
