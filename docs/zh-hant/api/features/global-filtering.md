---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:56.137Z'
title: 全域過濾
id: global-filtering
---
## 全域過濾 (Global Filtering) API

### 可過濾性 (Can-Filter)

欄位是否能夠進行**全域**過濾取決於以下條件：

- 該欄位已定義有效的 `accessorKey`/`accessorFn`
- 若提供 `options.getColumnCanGlobalFilter`，則需對指定欄位返回 `true`；若未提供，則預設當第一列的值為 `string` 或 `number` 類型時，該欄位可全域過濾
- `column.enableColumnFilter` 未設為 `false`
- `options.enableColumnFilters` 未設為 `false`
- `options.enableFilters` 未設為 `false`

### 狀態 (State)

過濾狀態以以下形式儲存在表格中：

```tsx
export interface GlobalFilterTableState {
  globalFilter: any
}
```

### 過濾函式 (Filter Functions)

全域過濾可使用與欄位過濾相同的過濾函式。詳見[欄位過濾 API](../api/features/column-filtering) 以了解過濾函式的更多資訊。

#### 使用過濾函式

可透過以下方式將過濾函式傳遞給 `options.globalFilterFn` 來使用/引用/定義：

- 引用內建過濾函式的 `string`
- 直接提供給 `options.globalFilterFn` 選項的函式

`tableOptions.globalFilterFn` 選項可用的最終過濾函式列表使用以下類型：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 過濾元數據 (Filter Meta)

過濾數據時常會揭露關於數據的額外資訊，這些資訊可用於後續對同一數據的其他操作。此概念的一個好例子是類似 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 的排名系統，它能同時對數據進行排名、過濾和排序。雖然像 `match-sorter` 這樣的工具在單一維度的過濾+排序任務中非常合理，但表格的分散式過濾/排序架構使得它們難以使用且效率低下。

為了讓排名/過濾/排序系統能與表格協同工作，`filterFn` 可以選擇性地用**過濾元數據**標記結果，這些數據之後可用於按需排序/分組等操作。這是透過在自訂的 `filterFn` 中調用提供的 `addMeta` 函式來實現的。

以下是使用我們自己的 `match-sorter-utils` 套件（`match-sorter` 的一個工具分支）來排名、過濾和排序數據的範例：

```tsx
import { sortingFns } from '@tanstack/[adapter]-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 對項目進行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 儲存排名資訊
  addMeta(itemRank)

  // 返回該項目是否應被過濾保留/排除
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 僅在欄位有排名資訊時進行排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // 當項目排名相同時，提供字母數字後備方案
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

### 欄位定義選項 (Column Def Options)

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

啟用/禁用此欄位的**全域**過濾功能。

### 欄位 API (Column API)

#### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

返回該欄位是否能進行**全域**過濾。設為 `false` 可禁止在全局過濾時掃描該欄位。

### 行 API (Row API)

#### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

該行的欄位過濾元數據映射。此物件追蹤在過濾過程中可選提供的任何過濾元數據。

### 表格選項 (Table Options)

#### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此選項允許您定義自訂過濾函式，這些函式可透過其鍵在欄位的 `filterFn` 選項中引用。
範例：

```tsx
declare module '@tanstack/table-core' {
  interface FilterFns {
    myCustomFilter: FilterFn<unknown>
  }
}

const column = columnHelper.data('key', {
  filterFn: 'myCustomFilter',
})

const table = useReactTable({
  columns: [column],
  filterFns: {
    myCustomFilter: (rows, columnIds, filterValue) => {
      // 返回過濾後的行
    },
  },
})
```

#### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

預設情況下，過濾是從父行向下進行的（因此如果父行被過濾掉，其所有子行也將被過濾掉）。將此選項設為 `true` 將使過濾從葉子行向上進行（這意味著父行將被包含，只要其任一子行或孫行也被包含）。

#### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

預設情況下，過濾會套用至所有行（最大深度為 100），無論它們是根級父行還是父行的子葉行。將此選項設為 `0` 將使過濾僅套用於根級父行，所有子行保持未過濾狀態。同樣，設為 `1` 將使過濾僅套用於一級深度的子葉行，依此類推。

這在您希望某行的整個子層次結構在應用過濾後仍可見的情況下非常有用。

#### `enableFilters`

```tsx
enableFilters?: boolean
```

啟用/禁用表格的所有過濾功能。

#### `manualFiltering`

```tsx
manualFiltering?: boolean
```

禁用 `getFilteredRowModel` 用於過濾數據。這在您的表格需要動態支援客戶端和伺服器端過濾時可能很有用。

#### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

若提供，此函式將**每表格調用一次**，並應返回一個**新函式**，該函式將在表格過濾時計算並返回行模型。

- 對於伺服器端過濾，此函式非必要且可忽略，因為伺服器應已返回過濾後的行模型。
- 對於客戶端過濾，此函式是必需的。任何表格適配器的 `{ getFilteredRowModel }` 匯出都提供了預設實現。

範例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'

  getFilteredRowModel: getFilteredRowModel(),
})
```

#### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

用於全域過濾的過濾函式。

選項：

- 引用[內建過濾函式](#filter-functions)的 `string`
- 引用透過 `tableOptions.filterFns` 選項提供的自訂過濾函式的 `string`
- [自訂過濾函式](#filter-functions)

#### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

若提供，當 `state.globalFilter` 變化時，將使用 `updaterFn` 調用此函式。這將覆蓋預設的內部狀態管理，因此您需要在表格外部完全或部分持久化狀態變更。

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

啟用/禁用表格的全域過濾功能。

#### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TData>) => boolean
```

若提供，將使用欄位調用此函式，並應返回 `true` 或 `false` 以指示該欄位是否應用於全域過濾。
這在欄位可能包含非 `string` 或 `number` 的數據（如 `undefined`）時非常有用。

### 表格 API (Table API)

#### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

返回在套用任何**欄位**過濾前的表格行模型。

#### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

返回在套用**欄位**過濾後的表格行模型。

#### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

設定或更新 `state.globalFilter` 狀態。

#### `resetGlobalFilter`

```tsx
resetGlobalFilter: (defaultState?: boolean) => void
```

將 **globalFilter** 狀態重置為 `initialState.globalFilter`，或傳遞 `true` 以強制重置為預設空白狀態 `undefined`。

#### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

目前，此函式返回內建的 `includesString` 過濾函式。在未來版本中，它可能會根據提供的數據特性返回更動態的過濾函式。

#### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

返回表格的全域過濾函式（根據配置可能是用戶定義或自動的）。
