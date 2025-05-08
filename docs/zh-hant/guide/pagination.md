---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:05.008Z'
title: 分頁
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [分頁](../framework/react/examples/pagination)
- [受控分頁 (React Query)](../framework/react/examples/pagination-controlled)
- [可編輯資料](../framework/react/examples/editable-data)
- [展開](../framework/react/examples/expanding)
- [篩選](../framework/react/examples/filters)
- [完全受控](../framework/react/examples/fully-controlled)
- [列選取](../framework/react/examples/row-selection)

## API

[分頁 API](../api/features/pagination)

## 分頁指南

TanStack Table 對客戶端分頁和伺服器端分頁都有良好的支援。本指南將帶您了解在表格中實作分頁的不同方式。

### 客戶端分頁

使用客戶端分頁意味著您取得的 `data` 將包含表格的***所有***列，表格實例將在前端處理分頁邏輯。

#### 是否應該使用客戶端分頁？

客戶端分頁通常是使用 TanStack Table 實作分頁最簡單的方式，但對於非常大的資料集可能不太實際。

然而，許多人低估了客戶端能處理的資料量。如果您的表格永遠只有幾千列或更少，客戶端分頁仍然是一個可行的選擇。TanStack Table 設計用於處理數萬列的資料，在分頁、篩選、排序和分組方面仍能保持良好的效能。[官方分頁範例](../framework/react/examples/pagination) 載入了 100,000 列資料，效能依然良好，儘管只有少數幾欄。

每個使用情境都不同，取決於表格的複雜性、欄位數量、每筆資料的大小等。主要需要注意的瓶頸是：

1. 您的伺服器能否在合理時間（和成本）內查詢所有資料？
2. 取得的資料總大小是多少？（如果您沒有太多欄位，這個問題可能沒有您想像的那麼嚴重。）
3. 如果一次性載入所有資料，客戶端瀏覽器是否會使用過多記憶體？

如果不確定，您可以先從客戶端分頁開始，隨著資料增長再切換到伺服器端分頁。

#### 是否應該改用虛擬化？

另一種選擇是不對資料分頁，而是在同一頁面上渲染大型資料集的所有列，但僅使用瀏覽器資源渲染視窗中可見的列。這種策略通常稱為「虛擬化 (virtualization)」或「視窗化 (windowing)」。TanStack 提供了一個虛擬化函式庫 [TanStack Virtual](https://tanstack.com/virtual/latest)，可以與 TanStack Table 良好配合。虛擬化和分頁的 UI/UX 各有優缺點，請根據您的使用情境選擇最適合的方式。

#### 分頁列模型

如果想利用 TanStack Table 內建的客戶端分頁功能，首先需要傳入分頁列模型。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(), //載入客戶端分頁程式碼
});
```

### 手動伺服器端分頁

如果決定需要使用伺服器端分頁，以下是實作方式。

伺服器端分頁不需要分頁列模型，但如果您在共享元件中為其他需要它的表格提供了該模型，仍可以通過將 `manualPagination` 選項設為 `true` 來關閉客戶端分頁。將 `manualPagination` 設為 `true` 會告訴表格實例在底層使用 `table.getPrePaginationRowModel` 列模型，並假設您傳入的 `data` 已經過分頁。

#### 頁數和列數

表格實例無法知道後端總共有多少列/頁，除非您告訴它。提供 `rowCount` 或 `pageCount` 表格選項，讓表格實例知道總共有多少頁。如果提供 `rowCount`，表格實例會根據 `rowCount` 和 `pageSize` 內部計算 `pageCount`。或者，如果您已經知道頁數，可以直接提供 `pageCount`。如果不知道頁數，可以傳入 `-1` 作為 `pageCount`，但在這種情況下，`getCanNextPage` 和 `getCanPreviousPage` 列模型函式將始終返回 `true`。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  // getPaginationRowModel: getPaginationRowModel(), //伺服器端分頁不需要
  manualPagination: true, //關閉客戶端分頁
  rowCount: dataQuery.data?.rowCount, //傳入總列數，讓表格知道有多少頁（如果未提供 pageCount，則內部計算）
  // pageCount: dataQuery.data?.pageCount, //或者直接傳入 pageCount 代替 rowCount
});
```

> **注意**：將 `manualPagination` 選項設為 `true` 會讓表格實例假設您傳入的 `data` 已經過分頁。

### 分頁狀態

無論您使用的是客戶端還是手動伺服器端分頁，都可以使用內建的 `pagination` 狀態和 API。

`pagination` 狀態是一個物件，包含以下屬性：

- `pageIndex`：當前頁面索引（從零開始）。
- `pageSize`：當前頁面大小。

您可以像管理表格實例中的其他狀態一樣管理 `pagination` 狀態。

```jsx
import { useReactTable, getCoreRowModel, getPaginationRowModel } from '@tanstack/react-table';
//...
const [pagination, setPagination] = useState({
  pageIndex: 0, //初始頁面索引
  pageSize: 10, //預設頁面大小
});

const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  onPaginationChange: setPagination, //當內部 API 變更分頁狀態時更新分頁狀態
  state: {
    //...
    pagination,
  },
});
```

或者，如果不需要在自己的作用域中管理 `pagination` 狀態，但需要為 `pageIndex` 和 `pageSize` 設置不同的初始值，可以使用 `initialState` 選項。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  initialState: {
    pagination: {
      pageIndex: 2, //自訂初始頁面索引
      pageSize: 25, //自訂預設頁面大小
    },
  },
});
```

> **注意**：請勿同時將 `pagination` 狀態傳遞給 `state` 和 `initialState` 選項。`state` 會覆蓋 `initialState`。僅使用其中之一。

### 分頁選項

除了對手動伺服器端分頁有用的 `manualPagination`、`pageCount` 和 `rowCount` 選項（已在[上文](#手動伺服器端分頁)討論）外，還有一個表格選項值得了解。

#### 自動重置頁面索引

預設情況下，當發生影響頁面的狀態變更時（例如 `data` 更新、篩選變更、分組變更等），`pageIndex` 會重置為 `0`。當 `manualPagination` 為 true 時，此行為會自動停用，但可以通過明確為 `autoResetPageIndex` 表格選項賦予布林值來覆蓋。

```jsx
const table = useReactTable({
  columns,
  data,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  autoResetPageIndex: false, //關閉 pageIndex 的自動重置
});
```

但請注意，如果關閉 `autoResetPageIndex`，可能需要添加一些邏輯來自行處理 `pageIndex` 的重置，以避免顯示空白頁面。

### 分頁 API

有幾個分頁表格實例 API 可用於連接您的分頁 UI 元件。

#### 分頁按鈕 API

- `getCanPreviousPage`：用於在第一頁時停用「上一頁」按鈕。
- `getCanNextPage`：用於在沒有更多頁面時停用「下一頁」按鈕。
- `previousPage`：用於前往上一頁。（按鈕點擊處理器）
- `nextPage`：用於前往下一頁。（按鈕點擊處理器）
- `firstPage`：用於前往第一頁。（按鈕點擊處理器）
- `lastPage`：用於前往最後一頁。（按鈕點擊處理器）
- `setPageIndex`：用於「前往頁面」輸入框。
- `resetPageIndex`：用於將表格狀態重置為原始頁面索引。
- `setPageSize`：用於「頁面大小」輸入/選擇框。
- `resetPageSize`：用於將表格狀態重置為原始頁面大小。
- `setPagination`：用於一次性設置所有分頁狀態。
- `resetPagination`：用於將表格狀態重置為原始分頁狀態。

> **注意**：其中一些 API 是 `v8.13.0` 新增的。

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

#### 分頁資訊 API

- `getPageCount`：用於顯示總頁數。
- `getRowCount`：用於顯示總列數。
