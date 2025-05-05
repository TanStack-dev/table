---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-05T19:29:36.248Z'
title: 展開
id: expanding
---
## 状態 (State)

展開状態 (expanded state) はテーブル上で以下の形式で保存されます:

```tsx
export type ExpandedState = true | Record<string, boolean>

export type ExpandedTableState = {
  expanded: ExpandedState
}
```

## 行 API (Row API)

### `toggleExpanded`

```tsx
toggleExpanded: (expanded?: boolean) => void
```

行の展開状態をトグルします（`expanded` が指定されている場合は設定します）。

### `getIsExpanded`

```tsx
getIsExpanded: () => boolean
```

行が展開されているかどうかを返します。

### `getIsAllParentsExpanded`

```tsx
getIsAllParentsExpanded: () => boolean
```

行のすべての親行が展開されているかどうかを返します。

### `getCanExpand`

```tsx
getCanExpand: () => boolean
```

行を展開できるかどうかを返します。

### `getToggleExpandedHandler`

```tsx
getToggleExpandedHandler: () => () => void
```

行の展開状態をトグルする関数を返します。この関数はボタンのイベントハンドラにバインドするために使用できます。

## テーブルオプション (Table Options)

### `manualExpanding`

```tsx
manualExpanding?: boolean
```

手動行展開を有効にします。`true` に設定すると、`getExpandedRowModel` は行の展開に使用されず、独自のデータモデルで展開を実行する必要があります。これはサーバーサイド展開 (server-side expansion) を行う場合に便利です。

### `onExpandedChange`

```tsx
onExpandedChange?: OnChangeFn<ExpandedState>
```

`expanded` テーブル状態が変更されたときに呼び出される関数です。関数が提供されている場合、この状態を自分で管理する必要があります。管理された状態をテーブルに戻すには、`tableOptions.state.expanded` オプションを使用します。

### `autoResetExpanded`

```tsx
autoResetExpanded?: boolean
```

展開状態が変更されたときに、テーブルの展開状態を自動的にリセットするには、この設定を有効にします。

### `enableExpanding`

```tsx
enableExpanding?: boolean
```

すべての行の展開を有効/無効にします。

### `getExpandedRowModel`

```tsx
getExpandedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

この関数は展開された行モデルを返す役割を担います。この関数が提供されていない場合、テーブルは行を展開しません。デフォルトでエクスポートされている `getExpandedRowModel` 関数を使用して展開された行モデルを取得するか、独自の実装を提供できます。

### `getIsRowExpanded`

```tsx
getIsRowExpanded?: (row: Row<TData>) => boolean
```

提供されている場合、行が現在展開されているかどうかを決定するデフォルトの動作をオーバーライドできます。

### `getRowCanExpand`

```tsx
getRowCanExpand?: (row: Row<TData>) => boolean
```

提供されている場合、行を展開できるかどうかを決定するデフォルトの動作をオーバーライドできます。

### `paginateExpandedRows`

```tsx
paginateExpandedRows?: boolean
```

`true` の場合、展開された行はテーブルの他の部分と一緒にページネーションされます（展開された行が複数のページにまたがる可能性があることを意味します）。

`false` の場合、展開された行はページネーションの対象外になります（展開された行は常に親行のページにレンダリングされます。これにより、設定されたページサイズよりも多くの行がレンダリングされることも意味します）。

## テーブル API (Table API)

### `setExpanded`

```tsx
setExpanded: (updater: Updater<ExpandedState>) => void
```

更新関数または値を使用して、テーブルの展開状態を更新します。

### `toggleAllRowsExpanded`

```tsx
toggleAllRowsExpanded: (expanded?: boolean) => void
```

すべての行の展開状態をトグルします。オプションで、展開状態を設定する値を指定できます。

### `resetExpanded`

```tsx
resetExpanded: (defaultState?: boolean) => void
```

テーブルの展開状態を初期状態にリセットします。`defaultState` が提供されている場合、展開状態は `{}` にリセットされます。

### `getCanSomeRowsExpand`

```tsx
getCanSomeRowsExpand: () => boolean
```

展開可能な行があるかどうかを返します。

### `getToggleAllRowsExpandedHandler`

```tsx
getToggleAllRowsExpandedHandler: () => (event: unknown) => void
```

すべての行の展開状態をトグルするハンドラを返します。このハンドラは `input[type=checkbox]` 要素で使用することを想定しています。

### `getIsSomeRowsExpanded`

```tsx
getIsSomeRowsExpanded: () => boolean
```

現在展開されている行があるかどうかを返します。

### `getIsAllRowsExpanded`

```tsx
getIsAllRowsExpanded: () => boolean
```

すべての行が現在展開されているかどうかを返します。

### `getExpandedDepth`

```tsx
getExpandedDepth: () => number
```

展開された行の最大深度を返します。

### `getExpandedRowModel`

```tsx
getExpandedRowModel: () => RowModel<TData>
```

展開が適用された後の行モデルを返します。

### `getPreExpandedRowModel`

```tsx
getPreExpandedRowModel: () => RowModel<TData>
```

展開が適用される前の行モデルを返します。
