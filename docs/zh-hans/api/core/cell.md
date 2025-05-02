---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:32:33.600Z'
title: 单元格
---
以下是所有单元格的核心选项和 API 属性。更多选项和 API 属性可在其他[表格功能](../guide/features)中找到。

## 单元格 API

所有单元格对象都具有以下属性：

### `id`

```tsx
id: string
```

该单元格在整个表格中的唯一标识符。

### `getValue`

```tsx
getValue: () => any
```

通过关联列的访问器键或访问器函数获取单元格的值并返回。

### `renderValue`

```tsx
renderValue: () => any
```

与 `getValue` 相同的方式渲染单元格的值，但如果未找到值，则会返回 `renderFallbackValue`。

### `row`

```tsx
row: Row<TData>
```

该单元格关联的行对象。

### `column`

```tsx
column: Column<TData>
```

该单元格关联的列对象。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  column: Column<TData, TValue>
  row: Row<TData>
  cell: Cell<TData, TValue>
  getValue: <TTValue = TValue,>() => TTValue
  renderValue: <TTValue = TValue,>() => TTValue | null
}
```

返回基于单元格的组件（如单元格和聚合单元格）的渲染上下文（或属性）。使用这些属性配合您框架的 `flexRender` 工具函数，按需渲染模板：

```tsx
flexRender(cell.column.columnDef.cell, cell.getContext())
```
