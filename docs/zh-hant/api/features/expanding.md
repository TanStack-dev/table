---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-08T23:43:48.011Z'
title: 展開
id: expanding
---
## 狀態 (State)

展開狀態 (expanded state) 會以下列形式儲存在表格中：

```tsx
export type ExpandedState = true | Record<string, boolean>

export type ExpandedTableState = {
  expanded: ExpandedState
}
```

## 行 (Row) API

### `toggleExpanded`

```tsx
toggleExpanded: (expanded?: boolean) => void
```

切換行的展開狀態 (若提供 `expanded` 參數則直接設定狀態)。

### `getIsExpanded`

```tsx
getIsExpanded: () => boolean
```

回傳該行是否處於展開狀態。

### `getIsAllParentsExpanded`

```tsx
getIsAllParentsExpanded: () => boolean
```

回傳該行的所有父行是否都已展開。

### `getCanExpand`

```tsx
getCanExpand: () => boolean
```

回傳該行是否可以展開。

### `getToggleExpandedHandler`

```tsx
getToggleExpandedHandler: () => () => void
```

回傳一個可用於切換該行展開狀態的函式。此函式可綁定到按鈕的事件處理器上使用。

## 表格選項 (Table Options)

### `manualExpanding`

```tsx
manualExpanding?: boolean
```

啟用手動行展開模式。若設為 `true`，將不會使用 `getExpandedRowModel` 來展開行，而是預期由開發者自行在資料模型中處理展開邏輯。適用於伺服器端展開 (server-side expansion) 情境。

### `onExpandedChange`

```tsx
onExpandedChange?: OnChangeFn<ExpandedState>
```

當表格的 `expanded` 狀態變更時呼叫此函式。若提供此函式，開發者需自行管理此狀態。若要將管理後的狀態傳回表格，請使用 `tableOptions.state.expanded` 選項。

### `autoResetExpanded`

```tsx
autoResetExpanded?: boolean
```

啟用此設定可在展開狀態變更時自動重設表格的展開狀態。

### `enableExpanding`

```tsx
enableExpanding?: boolean
```

啟用/停用所有行的展開功能。

### `getExpandedRowModel`

```tsx
getExpandedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

此函式負責回傳展開後的行模型 (row model)。若未提供此函式，表格將不會展開行。可使用預設匯出的 `getExpandedRowModel` 函式或自行實作。

### `getIsRowExpanded`

```tsx
getIsRowExpanded?: (row: Row<TData>) => boolean
```

若提供此函式，可覆寫預設的「判斷行是否已展開」行為。

### `getRowCanExpand`

```tsx
getRowCanExpand?: (row: Row<TData>) => boolean
```

若提供此函式，可覆寫預設的「判斷行是否可以展開」行為。

### `paginateExpandedRows`

```tsx
paginateExpandedRows?: boolean
```

若設為 `true`，展開的行會與表格其他部分一起分頁 (這表示展開的行可能跨越多個分頁)。

若設為 `false`，展開的行不會納入分頁計算 (這表示展開的行永遠會在其父行所在的分頁中渲染，同時也意味著實際渲染的行數會超過設定的頁面大小)。

## 表格 API (Table API)

### `setExpanded`

```tsx
setExpanded: (updater: Updater<ExpandedState>) => void
```

透過更新函式或值來更新表格的展開狀態。

### `toggleAllRowsExpanded`

```tsx
toggleAllRowsExpanded: (expanded?: boolean) => void
```

切換所有行的展開狀態。可選擇性提供參數來直接設定展開狀態。

### `resetExpanded`

```tsx
resetExpanded: (defaultState?: boolean) => void
```

將表格的展開狀態重設為初始狀態。若提供 `defaultState` 參數，展開狀態會重設為 `{}`。

### `getCanSomeRowsExpand`

```tsx
getCanSomeRowsExpand: () => boolean
```

回傳是否有任何行可被展開。

### `getToggleAllRowsExpandedHandler`

```tsx
getToggleAllRowsExpandedHandler: () => (event: unknown) => void
```

回傳一個可用於切換所有行展開狀態的處理器。此處理器需搭配 `input[type=checkbox]` 元素使用。

### `getIsSomeRowsExpanded`

```tsx
getIsSomeRowsExpanded: () => boolean
```

回傳是否有任何行目前處於展開狀態。

### `getIsAllRowsExpanded`

```tsx
getIsAllRowsExpanded: () => boolean
```

回傳是否所有行目前都處於展開狀態。

### `getExpandedDepth`

```tsx
getExpandedDepth: () => number
```

回傳已展開行的最大深度。

### `getExpandedRowModel`

```tsx
getExpandedRowModel: () => RowModel<TData>
```

回傳套用展開處理後的行模型。

### `getPreExpandedRowModel`

```tsx
getPreExpandedRowModel: () => RowModel<TData>
```

回傳套用展開處理前的行模型。
