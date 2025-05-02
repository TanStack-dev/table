---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:13:59.207Z'
title: 列固定
---
## 示例

想要直接查看实现方式？请参考以下示例：

- [列固定](../framework/react/examples/column-pinning)
- [粘性列固定](../framework/react/examples/column-pinning-sticky)

### 其他示例
 
- [Svelte 列固定](../framework/svelte/examples/column-pinning)
- [Vue 列固定](../framework/vue/examples/column-pinning)

## API

[列固定 API](../api/features/column-pinning)

## 列固定指南

TanStack Table 提供了有助于在表格 UI 中实现列固定功能的状态和 API。您可以通过多种方式实现列固定：既可以将固定列拆分为独立的表格，也可以将所有列保留在同一表格中，但通过固定状态正确排序列，并使用粘性 CSS 将列固定在左侧或右侧。

### 列固定如何影响列顺序

有 3 种表格功能会重新排序列，其执行顺序如下：

1. **列固定** - 如果启用固定，列会被拆分为左侧、中间（未固定）和右侧固定列。
2. 手动[列排序](../guide/column-ordering) - 应用手动指定的列顺序。
3. [分组](../guide/grouping) - 如果启用了分组、存在分组状态且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列会被重新排序到列流的最前面。

改变固定列顺序的唯一方式是直接修改 `columnPinning.left` 和 `columnPinning.right` 状态本身。`columnOrder` 状态仅影响未固定（"中间"）列的排序。

### 列固定状态

管理 `columnPinning` 状态是可选的，通常在添加持久状态功能时才需要。TanStack Table 会为您自动跟踪列固定状态。如需管理，可像处理其他表格状态一样操作：

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

### 默认固定列

一个常见需求是默认固定某些列。可以通过初始化 `columnPinning` 状态或使用 `initialState` 表格选项实现：

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

### 实用列固定 API

> 注意：部分 API 在 v8.12.0 版本新增

以下列 API 方法可帮助实现列固定功能：

- [`column.getCanPin`](../api/features/column-pinning#getcanpin)：判断列是否可固定
- [`column.pin`](../api/features/column-pinning#pin)：将列固定到左侧/右侧，或取消固定
- [`column.getIsPinned`](../api/features/column-pinning#getispinned)：获取列的固定位置
- [`column.getStart`](../api/features/column-pinning#getstart)：获取固定列的正确 `left` CSS 值
- [`column.getAfter`](../api/features/column-pinning#getafter)：获取固定列的正确 `right` CSS 值
- [`column.getIsLastColumn`](../api/features/column-pinning#getislastcolumn)：判断列是否是其固定组中的最后一列（适用于添加盒阴影）
- [`column.getIsFirstColumn`](../api/features/column-pinning#getisfirstcolumn)：判断列是否是其固定组中的第一列（适用于添加盒阴影）

### 拆分表格列固定

如果仅使用粘性 CSS 固定列，通常只需正常渲染表格，使用 `table.getHeaderGroups` 和 `row.getVisibleCells` 方法即可。

但若要将固定列拆分为独立表格，可以使用 `table.getLeftHeaderGroups`、`table.getCenterHeaderGroups`、`table.getRightHeaderGroups`、`row.getLeftVisibleCells`、`row.getCenterVisibleCells` 和 `row.getRightVisibleCells` 方法，仅渲染当前表格相关的列。
