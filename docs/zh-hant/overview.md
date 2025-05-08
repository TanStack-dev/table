---
source-updated-at: '2024-05-12T19:19:51.000Z'
translation-updated-at: '2025-05-08T23:40:12.981Z'
title: 概述
---
TanStack Table 的核心是 **框架無關 (framework agnostic)**，這意味著無論你使用哪種框架，其 API 都保持一致。根據你所使用的框架，我們提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱「Adapters」選單以查看可用的適配器。

## TypeScript

雖然 TanStack Table 是用 [TypeScript](https://www.typescriptlang.org/) 編寫的，但在你的應用程式中使用 TypeScript 是可選的（但強烈推薦，因為它能為你和程式碼庫帶來顯著的好處）。

如果你使用 TypeScript，你將獲得頂級的類型安全性和編輯器自動補全功能，適用於所有表格 API 和狀態。

## 無頭式 (Headless)

如 [介紹](../introduction) 部分所述，TanStack Table 是 **無頭式 (headless)** 的。這意味著它不會渲染任何 DOM 元素，而是依賴於你（UI/UX 開發者）來提供表格的標記和樣式。這是一種極佳的方式，可以構建適用於任何 UI 框架的表格，包括 React、Vue、Solid、Svelte、Qwik、Angular，甚至是 JS-to-native 平台如 React Native！

## 無關性 (Agnostic)

由於 TanStack Table 是無頭式的，並且運行在純 JavaScript 核心上，它在以下幾個方面具有無關性：

1. TanStack Table 是 **框架無關 (Framework Agnostic)** 的，這意味著你可以將其與任何你想要的 JavaScript 框架（或函式庫）一起使用。TanStack Table 預設提供了適用於 React、Vue、Solid、Svelte 和 Qwik 的即用型適配器，但如果你需要，也可以創建自己的適配器。
2. TanStack Table 是 **CSS / 元件函式庫無關 (CSS / Component Library Agnostic)** 的，這意味著你可以將 TanStack Table 與任何 CSS 策略或元件函式庫一起使用。TanStack Table 本身不會渲染任何表格標記或樣式。這些都由你來提供！想使用 Tailwind 或 ShadCN？沒問題！想使用 Material UI 或 Bootstrap？也沒問題！有自己的自訂設計系統？TanStack Table 正是為你而設計的！

## 核心物件與類型

表格核心使用以下抽象概念，通常由適配器公開：

- [資料 (Data)](../guide/data) - 你提供給表格的核心資料陣列
- [欄位定義 (Column Defs)](../guide/column-defs)：用於配置欄位及其資料模型、顯示模板等的物件
- [表格實例 (Table Instance)](../guide/tables)：包含狀態和 API 的核心表格物件
- [列模型 (Row Models)](../guide/row-models)：根據你使用的功能，將 `data` 陣列轉換為有用的列的方式
- [列 (Rows)](../guide/rows)：每一列都對應其相應的資料列，並提供列專用的 API
- [儲存格 (Cells)](../guide/cells)：每個儲存格對應其相應的列-欄位交集，並提供儲存格專用的 API
- [標題群組 (Header Groups)](../guide/header-groups)：標題群組是嵌套標題層級的計算切片，每個群組包含一組標題
- [標題 (Headers)](../guide/headers)：每個標題直接關聯或衍生自其欄位定義，並提供標題專用的 API
- [欄位 (Columns)](../guide/columns)：每個欄位對應其相應的欄位定義，並提供欄位專用的 API

## 功能

TanStack Table 可以幫助你構建幾乎任何你能想像的表格類型。它內建了以下功能的狀態和 API：

- [欄位分面 (Column Faceting)](../guide/column-faceting) - 列出欄位的唯一值列表或欄位的最小/最大值
- [欄位過濾 (Column Filtering)](../guide/column-filtering) - 根據欄位的搜尋值過濾列
- [欄位分組 (Column Grouping)](../guide/grouping) - 將欄位分組、執行聚合等
- [欄位排序 (Column Ordering)](../guide/column-ordering) - 動態變更欄位順序
- [欄位固定 (Column Pinning)](../guide/column-pinning) - 將欄位固定（凍結）在表格的左側或右側
- [欄位調整大小 (Column Sizing)](../guide/column-sizing) - 動態調整欄位大小（欄位調整手柄）
- [欄位可見性 (Column Visibility)](../guide/column-visibility) - 顯示/隱藏欄位
- [全域分面 (Global Faceting)](../guide/global-faceting) - 列出整個表格的唯一值列表或最小/最大值
- [全域過濾 (Global Filtering)](../guide/global-filtering) - 根據整個表格的搜尋值過濾列
- [列展開 (Row Expanding)](../guide/expanding) - 展開/折疊列（子列）
- [列分頁 (Row Pagination)](../guide/pagination) - 對列進行分頁
- [列固定 (Row Pinning)](../guide/row-pinning) - 將列固定（凍結）在表格的頂部或底部
- [列選擇 (Row Selection)](../guide/row-selection) - 選擇/取消選擇列（複選框）
- [列排序 (Row Sorting)](../guide/sorting) - 根據欄位值對列進行排序

這些只是你可以用 TanStack Table 構建的部分功能。還有許多其他功能可以與內建功能一起實現。

[虛擬化 (Virtualization)](../guide/virtualization) 是一個未內建於 TanStack Table 的功能示例，但可以通過使用其他函式庫（如 [TanStack Virtual](https://tanstack.com/virtual/v3)）並將其與其他表格渲染邏輯結合來實現。

TanStack Table 還支援 [自訂功能 (Custom Features)](../guide/custom-features)（插件），你可以使用這些功能來修改表格實例，以更整合的方式為表格添加自訂邏輯。

當然，你也可以直接編寫自己的狀態和鉤子 (hooks) 來為表格添加任何其他功能。TanStack Table 核心的功能只是一個堅實的基礎，重點關注性能和開發者體驗 (DX)。
