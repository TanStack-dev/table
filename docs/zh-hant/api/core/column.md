---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:44:07.088Z'
title: 欄位
---
這些是適用於所有欄位的**核心**選項與 API 屬性。更多選項與 API 屬性可參閱其他[表格功能](../guide/features)。

## 欄位 API

所有欄位物件皆具備以下屬性：

### `id`

```tsx
id: string
```

解析後的唯一識別符，優先順序如下：

- 來自欄位定義的手動 `id` 屬性
- 來自欄位定義的存取器 (accessor) 鍵名
- 來自欄位定義的標頭字串

### `depth`

```tsx
depth: number
```

欄位的深度（若為分組欄位）相對於根欄位定義陣列。

### `accessorFn`

```tsx
accessorFn?: AccessorFn<TData>
```

解析後的存取器函式 (accessor function)，用於從每列資料中提取該欄位的值。僅在欄位定義有設定有效的存取器鍵名或函式時才會定義。

### `columnDef`

```tsx
columnDef: ColumnDef<TData>
```

用於建立此欄位的原始欄位定義。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

子欄位陣列（若該欄位為群組欄位）。若非群組欄位則為空陣列。

### `parent`

```tsx
parent?: Column<TData>
```

此欄位的父欄位。若為根欄位則為 undefined。

### `getFlatColumns`

```tsx
type getFlatColumns = () => Column<TData>[]
```

回傳此欄位及其所有子欄位/孫欄位的扁平化陣列。

### `getLeafColumns`

```tsx
type getLeafColumns = () => Column<TData>[]
```

回傳此欄位所有葉節點 (leaf-node) 欄位的陣列。若欄位無子欄位，則視為唯一的葉節點欄位。
