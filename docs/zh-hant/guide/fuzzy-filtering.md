---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:09.670Z'
title: 模糊過濾
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [filters-fuzzy](../framework/react/examples/filters-fuzzy)

## API

[篩選器 API](../api/features/filters)

## 模糊篩選指南

模糊篩選 (Fuzzy Filtering) 是一種基於近似匹配來過濾資料的技術。當您需要搜尋與給定值相似而非完全匹配的資料時，這項技術特別有用。

您可以透過定義自訂篩選函式來實作客戶端模糊篩選。此函式應接收 row、columnId 和 filter value 作為參數，並回傳一個布林值來決定該列是否應包含在篩選結果中。

模糊篩選最常與全域篩選 (global filtering) 搭配使用，但也能應用於個別欄位。我們將討論如何在這兩種情況下實作模糊篩選。

> **注意：** 使用模糊篩選需先安裝 `@tanstack/match-sorter-utils` 函式庫。
> TanStack Match Sorter Utils 是 [match-sorter](https://github.com/kentcdodds/match-sorter) 的分支版本，由 Kent C. Dodds 開發。此分支版本是為了更好地配合 TanStack Table 的逐列篩選 (row by row filtering) 方式。

使用 match-sorter 函式庫是可選的，但 TanStack Match Sorter Utils 函式庫提供了絕佳的方式來進行模糊篩選，並根據回傳的排序資訊 (rank information) 進行排序，讓資料列能依照與搜尋條件的匹配程度排序。

### 定義自訂模糊篩選函式

以下是自訂模糊篩選函式的範例：

```typescript
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // 對項目進行評分
  const itemRank = rankItem(row.getValue(columnId), value)

  // 儲存 itemRank 資訊
  addMeta({ itemRank })

  // 回傳該項目是否應被保留在篩選結果中
  return itemRank.passed
}
```

在此函式中，我們使用 @tanstack/match-sorter-utils 函式庫的 rankItem 函式來評分項目。接著將評分資訊儲存在該列的 meta 資料中，並回傳該項目是否符合評分標準。

### 搭配全域篩選使用模糊篩選

要搭配全域篩選使用模糊篩選，您可以在表格實例的 globalFilterFn 選項中指定模糊篩選函式：

```typescript
const table = useReactTable({ // 或您使用框架的等效函式
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter, //定義為可在欄位定義中使用的篩選函式
    },
    globalFilterFn: 'fuzzy', //將模糊篩選應用於全域篩選（模糊篩選最常見的使用情境）
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //客戶端篩選
    getSortedRowModel: getSortedRowModel(), //如需排序功能也需啟用客戶端排序
})
```

### 搭配欄位篩選使用模糊篩選

要搭配欄位篩選使用模糊篩選，您應先在表格實例的 filterFns 選項中定義模糊篩選函式。接著在欄位定義的 filterFn 選項中指定該函式：

```typescript
const column = [
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //使用我們的自訂模糊篩選函式
  },
  // 其他欄位...
];
```

在此範例中，我們將模糊篩選應用於組合了資料中 firstName 和 lastName 欄位的全名欄位。

#### 搭配模糊篩選進行排序

當搭配欄位篩選使用模糊篩選時，您可能還想根據評分資訊排序資料。您可以透過定義自訂排序函式來實現：

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortingFns } from '@tanstack/table'

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // 僅在欄位有評分資訊時才進行排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // 當項目評分相同時，改用字母數字排序作為備援方案
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

在此函式中，我們比較兩列資料的評分資訊。若評分相同，則改用字母數字排序 (alphanumeric sorting)。

接著您可以在欄位定義的 sortFn 選項中指定此排序函式：

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', //使用我們的自訂模糊篩選函式
  sortFn: 'fuzzySort', //使用我們的自訂模糊排序函式
}
```
