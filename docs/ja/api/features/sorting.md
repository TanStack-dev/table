---
source-updated-at: '2024-04-13T00:46:18.000Z'
translation-updated-at: '2025-05-05T19:30:20.145Z'
title: ソート
id: sorting
---
## ソート状態 (State)

ソート状態はテーブル上で以下の形式で保持されます:

```tsx
export type SortDirection = 'asc' | 'desc'

export type ColumnSort = {
  id: string
  desc: boolean
}

export type SortingState = ColumnSort[]

export type SortingTableState = {
  sorting: SortingState
}
```

## ソート関数 (Sorting Functions)

テーブルコアには以下の組み込みソート関数が用意されています:

- `alphanumeric`
  - 大文字小文字を区別せず、英数字混合の値をソートします。速度は遅いですが、自然なソートが必要な数値を含む文字列に対してより正確です。
- `alphanumericCaseSensitive`
  - 大文字小文字を区別して、英数字混合の値をソートします。速度は遅いですが、自然なソートが必要な数値を含む文字列に対してより正確です。
- `text`
  - 大文字小文字を区別せず、テキスト/文字列値をソートします。高速ですが、自然なソートが必要な数値を含む文字列に対しては精度が低くなります。
- `textCaseSensitive`
  - 大文字小文字を区別して、テキスト/文字列値をソートします。高速ですが、自然なソートが必要な数値を含む文字列に対しては精度が低くなります。
- `datetime`
  - 日時でソートします。値が `Date` オブジェクトの場合に使用します。
- `basic`
  - 基本的な `a > b ? 1 : a < b ? -1 : 0` 比較を使用してソートします。最も高速なソート関数ですが、精度は最も低くなる可能性があります。

各ソート関数は2つの行と列IDを受け取り、列IDを使用して2つの行を比較し、昇順で `-1`、`0`、または `1` を返すことが期待されます。以下は早見表です:

| 戻り値 | 昇順         |
| ------ | ------------ |
| `-1`   | `a < b`      |
| `0`    | `a === b`    |
| `1`    | `a > b`      |

すべてのソート関数の型シグネチャは以下の通りです:

```tsx
export type SortingFn<TData extends AnyData> = {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}
```

#### ソート関数の使用

ソート関数は以下のいずれかを `columnDefinition.sortingFn` に渡すことで使用/参照/定義できます:

- 組み込みソート関数を参照する `string`
- `tableOptions.sortingFns` オプションで提供されるカスタムソート関数を参照する `string`
- `columnDefinition.sortingFn` オプションに直接提供される関数

`columnDef.sortingFn` で使用可能な最終的なソート関数のリストは以下の型を使用します:

```tsx
export type SortingFnOption<TData extends AnyData> =
  | 'auto'
  | SortingFns
  | BuiltInSortingFns
  | SortingFn<TData>
```

## 列定義オプション (Column Def Options)

### `sortingFn`

```tsx
sortingFn?: SortingFn | keyof SortingFns | keyof BuiltInSortingFns
```

この列で使用するソート関数。

オプション:
- [組み込みソート関数](#sorting-functions) を参照する `string`
- [カスタムソート関数](#sorting-functions)

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

この列のソートトグルを降順で開始する場合は `true` に設定します。

### `enableSorting`

```tsx
enableSorting?: boolean
```

この列のソートを有効/無効にします。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

この列のマルチソートを有効/無効にします。

### `invertSorting`

```tsx
invertSorting?: boolean
```

この列のソート順序を反転します。これは、低い数字が良いことを示す逆のベスト/ワーストスケールを持つ値（例: ランキング（1位、2位、3位）やゴルフのようなスコアリング）に有用です。

### `sortUndefined`

```tsx
sortUndefined?: 'first' | 'last' | false | -1 | 1 // デフォルトは 1
```

- `'first'`
  - 未定義の値はリストの先頭に移動します
- `'last'`
  - 未定義の値はリストの末尾に移動します
- `false`
  - 未定義の値は同値と見なされ、次の列フィルターまたは元のインデックス（該当する場合）でソートする必要があります
- `-1`
  - 未定義の値はより高い優先度（昇順）でソートされます（昇順の場合、未定義はリストの先頭に表示されます）
- `1`
  - 未定義の値はより低い優先度（降順）でソートされます（昇順の場合、未定義はリストの末尾に表示されます）

> 注: `'first'` と `'last'` オプションは v8.16.0 で新しく追加されました

## 列API (Column API)

### `getAutoSortingFn`

```tsx
getAutoSortingFn: () => SortingFn<TData>
```

列の値に基づいて自動的に推論されたソート関数を返します。

### `getAutoSortDir`

```tsx
getAutoSortDir: () => SortDirection
```

列の値に基づいて自動的に推論されたソート方向を返します。

### `getSortingFn`

```tsx
getSortingFn: () => SortingFn<TData>
```

この列に使用される解決済みのソート関数を返します。

### `getNextSortingOrder`

```tsx
getNextSortingOrder: () => SortDirection | false
```

次のソート順序を返します。

### `getCanSort`

```tsx
getCanSort: () => boolean
```

この列がソート可能かどうかを返します。

### `getCanMultiSort`

```tsx
getCanMultiSort: () => boolean
```

この列がマルチソート可能かどうかを返します。

### `getSortIndex`

```tsx
getSortIndex: () => number
```

ソート状態内でのこの列のソート位置インデックスを返します。

### `getIsSorted`

```tsx
getIsSorted: () => false | SortDirection
```

この列がソートされているかどうかを返します。

### `getFirstSortDir`

```tsx 
getFirstSortDir: () => SortDirection
```

この列をソートする際に使用される最初の方向を返します。

### `clearSorting`

```tsx
clearSorting: () => void
```

この列をテーブルのソート状態から削除します。

### `toggleSorting`

```tsx
toggleSorting: (desc?: boolean, isMulti?: boolean) => void
```

この列のソート状態をトグルします。`desc` が指定されている場合、ソート方向はその値に強制されます。`isMulti` が指定されている場合、列を追加的にマルチソートします（または既にソートされている場合はトグルします）。

### `getToggleSortingHandler`

```tsx
getToggleSortingHandler: () => undefined | ((event: unknown) => void)
```

この列のソート状態をトグルするために使用できる関数を返します。これは列ヘッダーにクリックハンドラーをアタッチする際に便利です。

## テーブルオプション (Table Options)

### `sortingFns`

```tsx
sortingFns?: Record<string, SortingFn>
```

このオプションを使用すると、カスタムソート関数を定義でき、そのキーを列の `sortingFn` オプションで参照できます。
例:

```tsx
declare module '@tanstack/table-core' {
  interface SortingFns {
    myCustomSorting: SortingFn<unknown>
  }
}

const column = columnHelper.data('key', {
  sortingFn: 'myCustomSorting',
})

const table = useReactTable({
  columns: [column],
  sortingFns: {
    myCustomSorting: (rowA: any, rowB: any, columnId: any): number =>
      rowA.getValue(columnId).value < rowB.getValue(columnId).value ? 1 : -1,
  },
})
```

### `manualSorting`

```tsx
manualSorting?: boolean
```

テーブルの手動ソートを有効にします。これが `true` の場合、データをテーブルに渡す前にソートする必要があります。これはサーバーサイドソートを行う場合に便利です。

### `onSortingChange`

```tsx
onSortingChange?: OnChangeFn<SortingState>
```

提供されている場合、この関数は `state.sorting` が変更されると `updaterFn` と共に呼び出されます。これによりデフォルトの内部状態管理が上書きされるため、テーブルの外部で状態変更を完全または部分的に永続化する必要があります。

### `enableSorting`

```tsx
enableSorting?: boolean
```

テーブルのソートを有効/無効にします。

### `enableSortingRemoval`

```tsx
enableSortingRemoval?: boolean
```

テーブルのソート削除機能を有効/無効にします。
- `true` の場合、ソート順序は次のように循環します: 'none' -> 'desc' -> 'asc' -> 'none' -> ...
- `false` の場合、ソート順序は次のように循環します: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...

### `enableMultiRemove`

```tsx
enableMultiRemove?: boolean
```

マルチソートの削除機能を有効/無効にします。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

テーブルのマルチソートを有効/無効にします。

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

`true` の場合、すべてのソートは最初のトグル状態として降順をデフォルトとします。

### `getSortedRowModel`

```tsx
getSortedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

この関数はソートされた行モデルを取得するために使用されます。サーバーサイドソートを使用している場合、この関数は必要ありません。クライアントサイドソートを使用するには、アダプターからエクスポートされた `getSortedRowModel()` をテーブルに渡すか、独自の実装を提供します。

### `maxMultiSortColCount`

```tsx
maxMultiSortColCount?: number
```

マルチソート可能な列の最大数を設定します。

### `isMultiSortEvent`

```tsx
isMultiSortEvent?: (e: unknown) => boolean
```

マルチソートイベントをトリガーするかどうかを判断するためのカスタム関数を渡します。これはソートトグルハンドラーからのイベントを受け取り、イベントがマルチソートをトリガーする必要がある場合は `true` を返す必要があります。

## テーブルAPI (Table API)

### `setSorting`

```tsx
setSorting: (updater: Updater<SortingState>) => void
```

`state.sorting` 状態を設定または更新します。

### `resetSorting`

```tsx
resetSorting: (defaultState?: boolean) => void
```

**ソート**状態を `initialState.sorting` にリセットします。または `true` を渡してデフォルトの空白状態 `[]` に強制的にリセットします。

### `getPreSortedRowModel`

```tsx
getPreSortedRowModel: () => RowModel<TData>
```

ソートが適用される前のテーブルの行モデルを返します。

### `getSortedRowModel`

```tsx
getSortedRowModel: () => RowModel<TData>
```

ソートが適用された後のテーブルの行モデルを返します。
