---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:15:38.808Z'
title: 列可见性
---
## 示例

想直接查看实现代码？请参考以下示例：

- [column-visibility](../framework/react/examples/column-visibility)
- [column-ordering](../framework/react/examples/column-ordering)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

### 其他示例

- [SolidJS column-visibility](../framework/solid/examples/column-visibility)
- [Svelte column-visibility](../framework/svelte/examples/column-visibility)

## API

[列可见性 API](../api/features/column-visibility)

## 列可见性指南

列可见性功能允许动态隐藏或显示表格列。在 react-table 的早期版本中，此功能是列的静态属性，但在 v8 版本中，提供了专门的 `columnVisibility` 状态和 API 来动态管理列可见性。

### 列可见性状态

`columnVisibility` 状态是一个列 ID 到布尔值的映射。如果列 ID 存在于映射中且值为 `false`，则该列将被隐藏。如果列 ID 不存在于映射中，或值为 `true`，则该列将显示。

```jsx
const [columnVisibility, setColumnVisibility] = useState({
  columnId1: true,
  columnId2: false, //默认隐藏此列
  columnId3: true,
});

const table = useReactTable({
  //...
  state: {
    columnVisibility,
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
});
```

或者，如果不需要在表格外部管理列可见性状态，仍可以使用 `initialState` 选项设置初始默认列可见性状态。

> **注意**：如果 `columnVisibility` 同时提供给 `initialState` 和 `state`，则 `state` 的初始化将优先，`initialState` 将被忽略。不要同时向 `initialState` 和 `state` 提供 `columnVisibility`，只需选择其中之一。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, //默认隐藏此列
      columnId3: true,
    },
    //...
  },
});
```

### 禁用列隐藏

默认情况下，所有列都可以隐藏或显示。如果想防止某些列被隐藏，可以将这些列的 `enableHiding` 选项设置为 `false`。

```jsx
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // 禁用此列的隐藏功能
  },
  {
    header: 'Name',
    accessor: 'name', // 可以隐藏
  },
];
```

### 列可见性切换 API

有多个列 API 方法可用于在 UI 中渲染列可见性切换控件。

- `column.getCanHide` - 对于设置了 `enableHiding` 为 `false` 的列，可用于禁用其可见性切换。
- `column.getIsVisible` - 可用于设置可见性切换的初始状态。
- `column.toggleVisibility` - 可用于切换列的可见性。
- `column.getToggleVisibilityHandler` - 将 `column.toggleVisibility` 方法连接到 UI 事件处理程序的快捷方式。

```jsx
{table.getAllColumns().map((column) => (
  <label key={column.id}>
    <input
      checked={column.getIsVisible()}
      disabled={!column.getCanHide()}
      onChange={column.getToggleVisibilityHandler()}
      type="checkbox"
    />
    {column.columnDef.header}
  </label>
))}
```

### 列可见性感知的表 API

在渲染表头、表体和表尾单元格时，有许多 API 选项可用。你可能会看到 `table.getAllLeafColumns` 和 `row.getAllCells` 等 API，但如果使用这些 API，它们不会考虑列可见性。相反，需要使用这些 API 的“可见”变体，例如 `table.getVisibleLeafColumns` 和 `row.getVisibleCells`。

```jsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // 考虑列可见性
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // 考虑列可见性
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

如果使用表头组 API，它们已经考虑了列可见性。
