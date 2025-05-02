---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T16:54:14.299Z'
title: Qwik 表格适配器
---
# Qwik Table (请勿包含此标题在翻译中)

`@tanstack/qwik-table` 适配器是对核心表格逻辑的封装层。其主要职责是以 "Qwik" 方式管理状态，提供类型支持以及单元格/表头/表尾模板的渲染实现。

## 导出项

`@tanstack/qwik-table` 重新导出了 `@tanstack/table-core` 的所有 API 及以下内容：

### `useQwikTable`

接收一个 `options` 配置对象，并返回来自 Qwik Store 的带有 `NoSerialize` 特性的表格实例。

```ts
import { useQwikTable } from '@tanstack/qwik-table'

const table = useQwikTable(options)
// ...渲染你的表格
```

### `flexRender`

用于渲染带有动态值的单元格/表头/表尾模板的工具函数。

示例：

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
