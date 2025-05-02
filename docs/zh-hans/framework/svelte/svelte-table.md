---
source-updated-at: '2024-01-24T21:39:34.000Z'
translation-updated-at: '2025-05-02T16:54:37.121Z'
title: Svelte 表格适配器
---
`@tanstack/svelte-table` 适配器是对核心表格逻辑的封装层，其主要职责是以 "svelte" 的方式管理状态，并提供单元格/表头/页脚模板的类型定义与渲染实现。

## `createSvelteTable`

接收一个 `options` 配置对象并返回表格实例。

```svelte
<script>

import { createSvelteTable } from '@tanstack/svelte-table'

const table = createSvelteTable(options)

</script>
```
