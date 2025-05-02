---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:13:21.812Z'
title: 列排序
---
## 示例

想直接查看实现方式？请参考以下示例：

- [列排序](../framework/react/examples/column-ordering)
- [列拖拽排序](../framework/react/examples/column-dnd)

## API

[列排序 API](../api/features/column-ordering)

## 列排序指南

默认情况下，列的顺序与它们在 `columns` 数组中定义的顺序一致。但你可以通过 `columnOrder` 状态手动指定列顺序。其他功能如列固定 (column pinning) 和分组 (grouping) 也会影响列顺序。

### 影响列顺序的因素

有 3 种表格功能会改变列顺序，优先级如下：

1. [列固定 (Column Pinning)](../guide/column-pinning) - 如果启用了固定功能，列会被分为左侧固定、中间非固定和右侧固定三部分。
2. **手动列排序 (Column Ordering)** - 应用手动指定的列顺序。
3. [分组 (Grouping)](../guide/grouping) - 如果启用了分组功能且存在分组状态，且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列会被重新排序到列流的最前面。

> **注意：** 当与列固定功能同时使用时，`columnOrder` 状态只会影响未固定的列。

### 列排序状态

如果不提供 `columnOrder` 状态，TanStack Table 会直接使用 `columns` 数组中的列顺序。但你可以通过向 `columnOrder` 状态提供一个列 ID 字符串数组来指定列顺序。

#### 默认列顺序

如果只需要指定初始列顺序，可以在 `initialState` 表格选项中设置 `columnOrder` 状态。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  }
  //...
});
```

> **注意：** 如果同时使用 `state` 表格选项来指定 `columnOrder` 状态，则 `initialState` 不会生效。请仅在 `initialState` 或 `state` 中指定特定状态，不要同时使用两者。

#### 管理列排序状态

如果需要动态更改列顺序，或在表格初始化后设置列顺序，可以像管理其他表格状态一样管理 `columnOrder` 状态。

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //可选地初始化列顺序
//...
const table = useReactTable({
  //...
  state: {
    columnOrder,
    //...
  }
  onColumnOrderChange: setColumnOrder,
  //...
});
```

### 重新排序列

如果表格提供了允许用户重新排列表列的 UI，可以按如下方式设置逻辑：

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.id));

//根据所选拖拽方案，可能需要或不需此类状态
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//用于拼接和重新排列 columnOrder 数组的工具函数
const reorderColumn = <TData extends RowData>(
  movingColumnId: Column<TData>,
  targetColumnId: Column<TData>,
): string[] => {
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumnId),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0],
  );
  setColumnOrder(newColumnOrder);
};

const handleDragEnd = (e: DragEvent) => {
  if(!movingColumnId || !targetColumnId) return;
  setColumnOrder(reorderColumn(movingColumnId, targetColumnId));
};

//使用你选择的拖拽方案
```

#### 拖拽排列表列建议 (React)

实现 TanStack Table 的拖拽功能有多种方式。以下建议可帮助你避免踩坑：

1. **不要** 在 React 18 或更新版本中使用 [`"react-dnd"`](https://react-dnd.github.io/react-dnd/docs/overview)。React DnD 在其时代是重要的库，但现在更新频率低，且与 React 18（尤其是严格模式）存在兼容性问题。虽然仍可使其工作，但有更现代、兼容性更好且维护更积极的替代方案。React DnD 的 Provider 也可能与你应用中其他 DnD 方案冲突。

2. 使用 [`"@dnd-kit/core"`](https://dndkit.com/)。DnD Kit 是一个现代化、模块化且轻量级的拖拽库，与现代 React 生态高度兼容，并能良好支持语义化的 `<table>` 标记。TanStack 官方提供的两个拖拽示例 [列拖拽](../framework/react/examples/column-dnd) 和 [行拖拽](../framework/react/examples/row-dnd) 现在均使用 DnD Kit。

3. 也可考虑其他 DnD 库如 [`"react-beautiful-dnd"`](https://github.com/atlassian/react-beautiful-dnd)，但需注意其可能较大的包体积、维护状态及对 `<table>` 标记的兼容性。

4. 考虑使用原生浏览器事件和状态管理实现轻量级拖拽功能。但需注意，如果不额外实现触摸事件支持，此方案可能对移动端用户不友好。[Material React Table V2](https://www.material-react-table.com/docs/examples/column-ordering) 是一个仅使用浏览器拖拽事件（如 `onDragStart`、`onDragEnd`、`onDragEnter`）且无其他依赖的实现示例，可参考其源码。
