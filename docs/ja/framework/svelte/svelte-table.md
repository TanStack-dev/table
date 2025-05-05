---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-05T19:23:43.906Z'
title: Svelteテーブルアダプター
---
`@tanstack/svelte-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態管理を「スベルテ (Svelte)」の方法で行い、型を提供し、セル/ヘッダー/フッターテンプレートのレンダリング実装を提供することです。

## `createSvelteTable`

`options`オブジェクトを受け取り、テーブルを返します。

```svelte
<script>

import { createSvelteTable } from '@tanstack/svelte-table'

const table = createSvelteTable(options)

</script>
```
