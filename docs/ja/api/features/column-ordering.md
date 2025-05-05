---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-05T19:28:37.175Z'
title: カラム順序
id: column-ordering
---
## ステート (State)

カラムの並び順 (column ordering) ステートは、以下の形式でテーブルに保存されます:

```tsx
export type ColumnOrderTableState = {
  columnOrder: ColumnOrderState
}

export type ColumnOrderState = string[]
```

## テーブルオプション (Table Options)

### `onColumnOrderChange`

```tsx
onColumnOrderChange?: OnChangeFn<ColumnOrderState>
```

この関数が提供されると、`state.columnOrder` が変更された際に `updaterFn` と共に呼び出されます。これはデフォルトの内部ステート管理を上書きするため、テーブルの外部でステート変更を完全または部分的に永続化する必要があります。

## テーブルAPI (Table API)

### `setColumnOrder`

```tsx
setColumnOrder: (updater: Updater<ColumnOrderState>) => void
```

`state.columnOrder` ステートを設定または更新します。

### `resetColumnOrder`

```tsx
resetColumnOrder: (defaultState?: boolean) => void
```

**columnOrder** ステートを `initialState.columnOrder` にリセットします。`true` を渡すと、デフォルトの空のステート `[]` に強制的にリセットされます。

## カラムAPI (Column API)

### `getIndex`

```tsx
getIndex: (position?: ColumnPinningPosition) => number
```

表示されているカラムの順序におけるカラムのインデックスを返します。オプションで `position` パラメータを渡すと、テーブルの特定のセクションにおけるカラムのインデックスを取得できます。

### `getIsFirstColumn`

```tsx
getIsFirstColumn: (position?: ColumnPinningPosition) => boolean
```

カラムが表示順で最初のカラムであれば `true` を返します。オプションで `position` パラメータを渡すと、テーブルの特定のセクションで最初のカラムかどうかをチェックできます。

### `getIsLastColumn`

```tsx
getIsLastColumn: (position?: ColumnPinningPosition) => boolean
```

カラムが表示順で最後のカラムであれば `true` を返します。オプションで `position` パラメータを渡すと、テーブルの特定のセクションで最後のカラムかどうかをチェックできます。
