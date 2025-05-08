---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:42:11.042Z'
title: Vue 表格適配器
---
Vue Table

TanStack Table 的核心是 **框架無關 (framework agnostic)** 的，這意味著無論您使用哪種框架，其 API 都保持一致。根據您使用的框架，我們提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱「適配器」選單以查看可用的適配器。

`@tanstack/vue-table` 適配器是對核心表格邏輯的封裝。其主要工作是依照 "Vue" 的方式管理狀態，並提供類型以及單元格/表頭/表尾模板的渲染實現。

## 匯出項目

`@tanstack/vue-table` 重新匯出了 `@tanstack/table-core` 的所有 API 以及以下內容：

### `useVueTable`

接收一個 `options` 物件並回傳一個表格實例。

```ts
import { useVueTable } from '@tanstack/vue-table'

const table = useVueTable(options)
// ...渲染您的表格
```

### `FlexRender`

一個 Vue 元件，用於渲染帶有動態值的單元格/表頭/表尾模板。

範例：

```vue
import { FlexRender } from '@tanstack/vue-table'

<template>
  <tbody>
    <tr v-for="row in table.getRowModel().rows" :key="row.id">
      <td v-for="cell in row.getVisibleCells()" :key="cell.id">
        <FlexRender
          :render="cell.column.columnDef.cell"
          :props="cell.getContext()"
        />
      </td>
    </tr>
  </tbody>
</template>
```
