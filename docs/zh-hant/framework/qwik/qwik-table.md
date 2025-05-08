---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:42:22.017Z'
title: Qwik 表格適配器
---
`@tanstack/qwik-table` 適配器是核心表格邏輯的封裝層，其主要工作是依照 Qwik 的方式管理狀態，並提供單元格/表頭/表尾模板的型別與渲染實作。

## 導出項目

`@tanstack/qwik-table` 重新導出了 `@tanstack/table-core` 的所有 API 以及以下內容：

### `useQwikTable`

接收一個 `options` 物件，並從帶有 `NoSerialize` 的 Qwik Store 返回一個表格實例。

```ts
import { useQwikTable } from '@tanstack/qwik-table'

const table = useQwikTable(options)
// ...渲染你的表格

```

### `flexRender`

一個用於渲染帶有動態值的單元格/表頭/表尾模板的實用函數。

範例：

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
