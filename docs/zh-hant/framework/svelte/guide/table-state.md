---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:45:24.623Z'
title: 表格狀態
---
## Table State (Svelte) 指南

TanStack Table 的核心是 **框架無關 (framework agnostic)** 的，這意味著無論您使用哪種框架，其 API 都保持相同。根據您使用的框架，提供了適配器 (Adapters) 來簡化與表格核心的互動。請參閱 Adapters 選單以查看可用的適配器。

### 存取表格狀態

您無需特別設定即可讓表格狀態運作。如果未向 `state`、`initialState` 或任何 `on[State]Change` 表格選項傳遞任何內容，表格將在內部管理自己的狀態。您可以使用 `table.getState()` 表格實例 API 存取此內部狀態的任何部分。

```jsx
const options = writable({
  columns,
  data,
  //...
})

const table = createSvelteTable(options)

console.log(table.getState()) //存取整個內部狀態
console.log(table.getState().rowSelection) //僅存取行選取狀態
```

### 自訂初始狀態

如果您只需要為某些狀態自訂其初始預設值，仍然無需自行管理任何狀態。您只需在表格實例的 `initialState` 選項中設定值即可。

```jsx
const options = writable({
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
  //...
})

const table = createSvelteTable(options)
```

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 其中之一指定，不可同時設定。如果將特定狀態值同時傳遞給 `initialState` 和 `state`，則 `state` 中的初始化狀態將覆蓋 `initialState` 中的對應值。

### 受控狀態 (Controlled State)

如果您需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓您可以輕鬆地在自己的狀態管理系統中控制和管理的任何或所有表格狀態。您可以通過將自己的狀態和狀態管理函式傳遞給 `state` 和 `on[State]Change` 表格選項來實現這一點。

#### 個別受控狀態

您可以僅控制您需要輕鬆存取的狀態。如果不需要，您不必控制所有表格狀態。建議根據具體情況僅控制您需要的狀態。

為了控制特定狀態，您需要將對應的 `state` 值和 `on[State]Change` 函式傳遞給表格實例。

讓我們以「手動」伺服器端資料獲取情境中的過濾、排序和分頁為例。您可以將過濾、排序和分頁狀態儲存在自己的狀態管理中，但如果您的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```ts
let sorting = [
  {
    id: 'age',
    desc: true, //預設按年齡降序排序
  },
]
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}

let columnFilters = [] //無預設過濾器
const setColumnFilters = updater => {
  if (updater instanceof Function) {
    columnFilters = updater(columnFilters)
  } else {
    columnFilters = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      columnFilters,
    },
  }))
}

let pagination = { pageIndex: 0, pageSize: 15 } //預設分頁
const setPagination = updater => {
  if (updater instanceof Function) {
    pagination = updater(pagination)
  } else {
    pagination = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      pagination,
    },
  }))
}

//使用我們的受控狀態值來獲取資料
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const options = writable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //將受控狀態傳回表格 (覆蓋內部狀態)
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //將 columnFilters 狀態提升到我們自己的狀態管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})

const table = createSvelteTable(options)
//...
```

#### 完全受控狀態

或者，您可以使用 `onStateChange` 表格選項控制整個表格狀態。這會將整個表格狀態提升到您自己的狀態管理系統中。請謹慎使用此方法，因為您可能會發現將某些頻繁變化的狀態值（如 `columnSizingInfo` 狀態）提升到 Svelte 樹中可能會導致效能問題。

可能需要一些技巧才能使其運作。如果您使用 `onStateChange` 表格選項，則 `state` 的初始值必須填充所有相關狀態值，以用於您想要使用的所有功能。您可以手動輸入所有初始狀態值，或使用 `table.setOptions` API，如下所示。

```jsx
//建立一個帶有預設狀態值的表格實例
const options = writable({
  columns,
  data,
  //... 注意：尚未傳入 `state` 值
})
const table = createSvelteTable(options)

let state = {
  ...table.initialState, //用表格實例中的所有預設狀態值填充初始狀態
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可選自訂初始分頁狀態
  }
}
const setState = updater => {
  if (updater instanceof Function) {
    state = updater(state)
  } else {
    state = updater
  }
  options.update(old => ({
    ...old,
    state,
  }))
}

//使用 table.setOptions API 將我們的完全受控狀態合併到表格實例上
table.setOptions(prev => ({
  ...prev, //保留我們上面設定的任何其他選項
  state, //我們的完全受控狀態覆蓋內部狀態
  onStateChange: setState //任何狀態變更將被提升到我們自己的狀態管理
}))
```

### 狀態變更回呼 (On State Change Callbacks)

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項如何將表格狀態變更「提升」到我們自己的狀態管理中。然而，使用這些選項時有一些需要注意的事項。

#### 1. **狀態變更回呼必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼會告訴表格實例這將是一個受控狀態。如果您未指定對應的 `state` 值，該狀態將「凍結」為其初始值。

```ts
let sorting = []
const setSorting = updater => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
//...
const options = writable({
  columns,
  data,
  //...
  state: {
    sorting, //必需，因為我們使用了 `onSortingChange`
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
const table = createSvelteTable(options)
```

#### 2. **更新器可以是原始值或回呼函式**。

`on[State]Change` 和 `onStateChange` 回呼的工作方式與 React 中的 `setState` 函式完全相同。更新器值可以是新的狀態值，也可以是接收先前狀態值並返回新狀態值的回呼函式。

這意味著什麼？這意味著如果您想在 `on[State]Change` 回呼中添加一些額外邏輯，可以這樣做，但需要檢查新的傳入更新器值是函式還是值。

這就是為什麼您在上面的 `setState` 函式中看到 `if (updater instanceof Function)` 檢查的原因。

### 狀態類型 (State Types)

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，您可以導入和使用。這對於確保您為控制的狀態值使用正確的資料結構和屬性非常有用。

```ts
import { createSvelteTable, type SortingState, type Updater } from '@tanstack/svelte-table'
//...
let sorting: SortingState[] = [
  {
    id: 'age', //您應該會看到 `id` 和 `desc` 屬性的自動完成
    desc: true,
  }
]
const setSorting = (updater: Updater<SortingState>)  => {
  if (updater instanceof Function) {
    sorting = updater(sorting)
  } else {
    sorting = updater
  }
  options.update(old => ({
    ...old,
    state: {
      ...old.state,
      sorting,
    },
  }))
}
```
