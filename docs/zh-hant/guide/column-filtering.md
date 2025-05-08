---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:28.651Z'
title: 欄位過濾
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [欄位過濾](../framework/react/examples/filters)
- [多面過濾](../framework/react/examples/filters-faceted) (自動完成與範圍過濾)
- [模糊搜尋](../framework/react/examples/filters-fuzzy) (Match Sorter)
- [可編輯資料](../framework/react/examples/editable-data)
- [展開功能](../framework/react/examples/expanding) (從子列過濾)
- [群組功能](../framework/react/examples/grouping)
- [分頁功能](../framework/react/examples/pagination)
- [列選取](../framework/react/examples/row-selection)

## API

[欄位過濾 API](../api/features/column-filtering)

## 欄位過濾指南

過濾功能分為兩種：欄位過濾 (Column Filtering) 與全域過濾 (Global Filtering)。

本指南將專注於欄位過濾，這是針對單一欄位存取值 (accessor value) 所應用的過濾方式。

TanStack Table 同時支援客戶端 (client-side) 與手動伺服器端 (manual server-side) 過濾。本指南將說明如何實作與自訂這兩種方式，並協助您決定哪種最適合您的使用情境。

### 客戶端 vs 伺服器端過濾

如果您有大型資料集，可能不希望將所有資料載入客戶端瀏覽器進行過濾。在這種情況下，您很可能需要實作伺服器端過濾、排序、分頁等功能。

然而，如同在[分頁指南](../guide/pagination#should-you-use-client-side-pagination)中討論的，許多開發者低估了客戶端能處理的資料量而不影響效能。TanStack Table 的範例經常測試處理高達 100,000 列或更多資料時，客戶端過濾、排序、分頁和群組仍能保持良好效能。這並不意味著您的應用一定能處理這麼多資料，但如果您的表格最多只有幾千列，您或許可以利用 TanStack Table 提供的客戶端過濾、排序、分頁和群組功能。

> TanStack Table 能以良好效能處理數千列的客戶端資料。在未經思考前，不要直接排除客戶端過濾、分頁、排序等功能。

每個使用情境都不同，取決於表格的複雜度、欄位數量、每筆資料的大小等因素。主要需注意的效能瓶頸有：

1. 您的伺服器能否在合理時間（與成本）內查詢所有資料？
2. 獲取的資料總大小是多少？（如果欄位不多，可能不會像您想的那麼糟。）
3. 如果一次性載入所有資料，客戶端瀏覽器是否會使用過多記憶體？

如果不確定，您可以先從客戶端過濾和分頁開始，待資料增長後再切換到伺服器端策略。

### 手動伺服器端過濾

如果您決定需要實作伺服器端過濾而非使用內建的客戶端過濾，以下是實作方式。

手動伺服器端過濾不需要 `getFilteredRowModel` 表格選項。相反地，傳遞給表格的 `data` 應該已經過濾完成。不過，如果您已傳遞 `getFilteredRowModel` 表格選項，可以透過將 `manualFiltering` 選項設為 `true` 來跳過它。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  // getFilteredRowModel: getFilteredRowModel(), // 手動伺服器端過濾不需要此選項
  manualFiltering: true,
})
```

> **注意：** 使用手動過濾時，本指南後續討論的許多選項將無效。當 `manualFiltering` 設為 `true` 時，表格實例不會對傳入的列應用任何過濾邏輯，而是假設列已過濾完成，並直接使用您傳入的 `data`。

### 客戶端過濾

如果您使用內建的客戶端過濾功能，首先需要在表格選項中傳入 `getFilteredRowModel` 函式。每當表格需要過濾資料時，都會呼叫此函式。您可以從 TanStack Table 匯入預設的 `getFilteredRowModel` 函式，或自行建立。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客戶端過濾需要此選項
})
```

### 欄位過濾狀態

無論您使用客戶端或伺服器端過濾，都可以利用 TanStack Table 提供的內建欄位過濾狀態管理功能。有許多表格和欄位 API 可用於變更和互動過濾狀態，以及獲取欄位過濾狀態。

欄位過濾狀態定義為具有以下結構的物件陣列：

```ts
interface ColumnFilter {
  id: string
  value: unknown
}
type ColumnFiltersState = ColumnFilter[]
```

由於欄位過濾狀態是物件陣列，您可以同時應用多個欄位過濾。

#### 存取欄位過濾狀態

您可以像其他表格狀態一樣，透過 `table.getState()` API 從表格實例存取欄位過濾狀態。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().columnFilters) // 從表格實例存取欄位過濾狀態
```

不過，如果您需要在表格初始化前存取欄位過濾狀態，可以像下方所示「控制」欄位過濾狀態。

### 受控欄位過濾狀態

如果需要輕鬆存取欄位過濾狀態，您可以使用 `state.columnFilters` 和 `onColumnFiltersChange` 表格選項，在自己的狀態管理中控制/管理欄位過濾狀態。

```tsx
const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]) // 可在此設定初始欄位過濾狀態
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    columnFilters,
  },
  onColumnFiltersChange: setColumnFilters,
})
```

#### 初始欄位過濾狀態

如果不需要在自己的狀態管理或作用域中控制欄位過濾狀態，但仍想設定初始欄位過濾狀態，可以使用 `initialState` 表格選項而非 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    columnFilters: [
      {
        id: 'name',
        value: 'John', // 預設以 'John' 過濾名稱欄位
      },
    ],
  },
})
```

> **注意**：請勿同時使用 `initialState.columnFilters` 和 `state.columnFilters`，因為 `state.columnFilters` 中的初始化狀態會覆蓋 `initialState.columnFilters`。

### 過濾函式 (FilterFns)

每個欄位都可以有自己的獨特過濾邏輯。您可以選擇 TanStack Table 提供的任何過濾函式，或建立自己的。

預設有 10 種內建過濾函式可供選擇：

- `includesString` - 不區分大小寫的字串包含
- `includesStringSensitive` - 區分大小寫的字串包含
- `equalsString` - 不區分大小寫的字串相等
- `equalsStringSensitive` - 區分大小寫的字串相等
- `arrIncludes` - 陣列中的項目包含
- `arrIncludesAll` - 陣列中包含所有項目
- `arrIncludesSome` - 陣列中包含部分項目
- `equals` - 物件/參考相等 `Object.is`/`===`
- `weakEquals` - 弱物件/參考相等 `==`
- `inNumberRange` - 數字範圍包含

您也可以透過 `filterFn` 欄位選項或 `filterFns` 表格選項定義自訂過濾函式。

#### 自訂過濾函式

> **注意**：這些過濾函式僅在客戶端過濾時執行。

在 `filterFn` 欄位選項或 `filterFns` 表格選項中定義自訂過濾函式時，應具有以下簽名：

```ts
const myCustomFilterFn: FilterFn = (row: Row, columnId: string, filterValue: any, addMeta: (meta: any) => void) => boolean
```

每個過濾函式會接收：

- 要過濾的列
- 用於獲取列值的欄位 ID
- 過濾值

並應返回 `true` 表示該列應包含在過濾結果中，`false` 則表示應移除。

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    filterFn: 'includesString', // 使用內建過濾函式
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    filterFn: 'inNumberRange',
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    filterFn: 'myCustomFilterFn', // 使用自訂全域過濾函式
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // 直接使用自訂過濾函式
    filterFn: (row, columnId, filterValue) => {
      return // 根據自訂邏輯返回 true 或 false
    },
  }
]
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  filterFns: { // 新增自訂全域過濾函式
    myCustomFilterFn: (row, columnId, filterValue) => { // 在此內聯定義
      return // 根據自訂邏輯返回 true 或 false
    },
    startsWith: startsWithFilterFn, // 在其他地方定義
  },
})
```

##### 自訂過濾函式行為

您可以為過濾函式附加一些其他屬性來自訂其行為：

- `filterFn.resolveFilterValue` - 此選用「掛載」方法允許過濾函式在傳遞給過濾函式前，轉換/清理/格式化過濾值。

- `filterFn.autoRemove` - 此選用「掛載」方法會接收過濾值，並預期返回 `true` 表示該過濾值應從過濾狀態中移除。例如，某些布林型過濾可能希望在過濾值設為 `false` 時，將其從表格狀態中移除。

```tsx
const startsWithFilterFn = <TData extends MRT_RowData>(
  row: Row<TData>,
  columnId: string,
  filterValue: number | string, //resolveFilterValue 會將其轉換為字串
) =>
  row
    .getValue<number | string>(columnId)
    .toString()
    .toLowerCase()
    .trim()
    .startsWith(filterValue); // 在 `resolveFilterValue` 中對過濾值進行 toString、toLowerCase 和 trim 處理

// 如果過濾值為假值（此例為空字串），則從過濾狀態中移除
startsWithFilterFn.autoRemove = (val: any) => !val; 

// 在傳遞給過濾函式前，轉換/清理/格式化過濾值
startsWithFilterFn.resolveFilterValue = (val: any) => val.toString().toLowerCase().trim(); 
```

### 自訂欄位過濾

有許多表格和欄位選項可用於進一步自訂欄位過濾行為。

#### 停用欄位過濾

預設情況下，所有欄位都啟用欄位過濾。您可以使用 `enableColumnFilters` 表格選項或 `enableColumnFilter` 欄位選項來停用所有欄位或特定欄位的過濾功能。也可以透過將 `enableFilters` 表格選項設為 `false` 來同時關閉欄位和全域過濾。

停用欄位過濾會導致該欄位的 `column.getCanFilter` API 返回 `false`。

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableColumnFilter: false, // 停用此欄位的過濾功能
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableColumnFilters: false, // 停用所有欄位的過濾功能
})
```

#### 過濾子列 (展開功能)

在使用展開、群組和聚合等功能時，有幾個額外的表格選項可自訂欄位過濾行為。

##### 從葉子列過濾

預設情況下，過濾是從父列向下進行的，因此如果父列被過濾掉，其所有子列也會被過濾掉。根據您的使用情境，如果只希望使用者搜尋頂層列而非子列，這可能是理想行為。這也是效能最佳的選項。

然而，如果您希望允許過濾和搜尋子列，無論父列是否被過濾掉，可以將 `filterFromLeafRows` 表格選項設為 `true`。設為 `true` 會使過濾從葉子列向上進行，這意味著只要有一個子列或孫子列被包含，父列也會被包含。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 過濾和搜尋子列
})
```

##### 最大葉子列過濾深度

預設情況下，過濾會套用至樹中的所有列，無論它們是根層級的父列還是父列的子葉子列。將 `maxLeafRowFilterDepth` 表格選項設為 `0` 會使過濾僅套用至根層級的父列，所有子列保持未過濾狀態。類似地，設為 `1` 會使過濾僅套用至一層深的子葉子列，依此類推。

如果您希望在父列通過過濾時保留其子列不被過濾掉，請使用 `maxLeafRowFilterDepth: 0`。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  maxLeafRowFilterDepth: 0, // 僅過濾根層級的父列
})
```

### 欄位過濾 API

有許多欄位和表格 API 可用於與欄位過濾狀態互動並連結至您的 UI 元件。以下是可用 API 及其最常見用途的清單：

- `table.setColumnFilters` - 以新狀態覆寫整個欄位過濾狀態。
- `table.resetColumnFilters` - 適用於「清除所有/重設過濾」按鈕。

- **`column.getFilterValue`** - 適用於獲取輸入的預設初始過濾值，或直接提供過濾值給過濾輸入。
- **`column.setFilterValue`** - 適用於將過濾輸入連結至其 `onChange` 或 `onBlur` 處理器。

- `column.getCanFilter` - 適用於停用/啟用過濾輸入。
- `column.getIsFiltered` - 適用於顯示欄位目前正在過濾的視覺指示器。
- `column.getFilterIndex` - 適用於顯示目前過濾應用的順序。

- `column.getAutoFilterFn` - 內部用於在未指定時尋找欄位的預設過濾函式。
- `column.getFilterFn` - 適用於顯示目前使用的過濾模式或函式。
