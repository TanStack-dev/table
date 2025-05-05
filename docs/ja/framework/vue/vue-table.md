---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:23:54.221Z'
title: Vueテーブルアダプター
---
# Vue Table

TanStack Tableのコアは**フレームワーク非依存 (framework agnostic)** です。つまり、使用するフレームワークに関係なくAPIは同じです。各フレームワークでテーブルコアを簡単に操作できるように、アダプターが提供されています。利用可能なアダプターについては、Adaptersメニューを参照してください。

`@tanstack/vue-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態管理を"Vue"の方法で行い、型を提供し、セル/ヘッダー/フッターテンプレートのレンダリング実装を提供することです。

## エクスポート

`@tanstack/vue-table`は`@tanstack/table-core`のすべてのAPIと以下を再エクスポートします:

### `useVueTable`

`options`オブジェクトを受け取り、テーブルを返します。

```ts
import { useVueTable } from '@tanstack/vue-table'

const table = useVueTable(options)
// ...テーブルをレンダリング
```

### `FlexRender`

動的な値を持つセル/ヘッダー/フッターテンプレートをレンダリングするためのVueコンポーネントです。

例:

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
