---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:47.057Z'
title: 欄位可見性
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [column-visibility](../framework/react/examples/column-visibility)
- [column-ordering](../framework/react/examples/column-ordering)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

### 其他範例

- [SolidJS column-visibility](../framework/solid/examples/column-visibility)
- [Svelte column-visibility](../framework/svelte/examples/column-visibility)

## API

[Column Visibility API](../api/features/column-visibility)

## 欄位可見性指南

欄位可見性功能允許動態隱藏或顯示表格欄位。在舊版 react-table 中，此功能是欄位的靜態屬性，但在 v8 版本中，提供了專用的 `columnVisibility` 狀態和 API 來動態管理欄位可見性。

### 欄位可見性狀態

`columnVisibility` 狀態是一個將欄位 ID 映射到布林值的物件。若欄位 ID 存在於該物件中且值為 `false`，該欄位將被隱藏。若欄位 ID 不存在於物件中，或值為 `true`，則欄位會顯示。

```jsx
const [columnVisibility, setColumnVisibility] = useState({
  columnId1: true,
  columnId2: false, //預設隱藏此欄位
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

或者，若不需要在表格外部管理欄位可見性狀態，仍可使用 `initialState` 選項設定初始的預設欄位可見性狀態。

> **注意**：若 `columnVisibility` 同時提供給 `initialState` 和 `state`，`state` 的初始化將優先，`initialState` 會被忽略。請勿同時將 `columnVisibility` 提供給 `initialState` 和 `state`，只能選擇其中一種方式。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, //預設隱藏此欄位
      columnId3: true,
    },
    //...
  },
});
```

### 禁用欄位隱藏

預設情況下，所有欄位都可以被隱藏或顯示。若想防止特定欄位被隱藏，可將這些欄位的 `enableHiding` 選項設為 `false`。

```jsx
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // 禁用此欄位的隱藏功能
  },
  {
    header: 'Name',
    accessor: 'name', // 可被隱藏
  },
];
```

### 欄位可見性切換 API

有幾個欄位 API 方法可用於在使用者介面中渲染欄位可見性切換控制項：

- `column.getCanHide` - 適用於禁用 `enableHiding` 設為 `false` 之欄位的可見性切換。
- `column.getIsVisible` - 適用於設定可見性切換的初始狀態。
- `column.toggleVisibility` - 適用於切換欄位的可見性。
- `column.getToggleVisibilityHandler` - 將 `column.toggleVisibility` 方法連結到 UI 事件處理程序的快捷方式。

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

### 欄位可見性感知的表格 API

在渲染表頭、表身和表尾儲存格時，有許多 API 選項可用。你可能會看到像 `table.getAllLeafColumns` 和 `row.getAllCells` 這樣的 API，但若使用這些 API，它們不會考慮欄位可見性。此時，你需要使用這些 API 的「可見」變體，例如 `table.getVisibleLeafColumns` 和 `row.getVisibleCells`。

```jsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // 考慮欄位可見性
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // 考慮欄位可見性
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

若使用表頭群組 API，它們已自動考慮欄位可見性。
