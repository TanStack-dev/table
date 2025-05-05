---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-05T19:30:05.770Z'
title: グループ化
id: grouping
---
## グループ化 API

## ステート (State)

グループ化の状態は、以下の形式でテーブルに保存されます:

```tsx
export type GroupingState = string[]

export type GroupingTableState = {
  grouping: GroupingState
}
```

## 集計関数 (Aggregation Functions)

以下の集計関数がテーブルコアに組み込まれています:

- `sum`
  - 行グループの値を合計します
- `min`
  - 行グループの最小値を求めます
- `max`
  - 行グループの最大値を求めます
- `extent`
  - 行グループの最小値と最大値を求めます
- `mean`
  - 行グループの平均値を求めます
- `median`
  - 行グループの中央値を求めます
- `unique`
  - 行グループの一意の値を求めます
- `uniqueCount`
  - 行グループの一意の値の数を求めます
- `count`
  - グループ内の行数を計算します

すべての集計関数は以下を受け取ります:

- グループ行のリーフ値を取得する関数
- グループ行の直接の子値を取得する関数

そして通常はプリミティブな値を返し、集計された行モデルを構築します。

これがすべての集計関数の型シグネチャです:

```tsx
export type AggregationFn<TData extends AnyData> = (
  getLeafRows: () => Row<TData>[],
  getChildRows: () => Row<TData>[]
) => any
```

#### 集計関数の使用

集計関数は、以下を`columnDefinition.aggregationFn`に渡すことで使用/参照/定義できます:

- 組み込み集計関数を参照する`string`
- `tableOptions.aggregationFns`オプションで提供されるカスタム集計関数を参照する`string`
- `columnDefinition.aggregationFn`オプションに直接提供される関数

`columnDef.aggregationFn`で利用可能な集計関数の最終的なリストは以下の型を使用します:

```tsx
export type AggregationFnOption<TData extends AnyData> =
  | 'auto'
  | keyof AggregationFns
  | BuiltInAggregationFn
  | AggregationFn<TData>
```

## カラム定義オプション (Column Def Options)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFn | keyof AggregationFns | keyof BuiltInAggregationFns
```

このカラムで使用する集計関数。

オプション:

- [組み込み集計関数](#aggregation-functions)を参照する`string`
- [カスタム集計関数](#aggregation-functions)

### `aggregatedCell`

```tsx
aggregatedCell?: Renderable<
  {
    table: Table<TData>
    row: Row<TData>
    column: Column<TData>
    cell: Cell<TData>
    getValue: () => any
    renderValue: () => any
  }
>
```

セルが集計されている場合に、カラムの各行に表示するセル。関数が渡された場合、セルのコンテキストを含むpropsオブジェクトが渡され、使用するアダプターのプロパティタイプを返す必要があります（正確なタイプは使用するアダプターによって異なります）。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

このカラムのグループ化を有効/無効にします。

### `getGroupingValue`

```tsx
getGroupingValue?: (row: TData) => any
```

このカラムで行をグループ化するために使用する値を指定します。このオプションが指定されていない場合、`accessorKey`/`accessorFn`から派生した値が代わりに使用されます。

## カラム API (Column API)

### `aggregationFn`

```tsx
aggregationFn?: AggregationFnOption<TData>
```

カラムの解決済み集計関数。

### `getCanGroup`

```tsx
getCanGroup: () => boolean
```

カラムがグループ化可能かどうかを返します。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

カラムが現在グループ化されているかどうかを返します。

### `getGroupedIndex`

```tsx
getGroupedIndex: () => number
```

グループ化状態におけるカラムのインデックスを返します。

### `toggleGrouping`

```tsx
toggleGrouping: () => void
```

カラムのグループ化状態をトグルします。

### `getToggleGroupingHandler`

```tsx
getToggleGroupingHandler: () => () => void
```

カラムのグループ化状態をトグルする関数を返します。これはボタンの`onClick`プロップに渡すのに便利です。

### `getAutoAggregationFn`

```tsx
getAutoAggregationFn: () => AggregationFn<TData> | undefined
```

カラムの自動推論された集計関数を返します。

### `getAggregationFn`

```tsx
getAggregationFn: () => AggregationFn<TData> | undefined
```

カラムの集計関数を返します。

## 行 API (Row API)

### `groupingColumnId`

```tsx
groupingColumnId?: string
```

この行がグループ化されている場合、この行がグループ化されているカラムのIDです。

### `groupingValue`

```tsx
groupingValue?: any
```

この行がグループ化されている場合、このグループ内のすべての行の`groupingColumnId`に対する一意/共有の値です。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

行が現在グループ化されているかどうかを返します。

### `getGroupingValue`

```tsx
getGroupingValue: (columnId: string) => unknown
```

任意の行とカラム（リーフ行を含む）のグループ化値を返します。

## テーブルオプション (Table Options)

### `aggregationFns`

```tsx
aggregationFns?: Record<string, AggregationFn>
```

このオプションを使用すると、カラムの`aggregationFn`オプションでキーによって参照できるカスタム集計関数を定義できます。
例:

```tsx
declare module '@tanstack/table-core' {
  interface AggregationFns {
    myCustomAggregation: AggregationFn<unknown>
  }
}

const column = columnHelper.data('key', {
  aggregationFn: 'myCustomAggregation',
})

const table = useReactTable({
  columns: [column],
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 集計値を返す
    },
  },
})
```

### `manualGrouping`

```tsx
manualGrouping?: boolean
```

手動グループ化を有効にします。このオプションが`true`に設定されている場合、テーブルは`getGroupedRowModel()`を使用して行を自動的にグループ化せず、代わりにテーブルに渡す前に手動で行をグループ化することを期待します。これはサーバーサイドでのグループ化と集計を行う場合に便利です。

### `onGroupingChange`

```tsx
onGroupingChange?: OnChangeFn<GroupingState>
```

この関数が提供されている場合、グループ化状態が変更されると呼び出され、状態を自分で管理する必要があります。管理された状態は、`tableOptions.state.grouping`オプションを介してテーブルに戻すことができます。

### `enableGrouping`

```tsx
enableGrouping?: boolean
```

すべてのカラムのグループ化を有効/無効にします。

### `getGroupedRowModel`

```tsx
getGroupedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

グループ化が行われた後の行モデルを返しますが、それ以上は行いません。

### `groupedColumnMode`

```tsx
groupedColumnMode?: false | 'reorder' | 'remove' // デフォルト: `reorder`
```

グループ化カラムはデフォルトで自動的にカラムリストの先頭に再配置されます。それらを削除するか、そのままにしたい場合は、ここで適切なモードを設定します。

## テーブル API (Table API)

### `setGrouping`

```tsx
setGrouping: (updater: Updater<GroupingState>) => void
```

`state.grouping`状態を設定または更新します。

### `resetGrouping`

```tsx
resetGrouping: (defaultState?: boolean) => void
```

**グループ化**状態を`initialState.grouping`にリセットします。`true`を渡すと、デフォルトの空白状態`[]`に強制的にリセットされます。

### `getPreGroupedRowModel`

```tsx
getPreGroupedRowModel: () => RowModel<TData>
```

グループ化が適用される前のテーブルの行モデルを返します。

### `getGroupedRowModel`

```tsx
getGroupedRowModel: () => RowModel<TData>
```

グループ化が適用された後のテーブルの行モデルを返します。

## セル API (Cell API)

### `getIsAggregated`

```tsx
getIsAggregated: () => boolean
```

セルが現在集計されているかどうかを返します。

### `getIsGrouped`

```tsx
getIsGrouped: () => boolean
```

セルが現在グループ化されているかどうかを返します。

### `getIsPlaceholder`

```tsx
getIsPlaceholder: () => boolean
```

セルが現在プレースホルダーかどうかを返します。
