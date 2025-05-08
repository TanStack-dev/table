---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-08T23:43:35.265Z'
title: 欄位排序
id: column-ordering
---
## 狀態 (State)

欄位排序狀態 (column ordering state) 會以以下形式儲存在表格中：

```tsx
export type ColumnOrderTableState = {
  columnOrder: ColumnOrderState
}

export type ColumnOrderState = string[]
```

## 表格選項 (Table Options)

### `onColumnOrderChange`

```tsx
onColumnOrderChange?: OnChangeFn<ColumnOrderState>
```

若提供此函式，當 `state.columnOrder` 變更時會呼叫此函式並傳入 `updaterFn`。這會覆蓋預設的內部狀態管理，因此您需要在表格外部完全或部分地持久化狀態變更。

## 表格 API (Table API)

### `setColumnOrder`

```tsx
setColumnOrder: (updater: Updater<ColumnOrderState>) => void
```

設定或更新 `state.columnOrder` 狀態。

### `resetColumnOrder`

```tsx
resetColumnOrder: (defaultState?: boolean) => void
```

將 **columnOrder** 狀態重設為 `initialState.columnOrder`，或傳入 `true` 強制重設為預設的空狀態 `[]`。

## 欄位 API (Column API)

### `getIndex`

```tsx
getIndex: (position?: ColumnPinningPosition) => number
```

回傳欄位在可見欄位排序中的索引 (index)。可選擇性傳入 `position` 參數來取得欄位在表格子區段中的索引。

### `getIsFirstColumn`

```tsx
getIsFirstColumn: (position?: ColumnPinningPosition) => boolean
```

若欄位是可見欄位排序中的第一個欄位，則回傳 `true`。可選擇性傳入 `position` 參數來檢查欄位是否為表格子區段中的第一個欄位。

### `getIsLastColumn`

```tsx
getIsLastColumn: (position?: ColumnPinningPosition) => boolean
```

若欄位是可見欄位排序中的最後一個欄位，則回傳 `true`。可選擇性傳入 `position` 參數來檢查欄位是否為表格子區段中的最後一個欄位。
