---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:06.316Z'
title: 分組
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [群組化](../framework/react/examples/grouping)

## API

[群組化 API](../api/features/grouping)

## 群組化指南

有三種表格功能可以重新排序欄位，它們的執行順序如下：

1. [欄位釘選 (Column Pinning)](../guide/column-pinning) - 若啟用釘選功能，欄位會被分割為左側、中間（未釘選）和右側釘選欄位。
2. 手動 [欄位排序 (Column Ordering)](../guide/column-ordering) - 套用手動指定的欄位順序。
3. **群組化** - 若啟用群組化功能、群組化狀態為啟用，且 `tableOptions.groupedColumnMode` 設為 `'reorder' | 'remove'`，則已群組化的欄位會被重新排序至欄位流的最前面。

TanStack Table 的群組化功能是針對欄位的特性，可讓您根據特定欄位對表格列進行分類與組織。當您有大量資料並希望根據特定條件將它們分組時，這項功能會非常實用。

要使用群組化功能，您需要使用群組化列模型 (grouped row model)。此模型負責根據群組化狀態來分組列。

```tsx
import { getGroupedRowModel } from '@tanstack/react-table'

const table = useReactTable({
  // 其他選項...
  getGroupedRowModel: getGroupedRowModel(),
})
```

當群組化狀態為啟用時，表格會將符合條件的列作為子列 (subRows) 加入群組化列中。群組化列會被加入表格列的相同索引位置（與第一個符合條件的列相同）。符合條件的列會從表格列中移除。
若要允許使用者展開與摺疊群組化列，您可以使用展開功能。

```tsx
import { getGroupedRowModel, getExpandedRowModel} from '@tanstack/react-table'

const table = useReactTable({
  // 其他選項...
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

### 群組化狀態

群組化狀態是一個字串陣列，每個字串代表要分組的欄位 ID。陣列中字串的順序決定了群組化的順序。例如，若群組化狀態為 ['column1', 'column2']，則表格會先根據 column1 分組，然後在每個群組內再根據 column2 分組。您可以使用 setGrouping 函式來控制群組化狀態：

```tsx
table.setGrouping(['column1', 'column2']);
```

您也可以使用 resetGrouping 函式將群組化狀態重設為初始狀態：

```tsx
table.resetGrouping();
```

預設情況下，當欄位被群組化時，它會被移至表格的最前面。您可以使用 groupedColumnMode 選項來控制此行為。若設為 'reorder'，則群組化欄位會被移至表格最前面。若設為 'remove'，則群組化欄位會從表格中移除。若設為 false，則群組化欄位不會被移動或移除。

```tsx
const table = useReactTable({
  // 其他選項...
  groupedColumnMode: 'reorder',
})
```

### 聚合

當列被群組化時，您可以使用 aggregationFn 選項來聚合群組化列中的欄位資料。這是一個字串，代表聚合函式的 ID。您可以使用 aggregationFns 選項來定義聚合函式。

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

在上述範例中，sum 聚合函式會被用來聚合群組化列中的資料。
預設情況下，數值欄位會使用 sum 聚合函式，非數值欄位會使用 count 聚合函式。您可以透過在欄位定義中指定 aggregationFn 選項來覆寫此行為。

以下是幾種內建的聚合函式：

- sum - 計算群組化列中值的總和。
- count - 計算群組化列中的列數。
- min - 找出群組化列中的最小值。
- max - 找出群組化列中的最大值。
- extent - 找出群組化列中值的範圍（最小值和最大值）。
- mean - 計算群組化列中值的平均值。
- median - 找出群組化列中值的中位數。
- unique - 回傳群組化列中的唯一值陣列。
- uniqueCount - 計算群組化列中唯一值的數量。

#### 自訂聚合

當列被群組化時，您可以使用 aggregationFns 選項來聚合群組化列中的資料。這是一個記錄，其中鍵是聚合函式的 ID，值是聚合函式本身。接著您可以在欄位的 aggregationFn 選項中引用這些聚合函式。

```tsx
const table = useReactTable({
  // 其他選項...
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 回傳聚合後的值
    },
  },
})
```

在上述範例中，myCustomAggregation 是一個自訂聚合函式，它接收欄位 ID、葉列 (leaf rows) 和子列 (child rows)，並回傳聚合後的值。接著您可以在欄位的 aggregationFn 選項中使用此聚合函式：

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

### 手動群組化

若您正在進行伺服器端群組化與聚合，可以透過 manualGrouping 選項啟用手動群組化。當此選項設為 true 時，表格不會自動使用 getGroupedRowModel() 來群組列，而是會預期您在將列傳遞給表格前手動進行群組化。

```tsx
const table = useReactTable({
  // 其他選項...
  manualGrouping: true,
})
```

> **注意：** 目前 TanStack Table 並沒有太多已知的簡單方法來實作伺服器端群組化。您需要進行大量的自訂儲存格渲染才能使其運作。

### 群組化變更處理器

若您想自行管理群組化狀態，可以使用 onGroupingChange 選項。此選項是一個函式，會在群組化狀態變更時被呼叫。您可以透過 tableOptions.state.grouping 選項將受控狀態傳回表格。

```tsx
const [grouping, setGrouping] = useState<string[]>([])

const table = useReactTable({
  // 其他選項...
  state: {
    grouping: grouping,
  },
  onGroupingChange: setGrouping
})
```
