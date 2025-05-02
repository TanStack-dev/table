---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:20:58.976Z'
title: 分组
---
## 示例

想直接查看实现代码？请参考以下示例：

- [分组](../framework/react/examples/grouping)

## API

[分组 API](../api/features/grouping)

## 分组指南

表格中有 3 种可以重新排序列的功能，它们的执行顺序如下：

1. [列固定 (Column Pinning)](../guide/column-pinning) - 如果启用了固定列，列会被分为左侧、中间（未固定）和右侧固定列。
2. 手动[列排序 (Column Ordering)](../guide/column-ordering) - 应用手动指定的列顺序。
3. **分组 (Grouping)** - 如果启用了分组功能、存在分组状态且 `tableOptions.groupedColumnMode` 设置为 `'reorder' | 'remove'`，则分组列会被重新排序到列流的最前面。

TanStack Table 中的分组功能应用于列，允许你根据特定列对表格行进行分类和组织。这在处理大量数据并希望根据特定条件进行分组时非常有用。

要使用分组功能，你需要使用分组行模型 (grouped row model)。该模型负责根据分组状态对行进行分组。

```tsx
import { getGroupedRowModel } from '@tanstack/react-table'

const table = useReactTable({
  // 其他选项...
  getGroupedRowModel: getGroupedRowModel(),
})
```

当分组状态激活时，表格会将匹配的行作为子行 (subRows) 添加到分组行中。分组行会被添加到表格行中，其索引与第一个匹配行相同。匹配的行会从表格行中移除。
要允许用户展开和折叠分组行，可以使用展开功能 (expanding feature)。

```tsx
import { getGroupedRowModel, getExpandedRowModel} from '@tanstack/react-table'

const table = useReactTable({
  // 其他选项...
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

### 分组状态

分组状态是一个字符串数组，每个字符串是要分组的列的 ID。数组中的字符串顺序决定了分组的顺序。例如，如果分组状态是 ['column1', 'column2']，表格会先按 column1 分组，然后在每个组内再按 column2 分组。你可以使用 setGrouping 函数控制分组状态：

```tsx
table.setGrouping(['column1', 'column2']);
```

你也可以使用 resetGrouping 函数将分组状态重置为初始状态：

```tsx
table.resetGrouping();
```

默认情况下，当列被分组时，它会被移动到表格的最前面。你可以使用 groupedColumnMode 选项控制这一行为。如果设置为 'reorder'，分组列会被移动到表格的最前面。如果设置为 'remove'，分组列会从表格中移除。如果设置为 false，分组列不会被移动或移除。

```tsx
const table = useReactTable({
  // 其他选项...
  groupedColumnMode: 'reorder',
})
```

### 聚合

当行被分组时，你可以使用 aggregationFn 选项按列聚合分组行中的数据。这是一个字符串，表示聚合函数的 ID。你可以使用 aggregationFns 选项定义聚合函数。

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

在上面的例子中，sum 聚合函数会被用于聚合分组行中的数据。
默认情况下，数值列会使用 sum 聚合函数，非数值列会使用 count 聚合函数。你可以通过在列定义中指定 aggregationFn 选项来覆盖这一行为。

以下是几种内置的聚合函数：

- sum - 对分组行中的值求和。
- count - 计算分组行中的行数。
- min - 找出分组行中的最小值。
- max - 找出分组行中的最大值。
- extent - 找出分组行中值的范围（最小值和最大值）。
- mean - 计算分组行中值的平均值。
- median - 找出分组行中值的中位数。
- unique - 返回分组行中唯一值的数组。
- uniqueCount - 计算分组行中唯一值的数量。

#### 自定义聚合

当行被分组时，你可以使用 aggregationFns 选项聚合分组行中的数据。这是一个记录，其中键是聚合函数的 ID，值是聚合函数本身。然后你可以在列的 aggregationFn 选项中引用这些聚合函数。

```tsx
const table = useReactTable({
  // 其他选项...
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 返回聚合后的值
    },
  },
})
```

在上面的例子中，myCustomAggregation 是一个自定义聚合函数，它接收列 ID、叶子行 (leafRows) 和子行 (childRows)，并返回聚合后的值。然后你可以在列的 aggregationFn 选项中使用这个聚合函数：

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

### 手动分组

如果你正在进行服务端分组 (server-side grouping) 和聚合，可以使用 manualGrouping 选项启用手动分组。当此选项设置为 true 时，表格不会自动使用 getGroupedRowModel() 分组行，而是期望你在将行传递给表格之前手动分组。

```tsx
const table = useReactTable({
  // 其他选项...
  manualGrouping: true,
})
```

> **注意：** 目前 TanStack Table 没有很多已知的简单方法来实现服务端分组。你需要进行大量自定义单元格渲染才能实现这一功能。

### 分组变更处理程序

如果你想自己管理分组状态，可以使用 onGroupingChange 选项。此选项是一个函数，当分组状态发生变化时会被调用。你可以通过 tableOptions.state.grouping 选项将托管状态传递回表格。

```tsx
const [grouping, setGrouping] = useState<string[]>([])

const table = useReactTable({
  // 其他选项...
  state: {
    grouping: grouping,
  },
  onGroupingChange: setGrouping
})
```
