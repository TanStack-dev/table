---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:42:10.842Z'
title: 欄位排序
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [column-ordering](../framework/react/examples/column-ordering)
- [column-dnd](../framework/react/examples/column-dnd)

## API

[欄位排序 API](../api/features/column-ordering)

## 欄位排序指南

預設情況下，欄位會按照 `columns` 陣列中定義的順序排列。然而，您可以使用 `columnOrder` 狀態手動指定欄位順序。其他功能如欄位固定 (pinning) 和分組 (grouping) 也會影響欄位排序。

### 影響欄位排序的因素

共有 3 種表格功能會重新排序欄位，其執行順序如下：

1. [欄位固定 (Column Pinning)](../guide/column-pinning) - 若啟用固定功能，欄位會被拆分為左側、中間 (未固定) 和右側固定的欄位。
2. 手動 **欄位排序** - 套用手動指定的欄位順序。
3. [分組 (Grouping)](../guide/grouping) - 若啟用分組功能、分組狀態為啟用，且 `tableOptions.groupedColumnMode` 設為 `'reorder' | 'remove'`，則分組欄位會被重新排序至欄位流的最前面。

> **注意：** 若與欄位固定功能同時使用，`columnOrder` 狀態僅會影響未固定的欄位。

### 欄位排序狀態

若未提供 `columnOrder` 狀態，TanStack Table 將直接使用 `columns` 陣列中的欄位順序。但您可以提供一個包含字串欄位 ID 的陣列給 `columnOrder` 狀態來指定欄位順序。

#### 預設欄位順序

若只需指定初始欄位順序，可直接在 `initialState` 表格選項中設定 `columnOrder` 狀態。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  }
  //...
});
```

> **注意：** 若同時使用 `state` 表格選項來指定 `columnOrder` 狀態，`initialState` 將不會生效。請僅在 `initialState` 或 `state` 其中一處指定特定狀態，不要兩者都指定。

#### 管理欄位排序狀態

若需動態變更欄位順序，或在表格初始化後設定欄位順序，可以像管理其他表格狀態一樣管理 `columnOrder` 狀態。

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //可選擇初始化欄位順序
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

### 重新排序欄位

若表格提供允許使用者重新排序欄位的 UI，可以按照以下方式設定邏輯：

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.id));

//根據選擇的拖放 (dnd) 解決方案，您可能需要或不需要此類狀態
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//用於拼接和重新排序 columnOrder 陣列的實用函數
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

//使用您選擇的拖放解決方案
```

#### 拖放欄位重新排序建議 (React)

實作拖放功能與 TanStack Table 搭配使用的方式無疑有許多種。以下是幾項建議，以避免遇到問題：

1. **不要** 嘗試使用 [`"react-dnd"`](https://react-dnd.github.io/react-dnd/docs/overview) _若您使用的是 React 18 或更新版本_。React DnD 在其時代是一個重要的函式庫，但現在更新頻率較低，且與 React 18 存在不相容問題，特別是在 React Strict Mode 中。雖然仍有可能使其運作，但有更新且更活躍維護的替代方案，相容性更好。React DnD 的 Provider 也可能干擾或與您應用中其他拖放解決方案衝突。

2. 使用 [`"@dnd-kit/core"`](https://dndkit.com/)。DnD Kit 是一個現代化、模組化且輕量的拖放函式庫，與現代 React 生態系統高度相容，且能良好支援語意化的 `<table>` 標記。官方 TanStack 拖放範例 [Column DnD](../framework/react/examples/column-dnd) 和 [Row DnD](../framework/react/examples/row-dnd) 現在都使用 DnD Kit。

3. 考慮其他拖放函式庫如 [`"react-beautiful-dnd"`](https://github.com/atlassian/react-beautiful-dnd)，但需注意其可能較大的套件體積、維護狀態以及與 `<table>` 標記的相容性。

4. 考慮使用原生瀏覽器事件和狀態管理來實作輕量的拖放功能。但需注意，若未額外實作適當的觸控事件，此方法可能對行動裝置使用者不夠友善。[Material React Table V2](https://www.material-react-table.com/docs/examples/column-ordering) 是一個僅使用瀏覽器拖放事件 (如 `onDragStart`、`onDragEnd`、`onDragEnter`) 且無其他依賴的 TanStack Table 實作範例。可瀏覽其原始碼了解實作方式。
