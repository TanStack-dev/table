---
source-updated-at: '2024-05-12T19:19:51.000Z'
translation-updated-at: '2025-05-02T15:31:44.246Z'
title: 概述
---
TanStack Table 的核心是 **框架无关 (framework agnostic)** 的，这意味着无论您使用何种框架，其 API 都保持一致。根据您使用的框架，我们提供了适配器 (Adapters) 来简化与表格核心的交互。请参阅 Adapters 菜单了解可用的适配器。

## TypeScript

虽然 TanStack Table 使用 [TypeScript](https://www.typescriptlang.org/) 编写，但在您的应用程序中使用 TypeScript 是可选的（但强烈推荐，因为它能为您和代码库带来显著优势）。

如果您使用 TypeScript，您将获得顶级的类型安全性和编辑器自动补全功能，适用于所有表格 API 和状态。

## 无头设计 (Headless)

正如在[介绍](../introduction)部分中广泛提到的，TanStack Table 是 **无头 (headless)** 的。这意味着它不会渲染任何 DOM 元素，而是依赖于您——UI/UX 开发者——来提供表格的标记和样式。这是一种构建可在任何 UI 框架中使用的表格的绝佳方式，包括 React、Vue、Solid、Svelte、Qwik、Angular，甚至像 React Native 这样的 JS 到原生平台！

## 无关性 (Agnostic)

由于 TanStack Table 是无头的，并且运行在原生 JavaScript 核心上，它在几个方面具有无关性：

1. TanStack Table 是 **框架无关 (Framework Agnostic)** 的，这意味着您可以将其与任何您想要的 JavaScript 框架（或库）一起使用。TanStack Table 提供了开箱即用的适配器，支持 React、Vue、Solid、Svelte 和 Qwik，但您也可以根据需要创建自己的适配器。
2. TanStack Table 是 **CSS / 组件库无关 (CSS / Component Library Agnostic)** 的，这意味着您可以将其与任何 CSS 策略或组件库一起使用。TanStack Table 本身不会渲染任何表格标记或样式。您需要自己提供！想使用 Tailwind 或 ShadCN？没问题！想使用 Material UI 或 Bootstrap？也没问题！有自己的自定义设计系统？TanStack Table 就是为您而设计的！

## 核心对象与类型

表格核心使用以下抽象概念，通常由适配器暴露：

- [数据 (Data)](../guide/data) - 您提供给表格的核心数据数组
- [列定义 (Column Defs)](../guide/column-defs)：用于配置列及其数据模型、显示模板等的对象
- [表格实例 (Table Instance)](../guide/tables)：包含状态和 API 的核心表格对象
- [行模型 (Row Models)](../guide/row-models)：根据您使用的功能，将 `data` 数组转换为有用的行的方式
- [行 (Rows)](../guide/rows)：每行镜像其对应的行数据，并提供行特定的 API
- [单元格 (Cells)](../guide/cells)：每个单元格镜像其对应的行-列交集，并提供单元格特定的 API
- [表头组 (Header Groups)](../guide/header-groups)：表头组是嵌套表头级别的计算切片，每组包含一组表头
- [表头 (Headers)](../guide/headers)：每个表头直接关联或派生自其列定义，并提供表头特定的 API
- [列 (Columns)](../guide/columns)：每列镜像其对应的列定义，并提供列特定的 API

## 功能

TanStack Table 可以帮助您构建几乎任何类型的表格。它为以下功能提供了内置的状态和 API：

- [列分面 (Column Faceting)](../guide/column-faceting) - 列出列的唯一值列表或列的最小/最大值
- [列过滤 (Column Filtering)](../guide/column-filtering) - 根据列的搜索值过滤行
- [列分组 (Column Grouping)](../guide/grouping) - 将列分组、运行聚合等
- [列排序 (Column Ordering)](../guide/column-ordering) - 动态更改列的顺序
- [列固定 (Column Pinning)](../guide/column-pinning) - 将列固定在表格的左侧或右侧
- [列尺寸调整 (Column Sizing)](../guide/column-sizing) - 动态调整列的尺寸（列调整手柄）
- [列可见性 (Column Visibility)](../guide/column-visibility) - 显示/隐藏列
- [全局分面 (Global Faceting)](../guide/global-faceting) - 列出整个表格的唯一值列表或最小/最大值
- [全局过滤 (Global Filtering)](../guide/global-filtering) - 根据整个表格的搜索值过滤行
- [行展开 (Row Expanding)](../guide/expanding) - 展开/折叠行（子行）
- [行分页 (Row Pagination)](../guide/pagination) - 对行进行分页
- [行固定 (Row Pinning)](../guide/row-pinning) - 将行固定在表格的顶部或底部
- [行选择 (Row Selection)](../guide/row-selection) - 选择/取消选择行（复选框）
- [行排序 (Row Sorting)](../guide/sorting) - 按列值对行排序

这些只是您可以使用 TanStack Table 构建的部分功能。还有许多其他功能可以通过内置功能之外的扩展实现。

[虚拟化 (Virtualization)](../guide/virtualization) 是一个未内置到 TanStack Table 中的功能示例，但可以通过使用其他库（如 [TanStack Virtual](https://tanstack.com/virtual/v3)）并结合其他表格渲染逻辑来实现。

TanStack Table 还支持[自定义功能 (Custom Features)](../guide/custom-features)（插件），您可以使用这些功能修改表格实例，以更集成的方式向表格添加自定义逻辑。

当然，您也可以编写自己的状态和钩子来为表格添加任何其他功能。TanStack Table 核心的功能只是一个坚实的基础，重点关注性能和开发者体验 (DX)。
