---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:19:41.820Z'
title: 列分面
---
## 示例

想要直接查看实现？请参考以下示例：

- [filters-faceted](../framework/react/examples/filters-faceted)

## API

[列分面 API](../api/features/column-faceting)

## 列分面指南

列分面 (Column Faceting) 是一项功能，允许您从列数据中为该列生成值列表。例如，可以从列的所有行中生成唯一值列表，用作自动完成筛选组件中的搜索建议；或者从数字列中生成最小值和最大值的元组，用作范围滑块筛选组件的范围。

### 列分面行模型

要使用任何列分面功能，必须在表格选项中包含相应的行模型。

```ts
//仅导入需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, //依赖 getFacetedRowModel
  getFacetedUniqueValues, //依赖 getFacetedRowModel
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), //如果需要为列生成值列表（其他分面行模型依赖此模型）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), //如果需要最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), //如果需要唯一值列表
  //...
})
```

首先必须包含 `getFacetedRowModel` 行模型。该模型会为给定列生成值列表。如果需要唯一值列表，则包含 `getFacetedUniqueValues` 行模型；如果需要最小值和最大值的元组，则包含 `getFacetedMinMaxValues` 行模型。

### 使用分面行模型

在表格选项中包含相应的行模型后，即可使用分面列实例 API 访问由分面行模型生成的值列表。

```ts
// 用于自动完成筛选的唯一值列表
const autoCompleteSuggestions = 
 Array.from(column.getFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用于范围筛选的最小最大值元组
const [min, max] = column.getFacetedMinMaxValues() ?? [0, 1];
```

### 自定义（服务端）分面

如果不使用内置的客户端分面功能，可以在服务端实现自己的分面逻辑，并将分面值传递到客户端。可以使用 `getFacetedUniqueValues` 和 `getFacetedMinMaxValues` 表格选项从服务端解析分面值。

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

或者，您也可以完全不通过 TanStack Table API 实现任何分面逻辑，只需直接获取列表并传递给筛选组件即可。
