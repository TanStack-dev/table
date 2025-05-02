---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:23:27.954Z'
title: 分页
---
## 示例

想直接查看实现代码？请参考以下示例：

- [分页](../framework/react/examples/pagination)
- [受控分页 (React Query)](../framework/react/examples/pagination-controlled)
- [可编辑数据](../framework/react/examples/editable-data)
- [展开行](../framework/react/examples/expanding)
- [筛选](../framework/react/examples/filters)
- [完全受控](../framework/react/examples/fully-controlled)
- [行选择](../framework/react/examples/row-selection)

## API

[分页 API](../api/features/pagination)

## 分页指南

TanStack Table 对客户端分页和服务端分页都提供了完善的支持。本指南将引导您了解在表格中实现分页的不同方式。

### 客户端分页

使用客户端分页意味着您获取的 `data` 将包含表格的***所有***行数据，表格实例会在前端处理分页逻辑。

#### 是否应该使用客户端分页？

客户端分页通常是使用 TanStack Table 实现分页的最简单方式，但对于非常大的数据集可能不太实用。

不过，很多人低估了客户端能处理的数据量。如果您的表格最多只有几千行数据，客户端分页仍然是一个可行的选择。TanStack Table 设计用于处理数万行数据，在分页、筛选、排序和分组方面都能保持良好的性能。[官方分页示例](../framework/react/examples/pagination)加载了 10 万行数据，仍然表现良好（尽管只有少数几列）。

每个用例都不同，取决于表格的复杂度、列数、每条数据的大小等因素。需要关注的主要瓶颈是：

1. 您的服务器能否在合理的时间（和成本）内查询所有数据？
2. 获取的数据总量是多少？（如果列数不多，实际影响可能没有想象中严重。）
3. 如果一次性加载所有数据，客户端的浏览器是否会占用过多内存？

如果不确定，可以先从客户端分页开始，随着数据增长再切换到服务端分页。

#### 是否应该改用虚拟化？

另一种处理大数据集的方式是不分页，而是在同一页面上渲染所有行，但仅使用浏览器资源渲染视口中可见的行。这种策略通常称为“虚拟化”或“窗口化”。TanStack 提供了一个虚拟化库 [TanStack Virtual](https://tanstack.com/virtual/latest)，可以与 TanStack Table 配合使用。虚拟化和分页在 UI/UX 上各有优缺点，请根据您的用例选择最适合的方式。

#### 分页行模型

如果想利用 TanStack Table 内置的客户端分页功能，首先需要传入分页行模型。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), //加载客户端分页代码
});
```

### 手动服务端分页

如果确定需要使用服务端分页，以下是实现方式。

服务端分页不需要分页行模型，但如果为其他需要分页的共享组件提供了该模型，仍可以通过将 `manualPagination` 选项设为 `true` 来关闭客户端分页。设置 `manualPagination: true` 会让表格实例在底层使用 `table.getPrePaginationRowModel` 行模型，并假设传入的 `data` 已经是分页后的数据。

#### 总页数和总行数

除非明确告知，否则表格实例无法知道后端总共有多少行/页数据。通过提供 `rowCount` 或 `pageCount` 表格选项，可以让表格实例知道总页数。如果提供 `rowCount`，表格实例会根据 `rowCount` 和 `pageSize` 内部计算 `pageCount`。也可以直接提供 `pageCount`（如果已知）。如果不知道总页数，可以传入 `-1`，但此时 `getCanNextPage` 和 `getCanPreviousPage` 行模型函数将始终返回 `true`。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(), //服务端分页不需要
  manualPagination: true, //关闭客户端分页
  rowCount: dataQuery.data?.rowCount, //传入总行数，表格会计算总页数（如果不提供 pageCount）
  // pageCount: dataQuery.data?.pageCount, //或者直接传入 pageCount
});
```

> **注意**：设置 `manualPagination: true` 会让表格实例假设传入的 `data` 已经是分页后的数据。

### 分页状态

无论使用客户端分页还是手动服务端分页，都可以使用内置的 `pagination` 状态和 API。

`pagination` 状态是一个包含以下属性的对象：

- `pageIndex`：当前页码（从 0 开始）。
- `pageSize`：当前每页大小。

可以像管理表格实例中的其他状态一样管理 `pagination` 状态。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const [pagination, setPagination] = useState({
  pageIndex: 0, //初始页码
  pageSize: 10, //默认每页大小
});

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: setPagination, //当内部 API 修改分页状态时更新
  state: {
    //...
    pagination,
  },
});
```

如果不需要在自身作用域中管理 `pagination` 状态，但需要设置不同的 `pageIndex` 和 `pageSize` 初始值，可以使用 `initialState` 选项。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 2, //自定义初始页码
      pageSize: 25, //自定义默认每页大小
    },
  },
});
```

> **注意**：不要同时将 `pagination` 状态传递给 `state` 和 `initialState` 选项。`state` 会覆盖 `initialState`，只需使用其中之一。

### 分页选项

除了对手动服务端分页有用的 `manualPagination`、`pageCount` 和 `rowCount` 选项（已在[上文](#手动服务端分页)讨论），还有一个表格选项值得了解。

#### 自动重置页码

默认情况下，当发生影响分页的状态变化（如 `data` 更新、筛选条件变化、分组变化等）时，`pageIndex` 会自动重置为 `0`。当 `manualPagination` 为 `true` 时，此行为会自动禁用，但可以通过显式为 `autoResetPageIndex` 表格选项分配布尔值来覆盖。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //关闭自动重置页码
});
```

但请注意，如果关闭 `autoResetPageIndex`，可能需要自行添加逻辑来处理 `pageIndex` 的重置，以避免显示空页面。

### 分页 API

有几个分页表格实例 API 可用于连接分页 UI 组件。

#### 分页按钮 API

- `getCanPreviousPage`：用于在第一页时禁用“上一页”按钮。
- `getCanNextPage`：用于在没有更多页面时禁用“下一页”按钮。
- `previousPage`：用于跳转到上一页（按钮点击处理函数）。
- `nextPage`：用于跳转到下一页（按钮点击处理函数）。
- `firstPage`：用于跳转到第一页（按钮点击处理函数）。
- `lastPage`：用于跳转到最后一页（按钮点击处理函数）。
- `setPageIndex`：用于“跳转到页”输入框。
- `resetPageIndex`：用于将表格状态重置为初始页码。
- `setPageSize`：用于“每页大小”输入框/下拉框。
- `resetPageSize`：用于将表格状态重置为初始每页大小。
- `setPagination`：用于一次性设置所有分页状态。
- `resetPagination`：用于将表格状态重置为初始分页状态。

> **注意**：部分 API 是 `v8.13.0` 新增的。

```jsx
<Button
  onClick={() => table.firstPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<<'}
</Button>
<Button
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
  {'<'}
</Button>
<Button
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  {'>'}
</Button>
<Button
  onClick={() => table.lastPage()}
  disabled={!table.getCanNextPage()}
>
  {'>>'}
</Button>
<select
  value={table.getState().pagination.pageSize}
  onChange={e => {
    table.setPageSize(Number(e.target.value))
  }}
>
  {[10, 20, 30, 40, 50].map(pageSize => (
    <option key={pageSize} value={pageSize}>
      {pageSize}
    </option>
  ))}
</select>
```

#### 分页信息 API

- `getPageCount`：用于显示总页数。
- `getRowCount`：用于显示总行数。
