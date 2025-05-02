---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-02T16:57:43.591Z'
title: Lit 表格适配器
---
# Lit Table (不翻译标题)

`@tanstack/lit-table` 适配器是对核心表格逻辑的封装层，其主要职责是以 "lit" 的方式管理状态，并提供单元格/表头/页脚模板的类型定义与渲染实现。

## 导出项

`@tanstack/lit-table` 重新导出了 `@tanstack/table-core` 的所有 API 及以下内容：

### `TableController`

这是一个响应式控制器，提供接收 `options` 配置对象并返回表格实例的 `table` API。

```ts
import { TableController } from '@tanstack/lit-table'

@customElement('my-table-element')
class MyTableElement extends LitElement {
  private tableController = new TableController<Person>(this)

  protected render() {
    const table = this.tableController.table(options)
    // ...渲染你的表格
  }
}
```

### `flexRender`

用于渲染带有动态值的单元格/表头/页脚模板的工具函数。

示例：

```jsx
import { flexRender } from '@tanstack/lit-table'
//...
return html`
<tbody>
  ${table
    .getRowModel()
    .rows.slice(0, 10)
    .map(
      row => html`
        <tr>
          ${row
            .getVisibleCells()
            .map(
              cell => html`
                <td>
                  ${flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              `
            )}
        </tr>
      `
    )}
</tbody>
`
```
