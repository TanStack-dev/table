---
source-updated-at: '2024-12-30T21:50:15.000Z'
translation-updated-at: '2025-05-02T16:57:27.257Z'
title: 迁移至 V8
---
## 迁移至 V8 版本指南

TanStack Table V8 是基于 TypeScript 对 React Table v7 进行的全面重写。您的标记和 CSS 的整体结构/组织方式基本保持不变，但许多 API 已被重命名或替换。

### 重要变更

- 全面重写为 TypeScript，基础包已内置类型声明
- 移除插件系统，改为更倾向于控制反转的设计
- API 规模大幅扩展且功能增强（新增如固定列等特性）
- 改进的受控状态管理
- 更完善的服务器端操作支持
- 完整（但可选）的数据管道控制
- 框架无关的核心设计，提供 React、Solid、Svelte、Vue 等适配器，未来可能支持更多框架
- 全新的开发者工具

### 安装新版本

新版 TanStack Table 发布在 `@tanstack` 作用域下。使用您喜欢的包管理器安装新包：

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```tsx
- import { useTable } from 'react-table' // [!code --]
+ import { useReactTable } from '@tanstack/react-table' // [!code ++]
```

类型声明现已包含在基础包中，因此可以移除 `@types/react-table` 包。

> 如需逐步迁移代码，可保留旧版 `react-table` 包。两个版本的包可以并存，分别用于不同的表格而不会产生冲突。

### 更新表格配置选项

- 将 `useTable` 重命名为 `useReactTable`
- 旧版钩子和插件系统已被移除，改为按功能分模块导入的树摇优化行模型

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

- 所有 `disable*` 表格选项更名为 `enable*`（如 `disableSortBy` 改为 `enableSorting`，`disableGroupBy` 改为 `enableGrouping` 等）
- ...

### 更新列定义

- `accessor` 更名为 `accessorKey` 或 `accessorFn`（根据使用字符串还是函数决定）
- `width`、`minWidth`、`maxWidth` 更名为 `size`、`minSize`、`maxSize`
- 可选使用新的 `createColumnHelper` 函数包裹列定义，获得更好的 TypeScript 提示（仍可直接使用列定义数组）
  - 第一个参数是访问器函数或访问器字符串
  - 第二个参数是列选项对象

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

// 最佳 TypeScript 体验，特别在使用 `cell.getValue()` 时
+  columnHelper.accessor('firstName', { //accessorKey // [!code ++]
+    header: 'First Name', // [!code ++]
+  }), // [!code ++]
+  columnHelper.accessor(row => row.lastName, { //accessorFn // [!code ++]
+    header: () => <span>Last Name</span>, // [!code ++]
+  }), // [!code ++]

// 或（如果偏好）
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

> 注意：在组件内定义列时，仍应为列定义保持稳定标识。这有助于性能优化并避免不必要的重新渲染。将列定义存储在 `useMemo` 或 `useState` 钩子中。

- 列选项名称变更
  - `Header` 更名为 `header`
  - `Cell` 更名为 `cell`（单元格渲染函数也有变更，见下文）
  - `Footer` 更名为 `footer`
  - 所有 `disable*` 列选项更名为 `enable*` 列选项（如 `disableSortBy` 改为 `enableSorting`，`disableGroupBy` 改为 `enableGrouping` 等）
  - `sortType` 改为 `sortingFn`
  - ...

- 自定义单元格渲染器变更
  - `value` 更名为 `getValue`（为提高性能，改为暴露 `getValue` 函数来按需取值并缓存结果）
  - `cell: { isGrouped, isPlaceholder, isAggregated }` 改为 `cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`
  - `column`：基础属性现在专属于表格库，自定义属性现在位于 `columnDef` 层级下
  - `table`：传入 `useTable` 钩子的属性现在位于 `options` 下

### 迁移表格标记

- 使用 `flexRender()` 替代 `cell.render('Cell')` 或 `column.render('Header')` 等
- `getHeaderProps`、`getFooterProps`、`getCellProps`、`getRowProps` 等均已弃用
  - TanStack Table 不再提供默认的 `style` 或无障碍属性如 `role`（这些仍很重要，但为支持框架无关性已被移除）
  - 需手动定义 `onClick` 事件处理器，但有新的 `get*Handler` 辅助函数简化操作
  - 需手动定义 `key` 属性
  - 使用分组表头、聚合等功能时需手动定义 `colSpan` 属性

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
// 此场景下的列定义示例
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

### 其他变更

- 自定义 `filterTypes`（现称 `filterFns`）函数签名变更，现在只需返回布尔值表示是否包含该行

```tsx
- (rows: Row[], id: string, filterValue: any) => Row[] // [!code --]
+ (row: Row, id: string, filterValue: any) => boolean // [!code ++]
```

- ...

> 本指南仍在完善中。如有时间，欢迎贡献您的经验！
