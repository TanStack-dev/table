---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:26:48.850Z'
title: 排序
---
## 示例

想直接查看实现代码？请参考以下示例：

- [排序](../framework/react/examples/sorting)
- [过滤](../framework/react/examples/filters)

## API

[排序 API](../api/features/sorting)

## 排序指南

TanStack Table 为几乎所有排序场景提供了解决方案。本指南将介绍如何通过多种选项来自定义内置的客户端排序功能，以及如何选择手动服务端排序而非客户端排序。

### 排序状态

排序状态定义为包含以下结构的对象数组：

```tsx
type ColumnSort = {
  id: string
  desc: boolean
}
type SortingState = ColumnSort[]
```

由于排序状态是数组，因此可以同时对多列进行排序。更多关于多列排序的定制选项请参阅[下文](#multi-sorting)。

#### 访问排序状态

可以通过 `table.getState()` API 直接从表格实例中访问排序状态，就像访问其他状态一样。

```tsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().sorting) // 从表格实例中访问排序状态
```

但如果需要在表格初始化前访问排序状态，可以像下面这样“控制”排序状态。

#### 受控排序状态

如果需要轻松访问排序状态，可以通过 `state.sorting` 和 `onSortingChange` 表格选项在自有状态管理中控制/管理排序状态。

```tsx
const [sorting, setSorting] = useState<SortingState>([]) // 可在此设置初始排序状态
//...
// 使用排序状态从服务器获取数据或其他操作...
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

#### 初始排序状态

如果不需要在自有状态管理或作用域中控制排序状态，但仍希望设置初始排序状态，可以使用 `initialState` 表格选项而非 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    sorting: [
      {
        id: 'name',
        desc: true, // 默认按名称降序排序
      },
    ],
  },
})
```

> **注意**：不要同时使用 `initialState.sorting` 和 `state.sorting`，因为 `state.sorting` 中的初始化状态会覆盖 `initialState.sorting`。

### 客户端排序与服务端排序

是否使用客户端排序或服务端排序完全取决于是否同时使用客户端或服务端分页或过滤。保持一致很重要，因为使用客户端排序与服务端分页或过滤只会对当前加载的数据进行排序，而非整个数据集。

### 手动服务端排序

如果计划仅在后端逻辑中使用自己的服务端排序，则无需提供排序行模型。但如果已提供排序行模型却希望禁用它，可以使用 `manualSorting` 表格选项。

```jsx
const [sorting, setSorting] = useState<SortingState>([])
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  //getSortedRowModel: getSortedRowModel(), // 手动排序不需要此行
  manualSorting: true, // 使用预排序行模型而非排序行模型
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

> **注意**：当 `manualSorting` 设为 `true` 时，表格会假设提供的数据已排序，不会对其应用任何排序。

### 客户端排序

要实现客户端排序，首先需要为表格提供排序行模型。可以从 TanStack Table 导入 `getSortedRowModel` 函数，它将用于将行转换为已排序的行。

```jsx
import { useReactTable } from '@tanstack/react-table'
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // 提供排序行模型
})
```

### 排序函数

所有列的默认排序函数会根据列的数据类型推断得出。但为特定列定义确切的排序函数非常有用，尤其是当数据可为空或非标准数据类型时。

可以通过 `sortingFn` 列选项为每列确定自定义排序函数。

默认情况下，有 6 种内置排序函数可选：

- `alphanumeric` - 不区分大小写地按混合字母数字值排序。速度较慢，但如果字符串包含需要自然排序的数字则更准确。
- `alphanumericCaseSensitive` - 区分大小写地按混合字母数字值排序。速度较慢，但如果字符串包含需要自然排序的数字则更准确。
- `text` - 不区分大小写地按文本/字符串值排序。速度较快，但如果字符串包含需要自然排序的数字则准确性较低。
- `textCaseSensitive` - 区分大小写地按文本/字符串值排序。速度较快，但如果字符串包含需要自然排序的数字则准确性较低。
- `datetime` - 按时间排序，如果值为 `Date` 对象则使用此函数。
- `basic` - 使用基本的 `a > b ? 1 : a < b ? -1 : 0` 比较排序。这是最快的排序函数，但准确性可能不高。

也可以通过 `sortingFn` 列选项或 `sortingFns` 表格选项定义自定义排序函数。

#### 自定义排序函数

在 `sortingFns` 表格选项或 `sortingFn` 列选项中定义自定义排序函数时，应具有以下签名：

```tsx
// 可选使用 SortingFn 推断参数类型
const myCustomSortingFn: SortingFn<TData> = (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
  return // -1、0 或 1 - 使用 rowA.original 和 rowB.original 访问任意行数据
}
```

> 注意：比较函数无需考虑列是降序还是升序。行模型会处理该逻辑。`sortingFn` 函数只需提供一致的比较。

每个排序函数接收 2 行和列 ID，并应使用列 ID 比较两行，以升序返回 `-1`、`0` 或 `1`。以下是速查表：

| 返回值 | 升序顺序 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

```jsx
const columns = [
  {
    header: () => '名称',
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // 按名称使用内置排序函数
  },
  {
    header: () => '年龄',
    accessorKey: 'age',
    sortingFn: 'myCustomSortingFn', // 使用自定义全局排序函数
  },
  {
    header: () => '生日',
    accessorKey: 'birthday',
    sortingFn: 'datetime', // 推荐用于日期列
  },
  {
    header: () => '个人资料',
    accessorKey: 'profile',
    // 直接使用自定义排序函数
    sortingFn: (rowA, rowB, columnId) => {
      return rowA.original.someProperty - rowB.original.someProperty
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  sortingFns: { // 添加自定义排序函数
    myCustomSortingFn: (rowA, rowB, columnId) => {
      return rowA.original[columnId] > rowB.original[columnId] ? 1 : rowA.original[columnId] < rowB.original[columnId] ? -1 : 0
    },
  },
})
```

### 自定义排序

有许多表格和列选项可用于进一步自定义排序用户体验和行为。

#### 禁用排序

可以通过 `enableSorting` 列选项或表格选项禁用特定列或整个表格的排序。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableSorting: false, // 禁用此列的排序
  },
  {
    header: () => '名称',
    accessorKey: 'name',
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableSorting: false, // 禁用整个表格的排序
})
```

#### 排序方向

默认情况下，使用 `toggleSorting` API 循环切换列的排序方向时，字符串列的第一个排序方向为升序，数字列则为降序。可以通过 `sortDescFirst` 列选项或表格选项更改此行为。

```jsx
const columns = [
  {
    header: () => '名称',
    accessorKey: 'name',
    sortDescFirst: true, // 名称列默认先按降序排序（字符串列默认为升序）
  },
  {
    header: () => '年龄',
    accessorKey: 'age',
    sortDescFirst: false, // 年龄列默认先按升序排序（数字列默认为降序）
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  sortDescFirst: true, // 所有列默认先按降序排序（字符串列默认为升序，数字列默认为降序）
})
```

> **注意**：对于包含可空值的列，可能需要显式设置 `sortDescFirst` 列选项。如果列包含可空值，表格可能无法正确判断列是数字还是字符串。

#### 反转排序

反转排序与更改默认排序方向不同。如果列的 `invertSorting` 选项为 `true`，则“降序/升序”排序状态仍会正常循环，但行的实际排序会反转。这对于具有反向优劣比例的值非常有用，例如排名（第一名、第二名、第三名）或类似高尔夫得分的低分最佳情况。

```jsx
const columns = [
  {
    header: () => '排名',
    accessorKey: 'rank',
    invertSorting: true, // 反转此列的排序。即使应用“降序”排序，1st -> 2nd -> 3rd -> ...
  },
  //...
]
```

#### 排序未定义值

任何未定义的值会根据 `sortUndefined` 列选项或表格选项排序到列表的开头或末尾。可以根据具体用例自定义此行为。

如果未指定，`sortUndefined` 的默认值为 `1`，未定义的值会以较低优先级排序（降序），如果为升序，未定义的值会出现在列表末尾。

- `'first'` - 未定义的值会被推到列表开头
- `'last'` - 未定义的值会被推到列表末尾
- `false` - 未定义的值会被视为并列，需要由下一个列过滤器或原始索引排序（视情况而定）
- `-1` - 未定义的值会以较高优先级排序（升序）（如果为升序，未定义的值会出现在列表开头）
- `1` - 未定义的值会以较低优先级排序（降序）（如果为升序，未定义的值会出现在列表末尾）

> 注意：`'first'` 和 `'last'` 选项在 v8.16.0 中新增

```jsx
const columns = [
  {
    header: () => '排名',
    accessorKey: 'rank',
    sortUndefined: -1, // 'first' | 'last' | 1 | -1 | false
  },
]
```

#### 排序移除

默认情况下，在循环切换列的排序状态时允许移除排序。可以通过 `enableSortingRemoval` 表格选项禁用此行为。此行为在希望确保至少有一列始终排序时非常有用。

使用 `getToggleSortingHandler` 或 `toggleSorting` API 时的默认行为如下：

`'none' -> 'desc' -> 'asc' -> 'none' -> 'desc' -> 'asc' -> ...`

如果禁用排序移除，行为将如下：

`'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...`

一旦列被排序且 `enableSortingRemoval` 为 `false`，切换该列的排序将永远不会移除排序。但如果用户对另一列排序且非多列排序事件，则前一列的排序会被移除，仅应用于新列。

> 将 `enableSortingRemoval` 设为 `false` 可确保至少有一列始终排序。

```jsx
const table = useReactTable({
  columns,
  data,
  enableSortingRemoval: false, // 禁用移除列排序的功能（始终为 none -> asc -> desc -> asc）
})
```

#### 多列排序

如果使用 `column.getToggleSortingHandler` API，默认启用同时对多列排序。如果用户在点击列标题时按住 `Shift` 键，表格将对该列以及已排序的其他列进行排序。如果使用 `column.toggleSorting` API，则需要手动传递是否使用多列排序。（`column.toggleSorting(desc, multi)`）。

##### 禁用多列排序

可以通过 `enableMultiSort` 列选项或表格选项禁用特定列或整个表格的多列排序。禁用特定列的多列排序将用该列的新排序替换所有现有排序。

```jsx
const columns = [
  {
    header: () => '创建时间',
    accessorKey: 'createdAt',
    enableMultiSort: false, // 如果对该列排序，则始终仅按该列排序
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableMultiSort: false, // 禁用整个表格的多列排序
})
```

##### 自定义多列排序触发

默认情况下，使用 `Shift` 键触发多列排序。可以通过 `isMultiSortEvent` 表格选项更改此行为。甚至可以通过从自定义函数返回 `true` 来指定所有排序事件都应触发多列排序。

```jsx
const table = useReactTable({
  columns,
  data,
  isMultiSortEvent: (e) => true, // 普通点击触发多列排序
  // 或
  isMultiSortEvent: (e) => e.ctrlKey || e.shiftKey, // 同时使用 `Ctrl` 键触发多列排序
})
```

##### 多列排序限制

默认情况下，可同时排序的列数没有限制。可以通过 `maxMultiSortColCount` 表格选项设置限制。

```jsx
const table = useReactTable({
  columns,
  data,
  maxMultiSortColCount: 3, // 仅允许同时排序 3 列
})
```

##### 多列排序移除

默认情况下，允许移除多列排序。可以通过 `enableMultiRemove` 表格选项禁用此行为。

```jsx
const table = useReactTable({
  columns,
  data,
  enableMultiRemove: false, // 禁用移除多列排序的功能
})
```

### 排序 API

有许多与排序相关的 API 可用于连接到用户界面或其他逻辑。以下是所有排序 API 及其部分用例的列表。

- `table.setSorting` - 直接设置排序状态。
- `table.resetSorting` - 将排序状态重置为初始状态或清除。

- `column.getCanSort` - 用于启用/禁用列的排序用户界面。
- `column.getIsSorted` - 用于显示列的视觉排序指示器。

- `column.getToggleSortingHandler` - 用于连接列的排序用户界面。可添加到排序箭头（图标按钮）、菜单项或整个列标题单元格。此处理程序会使用正确的参数调用 `column.toggleSorting`。
- `column.toggleSorting` - 用于连接列的排序用户界面。如果使用此函数而非 `column.getToggleSortingHandler`，则需要手动传递是否使用多列排序。（`column.toggleSorting(desc, multi)`）
- `column.clearSorting` - 用于特定列的“清除排序”按钮或菜单项。

- `column.getNextSortingOrder` - 用于显示列下一次排序的方向。（在工具提示/菜单项/aria-label 等中显示 asc/desc/clear）
- `column.getFirstSortDir` - 用于显示列第一次排序的方向。（在工具提示/菜单项/aria-label 等中显示 asc/desc）
- `column.getAutoSortDir` - 确定列的第一次排序方向是升序还是降序。
- `column.getAutoSortingFn` - 内部用于查找列的默认排序函数（如果未指定）。
- `column.getSortingFn` - 返回列使用的确切排序函数。

- `column.getCanMultiSort` - 用于启用/禁用列的多列排序用户界面。
- `column.getSortIndex` - 用于在多列排序场景中显示列的排序顺序标记或指示器。例如，它是第一个、第二个、第三个等被排序的列。
