---
source-updated-at: '2024-04-24T03:41:47.000Z'
translation-updated-at: '2025-05-08T23:40:28.433Z'
title: 行模型
---
## 行模型 (Row Models) 指南

如果你查看 TanStack Table 最基本的範例，你會看到像這樣的程式碼片段：

```ts
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

function Component() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), //row model
  })
}
```

這個 `getCoreRowModel` 函式是什麼？為什麼你需要從 TanStack Table 導入它，然後又直接傳回給它自己？

答案是 TanStack Table 是一個模組化的函式庫。並非所有功能的程式碼都會預設包含在 createTable 函式/鉤子 (hooks) 中。你只需要導入並包含那些根據你想使用的功能來正確生成行 (rows) 所需的程式碼。

### 什麼是行模型 (Row Models)？

行模型在 TanStack Table 的底層運行，以有用的方式轉換你的原始數據，這些轉換對於數據網格 (data grid) 功能（如篩選、排序、分組、展開和分頁）是必需的。最終生成並渲染在螢幕上的行，不一定會與你傳遞給表格的原始數據形成 1:1 的映射關係。它們可能經過排序、篩選、分頁等處理。

### 導入行模型

你應該只導入你需要的行模型。以下是所有可用的行模型：

```ts
//只導入你需要的行模型
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
}
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  getFacetedMinMaxValues: getFacetedMinMaxValues(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
  getFilteredRowModel: getFilteredRowModel(),
  getGroupedRowModel: getGroupedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
})
```

### 自訂/分叉行模型

你不一定要使用 TanStack Table 提供的確切行模型。如果你需要對某些行模型進行進階自訂，可以自由複製你想要自訂的行模型的[原始碼](https://github.com/TanStack/table/tree/main/packages/table-core/src/utils)，並根據你的需求進行修改。

### 使用行模型

一旦你的表格實例 (table instance) 被創建，你可以直接從表格實例中存取所有你可能需要的行模型。除了你可能導入的行模型之外，還有更多衍生的行模型可供使用。

對於一般的渲染使用情境，你可能只需要使用 `table.getRowModel()` 方法，因為這個行模型會根據你啟用或停用的功能，使用所有/任何其他行模型。所有其他行模型都可以讓你「深入挖掘」表格中正在發生的底層數據轉換。

### 表格實例上可用的行模型

- **`getRowModel`** - 這是你應該用於渲染表格行標記 (markup) 的主要行模型。它會使用所有其他行模型來生成最終的行模型，你將使用它來渲染表格行。

- `getCoreRowModel` - 返回一個基本的行模型，它只是與傳遞給表格的原始數據形成 1:1 的映射關係。

- `getFilteredRowModel` - 返回一個考慮了欄位篩選和全域篩選的行模型。
- `getPreFilteredRowModel` - 返回一個在應用欄位篩選和全域篩選之前的行模型。

- `getGroupedRowModel` - 返回一個對數據應用分組和聚合並創建子行的行模型。
- `getPreGroupedRowModel` - 返回一個在應用分組和聚合之前的行模型。

- `getSortedRowModel` - 返回一個已應用排序的行模型。
- `getPreSortedRowModel` - 返回一個在應用排序之前的行模型（行保持原始順序）。

- `getExpandedRowModel` - 返回一個考慮了展開/隱藏子行的行模型。
- `getPreExpandedRowModel` - 返回一個僅包含根層級行且不包含展開子行的行模型。仍然包含排序。

- `getPaginationRowModel` - 返回一個僅包含基於分頁狀態應該顯示在當前頁面上的行的行模型。
- `getPrePaginationRowModel` - 返回一個未應用分頁的行模型（包含所有行）。

- `getSelectedRowModel` - 返回所有選中行的行模型（但僅基於傳遞給表格的數據）。在 getCoreRowModel 之後運行。
- `getPreSelectedRowModel` - 返回一個在應用行選擇之前的行模型（僅返回 getCoreRowModel）。
- `getGroupedSelectedRowModel` - 返回分組後選中行的行模型。在 getSortedRowModel 之後運行，而 getSortedRowModel 在 getGroupedRowModel 之後運行，getGroupedRowModel 又在 getFilteredRowModel 之後運行。
- `getFilteredSelectedRowModel` - 返回在應用欄位篩選和全域篩選後選中行的行模型。在 getFilteredRowModel 之後運行。

### 行模型執行的順序

了解 TanStack Table 如何在內部處理行，可以幫助你更好地理解底層發生的情況，並幫助你調試可能遇到的問題。

在內部，如果相應的功能被啟用，行模型會按照以下順序應用於數據：

`getCoreRowModel` -> `getFilteredRowModel` -> `getGroupedRowModel` -> `getSortedRowModel` -> `getExpandedRowModel` -> `getPaginationRowModel` -> `getRowModel`

如果在任何情況下，相應的功能被停用或通過 `"manual*"` 表格選項關閉，則在該處理步驟中會改用 `getPre*RowModel`。

如上所示，數據首先被篩選，然後分組，接著排序，然後展開，最後進行分頁作為最終步驟。

### 行模型的數據結構

每個行模型都會以 3 種不同的有用格式提供行：

1. `rows` - 行的陣列。
2. `flatRows` - 行的陣列，但所有子行都被扁平化到頂層。
3. `rowsById` - 行的物件，其中每個行都以其 `id` 作為鍵。這對於通過 `id` 快速查找行並獲得更好的性能非常有用。

```ts
console.log(table.getRowModel().rows) // 行的陣列
console.log(table.getRowModel().flatRows) // 行的陣列，但所有子行都被扁平化到頂層
console.log(table.getRowModel().rowsById['row-id']) // 行的物件，其中每個行都以其 `id` 作為鍵
```
