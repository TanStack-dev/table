---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-02T16:54:29.218Z'
title: Solid 表格适配器
---
Solid Table 是围绕核心表格逻辑的适配器封装，其主要职责是以 "solid" 的方式管理状态，并提供单元格/表头/表尾模板的类型定义与渲染实现。

## `createSolidTable`

接收一个 `options` 配置对象并返回表格实例。

```tsx
import { createSolidTable } from '@tanstack/solid-table'

function App() {
  const table = createSolidTable(options)

  // ...渲染表格
}
```
