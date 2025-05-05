---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:30:04.671Z'
title: 行選択
id: row-selection
---
## ステート (State)

行選択のステートは、以下の形式でテーブルに保存されます:

```tsx
export type RowSelectionState = Record<string, boolean>

export type RowSelectionTableState = {
  rowSelection: RowSelectionState
}
```

デフォルトでは、行選択のステートは各行のインデックスを行識別子として使用します。行選択のステートは、テーブルにカスタムの[getRowId](../core/table.md#getrowid)関数を渡すことで、カスタムの一意な行IDで追跡することもできます。

## テーブルオプション (Table Options)

### `enableRowSelection`

```tsx
enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- テーブル内のすべての行に対して行選択を有効/無効にする OR
- 行を受け取り、その行の行選択を有効/無効にするかどうかを返す関数

### `enableMultiRowSelection`

```tsx
enableMultiRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

- テーブル内のすべての行に対して複数行選択を有効/無効にする OR
- 行を受け取り、その行の子/孫行に対する複数行選択を有効/無効にするかどうかを返す関数

### `enableSubRowSelection`

```tsx
enableSubRowSelection?: boolean | ((row: Row<TData>) => boolean)
```

親行が選択されたときに自動的にサブ行を選択するかどうかを有効/無効にする、または各行に対して自動サブ行選択を有効/無効にする関数。

(展開またはグループ化機能と組み合わせて使用)

### `onRowSelectionChange`

```tsx
onRowSelectionChange?: OnChangeFn<RowSelectionState>
```

提供された場合、`state.rowSelection`が変更されるとこの関数が`updaterFn`と共に呼び出されます。これによりデフォルトの内部ステート管理が上書きされるため、テーブルの外部でステート変更を完全または部分的に永続化する必要があります。

## テーブルAPI (Table API)

### `getToggleAllRowsSelectedHandler`

```tsx
getToggleAllRowsSelectedHandler: () => (event: unknown) => void
```

テーブル内のすべての行をトグルするために使用できるハンドラーを返します。

### `getToggleAllPageRowsSelectedHandler`

```tsx
getToggleAllPageRowsSelectedHandler: () => (event: unknown) => void
```

現在のページのすべての行をトグルするために使用できるハンドラーを返します。

### `setRowSelection`

```tsx
setRowSelection: (updater: Updater<RowSelectionState>) => void
```

`state.rowSelection`ステートを設定または更新します。

### `resetRowSelection`

```tsx
resetRowSelection: (defaultState?: boolean) => void
```

**rowSelection**ステートを`initialState.rowSelection`にリセットします。`true`を渡すと、デフォルトの空白ステート`{}`に強制的にリセットされます。

### `getIsAllRowsSelected`

```tsx
getIsAllRowsSelected: () => boolean
```

テーブル内のすべての行が選択されているかどうかを返します。

### `getIsAllPageRowsSelected`

```tsx
getIsAllPageRowsSelected: () => boolean
```

現在のページのすべての行が選択されているかどうかを返します。

### `getIsSomeRowsSelected`

```tsx
getIsSomeRowsSelected: () => boolean
```

テーブル内のいずれかの行が選択されているかどうかを返します。

注: すべての行が選択されている場合は`false`を返します。

### `getIsSomePageRowsSelected`

```tsx
getIsSomePageRowsSelected: () => boolean
```

現在のページのいずれかの行が選択されているかどうかを返します。

### `toggleAllRowsSelected`

```tsx
toggleAllRowsSelected: (value: boolean) => void
```

テーブル内のすべての行を選択/選択解除します。

### `toggleAllPageRowsSelected`

```tsx
toggleAllPageRowsSelected: (value: boolean) => void
```

現在のページのすべての行を選択/選択解除します。

### `getPreSelectedRowModel`

```tsx
getPreSelectedRowModel: () => RowModel<TData>
```

### `getSelectedRowModel`

```tsx
getSelectedRowModel: () => RowModel<TData>
```

### `getFilteredSelectedRowModel`

```tsx
getFilteredSelectedRowModel: () => RowModel<TData>
```

### `getGroupedSelectedRowModel`

```tsx
getGroupedSelectedRowModel: () => RowModel<TData>
```

## 行API (Row API)

### `getIsSelected`

```tsx
getIsSelected: () => boolean
```

行が選択されているかどうかを返します。

### `getIsSomeSelected`

```tsx
getIsSomeSelected: () => boolean
```

行のサブ行の一部が選択されているかどうかを返します。

### `getIsAllSubRowsSelected`

```tsx
getIsAllSubRowsSelected: () => boolean
```

行のすべてのサブ行が選択されているかどうかを返します。

### `getCanSelect`

```tsx
getCanSelect: () => boolean
```

行が選択可能かどうかを返します。

### `getCanMultiSelect`

```tsx
getCanMultiSelect: () => boolean
```

行が複数選択可能かどうかを返します。

### `getCanSelectSubRows`

```tsx
getCanSelectSubRows: () => boolean
```

親行が選択されたときに自動的にサブ行を選択できるかどうかを返します。

### `toggleSelected`

```tsx
toggleSelected: (value?: boolean) => void
```

行を選択/選択解除します。

### `getToggleSelectedHandler`

```tsx
getToggleSelectedHandler: () => (event: unknown) => void
```

行をトグルするために使用できるハンドラーを返します。
