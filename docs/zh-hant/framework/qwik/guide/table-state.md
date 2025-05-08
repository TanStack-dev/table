---
source-updated-at: '2024-05-17T05:10:48.000Z'
translation-updated-at: '2025-05-08T23:45:17.145Z'
title: 表格狀態
---
## Table 狀態管理 (Qwik) 指南

TanStack Table 的核心是**框架無關 (framework agnostic)** 的，這意味著無論使用哪種框架，其 API 都保持一致。針對不同框架提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱 Adapters 選單查看可用的適配器。

### 存取表格狀態

無需特別設定即可讓表格狀態正常運作。如果未向 `state`、`initialState` 或任何 `on[State]Change` 表格選項傳遞任何內容，表格將在內部自行管理狀態。您可以透過 `table.getState()` 表格實例 API 存取任何內部狀態。

```jsx
const table = useQwikTable({
  columns,
  data,
  //...
})

console.log(table.getState()) //存取整個內部狀態
console.log(table.getState().rowSelection) //僅存取行選取狀態
```

### 自訂初始狀態

若只需針對特定狀態自訂其初始預設值，仍無需自行管理任何狀態。只需在表格實例的 `initialState` 選項中設定值即可。

```jsx
const table = useQwikTable({
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
        desc: true //預設按年齡降冪排序
      }
    ]
  },
  //...
})
```

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 其中一處指定，不可同時設定。若將特定狀態值同時傳遞給 `initialState` 和 `state`，則 `state` 中的初始化狀態將覆蓋 `initialState` 中的對應值。

### 受控狀態 (Controlled State)

若需在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 可讓您輕鬆在自己的狀態管理系統中控制和管理部分或全部表格狀態。方法是將自己的狀態和狀態管理函式傳遞給 `state` 和 `on[State]Change` 表格選項。

#### 個別受控狀態

您可以僅控制需要輕鬆存取的狀態。若不需要，**不必**控制所有表格狀態。建議根據實際需求逐案控制所需狀態。

要控制特定狀態，需同時將對應的 `state` 值和 `on[State]Change` 函式傳遞給表格實例。

以「手動」伺服器端資料獲取情境中的篩選、排序和分頁為例。您可以將篩選、排序和分頁狀態儲存在自己的狀態管理中，但如果 API 不關心這些值，則可忽略其他狀態如欄位順序、欄位可見性等。

```jsx
const columnFilters = Qwik.useSignal([]) //無預設篩選條件
const sorting = Qwik.useSignal([{
  id: 'age',
  desc: true, //預設按年齡降冪排序
}]) 
const pagination = Qwik.useSignal({ pageIndex: 0, pageSize: 15 })

//使用受控狀態值獲取資料
const tableQuery = useQuery({
  queryKey: ['users', columnFilters.value, sorting.value, pagination.value],
  queryFn: () => fetchUsers(columnFilters.value, sorting.value, pagination.value),
  //...
})

const table = useQwikTable({
  columns: columns.value,
  data: tableQuery.data,
  //...
  state: {
    columnFilters: columnFilters.value, //將受控狀態傳回表格（覆蓋內部狀態）
    sorting: sorting.value,
    pagination: pagination.value,
  },
  onColumnFiltersChange: updater => {
    columnFilters.value = updater instanceof Function ? updater(columnFilters.value) : updater //將 columnFilters 狀態提升至自己的狀態管理
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting.value) : updater
  },
  onPaginationChange: updater => {
    pagination.value = updater instanceof Function ? updater(pagination.value) : updater
  },
})
//...
```

#### 完全受控狀態

或者，您可以使用 `onStateChange` 表格選項控制整個表格狀態。這會將整個表格狀態提升至您的狀態管理系統。請謹慎使用此方法，因為將某些頻繁變更的狀態值（如 `columnSizingInfo` 狀態）提升至元件樹可能會導致效能問題。

可能需要一些技巧來實現此功能。若使用 `onStateChange` 表格選項，則 `state` 的初始值必須填充所有相關狀態值，涵蓋您要使用的所有功能。您可以手動輸入所有初始狀態值，或如下所示特殊使用 `table.setOptions` API。

```jsx
//建立具有預設狀態值的表格實例
const table = useQwikTable({
  columns,
  data,
  //... 注意：尚未傳入 `state` 值
})


const sate = Qwik.useSignal({
  ...table.initialState, //用表格實例的所有預設狀態值填充初始狀態
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可選自訂初始分頁狀態
  }
})

//使用 table.setOptions API 將完全受控狀態合併到表格實例
table.setOptions(prev => ({
  ...prev, //保留上方設定的其他選項
  state: state.value, //完全受控狀態覆蓋內部狀態
  onStateChange: updater => {
    state.value = updater instanceof Function ? updater(state.value) : updater //任何狀態變更將推送至自己的狀態管理
  },
}))
```

### 狀態變更回呼函式

目前，我們已看到 `on[State]Change` 和 `onStateChange` 表格選項如何將表格狀態變更「提升」至我們的狀態管理。但使用這些選項時需注意以下幾點。

#### 1. **狀態變更回呼函式必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼函式會告知表格實例此為受控狀態。若未指定對應的 `state` 值，該狀態將「凍結」為其初始值。

```jsx
const sorting = Qwik.useSignal([])
//...
const table = useQwikTable({
  columns,
  data,
  //...
  state: {
    sorting: sorting.value, //必需，因為我們使用 `onSortingChange`
  },
  onSortingChange: updater => {
    sorting.value = updater instanceof Function ? updater(sorting) : updater //使 `state.sorting` 受控
  }, 
})
```

#### 2. **更新器 (Updaters) 可以是原始值或回呼函式**。

`on[State]Change` 和 `onStateChange` 回呼函式的工作方式與 React 中的 `setState` 函式完全相同。更新器值可以是新狀態值，也可以是接收先前狀態值並返回新狀態值的回呼函式。

這意味著什麼？這表示若想在 `on[State]Change` 回呼函式中加入額外邏輯，可以這樣做，但需檢查傳入的更新器值是函式還是值。

這就是為什麼在上面的範例中會看到 `updater instanceof Function ? updater(state.value) : updater` 模式。此模式檢查更新器是否為函式，若是，則呼叫該函式並傳入先前的狀態值以獲取新狀態值。

### 狀態類型

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，可供匯入和使用。這有助於確保您為控制的狀態值使用正確的資料結構和屬性。

```tsx
import { useQwikTable, type SortingState } from '@tanstack/qwik-table'
//...
const sorting = Qwik.useSignal<SortingState[]>([
  {
    id: 'age', //您應能獲得 `id` 和 `desc` 屬性的自動完成提示
    desc: true,
  }
])
```
