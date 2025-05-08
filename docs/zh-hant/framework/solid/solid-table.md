---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-08T23:42:05.918Z'
title: Solid 表格適配器
---
`@tanstack/solid-table` 轉接器 (adapter) 是核心表格邏輯的封裝層，其主要工作是遵循 Solid 的方式管理狀態 (state)，並提供單元格 (cell)/表頭 (header)/表尾 (footer) 模板的型別 (types) 與渲染實作 (rendering implementation)。

## `createSolidTable`

接收一個 `options` 物件並回傳表格實例。

```tsx
import { createSolidTable } from '@tanstack/solid-table'

function App() {
  const table = createSolidTable(options)

  // ...render your table
}
```
