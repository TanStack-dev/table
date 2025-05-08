---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:45:19.640Z'
title: 表格狀態
---
## Table State (Solid) 指南

TanStack Table 的核心是 **框架無關 (framework agnostic)** 的，這意味著無論您使用哪種框架，其 API 都是相同的。根據您使用的框架，提供了適配器 (Adapters) 來簡化與表格核心的互動。請參閱適配器選單以查看可用的適配器。

### 存取表格狀態

您無需特別設定即可讓表格狀態運作。如果您沒有向 `state`、`initialState` 或任何 `on[State]Change` 表格選項傳遞任何內容，表格將在內部管理自己的狀態。您可以使用 `table.getState()` 表格實例 API 來存取此內部狀態的任何部分。

```jsx
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //...
})

console.log(table.getState()) //存取整個內部狀態
console.log(table.getState().rowSelection) //僅存取行選擇狀態
```

### 自訂初始狀態

如果您只需要為某些狀態自訂其初始預設值，您仍然不需要自行管理任何狀態。您只需在表格實例的 `initialState` 選項中設定值即可。

```jsx
const table = createSolidTable({
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
```

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 中指定，但不能同時指定。如果您將特定狀態值傳遞給 `initialState` 和 `state`，則 `state` 中的初始化狀態將覆蓋 `initialState` 中的任何對應值。

### 受控狀態

如果您需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓您可以輕鬆地在自己的狀態管理系統中控制和管理任何或所有表格狀態。您可以通過將自己的狀態和狀態管理函數傳遞給 `state` 和 `on[State]Change` 表格選項來實現這一點。

#### 個別受控狀態

您可以僅控制您需要輕鬆存取的狀態。如果不需要，您不必控制所有表格狀態。建議根據具體情況僅控制您需要的狀態。

為了控制特定狀態，您需要將對應的 `state` 值和 `on[State]Change` 函數傳遞給表格實例。

讓我們以「手動」伺服器端數據獲取場景中的篩選、排序和分頁為例。您可以將篩選、排序和分頁狀態存儲在自己的狀態管理中，但如果您的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```jsx
const [columnFilters, setColumnFilters] = createSignal([]) //無預設篩選
const [sorting, setSorting] = createSignal([{
  id: 'age',
  desc: true, //預設按年齡降序排序
}]) 
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 15 })

//使用我們的受控狀態值來獲取數據
const tableQuery = createQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = createSolidTable({
  columns,
  get data() {
    return tableQuery.data()
  },
  //...
  state: {
    get columnFilters() {
      return columnFilters() //將受控狀態傳回表格（覆蓋內部狀態）
    },
    get sorting() {
      return sorting()
    },
    get pagination() {
      return pagination()
    },
  },
  onColumnFiltersChange: setColumnFilters, //將 columnFilters 狀態提升到我們自己的狀態管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全受控狀態

或者，您可以使用 `onStateChange` 表格選項來控制整個表格狀態。這將把整個表格狀態提升到您自己的狀態管理系統中。請謹慎使用此方法，因為您可能會發現將一些頻繁變化的狀態值（如 `columnSizingInfo` 狀態）提升到 Solid 樹中可能會導致性能問題。

可能需要一些技巧來實現這一點。如果您使用 `onStateChange` 表格選項，則 `state` 的初始值必須填充您想要使用的所有相關狀態值。您可以手動輸入所有初始狀態值，或者使用 `table.setOptions` API 的特殊方式，如下所示。

```jsx
//創建一個帶有預設狀態值的表格實例
const table = createSolidTable({
  columns,
  get data() {
    return data()
  },
  //... 注意：尚未傳入 `state` 值
})


const [state, setState] = createSignal({
  ...table.initialState, //用表格實例的所有預設狀態值填充初始狀態
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可選自訂初始分頁狀態
  }
})

//使用 table.setOptions API 將我們的完全受控狀態合併到表格實例上
table.setOptions(prev => ({
  ...prev, //保留我們在上面設定的任何其他選項
  get state() {
    return state() //我們的完全受控狀態覆蓋內部狀態
  },
  onStateChange: setState //任何狀態更改都將推送到我們自己的狀態管理
}))
```

### 狀態更改回調

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項可以將表格狀態更改「提升」到我們自己的狀態管理中。然而，關於使用這些選項，有幾點您應該注意。

#### 1. **狀態更改回調必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回調告訴表格實例這將是一個受控狀態。如果您沒有指定對應的 `state` 值，該狀態將「凍結」其初始值。

```jsx
const [sorting, setSorting] = createSignal([])
//...
const table = createSolidTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting() //必需，因為我們正在使用 `onSortingChange`
    },
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回調函數**。

`on[State]Change` 和 `onStateChange` 回調的工作方式與 React (Solid Setters) 中的 `setState` 函數完全相同。更新器值可以是新的狀態值，也可以是接收先前狀態值並返回新狀態值的回調函數。

這有什麼影響？這意味著如果您想在任何 `on[State]Change` 回調中添加一些額外邏輯，您可以這樣做，但您需要檢查新的傳入更新器值是函數還是值。

```jsx
const [sorting, setSorting] = createSignal([])
const [pagination, setPagination] = createSignal({ pageIndex: 0, pageSize: 10 })

const table = createSolidTable({
  get columns() {
    return columns()
  },
  get data() {
    return data()
  },
  //...
  state: {
    get pagination() {
      return pagination()
    },
    get sorting() {
      return sorting()
    },
  }
  //語法 1
  onPaginationChange: (updater) => {
    setPagination(old => {
      const newPaginationValue = updater instanceof Function ? updater(old) : updater
      //對新的分頁值進行操作
      //...
      return newPaginationValue
    })
  },
  //語法 2
  onSortingChange: (updater) => {
    const newSortingValue = updater instanceof Function ? updater(sorting) : updater
    //對新的排序值進行操作
    //...
    setSorting(updater) //正常狀態更新
  }
})
```

### 狀態類型

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，您可以導入和使用。這對於確保您為控制的狀態值使用正確的數據結構和屬性非常有用。

```tsx
import { createSolidTable, type SortingState } from '@tanstack/solid-table'
//...
const [sorting, setSorting] = createSignal<SortingState[]>([
  {
    id: 'age', //您應該可以獲得 `id` 和 `desc` 屬性的自動完成
    desc: true,
  }
])
```
