---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:32:18.576Z'
title: 行
---
以下是所有行的**核心**选项和 API 属性。更多选项和 API 属性可用于其他[表格功能](../guide/features)。

## 行 (Row) API

所有行对象都具有以下属性：

### `id`

```tsx
id: string
```
通过 `options.getRowId` 选项解析出的唯一标识符。默认为行的索引（如果是子行则为相对索引）。

### `depth`

```tsx
depth: number
```
行相对于根行数组的深度（如果是嵌套或分组行）。

### `index`

```tsx
index: number
```
行在其父数组（或根数据数组）中的索引。

### `original`

```tsx
original: TData
```
提供给表格的原始行对象。

> 🧠 如果行是分组行，原始行对象将是组中的第一个原始行。

### `parentId`

```tsx
parentId?: string
```
如果是嵌套行，此行父行的 ID。

### `getValue`

```tsx
getValue: (columnId: string) => TValue
```
返回行中指定列 ID 的值。

### `renderValue`

```tsx
renderValue: (columnId: string) => TValue
```
渲染行中指定列 ID 的值，但如果未找到值，将返回 `renderFallbackValue`。

### `getUniqueValues`

```tsx
getUniqueValues: (columnId: string) => TValue[]
```
返回行中指定列 ID 的唯一值数组。

### `subRows`

```tsx
type subRows = Row<TData>[]
```
由 `options.getSubRows` 选项返回和创建的行子行数组。

### `getParentRow`

```tsx
type getParentRow = () => Row<TData> | undefined
```
返回行的父行（如果存在）。

### `getParentRows`

```tsx
type getParentRows = () => Row<TData>[]
```
返回行的所有父行，直到根行。

### `getLeafRows`

```tsx
type getLeafRows = () => Row<TData>[]
```
返回行的所有叶子行，不包括任何父行。

### `originalSubRows`

```tsx
originalSubRows?: TData[]
```
由 `options.getSubRows` 选项返回的原始子行数组。

### `getAllCells`

```tsx
type getAllCells = () => Cell<TData>[]
```
返回行中所有的[单元格 (Cell)](../api/core/cell)。
