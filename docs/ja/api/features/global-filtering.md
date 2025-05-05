---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:30:17.142Z'
title: グローバルフィルタリング
id: global-filtering
---
## グローバルフィルタリング (Global Filtering)

### Can-Filter

列が**グローバル**にフィルタリング可能かどうかは、以下の条件で決定されます:

- 列に有効な `accessorKey`/`accessorFn` が定義されている
- 提供されている場合、`options.getColumnCanGlobalFilter` がその列に対して `true` を返す。提供されていない場合、最初の行の値が `string` または `number` 型であれば、列はグローバルフィルタリング可能と見なされる
- `column.enableColumnFilter` が `false` に設定されていない
- `options.enableColumnFilters` が `false` に設定されていない
- `options.enableFilters` が `false` に設定されていない

### ステート (State)

フィルターの状態は、以下の形式でテーブルに保存されます:

```tsx
export interface GlobalFilterTableState {
  globalFilter: any
}
```

### フィルター関数 (Filter Functions)

グローバルフィルタリングには、カラムフィルタリングで利用可能な同じフィルター関数を使用できます。フィルター関数の詳細については、[カラムフィルタリングAPI](../api/features/column-filtering)を参照してください。

#### フィルター関数の使用

フィルター関数は、以下のいずれかを `options.globalFilterFn` に渡すことで使用/参照/定義できます:

- 組み込みフィルター関数を参照する `string`
- `options.globalFilterFn` オプションに直接提供される関数

`tableOptions.globalFilterFn` オプションで利用可能なフィルター関数の最終リストは、以下の型を使用します:

```tsx
export type FilterFnOption<TData extends AnyData> =
  | 'auto'
  | BuiltInFilterFn
  | FilterFn<TData>
```

#### フィルターメタ (Filter Meta)

データのフィルタリングは、そのデータに関する追加情報を提供することが多く、これを使って同じデータに対する他の操作を支援できます。この概念の良い例は、[`match-sorter`](https://github.com/kentcdodds/match-sorter) のようなランキングシステムで、データのランク付け、フィルタリング、並べ替えを同時に行います。`match-sorter` のようなユーティリティは、単一の次元でのフィルター+ソートタスクには非常に理にかなっていますが、テーブルを構築する際の分離されたフィルタリング/ソートアーキテクチャでは、それらを使用することが非常に難しく、遅くなります。

ランキング/フィルタリング/ソートシステムをテーブルで動作させるために、`filterFn` はオプションで結果に**フィルターメタ**値をマークし、後でデータを好みに合わせてソート/グループ化などに使用できます。これは、カスタム `filterFn` に提供される `addMeta` 関数を呼び出すことで行われます。

以下は、独自の `match-sorter-utils` パッケージ (`match-sorter` のユーティリティフォーク) を使用して、データをランク付け、フィルタリング、並べ替える例です:

```tsx
import { sortingFns } from '@tanstack/[adapter]-table'

import { rankItem, compareItems } from '@tanstack/match-sorter-utils'

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // アイテムをランク付け
  const itemRank = rankItem(row.getValue(columnId), value)

  // ランキング情報を保存
  addMeta(itemRank)

  // アイテムをフィルタリングするかどうかを返す
  return itemRank.passed
}

const fuzzySort = (rowA, rowB, columnId) => {
  let dir = 0

  // 列にランキング情報がある場合のみランクでソート
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]!,
      rowB.columnFiltersMeta[columnId]!
    )
  }

  // ランクが等しい場合の英数字フォールバックを提供
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

### カラム定義オプション (Column Def Options)

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

このカラムの**グローバル**フィルターを有効/無効にします。

### カラムAPI (Column API)

#### `getCanGlobalFilter`

```tsx
getCanGlobalFilter: () => boolean
```

カラムが**グローバル**にフィルタリング可能かどうかを返します。グローバルフィルタリング中にカラムをスキャンしないようにするには、`false` に設定します。

### 行API (Row API)

#### `columnFiltersMeta`

```tsx
columnFiltersMeta: Record<string, any>
```

行のカラムフィルターメタマップ。このオブジェクトは、フィルタリングプロセス中にオプションで提供される行のフィルターメタを追跡します。

### テーブルオプション (Table Options)

#### `filterFns`

```tsx
filterFns?: Record<string, FilterFn>
```

このオプションを使用すると、カラムの `filterFn` オプションでキーによって参照できるカスタムフィルター関数を定義できます。
例:

```tsx
declare module '@tanstack/table-core' {
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

#### `filterFromLeafRows`

```tsx
filterFromLeafRows?: boolean
```

デフォルトでは、フィルタリングは親行から下に向かって行われます（親行がフィルタリングされると、そのすべての子行もフィルタリングされます）。このオプションを `true` に設定すると、フィルタリングはリーフ行から上に向かって行われます（つまり、親行は、その子行または孫行のいずれかが含まれている限り含まれます）。

#### `maxLeafRowFilterDepth`

```tsx
maxLeafRowFilterDepth?: number
```

デフォルトでは、フィルタリングはすべての行（最大深度100）に対して行われ、それらがルートレベルの親行であっても、親行の子リーフ行であっても関係ありません。このオプションを `0` に設定すると、フィルタリングはルートレベルの親行にのみ適用され、すべてのサブ行はフィルタリングされません。同様に、このオプションを `1` に設定すると、フィルタリングは1レベルの深さの子リーフ行にのみ適用されます。

これは、適用されたフィルターに関係なく、行の子階層全体を表示したい場合に役立ちます。

#### `enableFilters`

```tsx
enableFilters?: boolean
```

テーブルのすべてのフィルターを有効/無効にします。

#### `manualFiltering`

```tsx
manualFiltering?: boolean
```

`getFilteredRowModel` を使用してデータをフィルタリングすることを無効にします。これは、テーブルがクライアントサイドとサーバーサイドのフィルタリングを動的にサポートする必要がある場合に役立ちます。

#### `getFilteredRowModel`

```tsx
getFilteredRowModel?: (
  table: Table<TData>
) => () => RowModel<TData>
```

提供されている場合、この関数はテーブルごとに**1回**呼び出され、フィルタリングされたときにテーブルの行モデルを計算して返す**新しい関数**を返す必要があります。

- サーバーサイドフィルタリングの場合、この関数は不要であり、無視できます。サーバーはすでにフィルタリングされた行モデルを返すべきです。
- クライアントサイドフィルタリングの場合、この関数は必須です。デフォルトの実装は、任意のテーブルアダプターの `{ getFilteredRowModel }` エクスポートを介して提供されます。

例:

```tsx
import { getFilteredRowModel } from '@tanstack/[adapter]-table'

  getFilteredRowModel: getFilteredRowModel(),
})
```

#### `globalFilterFn`

```tsx
globalFilterFn?: FilterFn | keyof FilterFns | keyof BuiltInFilterFns
```

グローバルフィルタリングに使用するフィルター関数。

オプション:

- [組み込みフィルター関数](#filter-functions)を参照する `string`
- `tableOptions.filterFns` オプションで提供されるカスタムフィルター関数を参照する `string`
- [カスタムフィルター関数](#filter-functions)

#### `onGlobalFilterChange`

```tsx
onGlobalFilterChange?: OnChangeFn<GlobalFilterState>
```

提供されている場合、この関数は `state.globalFilter` が変更されると `updaterFn` とともに呼び出されます。これにより、デフォルトの内部状態管理が上書きされるため、状態の変更を完全にまたは部分的にテーブルの外部で永続化する必要があります。

#### `enableGlobalFilter`

```tsx
enableGlobalFilter?: boolean
```

テーブルのグローバルフィルターを有効/無効にします。

#### `getColumnCanGlobalFilter`

```tsx
getColumnCanGlobalFilter?: (column: Column<TData>) => boolean
```

提供されている場合、この関数はカラムとともに呼び出され、このカラムをグローバルフィルタリングに使用するかどうかを示す `true` または `false` を返す必要があります。
これは、カラムに `string` や `number` ではないデータ（例: `undefined`）が含まれる場合に役立ちます。

### テーブルAPI (Table API)

#### `getPreFilteredRowModel`

```tsx
getPreFilteredRowModel: () => RowModel<TData>
```

**カラム**フィルタリングが適用される前のテーブルの行モデルを返します。

#### `getFilteredRowModel`

```tsx
getFilteredRowModel: () => RowModel<TData>
```

**カラム**フィルタリングが適用された後のテーブルの行モデルを返します。

#### `setGlobalFilter`

```tsx
setGlobalFilter: (updater: Updater<any>) => void
```

`state.globalFilter` 状態を設定または更新します。

#### `resetGlobalFilter`

```tsx
resetGlobalFilter: (defaultState?: boolean) => void
```

**globalFilter** 状態を `initialState.globalFilter` にリセットします。または、`true` を渡すと、デフォルトの空白状態に強制的にリセットされ `undefined` になります。

#### `getGlobalAutoFilterFn`

```tsx
getGlobalAutoFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

現在、この関数は組み込みの `includesString` フィルター関数を返します。将来のリリースでは、提供されたデータの性質に基づいて、より動的なフィルター関数を返す可能性があります。

#### `getGlobalFilterFn`

```tsx
getGlobalFilterFn: (columnId: string) => FilterFn<TData> | undefined
```

テーブルのグローバルフィルター関数（ユーザー定義または自動、設定に応じて）を返します。
