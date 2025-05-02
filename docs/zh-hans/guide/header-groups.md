---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:03:29.963Z'
title: 表头分组
---
## API

[Header Group API](../api/core/header-group)

## 表头分组指南

本快速指南将讨论在 TanStack Table 中获取和操作表头分组对象的不同方法。

### 什么是表头分组？

表头分组就是表头的"行"。不要被名称迷惑，它就是这么简单。绝大多数表格只有一行表头（单个表头分组），但如果像[列分组示例](../framework/react/examples/column-groups)那样定义嵌套列结构，就可以有多行表头（多个表头分组）。

### 如何获取表头分组

可以通过多个 `table` 实例 API 从表格实例中获取表头分组。`table.getHeaderGroups` 是最常用的 API，但根据使用的功能特性，可能需要使用其他 API，例如在使用列固定功能时，可能需要使用 `table.get[Left/Center/Right]HeaderGroups`。

### 表头分组对象

表头分组对象与[行对象](../guide/rows)类似，但更简单，因为表头行没有数据行那么复杂的逻辑。

默认情况下，表头分组只有三个属性：

- `id`：根据深度（索引）生成的唯一标识符。这对 React 组件的 key 属性很有用。
- `depth`：表头分组的深度，从零开始索引。可以理解为所有表头行中的行索引。
- `headers`：属于该表头分组（行）的[表头单元格](../guide/headers)对象数组。

### 访问表头单元格

要渲染表头分组中的单元格，只需遍历表头分组对象的 `headers` 数组。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // 遍历 headerGroup 的 headers 数组
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```
