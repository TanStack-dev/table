---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:29:11.249Z'
title: テーブル
---
```markdown
## `createAngularTable` / `useReactTable` / `createSolidTable` / `useQwikTable` / `useVueTable` / `createSvelteTable`

```tsx
type useReactTable = <TData extends AnyData>(
  options: TableOptions<TData>
) => Table<TData>
```

これらの関数はテーブルを作成するために使用されます。使用する関数は、使用しているフレームワークアダプターによって異なります。

## オプション

これらはテーブルの**コア**オプションとAPIプロパティです。他の[テーブル機能](../guide/features)にはさらに多くのオプションとAPIプロパティが利用可能です。

### `data`

```tsx
data: TData[]
```

テーブルに表示するデータ。この配列は`table.setRowType<...>`に指定した型と一致する必要がありますが、理論的には任意の配列を指定できます。配列の各要素はキー/値のオブジェクトであることが一般的ですが、必須ではありません。カラムは文字列/インデックスまたは関数アクセサーを通じてこのデータにアクセスし、任意の値を返すことができます。

`data`オプションの参照が変更されると（`Object.is`で比較）、テーブルはデータを再処理します。コアデータモデルに依存する他のデータ処理（グループ化、ソート、フィルタリングなど）も再処理されます。

> 🧠 テーブルに再処理させたい場合にのみ`data`オプションを変更するようにしてください。インラインの`[]`を指定したり、テーブルをレンダリングするたびに新しいデータ配列を構築すると、不要な再処理が大量に発生します。小規模なテーブルでは気付きにくいかもしれませんが、大規模なテーブルでは明らかになるでしょう。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

テーブルで使用するカラム定義の配列。カラム定義の作成方法については[カラム定義ガイド](../../docs/guide/column-defs)を参照してください。

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TData>>
```

テーブルに渡されるすべてのカラム定義で使用するデフォルトのカラムオプション。デフォルトのセル/ヘッダー/フッターレンダラー、ソート/フィルタリング/グループ化オプションなどを提供するのに便利です。`options.columns`に渡されるすべてのカラム定義は、このデフォルトカラム定義とマージされて最終的なカラム定義が生成されます。

### `initialState`

```tsx
initialState?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

このオプションを使用して、テーブルに初期状態をオプションで渡します。この状態は、テーブルによって自動的に（例: `options.autoResetPageIndex`）または`table.resetRowSelection()`などの関数によってさまざまなテーブル状態をリセットする際に使用されます。ほとんどのリセット関数では、初期状態ではなく空白/デフォルト状態にリセットするためのフラグをオプションで渡すことができます。

> 🧠 このオブジェクトが変更されてもテーブル状態はリセットされません。つまり、初期状態オブジェクトは安定している必要はありません。

### `autoResetAll`

```tsx
autoResetAll?: boolean
```

このオプションを設定すると、すべての`autoReset...`機能オプションを上書きします。

### `meta`

```tsx
meta?: TableMeta // このインターフェースは宣言マージで拡張可能です。下記を参照！
```

任意のオブジェクトを`options.meta`に渡すことができ、`table.options.meta`を通じて`table`が利用可能な場所であればどこからでもアクセスできます。この型はすべてのテーブルでグローバルであり、次のように拡張できます:

```tsx
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    foo: string
  }
}
```

> 🧠 このオプションは、テーブルの任意の「コンテキスト」として考えてください。これは、テーブルが触れるすべてのものに渡すことなく、任意のデータや関数をテーブルに渡す優れた方法です。良い例は、日付、数値などのフォーマットに使用するロケールオブジェクトをテーブルに渡したり、[編集可能データの例](../framework/react/examples/editable-data)のように編集可能なデータを更新するために使用できる関数を渡すことです。

### `state`

```tsx
state?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

`state`オプションは、テーブル状態の一部または全部をオプションで**制御**するために使用できます。ここに渡す状態は、内部で自動管理されている状態とマージされ、上書きされてテーブルの最終的な状態が生成されます。また、`onStateChange`オプションを通じて状態の変更を監視することもできます。

### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

`onStateChange`オプションは、テーブル内の状態変更をオプションで監視するために使用できます。このオプションを提供する場合、テーブル状態の制御と更新は自分で行う必要があります。`state`オプションを使用して状態をテーブルに戻すことができます。

### `debugAll`

> ⚠️ デバッグは開発モードでのみ利用可能です。

```tsx
debugAll?: boolean
```

このオプションをtrueに設定すると、すべてのデバッグ情報がコンソールに出力されます。

### `debugTable`

> ⚠️ デバッグは開発モードでのみ利用可能です。

```tsx
debugTable?: boolean
```

このオプションをtrueに設定すると、テーブルのデバッグ情報がコンソールに出力されます。

### `debugHeaders`

> ⚠️ デバッグは開発モードでのみ利用可能です。

```tsx
debugHeaders?: boolean
```

このオプションをtrueに設定すると、ヘッダーのデバッグ情報がコンソールに出力されます。

### `debugColumns`

> ⚠️ デバッグは開発モードでのみ利用可能です。

```tsx
debugColumns?: boolean
```

このオプションをtrueに設定すると、カラムのデバッグ情報がコンソールに出力されます。

### `debugRows`

> ⚠️ デバッグは開発モードでのみ利用可能です。

```tsx
debugRows?: boolean
```

このオプションをtrueに設定すると、行のデバッグ情報がコンソールに出力されます。

### `_features`

```tsx
_features?: TableFeature[]
```

テーブルインスタンスに追加できる追加機能の配列。

### `render`

> ⚠️ このオプションはテーブルアダプターを実装する場合にのみ必要です。

```tsx
type render = <TProps>(template: Renderable<TProps>, props: TProps) => any
```

`render`オプションは、テーブルにレンダラー実装を提供します。この実装は、テーブルのさまざまなカラムヘッダーとセルのテンプレートを、ユーザーのフレームワークでサポートされている結果に変換するために使用されます。

### `mergeOptions`

> ⚠️ このオプションはテーブルアダプターを実装する場合にのみ必要です。

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

このオプションは、テーブルオプションのマージをオプションで実装するために使用されます。solid-jsなどの一部のフレームワークは、リアクティビティと使用状況を追跡するためにプロキシを使用するため、リアクティブオブジェクトのマージは慎重に処理する必要があります。このオプションは、このプロセスの制御をアダプターに逆転させます。

### `getCoreRowModel`

```tsx
getCoreRowModel: (table: Table<TData>) => () => RowModel<TData>
```

この必須オプションは、テーブルのコア行モデルを計算して返す関数のファクトリです。テーブルごとに**1回**呼び出され、テーブルの行モデルを計算して返す**新しい関数**を返す必要があります。

デフォルトの実装は、任意のテーブルアダプターの`{ getCoreRowModel }`エクスポートを通じて提供されます。

### `getSubRows`

```tsx
getSubRows?: (
  originalRow: TData,
  index: number
) => undefined | TData[]
```

このオプションの関数は、任意の行のサブ行にアクセスするために使用されます。ネストされた行を使用している場合、この関数を使用して行からサブ行オブジェクト（またはundefined）を返す必要があります。

### `getRowId`

```tsx
getRowId?: (
  originalRow: TData,
  index: number,
  parent?: Row<TData>
) => string
```

このオプションの関数は、任意の行の一意のIDを導出するために使用されます。提供されない場合、行のインデックスが使用されます（ネストされた行は、祖父母のインデックスと`.`で結合されます。例: `index.index.index`）。サーバー側の操作から発生する個々の行を識別する必要がある場合は、ネットワークIO/あいまいさに関係なく意味のあるID（userId、taskId、データベースIDフィールドなど）を返すためにこの関数を使用することをお勧めします。

## テーブルAPI

これらのプロパティとメソッドはテーブルオブジェクトで利用できます:

### `initialState`

```tsx
initialState: VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
```

これはテーブルの解決された初期状態です。

### `reset`

```tsx
reset: () => void
```

この関数を呼び出すと、テーブル状態が初期状態にリセットされます。

### `getState`

```tsx
getState: () => TableState
```

この関数を呼び出すと、テーブルの現在の状態を取得できます。特にテーブル状態を手動で管理する場合、この関数とその状態を使用することをお勧めします。これは、テーブルが提供するすべての機能と関数で内部で使用されている状態とまったく同じです。

> 🧠 この関数によって返される状態は、自動管理される内部テーブル状態と`options.state`を介して手動で管理される状態の浅いマージ結果です。

### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

この関数を呼び出すと、テーブル状態を更新できます。状態を更新するために`(prevState) => newState`の形式のアップデータ関数を渡すことをお勧めしますが、直接オブジェクトを渡すこともできます。

> 🧠 `options.onStateChange`が提供されている場合、この関数によって新しい状態でトリガーされます。

### `options`

```tsx
options: TableOptions<TData>
```

テーブルの現在のオプションへの読み取り専用参照。

> ⚠️ このプロパティは一般的に内部またはアダプターによって使用されます。新しいオプションをテーブルに渡すことで更新できます。これはアダプターごとに異なります。アダプター自体の場合、テーブルオプションは`setOptions`関数を介して更新する必要があります。

### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TData>>) => void
```

> ⚠️ この関数は一般的にアダプターがテーブルオプションを更新するために使用されます。テーブルオプションを直接更新するために使用できますが、テーブルオプションを更新するためのアダプターの戦略をバイパスすることは一般的に推奨されません。

### `getCoreRowModel`

```tsx
getCoreRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

処理が適用される前のコア行モデルを返します。

### `getRowModel`

```tsx
getRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

他の使用された機能からのすべての処理が適用された後の最終モデルを返します。

### `getAllColumns`

```tsx
type getAllColumns = () => Column<TData>[]
```

テーブルに渡されたカラム定義からミラーリングされた、正規化されネストされた階層内のすべてのカラムを返します。

### `getAllFlatColumns`

```tsx
type getAllFlatColumns = () => Column<TData>[]
```

階層全体の親カラムオブジェクトを含む、単一レベルに平坦化されたテーブル内のすべてのカラムを返します。

### `getAllLeafColumns`

```tsx
type getAllLeafColumns = () => Column<TData>[]
```

親カラムを含まない、単一レベルに平坦化されたテーブル内のすべてのリーフノードカラムを返します。

### `getColumn`

```tsx
type getColumn = (id: string) => Column<TData> | undefined
```

IDで単一のカラムを返します。

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

テーブルのヘッダーグループを返します。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

テーブルのフッターグループを返します。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData>[]
```

親ヘッダーを含む、テーブルのHeaderオブジェクトの平坦化された配列を返します。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

テーブルのリーフノードHeaderオブジェクトの平坦化された配列を返します。
```
