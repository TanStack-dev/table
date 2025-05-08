---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:40:26.362Z'
title: 行選擇
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [React 行選取](../framework/react/examples/row-selection)
- [Vue 行選取](../framework/vue/examples/row-selection)
- [React 展開](../framework/react/examples/expanding)

## API

[行選取 API](../api/features/row-selection)

## 行選取指南

行選取功能會追蹤哪些行被選取，並允許你以多種方式切換行的選取狀態。讓我們來看看一些常見的使用情境。

### 存取行選取狀態

表格實例已為你管理行選取狀態（不過如後文所示，在自己的作用域中管理行選取狀態可能更方便）。你可以透過幾個 API 存取內部行選取狀態或已選取的行。

- `getState().rowSelection` - 回傳內部行選取狀態
- `getSelectedRowModel()` - 回傳已選取的行
- `getFilteredSelectedRowModel()` - 回傳過濾後的已選取行
- `getGroupedSelectedRowModel()` - 回傳分組和排序後的已選取行

```ts
console.log(table.getState().rowSelection) //取得行選取狀態 - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //取得完整的客戶端已選取行
console.log(table.getFilteredSelectedRowModel().rows) //取得過濾後的客戶端已選取行
console.log(table.getGroupedSelectedRowModel().rows) //取得分組後的客戶端已選取行
```

> 注意：如果你使用 `manualPagination`，請注意 `getSelectedRowModel` API 只會回傳當前頁面上的已選取行，因為表格行模型只能基於傳入的 `data` 生成行。不過，行選取狀態可以包含不在 `data` 陣列中的行 ID。

### 管理行選取狀態

儘管表格實例已為你管理行選取狀態，但通常更方便自行管理狀態，以便輕鬆存取已選取的行 ID，用於 API 呼叫或其他操作。

使用 `onRowSelectionChange` 表格選項將行選取狀態提升到自己的作用域。然後透過 `state` 表格選項將行選取狀態傳回表格實例。

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({}) //自行管理行選取狀態

const table = useReactTable({
  //...
  onRowSelectionChange: setRowSelection, //將行選取狀態提升到自己的作用域
  state: {
    rowSelection, //將行選取狀態傳回表格實例
  },
})
```

### 實用的行 ID

預設情況下，每行的 ID 僅為 `row.index`。如果你使用行選取功能，很可能會希望使用更有用的行識別符，因為行選取狀態是以行 ID 為鍵。你可以使用 `getRowId` 表格選項指定一個函式，為每行回傳唯一的行 ID。

```ts
const table = useReactTable({
  //...
  getRowId: row => row.uuid, //使用資料庫中的行 uuid 作為行 ID
})
```

現在，當行被選取時，行選取狀態會如下所示：

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

而不是這樣：

```json
{
  "0": true,
  "1": false
  //...
}
```

### 條件式啟用行選取

預設情況下，所有行都啟用行選取。若要為特定行條件式啟用行選取，或為所有行禁用行選取，你可以使用 `enableRowSelection` 表格選項，它接受布林值或函式以進行更細粒度的控制。

```ts
const table = useReactTable({
  //...
  enableRowSelection: row => row.original.age > 18, //僅為成年人啟用行選取
})
```

要在 UI 中強制執行行是否可選取，你可以使用 `row.getCanSelect()` API 來檢查核取方塊或其他選取 UI。

### 單行選取

預設情況下，表格允許多行同時選取。但如果只想允許一次選取單行，可以將 `enableMultiRowSelection` 表格選項設為 `false` 以禁用多行選取，或傳入函式以條件式禁用行的子行多行選取。

這對於製作具有單選按鈕而非核取方塊的表格很有用。

```ts
const table = useReactTable({
  //...
  enableMultiRowSelection: false, //僅允許一次選取單行
  // enableMultiRowSelection: row => row.original.age > 18, //僅為成年人允許一次選取單行
})
```

### 子行選取

預設情況下，選取父行會選取其所有子行。如果你想禁用自動子行選取，可以將 `enableSubRowSelection` 表格選項設為 `false` 以禁子行選取，或傳入函式以條件式禁用行的子行選取。

```ts
const table = useReactTable({
  //...
  enableSubRowSelection: false, //禁子行選取
  // enableSubRowSelection: row => row.original.age > 18, //為成年人禁子行選取
})
```

### 渲染行選取 UI

TanStack Table 不規定你應如何渲染行選取 UI。你可以使用核取方塊、單選按鈕，或簡單地將點擊事件綁定到行本身。表格實例提供了一些 API 來幫助你渲染行選取 UI。

#### 將行選取 API 連接到核取方塊輸入

TanStack Table 提供了一些處理函式，你可以直接將其連接到核取方塊輸入，以便輕鬆切換行選取。這些函式會自動呼叫其他內部 API 來更新行選取狀態並重新渲染表格。

使用 `row.getToggleSelectedHandler()` API 連接到核取方塊輸入以切換行的選取狀態。

使用 `table.getToggleAllRowsSelectedHandler()` 或 `table.getToggleAllPageRowsSelectedHandler` API 連接到「全選」核取方塊輸入以切換所有行的選取狀態。

如果需要對這些處理函式進行更細粒度的控制，你可以直接使用 `row.toggleSelected()` 或 `table.toggleAllRowsSelected()` API。甚至可以直接呼叫 `table.setRowSelection()` API 來直接設定行選取狀態，就像使用任何其他狀態更新器一樣。這些處理函式僅為便利性而提供。

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
  //... 更多欄位定義...
]
```

#### 將行選取 API 連接到 UI

如果你想要更簡單的行選取 UI，可以將點擊事件綁定到行本身。`row.getToggleSelectedHandler()` API 也適用於此情境。

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
