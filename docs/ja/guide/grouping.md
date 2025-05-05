---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:29.079Z'
title: グループ化
---
## サンプル

実装にすぐに進みたいですか？以下のサンプルを確認してください:

- [グルーピング](../framework/react/examples/grouping)

## API

[グルーピング API](../api/features/grouping)

## グルーピングガイド

列の並べ替えを行うテーブル機能は3つあり、以下の順序で実行されます:

1. [列の固定 (Column Pinning)](../guide/column-pinning) - 固定する場合、列は左、中央（固定なし）、右固定列に分割されます。
2. 手動[列の並べ替え (Column Ordering)](../guide/column-ordering) - 手動で指定された列順が適用されます。
3. **グルーピング** - グルーピングが有効で、グルーピング状態がアクティブかつ `tableOptions.groupedColumnMode` が `'reorder' | 'remove'` に設定されている場合、グルーピングされた列が列フローの先頭に並べ替えられます。

TanStack Tableのグルーピングは列に適用される機能で、特定の列に基づいてテーブル行を分類・整理できます。大量のデータがあり、特定の基準でグループ化したい場合に便利です。

グルーピング機能を使用するには、グルーピングされた行モデルを使用する必要があります。このモデルはグルーピング状態に基づいて行をグループ化します。

```tsx
import { getGroupedRowModel } from '@tanstack/react-table'

const table = useReactTable({
  // その他のオプション...
  getGroupedRowModel: getGroupedRowModel(),
})
```

グルーピング状態がアクティブな場合、テーブルは一致する行をサブ行としてグループ化された行に追加します。グループ化された行は、最初に一致した行と同じインデックスでテーブル行に追加されます。一致した行はテーブル行から削除されます。
ユーザーがグループ化された行を展開/折りたたみできるようにするには、展開機能を使用できます。

```tsx
import { getGroupedRowModel, getExpandedRowModel} from '@tanstack/react-table'

const table = useReactTable({
  // その他のオプション...
  getGroupedRowModel: getGroupedRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

### グルーピング状態

グルーピング状態は文字列の配列で、各文字列はグループ化する列のIDです。配列内の文字列の順序がグループ化の順序を決定します。例えば、グルーピング状態が ['column1', 'column2'] の場合、テーブルは最初にcolumn1でグループ化し、次に各グループ内でcolumn2でグループ化します。setGrouping関数を使用してグルーピング状態を制御できます:

```tsx
table.setGrouping(['column1', 'column2']);
```

resetGrouping関数を使用してグルーピング状態を初期状態にリセットすることもできます:

```tsx
table.resetGrouping();
```

デフォルトでは、列がグループ化されるとテーブルの先頭に移動します。この動作はgroupedColumnModeオプションで制御できます。'reorder'に設定すると、グループ化された列がテーブルの先頭に移動します。'remove'に設定すると、グループ化された列がテーブルから削除されます。falseに設定すると、グループ化された列は移動も削除もされません。

```tsx
const table = useReactTable({
  // その他のオプション...
  groupedColumnMode: 'reorder',
})
```

### 集計

行がグループ化されている場合、aggregationFnオプションを使用して列ごとにグループ化された行のデータを集計できます。これは集計関数のIDである文字列です。aggregationFnsオプションを使用して集計関数を定義できます。

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'sum',
})
```

上記の例では、sum集計関数がグループ化された行のデータを集計するために使用されます。
デフォルトでは、数値列はsum集計関数を使用し、非数値列はcount集計関数を使用します。列定義でaggregationFnオプションを指定することでこの動作を上書きできます。

使用できる組み込みの集計関数は以下の通りです:

- sum - グループ化された行の値を合計します。
- count - グループ化された行の数をカウントします。
- min - グループ化された行の最小値を見つけます。
- max - グループ化された行の最大値を見つけます。
- extent - グループ化された行の値の範囲（最小値と最大値）を見つけます。
- mean - グループ化された行の値の平均を見つけます。
- median - グループ化された行の値の中央値を見つけます。
- unique - グループ化された行の一意の値の配列を返します。
- uniqueCount - グループ化された行の一意の値の数をカウントします。

#### カスタム集計

行がグループ化されている場合、aggregationFnsオプションを使用してグループ化された行のデータを集計できます。これは、キーが集計関数のIDで、値が集計関数自体のレコードです。これらの集計関数は、列のaggregationFnオプションで参照できます。

```tsx
const table = useReactTable({
  // その他のオプション...
  aggregationFns: {
    myCustomAggregation: (columnId, leafRows, childRows) => {
      // 集計値を返す
    },
  },
})
```

上記の例では、myCustomAggregationは、列ID、リーフ行、子行を受け取り、集計値を返すカスタム集計関数です。この集計関数は、列のaggregationFnオプションで使用できます:

```tsx
const column = columnHelper.accessor('key', {
  aggregationFn: 'myCustomAggregation',
})
```

### 手動グルーピング

サーバーサイドグルーピングと集計を行う場合、manualGroupingオプションを使用して手動グルーピングを有効にできます。このオプションがtrueに設定されている場合、テーブルはgetGroupedRowModel()を使用して自動的に行をグループ化せず、代わりに行を手動でグループ化してテーブルに渡すことを期待します。

```tsx
const table = useReactTable({
  // その他のオプション...
  manualGrouping: true,
})
```

> **注:** 現在、TanStack Tableでサーバーサイドグルーピングを行う簡単な方法は多く知られていません。これを機能させるには、多くのカスタムセルレンダリングを行う必要があります。

### グルーピング変更ハンドラ

グルーピング状態を自分で管理したい場合は、onGroupingChangeオプションを使用できます。このオプションは、グルーピング状態が変更されたときに呼び出される関数です。管理された状態をtableOptions.state.groupingオプションを介してテーブルに戻すことができます。

```tsx
const [grouping, setGrouping] = useState<string[]>([])

const table = useReactTable({
  // その他のオプション...
  state: {
    grouping: grouping,
  },
  onGroupingChange: setGrouping
})
```
