---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-08T23:43:47.458Z'
title: 分組
id: grouping
---
## 狀態 (State)

群組狀態 (Grouping State) 會以下列形式儲存在表格中：

```tsx
export type GroupingState = string[]

export type GroupingTableState = {
  grouping: GroupingState
}
```

## 聚合函式 (Aggregation Functions)

表格核心內建以下聚合函式 (Aggregation Functions)：

- `sum`
  - 計算一組列 (rows) 的數值總和
- `min`
  - 找出一組列的最小值
- `max`
  - 找出一組列的最大值
- `extent`
  - 找出一組列的最小值和最大值
- `mean`
  - 計算一組列的平均值
- `median`
  - 找出一組列的中位數
- `unique`
  - 找出一組列的唯一值
- `uniqueCount`
  - 計算一組列的唯一值數量
- `count`
  - 計算一組列的數量

每個聚合函式會接收：

- 一個用於取得群組列葉節點值 (leaf values) 的函式
- 一個用於取得群組列直接子節點值 (immediate-child values) 的函式

並應回傳一個值（通常是原始值）來建立聚合列模型 (aggregated row model)。

以下是所有聚合函式的型別簽章 (type signature)：

```tsx
export type AggregationFn<TData extends AnyData> = (
  getLeafRows: () => Row<TData>[],
  getChildRows: () => Row<TData>[]
) => any
```

#### 使用聚合函式 (Using Aggregation Functions)

聚合函式可以透過以下方式傳遞給 `columnDefinition.aggregationFn` 來使用/參考/定義：

- 參考內建聚合函式的 `字串 (string)`
- 參考透過 `tableOptions.aggregationFns` 選項提供的自訂聚合函式的 `字串 (string)`
- 直接提供給 `columnDefinition.aggregationFn` 選項的函式

最終可用於 `columnDef.aggregationFn` 的聚合函式清單使用以下型別：

```tsx
export type AggregationFnOption<TData extends AnyData> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>
```

## 列定義選項 (Column Def Options)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFn | keyof AggregationFns | keyof BuiltInAggregationFns
```

用於此欄位的聚合函式。

選項：

- 參考[內建聚合函式](#聚合函式-aggregation-functions)的 `字串 (string)`
- [自訂聚合函式](#聚合函式-aggregation-functions)

### `aggregatedCell`

```tsx
aggregatedCell?: Renderable<
  {
    table: Table<TData>
    row: Row<TData>
    column: Column<TData>
    cell: Cell<TData>
    getValue: () => any
    renderValue: () => any
  }
>
```

如果儲存格 (cell) 是聚合值，則顯示每個列的儲存格內容。如果傳入函式，將會傳遞一個包含儲存格上下文 (context) 的 props 物件，並應回傳適用於你的轉接器 (adapter) 的屬性型別（確切型別取決於所使用的轉接器）。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

啟用/停用此欄位的群組功能。

### `getGroupingValue`

```tsx
getGroupingValue?: (row: TData) => any
```

指定用於在此欄位上群組列的值。如果未指定此選項，則會使用從 `accessorKey` / `accessorFn` 衍生的值。

## 欄位 API (Column API)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFnOption<TData>
```

此欄位解析後的聚合函式。

### `getCanGroup`

```tsx
getCanGroup: () => boolean
```

回傳此欄位是否可以進行群組。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

回傳此欄位是否已進行群組。

### `getGroupedIndex`

```tsx
getGroupedIndex: () => number
```

回傳此欄位在群組狀態 (Grouping State) 中的索引。

### `toggleGrouping`

```tsx
toggleGrouping: () => void
```

切換此欄位的群組狀態。

### `getToggleGroupingHandler`

```tsx
getToggleGroupingHandler: () => () => void
```

回傳一個用於切換此欄位群組狀態的函式。這對於傳遞給按鈕的 `onClick` 屬性非常有用。

### `getAutoAggregationFn`

```tsx
getAutoAggregationFn: () => AggregationFn<TData> | undefined
```

回傳此欄位自動推斷的聚合函式。

### `getAggregationFn`

```tsx
getAggregationFn: () => AggregationFn<TData> | undefined
```

回傳此欄位的聚合函式。

## 列 API (Row API)

### `groupingColumnId`

```tsx
groupingColumnId?: string
```

如果此列已群組，則為此列群組依據的欄位 ID。

### `groupingValue`

```tsx
groupingValue?: any
```

如果此列已群組，則為此群組中所有列在 `groupingColumnId` 欄位上的唯一/共享值。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

回傳此列是否已進行群組。

### `getGroupingValue`

```tsx
getGroupingValue: (columnId: string) => unknown
```

回傳任何列和欄位的群組值（包括葉節點列 (leaf rows)）。

## 表格選項 (Table Options)

### `aggregationFns`

```tsx
aggregationFns?: Record<string, AggregationFn>
```

此選項允許你定義自訂聚合函式，並可透過其鍵值 (key) 在欄位的 `aggregationFn` 選項中參考。
範例：

```tsx
declare module '@tanstack/table-core' {
  interface AggregationFns {
    myCustomAggregation: AggregationFn<unknown>
  }
}

const column = columnHelper.data('key', {
  aggregationFn: 'myCustomAggregation',
})

const table = useReactTable({
  columns: [column],
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 回傳聚合值
    },
  },
})
```

### `manualGrouping`

```tsx
manualGrouping?: boolean
```

啟用手動群組。如果此選項設為 `true`，表格將不會自動使用 `getGroupedRowModel()` 進行列群組，而是期望你在傳遞列給表格前手動進行群組。這對於進行伺服器端群組和聚合非常有用。

### `onGroupingChange`

```tsx
onGroupingChange?: OnChangeFn<GroupingState>
```

如果提供此函式，當群組狀態變更時將會呼叫它，並且你將需要自行管理狀態。你可以透過 `tableOptions.state.grouping` 選項將管理後的狀態傳回表格。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

啟用/停用所有欄位的群組功能。

### `getGroupedRowModel`

```tsx
getGroupedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

回傳在群組完成後但未進一步處理的列模型 (row model)。

### `groupedColumnMode`

```tsx
groupedColumnMode?: false | 'reorder' | 'remove' // 預設：`reorder`
```

群組欄位預設會自動重新排序至欄位列表的開頭。如果你希望移除它們或保持原樣，請在此設定適當的模式。

## 表格 API (Table API)

### `setGrouping`

```tsx
setGrouping: (updater: Updater<GroupingState>) => void
```

設定或更新 `state.grouping` 狀態。

### `resetGrouping`

```tsx
resetGrouping: (defaultState?: boolean) => void
```

將**群組**狀態重設為 `initialState.grouping`，或傳入 `true` 強制重設為預設空白狀態 `[]`。

### `getPreGroupedRowModel`

```tsx
getPreGroupedRowModel: () => RowModel<TData>
```

回傳在套用任何群組前的表格列模型。

### `getGroupedRowModel`

```tsx
getGroupedRowModel: () => RowModel<TData>
```

回傳在套用群組後的表格列模型。

## 儲存格 API (Cell API)

### `getIsAggregated`

```tsx
getIsAggregated: () => boolean
```

回傳此儲存格是否為聚合值。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

回傳此儲存格是否已進行群組。

### `getIsPlaceholder`

```tsx
getIsPlaceholder: () => boolean
```

回傳此儲存格是否為佔位符 (placeholder)。
