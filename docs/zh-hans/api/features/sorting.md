---
source-updated-at: '2024-04-13T00:46:18.000Z'
translation-updated-at: '2025-05-02T17:39:40.057Z'
title: 排序
id: sorting
---
## 排序状态 (Sorting State)

排序状态以以下形式存储在表格中：

```tsx
export type SortDirection = 'asc' | 'desc'

export type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]

export type SortingTableState = {
  sorting: SortingState
}
```

## 排序函数 (Sorting Functions)

表格核心内置了以下排序函数：

- `alphanumeric`
  - 不区分大小写地按字母数字混合值排序。速度较慢，但如果字符串中包含需要自然排序的数字会更准确。
- `alphanumericCaseSensitive`
  - 区分大小写地按字母数字混合值排序。速度较慢，但如果字符串中包含需要自然排序的数字会更准确。
- `text`
  - 不区分大小写地按文本/字符串值排序。速度较快，但如果字符串中包含需要自然排序的数字则准确性较低。
- `textCaseSensitive`
  - 区分大小写地按文本/字符串值排序。速度较快，但如果字符串中包含需要自然排序的数字则准确性较低。
- `datetime`
  - 按时间排序，如果值是 `Date` 对象请使用此函数。
- `basic`
  - 使用基本的 `a > b ? 1 : a < b ? -1 : 0` 比较进行排序。这是最快的排序函数，但可能不是最准确的。

每个排序函数接收 2 行数据和一个列 ID，并需要通过列 ID 比较这两行数据，在升序排列时返回 `-1`、`0` 或 `1`。以下是速查表：

| 返回值 | 升序排列 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

所有排序函数的类型签名如下：

```tsx
export type SortingFn<TData extends AnyData> = {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}
```

#### 使用排序函数 (Using Sorting Functions)

可以通过以下方式在 `columnDefinition.sortingFn` 中使用/引用/定义排序函数：

- 引用内置排序函数的 `string`
- 通过 `tableOptions.sortingFns` 选项提供的自定义排序函数的 `string` 引用
- 直接提供给 `columnDefinition.sortingFn` 选项的函数

`columnDef.sortingFn` 可用的最终排序函数列表使用以下类型：

```tsx
export type SortingFnOption<TData extends AnyData> =
  | 'auto'
  | SortingFns
  | BuiltInSortingFns
  | SortingFn<TData>
```

## 列定义选项 (Column Def Options)

### `sortingFn`

```tsx
sortingFn?: SortingFn | keyof SortingFns | keyof BuiltInSortingFns
```

用于此列的排序函数。

选项：

- 引用[内置排序函数](#排序函数-sorting-functions)的 `string`
- [自定义排序函数](#排序函数-sorting-functions)

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

设置为 `true` 时，此列的排序切换将首先按降序方向进行。

### `enableSorting`

```tsx
enableSorting?: boolean
```

启用/禁用此列的排序功能。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

启用/禁用此列的多列排序功能。

### `invertSorting`

```tsx
invertSorting?: boolean
```

反转此列的排序顺序。适用于具有反向最佳/最差比例的值，其中较小的数字更好，例如排名（第1、第2、第3）或类似高尔夫球的计分。

### `sortUndefined`

```tsx
sortUndefined?: 'first' | 'last' | false | -1 | 1 // 默认为 1
```

- `'first'`
  - 未定义的值将被推到列表的开头
- `'last'`
  - 未定义的值将被推到列表的末尾
- `false`
  - 未定义的值将被视为并列，需要通过下一个列过滤器或原始索引进行排序（视情况而定）
- `-1`
  - 未定义的值将以更高的优先级排序（升序）（如果升序，未定义的值将出现在列表的开头）
- `1`
  - 未定义的值将以较低的优先级排序（降序）（如果升序，未定义的值将出现在列表的末尾）

> 注意：`'first'` 和 `'last'` 选项在 v8.16.0 中新增

## 列 API (Column API)

### `getAutoSortingFn`

```tsx
getAutoSortingFn: () => SortingFn<TData>
```

返回基于列值自动推断出的排序函数。

### `getAutoSortDir`

```tsx
getAutoSortDir: () => SortDirection
```

返回基于列值自动推断出的排序方向。

### `getSortingFn`

```tsx
getSortingFn: () => SortingFn<TData>
```

返回用于此列的解析后的排序函数。

### `getNextSortingOrder`

```tsx
getNextSortingOrder: () => SortDirection | false
```

返回下一个排序顺序。

### `getCanSort`

```tsx
getCanSort: () => boolean
```

返回此列是否可以排序。

### `getCanMultiSort`

```tsx
getCanMultiSort: () => boolean
```

返回此列是否可以多列排序。

### `getSortIndex`

```tsx
getSortIndex: () => number
```

返回此列在排序状态中的索引位置。

### `getIsSorted`

```tsx
getIsSorted: () => false | SortDirection
```

返回此列是否已排序。

### `getFirstSortDir`

```tsx 
getFirstSortDir: () => SortDirection
```

返回排序此列时应使用的第一个方向。

### `clearSorting`

```tsx
clearSorting: () => void
```

从表格的排序状态中移除此列。

### `toggleSorting`

```tsx
toggleSorting: (desc?: boolean, isMulti?: boolean) => void
```

切换此列的排序状态。如果提供了 `desc`，将强制排序方向为该值。如果提供了 `isMulti`，将以累加方式多列排序该列（如果已排序则切换）。

### `getToggleSortingHandler`

```tsx
getToggleSortingHandler: () => undefined | ((event: unknown) => void)
```

返回一个可用于切换此列排序状态的函数。这对于将点击处理程序附加到列标题很有用。

## 表格选项 (Table Options)

### `sortingFns`

```tsx
sortingFns?: Record<string, SortingFn>
```

此选项允许您定义自定义排序函数，可以通过其键在列的 `sortingFn` 选项中引用。
示例：

```tsx
declare module '@tanstack/table-core' {
  interface SortingFns {
    myCustomSorting: SortingFn<unknown>
  }
}

const column = columnHelper.data('key', {
  sortingFn: 'myCustomSorting',
})

const table = useReactTable({
  columns: [column],
  sortingFns: {
    myCustomSorting: (rowA: any, rowB: any, columnId: any): number =>
      rowA.getValue(columnId).value < rowB.getValue(columnId).value ? 1 : -1,
  },
})
```

### `manualSorting`

```tsx
manualSorting?: boolean
```

启用表格的手动排序。如果为 `true`，您需要在将数据传递给表格之前自行排序。这对于服务器端排序很有用。

### `onSortingChange`

```tsx
onSortingChange?: OnChangeFn<SortingState>
```

如果提供，当 `state.sorting` 发生变化时，将使用 `updaterFn` 调用此函数。这会覆盖默认的内部状态管理，因此您需要在表格外部完全或部分持久化状态更改。

### `enableSorting`

```tsx
enableSorting?: boolean
```

启用/禁用表格的排序功能。

### `enableSortingRemoval`

```tsx
enableSortingRemoval?: boolean
```

启用/禁用移除表格排序的功能。
- 如果为 `true`，则排序顺序将循环如下：'无' -> '降序' -> '升序' -> '无' -> ...
- 如果为 `false`，则排序顺序将循环如下：'无' -> '降序' -> '升序' -> '降序' -> '升序' -> ...

### `enableMultiRemove`

```tsx
enableMultiRemove?: boolean
```

启用/禁用移除多列排序的功能。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

启用/禁用表格的多列排序功能。

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

如果为 `true`，所有排序将默认以降序作为其第一个切换状态。

### `getSortedRowModel`

```tsx
getSortedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

此函数用于获取排序后的行模型。如果使用服务器端排序，则不需要此函数。要使用客户端排序，请将适配器导出的 `getSortedRowModel()` 传递给表格或自行实现。

### `maxMultiSortColCount`

```tsx
maxMultiSortColCount?: number
```

设置可以多列排序的最大列数。

### `isMultiSortEvent`

```tsx
isMultiSortEvent?: (e: unknown) => boolean
```

传递一个自定义函数，用于确定是否应触发多列排序事件。它接收排序切换处理程序的事件，如果事件应触发多列排序，则应返回 `true`。

## 表格 API (Table API)

### `setSorting`

```tsx
setSorting: (updater: Updater<SortingState>) => void
```

设置或更新 `state.sorting` 状态。

### `resetSorting`

```tsx
resetSorting: (defaultState?: boolean) => void
```

将**排序**状态重置为 `initialState.sorting`，或传递 `true` 强制重置为默认的空状态 `[]`。

### `getPreSortedRowModel`

```tsx
getPreSortedRowModel: () => RowModel<TData>
```

返回在应用任何排序之前的表格行模型。

### `getSortedRowModel`

```tsx
getSortedRowModel: () => RowModel<TData>
```

返回应用排序后的表格行模型。
