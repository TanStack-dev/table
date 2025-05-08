---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:46.699Z'
title: 排序
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [排序](../framework/react/examples/sorting)
- [篩選器](../framework/react/examples/filters)

## API

[排序 API](../api/features/sorting)

## 排序指南

TanStack Table 提供了適用於各種排序需求的解決方案。本指南將帶您了解各種選項，用於自訂內建的客戶端排序功能，以及如何選擇不使用客戶端排序，改用手動的伺服器端排序。

### 排序狀態

排序狀態定義為一個物件陣列，結構如下：

```tsx
type ColumnSort = {
  id: string
  desc: boolean
}
type SortingState = ColumnSort[]
```

由於排序狀態是一個陣列，因此可以同時對多個欄位進行排序。更多關於多重排序的自訂選項請參閱[下方](#multi-sorting)。

#### 存取排序狀態

您可以直接從表格實例中存取排序狀態，就像使用 `table.getState()` API 存取其他狀態一樣。

```tsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState().sorting) // 從表格實例中存取排序狀態
```

然而，如果您需要在表格初始化之前存取排序狀態，可以像下方所示「控制」排序狀態。

#### 受控排序狀態

如果您需要輕鬆存取排序狀態，可以使用 `state.sorting` 和 `onSortingChange` 表格選項，在您自己的狀態管理中控制/管理排序狀態。

```tsx
const [sorting, setSorting] = useState<SortingState>([]) // 可以在這裡設定初始排序狀態
//...
// 使用排序狀態從伺服器獲取資料或其他操作...
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

#### 初始排序狀態

如果您不需要在自己的狀態管理或作用域中控制排序狀態，但仍想設定初始排序狀態，可以使用 `initialState` 表格選項，而不是 `state`。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
  initialState: {
    sorting: [
      {
        id: 'name',
        desc: true, // 預設按名稱降序排序
      },
    ],
  },
})
```

> **注意**：請勿同時使用 `initialState.sorting` 和 `state.sorting`，因為 `state.sorting` 中的初始化狀態會覆蓋 `initialState.sorting`。

### 客戶端 vs 伺服器端排序

是否應該使用客戶端或伺服器端排序，完全取決於您是否同時使用客戶端或伺服器端分頁或篩選。請保持一致，因為在伺服器端分頁或篩選的情況下使用客戶端排序，只會對當前載入的資料進行排序，而不是整個資料集。

### 手動伺服器端排序

如果您計劃僅在後端邏輯中使用自己的伺服器端排序，則不需要提供排序行模型。但如果您已提供排序行模型，卻想停用它，可以使用 `manualSorting` 表格選項。

```jsx
const [sorting, setSorting] = useState<SortingState>([])
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  //getSortedRowModel: getSortedRowModel(), //手動排序不需要此選項
  manualSorting: true, //使用預先排序的行模型，而非排序行模型
  state: {
    sorting,
  },
  onSortingChange: setSorting,
})
```

> **注意**：當 `manualSorting` 設為 `true` 時，表格會假設您提供的資料已經排序，不會對其進行任何排序操作。

### 客戶端排序

要實現客戶端排序，首先需要向表格提供排序行模型。您可以從 TanStack Table 導入 `getSortedRowModel` 函數，它將用於將您的行轉換為已排序的行。

```jsx
import { useReactTable } from '@tanstack/react-table'
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), //提供排序行模型
})
```

### 排序函數

所有欄位的預設排序函數是根據欄位的資料類型推斷的。然而，為特定欄位定義確切的排序函數可能會很有用，尤其是當您的資料包含可為空的值或非標準資料類型時。

您可以使用 `sortingFn` 欄位選項，在每個欄位的基礎上確定自訂排序函數。

預設情況下，有 6 種內建排序函數可供選擇：

- `alphanumeric` - 不區分大小寫地按混合字母數字值排序。速度較慢，但如果您的字串包含需要自然排序的數字，則更準確。
- `alphanumericCaseSensitive` - 區分大小寫地按混合字母數字值排序。速度較慢，但如果您的字串包含需要自然排序的數字，則更準確。
- `text` - 不區分大小寫地按文字/字串值排序。速度較快，但如果您的字串包含需要自然排序的數字，則準確性較低。
- `textCaseSensitive` - 區分大小寫地按文字/字串值排序。速度較快，但如果您的字串包含需要自然排序的數字，則準確性較低。
- `datetime` - 按時間排序，如果您的值是 `Date` 物件，請使用此選項。
- `basic` - 使用基本的/標準的 `a > b ? 1 : a < b ? -1 : 0` 比較進行排序。這是最快的排序函數，但可能不是最準確的。

您也可以將自訂排序函數定義為 `sortingFn` 欄位選項，或作為全域排序函數使用 `sortingFns` 表格選項。

#### 自訂排序函數

在 `sortingFns` 表格選項或 `sortingFn` 欄位選項中定義自訂排序函數時，應具有以下簽名：

```tsx
//可選地使用 SortingFn 來推斷參數類型
const myCustomSortingFn: SortingFn<TData> = (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
  return //-1、0 或 1 - 使用 rowA.original 和 rowB.original 存取任何行資料
}
```

> 注意：比較函數不需要考慮欄位是降序還是升序。行模型會處理該邏輯。`sortingFn` 函數只需提供一致的比較。

每個排序函數接收 2 行和一個欄位 ID，並預期使用欄位 ID 比較這兩行，以返回 `-1`、`0` 或 `1` 的升序結果。以下是速查表：

| 返回值 | 升序順序 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortingFn: 'alphanumeric', // 按名稱使用內建排序函數
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortingFn: 'myCustomSortingFn', // 使用自訂全域排序函數
  },
  {
    header: () => 'Birthday',
    accessorKey: 'birthday',
    sortingFn: 'datetime', // 推薦用於日期欄位
  },
  {
    header: () => 'Profile',
    accessorKey: 'profile',
    // 直接使用自訂排序函數
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
  sortingFns: { //新增自訂排序函數
    myCustomSortingFn: (rowA, rowB, columnId) => {
      return rowA.original[columnId] > rowB.original[columnId] ? 1 : rowA.original[columnId] < rowB.original[columnId] ? -1 : 0
    },
  },
})
```

### 自訂排序

有許多表格和欄位選項可用於進一步自訂排序的使用者體驗和行為。

#### 停用排序

您可以使用 `enableSorting` 欄位選項或表格選項，停用特定欄位或整個表格的排序功能。

```jsx
const columns = [
  {
    header: () => 'ID',
    accessorKey: 'id',
    enableSorting: false, // 停用此欄位的排序
  },
  {
    header: () => 'Name',
    accessorKey: 'name',
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableSorting: false, // 停用整個表格的排序
})
```

#### 排序方向

預設情況下，使用 `toggleSorting` API 循環切換欄位排序時，第一個排序方向對於字串欄位是升序，對於數字欄位是降序。您可以使用 `sortDescFirst` 欄位選項或表格選項更改此行為。

```jsx
const columns = [
  {
    header: () => 'Name',
    accessorKey: 'name',
    sortDescFirst: true, // 名稱欄位預設按降序排序（字串欄位預設為升序）
  },
  {
    header: () => 'Age',
    accessorKey: 'age',
    sortDescFirst: false, // 年齡欄位預設按升序排序（數字欄位預設為降序）
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  sortDescFirst: true, // 所有欄位預設按降序排序（字串欄位預設為升序，數字欄位預設為降序）
})
```

> **注意**：對於包含可空值的欄位，您可能需要明確設定 `sortDescFirst` 欄位選項。如果欄位包含可空值，表格可能無法正確判斷該欄位是數字還是字串。

#### 反轉排序

反轉排序與更改預設排序方向不同。如果欄位的 `invertSorting` 選項設為 `true`，則「降序/升序」排序狀態仍會正常循環，但實際的行排序會被反轉。這對於具有反向最佳/最差比例的值很有用，例如排名（第1、第2、第3）或類似高爾夫的計分。

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    invertSorting: true, // 反轉此欄位的排序。即使應用「降序」排序，也會是 1st -> 2nd -> 3rd -> ...
  },
  //...
]
```

#### 排序未定義值

任何未定義的值將根據 `sortUndefined` 欄位選項或表格選項，排序到列表的開頭或結尾。您可以根據具體使用情況自訂此行為。

如果未指定，`sortUndefined` 的預設值為 `1`，未定義的值將以較低優先級排序（降序），如果是升序，未定義的值將出現在列表的末尾。

- `'first'` - 未定義的值將被推到列表的開頭
- `'last'` - 未定義的值將被推到列表的末尾
- `false` - 未定義的值將被視為相等，並需要由下一個欄位篩選器或原始索引排序（視情況而定）
- `-1` - 未定義的值將以較高優先級排序（升序）（如果是升序，未定義的值將出現在列表的開頭）
- `1` - 未定義的值將以較低優先級排序（降序）（如果是升序，未定義的值將出現在列表的末尾）

> 注意：`'first'` 和 `'last'` 選項在 v8.16.0 中新增

```jsx
const columns = [
  {
    header: () => 'Rank',
    accessorKey: 'rank',
    sortUndefined: -1, // 'first' | 'last' | 1 | -1 | false
  },
]
```

#### 排序移除

預設情況下，循環切換欄位排序狀態時，移除排序的功能是啟用的。您可以使用 `enableSortingRemoval` 表格選項停用此行為。此行為在您希望確保至少有一個欄位始終排序時很有用。

使用 `getToggleSortingHandler` 或 `toggleSorting` API 時的預設行為如下：

`'none' -> 'desc' -> 'asc' -> 'none' -> 'desc' -> 'asc' -> ...`

如果停用排序移除，行為將如下：

`'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...`

一旦欄位排序且 `enableSortingRemoval` 設為 `false`，切換該欄位的排序將永遠不會移除排序。然而，如果使用者對另一個欄位進行排序且該事件不是多重排序事件，則排序將從先前的欄位移除，僅應用於新欄位。

> 如果您希望確保至少有一個欄位始終排序，請將 `enableSortingRemoval` 設為 `false`。

```jsx
const table = useReactTable({
  columns,
  data,
  enableSortingRemoval: false, // 停用移除欄位排序的功能（始終為 none -> asc -> desc -> asc）
})
```

#### 多重排序

如果使用 `column.getToggleSortingHandler` API，預設情況下啟用同時對多個欄位進行排序。如果使用者在點擊欄位標題時按住 `Shift` 鍵，表格將對該欄位以及已排序的欄位進行排序。如果您使用 `column.toggleSorting` API，則需要手動傳遞是否使用多重排序。（`column.toggleSorting(desc, multi)`）。

##### 停用多重排序

您可以使用 `enableMultiSort` 欄位選項或表格選項，停用特定欄位或整個表格的多重排序功能。停用特定欄位的多重排序將用新欄位的排序替換所有現有排序。

```jsx
const columns = [
  {
    header: () => 'Created At',
    accessorKey: 'createdAt',
    enableMultiSort: false, // 排序此欄位時，始終僅按此欄位排序
  },
  //...
]
//...
const table = useReactTable({
  columns,
  data,
  enableMultiSort: false, // 停用整個表格的多重排序
})
```

##### 自訂多重排序觸發器

預設情況下，使用 `Shift` 鍵觸發多重排序。您可以使用 `isMultiSortEvent` 表格選項更改此行為。您甚至可以通過從自訂函數返回 `true` 來指定所有排序事件都應觸發多重排序。

```jsx
const table = useReactTable({
  columns,
  data,
  isMultiSortEvent: (e) => true, // 普通點擊觸發多重排序
  //或
  isMultiSortEvent: (e) => e.ctrlKey || e.shiftKey, // 同時使用 `Ctrl` 鍵觸發多重排序
})
```

##### 多重排序限制

預設情況下，可以同時排序的欄位數量沒有限制。您可以使用 `maxMultiSortColCount` 表格選項設定限制。

```jsx
const table = useReactTable({
  columns,
  data,
  maxMultiSortColCount: 3, // 僅允許同時排序 3 個欄位
})
```

##### 多重排序移除

預設情況下，移除多重排序的功能是啟用的。您可以使用 `enableMultiRemove` 表格選項停用此行為。

```jsx
const table = useReactTable({
  columns,
  data,
  enableMultiRemove: false, // 停用移除多重排序的功能
})
```

### 排序 API

有許多與排序相關的 API 可用於連接到您的 UI 或其他邏輯。以下是所有排序 API 及其部分使用案例的清單。

- `table.setSorting` - 直接設定排序狀態。
- `table.resetSorting` - 將排序狀態重置為初始狀態或清除它。

- `column.getCanSort` - 用於啟用/停用欄位的排序 UI。
- `column.getIsSorted` - 用於顯示欄位的視覺排序指示器。

- `column.getToggleSortingHandler` - 用於連接欄位的排序 UI。添加到排序箭頭（圖示按鈕）、選單項目或整個欄位標題單元格。此處理程序將使用正確的參數調用 `column.toggleSorting`。
- `column.toggleSorting` - 用於連接欄位的排序 UI。如果使用此選項而非 `column.getToggleSortingHandler`，則需要手動傳遞是否使用多重排序。（`column.toggleSorting(desc, multi)`）
- `column.clearSorting` - 用於特定欄位的「清除排序」按鈕或選單項目。

- `column.getNextSortingOrder` - 用於顯示欄位下一次排序的方向。（在工具提示/選單項目/aria-label 中顯示 asc/desc/clear）
- `column.getFirstSortDir` - 用於顯示欄位第一次排序的方向。（在工具提示/選單項目/aria-label 中顯示 asc/desc）
- `column.getAutoSortDir` - 決定欄位的第一次排序方向是升序還是降序。
- `column.getAutoSortingFn` - 內部用於查找欄位的預設排序函數（如果未指定）。
- `column.getSortingFn` - 返回欄位使用的確切排序函數。

- `column.getCanMultiSort` - 用於啟用/停用
