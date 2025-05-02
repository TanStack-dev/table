---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:19:13.276Z'
title: 模糊过滤
---
## 示例

想直接查看实现代码？请参考以下示例：

- [模糊过滤器](../framework/react/examples/filters-fuzzy)

## API

[过滤器 API](../api/features/filters)

## 模糊过滤指南

模糊过滤是一种基于近似匹配筛选数据的技术。当您需要搜索与给定值相似而非完全匹配的数据时，这项技术尤为实用。

您可以通过定义自定义过滤器函数来实现客户端模糊过滤。该函数接收行数据、列ID和过滤值作为参数，并返回布尔值以指示该行是否应包含在筛选结果中。

模糊过滤通常用于全局过滤，但也可应用于单个列。我们将讨论如何在这两种场景下实现模糊过滤。

> **注意：** 使用模糊过滤功能需要安装 `@tanstack/match-sorter-utils` 库。
> TanStack Match Sorter Utils 是 Kent C. Dodds 开发的 [match-sorter](https://github.com/kentcdodds/match-sorter) 的分支版本。该分支旨在更好地适配 TanStack Table 的逐行过滤机制。

虽然 match-sorter 系列库是可选的，但 TanStack Match Sorter Utils 库提供了出色的模糊过滤功能，并能根据返回的排名信息进行排序，从而实现按搜索匹配度排序行的功能。

### 定义自定义模糊过滤函数

以下是一个自定义模糊过滤函数示例：

```typescript
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储排名信息
  addMeta({ itemRank })

  // 返回该项目是否应被保留
  return itemRank.passed
}
```

在此函数中，我们使用 @tanstack/match-sorter-utils 库的 rankItem 函数对项目进行排名。随后将排名信息存入行的元数据，并返回该项目是否通过排名标准。

### 全局模糊过滤实现

要在全局过滤中使用模糊过滤，可在表格实例的 globalFilterFn 选项中指定模糊过滤函数：

```typescript
const table = useReactTable({ // 或您所用框架的等效函数
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter, //定义为可在列定义中使用的过滤函数
    },
    globalFilterFn: 'fuzzy', //将模糊过滤器应用于全局过滤（最常见的模糊过滤使用场景）
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //客户端过滤
    getSortedRowModel: getSortedRowModel(), //如需同时使用排序功能则需要客户端排序
})
```

### 列级模糊过滤实现

要在列过滤中使用模糊过滤，首先需要在表格实例的 filterFns 选项中定义模糊过滤函数，然后在列定义的 filterFn 选项中指定该函数：

```typescript
const column = [
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: '全名',
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //使用我们自定义的模糊过滤函数
  },
  // 其他列...
];
```

本示例将模糊过滤应用于组合了 firstName 和 lastName 字段的数据列。

#### 模糊过滤排序

使用列级模糊过滤时，您可能还需要根据排名信息对数据进行排序。可通过定义自定义排序函数实现：

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortingFns } from '@tanstack/table'

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // 仅当列包含排名信息时才进行排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // 当项目排名相同时提供字母数字回退方案
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

此函数会比较两行的排名信息。若排名相同，则回退至字母数字排序。

随后可在列定义的 sortFn 选项中指定此排序函数：

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: '全名',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', //使用自定义模糊过滤函数
  sortFn: 'fuzzySort', //使用自定义模糊排序函数
}
```
