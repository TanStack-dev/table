---
source-updated-at: '2024-12-30T21:50:15.000Z'
translation-updated-at: '2025-05-08T23:41:17.987Z'
title: 遷移至 V8
---
## 遷移至 V8 版本指南

TanStack Table V8 是從頭開始使用 TypeScript 全面重寫的 React Table v7。您的標記語言 (markup) 和 CSS 的整體結構/組織方式大致保持不變，但許多 API 已被重新命名或替換。

### 重要變更

- 全面改用 TypeScript 重寫，基礎套件已內含型別定義
- 移除外掛系統，改採更多控制反轉 (inversion of control) 設計
- 大幅擴充並改進的 API（以及新增如釘選 (pinning) 等功能）
- 更完善的受控狀態管理
- 更佳的伺服器端操作 (server-side operations) 支援
- 完整（但可選的）資料管道控制
- 框架無關 (agnostic) 的核心，提供 React、Solid、Svelte、Vue 等框架適配器 (adapters)，未來可能支援更多
- 新的開發者工具 (Dev Tools)

### 安裝新版本

新版本的 TanStack Table 發佈在 `@tanstack` 作用域下。請使用您喜歡的套件管理器安裝新套件：

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```tsx
- import { useTable } from 'react-table' // [!code --]
+ import { useReactTable } from '@tanstack/react-table' // [!code ++]
```

型別定義現在已包含在基礎套件中，因此您可以移除 `@types/react-table` 套件。

> 如果需要，您可以保留舊版 `react-table` 套件安裝，以便逐步遷移程式碼。您應該能夠同時使用兩個套件來處理不同的表格而不會出現問題。

### 更新表格選項

- 將 `useTable` 重新命名為 `useReactTable`
- 舊的鉤子 (hook) 和外掛系統已被移除，取而代之的是針對每個功能的可樹搖 (tree-shakable) 行模型 (row model) 導入。

```tsx
- import { useTable, usePagination, useSortBy } from 'react-table'; // [!code --]
+ import { // [!code ++]
+   useReactTable, // [!code ++]
+   getCoreRowModel, // [!code ++]
+   getPaginationRowModel, // [!code ++]
+   getSortedRowModel // [!code ++]
+ } from '@tanstack/react-table'; // [!code ++]

// ...

-   const tableInstance = useTable( // [!code --]
-     { columns,  data }, // [!code --]
-     useSortBy, // [!code --]
-     usePagination, //order of hooks used to matter // [!code --]
-     // etc. // [!code --]
-   ); // [!code --]
+   const tableInstance = useReactTable({ // [!code ++]
+     columns, // [!code ++]
+     data, // [!code ++]
+     getCoreRowModel: getCoreRowModel(), // [!code ++]
+     getPaginationRowModel: getPaginationRowModel(), // [!code ++]
+     getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore! // [!code ++]
+     // etc. // [!code ++]
+   }); // [!code ++]
```

- 所有 `disable*` 表格選項已重新命名為 `enable*` 表格選項。（例如：`disableSortBy` 現在是 `enableSorting`，`disableGroupBy` 現在是 `enableGrouping`，依此類推。）
- ...

### 更新欄位定義

- `accessor` 已重新命名為 `accessorKey` 或 `accessorFn`（取決於您使用的是字串還是函數）
- `width`、`minWidth`、`maxWidth` 已重新命名為 `size`、`minSize`、`maxSize`
- 可選地，您可以在每個欄位定義周圍使用新的 `createColumnHelper` 函數，以獲得更好的 TypeScript 提示。（如果您願意，仍然可以使用欄位定義的陣列。）
  - 第一個參數是存取函數或存取字串。
  - 第二個參數是欄位選項的物件。

```tsx
const columns = [
-  { // [!code --]
-    accessor: 'firstName', // [!code --]
-    Header: 'First Name', // [!code --]
-  }, // [!code --]
-  { // [!code --]
-    accessor: row => row.lastName, // [!code --]
-    Header: () => <span>Last Name</span>, // [!code --]
-  }, // [!code --]

// 最佳 TypeScript 體驗，特別是在後續使用 `cell.getValue()` 時
+  columnHelper.accessor('firstName', { //accessorKey // [!code ++]
+    header: 'First Name', // [!code ++]
+  }), // [!code ++]
+  columnHelper.accessor(row => row.lastName, { //accessorFn // [!code ++]
+    header: () => <span>Last Name</span>, // [!code ++]
+  }), // [!code ++]

// 或（如果您偏好）
+ { // [!code ++]
+   accessorKey: 'firstName', // [!code ++]
+   header: 'First Name', // [!code ++]
+ }, // [!code ++]
+ { // [!code ++]
+   accessorFn: row => row.lastName, // [!code ++]
+   header: () => <span>Last Name</span>, // [!code ++]
+ }, // [!code ++]
]
```

> 注意：如果在元件內部定義欄位，您仍應嘗試為欄位定義提供穩定的識別資訊。這將有助於提升效能並避免不必要的重新渲染。請將欄位定義儲存在 `useMemo` 或 `useState` 鉤子中。

- 欄位選項名稱變更

  - `Header` 已重新命名為 `header`
  - `Cell` 已重新命名為 `cell`（單元格渲染函數也已變更。請參閱下文）
  - `Footer` 已重新命名為 `footer`
  - 所有 `disable*` 欄位選項已重新命名為 `enable*` 欄位選項。（例如：`disableSortBy` 現在是 `enableSorting`，`disableGroupBy` 現在是 `enableGrouping`，依此類推。）
  - `sortType` 變更為 `sortingFn`
  - ...

- 自訂單元格渲染器的變更

  - `value` 已重新命名為 `getValue`（在整個升級過程中，不再直接提供值，而是公開一個函數 `getValue` 來評估值。此變更旨在通過僅在呼叫 `getValue()` 時評估值並進行快取來提升效能。）
  - `cell: { isGrouped, isPlaceholder, isAggregated }` 現在是 `cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`
  - `column`：基礎層級的屬性現在是 RT 特定的。您在定義時添加到物件的值現在位於 `columnDef` 的下一層。
  - `table`：傳遞到 `useTable` 鉤子的屬性現在出現在 `options` 下。

### 遷移表格標記語言

- 使用 `flexRender()` 代替 `cell.render('Cell')` 或 `column.render('Header')` 等。
- `getHeaderProps`、`getFooterProps`、`getCellProps`、`getRowProps` 等都已**棄用**。
  - TanStack Table 不再提供任何預設的 `style` 或無障礙屬性如 `role`。這些仍然很重要，但為了支援框架無關性，必須移除。
  - 您需要手動定義 `onClick` 處理程序，但有新的 `get*Handler` 輔助工具可以簡化此操作。
  - 您需要手動定義 `key` 屬性
  - 如果您使用需要 `colSpan` 的功能（如分組標頭、聚合等），則需要手動定義 `colSpan` 屬性

```tsx
- <th {...header.getHeaderProps()}>{cell.render('Header')}</th> // [!code --]
+ <th colSpan={header.colSpan} key={column.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     header.column.columnDef.header, // [!code ++]
+     header.getContext() // [!code ++]
+   )} // [!code ++]
+ </th> // [!code ++]
```

```tsx
- <td {...cell.getCellProps()}>{cell.render('Cell')}</td> // [!code --]
+ <td key={cell.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     cell.column.columnDef.cell, // [!code ++]
+     cell.getContext() // [!code ++]
+   )} // [!code ++]
+ </td> // [!code ++]
```

```tsx
// 在此情況下的欄位定義中
- Header: ({ getToggleAllRowsSelectedProps }) => ( // [!code --]
-   <input type="checkbox" {...getToggleAllRowsSelectedProps()} /> // [!code --]
- ), // [!code --]
- Cell: ({ row }) => ( // [!code --]
-   <input type="checkbox" {...row.getToggleRowSelectedProps()} /> // [!code --]
- ), // [!code --]
+ header: ({ table }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={table.getIsAllRowsSelected()} // [!code ++]
+     indeterminate={table.getIsSomeRowsSelected()} // [!code ++]
+     onChange={table.getToggleAllRowsSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
+ cell: ({ row }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={row.getIsSelected()} // [!code ++]
+     disabled={!row.getCanSelect()} // [!code ++]
+     indeterminate={row.getIsSomeSelected()} // [!code ++]
+     onChange={row.getToggleSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
```

### 其他變更

- 自訂的 `filterTypes`（現在稱為 `filterFns`）具有新的函數簽章，因為它僅返回一個布林值，表示是否應包含該行。

```tsx
- (rows: Row[], id: string, filterValue: any) => Row[] // [!code --]
+ (row: Row, id: string, filterValue: any) => boolean // [!code ++]
```

- ...

> 本指南仍在完善中。如果您有時間，請考慮貢獻內容！
