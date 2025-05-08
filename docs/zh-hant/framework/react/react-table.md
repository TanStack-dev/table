---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-08T23:42:10.780Z'
title: React 表格適配器
---
`@tanstack/react-table` 轉接器 (adapter) 是核心表格邏輯的封裝層，其主要職責是以「React」方式管理狀態，並提供單元格/表頭/表尾模板的類型定義與渲染實作。

## `useReactTable`

接收一個 `options` 物件並回傳表格實例。

```tsx
import { useReactTable } from '@tanstack/react-table'

function App() {
  const table = useReactTable(options)

  // ...render your table
}
```
