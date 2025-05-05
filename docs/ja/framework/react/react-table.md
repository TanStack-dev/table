---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-05T19:23:33.923Z'
title: Reactテーブルアダプター
---
# React Table

`@tanstack/react-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態管理を「React」の方法で行い、セル/ヘッダー/フッターテンプレートの型定義とレンダリング実装を提供することです。

## `useReactTable`

`options`オブジェクトを受け取り、テーブルを返します。

```tsx
import { useReactTable } from '@tanstack/react-table'

function App() {
  const table = useReactTable(options)

  // ...テーブルをレンダリング
}
```
