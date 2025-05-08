---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:39:28.469Z'
title: 虛擬化
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [virtualized-columns](../framework/react/examples/virtualized-columns)
- [virtualized-rows (動態行高)](../framework/react/examples/virtualized-rows)
- [virtualized-rows (固定行高)](../../../../virtual/v3/docs/framework/react/examples/table)
- [virtualized-infinite-scrolling](../framework/react/examples/virtualized-infinite-scrolling)

## API

[TanStack Virtual Virtualizer API](../../../../virtual/v3/docs/api/virtualizer)

## 虛擬化指南 (Virtualization Guide)

TanStack Table 套件本身並未內建任何虛擬化 (virtualization) API 或功能，但可以輕鬆與其他虛擬化函式庫搭配使用，例如 [react-window](https://www.npmjs.com/package/react-window) 或 TanStack 自家的 [TanStack Virtual](https://tanstack.com/virtual/v3)。本指南將展示一些將 TanStack Table 與 TanStack Virtual 結合使用的策略。
