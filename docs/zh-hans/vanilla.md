---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-02T16:53:59.912Z'
title: 原生 JS (无框架)
---
`@tanstack/table-core` 库包含了 TanStack Table 的核心逻辑。如果您使用的是非标准框架或无法使用框架，可以直接通过 TypeScript 或 JavaScript 使用核心库。

## `createTable`

接收一个 `options` 对象并返回一个表格实例。

```tsx
import { createTable } from '@tanstack/table-core'

const table = createTable(options)
```
