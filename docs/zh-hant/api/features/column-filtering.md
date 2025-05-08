---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-08T23:45:13.109Z'
title: 欄位過濾
id: column-filtering
---
## 可過濾性 (Can-Filter)

欄位是否可進行**欄位**過濾，由以下條件決定：

- 該欄位已定義有效的 `accessorKey`/`accessorFn`
- `column.enableColumnFilter` 未設為 `false`
- `options.enableColumnFilters` 未設為 `false`
- `options.enableFilters` 未設為 `false`

## 狀態 (State)

過濾狀態以以下形式儲存在表格中：

```tsx
export interface ColumnFiltersTableState {
  columnFilters: ColumnFiltersState
}

export type ColumnFiltersState = ColumnFilter[]

export interface ColumnFilter {
  id: string
  value: unknown
}
```

## 過濾函式 (Filter Functions)

表格核心內建以下過濾函式：

- `includesString`
  - 不區分大小寫的字串包含檢查
- `includesStringSensitive`
  - 區分大小寫的字串包含檢查
- `equalsString`
  - 不區分大小寫的字串相等檢查
- `equalsStringSensitive`
  - 區分大小寫的字串相等檢查
- `arrIncludes`
  - 檢查項目是否包含於陣列中
- `arrIncludesAll`
  - 檢查所有項目是否包含於陣列中
- `arrIncludesSome`
  - 檢查部分項目是否包含於陣列中
- `equals`
  - 物件/參考相等檢查 `Object.is`/`===`
- `weakEquals`
  - 弱物件/參考相等檢查 `==`
- `inNumberRange`
  - 數值範圍包含檢查

每個過濾函式會接收：

- 要過濾的列 (row)
- 用於取得列值的欄位 ID (columnId)
- 過濾值 (filter value)

並應回傳 `true` 表示該列應包含在過濾結果中，`false` 則表示應移除。

以下是所有過濾函式的型別簽章：

```tsx
export type FilterFn<TData extends AnyData> = {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: any) => void
  ): boolean
  resolveFilterValue?: TransformFilterValueFn<TData>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
  addMeta?: (meta?: any) => void
}

export type TransformFilterValueFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => boolean

export type CustomFilterFns<TData extends AnyData> = Record<
  string,
  FilterFn<TData>
>
```

### `filterFn.resolveFilterValue`

這是可選的「掛載」方法，允許過濾函式在傳遞過濾值前對其進行轉換/清理/格式化。

### `filterFn.autoRemove`

這是可選的「掛載」方法，會接收過濾值並預期回傳 `true` 表示該過濾值應從過濾狀態中移除。例如，某些布林型過濾器可能希望在過濾值設為 `false` 時將其從表格狀態中移除。

#### 使用過濾函式 (Using Filter Functions)

過濾函式可透過以下方式在 `columnDefinition.filterFn` 中引用/定義：

- 引用內建過濾函式的 `字串`
- 直接提供給 `columnDefinition.filterFn` 選項的函式

`columnDef.filterFn` 選項可用的最終過濾函式列表使用以下型別：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 過濾元數據 (Filter Meta)

過濾資料時常會揭露可用於後續操作的額外資訊。一個很好的例子是類似 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 的排名系統，它能同時對資料進行排名、過濾和排序。雖然這類工具在單一維度的過濾+排序任務中非常實用，但表格的分散式過濾/排序架構會使其難以使用且效率低下。

為了讓排名/過濾/排序系統能與表格協作，`filterFn` 可選擇性地用**過濾元數據**標記結果，供後續排序/分組等操作使用。這是透過呼叫傳遞給自訂 `filterFn` 的 `addMeta` 函式來實現的。

以下範例使用我們自己的 `match-sorter-utils` 套件（`match-sorter` 的工具分支）來對資料進行排名、過濾和排序：

```tsx
import { sortingFns } from '@tanstack/react-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 對項目進行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 儲存排名資訊
  addMeta(itemRank)

  // 回傳該項目是否應被過濾保留/移除
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

  // 當項目排名相同時，提供字母數字的後備方案
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## 欄位定義選項 (Column Def Options)

### `filterFn`

```tsx
filterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

用於此欄位的過濾函式。

選項：

- 引用[內建過濾函式](#filter-functions)的`字串`
- [自訂過濾函式](#filter-functions)

### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

啟用/停用此欄位的**欄位**過濾功能。

## 欄位 API (Column API)

### `getCanFilter`

```tsx
getCanFilter: () => boolean
```

回傳此欄位是否能進行**欄位**過濾。

### `getFilterIndex`

```tsx
getFilterIndex: () => number
```

回傳此欄位過濾在表格 `state.columnFilters` 陣列中的索引（包含 `-1`）。

### `getIsFiltered`

```tsx
getIsFiltered: () => boolean
```

回傳此欄位目前是否被過濾。

### `getFilterValue`

```tsx
getFilterValue: () => unknown
```

回傳此欄位當前的過濾值。

### `setFilterValue`

```tsx
setFilterValue: (updater: Updater<any>) => void
```

設定此欄位當前過濾值的函式。可傳遞值或更新函式以進行不可變操作。

### `getAutoFilterFn`

```tsx
getAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

回傳基於欄位第一個已知值自動計算的過濾函式。

### `getFilterFn`

```tsx
getFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

回傳指定欄位 ID 的過濾函式（根據配置可能是使用者定義或自動計算的）。

## 列 API (Row API)

### `columnFilters`

```tsx
columnFilters: Record<string, boolean>
```

列的欄位過濾映射。此物件追蹤列是否通過/未通過特定欄位 ID 的過濾。

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

列的欄位過濾元數據映射。此物件追蹤過濾過程中可選提供的任何過濾元數據。

## 表格選項 (Table Options)

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此選項允許定義自訂過濾函式，可透過鍵值在欄位的 `filterFn` 選項中引用。
範例：

```tsx
declare module '@tanstack/[adapter]-table' {
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
      // 回傳過濾後的列
    },
  },
})
```

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

預設情況下，過濾是從父列向下進行（因此如果父列被過濾掉，其所有子列也會被過濾掉）。將此選項設為 `true` 會使過濾從子列向上進行（這意味著只要父列的一個子列或孫列被包含，父列也會被包含）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

預設情況下，過濾會套用至所有列（最大深度為 100），無論它們是根層級的父列還是父列的子列。將此選項設為 `0` 會使過濾僅套用至根層級的父列，所有子列保持未過濾狀態。類似地，設為 `1` 會使過濾僅套用至一層深的子列，依此類推。

這在需要讓列的整個子層級結構在套用過濾後仍保持可見的情況下非常有用。

### `enableFilters`

```tsx
enableFilters?: boolean
```

啟用/停用表格的所有過濾功能。

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

停用 `getFilteredRowModel` 用於過濾資料。這在表格需要動態支援客戶端和伺服器端過濾時可能有用。

### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

若提供，當 `state.columnFilters` 變更時會呼叫此函式並傳遞 `updaterFn`。這會覆蓋預設的內部狀態管理，因此需在表格外部完全或部分保存狀態變更。

### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

啟用/停用表格的**所有**欄位過濾功能。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

若提供，此函式會**每表格呼叫一次**，並應回傳**新函式**以在表格過濾時計算並回傳列模型。

- 對於伺服器端過濾，此函式非必要可忽略，因伺服器應已回傳過濾後的列模型。
- 對於客戶端過濾，此函式為必需。預設實作可透過任何表格轉接器的 `{ getFilteredRowModel }` 匯出提供。

範例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'


  getFilteredRowModel: getFilteredRowModel(),
})
```

## 表格 API (Table API)

### `setColumnFilters`

```tsx
setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
```

設定或更新 `state.columnFilters` 狀態。

### `resetColumnFilters`

```tsx
resetColumnFilters: (defaultState?: boolean) => void
```

將**columnFilters**狀態重設為 `initialState.columnFilters`，或傳遞 `true` 強制重設為預設空白狀態 `[]`。

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

回傳套用任何**欄位**過濾前的表格列模型。

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

回傳套用**欄位**過濾後的表格列模型。
