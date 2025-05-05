---
source-updated-at: '2024-02-18T00:06:36.000Z'
translation-updated-at: '2025-05-05T19:29:02.756Z'
title: カラム表示/非表示
id: column-visibility
---
## 状態 (State)

カラムの可視性 (visibility) 状態は、以下の形式でテーブルに保存されます:

```tsx
export type VisibilityState = Record<string, boolean>

export type VisibilityTableState = {
  columnVisibility: VisibilityState
}
```

## カラム定義 (Column Def) オプション

### `enableHiding`

```tsx
enableHiding?: boolean
```

カラムの非表示を有効/無効にします

## カラム API

### `getCanHide`

```tsx
getCanHide: () => boolean
```

カラムが非表示にできるかどうかを返します

### `getIsVisible`

```tsx
getIsVisible: () => boolean
```

カラムが表示されているかどうかを返します

### `toggleVisibility`

```tsx
toggleVisibility: (value?: boolean) => void
```

カラムの可視性をトグルします

### `getToggleVisibilityHandler`

```tsx
getToggleVisibilityHandler: () => (event: unknown) => void
```

カラムの可視性をトグルする関数を返します。この関数はチェックボックスのイベントハンドラにバインドするために使用できます。

## テーブルオプション

### `onColumnVisibilityChange`

```tsx
onColumnVisibilityChange?: OnChangeFn<VisibilityState>
```

提供された場合、`state.columnVisibility` が変更されるとこの関数が `updaterFn` と共に呼び出されます。これはデフォルトの内部状態管理を上書きするため、テーブルの外部で状態変更を完全または部分的に永続化する必要があります。

### `enableHiding`

```tsx
enableHiding?: boolean
```

カラムの非表示を有効/無効にします。

## テーブル API

### `getVisibleFlatColumns`

```tsx
getVisibleFlatColumns: () => Column<TData>[]
```

表示されているカラムのフラットな配列を返します（親カラムを含む）。

### `getVisibleLeafColumns`

```tsx
getVisibleLeafColumns: () => Column<TData>[]
```

表示されているリーフノードカラムのフラットな配列を返します。

### `getLeftVisibleLeafColumns`

```tsx
getLeftVisibleLeafColumns: () => Column<TData>[]
```

カラムピニング (pinning) が有効な場合、テーブルの左側に表示されているリーフノードカラムのフラットな配列を返します。

### `getRightVisibleLeafColumns`

```tsx
getRightVisibleLeafColumns: () => Column<TData>[]
```

カラムピニングが有効な場合、テーブルの右側に表示されているリーフノードカラムのフラットな配列を返します。

### `getCenterVisibleLeafColumns`

```tsx
getCenterVisibleLeafColumns: () => Column<TData>[]
```

カラムピニングが有効な場合、テーブルのピンされていない中央部分に表示されているリーフノードカラムのフラットな配列を返します。

### `setColumnVisibility`

```tsx
setColumnVisibility: (updater: Updater<VisibilityState>) => void
```

アップデータ関数または値を使用してカラムの可視性状態を更新します

### `resetColumnVisibility`

```tsx
resetColumnVisibility: (defaultState?: boolean) => void
```

カラムの可視性状態を初期状態にリセットします。`defaultState` が提供された場合、状態は `{}` にリセットされます

### `toggleAllColumnsVisible`

```tsx
toggleAllColumnsVisible: (value?: boolean) => void
```

すべてのカラムの可視性をトグルします

### `getIsAllColumnsVisible`

```tsx
getIsAllColumnsVisible: () => boolean
```

すべてのカラムが表示されているかどうかを返します

### `getIsSomeColumnsVisible`

```tsx
getIsSomeColumnsVisible: () => boolean
```

一部のカラムが表示されているかどうかを返します

### `getToggleAllColumnsVisibilityHandler`

```tsx
getToggleAllColumnsVisibilityHandler: () => ((event: unknown) => void)
```

すべてのカラムの可視性をトグルするハンドラを返します。`input[type=checkbox]` 要素にバインドすることを想定しています。

## 行 (Row) API

### `getVisibleCells`

```tsx
getVisibleCells: () => Cell<TData>[]
```

カラムの可視性を考慮した行のセルの配列を返します。
