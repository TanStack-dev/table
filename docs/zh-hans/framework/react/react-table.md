---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-02T16:56:03.829Z'
title: React 表格适配器
---
`@tanstack/react-table` 适配器是对核心表格逻辑的封装层，其主要职责是以 "React" 的方式管理状态，并提供单元格/表头/表尾模板的类型定义与渲染实现。

## `useReactTable`

接收一个 `options` 配置对象并返回表格实例。

```tsx
import { useReactTable } from '@tanstack/react-table'

function App() {
  const table = useReactTable(options)

  // ...在此处渲染你的表格
}
```
