---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:01:10.937Z'
title: 表格实例
---
## API

[表格 API](../api/core/table)

## 表格实例指南

TanStack Table 是一个无头 UI 库。当我们谈论 `table` 或 "表格实例" 时，并不是指字面上的 `<table>` 元素，而是指包含表格状态和 API 的核心表格对象。`table` 实例是通过调用适配器的 `createTable` 函数创建的（例如 `useReactTable`、`useVueTable`、`createSolidTable`、`createSvelteTable`、`createAngularTable`、`useQwikTable`）。

从 `createTable` 函数（来自框架适配器）返回的 `table` 实例是您与之交互以读取和变更表格状态的主要对象。它是 TanStack Table 中一切发生的核心。当您开始渲染 UI 时，将使用此 `table` 实例提供的 API。

### 创建表格实例

创建表格实例需要 3 个必填 `options`：`columns`、`data` 和 `getCoreRowModel` 实现。虽然还有数十种其他表格选项可用于配置功能和行为，但这 3 项是必需的。

#### 定义数据

将数据定义为具有稳定引用的对象数组。`data` 可以来自 API 响应或静态定义的代码，但必须保持引用稳定以避免无限重新渲染。如果使用 TypeScript，您为数据指定的类型将作为 `TData` 泛型使用。更多信息请参阅[数据指南](../guide/data)。

#### 定义列

列定义在前文的[列定义指南](../guide/column-defs)中有详细说明。这里需要特别注意的是，定义列类型时应使用与数据相同的 `TData` 类型。

```ts
const columns: ColumnDef<User>[] = [] //将 User 类型作为泛型 TData 类型传入
//或
const columnHelper = createColumnHelper<User>() //将 User 类型作为泛型 TData 类型传入
```

列定义中通过 `accessorKey` 或 `accessorFn` 指定每列如何访问和/或转换行数据。详情参见[列定义指南](../guide/column-defs#creating-accessor-columns)。

#### 传入行模型

[行模型指南](../guide/row-models)对此有更详细的解释。目前只需从 TanStack Table 导入 `getCoreRowModel` 函数并将其作为表格选项传入即可。根据您计划使用的功能，后续可能需要传入其他行模型。

```ts
import { getCoreRowModel } from '@tanstack/[framework]-table'

const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

#### 初始化表格实例

定义好 `columns`、`data` 和 `getCoreRowModel` 后，现在可以创建基础表格实例，同时传入其他所需的表格选项。

```ts
//原生 JS
const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//Angular
this.table = createAngularTable({ columns: this.columns, data: this.data(), getCoreRowModel: getCoreRowModel() })

//Lit
const table = this.tableController.table({ columns, data, getCoreRowModel: getCoreRowModel() })

//Qwik
const table = useQwikTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//React
const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//Solid
const table = createSolidTable({ columns, get data() { return data() }, getCoreRowModel: getCoreRowModel() })

//Svelte
const table = createSvelteTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//Vue
const table = useVueTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

`table` 实例包含哪些内容？让我们看看可以与表格实例进行哪些交互。

### 表格状态

表格实例包含所有表格状态，可通过 `table.getState()` API 访问。每个表格功能会在表格状态中注册各种状态。例如，行选择功能注册 `rowSelection` 状态，分页功能注册 `pagination` 状态等。

每个功能还会在表格实例上提供对应的状态设置 API 和状态重置 API。例如，行选择功能会有 `setRowSelection` API 和 `resetRowSelection`。

```ts
table.getState().rowSelection //读取行选择状态
table.setRowSelection((old) => ({...old})) //设置行选择状态
table.resetRowSelection() //重置行选择状态
```

更多细节请参阅[表格状态指南](../framework/react/guide/table-state)

### 表格 API

每个功能都会创建数十个表格 API，帮助您以不同方式读取或变更表格状态。

核心表格实例及所有其他功能 API 的参考文档可在 API 文档各处找到。

例如，核心表格实例 API 文档在此：[表格 API](../api/core/table#table-api)

### 表格行模型

表格实例有一组特殊的 API 用于读取行数据，称为行模型。TanStack Table 的高级功能可能导致生成的行与最初传入的 `data` 数组有很大差异。要了解可以作为表格选项传入的不同行模型，请参阅[行模型指南](../guide/row-models)。
