---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-02T17:40:52.107Z'
title: 分组
id: grouping
---
## 分组状态 (Grouping State)

分组状态 (grouping state) 以如下形式存储在表格中：

```tsx
export type GroupingState = string[]

export type GroupingTableState = {
  grouping: GroupingState
}
```

## 聚合函数 (Aggregation Functions)

表格核心内置了以下聚合函数 (aggregation functions)：

- `sum`
  - 对一组行的值进行求和
- `min`
  - 找出一组行的最小值
- `max`
  - 找出一组行的最大值
- `extent`
  - 找出一组行的最小值和最大值
- `mean`
  - 计算一组行的平均值
- `median`
  - 找出一组行的中位数
- `unique`
  - 找出一组行的唯一值
- `uniqueCount`
  - 计算一组行中唯一值的数量
- `count`
  - 计算一组行的数量

每个聚合函数都会接收：

- 一个用于获取分组行叶子值 (leaf values) 的函数
- 一个用于获取分组行直接子值 (immediate-child values) 的函数

并应返回一个值（通常是原始值）来构建聚合行模型 (aggregated row model)。

以下是所有聚合函数的类型签名：

```tsx
export type AggregationFn<TData extends AnyData> = (
  getLeafRows: () => Row<TData>[],
  getChildRows: () => Row<TData>[]
) => any
```

#### 使用聚合函数 (Using Aggregation Functions)

可以通过以下方式使用/引用/定义聚合函数，并将其传递给 `columnDefinition.aggregationFn`：

- 引用内置聚合函数的 `string`
- 引用通过 `tableOptions.aggregationFns` 选项提供的自定义聚合函数的 `string`
- 直接提供给 `columnDefinition.aggregationFn` 选项的函数

`columnDef.aggregationFn` 可用的最终聚合函数列表使用以下类型：

```tsx
export type AggregationFnOption<TData extends AnyData> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>
```

## 列定义选项 (Column Def Options)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFn | keyof AggregationFns | keyof BuiltInAggregationFns
```

用于此列的聚合函数。

选项：

- 引用[内置聚合函数](#聚合函数-aggregation-functions)的 `string`
- [自定义聚合函数](#聚合函数-aggregation-functions)

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

如果单元格是聚合单元格，则为该列每行显示的单元格。如果传入函数，则会传入包含单元格上下文的 props 对象，并应返回适配器所需的属性类型（具体类型取决于使用的适配器）。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

启用/禁用此列的分组功能。

### `getGroupingValue`

```tsx
getGroupingValue?: (row: TData) => any
```

指定用于在此列上分组行的值。如果未指定此选项，则将使用从 `accessorKey` / `accessorFn` 派生的值。

## 列 API (Column API)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFnOption<TData>
```

列解析后的聚合函数。

### `getCanGroup`

```tsx
getCanGroup: () => boolean
```

返回列是否可以分组。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回列当前是否已分组。

### `getGroupedIndex`

```tsx
getGroupedIndex: () => number
```

返回列在分组状态 (grouping state) 中的索引。

### `toggleGrouping`

```tsx
toggleGrouping: () => void
```

切换列的分组状态。

### `getToggleGroupingHandler`

```tsx
getToggleGroupingHandler: () => () => void
```

返回一个切换列分组状态的函数。这对于传递给按钮的 `onClick` 属性非常有用。

### `getAutoAggregationFn`

```tsx
getAutoAggregationFn: () => AggregationFn<TData> | undefined
```

返回列自动推断的聚合函数。

### `getAggregationFn`

```tsx
getAggregationFn: () => AggregationFn<TData> | undefined
```

返回列的聚合函数。

## 行 API (Row API)

### `groupingColumnId`

```tsx
groupingColumnId?: string
```

如果此行已分组，则为该行分组依据的列 ID。

### `groupingValue`

```tsx
groupingValue?: any
```

如果此行已分组，则为该组所有行在 `groupingColumnId` 上的唯一/共享值。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回行当前是否已分组。

### `getGroupingValue`

```tsx
getGroupingValue: (columnId: string) => unknown
```

返回任何行和列（包括叶子行）的分组值。

## 表格选项 (Table Options)

### `aggregationFns`

```tsx
aggregationFns?: Record<string, AggregationFn>
```

此选项允许您定义自定义聚合函数，可以通过键在列的 `aggregationFn` 选项中引用。
示例：

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
      // 返回聚合值
    },
  },
})
```

### `manualGrouping`

```tsx
manualGrouping?: boolean
```

启用手动分组。如果此选项设置为 `true`，表格将不会自动使用 `getGroupedRowModel()` 分组行，而是期望您在将行传递给表格之前手动分组。这对于进行服务端分组和聚合非常有用。

### `onGroupingChange`

```tsx
onGroupingChange?: OnChangeFn<GroupingState>
```

如果提供了此函数，当分组状态发生变化时会调用它，您需要自行管理状态。您可以通过 `tableOptions.state.grouping` 选项将托管状态传递回表格。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

启用/禁用所有列的分组功能。

### `getGroupedRowModel`

```tsx
getGroupedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

返回分组完成后的行模型，但不进行进一步处理。

### `groupedColumnMode`

```tsx
groupedColumnMode?: false | 'reorder' | 'remove' // 默认: `reorder`
```

分组列默认会自动重新排序到列列表的开头。如果您希望删除它们或保持原样，请在此处设置适当的模式。

## 表格 API (Table API)

### `setGrouping`

```tsx
setGrouping: (updater: Updater<GroupingState>) => void
```

设置或更新 `state.grouping` 状态。

### `resetGrouping`

```tsx
resetGrouping: (defaultState?: boolean) => void
```

将**分组**状态重置为 `initialState.grouping`，或者可以传递 `true` 强制重置为默认空白状态 `[]`。

### `getPreGroupedRowModel`

```tsx
getPreGroupedRowModel: () => RowModel<TData>
```

返回应用任何分组之前的表格行模型。

### `getGroupedRowModel`

```tsx
getGroupedRowModel: () => RowModel<TData>
```

返回应用分组后的表格行模型。

## 单元格 API (Cell API)

### `getIsAggregated`

```tsx
getIsAggregated: () => boolean
```

返回单元格当前是否为聚合单元格。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

返回单元格当前是否为分组单元格。

### `getIsPlaceholder`

```tsx
getIsPlaceholder: () => boolean
```

返回单元格当前是否为占位符单元格。
