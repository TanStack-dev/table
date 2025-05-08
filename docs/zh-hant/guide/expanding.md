---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:52.079Z'
title: 展開
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [展開功能](../framework/react/examples/expanding)
- [分組功能](../framework/react/examples/grouping)
- [子元件](../framework/react/examples/sub-components)

## API

[展開功能 API](../api/features/expanding)

## 展開功能指南

展開功能允許你顯示或隱藏與特定資料列相關的額外資料列。這在以下情境特別有用：當你擁有階層式資料時，可以讓使用者從上層資料向下鑽研；或是當你需要顯示與某列相關的額外資訊時。

### 展開功能的不同應用場景

TanStack Table 的展開功能有以下幾種常見應用場景：

1. 展開子列（子資料列、彙總列等）
2. 展開自訂 UI（詳細面板、子表格等）

### 啟用客戶端展開功能

要使用客戶端展開功能，你需要在表格選項中定義 `getExpandedRowModel` 函式。這個函式負責回傳展開後的資料列模型。

```ts
const table = useReactTable({
  // 其他選項...
  getExpandedRowModel: getExpandedRowModel(),
})
```

展開的資料可以包含表格列或任何你想顯示的資料。本指南將討論如何處理這兩種情況。

### 將表格列作為展開資料

展開列本質上是繼承父列相同欄位結構的子列。如果你的資料物件已包含這些展開列資料，可以使用 `getSubRows` 函式來指定這些子列。如果資料物件不包含展開列資料，則可將其視為自訂展開資料（將在下一節討論）。

例如，如果你有以下資料物件：

```ts
type Person = {
  id: number
  name: string
  age: number
  children?: Person[] | undefined
}

const data: Person[] =  [
  { id: 1, 
  name: 'John', 
  age: 30, 
  children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 }
    ] 
  },
  { id: 3,
   name: 'Doe', 
   age: 40, 
    children: [
      { id: 4, name: 'Alice', age: 10 }
    ] 
  },
]
```

你可以使用 `getSubRows` 函式將每列的 `children` 陣列作為展開列回傳。表格實例現在會知道在每列中哪裡可以找到子列。

```ts
const table = useReactTable({
  // 其他選項...
  getSubRows: (row) => row.children, // 將 children 陣列作為子列回傳
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

> **注意：** 你可以使用複雜的 `getSubRows` 函式，但請注意它會對每列和每個子列執行。如果函式未優化，可能會影響效能。不支援非同步函式。

### 自訂展開 UI

在某些情況下，你可能希望顯示額外細節或資訊（這些資訊可能是或不是表格資料物件的一部分），例如列的展開資料。這類展開列 UI 多年來有許多名稱，包括「可展開列」、「詳細面板」、「子元件」等。

預設情況下，`row.getCanExpand()` 列實例 API 會回傳 false，除非它在列上找到 `subRows`。你可以透過在表格實例選項中實作自己的 `getRowCanExpand` 函式來覆寫此行為。

```ts
//...
const table = useReactTable({
  // 其他選項...
  getRowCanExpand: (row) => true, // 新增你的邏輯來決定列是否可以展開。true 表示所有列都包含展開資料
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
     {/* 正常列 UI */}
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {/* 如果列已展開，將展開的 UI 渲染為一個單獨的列，其單一儲存格橫跨表格的寬度 */}
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // 如果展開資料不是與父列共享相同欄位的列，則指定要橫跨的欄位數
            // 你的自訂 UI 放在這裡
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### 展開列狀態

如果需要控制表格中列的展開狀態，可以使用 `expanded` 狀態和 `onExpandedChange` 選項來實現。這允許你根據需求管理展開狀態。

```ts
const [expanded, setExpanded] = useState<ExpandedState>({})

const table = useReactTable({
  // 其他選項...
  state: {
    expanded: expanded, // 必須將展開狀態傳回表格
  },
  onExpandedChange: setExpanded
})
```

`ExpandedState` 類型定義如下：

```ts
type ExpandedState = true | Record<string, boolean>
```

如果 `ExpandedState` 為 true，表示所有列都已展開。如果是記錄（record），則只有 ID 作為鍵且值設為 true 的列會被展開。例如，如果展開狀態為 `{ row1: true, row2: false }`，表示 ID 為 row1 的列已展開，而 row2 的列未展開。表格使用此狀態來決定哪些列應展開並顯示其子列（如果有的話）。

### 展開列的 UI 切換處理器

TanStack Table 不會為你的表格新增展開資料的切換處理器 UI。你應該手動在每列的 UI 中新增它，以允許使用者展開和摺疊列。例如，你可以在欄位定義中新增按鈕 UI。

```ts
const columns = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'age',
    header: 'Age',
  },
  {
    header: 'Children',
    cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
    },
  },
]
```

### 篩選展開列

預設情況下，篩選過程從父列開始並向下移動。這意味著如果父列被篩選排除，其所有子列也會被排除。但是，你可以透過使用 `filterFromLeafRows` 選項來改變此行為。啟用此選項後，篩選過程從葉（子）列開始並向上移動。這確保只要至少一個子列或孫列符合篩選條件，父列就會包含在篩選結果中。此外，你可以使用 `maxLeafRowFilterDepth` 選項控制篩選過程深入子階層的程度。此選項允許你指定篩選應考慮的子列最大深度。

```ts
//...
const table = useReactTable({
  // 其他選項...
  getSubRows: row => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 搜尋展開列
  maxLeafRowFilterDepth: 1, // 限制搜尋的展開列深度
})
```

### 分頁展開列

預設情況下，展開列會與表格的其他部分一起分頁（這意味著展開列可能會跨越多個頁面）。如果你想禁用此行為（這意味著展開列將始終在其父列的頁面上渲染。這也表示會渲染比設定的頁面大小更多的列），可以使用 `paginateExpandedRows` 選項。

```ts
const table = useReactTable({
  // 其他選項...
  paginateExpandedRows: false,
})
```

### 固定展開列

固定展開列的方式與固定普通列相同。你可以將展開列固定在表格的頂部或底部。有關列固定的更多資訊，請參閱[固定指南](./pinning.md)。

### 排序展開列

預設情況下，展開列會與表格的其他部分一起排序。

### 手動展開（伺服器端）

如果你正在進行伺服器端展開，可以透過將 `manualExpanding` 選項設為 true 來啟用手動列展開。這意味著 `getExpandedRowModel` 不會用於展開列，你需要在自己的資料模型中執行展開操作。

```ts
const table = useReactTable({
  // 其他選項...
  manualExpanding: true,
})
```
