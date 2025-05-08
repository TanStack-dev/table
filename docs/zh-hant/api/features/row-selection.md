---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:02.544Z'
title: 行選擇
id: row-selection
---
## 狀態 (State)

列選擇狀態以下列形式儲存在表格中：

```tsx
export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}
```

預設情況下，列選擇狀態使用每列的索引作為列識別符號。也可以通過向表格傳入自訂的 [getRowId](../core/table.md#getrowid) 函數，使用自訂的唯一列 ID 來追蹤列選擇狀態。

## 表格選項 (Table Options)

### `enableRowSelection`

```tsx
enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 啟用/停用表格中所有列的列選擇功能，或
- 一個接收列並返回是否啟用/停用該列選擇功能的函數

### `enableMultiRowSelection`

```tsx
enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- 啟用/停用表格中所有列的多列選擇功能，或
- 一個接收列並返回是否啟用/停用該列的子列/孫列多列選擇功能的函數

### `enableSubRowSelection`

```tsx
enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

啟用/停用當父列被選中時自動選擇子列的功能，或一個為每列啟用/停用自動選擇子列功能的函數。

（需與展開或分組功能一起使用）

### `onRowSelectionChange`

```tsx
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

如果提供，此函數將在 `state.rowSelection` 變更時被呼叫並傳入一個 `updaterFn`。這會覆蓋預設的內部狀態管理，因此您需要在表格外部完全或部分保存狀態變更。

## 表格 API (Table API)

### `getToggleAllRowsSelectedHandler`

```tsx
getToggleAllRowsSelectedHandler: () => (event: unknown) => void
```

返回一個可用於切換表格中所有列選擇狀態的處理函數。

### `getToggleAllPageRowsSelectedHandler`

```tsx
getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
```

返回一個可用於切換當前頁面所有列選擇狀態的處理函數。

### `setRowSelection`

```tsx
setRowSelection: (updater: Updater<RowSelectionState>) => void
```

設定或更新 `state.rowSelection` 狀態。

### `resetRowSelection`

```tsx
resetRowSelection: (defaultState?: boolean) => void
```

將 **rowSelection** 狀態重置為 `initialState.rowSelection`，或傳入 `true` 強制重置為預設空白狀態 `{}`。

### `getIsAllRowsSelected`

```tsx
getIsAllRowsSelected: () => boolean
```

返回表格中所有列是否被選中。

### `getIsAllPageRowsSelected`

```tsx
getIsAllPageRowsSelected: () => boolean
```

返回當前頁面所有列是否被選中。

### `getIsSomeRowsSelected`

```tsx
getIsSomeRowsSelected: () => boolean
```

返回表格中是否有任何列被選中。

注意：如果所有列都被選中，則返回 `false`。

### `getIsSomePageRowsSelected`

```tsx
getIsSomePageRowsSelected: () => boolean
```

返回當前頁面是否有任何列被選中。

### `toggleAllRowsSelected`

```tsx
toggleAllRowsSelected: (value: boolean) => void
```

選中/取消選中表格中所有列。

### `toggleAllPageRowsSelected`

```tsx
toggleAllPageRowsSelected: (value: boolean) => void
```

選中/取消選中當前頁面所有列。

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

## 列 API (Row API)

### `getIsSelected`

```tsx
getIsSelected: () => boolean
```

返回該列是否被選中。

### `getIsSomeSelected`

```tsx
getIsSomeSelected: () => boolean
```

返回該列的部分子列是否被選中。

### `getIsAllSubRowsSelected`

```tsx
getIsAllSubRowsSelected: () => boolean
```

返回該列的所有子列是否被選中。

### `getCanSelect`

```tsx
getCanSelect: () => boolean
```

返回該列是否可以被選中。

### `getCanMultiSelect`

```tsx
getCanMultiSelect: () => boolean
```

返回該列是否可以進行多列選擇。

### `getCanSelectSubRows`

```tsx
getCanSelectSubRows: () => boolean
```

返回當父列被選中時，是否可以自動選擇子列。

### `toggleSelected`

```tsx
toggleSelected: (value?: boolean) => void
```

選中/取消選中該列。

### `getToggleSelectedHandler`

```tsx
getToggleSelectedHandler: () => (event: unknown) => void
```

返回一個可用於切換該列選擇狀態的處理函數。
