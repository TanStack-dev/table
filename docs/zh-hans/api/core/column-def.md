---
source-updated-at: '2024-03-22T01:02:38.000Z'
translation-updated-at: '2025-05-02T17:29:32.771Z'
title: 列定义
---
列定义 (ColumnDef) 是包含以下选项的普通对象：

## 选项

### `id`

```tsx
id: string
```

该列的唯一标识符。

> � 在以下情况下列 ID 是可选的：
>
> - 当使用对象键访问器 (accessor) 创建访问器列时
> - 当列标题定义为字符串时

### `accessorKey`

```tsx
accessorKey?: string & typeof TData
```

用于从行对象中提取列值时使用的键名。

### `accessorFn`

```tsx
accessorFn?: (originalRow: TData, index: number) => any
```

用于从每行数据中提取列值的访问器函数。

### `columns`

```tsx
columns?: ColumnDef<TData>[]
```

包含在分组列中的子列定义。

### `header`

```tsx
header?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

为该列显示的标题。如果传入字符串，则可作为列 ID 的默认值。如果传入函数，则会接收标题的属性对象，并应返回渲染后的标题值（具体类型取决于所使用的适配器）。

### `footer`

```tsx
footer?:
  | string
  | ((props: {
      table: Table<TData>
      header: Header<TData>
      column: Column<TData>
    }) => unknown)
```

为该列显示的页脚。如果传入函数，则会接收页脚的属性对象，并应返回渲染后的页脚值（具体类型取决于所使用的适配器）。

### `cell`

```tsx
cell?:
  | string
  | ((props: {
      table: Table<TData>
      row: Row<TData>
      column: Column<TData>
      cell: Cell<TData>
      getValue: () => any
      renderValue: () => any
    }) => unknown)
```

为该列每行数据显示的单元格。如果传入函数，则会接收单元格的属性对象，并应返回渲染后的单元格值（具体类型取决于所使用的适配器）。

### `meta`

```tsx
meta?: ColumnMeta // 此接口可通过声明合并扩展。见下文！
```

与该列关联的元数据。当列可用时，我们可以通过 `column.columnDef.meta` 在任何地方访问它。此类型对所有表格都是全局的，可以像这样扩展：

```tsx
import '@tanstack/react-table' // 或 vue, svelte, solid, qwik 等

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    foo: string
  }
}
```
