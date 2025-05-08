---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:42:27.947Z'
title: Lit 表格適配器
---
`@tanstack/lit-table` 適配器是核心表格邏輯的封裝層，其主要工作是以 "lit" 的方式管理狀態，並提供單元格/表頭/表尾模板的類型定義與渲染實現。

## 匯出項目

`@tanstack/lit-table` 重新匯出了 `@tanstack/table-core` 的所有 API 以及以下內容：

### `TableController`

這是一個響應式控制器 (reactive controller)，提供一個 `table` API，該 API 接收 `options` 物件並回傳表格實例。

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

一個用於渲染帶有動態值的單元格/表頭/表尾模板的實用函式。

範例：

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
