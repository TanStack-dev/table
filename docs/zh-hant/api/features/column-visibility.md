---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-08T23:43:42.211Z'
title: 欄位可見性
id: column-visibility
---
## 狀態 (State)

欄位可見性狀態 (column visibility state) 會以以下格式儲存在表格中：

```tsx
export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}
```

## 欄位定義選項 (Column Def Options)

### `enableHiding`

```tsx
enableHiding?: boolean
```

啟用/停用隱藏該欄位

## 欄位 API (Column API)

### `getCanHide`

```tsx
getCanHide: () => boolean
```

回傳該欄位是否可被隱藏

### `getIsVisible`

```tsx
getIsVisible: () => boolean
```

回傳該欄位是否可見

### `toggleVisibility`

```tsx
toggleVisibility: (value?: boolean) => void
```

切換欄位的可見性

### `getToggleVisibilityHandler`

```tsx
getToggleVisibilityHandler: () => (event: unknown) => void
```

回傳一個可用於切換欄位可見性的函式。此函式可綁定至核取方塊 (checkbox) 的事件處理器。

## 表格選項 (Table Options)

### `onColumnVisibilityChange`

```tsx
onColumnVisibilityChange?: OnChangeFn<VisibilityState>
```

若提供此函式，當 `state.columnVisibility` 變更時會呼叫此函式並傳入 `updaterFn`。這會覆蓋預設的內部狀態管理，因此您需要在表格外部完全或部分持久化狀態變更。

### `enableHiding`

```tsx
enableHiding?: boolean
```

啟用/停用欄位隱藏功能。

## 表格 API (Table API)

### `getVisibleFlatColumns`

```tsx
getVisibleFlatColumns: () => Column<TData>[]
```

回傳包含父欄位在內的可見欄位扁平陣列。

### `getVisibleLeafColumns`

```tsx
getVisibleLeafColumns: () => Column<TData>[]
```

回傳可見的葉節點 (leaf-node) 欄位扁平陣列。

### `getLeftVisibleLeafColumns`

```tsx
getLeftVisibleLeafColumns: () => Column<TData>[]
```

若啟用欄位釘選 (column pinning)，回傳表格左側部分的可見葉節點欄位扁平陣列。

### `getRightVisibleLeafColumns`

```tsx
getRightVisibleLeafColumns: () => Column<TData>[]
```

若啟用欄位釘選，回傳表格右側部分的可見葉節點欄位扁平陣列。

### `getCenterVisibleLeafColumns`

```tsx
getCenterVisibleLeafColumns: () => Column<TData>[]
```

若啟用欄位釘選，回傳表格未釘選/中間部分的可見葉節點欄位扁平陣列。

### `setColumnVisibility`

```tsx
setColumnVisibility: (updater: Updater<VisibilityState>) => void
```

透過更新函式 (updater function) 或值來更新欄位可見性狀態

### `resetColumnVisibility`

```tsx
resetColumnVisibility: (defaultState?: boolean) => void
```

將欄位可見性狀態重設為初始狀態。若提供 `defaultState`，狀態將被重設為 `{}`

### `toggleAllColumnsVisible`

```tsx
toggleAllColumnsVisible: (value?: boolean) => void
```

切換所有欄位的可見性

### `getIsAllColumnsVisible`

```tsx
getIsAllColumnsVisible: () => boolean
```

回傳是否所有欄位皆可見

### `getIsSomeColumnsVisible`

```tsx
getIsSomeColumnsVisible: () => boolean
```

回傳是否部分欄位可見

### `getToggleAllColumnsVisibilityHandler`

```tsx
getToggleAllColumnsVisibilityHandler: () => ((event: unknown) => void)
```

回傳用於切換所有欄位可見性的處理器，預期綁定至 `input[type=checkbox]` 元素。

## 列 API (Row API)

### `getVisibleCells`

```tsx
getVisibleCells: () => Cell<TData>[]
```

回傳該列中已考量欄位可見性的儲存格 (cell) 陣列。
