---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-06T01:25:22.796Z'
title: 列
---
以下是所有列的核心选项和 API 属性。更多选项和 API 属性可用于其他[表格功能](../guide/features)。

## 列 API (Column API)

所有列对象都具有以下属性：

### `id`

```tsx
id: string
```

解析出的唯一标识符，按以下优先级确定：

- 列定义中手动指定的 `id` 属性
- 列定义中的访问器键 (accessor key)
- 列定义中的表头字符串

### `depth`

```tsx
depth: number
```

列的分组深度 (如果已分组)，相对于根列定义数组。

### `accessorFn`

```tsx
accessorFn?: AccessorFn<TData>
```

解析出的访问器函数，用于从每行中提取该列的值。仅当列定义中定义了有效的访问器键或函数时才会存在。

### `columnDef`

```tsx
columnDef: ColumnDef<TData>
```

用于创建列的原始列定义。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

子列数组 (如果该列是分组列)。如果列不是分组列，则为空数组。

### `parent`

```tsx
parent?: Column<TData>
```

该列的父列。如果是根列则为 undefined。

### `getFlatColumns`

```tsx
type getFlatColumns = () => Column<TData>[]
```

返回该列及其所有子列/孙列组成的扁平化数组。

### `getLeafColumns`

```tsx
type getLeafColumns = () => Column<TData>[]
```

返回该列的所有叶子节点列数组。如果列没有子列，则它本身被视为唯一的叶子节点列。
