---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:24:34.809Z'
title: 行选择
---
## 示例

想直接查看实现代码？请参考以下示例：

- [React 行选择](../framework/react/examples/row-selection)
- [Vue 行选择](../framework/vue/examples/row-selection)
- [React 展开行](../framework/react/examples/expanding)

## API

[行选择 API](../api/features/row-selection)

## 行选择指南

行选择功能用于跟踪哪些行被选中，并允许通过多种方式切换行的选中状态。下面我们来看一些常见用例。

### 访问行选择状态

表格实例已自动管理行选择状态（但如下文所示，在自有作用域中管理行选择状态可能更方便）。您可以通过以下 API 访问内部行选择状态或已选中的行：

- `getState().rowSelection` - 返回内部行选择状态
- `getSelectedRowModel()` - 返回已选中的行
- `getFilteredSelectedRowModel()` - 返回筛选后的已选中行
- `getGroupedSelectedRowModel()` - 返回分组排序后的已选中行

```ts
console.log(table.getState().rowSelection) //获取行选择状态 - { 1: true, 2: false, 等等... }
console.log(table.getSelectedRowModel().rows) //获取完整的客户端已选中行
console.log(table.getFilteredSelectedRowModel().rows) //获取筛选后的客户端已选中行
console.log(table.getGroupedSelectedRowModel().rows) //获取分组后的客户端已选中行
```

> 注意：如果使用 `manualPagination`，请注意 `getSelectedRowModel` API 仅返回当前页的选中行，因为表格行模型只能基于传入的 `data` 生成行。但行选择状态可以包含不存在于 `data` 数组中的行 ID。

### 管理行选择状态

虽然表格实例会自动管理行选择状态，但通常更方便的做法是在自有作用域中管理状态，以便轻松访问选中行 ID 用于 API 调用或其他操作。

使用 `onRowSelectionChange` 表格选项将行选择状态提升到自有作用域，然后通过 `state` 表格选项将行选择状态传回表格实例。

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({}) //在自有作用域管理行选择状态

const table = useReactTable({
  //...
  onRowSelectionChange: setRowSelection, //将行选择状态提升到自有作用域
  state: {
    rowSelection, //将行选择状态传回表格实例
  },
})
```

### 实用的行 ID

默认情况下，每行的 ID 就是 `row.index`。如果使用行选择功能，建议使用更有意义的行标识符，因为行选择状态是按行 ID 存储的。可以通过 `getRowId` 表格选项指定返回唯一行 ID 的函数。

```ts
const table = useReactTable({
  //...
  getRowId: row => row.uuid, //使用数据库中的行 uuid 作为行 ID
})
```

此时选中行的状态会显示为：

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

而不是：

```json
{
  "0": true,
  "1": false
  //...
}
```

### 条件启用行选择

默认所有行都启用行选择。要通过条件启用某些行的选择或禁用所有行的选择，可以使用 `enableRowSelection` 表格选项，该选项接受布尔值或函数以实现更精细的控制。

```ts
const table = useReactTable({
  //...
  enableRowSelection: row => row.original.age > 18, //仅对成年人启用行选择
})
```

要在 UI 中强制控制行是否可选，可以使用 `row.getCanSelect()` API 来设置复选框或其他选择 UI。

### 单选行

默认情况下，表格允许多选行。如果只需要单选行，可以将 `enableMultiRowSelection` 表格选项设为 `false` 禁用多选，或传入函数条件式禁用行的子行多选。

这在需要单选按钮替代复选框的场景中非常有用。

```ts
const table = useReactTable({
  //...
  enableMultiRowSelection: false, //仅允许单选行
  // enableMultiRowSelection: row => row.original.age > 18, //仅对成年人允许单选行
})
```

### 子行选择

默认选中父行会同时选中其所有子行。如需禁用自动子行选择，可将 `enableSubRowSelection` 表格选项设为 `false`，或传入函数条件式禁用行的子行选择。

```ts
const table = useReactTable({
  //...
  enableSubRowSelection: false, //禁用子行选择
  // enableSubRowSelection: row => row.original.age > 18, //对成年人禁用子行选择
})
```

### 渲染行选择 UI

TanStack Table 不限制行选择 UI 的渲染方式。您可以使用复选框、单选按钮，或直接绑定点击事件到行本身。表格实例提供了一些 API 来帮助渲染行选择 UI。

#### 将行选择 API 连接到复选框输入

TanStack Table 提供了一些可直接绑定到复选框输入的处理函数，便于切换行选择状态。这些函数会自动调用其他内部 API 来更新行选择状态并重新渲染表格。

使用 `row.getToggleSelectedHandler()` API 连接复选框输入来切换行的选中状态。

使用 `table.getToggleAllRowsSelectedHandler()` 或 `table.getToggleAllPageRowsSelectedHandler` API 连接"全选"复选框来切换所有行的选中状态。

如需更精细控制这些处理函数，可以直接使用 `row.toggleSelected()` 或 `table.toggleAllRowsSelected()` API，甚至直接调用 `table.setRowSelection()` API 来设置行选择状态。这些处理函数仅为便捷方法。

```tsx
const columns = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()} //或 getToggleAllPageRowsSelectedHandler
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  //... 更多列定义...
]
```

#### 将行选择 API 连接到 UI

如需更简洁的行选择 UI，可以直接绑定点击事件到行本身。`row.getToggleSelectedHandler()` API 也适用于此场景。

```tsx
<tbody>
  {table.getRowModel().rows.map(row => {
    return (
      <tr
        key={row.id}
        className={row.getIsSelected() ? 'selected' : null}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map(cell => {
          return <td key={cell.id}>{/* */}</td>
        })}
      </tr>
    )
  })}
</tbody>
```
