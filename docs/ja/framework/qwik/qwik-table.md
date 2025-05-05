---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:23:40.680Z'
title: Qwikテーブルアダプター
---
`@tanstack/qwik-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態管理を「Qwik」の方法で行い、型を提供し、セル/ヘッダー/フッターテンプレートのレンダリング実装を提供することです。

## エクスポート

`@tanstack/qwik-table`は、`@tanstack/table-core`のすべてのAPIと以下のものを再エクスポートします。

### `useQwikTable`

`options`オブジェクトを受け取り、`NoSerialize`を含むQwik Storeからテーブルを返します。

```ts
import { useQwikTable } from '@tanstack/qwik-table'

const table = useQwikTable(options)
// ...テーブルをレンダリング
```

### `flexRender`

セル/ヘッダー/フッターテンプレートを動的な値でレンダリングするためのユーティリティ関数です。

例:

```jsx
import { flexRender } from '@tanstack/qwik-table'
//...
return (
  <tbody>
    {table.getRowModel().rows.map(row => {
      return (
        <tr key={row.id}>
          {row.getVisibleCells().map(cell => (
            <td key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      )
    })}
  </tbody>
);
```
