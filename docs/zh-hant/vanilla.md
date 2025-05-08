---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-08T23:39:23.339Z'
title: Vanilla JS (無框架)
---
`@tanstack/table-core` 函式庫包含了 TanStack Table 的核心邏輯。如果您使用的是非標準框架或無法使用任何框架，可以直接透過 TypeScript 或 JavaScript 使用核心函式庫。

## `createTable`

接收一個 `options` 物件並回傳一個表格。

```tsx
import { createTable } from '@tanstack/table-core'

const table = createTable(options)
```
