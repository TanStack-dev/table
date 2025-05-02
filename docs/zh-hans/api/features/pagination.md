---
source-updated-at: '2024-02-27T21:03:18.000Z'
translation-updated-at: '2025-05-02T17:42:17.326Z'
title: 分页
id: pagination
---
## 分页状态 (Pagination State)

分页状态以如下结构存储在表格中：

```tsx
export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export type PaginationTableState = {
  pagination: PaginationState
}

export type PaginationInitialTableState = {
  pagination?: Partial<PaginationState>
}
```

## 表格选项 (Table Options)

### `manualPagination`

```tsx
manualPagination?: boolean
```

启用手动分页。若设为 `true`，表格不会自动使用 `getPaginationRowModel()` 分页行数据，而是期望你在传入数据前手动完成分页。适用于服务端分页 (server-side pagination) 和聚合场景。

### `pageCount`

```tsx
pageCount?: number
```

在手动控制分页时，如果已知总页数可传入此值。若页数未知可设为 `-1`。替代方案是提供 `rowCount` 值，表格会据此内部计算 `pageCount`。

### `rowCount`

```tsx
rowCount?: number
```

在手动控制分页时，如果已知总行数可传入此值。`pageCount` 将根据 `rowCount` 和 `pageSize` 内部计算得出。

### `autoResetPageIndex`

```tsx
autoResetPageIndex?: boolean
```

设为 `true` 时，当发生影响分页的状态变更（如 `data` 更新、筛选条件变化、分组变化等），分页将重置到第一页。

> 🧠 注意：若 `manualPagination` 为 `true`，此选项默认为 `false`

### `onPaginationChange`

```tsx
onPaginationChange?: OnChangeFn<PaginationState>
```

提供此函数后，分页状态变化时会调用该函数，此时需自行管理状态。可通过 `tableOptions.state.pagination` 将管理后的状态传回表格。

### `getPaginationRowModel`

```tsx
getPaginationRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

返回仅经过分页处理后的行模型 (row model)。

默认情况下分页列会自动重排到列列表开头。若需保留原顺序或移除分页列，可在此设置对应模式。

## 表格 API (Table API)

### `setPagination`

```tsx
setPagination: (updater: Updater<PaginationState>) => void
```

设置或更新 `state.pagination` 状态。

### `resetPagination`

```tsx
resetPagination: (defaultState?: boolean) => void
```

将分页状态重置为 `initialState.pagination`，传入 `true` 可强制重置为默认空状态 `[]`。

### `setPageIndex`

```tsx
setPageIndex: (updater: Updater<number>) => void
```

使用指定函数或值更新当前页码 (page index)。

### `resetPageIndex`

```tsx
resetPageIndex: (defaultState?: boolean) => void
```

重置页码至初始状态。若 `defaultState` 为 `true`，无论初始状态如何都会重置为 `0`。

### `setPageSize`

```tsx
setPageSize: (updater: Updater<number>) => void
```

使用指定函数或值更新每页大小 (page size)。

### `resetPageSize`

```tsx
resetPageSize: (defaultState?: boolean) => void
```

重置每页大小至初始状态。若 `defaultState` 为 `true`，无论初始状态如何都会重置为 `10`。

### `getPageOptions`

```tsx
getPageOptions: () => number[]
```

返回基于当前每页大小的页码选项数组（从零开始索引）。

### `getCanPreviousPage`

```tsx
getCanPreviousPage: () => boolean
```

返回表格是否能跳转到上一页。

### `getCanNextPage`

```tsx
getCanNextPage: () => boolean
```

返回表格是否能跳转到下一页。

### `previousPage`

```tsx
previousPage: () => void
```

将当前页码减一（如果允许）。

### `nextPage`

```tsx
nextPage: () => void
```

将当前页码加一（如果允许）。

### `firstPage`

```tsx
firstPage: () => void
```

跳转到第一页（页码设为 `0`）。

### `lastPage`

```tsx
lastPage: () => void
```

跳转到最后一页。

### `getPageCount`

```tsx
getPageCount: () => number
```

返回总页数。如果是手动分页或控制分页状态，此值直接来自 `options.pageCount` 选项，否则会根据总行数和当前每页大小计算得出。

### `getPrePaginationRowModel`

```tsx
getPrePaginationRowModel: () => RowModel<TData>
```

返回未应用分页前的原始行模型。

### `getPaginationRowModel`

```tsx
getPaginationRowModel: () => RowModel<TData>
```

返回应用分页处理后的行模型。
