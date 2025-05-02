---
source-updated-at: '2024-05-19T21:37:34.000Z'
translation-updated-at: '2025-05-02T16:54:22.010Z'
title: 安装
---
在深入探索 API 之前，让我们先完成环境配置！

使用你喜欢的 npm 包管理器安装表格适配器作为依赖项。

_只需安装以下其中一个包：_

## React Table

```bash
npm install @tanstack/react-table
```

`@tanstack/react-table` 包兼容 React 16.8、React 17、React 18 和 React 19。

> 注意：尽管 React 适配器支持 React 19，但它可能无法与即将随 React 19 发布的新 React 编译器 (React Compiler) 兼容。此问题可能会在未来的 TanStack Table 更新中修复。

## Vue Table

```bash
npm install @tanstack/vue-table
```

`@tanstack/vue-table` 包兼容 Vue 3。

## Solid Table

```bash
npm install @tanstack/solid-table
```

`@tanstack/solid-table` 包兼容 Solid-JS 1。

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

`@tanstack/svelte-table` 包兼容 Svelte 3 和 Svelte 4。

> 注意：目前尚未内置 Svelte 5 适配器，但你仍可通过安装 `@tanstack/table-core` 包并使用社区提供的自定义适配器，在 Svelte 5 中使用 TanStack Table。可参考此 [PR](https://github.com/TanStack/table/pull/5403) 获取灵感。

## Qwik Table

```bash
npm install @tanstack/qwik-table
```

`@tanstack/qwik-table` 包兼容 Qwik 1。

> 注意：未来将发布一个支持 Qwik 2 的“破坏性变更”版本。该版本将以次版本号升级的形式发布，但会提供详细文档。Qwik 2 本身不会有破坏性变更，但其在 npm 注册表中的名称将更改，并需要不同的 peer 依赖项。

> 注意：当前的 Qwik 适配器仅支持客户端渲染 (CSR)。更多改进可能需要等待未来版本的表格库。

## Angular Table

```bash
npm install @tanstack/angular-table
```

`@tanstack/angular-table` 包兼容 Angular 17。Angular 适配器采用了新的 Angular 信号 (Signal) 实现。

## Lit Table

```bash
npm install @tanstack/lit-table
```

`@tanstack/lit-table` 包兼容 Lit 3。

## Table Core (无框架版本)

```bash
npm install @tanstack/table-core
```

没有找到你喜欢的框架（或框架版本）？你始终可以直接使用 `@tanstack/table-core` 包，并在自己的代码库中构建适配器。通常只需一个轻量封装来管理特定框架的状态和渲染逻辑。浏览其他所有适配器的 [源代码](https://github.com/TanStack/table/tree/main/packages) 了解其实现方式。
