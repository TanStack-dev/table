---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:40:39.084Z'
title: 標題
---
## API

[Header API](../api/core/header)

## 標頭指南 (Headers Guide)

本快速指南將討論在 TanStack Table 中獲取及操作 `header` 物件的不同方式。

標頭 (headers) 相當於儲存格 (cells)，但專用於表格的 `<thead>` 區段而非 `<tbody>` 區段。

### 標頭來源

標頭來自[標頭群組 (Header Groups)](../guide/header-groups)，其相當於資料列 (rows)，但專用於表格的 `<thead>` 區段而非 `<tbody>` 區段。

#### 標頭群組標頭 (HeaderGroup Headers)

若處於標頭群組中，標頭會以陣列形式儲存在 `headerGroup.headers` 屬性中。通常您只需映射 (map) 此陣列即可渲染標頭。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 映射標頭群組的標頭陣列
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```

#### 標頭表格實例 API (Header Table Instance APIs)

根據您使用的功能，有多種 `table` 實例 API 可用於取得標頭清單。最常用的可能是 `table.getFlatHeaders`，它會回傳表格中所有標頭的扁平化清單，但還有至少十幾種其他標頭 API 可搭配欄位可見性 (column visibility) 與欄位固定 (column pinning) 功能使用。例如 `table.getLeftLeafHeaders` 或 `table.getRightFlatHeaders` 等 API 可能依使用情境派上用場。

### 標頭物件 (Header Objects)

標頭物件類似[儲存格 (Cells)](../guide/cells) 物件，但專用於表格的 `<thead>` 區段而非 `<tbody>` 區段。每個標頭物件都可與 UI 中的 `<th>` 或類似儲存格元素關聯。`header` 物件上有幾個屬性和方法可用於與表格狀態互動，並根據表格狀態提取儲存格值。

#### 標頭 ID (Header IDs)

每個標頭物件都有 `id` 屬性，使其在表格實例中具有唯一性。通常您只需將此 `id` 作為 React 鍵值 (key) 的唯一識別符，或參考[高效欄位調整範例](../framework/react/examples/column-resizing-performant)時使用。

對於沒有進階巢狀或群組標頭邏輯的簡單標頭，`header.id` 會與其父級 `column.id` 相同。但若標頭屬於群組欄位或佔位儲存格，則會產生更複雜的 ID，由標頭家族、深度/標頭列索引、欄位 ID 和標頭群組 ID 組合而成。

#### 巢狀群組標頭屬性 (Nested Grouped Headers Properties)

`header` 物件上有幾個屬性僅在標頭屬於巢狀或群組結構時有用，包括：

- `colspan`：標頭應橫跨的欄位數，用於渲染 `<th>` 元素的 `colSpan` 屬性。
- `rowSpan`：標頭應縱跨的列數，用於渲染 `<th>` 元素的 `rowSpan` 屬性。（目前 TanStack Table 預設未實作）
- `depth`：標頭群組所屬的「列索引」。
- `isPlaceholder`：布林標記，若標頭為佔位標頭則為 true。佔位標頭用於填補欄位隱藏或屬於群組欄位時的空白。
- `placeholderId`：佔位標頭的唯一識別符。
- `subHeaders`：屬於此標頭的子標頭陣列。若標頭為葉節點標頭 (leaf header) 則為空。

> 注意：`header.index` 指其在標頭群組（標頭列）中的索引，即從左到右的位置。與 `header.depth`（標頭群組的「列索引」）不同。

#### 標頭父物件 (Header Parent Objects)

每個標頭都儲存了對其父級[欄位 (column)](../guide/columns) 物件和父級[標頭群組 (header group)](../guide/header-groups) 物件的參照。

### 更多標頭 API (More Header APIs)

標頭還有幾個實用的 API 可用於與表格狀態互動，大多與欄位尺寸調整 (Column sizing/resizing) 功能相關。詳見[欄位尺寸調整指南](../guide/column-sizing)。

### 標頭渲染 (Header Rendering)

由於您定義的 `header` 欄位選項可以是字串、JSX 或回傳這兩者的函式，最佳渲染方式是使用適配器中的 `flexRender` 工具，它會為您處理所有情況。

```jsx
{headerGroup.headers.map(header => (
  <th key={header.id} colSpan={header.colSpan}>
    {/* 處理 `header` 欄位定義的所有可能情境 */}
    {flexRender(header.column.columnDef.header, header.getContext())}
  </th>
))}
```
