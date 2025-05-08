---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:01.997Z'
title: 自訂功能
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [custom-features](../framework/react/examples/custom-features)

## 自訂功能指南

在本指南中，我們將介紹如何擴展 TanStack Table 的自訂功能，並在此過程中深入了解 TanStack Table v8 程式碼庫的結構與運作方式。

### TanStack Table 追求精簡

TanStack Table 內建一組核心功能，如排序、篩選、分頁等。我們收到許多功能請求，有時甚至是經過深思熟慮的 PR，希望為函式庫添加更多功能。雖然我們始終樂於改進函式庫，但也希望確保 TanStack Table 保持精簡，不會包含太多可能不會在大多數使用情境中用到的程式碼。並非每個 PR 都能或應該被納入核心函式庫，即使它確實解決了實際問題。這可能會讓開發者感到沮喪，尤其是當 TanStack Table 滿足他們 90% 的需求，但他們需要更多控制權時。

TanStack Table 的設計一直以來都允許高度擴展性（至少從 v7 開始）。無論你使用哪種框架適配器（`useReactTable`、`useVueTable` 等），返回的 `table` 實例都是一個普通的 JavaScript 物件，可以添加額外屬性或 API。一直以來，都可以使用組合（composition）來為表格實例添加自訂邏輯、狀態和 API。像 [Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/hooks/useMRT_TableInstance.ts) 這樣的函式庫，就是通過在 `useReactTable` 鉤子外層創建自訂包裝鉤子來擴展表格實例的功能。

然而，從版本 8.14.0 開始，TanStack Table 提供了一個新的 `_features` 表格選項，讓你能夠以與內建表格功能完全相同的方式，更緊密且乾淨地將自訂程式碼整合到表格實例中。

> TanStack Table v8.14.0 引入了新的 `_features` 選項，允許你為表格實例添加自訂功能。

通過這種更緊密的整合，你可以輕鬆為表格添加更複雜的自訂功能，甚至可能將它們打包並與社群分享。我們將觀察這一功能的發展。在未來的 v9 版本中，我們甚至可能通過讓所有功能變為可選來進一步減少 TanStack Table 的套件大小，但這仍在探索中。

### TanStack Table 功能的工作原理

TanStack Table 的原始碼可以說相當簡單（至少我們這麼認為）。每個功能的程式碼都被拆分到各自的物件/檔案中，包含創建初始狀態的方法、預設表格和欄位選項，以及可以添加到 `table`、`header`、`column`、`row` 和 `cell` 實例的 API 方法。

所有功能物件的功能都可以用從 TanStack Table 導出的 `TableFeature` 類型來描述。這是一個 TypeScript 介面，描述了創建功能所需的功能物件的結構。

```ts
export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ) => void
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  createRow?: (row: Row<TData>, table: Table<TData>) => void
  createTable?: (table: Table<TData>) => void
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  getDefaultOptions?: (
    table: Table<TData>
  ) => Partial<TableOptionsResolved<TData>>
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>
}
```

這可能有點令人困惑，因此讓我們分解這些方法的作用：

#### 預設選項與初始狀態

<br />

##### getDefaultOptions

表格功能中的 `getDefaultOptions` 方法負責為該功能設定預設的表格選項。例如，在 [欄位調整大小](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`getDefaultOptions` 方法會設定預設的 `columnResizeMode` 選項，其預設值為 `"onEnd"`。

<br />

##### getDefaultColumnDef

表格功能中的 `getDefaultColumnDef` 方法負責為該功能設定預設的欄位選項。例如，在 [排序](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`getDefaultColumnDef` 方法會設定預設的 `sortUndefined` 欄位選項，其預設值為 `1`。

<br />

##### getInitialState

表格功能中的 `getInitialState` 方法負責為該功能設定預設的狀態。例如，在 [分頁](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowPagination.ts) 功能中，`getInitialState` 方法會設定預設的 `pageSize` 狀態為 `10`，以及預設的 `pageIndex` 狀態為 `0`。

#### API 創建器

<br />

##### createTable

表格功能中的 `createTable` 方法負責為 `table` 實例添加方法。例如，在 [列選擇](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createTable` 方法會添加許多表格實例 API 方法，如 `toggleAllRowsSelected`、`getIsAllRowsSelected`、`getIsSomeRowsSelected` 等。因此，當你調用 `table.toggleAllRowsSelected()` 時，你實際上是在調用由 `RowSelection` 功能添加到表格實例的方法。

<br />

##### createHeader

表格功能中的 `createHeader` 方法負責為 `header` 實例添加方法。例如，在 [欄位調整大小](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`createHeader` 方法會添加許多標頭實例 API 方法，如 `getStart` 等。因此，當你調用 `header.getStart()` 時，你實際上是在調用由 `ColumnSizing` 功能添加到標頭實例的方法。

<br />

##### createColumn

表格功能中的 `createColumn` 方法負責為 `column` 實例添加方法。例如，在 [排序](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`createColumn` 方法會添加許多欄位實例 API 方法，如 `getNextSortingOrder`、`toggleSorting` 等。因此，當你調用 `column.toggleSorting()` 時，你實際上是在調用由 `RowSorting` 功能添加到欄位實例的方法。

<br />

##### createRow

表格功能中的 `createRow` 方法負責為 `row` 實例添加方法。例如，在 [列選擇](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createRow` 方法會添加許多列實例 API 方法，如 `toggleSelected`、`getIsSelected` 等。因此，當你調用 `row.toggleSelected()` 時，你實際上是在調用由 `RowSelection` 功能添加到列實例的方法。

<br />

##### createCell

表格功能中的 `createCell` 方法負責為 `cell` 實例添加方法。例如，在 [欄位分組](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnGrouping.ts) 功能中，`createCell` 方法會添加許多儲存格實例 API 方法，如 `getIsGrouped`、`getIsAggregated` 等。因此，當你調用 `cell.getIsGrouped()` 時，你實際上是在調用由 `ColumnGrouping` 功能添加到儲存格實例的方法。

### 添加自訂功能

讓我們通過一個假設的使用案例來逐步創建一個自訂表格功能。假設我們想在表格實例中添加一個功能，允許使用者更改表格的「密度」（儲存格的內邊距）。

查看完整的 [custom-features](../framework/react/examples/custom-features) 範例以了解完整實現，以下是創建自訂功能的詳細步驟。

#### 步驟 1：設定 TypeScript 類型

假設你希望與 TanStack Table 內建功能具有相同的完整類型安全性，讓我們為新功能設定所有 TypeScript 類型。我們將為新的表格選項、狀態和表格實例 API 方法創建類型。

這些類型遵循 TanStack Table 內部使用的命名慣例，但你可以隨意命名。我們尚未將這些類型添加到 TanStack Table 中，但將在下一步進行。

```ts
// 為新功能的自訂狀態定義類型
export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
  density: DensityState
}

// 為新功能的表格選項定義類型
export interface DensityOptions {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// 為新功能的表格 API 定義類型
export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}
```

#### 步驟 2：使用宣告合併將新類型添加到 TanStack Table

我們可以告訴 TypeScript 修改從 TanStack Table 導出的類型，以包含我們新功能的類型。這稱為「宣告合併」（declaration merging），是 TypeScript 的一個強大功能。這樣，我們在新功能的程式碼或應用程式碼中就不需要使用任何 TypeScript 技巧，例如 `as unknown as CustomTable` 或 `// @ts-ignore`。

```ts
// 使用宣告合併將新功能的 API 和狀態類型添加到 TanStack Table 的現有類型中。
declare module '@tanstack/react-table' { // 或你正在使用的任何框架適配器
  // 將新功能的狀態與現有表格狀態合併
  interface TableState extends DensityTableState {}
  // 將新功能的選項與現有表格選項合併
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions {}
  // 將新功能的實例 API 與現有表格實例 API 合併
  interface Table<TData extends RowData> extends DensityInstance {}
  // 如果需要添加儲存格實例 API...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // 如果需要添加列實例 API...
  // interface Row<TData extends RowData> extends DensityRow
  // 如果需要添加欄位實例 API...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // 如果需要添加標頭實例 API...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // 注意：無法對 `ColumnDef` 進行宣告合併，因為它是一個複雜類型，而非介面。
  // 但你仍然可以對 `ColumnDef.meta` 進行宣告合併。
}
```

一旦正確完成此操作，我們在嘗試創建新功能的程式碼並在應用程式中使用它時，應該不會有任何 TypeScript 錯誤。

##### 使用宣告合併的注意事項

使用宣告合併的一個注意事項是，它會影響程式碼庫中所有表格的 TanStack Table 類型。如果你計劃為應用程式中的每個表格加載相同的功能集，這不是問題，但如果某些表格加載額外功能而某些不加載，則可能會出現問題。或者，你可以創建一堆自訂類型，從 TanStack Table 類型擴展並添加新功能。[Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/types.ts) 就是這樣做的，以避免影響原生 TanStack Table 表格的類型，但這會更繁瑣，並且在某些地方需要大量類型轉換。

#### 步驟 3：創建功能物件

完成所有 TypeScript 設定後，我們現在可以為新功能創建功能物件。在這裡，我們定義將添加到表格實例的所有方法。

使用 `TableFeature` 類型確保你正確創建功能物件。如果 TypeScript 類型設定正確，你在創建帶有新狀態、選項和實例 API 的功能物件時，應該不會有任何 TypeScript 錯誤。

```ts
export const DensityFeature: TableFeature<any> = { // 使用 TableFeature 類型！！
  // 定義新功能的初始狀態
  getInitialState: (state): DensityTableState => {
    return {
      density: 'md',
      ...state,
    }
  },

  // 定義新功能的預設選項
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    } as DensityOptions
  },
  // 如果需要添加預設欄位定義...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } // 使用 meta 而非直接添加到 columnDef，以避免難以解決的 TypeScript 問題
  // },

  // 定義新功能的表格實例方法
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = updater => {
      const safeUpdater: Updater<DensityState> = old => {
        let newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = value => {
      table.setDensity(old => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // 在三種選項之間循環
      })
    }
  },

  // 如果需要添加列實例 API...
  // createRow: <TData extends RowData>(row, table): void => {},
  // 如果需要添加儲存格實例 API...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // 如果需要添加欄位實例 API...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // 如果需要添加標頭實例 API...
  // createHeader: <TData extends RowData>(header, table): void => {},
}
```

#### 步驟 4：將功能添加到表格

現在我們有了功能物件，可以在創建表格實例時將其傳遞給 `_features` 選項，從而將其添加到表格實例中。

```ts
const table = useReactTable({
  _features: [DensityFeature], // 將新功能傳遞給表格，以在底層與所有內建功能合併
  columns,
  data,
  //..
})
```

#### 步驟 5：在應用程式中使用功能

現在功能已添加到表格實例中，你可以在應用程式中使用新的實例 API、選項和狀態。

```tsx
const table = useReactTable({
  _features: [DensityFeature], // 將自訂功能傳遞給表格以在創建時實例化
  columns,
  data,
  //...
  state: {
    density, // 將密度狀態傳遞給表格，TypeScript 仍然正常 :)
  },
  onDensityChange: setDensity, // 使用新的 onDensityChange 選項，TypeScript 仍然正常 :)
})
//...
const { density } = table.getState()
return(
  <td
    key={cell.id}
    style={{
      // 在程式碼中使用新功能
      padding:
        density === 'sm'
          ? '4px'
          : density === 'md'
            ? '8px'
            : '16px',
      transition: 'padding 0.2s',
    }}
  >
    {flexRender(
      cell.column.columnDef.cell,
      cell.getContext()
    )}
  </td>
)
```

#### 必須這樣做嗎？

這只是一種將自訂程式碼與 TanStack Table 內建功能整合的新方式。在上面的範例中，我們完全可以將 `density` 狀態儲存在 `React.useState` 中，在任何地方定義自己的 `toggleDensity` 處理函式，並在程式碼中獨立於表格實例使用它。在 TanStack Table 之外建立表格功能，而非深度整合到表格實例中，仍然是建立自訂功能的完全有效方式。根據你的使用情境，這可能不是擴展 TanStack Table 自訂功能的最簡潔方式。
