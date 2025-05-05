---
source-updated-at: '2024-02-27T21:03:18.000Z'
translation-updated-at: '2025-05-05T19:29:53.716Z'
title: ページネーション
id: pagination
---
## ステート (State)

ページネーションの状態は、以下の形式でテーブルに保存されます。

```tsx
export type PaginationState = {
  pageIndex: number
  pageSize: number
}

export type PaginationTableState = {
  pagination: PaginationState
}

export type PaginationInitialTableState = {
  pagination?: Partial<PaginationState>
}
```

## テーブルオプション (Table Options)

### `manualPagination`

```tsx
manualPagination?: boolean
```

手動ページネーションを有効にします。このオプションを `true` に設定すると、テーブルは `getPaginationRowModel()` を使用して行を自動的にページ分割せず、代わりに行を手動でページ分割してテーブルに渡すことが期待されます。これはサーバーサイドページネーションや集計を行う場合に便利です。

### `pageCount`

```tsx
pageCount?: number
```

手動でページネーションを制御する場合、総 `pageCount` 値をテーブルに提供できます。ページ数がわからない場合は、これを `-1` に設定できます。または、`rowCount` 値を提供すると、テーブルは内部で `pageCount` を計算します。

### `rowCount`

```tsx
rowCount?: number
```

手動でページネーションを制御する場合、総 `rowCount` 値をテーブルに提供できます。`pageCount` は `rowCount` と `pageSize` から内部で計算されます。

### `autoResetPageIndex`

```tsx
autoResetPageIndex?: boolean
```

`true` に設定すると、ページネーションはページ変更状態の変化（例: `data` の更新、フィルターの変更、グループ化の変更など）に伴って最初のページにリセットされます。

> 🧠 注意: このオプションは `manualPagination` が `true` の場合、デフォルトで `false` になります

### `onPaginationChange`

```tsx
onPaginationChange?: OnChangeFn<PaginationState>
```

この関数が提供されている場合、ページネーション状態が変更されると呼び出され、状態を自身で管理することが期待されます。管理された状態は `tableOptions.state.pagination` オプションを介してテーブルに戻すことができます。

### `getPaginationRowModel`

```tsx
getPaginationRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

ページネーションが適用された後の行モデルを返しますが、それ以上は適用しません。

ページネーション列はデフォルトで自動的に列リストの先頭に並べ替えられます。削除したりそのままにしたい場合は、適切なモードを設定してください。

## テーブルAPI (Table API)

### `setPagination`

```tsx
setPagination: (updater: Updater<PaginationState>) => void
```

`state.pagination` 状態を設定または更新します。

### `resetPagination`

```tsx
resetPagination: (defaultState?: boolean) => void
```

**ページネーション**状態を `initialState.pagination` にリセットします。`true` を渡すと、デフォルトの空白状態 `[]` に強制的にリセットされます。

### `setPageIndex`

```tsx
setPageIndex: (updater: Updater<number>) => void
```

提供された関数または値を使用してページインデックスを更新します。

### `resetPageIndex`

```tsx
resetPageIndex: (defaultState?: boolean) => void
```

ページインデックスを初期状態にリセットします。`defaultState` が `true` の場合、初期状態に関係なくページインデックスは `0` にリセットされます。

### `setPageSize`

```tsx
setPageSize: (updater: Updater<number>) => void
```

提供された関数または値を使用してページサイズを更新します。

### `resetPageSize`

```tsx
resetPageSize: (defaultState?: boolean) => void
```

ページサイズを初期状態にリセットします。`defaultState` が `true` の場合、初期状態に関係なくページサイズは `10` にリセットされます。

### `getPageOptions`

```tsx
getPageOptions: () => number[]
```

現在のページサイズに対するページオプション（ゼロベース）の配列を返します。

### `getCanPreviousPage`

```tsx
getCanPreviousPage: () => boolean
```

テーブルが前のページに移動できるかどうかを返します。

### `getCanNextPage`

```tsx
getCanNextPage: () => boolean
```

テーブルが次のページに移動できるかどうかを返します。

### `previousPage`

```tsx
previousPage: () => void
```

可能であれば、ページインデックスを1つ減らします。

### `nextPage`

```tsx
nextPage: () => void
```

可能であれば、ページインデックスを1つ増やします。

### `firstPage`

```tsx
firstPage: () => void
```

ページインデックスを `0` に設定します。

### `lastPage`

```tsx
lastPage: () => void
```

ページインデックスを最後の利用可能なページに設定します。

### `getPageCount`

```tsx
getPageCount: () => number
```

ページ数を返します。手動でページネーションを制御している場合、これは `options.pageCount` テーブルオプションから直接取得されます。それ以外の場合は、総行数と現在のページサイズを使用してテーブルデータから計算されます。

### `getPrePaginationRowModel`

```tsx
getPrePaginationRowModel: () => RowModel<TData>
```

ページネーションが適用される前のテーブルの行モデルを返します。

### `getPaginationRowModel`

```tsx
getPaginationRowModel: () => RowModel<TData>
```

ページネーションが適用された後のテーブルの行モデルを返します。
