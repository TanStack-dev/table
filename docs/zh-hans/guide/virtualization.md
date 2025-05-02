---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:27:01.269Z'
title: 虚拟化
---
## 示例

想直接查看实现代码？请参考以下示例：

- [虚拟化列 (virtualized-columns)](../framework/react/examples/virtualized-columns)
- [虚拟化行 (动态行高) (virtualized-rows (dynamic row height))](../framework/react/examples/virtualized-rows)
- [虚拟化行 (固定行高) (virtualized-rows (fixed row height))](../../../../virtual/v3/docs/framework/react/examples/table)
- [虚拟化无限滚动 (virtualized-infinite-scrolling)](../framework/react/examples/virtualized-infinite-scrolling)

## API

[TanStack Virtual 虚拟化器 API (TanStack Virtual Virtualizer API)](../../../../virtual/v3/docs/api/virtualizer)

## 虚拟化指南

TanStack Table 的核心包并未内置任何虚拟化 API 或功能，但可以轻松与其他虚拟化库如 [react-window](https://www.npmjs.com/package/react-window) 或 TanStack 自家的 [TanStack Virtual](https://tanstack.com/virtual/v3) 协同工作。本指南将展示 TanStack Table 与 TanStack Virtual 配合使用的几种策略。
