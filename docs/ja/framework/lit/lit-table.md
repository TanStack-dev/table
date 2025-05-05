---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-05T19:23:42.386Z'
title: Litテーブルアダプター
---
以下は翻訳です：

`@tanstack/lit-table` アダプターは、コアテーブルロジックをラップするものです。その主な役割は、状態管理を「Lit」の方法で行い、セル/ヘッダー/フッターテンプレートのレンダリング実装と型を提供することです。

## エクスポート

`@tanstack/lit-table` は `@tanstack/table-core` のすべてのAPIと以下を再エクスポートします：

### `TableController`

リアクティブコントローラーで、`options` オブジェクトを受け取りテーブルインスタンスを返す `table` APIを提供します。

```ts
import { TableController } from '@tanstack/lit-table'

@customElement('my-table-element')
class MyTableElement extends LitElement {
  private tableController = new TableController<Person>(this)

  protected render() {
    const table = this.tableController.table(options)
    // ...テーブルをレンダリング
  }
}
```

### `flexRender`

動的な値を持つセル/ヘッダー/フッターテンプレートをレンダリングするためのユーティリティ関数です。

例：

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
