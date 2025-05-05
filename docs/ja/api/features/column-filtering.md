---
source-updated-at: '2024-03-27T23:32:27.000Z'
translation-updated-at: '2025-05-05T19:29:52.520Z'
title: カラムフィルタリング
id: column-filtering
---
## カラムフィルタリングAPI

TanStack Tableのコアは**フレームワーク非依存**であり、使用するフレームワークに関係なくAPIは同じです。各フレームワーク向けのアダプターが提供されており、テーブルコアを簡単に操作できます。利用可能なアダプターについては、Adaptersメニューを参照してください。

## Can-Filter

カラムが**カラム**フィルタリング可能かどうかは、以下によって決定されます：

- カラムが有効な`accessorKey`/`accessorFn`で定義されている
- `column.enableColumnFilter`が`false`に設定されていない
- `options.enableColumnFilters`が`false`に設定されていない
- `options.enableFilters`が`false`に設定されていない

## ステート

フィルタリングの状態は、以下の形式でテーブルに保存されます：

```tsx
export interface ColumnFiltersTableState {
  columnFilters: ColumnFiltersState
}

export type ColumnFiltersState = ColumnFilter[]

export interface ColumnFilter {
  id: string
  value: unknown
}
```

## フィルタ関数

以下のフィルタ関数がテーブルコアに組み込まれています：

- `includesString`
  - 大文字小文字を区別しない文字列包含
- `includesStringSensitive`
  - 大文字小文字を区別する文字列包含
- `equalsString`
  - 大文字小文字を区別しない文字列一致
- `equalsStringSensitive`
  - 大文字小文字を区別する文字列一致
- `arrIncludes`
  - 配列内のアイテム包含
- `arrIncludesAll`
  - 配列内の全アイテム包含
- `arrIncludesSome`
  - 配列内の一部アイテム包含
- `equals`
  - オブジェクト/参照一致 `Object.is`/`===`
- `weakEquals`
  - 弱いオブジェクト/参照一致 `==`
- `inNumberRange`
  - 数値範囲包含

各フィルタ関数は以下を受け取ります：

- フィルタリングする行
- 行の値を取得するためのcolumnId
- フィルタ値

そして、行がフィルタリングされた行に含まれるべき場合は`true`を、削除されるべき場合は`false`を返します。

これが各フィルタ関数の型シグネチャです：

```tsx
export type FilterFn<TData extends AnyData> = {
  (
    row: Row<TData>,
    columnId: string,
    filterValue: any,
    addMeta: (meta: any) => void
  ): boolean
  resolveFilterValue?: TransformFilterValueFn<TData>
  autoRemove?: ColumnFilterAutoRemoveTestFn<TData>
  addMeta?: (meta?: any) => void
}

export type TransformFilterValueFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => unknown

export type ColumnFilterAutoRemoveTestFn<TData extends AnyData> = (
  value: any,
  column?: Column<TData>
) => boolean

export type CustomFilterFns<TData extends AnyData> = Record<
  string,
  FilterFn<TData>
>
```

### `filterFn.resolveFilterValue`

任意の`filterFn`に設定可能なこの「ハンギング」メソッドは、フィルタ関数に渡される前にフィルタ値を変換/サニタイズ/フォーマットできます。

### `filterFn.autoRemove`

任意の`filterFn`に設定可能なこの「ハンギング」メソッドは、フィルタ値を受け取り、そのフィルタ値をフィルタ状態から削除すべきかどうかを`true`/`false`で返します。例えば、一部のブール型フィルタでは、フィルタ値が`false`に設定されている場合にフィルタ値をテーブル状態から削除したい場合があります。

#### フィルタ関数の使用

フィルタ関数は、以下を`columnDefinition.filterFn`に渡すことで使用/参照/定義できます：

- 組み込みフィルタ関数を参照する`文字列`
- `columnDefinition.filterFn`オプションに直接提供される関数

`columnDef.filterFn`オプションで利用可能な最終的なフィルタ関数のリストは、以下の型を使用します：

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### フィルタメタ

データのフィルタリングは、しばしばデータに関する追加情報を明らかにし、同じデータに対する将来の操作を支援するために使用できます。この概念の良い例は、[`match-sorter`](https://github.com/kentcdodds/match-sorter)のようなランキングシステムで、データのランク付け、フィルタリング、並べ替えを同時に行います。`match-sorter`のようなユーティリティは、単一次元のフィルタ+ソートタスクには非常に理にかなっていますが、テーブルを構築する際の分離されたフィルタリング/ソートアーキテクチャでは、それらを使用することが非常に難しく、遅くなります。

ランキング/フィルタリング/ソートシステムをテーブルで機能させるために、`filterFn`はオプションで結果に**フィルタメタ**値をマークでき、これは後でデータを好きなようにソート/グループ化するために使用できます。これは、カスタム`filterFn`に提供される`addMeta`関数を呼び出すことで行われます。

以下は、`match-sorter-utils`パッケージ（`match-sorter`のユーティリティフォーク）を使用してデータのランク付け、フィルタリング、並べ替えを行う例です：

```tsx
import { sortingFns } from '@tanstack/react-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // アイテムのランク付け
  const itemRank = rankItem(row.getValue(columnId), value)

  // ランキング情報を保存
  addMeta(itemRank)

  // アイテムがフィルタリングされるべきかどうかを返す
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // カラムにランキング情報がある場合のみランクでソート
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // アイテムランクが等しい場合の英数字フォールバックを提供
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

## カラム定義オプション

### `filterFn`

```tsx
filterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

このカラムで使用するフィルタ関数。

オプション：

- [組み込みフィルタ関数](#filter-functions)を参照する`文字列`
- [カスタムフィルタ関数](#filter-functions)

### `enableColumnFilter`

```tsx
enableColumnFilter?: boolean
```

このカラムの**カラム**フィルタを有効/無効にします。

## カラムAPI

### `getCanFilter`

```tsx
getCanFilter: () => boolean
```

カラムが**カラム**フィルタ可能かどうかを返します。

### `getFilterIndex`

```tsx
getFilterIndex: () => number
```

テーブルの`state.columnFilters`配列におけるカラムフィルタのインデックス（`-1`を含む）を返します。

### `getIsFiltered`

```tsx
getIsFiltered: () => boolean
```

カラムが現在フィルタされているかどうかを返します。

### `getFilterValue`

```tsx
getFilterValue: () => unknown
```

カラムの現在のフィルタ値を返します。

### `setFilterValue`

```tsx
setFilterValue: (updater: Updater<any>) => void
```

カラムの現在のフィルタ値を設定する関数。値または既存の値に対して不変性を保った操作を行うアップデーター関数を渡せます。

### `getAutoFilterFn`

```tsx
getAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

カラムの最初の既知の値に基づいて自動計算されたフィルタ関数を返します。

### `getFilterFn`

```tsx
getFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

指定されたcolumnIdのフィルタ関数（ユーザー定義または自動、設定に応じて）を返します。

## 行API

### `columnFilters`

```tsx
columnFilters: Record<string, boolean>
```

行のカラムフィルタマップ。このオブジェクトは、行が特定のフィルタを通過/失敗しているかをcolumn IDで追跡します。

### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

行のカラムフィルタメタマップ。このオブジェクトは、フィルタリングプロセス中にオプションで提供される行のフィルタメタを追跡します。

## テーブルオプション

### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

このオプションにより、カラムの`filterFn`オプションでキーによって参照できるカスタムフィルタ関数を定義できます。
例：

```tsx
declare module '@tanstack/[adapter]-table' {
  interface FilterFns {
    myCustomFilter: FilterFn<unknown>
  }
}

const column = columnHelper.data('key', {
  filterFn: 'myCustomFilter',
})

const table = useReactTable({
  columns: [column],
  filterFns: {
    myCustomFilter: (rows, columnIds, filterValue) => {
      // フィルタリングされた行を返す
    },
  },
})
```

### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

デフォルトでは、フィルタリングは親行から下に向かって行われます（親行がフィルタリングされると、そのすべての子行もフィルタリングされます）。このオプションを`true`に設定すると、フィルタリングはリーフ行から上に向かって行われます（つまり、親行は、その子または孫行のいずれかが含まれている限り含まれます）。

### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

デフォルトでは、フィルタリングはすべての行（最大深度100）に対して行われ、それらがルートレベルの親行であるか親行の子リーフ行であるかに関係ありません。このオプションを`0`に設定すると、フィルタリングはルートレベルの親行にのみ適用され、すべてのサブ行はフィルタリングされません。同様に、このオプションを`1`に設定すると、フィルタリングは1レベルの深さの子リーフ行にのみ適用されます。

これは、適用されたフィルタに関係なく行の子階層全体を表示したい場合に便利です。

### `enableFilters`

```tsx
enableFilters?: boolean
```

テーブルのすべてのフィルタを有効/無効にします。

### `manualFiltering`

```tsx
manualFiltering?: boolean
```

`getFilteredRowModel`を使用してデータをフィルタリングすることを無効にします。これは、テーブルがクライアントサイドとサーバーサイドのフィルタリングを動的にサポートする必要がある場合に役立ちます。

### `onColumnFiltersChange`

```tsx
onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
```

提供された場合、この関数は`state.columnFilters`が変更されたときに`updaterFn`とともに呼び出されます。これはデフォルトの内部状態管理をオーバーライドするため、状態変更を完全または部分的にテーブルの外部で永続化する必要があります。

### `enableColumnFilters`

```tsx
enableColumnFilters?: boolean
```

テーブルの**すべての**カラムフィルタを有効/無効にします。

### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

提供された場合、この関数はテーブルごとに**1回**呼び出され、テーブルがフィルタリングされたときに計算して行モデルを返す**新しい関数**を返す必要があります。

- サーバーサイドフィルタリングの場合、この関数は不要であり、サーバーがすでにフィルタリングされた行モデルを返すため無視できます。
- クライアントサイドフィルタリングの場合、この関数は必須です。デフォルトの実装は、任意のテーブルアダプターの`{ getFilteredRowModel }`エクスポートを介して提供されます。

例：

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'


  getFilteredRowModel: getFilteredRowModel(),
})
```

## テーブルAPI

### `setColumnFilters`

```tsx
setColumnFilters: (updater: Updater<ColumnFiltersState>) => void
```

`state.columnFilters`状態を設定または更新します。

### `resetColumnFilters`

```tsx
resetColumnFilters: (defaultState?: boolean) => void
```

**columnFilters**状態を`initialState.columnFilters`にリセットします。`true`を渡すと、デフォルトの空白状態`[]`に強制的にリセットされます。

### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

**カラム**フィルタリングが適用される前のテーブルの行モデルを返します。

### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

**カラム**フィルタリングが適用された後のテーブルの行モデルを返します。
