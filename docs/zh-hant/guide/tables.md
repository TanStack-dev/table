---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:40:06.545Z'
title: 表格實例
---
## API

[表格 API](../api/core/table)

## 表格實例指南

TanStack Table 是一個無頭 UI 函式庫。當我們談論 `table` 或「表格實例」時，並不是指實際的 `<table>` 元素，而是指包含表格狀態和 API 的核心表格物件。`table` 實例是通過呼叫適配器的 `createTable` 函式（例如 `useReactTable`、`useVueTable`、`createSolidTable`、`createSvelteTable`、`createAngularTable`、`useQwikTable`）來建立的。

從 `createTable` 函式（來自框架適配器）返回的 `table` 實例是你將與之互動的主要物件，用於讀取和變更表格狀態。這是 TanStack Table 中一切發生的核心位置。當你開始渲染 UI 時，將會使用此 `table` 實例的 API。

### 建立表格實例

建立表格實例需要 3 個必要的 `options`：`columns`、`data` 和 `getCoreRowModel` 的實作。雖然還有數十個其他表格選項可用於配置功能和行為，但這 3 個是必需的。

#### 定義資料

將資料定義為具有穩定參考的物件陣列。`data` 可以來自任何地方，例如 API 回應或靜態定義在程式碼中，但必須具有穩定參考以防止無限重新渲染。如果使用 TypeScript，你為資料指定的類型將作為 `TData` 泛型使用。更多資訊請參閱[資料指南](../guide/data)。

#### 定義欄位

欄位定義在前一節的[欄位定義指南](../guide/column-defs)中有詳細說明。不過我們在此提醒，當你定義欄位的類型時，應使用與資料相同的 `TData` 類型。

```ts
const columns: ColumnDef<User>[] = [] //將 User 類型作為泛型 TData 類型傳遞
//或
const columnHelper = createColumnHelper<User>() //將 User 類型作為泛型 TData 類型傳遞
```

欄位定義是我們告訴 TanStack Table 每個欄位應如何透過 `accessorKey` 或 `accessorFn` 存取和/或轉換行資料的地方。更多資訊請參閱[欄位定義指南](../guide/column-defs#creating-accessor-columns)。

#### 傳入行模型

這在[行模型指南](../guide/row-models)中有更詳細的說明，但現在只需從 TanStack Table 導入 `getCoreRowModel` 函式並將其作為表格選項傳入即可。根據你計劃使用的功能，後續可能需要傳入其他行模型。

```ts
import { getCoreRowModel } from '@tanstack/[framework]-table'

const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

#### 初始化表格實例

定義好 `columns`、`data` 和 `getCoreRowModel` 後，我們現在可以建立基本的表格實例，並傳入任何其他需要的表格選項。

```ts
//vanilla js
const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//angular
this.table = createAngularTable({ columns: this.columns, data: this.data(), getCoreRowModel: getCoreRowModel() })

//lit
const table = this.tableController.table({ columns, data, getCoreRowModel: getCoreRowModel() })

//qwik
const table = useQwikTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//react
const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//solid
const table = createSolidTable({ columns, get data() { return data() }, getCoreRowModel: getCoreRowModel() })

//svelte
const table = createSvelteTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//vue
const table = useVueTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

那麼 `table` 實例中包含了什麼？讓我們看看可以與表格實例進行哪些互動。

### 表格狀態

表格實例包含所有表格狀態，可透過 `table.getState()` API 存取。每個表格功能會在表格狀態中註冊各種狀態。例如，行選擇功能會註冊 `rowSelection` 狀態，分頁功能會註冊 `pagination` 狀態等。

每個功能還會在表格實例上有對應的狀態設定 API 和狀態重置 API。例如，行選擇功能會有 `setRowSelection` API 和 `resetRowSelection`。

```ts
table.getState().rowSelection //讀取行選擇狀態
table.setRowSelection((old) => ({...old})) //設定行選擇狀態
table.resetRowSelection() //重置行選擇狀態
```

這在[表格狀態指南](../framework/react/guide/table-state)中有更詳細的說明。

### 表格 API

每個功能會建立數十個表格 API，幫助你以不同方式讀取或變更表格狀態。

核心表格實例和所有其他功能 API 的參考文件可以在 API 文件中找到。

例如，你可以在這裡找到核心表格實例的 API 文件：[表格 API](../api/core/table#table-api)

### 表格行模型

有一組特殊的表格實例 API 用於從表格實例中讀取行，稱為行模型。TanStack Table 具有進階功能，生成的資料行可能與你最初傳入的 `data` 陣列有很大不同。要了解更多關於可以作為表格選項傳入的不同行模型，請參閱[行模型指南](../guide/row-models)。
