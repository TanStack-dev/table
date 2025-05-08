---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:53.594Z'
title: 欄位固定
---
## 範例

想要直接查看實作方式嗎？請參考以下範例：

- [column-pinning](../framework/react/examples/column-pinning)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

### 其他範例
 
- [Svelte column-pinning](../framework/svelte/examples/column-pinning)
- [Vue column-pinning](../framework/vue/examples/column-pinning)

## API

[欄位釘選 API](../api/features/column-pinning)

## 欄位釘選指南

TanStack Table 提供了有助於在表格 UI 中實作欄位釘選功能的狀態和 API。你可以透過多種方式實作欄位釘選。你可以將釘選的欄位拆分到獨立的表格中，或是保持所有欄位在同一個表格內，但使用釘選狀態來正確排序欄位，並使用 sticky CSS 將欄位釘選在左側或右側。

### 欄位釘選如何影響欄位順序

有三種表格功能會影響欄位順序，其執行順序如下：

1. **欄位釘選** - 若啟用釘選，欄位會被拆分為左側、中間（未釘選）和右側釘選的欄位。
2. 手動[欄位排序](../guide/column-ordering) - 套用手動指定的欄位順序。
3. [群組](../guide/grouping) - 若啟用群組功能、有活躍的群組狀態，且 `tableOptions.groupedColumnMode` 設為 `'reorder' | 'remove'`，則群組欄位會被重新排序至欄位流的最前面。

改變釘選欄位順序的唯一方式是透過 `columnPinning.left` 和 `columnPinning.right` 狀態本身。`columnOrder` 狀態僅會影響未釘選（「中間」）欄位的順序。

### 欄位釘選狀態

管理 `columnPinning` 狀態是可選的，通常不需要除非你正在新增持久狀態功能。TanStack Table 已經會為你追蹤欄位釘選狀態。如有需要，可以像管理其他表格狀態一樣管理 `columnPinning` 狀態。

```jsx
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: [],
  right: [],
});
//...
const table = useReactTable({
  //...
  state: {
    columnPinning,
    //...
  }
  onColumnPinningChange: setColumnPinning,
  //...
});
```

### 預設釘選欄位

一個非常常見的使用情境是預設釘選某些欄位。你可以透過初始化 `columnPinning` 狀態時指定釘選的 columnIds，或是使用 `initialState` 表格選項來達成。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnPinning: {
      left: ['expand-column'],
      right: ['actions-column'],
    },
    //...
  }
  //...
});
```

### 實用的欄位釘選 API

> 注意：部分 API 是 v8.12.0 新增的

以下是一些有助於實作欄位釘選功能的實用欄位 API 方法：

- [`column.getCanPin`](../api/features/column-pinning#getcanpin)：用於判斷欄位是否可被釘選。
- [`column.pin`](../api/features/column-pinning#pin)：用於將欄位釘選至左側或右側，或用於取消釘選。
- [`column.getIsPinned`](../api/features/column-pinning#getispinned)：用於判斷欄位被釘選的位置。
- [`column.getStart`](../api/features/column-pinning#getstart)：用於提供釘選欄位正確的 `left` CSS 值。
- [`column.getAfter`](../api/features/column-pinning#getafter)：用於提供釘選欄位正確的 `right` CSS 值。
- [`column.getIsLastColumn`](../api/features/column-pinning#getislastcolumn)：用於判斷欄位是否為其釘選群組中的最後一個欄位。適用於新增 box-shadow。
- [`column.getIsFirstColumn`](../api/features/column-pinning#getisfirstcolumn)：用於判斷欄位是否為其釘選群組中的第一個欄位。適用於新增 box-shadow。

### 拆分表格的欄位釘選

如果你僅使用 sticky CSS 來釘選欄位，大部分情況下可以像平常一樣使用 `table.getHeaderGroups` 和 `row.getVisibleCells` 方法來渲染表格。

然而，如果你將釘選欄位拆分到獨立的表格中，可以使用 `table.getLeftHeaderGroups`、`table.getCenterHeaderGroups`、`table.getRightHeaderGroups`、`row.getLeftVisibleCells`、`row.getCenterVisibleCells` 和 `row.getRightVisibleCells` 方法，僅渲染與當前表格相關的欄位。
