---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:22.082Z'
title: 全域過濾
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [全域篩選](../framework/react/examples/filters-global)

## API

[全域篩選 API](../api/features/global-filtering)

## 全域篩選指南

篩選功能分為兩種：欄位篩選 (Column Filtering) 與全域篩選 (Global Filtering)。

本指南將重點介紹全域篩選，這是套用至所有欄位的篩選方式。

### 客戶端篩選 vs 伺服器端篩選

若您有大型資料集，可能不希望將所有資料載入客戶端瀏覽器進行篩選。在這種情況下，您很可能需要實作伺服器端篩選、排序、分頁等功能。

然而，如 [分頁指南](../guide/pagination#should-you-use-client-side-pagination) 中所述，許多開發者低估了客戶端能處理的資料量而不影響效能。TanStack Table 的範例通常測試可處理高達 100,000 列或更多資料，並在客戶端篩選、排序、分頁和分組時保持良好效能。這不代表您的應用程式一定能處理這麼多資料列，但如果您的表格最多只有幾千列，或許可以利用 TanStack Table 提供的客戶端篩選、排序、分頁和分組功能。

> TanStack Table 能高效處理數千列的客戶端資料。在未經思考前，請勿直接排除客戶端篩選、分頁、排序等功能。

每個使用情境不同，取決於表格的複雜度、欄位數量、資料大小等因素。需注意的主要瓶頸包括：

1. 您的伺服器能否在合理時間（和成本）內查詢所有資料？
2. 獲取的資料總大小為何？（若欄位不多，實際影響可能不如想像嚴重。）
3. 若一次性載入所有資料，客戶端瀏覽器是否會使用過多記憶體？

若不確定，可以先從客戶端篩選和分頁開始，待資料增長後再切換至伺服器端策略。

### 手動伺服器端全域篩選

若您決定實作伺服器端全域篩選而非使用內建的客戶端全域篩選，以下是實作方式。

手動伺服器端全域篩選不需要 `getFilteredRowModel` 表格選項。相反地，傳遞給表格的 `data` 應已篩選完成。但若您已設定 `getFilteredRowModel` 選項，可透過將 `manualFiltering` 設為 `true` 來跳過此選項。

```jsx
const table = useReactTable({
  data,
  columns,
  // getFilteredRowModel: getFilteredRowModel(), // 手動伺服器端全域篩選不需要此選項
  manualFiltering: true,
})
```

注意：使用手動全域篩選時，本指南後續討論的許多選項將無效。當 `manualFiltering` 設為 `true` 時，表格實例不會對傳入的資料列套用任何全域篩選邏輯，而是假設資料列已篩選完成並直接使用傳入的資料。

### 客戶端全域篩選

若使用內建的客戶端全域篩選，首先需在表格選項中傳入 `getFilteredRowModel` 函式。

```jsx
import { useReactTable, getFilteredRowModel } from '@tanstack/react-table'
//...
const table = useReactTable({
  // 其他選項...
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(), // 客戶端全域篩選需要此選項
})
```

### 全域篩選函式

`globalFilterFn` 選項可讓您指定用於全域篩選的篩選函式。篩選函式可以是內建篩選函式的名稱字串、透過 `tableOptions.filterFns` 提供的自訂篩選函式名稱字串，或直接傳入自訂篩選函式。

```jsx
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  globalFilterFn: 'text' // 內建篩選函式
})
```

預設提供 10 種內建篩選函式：

- includesString - 不區分大小寫的字串包含
- includesStringSensitive - 區分大小寫的字串包含
- equalsString - 不區分大小寫的字串相等
- equalsStringSensitive - 區分大小寫的字串相等
- arrIncludes - 陣列項目包含
- arrIncludesAll - 陣列包含所有項目
- arrIncludesSome - 陣列包含部分項目
- equals - 物件/參照相等 Object.is/===
- weakEquals - 弱型別物件/參照相等 ==
- inNumberRange - 數字範圍包含

您也可以直接定義自訂篩選函式並傳入 `globalFilterFn` 選項。

### 全域篩選狀態

全域篩選狀態儲存於表格的內部狀態中，可透過 `table.getState().globalFilter` 存取。若需在表格外部持久化全域篩選狀態，可使用 `onGlobalFilterChange` 選項提供回呼函式，在狀態變更時呼叫。

```jsx
const [globalFilter, setGlobalFilter] = useState<any>([])

const table = useReactTable({
  // 其他選項...
  state: {
    globalFilter,
  },
  onGlobalFilterChange: setGlobalFilter
})
```

全域篩選狀態的結構如下：

```jsx
interface GlobalFilter {
  globalFilter: any
}
```

### 在 UI 中加入全域篩選輸入框

TanStack Table 不會自動加入全域篩選輸入框至您的表格。您需手動在 UI 中加入，讓使用者能篩選表格。例如，可在表格上方加入輸入框讓使用者輸入搜尋詞。

```jsx
return (
  <div>
    <input
      value=""
      onChange={e => table.setGlobalFilter(String(e.target.value))}
      placeholder="搜尋..."
    />
  </div>
)
```

### 自訂全域篩選函式

若需使用自訂全域篩選函式，可定義函式並傳入 `globalFilterFn` 選項。

> **注意：** 常有人使用模糊篩選函式進行全域篩選。相關討論請見 [模糊篩選指南](./fuzzy-filtering.md)。

```jsx
const customFilterFn = (rows, columnId, filterValue) => {
  // 自訂篩選邏輯
}

const table = useReactTable({
  // 其他選項...
  globalFilterFn: customFilterFn
})
```

### 初始全域篩選狀態

若需在表格初始化時設定初始全域篩選狀態，可透過 `initialState` 選項傳入。

但您也可以直接在 `state.globalFilter` 選項中指定初始狀態。

```jsx
const [globalFilter, setGlobalFilter] = useState("搜尋詞") //建議在此初始化 globalFilter 狀態

const table = useReactTable({
  // 其他選項...
  initialState: {
    globalFilter: '搜尋詞', // 若未管理 globalFilter 狀態，在此設定初始狀態
  }
  state: {
    globalFilter, // 將管理的 globalFilter 狀態傳遞給表格
  }
})
```

> 注意：請勿同時使用 `initialState.globalFilter` 和 `state.globalFilter`，因為 `state.globalFilter` 的初始狀態會覆蓋 `initialState.globalFilter`。

### 停用全域篩選

預設情況下，所有欄位都啟用全域篩選。您可透過 `enableGlobalFilter` 表格選項停用所有欄位的全域篩選功能。也可透過將 `enableFilters` 表格選項設為 `false` 來同時停用欄位和全域篩選。

停用全域篩選後，`column.getCanGlobalFilter` API 將對該欄位回傳 `false`。

```jsx
const columns = [
  {
    header: () => 'Id',
    accessorKey: 'id',
    enableGlobalFilter: false, // 停用此欄位的全域篩選
  },
  //...
]
//...
const table = useReactTable({
  // 其他選項...
  columns,
  enableGlobalFilter: false, // 停用所有欄位的全域篩選
})
```
