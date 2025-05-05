---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-05T19:23:58.945Z'
title: Vanilla JS (フレームワークなし)
---
`@tanstack/table-core` ライブラリには、TanStack Table のコアロジックが含まれています。非標準のフレームワークを使用している場合やフレームワークにアクセスできない場合は、TypeScript または JavaScript を介して直接コアライブラリを使用できます。

## `createTable`

`options` オブジェクトを受け取り、テーブルを返します。

```tsx
import { createTable } from '@tanstack/table-core'

const table = createTable(options)
```
