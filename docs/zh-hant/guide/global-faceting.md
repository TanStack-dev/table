---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:40:43.880Z'
title: 全域面向
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [filters-faceted](../framework/react/examples/filters)

## API

[全域分面 API](../api/features/global-faceting)

## 全域分面指南 (Global Faceting)

全域分面功能可讓您從表格資料中為所有欄位生成值列表。例如，可以從所有欄位的所有列中生成唯一值列表，作為自動完成篩選元件的搜尋建議。或者，可以從數字表格中生成最小值和最大值的元組，作為範圍滑桿篩選元件的範圍。

### 全域分面行模型 (Global Faceting Row Models)

若要使用任何全域分面功能，您必須在表格選項中包含適當的行模型。

```ts
//僅導入您需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //依賴於 getFacetedRowModel
  getFacetedUniqueValues, //依賴於 getFacetedRowModel
} from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他選項...
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //用於客戶端分面的分面模型 (其他分面方法依賴此模型)
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //如果您需要最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), //如果您需要唯一值列表
  //...
})
```

### 使用全域分面行模型

在表格選項中包含適當的行模型後，您將能夠使用分面表格實例 API 來存取由分面行模型生成的值列表。

```ts
// 用於自動完成篩選的唯一值列表
const autoCompleteSuggestions =
 Array.from(table.getGlobalFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用於範圍篩選的最小和最大值元組
const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1];
```

### 自訂全域 (伺服器端) 分面

如果不使用內建的客戶端分面功能，您可以在伺服器端實作自己的分面邏輯，並將分面值傳遞到客戶端。您可以使用 getGlobalFacetedUniqueValues 和 getGlobalFacetedMinMaxValues 表格選項來解析來自伺服器端的分面值。

```ts
const facetingQuery = useQuery(
  'faceting',
  async () => {
    const response = await fetch('/api/faceting');
    return response.json();
  },
  {
    onSuccess: (data) => {
      table.getGlobalFacetedUniqueValues = () => data.uniqueValues;
      table.getGlobalFacetedMinMaxValues = () => data.minMaxValues;
    },
  }
);
```

在此範例中，我們使用來自 `react-query` 的 `useQuery` 鉤子 (hook) 從伺服器獲取分面資料。獲取資料後，我們設定 `getGlobalFacetedUniqueValues` 和 `getGlobalFacetedMinMaxValues` 表格選項以返回伺服器回應中的分面值。這將允許表格使用伺服器端分面資料來生成自動完成建議和範圍篩選器。
