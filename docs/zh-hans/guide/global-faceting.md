---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:20:09.805Z'
title: 全局分面
---
## 示例

想要直接查看实现方式？请参考以下示例：

- [filters-faceted](../framework/react/examples/filters)

## API

[全局分面 API](../api/features/global-faceting)

## 全局分面指南

全局分面 (Global Faceting) 功能允许您从表格数据中为所有列生成值列表。例如，可以从所有列的所有行中生成唯一值列表，用作自动完成筛选组件中的搜索建议；或者从数字表格中生成最小值和最大值的元组，用作范围滑块筛选组件的区间。

### 全局分面行模型

要使用任何全局分面功能，您必须在表格选项中包含相应的行模型。

```ts
// 仅导入需要的行模型
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues, // 依赖于 getFacetedRowModel
  getFacetedUniqueValues, // 依赖于 getFacetedRowModel
} from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他选项...
  getCoreRowModel: getCoreRowModel(),
  getFacetedRowModel: getFacetedRowModel(), // 客户端分面模型（其他分面方法依赖此模型）
  getFacetedMinMaxValues: getFacetedMinMaxValues(), // 如需最小/最大值
  getFacetedUniqueValues: getFacetedUniqueValues(), // 如需唯一值列表
  //...
})
```

### 使用全局分面行模型

在表格选项中包含相应的行模型后，您就可以使用分面表格实例 API 来访问由分面行模型生成的值列表。

```ts
// 用于自动完成筛选的唯一值列表
const autoCompleteSuggestions =
 Array.from(table.getGlobalFacetedUniqueValues().keys())
  .sort()
  .slice(0, 5000);
```

```ts
// 用于范围筛选的最小最大值元组
const [min, max] = table.getGlobalFacetedMinMaxValues() ?? [0, 1];
```

### 自定义全局（服务端）分面

如果不使用内置的客户端分面功能，您可以在服务端实现自己的分面逻辑，并将分面值传递到客户端。可以使用 getGlobalFacetedUniqueValues 和 getGlobalFacetedMinMaxValues 表格选项从服务端解析分面值。

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

在此示例中，我们使用 `react-query` 的 `useQuery` 钩子从服务端获取分面数据。获取数据后，我们将 `getGlobalFacetedUniqueValues` 和 `getGlobalFacetedMinMaxValues` 表格选项设置为返回服务端响应中的分面值。这将允许表格使用服务端分面数据来生成自动完成建议和范围筛选器。
