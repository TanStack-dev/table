---
source-updated-at: '2024-02-27T21:03:18.000Z'
translation-updated-at: '2025-05-08T23:43:14.429Z'
title: 分頁
id: pagination
---
## 分頁狀態 (Pagination State)

分頁狀態儲存在表格中，其結構如下：

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

## 表格選項 (Table Options)

### `manualPagination`

```tsx
manualPagination?: boolean
```

啟用手動分頁。若設為 `true`，表格將不會自動使用 `getPaginationRowModel()` 進行分頁，而是預期你在傳遞資料前手動完成分頁。這在實作伺服器端分頁 (server-side pagination) 和資料聚合時特別有用。

### `pageCount`

```tsx
pageCount?: number
```

在手動控制分頁時，若已知總頁數，可透過此選項提供。若頁數未知，可設為 `-1`。或者，你也可以提供 `rowCount` 值，表格會自動計算 `pageCount`。

### `rowCount`

```tsx
rowCount?: number
```

在手動控制分頁時，若已知總列數，可透過此選項提供。`pageCount` 會根據 `rowCount` 和 `pageSize` 自動計算。

### `autoResetPageIndex`

```tsx
autoResetPageIndex?: boolean
```

若設為 `true`，當影響分頁的狀態變更時（例如資料更新、篩選條件變更、群組變更等），分頁會重置至第一頁。

> 🧠 注意：若 `manualPagination` 設為 `true`，此選項預設為 `false`

### `onPaginationChange`

```tsx
onPaginationChange?: OnChangeFn<PaginationState>
```

若提供此函式，當分頁狀態變更時會被呼叫，此時需自行管理狀態。可透過 `tableOptions.state.pagination` 選項將管理後的狀態傳回表格。

### `getPaginationRowModel`

```tsx
getPaginationRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

回傳僅套用分頁後的列模型 (row model)。

預設情況下，分頁欄位會自動重新排序至欄位列表的開頭。若需移除或保持原狀，請在此設定適當模式。

## 表格 API (Table API)

### `setPagination`

```tsx
setPagination: (updater: Updater<PaginationState>) => void
```

設定或更新 `state.pagination` 狀態。

### `resetPagination`

```tsx
resetPagination: (defaultState?: boolean) => void
```

將分頁狀態重置為 `initialState.pagination`。若傳入 `true`，則會強制重置為預設空白狀態 `[]`。

### `setPageIndex`

```tsx
setPageIndex: (updater: Updater<number>) => void
```

使用提供的函式或值更新頁面索引 (page index)。

### `resetPageIndex`

```tsx
resetPageIndex: (defaultState?: boolean) => void
```

將頁面索引重置為初始狀態。若 `defaultState` 為 `true`，則無論初始狀態為何，頁面索引都會重置為 `0`。

### `setPageSize`

```tsx
setPageSize: (updater: Updater<number>) => void
```

使用提供的函式或值更新頁面大小 (page size)。

### `resetPageSize`

```tsx
resetPageSize: (defaultState?: boolean) => void
```

將頁面大小重置為初始狀態。若 `defaultState` 為 `true`，則無論初始狀態為何，頁面大小都會重置為 `10`。

### `getPageOptions`

```tsx
getPageOptions: () => number[]
```

回傳當前頁面大小下的頁面選項陣列（以零為基底）。

### `getCanPreviousPage`

```tsx
getCanPreviousPage: () => boolean
```

回傳表格是否能前往上一頁。

### `getCanNextPage`

```tsx
getCanNextPage: () => boolean
```

回傳表格是否能前往下一頁。

### `previousPage`

```tsx
previousPage: () => void
```

若可能，將頁面索引減一。

### `nextPage`

```tsx
nextPage: () => void
```

若可能，將頁面索引加一。

### `firstPage`

```tsx
firstPage: () => void
```

將頁面索引設為 `0`。

### `lastPage`

```tsx
lastPage: () => void
```

將頁面索引設為最後一頁。

### `getPageCount`

```tsx
getPageCount: () => number
```

回傳總頁數。若手動分頁或控制分頁狀態，此值會直接來自 `options.pageCount` 表格選項；否則會根據總列數和當前頁面大小自動計算。

### `getPrePaginationRowModel`

```tsx
getPrePaginationRowModel: () => RowModel<TData>
```

回傳套用分頁前的表格列模型。

### `getPaginationRowModel`

```tsx
getPaginationRowModel: () => RowModel<TData>
```

回傳套用分頁後的表格列模型。
