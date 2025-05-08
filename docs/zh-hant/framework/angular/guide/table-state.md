---
source-updated-at: '2024-07-27T18:15:45.000Z'
translation-updated-at: '2025-05-08T23:45:35.053Z'
title: 表格狀態
---
## 表格狀態 (Angular) 指南

TanStack Table 的核心是**框架無關 (framework agnostic)** 的，這意味著無論您使用哪種框架，其 API 都是相同的。根據您使用的框架，提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱適配器選單以查看可用的適配器。

### 存取表格狀態

您無需特別設置任何內容即可讓表格狀態正常工作。如果您沒有向 `state`、`initialState` 或任何 `on[State]Change` 表格選項傳入任何內容，表格將在內部管理自己的狀態。您可以透過使用 `table.getState()` 表格實例 API 來存取此內部狀態的任何部分。

```ts
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  //...
}))

someHandler() {
  console.log(this.table.getState()) //存取整個內部狀態
  console.log(this.table.getState().rowSelection) //僅存取行選擇狀態
}
```

### 自訂初始狀態

如果您只需要為某些狀態自訂其初始預設值，您仍然不需要自行管理任何狀態。您只需在表格實例的 `initialState` 選項中設置值即可。

```jsx
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //自訂初始欄位順序
    columnVisibility: {
      id: false //預設隱藏 id 欄位
    },
    expanded: true, //預設展開所有行
    sorting: [
      {
        id: 'age',
        desc: true //預設按年齡降序排序
      }
    ]
  },
  //...
}))
```

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 中指定，但不能同時在兩者中指定。如果您將特定狀態值同時傳入 `initialState` 和 `state`，則 `state` 中的初始化狀態將覆蓋 `initialState` 中的任何對應值。

### 受控狀態

如果您需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓您可以輕鬆地在自己的狀態管理系統中控制和管理的任何或所有表格狀態。您可以透過將自己的狀態和狀態管理函數傳入 `state` 和 `on[State]Change` 表格選項來實現這一點。

#### 個別受控狀態

您可以僅控制您需要輕鬆存取的狀態。如果不需要，您**不必**控制所有表格狀態。建議根據具體情況僅控制您需要的狀態。

為了控制特定狀態，您需要將對應的 `state` 值和 `on[State]Change` 函數傳入表格實例。

讓我們以「手動」伺服器端資料獲取情境中的篩選、排序和分頁為例。您可以將篩選、排序和分頁狀態儲存在自己的狀態管理中，但如果您的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```ts
import {signal} from '@angular/core';
import {SortingState, ColumnFiltersState, PaginationState} from '@tanstack/angular-table'
import {toObservable} from "@angular/core/rxjs-interop";
import {combineLatest, switchMap} from 'rxjs';

class TableComponent {
  readonly columnFilters = signal<ColumnFiltersState>([]) //無預設篩選
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: true, //預設按年齡降序排序
    }
  ])
  readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 15
  })

  //使用我們受控的狀態值來獲取資料
  readonly data$ = combineLatest({
    filters: toObservable(this.columnFilters),
    sorting: toObservable(this.sorting),
    pagination: toObservable(this.pagination)
  }).pipe(
    switchMap(({filters, sorting, pagination}) => fetchData(filters, sorting, pagination))
  )
  readonly data = toSignal(this.data$);

  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      columnFilters: this.columnFilters(), //將受控狀態傳回表格（覆蓋內部狀態）
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onColumnFiltersChange: updater => { //將 columnFilters 狀態提升到我們自己的狀態管理
      updater instanceof Function
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
    onSortingChange: updater => {
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    },
    onPaginationChange: updater => {
      updater instanceof Function
        ? this.pagination.update(updater)
        : this.pagination.set(updater)
    },
  }))
}

//...
```

#### 完全受控狀態

或者，您可以使用 `onStateChange` 表格選項來控制整個表格狀態。它會將整個表格狀態提升到您自己的狀態管理系統中。請小心使用此方法，因為您可能會發現將一些頻繁變化的狀態值（如 `columnSizingInfo` 狀態）提升到元件樹中可能會導致性能問題。

可能需要一些技巧來實現這一點。如果您使用 `onStateChange` 表格選項，則 `state` 的初始值必須填充您想要使用的所有相關狀態值。您可以手動輸入所有初始狀態值，或以特殊方式使用建構函數，如下所示。

```ts


class TableComponent {
  // 建立一個空的表格狀態，稍後我們會覆蓋它
  readonly state = signal({} as TableState);

  // 使用預設狀態值建立表格實例
  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    // 我們完全受控的狀態覆蓋了內部狀態
    state: this.state(),
    onStateChange: updater => {
      // 任何狀態變更都會被推送到我們自己的狀態管理
      this.state.set(
        updater instanceof Function ? updater(this.state()) : updater
      )
    }
  }))

  constructor() {
    // 設定初始表格狀態
    this.state.set({
      // 使用表格實例中的所有預設狀態值填充初始狀態
      ...this.table.initialState,
      pagination: {
        pageIndex: 0,
        pageSize: 15, // 可選自訂初始分頁狀態
      },
    })
  }
}
```

### 狀態變更回呼

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項可以將表格狀態變更「提升」到我們自己的狀態管理中。然而，關於使用這些選項，有幾點您應該注意。

#### 1. **狀態變更回呼必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼會告訴表格實例這將是一個受控狀態。如果您沒有指定對應的 `state` 值，該狀態將「凍結」其初始值。

```ts
class TableComponent {
  sorting = signal<SortingState>([])

  table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      sorting: this.sorting(), // 必需，因為我們使用了 `onSortingChange`
    },
    onSortingChange: updater => { // 使 `state.sorting` 受控
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    }
  }))
}
```

#### 2. **更新器可以是原始值或回呼函數**。

`on[State]Change` 和 `onStateChange` 回呼的工作方式與 React 中的 `setState` 函數完全相同。更新器值可以是新的狀態值，也可以是接收先前的狀態值並返回新狀態值的回呼函數。

這有什麼影響？這意味著如果您想在任何 `on[State]Change` 回呼中加入一些額外的邏輯，您可以這樣做，但您需要檢查新的傳入更新器值是函數還是值。

這就是為什麼您會在上面的範例中看到 `updater instanceof Function ? this.state.update(updater) : this.state.set(updater)` 模式。此模式檢查更新器是否為函數，如果是，則使用先前的狀態值呼叫該函數以獲取新的狀態值，否則信號將需要呼叫 `signal.update` 而不是 `signal.set`。

### 狀態類型

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，您可以導入和使用。這對於確保您為控制的狀態值使用正確的資料結構和屬性非常有用。

```ts
import {createAngularTable, type SortingState} from '@tanstack/angular-table'

class TableComponent {
  readonly sorting = signal<SortingState>([
    {
      id: 'age', // 您應該會獲得 `id` 和 `desc` 屬性的自動完成
      desc: true,
    }
  ])
}
```
