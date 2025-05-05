---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-05T19:23:32.886Z'
title: Solidテーブルアダプター
---
`@tanstack/solid-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態管理を「Solid」の方法で行い、型を提供し、セル/ヘッダー/フッターテンプレートのレンダリング実装を提供することです。

## `createSolidTable`

`options`オブジェクトを受け取り、テーブルを返します。

```tsx
import { createSolidTable } from '@tanstack/solid-table'

function App() {
  const table = createSolidTable(options)

  // ...テーブルをレンダリング
}
```
