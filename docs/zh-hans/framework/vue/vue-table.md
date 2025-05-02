---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T16:57:56.577Z'
title: Vue 表格适配器
---
Vue Table

`@tanstack/vue-table` 适配器是对核心表格逻辑的封装层，其主要职责是以 "Vue" 的方式管理状态，并提供类型支持以及单元格/表头/表尾模板的渲染实现。

## 导出项

`@tanstack/vue-table` 重新导出了 `@tanstack/table-core` 的所有 API 及以下内容：

### `useVueTable`

接收一个 `options` 配置对象并返回表格实例。

```ts
import { useVueTable } from '@tanstack/vue-table'

const table = useVueTable(options)
// ...渲染你的表格
```

### `FlexRender`

用于渲染带有动态值的单元格/表头/表尾模板的 Vue 组件。

示例：

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
