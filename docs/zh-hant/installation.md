---
source-updated-at: '2024-05-19T21:37:34.000Z'
translation-updated-at: '2025-05-08T23:39:46.300Z'
title: 安裝
---
在深入探討 API 之前，先來完成安裝設定！

使用你喜愛的 npm 套件管理工具安裝表格適配器 (adapter) 作為相依套件。

_只需安裝以下其中一個套件：_

## React Table

```bash
npm install @tanstack/react-table
```

`@tanstack/react-table` 套件相容於 React 16.8、React 17、React 18 及 React 19。

> 注意：雖然 React 適配器 (adapter) 可與 React 19 搭配使用，但可能無法相容於即將隨 React 19 推出的新 React 編譯器 (React Compiler)。此問題可能於未來的 TanStack Table 更新中修正。

## Vue Table

```bash
npm install @tanstack/vue-table
```

`@tanstack/vue-table` 套件相容於 Vue 3。

## Solid Table

```bash
npm install @tanstack/solid-table
```

`@tanstack/solid-table` 套件相容於 Solid-JS 1。

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

`@tanstack/svelte-table` 套件相容於 Svelte 3 及 Svelte 4。

> 注意：目前尚未內建 Svelte 5 適配器 (adapter)，但你仍可透過安裝 `@tanstack/table-core` 套件並使用社群提供的自訂適配器 (custom adapter) 來搭配 Svelte 5 使用。可參考此 [PR](https://github.com/TanStack/table/pull/5403) 獲取靈感。

## Qwik Table

```bash
npm install @tanstack/qwik-table
```

`@tanstack/qwik-table` 套件相容於 Qwik 1。

> 注意：近期將發布支援 Qwik 2 的「重大變更 (breaking change)」版本。此更新將以次要版本號 (minor version) 遞增方式發布，並會提供相關文件說明。Qwik 2 本身並無重大變更，但其在 npm 註冊表上的名稱將變更，且需搭配不同的同儕相依套件 (peer dependencies)。

> 注意：目前的 Qwik 適配器 (adapter) 僅支援 CSR。更多改進可能需等待未來的表格版本。

## Angular Table

```bash
npm install @tanstack/angular-table
```

`@tanstack/angular-table` 套件相容於 Angular 17。此 Angular 適配器 (adapter) 採用新的 Angular 訊號 (Signal) 實作方式。

## Lit Table

```bash
npm install @tanstack/lit-table
```

`@tanstack/lit-table` 套件相容於 Lit 3。

## Table Core (無框架版本)

```bash
npm install @tanstack/table-core
```

找不到你喜愛的框架（或特定框架版本）嗎？你隨時可以直接使用 `@tanstack/table-core` 套件，並在自己的程式碼庫中建置專屬適配器 (adapter)。通常只需一層薄薄的封裝 (thin wrapper) 來管理特定框架的狀態與渲染。可瀏覽所有其他適配器的[原始碼](https://github.com/TanStack/table/tree/main/packages)了解其運作方式。
