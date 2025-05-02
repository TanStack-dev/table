---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:04:06.657Z'
title: 表头
---
## API

[Header API](../api/core/header)

## 表头指南

本快速指南将讨论在 TanStack Table 中获取和操作 `header` 对象的不同方式。

表头相当于单元格，但专用于表格的 `<thead>` 区域而非 `<tbody>` 区域。

### 获取表头的途径

表头来源于 [Header Groups（表头组）](../guide/header-groups)，其相当于行，但专用于表格的 `<thead>` 区域而非 `<tbody>` 区域。

#### 表头组中的表头

若在表头组中，表头会以数组形式存储在 `headerGroup.headers` 属性中。通常只需遍历该数组即可渲染表头。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 遍历 headerGroup.headers 数组
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```

#### 表头表实例 API

根据使用的功能，可通过多种 `table` 实例 API 获取表头列表。最常用的可能是 `table.getFlatHeaders`，它会返回表格中所有表头的扁平列表，但还有十余种其他 API 与列可见性和列固定功能配合使用。例如 `table.getLeftLeafHeaders` 或 `table.getRightFlatHeaders` 可能适用于特定场景。

### 表头对象

表头对象类似于 [Cell（单元格）](../guide/cells) 对象，但专用于表格的 `<thead>` 区域。每个表头对象可与 UI 中的 `<th>` 或类似单元格元素关联。`header` 对象上有若干属性和方法，可用于与表格状态交互，并根据表格状态提取单元格值。

#### 表头 ID

每个表头对象都有唯一的 `id` 属性。通常仅需将其用作 React key 的唯一标识符，或参考 [高性能列调整示例](../framework/react/examples/column-resizing-performant) 时使用。

对于没有嵌套或分组逻辑的简单表头，`header.id` 与其父级 `column.id` 相同。但若表头属于分组列或占位单元格，则会生成更复杂的 ID，由表头族系、深度/表头行索引、列 ID 和表头组 ID 构成。

#### 嵌套分组表头属性

若表头属于嵌套或分组结构，则以下属性特别有用：

- `colspan`：表头应跨越的列数，适用于设置 `<th>` 元素的 `colSpan` 属性。
- `rowSpan`：表头应跨越的行数，适用于设置 `<th>` 元素的 `rowSpan` 属性。（当前 TanStack Table 默认未实现）
- `depth`：表头组所属的“行索引”。
- `isPlaceholder`：布尔标志，若表头为占位表头则为 true。占位表头用于填充列隐藏或列分组时的空缺。
- `placeholderId`：占位表头的唯一标识符。
- `subHeaders`：属于该表头的子表头数组。若为叶子表头则为空。

> 注意：`header.index` 表示其在表头组（表头行）中的索引（从左到右的位置），与表示表头组“行索引”的 `header.depth` 不同。

#### 表头父对象

每个表头存储对其父级 [column（列）](../guide/columns) 对象和父级 [header group（表头组）](../guide/header-groups) 对象的引用。

### 更多表头 API

表头上还附加了一些用于与表格状态交互的实用 API，多数与列尺寸调整功能相关。详见 [列尺寸调整指南](../guide/column-sizing)。

### 表头渲染

由于定义的 `header` 列选项可以是字符串、JSX 或返回二者的函数，最佳渲染方式是使用适配器中的 `flexRender` 工具，它能处理所有情况。

```jsx
{headerGroup.headers.map(header => (
  <th key={header.id} colSpan={header.colSpan}>
    {/* 处理 `header` 列定义的所有可能场景 */}
    {flexRender(header.column.columnDef.header, header.getContext())}
  </th>
))}
```
