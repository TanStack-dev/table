---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-08T23:42:03.110Z'
title: Svelte 表格適配器
---
`@tanstack/svelte-table` 轉接器 (adapter) 是核心表格邏輯的封裝層，其主要工作是以「Svelte」的方式管理狀態，並提供類型 (types) 以及單元格 (cell)/表頭 (header)/表尾 (footer) 模板的渲染實作 (implementation)。

## `createSvelteTable`

接收一個 `options` 物件並回傳表格實例。

```svelte
<script>

import { createSvelteTable } from '@tanstack/svelte-table'

const table = createSvelteTable(options)

</script>
```
