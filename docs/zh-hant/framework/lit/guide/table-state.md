---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:45:21.513Z'
title: 表格狀態
---
## Table State (Lit) 指南

TanStack Table 的核心是 **框架無關 (framework agnostic)** 的，這意味著無論你使用哪種框架，其 API 都保持一致。根據你所使用的框架，提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱 Adapters 選單以查看可用的適配器。

### 存取表格狀態

你無需特別設定即可讓表格狀態運作。如果沒有傳遞任何值到 `state`、`initialState` 或任何 `on[State]Change` 表格選項中，表格將在內部自行管理其狀態。你可以使用 `table.getState()` 表格實例 API 來存取任何部分的內部狀態。

```ts
private tableController = new TableController<Person>(this);

render() {
  const table = this.tableController.table({
    columns,
    data,
    ...
  })

  console.log(table.getState()) //存取整個內部狀態
  console.log(table.getState().rowSelection) //僅存取行選取狀態
  // ...
}
```

### 自訂初始狀態

如果對於某些狀態，你只需要自訂其初始預設值，那麼你仍然不需要自行管理任何狀態。你可以簡單地在表格實例的 `initialState` 選項中設定值。

```ts
render() {
  const table = this.tableController.table({
    columns,
    data,
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
  })

  return html`...`;
}
```

> **注意**：每個特定的狀態只能在 `initialState` 或 `state` 中指定，不能同時在兩者中設定。如果你將特定的狀態值同時傳遞到 `initialState` 和 `state`，`state` 中的初始化狀態將覆蓋 `initialState` 中的對應值。

### 受控狀態 (Controlled State)

如果你需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓你能夠輕鬆地在自己的狀態管理系統中控制和管理任何或所有表格狀態。你可以通過將自己的狀態和狀態管理函數傳遞到 `state` 和 `on[State]Change` 表格選項中來實現這一點。

#### 個別受控狀態

你可以僅控制你需要輕鬆存取的狀態。如果不需要，你**不必**控制所有表格狀態。建議根據具體情況僅控制你需要的狀態。

為了控制特定的狀態，你需要同時將對應的 `state` 值和 `on[State]Change` 函數傳遞到表格實例中。

讓我們以「手動」伺服器端資料獲取場景中的篩選、排序和分頁為例。你可以將篩選、排序和分頁狀態儲存在自己的狀態管理中，但如果你的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```jsx
import {html} from "lit";

@customElement('my-component')
class MyComponent extends LitElement {
  @state()
  private _sorting: SortingState = []

  render() {
    const table = this.tableController.table({
      columns,
      data,
      state: {
        sorting: this._sorting,
      },
      onSortingChange: updaterOrValue => {
        if (typeof updaterOrValue === 'function') {
          this._sorting = updaterOrValue(this._sorting)
        } else {
          this._sorting = updaterOrValue
        }
      },
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    })

    return html`...`
  }
}
//...
```

#### 完全受控狀態

或者，你可以使用 `onStateChange` 表格選項來控制整個表格狀態。這會將整個表格狀態提升到你自己的狀態管理系統中。請謹慎使用此方法，因為你可能會發現將某些頻繁變化的狀態值（如 `columnSizingInfo` 狀態）提升到元件樹中可能會導致嚴重的效能問題。

可能需要一些額外的技巧來實現這一點。如果你使用 `onStateChange` 表格選項，`state` 的初始值必須填充所有相關的狀態值，以用於你想要使用的所有功能。你可以手動輸入所有初始狀態值，或者如下所示以特殊方式使用 `table.setOptions` API。

```ts

private tableController = new TableController<Person>(this);

@state()
private _tableState;

render() {
  const table = this.tableController.table({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })
  const state = { ...table.initialState, ...this._tableState };
  table.setOptions(prev => ({
    ...prev,
    state,
    onStateChange: updater => {
      this._tableState =
        updater instanceof Function ? updater(state) : updater //任何狀態變更都會被推送到我們自己的狀態管理
    },
  }))

  return html`...`;
}
```

### 狀態變更回呼函數 (On State Change Callbacks)

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項用於將表格狀態變更「提升」到我們自己的狀態管理中。然而，使用這些選項時有幾點需要注意。

#### 1. **狀態變更回呼函數必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼函數會告訴表格實例這將是一個受控狀態。如果你沒有指定對應的 `state` 值，該狀態將「凍結」在其初始值。

```jsx
@state()
private _sorting = [];
//...
render() {
  const table = this.tableController.table({
    columns,
    data,
    state: {
      sorting: this._sorting,
    },
    onSortingChange: updaterOrValue => {
      if (typeof updaterOrValue === 'function') {
        this._sorting = updaterOrValue(this._sorting)
      } else {
        this._sorting = updaterOrValue
      }
    },
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return html`...`;
}
```

#### 2. **更新器可以是原始值或回呼函數**。

`on[State]Change` 和 `onStateChange` 回呼函數的工作方式與 React 中的 `setState` 函數完全相同。更新器值可以是新的狀態值，也可以是一個回呼函數，該函數接收先前的狀態值並返回新的狀態值。

這有什麼影響？這意味著如果你想在任何 `on[State]Change` 回呼函數中添加一些額外邏輯，你可以這樣做，但你需要檢查新的傳入更新器值是函數還是值。

這就是為什麼在上面的例子中你會看到 `updater instanceof Function ? updater(state.value) : updater` 模式。此模式檢查更新器是否為函數，如果是，則使用先前的狀態值呼叫該函數以獲取新的狀態值。

### 狀態類型 (State Types)

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，你可以導入並使用。這對於確保你為控制的狀態值使用正確的資料結構和屬性非常有用。

```tsx
import { TableController, type SortingState } from '@tanstack/lit-table'
//...
@state()
private _sorting: SortingState = [
  {
    id: 'age', //你應該會看到 `id` 和 `desc` 屬性的自動完成
    desc: true,
  }
]
```
