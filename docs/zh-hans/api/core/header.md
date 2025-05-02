---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:31:55.565Z'
title: 表头
---
以下是所有表头 (header) 的**核心**选项和 API 属性。更多选项和 API 属性可能适用于其他[表格功能](../guide/features)。

## 表头 API (Header API)

所有表头对象都具有以下属性：

### `id`

```tsx
id: string
```

表头的唯一标识符。

### `index`

```tsx
index: number
```

表头在表头组中的索引。

### `depth`

```tsx
depth: number
```

表头的深度，从零开始计数。

### `column`

```tsx
column: Column<TData>
```

表头关联的[列 (Column)](../api/core/column) 对象。

### `headerGroup`

```tsx
headerGroup: HeaderGroup<TData>
```

表头关联的[表头组 (HeaderGroup)](../api/core/header-group) 对象。

### `subHeaders`

```tsx
type subHeaders = Header<TData>[]
```

表头的层级子表头。如果表头关联的列是叶子列 (leaf-column)，则此数组为空。

### `colSpan`

```tsx
colSpan: number
```

表头的列跨度 (col-span)。

### `rowSpan`

```tsx
rowSpan: number
```

表头的行跨度 (row-span)。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

返回此表头层级下嵌套的所有叶子表头。

### `isPlaceholder`

```tsx
isPlaceholder: boolean
```

标识表头是否为占位表头的布尔值。

### `placeholderId`

```tsx
placeholderId?: string
```

如果表头是占位表头，此属性将提供一个唯一的表头 ID，确保不与表格中其他表头冲突。

### `getContext`

```tsx
getContext: () => {
  table: Table<TData>
  header: Header<TData, TValue>
  column: Column<TData, TValue>
}
```

返回用于表头、页脚和过滤器等基于列的组件的渲染上下文（或属性）。将这些属性与框架的 `flexRender` 工具一起使用，以按所选模板渲染这些组件：

```tsx
flexRender(header.column.columnDef.header, header.getContext())
```

## 表格 API (Table API)

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

返回表格的所有表头组。

### `getLeftHeaderGroups`

```tsx
type getLeftHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列 (pinning)，返回左侧固定列的表头组。

### `getCenterHeaderGroups`

```tsx
type getCenterHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列，返回未固定列的表头组。

### `getRightHeaderGroups`

```tsx
type getRightHeaderGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列，返回右侧固定列的表头组。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

返回表格的所有页脚组。

### `getLeftFooterGroups`

```tsx
type getLeftFooterGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列，返回左侧固定列的页脚组。

### `getCenterFooterGroups`

```tsx
type getCenterFooterGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列，返回未固定列的页脚组。

### `getRightFooterGroups`

```tsx
type getRightFooterGroups = () => HeaderGroup<TData>[]
```

如果启用了固定列，返回右侧固定列的页脚组。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData, unknown>[]
```

返回表格中所有列的表头，包括父表头。

### `getLeftFlatHeaders`

```tsx
type getLeftFlatHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有左侧固定列的表头，包括父表头。

### `getCenterFlatHeaders`

```tsx
type getCenterFlatHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有未固定列的表头，包括父表头。

### `getRightFlatHeaders`

```tsx
type getRightFlatHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有右侧固定列的表头，包括父表头。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData, unknown>[]
```

返回表格中所有叶子列的表头（不包括父表头）。

### `getLeftLeafHeaders`

```tsx
type getLeftLeafHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有左侧固定叶子列的表头（不包括父表头）。

### `getCenterLeafHeaders`

```tsx
type getCenterLeafHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有未固定列的表头（不包括父表头）。

### `getRightLeafHeaders`

```tsx
type getRightLeafHeaders = () => Header<TData, unknown>[]
```

如果启用了固定列，返回表格中所有右侧固定叶子列的表头（不包括父表头）。
