---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-02T17:34:01.844Z'
title: 列过滤
id: column-filtering
---
## 列过滤 API

## 可过滤性 (Can-Filter)

列是否支持**列过滤**由以下条件决定：

- 列定义时提供了有效的 `accessorKey`/`accessorFn`
- `column.enableColumnFilter` 未设置为 `false`
- `options.enableColumnFilters` 未设置为 `false`
- `options.enableFilters` 未设置为 `false`

## 状态 (State)

过滤状态以以下形式存储在表格中：

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

## 过滤函数 (Filter Functions)

表格核心内置了以下过滤函数：

- `includesString`
  - 不区分大小写的字符串包含
- `includesStringSensitive`
  - 区分大小写的字符串包含
- `equalsString`
  - 不区分大小写的字符串相等
- `equalsStringSensitive`
  - 区分大小写的字符串相等
- `arrIncludes`
  - 数组中包含某项
- `arrIncludesAll`
  - 数组中包含所有项
- `arrIncludesSome`
  - 数组中包含某些项
- `equals`
  - 对象/引用相等 `Object.is`/`===`
- `weakEquals`
  - 弱对象/引用相等 `==`
- `inNumberRange`
  - 数值范围包含

每个过滤函数接收：

- 要过滤的行
- 用于获取行值的列 ID
- 过滤值

如果行应包含在过滤结果中则返回 `true`，否则返回 `false`。

以下是所有过滤函数的类型签名：

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

此可选方法允许过滤函数在接收过滤值前对其进行转换/清理/格式化。

### `filterFn.autoRemove`

此可选方法接收过滤值，若该值应从过滤状态中移除则返回 `true`。例如，某些布尔型过滤可能在过滤值为 `false` 时希望从表格状态中移除该值。

#### 使用过滤函数

可通过以下方式使用/引用/定义过滤函数：

- 引用内置过滤函数的 `string`
- 直接提供给 `columnDefinition.filterFn` 的函数

`columnDef.filterFn` 可用的最终过滤函数列表使用以下类型：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 过滤元数据 (Filter Meta)

过滤数据时常会暴露可用于后续操作的额外信息。典型例子是类似 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 的排名系统，它能同时排名、过滤和排序数据。虽然此类工具在单维度过滤+排序任务中很实用，但表格的分离式过滤/排序架构使其难以高效使用。

为实现排名/过滤/排序系统，`filterFn` 可选择性地用**过滤元数据**标记结果，供后续排序/分组等操作使用。这是通过调用传给自定义 `filterFn` 的 `addMeta` 函数实现的。

以下示例使用 `match-sorter-utils` 包对数据进行排名、过滤和排序：

```tsx
import { sortingFns } from '@tanstack/react-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储排名信息
  addMeta(itemRank)

  // 返回是否应保留该项目
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 仅在列有排名信息时排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // 当排名相同时提供字母数字回退
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## 列定义选项 (Column Def Options)

### `filterFn`

```tsx
filterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

用于此列的过滤函数。

选项：

- 引用[内置过滤函数](#filter-functions)的 `string`
- [自定义过滤函数](#filter-functions)

### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

启用/禁用此列的**列过滤**功能。

## 列 API (Column API)

### `getCanFilter`

```tsx
getCanFilter: () => boolean
```

返回列是否支持**列过滤**。

### `getFilterIndex`

```tsx
getFilterIndex: () => number
```

返回列过滤在表格 `state.columnFilters` 数组中的索引（包含 `-1`）。

### `getIsFiltered`

```tsx
getIsFiltered: () => boolean
```

返回列当前是否被过滤。

### `getFilterValue`

```tsx
getFilterValue: () => unknown
```

返回列的当前过滤值。

### `setFilterValue`

```tsx
setFilterValue: (updater: Updater<any>) => void
```

设置列的当前过滤值。可传递值或更新函数以实现不可变操作。

### `getAutoFilterFn`

```tsx
getAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

根据列的第一个已知值返回自动计算的过滤函数。

### `getFilterFn`

```tsx
getFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

返回指定列 ID 的过滤函数（用户定义或自动生成，取决于配置）。

## 行 API (Row API)

### `columnFilters`

```tsx
columnFilters: Record<string, boolean>
```

行的列过滤映射。此对象跟踪行是否通过特定列 ID 的过滤。

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

行的列过滤元数据映射。此对象跟踪过滤过程中可选提供的任何元数据。

## 表格选项 (Table Options)

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此选项允许定义自定义过滤函数，可通过键名在列的 `filterFn` 选项中引用。

示例：

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
      // 返回过滤后的行
    },
  },
})
```

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

默认情况下，过滤从父行向下进行（若父行被过滤，其所有子行也会被过滤）。设为 `true` 时，过滤从叶子行向上进行（只要子行或孙行被包含，父行也会被包含）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

默认情况下，所有行（最大深度 100）都会参与过滤。设为 `0` 时仅过滤根级父行，子行不受影响；设为 `1` 时仅过滤一级子行，以此类推。

这在需要保持行完整子层级可见的场景中很有用。

### `enableFilters`

```tsx
enableFilters?: boolean
```

启用/禁用表格的所有过滤功能。

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

禁用使用 `getFilteredRowModel` 过滤数据。在需要动态支持客户端和服务器端过滤时很有用。

### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

若提供，当 `state.columnFilters` 变化时会调用此函数。这会覆盖默认的内部状态管理，因此需在表格外部完全或部分持久化状态变更。

### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

启用/禁用表格的所有列过滤功能。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

若提供，此函数会被调用一次，并应返回一个新函数来计算和返回过滤后的行模型。

- 服务器端过滤无需此函数
- 客户端过滤需要此函数。各表格适配器通过 `{ getFilteredRowModel }` 导出默认实现

示例：

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

设置或更新 `state.columnFilters` 状态。

### `resetColumnFilters`

```tsx
resetColumnFilters: (defaultState?: boolean) => void
```

将**columnFilters**状态重置为 `initialState.columnFilters`，或传递 `true` 强制重置为默认空数组 `[]`。

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

返回应用**列过滤**前的行模型。

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

返回应用**列过滤**后的行模型。
