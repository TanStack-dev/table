---
source-updated-at: '2024-04-13T00:46:18.000Z'
translation-updated-at: '2025-05-08T23:43:44.760Z'
title: 排序
id: sorting
---
## 排序狀態 (Sorting State)

排序狀態以以下形式儲存在表格中：

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

## 排序函式 (Sorting Functions)

表格核心內建以下排序函式：

- `alphanumeric`
  - 不區分大小寫地對混合字母數字值進行排序。速度較慢，但若字串包含需要自然排序的數字時更準確。
- `alphanumericCaseSensitive`
  - 區分大小寫地對混合字母數字值進行排序。速度較慢，但若字串包含需要自然排序的數字時更準確。
- `text`
  - 不區分大小寫地對文字/字串值進行排序。速度較快，但若字串包含需要自然排序的數字時較不準確。
- `textCaseSensitive`
  - 區分大小寫地對文字/字串值進行排序。速度較快，但若字串包含需要自然排序的數字時較不準確。
- `datetime`
  - 按時間排序，若值為 `Date` 物件時使用此函式。
- `basic`
  - 使用基礎/標準的 `a > b ? 1 : a < b ? -1 : 0` 比較進行排序。這是最快的排序函式，但可能不是最準確的。

每個排序函式會接收 2 行資料和一個欄位 ID，並預期透過欄位 ID 比較這兩行資料，在升冪排序時回傳 `-1`、`0` 或 `1`。以下是快速參考表：

| 回傳值 | 升冪排序順序 |
| ------ | --------------- |
| `-1`   | `a < b`         |
| `0`    | `a === b`       |
| `1`    | `a > b`         |

以下是每個排序函式的型別簽章：

```tsx
export type SortingFn<TData extends AnyData> = {
  (rowA: Row<TData>, rowB: Row<TData>, columnId: string): number
}
```

#### 使用排序函式 (Using Sorting Functions)

可透過以下方式將排序函式傳遞給 `columnDefinition.sortingFn` 來使用/引用/定義：

- 引用內建排序函式的 `string`
- 引用透過 `tableOptions.sortingFns` 選項提供的自訂排序函式的 `string`
- 直接提供給 `columnDefinition.sortingFn` 選項的函式

`columnDef.sortingFn` 可用的最終排序函式列表使用以下型別：

```tsx
export type SortingFnOption<TData extends AnyData> =
  | 'auto'
  | SortingFns
  | BuiltInSortingFns
  | SortingFn<TData>
```

## 欄位定義選項 (Column Def Options)

### `sortingFn`

```tsx
sortingFn?: SortingFn | keyof SortingFns | keyof BuiltInSortingFns
```

用於此欄位的排序函式。

選項：

- 引用[內建排序函式](#sorting-functions)的 `string`
- [自訂排序函式](#sorting-functions)

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

設為 `true` 可讓此欄位的排序切換從降冪方向開始。

### `enableSorting`

```tsx
enableSorting?: boolean
```

啟用/停用此欄位的排序功能。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

啟用/停用此欄位的多重排序功能。

### `invertSorting`

```tsx
invertSorting?: boolean
```

反轉此欄位的排序順序。這對於具有反向最佳/最差比例的值很有用，例如排名（第1、第2、第3）或高爾夫式計分，其中數字越小越好。

### `sortUndefined`

```tsx
sortUndefined?: 'first' | 'last' | false | -1 | 1 // 預設為 1
```

- `'first'`
  - 未定義值會被推到列表開頭
- `'last'`
  - 未定義值會被推到列表末尾
- `false`
  - 未定義值會被視為平局，需由下一個欄位篩選器或原始索引排序（視情況而定）
- `-1`
  - 未定義值會以較高優先級排序（升冪）（若為升冪排序，未定義值會出現在列表開頭）
- `1`
  - 未定義值會以較低優先級排序（降冪）（若為升冪排序，未定義值會出現在列表末尾）

> 注意：`'first'` 和 `'last'` 選項在 v8.16.0 中新增

## 欄位 API (Column API)

### `getAutoSortingFn`

```tsx
getAutoSortingFn: () => SortingFn<TData>
```

根據欄位值自動推斷並回傳排序函式。

### `getAutoSortDir`

```tsx
getAutoSortDir: () => SortDirection
```

根據欄位值自動推斷並回傳排序方向。

### `getSortingFn`

```tsx
getSortingFn: () => SortingFn<TData>
```

回傳此欄位使用的已解析排序函式。

### `getNextSortingOrder`

```tsx
getNextSortingOrder: () => SortDirection | false
```

回傳下一個排序順序。

### `getCanSort`

```tsx
getCanSort: () => boolean
```

回傳此欄位是否可排序。

### `getCanMultiSort`

```tsx
getCanMultiSort: () => boolean
```

回傳此欄位是否可多重排序。

### `getSortIndex`

```tsx
getSortIndex: () => number
```

回傳此欄位在排序狀態中的索引位置。

### `getIsSorted`

```tsx
getIsSorted: () => false | SortDirection
```

回傳此欄位是否已排序。

### `getFirstSortDir`

```tsx 
getFirstSortDir: () => SortDirection
```

回傳排序此欄位時應使用的第一個方向。

### `clearSorting`

```tsx
clearSorting: () => void
```

從表格的排序狀態中移除此欄位。

### `toggleSorting`

```tsx
toggleSorting: (desc?: boolean, isMulti?: boolean) => void
```

切換此欄位的排序狀態。若提供 `desc`，則會強制排序方向為該值。若提供 `isMulti`，則會以加法方式多重排序該欄位（若已排序則切換）。

### `getToggleSortingHandler`

```tsx
getToggleSortingHandler: () => undefined | ((event: unknown) => void)
```

回傳可用於切換此欄位排序狀態的函式。這對於將點擊處理器附加到欄位標題很有用。

## 表格選項 (Table Options)

### `sortingFns`

```tsx
sortingFns?: Record<string, SortingFn>
```

此選項允許你定義自訂排序函式，可透過其鍵值在欄位的 `sortingFn` 選項中引用。
範例：

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

啟用表格的手動排序。若為 `true`，則需在將資料傳遞給表格前自行排序。這對於伺服器端排序很有用。

### `onSortingChange`

```tsx
onSortingChange?: OnChangeFn<SortingState>
```

若提供，當 `state.sorting` 變更時會以 `updaterFn` 呼叫此函式。這會覆蓋預設的內部狀態管理，因此需在表格外部完全或部分保存狀態變更。

### `enableSorting`

```tsx
enableSorting?: boolean
```

啟用/停用表格的排序功能。

### `enableSortingRemoval`

```tsx
enableSortingRemoval?: boolean
```

啟用/停用移除表格排序的功能。
- 若為 `true`，則排序順序會循環如下：'無' -> '降冪' -> '升冪' -> '無' -> ...
- 若為 `false`，則排序順序會循環如下：'無' -> '降冪' -> '升冪' -> '降冪' -> '升冪' -> ...

### `enableMultiRemove`

```tsx
enableMultiRemove?: boolean
```

啟用/停用移除多重排序的功能。

### `enableMultiSort`

```tsx
enableMultiSort?: boolean
```

啟用/停用表格的多重排序功能。

### `sortDescFirst`

```tsx
sortDescFirst?: boolean
```

若為 `true`，所有排序的首次切換狀態將預設為降冪。

### `getSortedRowModel`

```tsx
getSortedRowModel?: (table: Table<TData>) => () => RowModel<TData>
```

此函式用於檢索已排序的行模型。若使用伺服器端排序，則不需要此函式。若要使用客戶端排序，請將從適配器匯出的 `getSortedRowModel()` 傳遞給表格，或自行實作。

### `maxMultiSortColCount`

```tsx
maxMultiSortColCount?: number
```

設定可多重排序的欄位最大數量。

### `isMultiSortEvent`

```tsx
isMultiSortEvent?: (e: unknown) => boolean
```

傳遞自訂函式，用於判斷是否應觸發多重排序事件。該函式會接收排序切換處理器的事件，並應在事件應觸發多重排序時回傳 `true`。

## 表格 API (Table API)

### `setSorting`

```tsx
setSorting: (updater: Updater<SortingState>) => void
```

設定或更新 `state.sorting` 狀態。

### `resetSorting`

```tsx
resetSorting: (defaultState?: boolean) => void
```

將**排序**狀態重設為 `initialState.sorting`，或傳入 `true` 強制重設為預設空白狀態 `[]`。

### `getPreSortedRowModel`

```tsx
getPreSortedRowModel: () => RowModel<TData>
```

回傳在套用任何排序前的表格行模型。

### `getSortedRowModel`

```tsx
getSortedRowModel: () => RowModel<TData>
```

回傳在套用排序後的表格行模型。
