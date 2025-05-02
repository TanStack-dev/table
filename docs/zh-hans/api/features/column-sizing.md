---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-02T17:36:21.001Z'
title: 列尺寸调整
id: column-sizing
---
## 状态 (State)

列尺寸调整的状态以以下形式存储在表格中：

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

## 列定义选项 (Column Def Options)

### `enableResizing`

```tsx
enableResizing?: boolean
```

启用或禁用该列的尺寸调整功能。

### `size`

```tsx
size?: number
```

该列的期望尺寸。

### `minSize`

```tsx
minSize?: number
```

该列允许的最小尺寸。

### `maxSize`

```tsx
maxSize?: number
```

该列允许的最大尺寸。

## 列 API (Column API)

### `getSize`

```tsx
getSize: () => number
```

返回该列的当前尺寸。

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

返回该列沿行轴（通常是标准表格的 x 轴）的偏移量测量值，测量的是所有前列的尺寸之和。

适用于列的粘性定位或绝对定位（例如 `left` 或 `transform`）。

### `getAfter`

```tsx
getAfter: (position?: ColumnPinningPosition) => number
```

返回该列沿行轴（通常是标准表格的 x 轴）的偏移量测量值，测量的是所有后列的尺寸之和。

适用于列的粘性定位或绝对定位（例如 `right` 或 `transform`）。

### `getCanResize`

```tsx
getCanResize: () => boolean
```

如果该列可以调整尺寸，则返回 `true`。

### `getIsResizing`

```tsx
getIsResizing: () => boolean
```

如果该列当前正在调整尺寸，则返回 `true`。

### `resetSize`

```tsx
resetSize: () => void
```

将该列的尺寸重置为其初始尺寸。

## 表头 API (Header API)

### `getSize`

```tsx
getSize: () => number
```

返回表头的尺寸，通过计算属于它的所有叶子列的尺寸之和得出。

### `getStart`

```tsx
getStart: (position?: ColumnPinningPosition) => number
```

返回表头沿行轴（通常是标准表格的 x 轴）的偏移量测量值。这实际上是所有前列偏移量测量值的总和。

### `getResizeHandler`

```tsx
getResizeHandler: () => (event: unknown) => void
```

返回一个事件处理函数，可用于调整表头尺寸。它可以用作：

- `onMouseDown` 处理程序
- `onTouchStart` 处理程序

拖拽和释放事件会自动处理。

## 表格选项 (Table Options)

### `enableColumnResizing`

```tsx
enableColumnResizing?: boolean
```

为**所有列**启用或禁用列尺寸调整功能。

### `columnResizeMode`

```tsx
columnResizeMode?: 'onChange' | 'onEnd'
```

决定何时更新 columnSizing 状态。`onChange` 在用户拖拽调整尺寸手柄时更新状态，`onEnd` 在用户释放调整尺寸手柄时更新状态。

### `columnResizeDirection`

```tsx
columnResizeDirection?: 'ltr' | 'rtl'
```

启用或禁用从右到左的列尺寸调整支持，默认为 'ltr'。

### `onColumnSizingChange`

```tsx
onColumnSizingChange?: OnChangeFn<ColumnSizingState>
```

当 columnSizing 状态变化时，此可选函数会被调用。如果提供此函数，您需要自行管理其状态。可以通过 `state.columnSizing` 表格选项将此状态传回表格。

### `onColumnSizingInfoChange`

```tsx
onColumnSizingInfoChange?: OnChangeFn<ColumnSizingInfoState>
```

当 columnSizingInfo 状态变化时，此可选函数会被调用。如果提供此函数，您需要自行管理其状态。可以通过 `state.columnSizingInfo` 表格选项将此状态传回表格。

## 表格 API (Table API)

### `setColumnSizing`

```tsx
setColumnSizing: (updater: Updater<ColumnSizingState>) => void
```

使用更新函数或值设置列尺寸调整状态。如果向表格选项传递了 `onColumnSizingChange` 函数，则会触发该函数，否则状态将由表格自动管理。

### `setColumnSizingInfo`

```tsx
setColumnSizingInfo: (updater: Updater<ColumnSizingInfoState>) => void
```

使用更新函数或值设置列尺寸调整信息状态。如果向表格选项传递了 `onColumnSizingInfoChange` 函数，则会触发该函数，否则状态将由表格自动管理。

### `resetColumnSizing`

```tsx
resetColumnSizing: (defaultState?: boolean) => void
```

将列尺寸调整重置为其初始状态。如果 `defaultState` 为 `true`，则会使用表格的默认状态而非提供的初始值。

### `resetHeaderSizeInfo`

```tsx
resetHeaderSizeInfo: (defaultState?: boolean) => void
```

将列尺寸调整信息重置为其初始状态。如果 `defaultState` 为 `true`，则会使用表格的默认状态而非提供的初始值。

### `getTotalSize`

```tsx
getTotalSize: () => number
```

通过计算所有叶子列的尺寸之和，返回表格的总尺寸。

### `getLeftTotalSize`

```tsx
getLeftTotalSize: () => number
```

如果启用了固定列，则通过计算所有左侧叶子列的尺寸之和，返回表格左侧部分的总尺寸。

### `getCenterTotalSize`

```tsx
getCenterTotalSize: () => number
```

如果启用了固定列，则通过计算所有未固定/中间叶子列的尺寸之和，返回表格中间部分的总尺寸。

### `getRightTotalSize`

```tsx
getRightTotalSize: () => number
```

如果启用了固定列，则通过计算所有右侧叶子列的尺寸之和，返回表格右侧部分的总尺寸。
