---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:02:36.442Z'
title: 行
---
## API

[行对象 API](../api/core/row)

## 行对象指南

本快速指南将讨论在 TanStack Table 中获取和操作行对象的不同方式。

### 获取行对象的途径

表格实例提供了多种 API 用于从表实例中检索行对象。

#### table.getRow

如需通过 `id` 访问特定行，可使用 `table.getRow` 表实例 API。

```js
const row = table.getRow(rowId)
```

#### 行模型

表格实例会生成 `row` 对象并将其存储在称为["行模型"](../guide/row-models)的实用数组中。[行模型指南](../guide/row-models)对此有更详细的讨论，以下是访问行模型的常见方式。

##### 渲染行对象

```jsx
<tbody>
  {table.getRowModel().rows.map(row => (
    <tr key={row.id}>
     {/* ... */}
    </tr>
  ))}
</tbody>
```

##### 获取选中行

```js
const selectedRows = table.getSelectedRowModel().rows
```

### 行对象结构

每个行对象包含行数据及众多 API，可用于与表格状态交互，或基于表格状态从行中提取单元格数据。

#### 行 ID

每个行对象都有唯一的 `id` 属性。默认情况下 `row.id` 与行模型中创建的 `row.index` 相同。但可以通过原始行数据的唯一标识符覆盖此值，使用 `getRowId` 表格选项实现。

```js
const table = useReactTable({
  columns,
  data,
  getRowId: originalRow => originalRow.uuid, // 用原始行数据的 uuid 覆盖 row.id
})
```

> 注意：在分组或展开等特性中，`row.id` 会被附加额外字符串。

#### 访问行数据值

推荐使用 `row.getValue` 或 `row.renderValue` API 访问行数据。这两个 API 都会缓存访问器函数结果以保持渲染效率。区别在于：当值为 undefined 时，`row.renderValue` 会返回 `renderFallbackValue`，而 `row.getValue` 会直接返回 undefined。

```js
// 从任意列访问数据
const firstName = row.getValue('firstName') // 读取 firstName 列的行值
const renderedLastName = row.renderValue('lastName') // 渲染 lastName 列的值
```

> 注意：`cell.getValue` 和 `cell.renderValue` 分别是 `row.getValue` 和 `row.renderValue` 的快捷方式。

#### 访问原始行数据

通过 `row.original` 属性可访问传入表实例的原始数据。这些数据不会受列定义中访问器的修改影响，因此如果在访问器中进行了数据转换，这些转换不会反映在 `row.original` 对象中。

```js
// 访问原始行的任意数据
const firstName = row.original.firstName // { firstName: 'John', lastName: 'Doe' }
```

### 子行对象

如果使用分组或展开功能，行对象可能包含子行或父行引用。[展开指南](../guide/expanding)对此有详细说明，以下是处理子行的常用属性和方法：

- `row.subRows`：该行的子行数组
- `row.depth`：行相对于根行数组的嵌套深度（0 表示根行，1 表示子行，2 表示孙行等）
- `row.parentId`：该行父行的唯一 ID（即 subRows 数组包含该行的父行）
- `row.getParentRow`：返回该行的父行（如果存在）

### 更多行对象 API

根据表格使用的功能特性，还有数十个用于与行交互的实用 API。详见各功能对应的 API 文档或指南。
