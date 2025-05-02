---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:38:15.249Z'
title: 全局过滤
id: global-filtering
---
## 可全局过滤 (Can-Filter)

列是否支持**全局**过滤由以下条件决定：

- 列已定义有效的 `accessorKey`/`accessorFn`
- 如果提供了 `options.getColumnCanGlobalFilter`，则需对指定列返回 `true`；若未提供，则当首行值为 `string` 或 `number` 类型时默认该列可全局过滤
- `column.enableColumnFilter` 未设为 `false`
- `options.enableColumnFilters` 未设为 `false`
- `options.enableFilters` 未设为 `false`

## 状态 (State)

过滤状态以如下形式存储在表格中：

```tsx
export interface GlobalFilterTableState {
  globalFilter: any
}
```

## 过滤函数 (Filter Functions)

全局过滤可使用与列过滤相同的过滤函数。详见[列过滤 API](../api/features/column-filtering)了解过滤函数详情。

#### 使用过滤函数 (Using Filter Functions)

通过以下方式向 `options.globalFilterFn` 传递参数来使用/引用/定义过滤函数：
- 引用内置过滤函数的 `string` 字符串
- 直接提供给 `options.globalFilterFn` 的函数

`tableOptions.globalFilterFn` 可用的最终过滤函数列表使用以下类型：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### 过滤元数据 (Filter Meta)

过滤数据时通常会暴露数据的附加信息，这些信息可用于辅助后续操作。典型例子是类似 [`match-sorter`](https://github.com/kentcdodds/match-sorter) 的排名系统，它能同时实现排名、过滤和排序。虽然此类工具在单维度过滤+排序场景中很实用，但表格解耦的过滤/排序架构会导致使用效率低下。

为实现排名/过滤/排序系统与表格的协同工作，`filterFn` 可选择用**过滤元数据 (filter meta)** 标记结果，这些元数据后续可用于按需排序/分组等操作。具体实现方式是在自定义 `filterFn` 中调用提供的 `addMeta` 函数。

以下示例使用我们自己的 `match-sorter-utils` 包（`match-sorter` 的工具分支）对数据进行排名、过滤和排序：

```tsx
import { sortingFns } from '@tanstack/[adapter]-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // 对项目进行排名
  const itemRank = rankItem(row.getValue(columnId), value)

  // 存储排名信息
  addMeta(itemRank)

  // 返回该项目是否应被保留
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 仅在列有排名信息时进行排序
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // 当排名相同时提供字母数字回退方案
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## 列定义选项 (Column Def Options)

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

启用/禁用该列的**全局**过滤功能。

## 列 API (Column API)

### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

返回该列是否可**全局**过滤。设为 `false` 可禁止在全局过滤时扫描该列。

## 行 API (Row API)

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

该行的列过滤元数据映射。此对象跟踪过滤过程中可选提供的行过滤元数据。

## 表格选项 (Table Options)

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

此选项允许定义自定义过滤函数，可通过键名在列的 `filterFn` 选项中引用。
示例：

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
      // 返回过滤后的行
    },
  },
})
```

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

默认情况下，过滤从父行向下执行（若父行被过滤，其所有子行也会被过滤）。将此选项设为 `true` 会使过滤从叶子行向上执行（只要某个子行或孙行被包含，其父行就会被包含）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

默认情况下，所有行都会参与过滤（最大深度100），无论它们是根级父行还是子行。设为 `0` 时仅过滤根级父行，所有子行保持未过滤状态；设为 `1` 时仅过滤1层深度的子行，以此类推。

这在需要保持行子层级可见性的场景中非常有用。

### `enableFilters`

```tsx
enableFilters?: boolean
```

启用/禁用表格的所有过滤功能。

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

禁用使用 `getFilteredRowModel` 进行数据过滤。当表格需要动态支持客户端和服务器端过滤时非常有用。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

若提供，此函数每个表格调用**一次**，应返回**新函数**用于计算并返回过滤后的行模型。

- 服务器端过滤场景无需此函数
- 客户端过滤场景必须提供此函数。各适配器通过 `{ getFilteredRowModel }` 导出默认实现

示例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'

  getFilteredRowModel: getFilteredRowModel(),
})
```

### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

用于全局过滤的过滤函数。

选项：
- 引用[内置过滤函数](#filter-functions)的 `string`
- 引用通过 `tableOptions.filterFns` 提供的自定义过滤函数的 `string`
- [自定义过滤函数](#filter-functions)

### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

若提供，当 `state.globalFilter` 变化时会使用 `updaterFn` 调用此函数。这将覆盖默认的内部状态管理，因此需在表格外部完全或部分持久化状态变更。

### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

启用/禁用表格的全局过滤功能。

### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TData>) => boolean
```

若提供，此函数会被传入列对象并返回 `true` 或 `false` 以指示该列是否应用于全局过滤。当列可能包含非 `string` 或 `number` 数据（如 `undefined`）时非常有用。

## 表格 API (Table API)

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

返回在应用任何**列**过滤前的表格行模型。

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

返回应用**列**过滤后的表格行模型。

### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

设置或更新 `state.globalFilter` 状态。

### `resetGlobalFilter`

```tsx
resetGlobalFilter: (defaultState?: boolean) => void
```

将 **globalFilter** 状态重置为 `initialState.globalFilter`，或传入 `true` 强制重置为默认空状态 `undefined`。

### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

当前此函数返回内置的 `includesString` 过滤函数。未来版本中可能根据数据特性返回更动态的过滤函数。

### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

返回表格的全局过滤函数（根据配置可能是用户定义或自动选择的函数）。
