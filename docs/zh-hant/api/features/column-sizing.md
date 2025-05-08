---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-08T23:44:02.123Z'
title: 欄位調整大小
id: column-sizing
---
## 狀態 (State)

欄位調整大小的狀態儲存在表格中，結構如下：

```tsx
export type ColumnSizingTableState = {
  columnSizing: ColumnSizing
  columnSizingInfo: ColumnSizingInfoState
}

export type ColumnSizing = Record<string, number>

export type ColumnSizingInfoState = {
  startOffset: null | number
  startSize: null | number
  deltaOffset: null | number
  deltaPercentage: null | number
  isResizingColumn: false | string
  columnSizingStart: [string, number][]
}
```

## 欄位定義選項 (Column Def Options)

### `enableResizing`

```tsx
enableResizing?: boolean
```

啟用或禁用欄位的調整大小功能。

### `size`

```tsx
size?: number
```

欄位的預設大小。

### `minSize`

```tsx
minSize?: number
```

欄位允許的最小大小。

### `maxSize`

```tsx
maxSize?: number
```

欄位允許的最大大小。

## 欄位 API (Column API)

### `getSize`

```tsx
getSize: () => number
```

回傳欄位的目前大小。

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

回傳欄位在行軸（通常為標準表格的 x 軸）上的偏移量測量值，測量所有前置欄位的大小。

適用於欄位的固定或絕對定位（例如 `left` 或 `transform`）。

### `getAfter`

```tsx
getAfter: (position?: ColumnPinningPosition) => number
```

回傳欄位在行軸（通常為標準表格的 x 軸）上的偏移量測量值，測量所有後續欄位的大小。

適用於欄位的固定或絕對定位（例如 `right` 或 `transform`）。

### `getCanResize`

```tsx
getCanResize: () => boolean
```

如果欄位可以調整大小，則回傳 `true`。

### `getIsResizing`

```tsx
getIsResizing: () => boolean
```

如果欄位目前正在調整大小，則回傳 `true`。

### `resetSize`

```tsx
resetSize: () => void
```

將欄位大小重設為初始大小。

## 表頭 API (Header API)

### `getSize`

```tsx
getSize: () => number
```

回傳表頭的大小，計算方式為加總所有屬於該表頭的葉欄位大小。

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

回傳表頭在行軸（通常為標準表格的 x 軸）上的偏移量測量值。這實際上是所有前置表頭偏移量測量值的總和。

### `getResizeHandler`

```tsx
getResizeHandler: () => (event: unknown) => void
```

回傳一個事件處理函數，可用於調整表頭大小。它可以作為以下事件的處理器：

- `onMouseDown` 處理器
- `onTouchStart` 處理器

拖曳和釋放事件會自動處理。

## 表格選項 (Table Options)

### `enableColumnResizing`

```tsx
enableColumnResizing?: boolean
```

啟用或禁用**所有欄位**的調整大小功能。

### `columnResizeMode`

```tsx
columnResizeMode?: 'onChange' | 'onEnd'
```

決定 `columnSizing` 狀態的更新時機。`onChange` 在使用者拖曳調整大小手柄時更新狀態；`onEnd` 在使用者釋放調整大小手柄時更新狀態。

### `columnResizeDirection`

```tsx
columnResizeDirection?: 'ltr' | 'rtl'
```

啟用或禁用從右到左的欄位調整大小支援，預設為 `'ltr'`。

### `onColumnSizingChange`

```tsx
onColumnSizingChange?: OnChangeFn<ColumnSizingState>
```

此選用函數會在 `columnSizing` 狀態變更時被呼叫。如果提供此函數，您需自行管理其狀態。您可以透過 `state.columnSizing` 表格選項將此狀態傳回表格。

### `onColumnSizingInfoChange`

```tsx
onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
```

此選用函數會在 `columnSizingInfo` 狀態變更時被呼叫。如果提供此函數，您需自行管理其狀態。您可以透過 `state.columnSizingInfo` 表格選項將此狀態傳回表格。

## 表格 API (Table API)

### `setColumnSizing`

```tsx
setColumnSizing: (updater: Updater<ColumnSizingState>) => void
```

使用更新函數或值設定欄位大小狀態。如果表格選項中有傳遞 `onColumnSizingChange` 函數，則會觸發該函數；否則狀態將由表格自動管理。

### `setColumnSizingInfo`

```tsx
setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
```

使用更新函數或值設定欄位大小資訊狀態。如果表格選項中有傳遞 `onColumnSizingInfoChange` 函數，則會觸發該函數；否則狀態將由表格自動管理。

### `resetColumnSizing`

```tsx
resetColumnSizing: (defaultState?: boolean) => void
```

將欄位大小重設為初始狀態。如果 `defaultState` 為 `true`，則會使用表格的預設狀態，而非提供給表格的初始值。

### `resetHeaderSizeInfo`

```tsx
resetHeaderSizeInfo: (defaultState?: boolean) => void
```

將欄位大小資訊重設為初始狀態。如果 `defaultState` 為 `true`，則會使用表格的預設狀態，而非提供給表格的初始值。

### `getTotalSize`

```tsx
getTotalSize: () => number
```

回傳表格的總大小，計算方式為加總所有葉欄位的大小。

### `getLeftTotalSize`

```tsx
getLeftTotalSize: () => number
```

如果啟用固定欄位，回傳表格左側部分的總大小，計算方式為加總所有左側葉欄位的大小。

### `getCenterTotalSize`

```tsx
getCenterTotalSize: () => number
```

如果啟用固定欄位，回傳表格中間部分的總大小，計算方式為加總所有未固定/中間葉欄位的大小。

### `getRightTotalSize`

```tsx
getRightTotalSize: () => number
```

如果啟用固定欄位，回傳表格右側部分的總大小，計算方式為加總所有右側葉欄位的大小。
