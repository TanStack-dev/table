---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:40:20.109Z'
title: 標題群組
---
## API

[Header Group API](../api/core/header-group)

## 標題群組 (Header Groups) 指南

本快速指南將討論在 TanStack Table 中取得及操作標題群組物件 (header group objects) 的不同方式。

### 什麼是標題群組 (Header Groups)？

標題群組 (Header Groups) 其實就是標題的「行 (rows)」。別被名稱迷惑，概念就是這麼簡單。絕大多數表格只會有一行標題（單一標題群組），但如果你像[欄位群組範例](../framework/react/examples/column-groups)那樣定義巢狀欄位結構，就可以擁有多行標題（多個標題群組）。

### 從何處取得標題群組

有多種 `table` 實例 API 可用來從表格實例中取得標題群組。`table.getHeaderGroups` 是最常用的 API，但根據你使用的功能，可能需要使用其他 API，例如若使用欄位固定 (column pinning) 功能時，就需要使用 `table.get[Left/Center/Right]HeaderGroups`。

### 標題群組物件 (Header Group Objects)

標題群組物件與[行 (Row)](../guide/rows) 物件類似，但更簡單，因為標題行中的內容不像表格主體行那麼多。

預設情況下，標題群組只有三個屬性：

- `id`：標題群組的唯一識別碼，由其深度（索引）產生。這在 React 元件中作為鍵 (key) 時很有用。
- `depth`：標題群組的深度，以零為起始索引。可將其視為所有標題行中的行索引。
- `headers`：屬於此標題群組（行）的[標題 (Header)](../guide/headers) 儲存格物件陣列。

### 存取標題儲存格 (Header Cells)

要渲染標題群組中的標題儲存格，只需映射 (map) 標題群組物件中的 `headers` 陣列。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 映射 headerGroup 的 headers 陣列
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```
