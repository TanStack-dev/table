---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:54.595Z'
title: 欄位面向
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [filters-faceted](../framework/react/examples/filters-faceted)

## API

[欄位切面 API](../api/features/column-faceting)

## 欄位切面指南

欄位切面 (Column Faceting) 是一項功能，允許您從欄位資料中為指定欄位生成值列表。例如，可以從欄位所有列中生成唯一值列表，用作自動完成篩選元件的搜尋建議；或是從數字欄位中生成最小值和最大值的元組，用作範圍滑桿篩選元件的範圍設定。

### 欄位切面行模型

若要使用任何欄位切面功能，您必須在表格選項中包含適當的行模型。

```ts
//只需導入您需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //依賴 getFacetedRowModel
  getFacetedUniqueValues, //依賴 getFacetedRowModel
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //如果需要為欄位生成值列表（其他切面行模型依賴此模型）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //如果需要最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), //如果需要唯一值列表
  //...
})
```

首先，您必須包含 `getFacetedRowModel` 行模型。此模型會為指定欄位生成值列表。如果需要唯一值列表，請包含 `getFacetedUniqueValues` 行模型；如果需要最小值和最大值的元組，請包含 `getFacetedMinMaxValues` 行模型。

### 使用切面行模型

在表格選項中包含適當的行模型後，您就能使用切面欄位實例 API 來存取由切面行模型生成的值列表。

```ts
// 用於自動完成篩選的唯一值列表
const autoCompleteSuggestions = 
 Array.from(column.getFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用於範圍篩選的最小最大值元組
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1];
```

### 自訂（伺服器端）切面

如果不使用內建的客戶端切面功能，您可以在伺服器端實作自己的切面邏輯，並將切面值傳遞至客戶端。您可以使用 `getFacetedUniqueValues` 和 `getFacetedMinMaxValues` 表格選項來解析來自伺服器端的切面值。

```ts
const facetingQuery = useQuery(
  //...
)

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: (table, columnId) => {
    const uniqueValueMap = new Map<string, number>();
    //...
    return uniqueValueMap;
  },
  getFacetedMinMaxValues: (table, columnId) => {
    //...
    return [min, max];
  },
  //...
})
```

或者，您也可以完全不透過 TanStack Table API 來處理任何切面邏輯。只需直接獲取您的列表並將其傳遞給篩選元件即可。
