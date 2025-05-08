---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:45:17.108Z'
title: 表格
---
## `createAngularTable` / `useReactTable` / `createSolidTable` / `useQwikTable` / `useVueTable` / `createSvelteTable`

```tsx
type useReactTable = <TData extends AnyData>(
  options: TableOptions<TData>
) => Table<TData>
```

這些函式用於建立表格，具體使用哪一個取決於你所使用的框架適配器。

## 選項

以下是表格的**核心**選項與 API 屬性。更多選項與 API 屬性可參閱其他[表格功能](../guide/features)。

### `data`

```tsx
data: TData[]
```

表格要顯示的資料。此陣列應與你提供給 `table.setRowType<...>` 的類型相符，但理論上可以是任何類型的陣列。通常陣列中的每個項目會是鍵/值的物件，但這並非必要條件。欄位可以透過字串/索引或函式存取器來取得此資料並回傳任何內容。

當 `data` 選項的參考發生變化時（透過 `Object.is` 比較），表格會重新處理資料。任何依賴核心資料模型的資料處理（如分組、排序、篩選等）也會重新執行。

> 🧠 請確保 `data` 選項僅在你希望表格重新處理時才變更。若每次渲染表格時都提供內聯的 `[]` 或建立新的資料陣列，將會導致大量不必要的重新處理。在小型表格中可能不易察覺，但在大型表格中會明顯影響效能。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

用於表格的欄位定義陣列。詳見[欄位定義指南](../../docs/guide/column-defs)以瞭解如何建立欄位定義。

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TData>>
```

提供給所有欄位定義的預設選項。這對於設定預設的儲存格/表頭/表尾渲染器、排序/篩選/分組選項等非常有用。所有傳遞給 `options.columns` 的欄位定義都會與此預設定義合併，產生最終的欄位定義。

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

此選項用於選擇性地傳遞初始狀態給表格。當重置表格狀態時（例如透過 `options.autoResetPageIndex` 或 `table.resetRowSelection()` 等函式），會使用此狀態。大多數重置函式允許你選擇性地傳遞標誌以重置為空白/預設狀態，而非初始狀態。

> 🧠 表格狀態不會在此物件變更時重置，這也意味著初始狀態物件不需要保持穩定。

### `autoResetAll`

```tsx
autoResetAll?: boolean
```

設定此選項以覆寫所有 `autoReset...` 功能選項。

### `meta`

```tsx
meta?: TableMeta // 此介面可透過宣告合併擴展。見下方說明！
```

你可以傳遞任何物件到 `options.meta`，並在 `table` 可用的任何地方透過 `table.options.meta` 存取它。此類型對所有表格是全域的，可如下擴展：

```tsx
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    foo: string
  }
}
```

> 🧠 將此選項視為表格的任意「上下文」。這是傳遞任意資料或函式給表格的好方法，無需將其傳遞給表格觸及的每個部分。例如，傳遞地區設定物件給表格以格式化日期、數字等，或是傳遞可更新可編輯資料的函式，如[可編輯資料範例](../framework/react/examples/editable-data)所示。

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

`state` 選項可用於選擇性地**控制**部分或全部表格狀態。傳遞的狀態會與內部自動管理的狀態合併並覆蓋，產生表格的最終狀態。你也可以透過 `onStateChange` 選項監聽狀態變化。

### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

`onStateChange` 選項可用於選擇性地監聽表格內的狀態變化。若提供此選項，你將負責自行控制和更新表格狀態。你可以透過 `state` 選項將狀態傳回給表格。

### `debugAll`

> ⚠️ 除錯功能僅在開發模式下可用。

```tsx
debugAll?: boolean
```

設定此選項為 true 以輸出所有除錯資訊到控制台。

### `debugTable`

> ⚠️ 除錯功能僅在開發模式下可用。

```tsx
debugTable?: boolean
```

設定此選項為 true 以輸出表格除錯資訊到控制台。

### `debugHeaders`

> ⚠️ 除錯功能僅在開發模式下可用。

```tsx
debugHeaders?: boolean
```

設定此選項為 true 以輸出表頭除錯資訊到控制台。

### `debugColumns`

> ⚠️ 除錯功能僅在開發模式下可用。

```tsx
debugColumns?: boolean
```

設定此選項為 true 以輸出欄位除錯資訊到控制台。

### `debugRows`

> ⚠️ 除錯功能僅在開發模式下可用。

```tsx
debugRows?: boolean
```

設定此選項為 true 以輸出列除錯資訊到控制台。

### `_features`

```tsx
_features?: TableFeature[]
```

可新增至表格實例的額外功能陣列。

### `render`

> ⚠️ 此選項僅在實作表格適配器時需要。

```tsx
type render = <TProps>(template: Renderable<TProps>, props: TProps) => any
```

`render` 選項為表格提供渲染器實作。此實作用於將表格的各種欄位表頭和儲存格模板轉換為使用者框架支援的結果。

### `mergeOptions`

> ⚠️ 此選項僅在實作表格適配器時需要。

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

此選項用於選擇性地實作表格選項的合併。某些框架（如 solid-js）使用代理來追蹤反應性和使用情況，因此合併反應性物件需要謹慎處理。此選項將此過程的控制權反轉給適配器。

### `getCoreRowModel`

```tsx
getCoreRowModel: (table: Table<TData>) => () => RowModel<TData>
```

此必要選項是計算並回傳表格核心列模型的函式工廠。它會**每表格呼叫一次**，並應回傳一個**新函式**，該函式會計算並回傳表格的列模型。

預設實作可透過任何表格適配器的 `{ getCoreRowModel }` 匯出取得。

### `getSubRows`

```tsx
getSubRows?: (
  originalRow: TData,
  index: number
) => undefined | TData[]
```

此選用函式用於存取任何給定列的子列。若使用巢狀列，你需要使用此函式從列中回傳子列物件（或 undefined）。

### `getRowId`

```tsx
getRowId?: (
  originalRow: TData,
  index: number,
  parent?: Row<TData>
) => string
```

此選用函式用於為任何給定列衍生唯一 ID。若未提供，則使用列的索引（巢狀列會與其祖系的索引以 `.` 連接，例如 `index.index.index`）。若需要識別來自伺服器端操作的個別列，建議使用此函式回傳一個無論網路 IO/模糊性如何都有意義的 ID，例如 userId、taskId、資料庫 ID 欄位等。

## 表格 API

以下屬性和方法可在表格物件上使用：

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

這是表格的已解析初始狀態。

### `reset`

```tsx
reset: () => void
```

呼叫此函式以將表格狀態重置為初始狀態。

### `getState`

```tsx
getState: () => TableState
```

呼叫此函式以取得表格的當前狀態。建議使用此函式及其狀態，特別是在手動管理表格狀態時。這是表格內部用於所有功能和函式的完全相同狀態。

> 🧠 此函式回傳的狀態是自動管理的內部表格狀態與透過 `options.state` 傳遞的手動管理狀態的淺合併結果。

### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

呼叫此函式以更新表格狀態。建議傳遞一個更新函式，形式為 `(prevState) => newState`，但也可以直接傳遞物件。

> 🧠 若提供 `options.onStateChange`，此函式會觸發它並傳遞新狀態。

### `options`

```tsx
options: TableOptions<TData>
```

表格當前選項的唯讀參考。

> ⚠️ 此屬性通常由內部或適配器使用。可透過傳遞新選項給表格來更新。這因適配器而異。對於適配器本身，表格選項必須透過 `setOptions` 函式更新。

### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TData>>) => void
```

> ⚠️ 此函式通常由適配器用來更新表格選項。可直接用於更新表格選項，但通常不建議繞過適配器的選項更新策略。

### `getCoreRowModel`

```tsx
getCoreRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

回傳在套用任何處理前的核心列模型。

### `getRowModel`

```tsx
getRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

回傳套用其他使用功能的所有處理後的最終模型。

### `getAllColumns`

```tsx
type getAllColumns = () => Column<TData>[]
```

回傳表格中的所有欄位，以標準化且巢狀的階層結構呈現，與傳遞給表格的欄位定義鏡像。

### `getAllFlatColumns`

```tsx
type getAllFlatColumns = () => Column<TData>[]
```

回傳表格中的所有欄位，扁平化為單一層級。這包括階層中的所有父欄位物件。

### `getAllLeafColumns`

```tsx
type getAllLeafColumns = () => Column<TData>[]
```

回傳表格中的所有葉節點欄位，扁平化為單一層級。這不包括父欄位。

### `getColumn`

```tsx
type getColumn = (id: string) => Column<TData> | undefined
```

依 ID 回傳單一欄位。

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

回傳表格的表頭群組。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

回傳表格的表尾群組。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData>[]
```

回傳表格的扁平化 Header 物件陣列，包括父表頭。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

回傳表格的扁平化葉節點 Header 物件陣列。
