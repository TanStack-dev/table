---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:45:19.587Z'
title: 表格狀態
---
## 範例

想直接查看實作方式嗎？請參考以下範例：

- [綜合範例](../examples/kitchen-sink)
- [完全控制](../examples/fully-controlled)

## 表格狀態 (React) 指南

TanStack Table 的核心是 **框架無關 (framework agnostic)** 的，這意味著無論你使用哪種框架，其 API 都是相同的。根據你所使用的框架，提供了適配器 (Adapters) 來簡化與表格核心的互動。請參閱「適配器」選單以查看可用的適配器。

### 存取表格狀態

你無需特別設定即可讓表格狀態正常運作。如果你沒有傳遞任何值給 `state`、`initialState` 或任何 `on[State]Change` 表格選項，表格將在內部自行管理其狀態。你可以透過 `table.getState()` 表格實例 API 存取任何部分的內部狀態。

```jsx
const table = useReactTable({
  columns,
  data,
  //...
})

console.log(table.getState()) //存取整個內部狀態
console.log(table.getState().rowSelection) //僅存取行選取狀態
```

### 自訂初始狀態

如果你只需要為某些狀態自訂其初始預設值，仍然不需要自行管理任何狀態。你可以簡單地在表格實例的 `initialState` 選項中設定值。

```jsx
const table = useReactTable({
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

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 中指定，不可同時存在。如果你將特定狀態值同時傳遞給 `initialState` 和 `state`，`state` 中的初始化狀態將覆蓋 `initialState` 中的對應值。

### 受控狀態

如果你需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓你可以輕鬆地在自己的狀態管理系統中控制和管理任何或所有表格狀態。你可以透過將自己的狀態和狀態管理函式傳遞給 `state` 和 `on[State]Change` 表格選項來實現這一點。

#### 個別受控狀態

你可以僅控制你需要輕鬆存取的狀態。如果不需要，你不必控制所有表格狀態。建議根據實際情況僅控制你需要的狀態。

為了控制特定狀態，你需要同時將對應的 `state` 值和 `on[State]Change` 函式傳遞給表格實例。

讓我們以「手動」伺服器端資料擷取情境中的篩選、排序和分頁為例。你可以將篩選、排序和分頁狀態儲存在自己的狀態管理中，但如果你的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```jsx
const [columnFilters, setColumnFilters] = React.useState([]) //無預設篩選條件
const [sorting, setSorting] = React.useState([{
  id: 'age',
  desc: true, //預設按年齡降序排序
}]) 
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 15 })

//使用我們受控的狀態值來擷取資料
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useReactTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    columnFilters, //將受控狀態傳回表格（覆蓋內部狀態）
    sorting,
    pagination
  },
  onColumnFiltersChange: setColumnFilters, //將 columnFilters 狀態提升到我們自己的狀態管理
  onSortingChange: setSorting,
  onPaginationChange: setPagination,
})
//...
```

#### 完全受控狀態

或者，你可以使用 `onStateChange` 表格選項來控制整個表格狀態。這會將整個表格狀態提升到你自己的狀態管理系統中。請謹慎使用此方法，因為你可能會發現將某些頻繁變更的狀態值（如 `columnSizingInfo` 狀態）提升到 React 樹中可能會導致嚴重的效能問題。

可能需要一些額外的技巧來實現這一點。如果你使用 `onStateChange` 表格選項，`state` 的初始值必須填充所有相關的狀態值，以用於你想要使用的所有功能。你可以手動輸入所有初始狀態值，或者以如下所示的方式使用 `table.setOptions` API。

```jsx
//建立一個帶有預設狀態值的表格實例
const table = useReactTable({
  columns,
  data,
  //... 注意：尚未傳入 `state` 值
})


const [state, setState] = React.useState({
  ...table.initialState, //使用表格實例中的所有預設狀態值填充初始狀態
  pagination: {
    pageIndex: 0,
    pageSize: 15 //可選自訂初始分頁狀態
  }
})

//使用 table.setOptions API 將我們完全受控的狀態合併到表格實例中
table.setOptions(prev => ({
  ...prev, //保留我們上面設定的任何其他選項
  state, //我們完全受控的狀態覆蓋內部狀態
  onStateChange: setState //任何狀態變更都會被推送到我們自己的狀態管理
}))
```

### 狀態變更回呼函式

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項可以將表格狀態變更「提升」到我們自己的狀態管理中。然而，關於使用這些選項，有幾點你應該注意。

#### 1. **狀態變更回呼函式必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼函式會告訴表格實例這將是一個受控狀態。如果你沒有指定對應的 `state` 值，該狀態將「凍結」在其初始值。

```jsx
const [sorting, setSorting] = React.useState([])
//...
const table = useReactTable({
  columns,
  data,
  //...
  state: {
    sorting, //必需，因為我們正在使用 `onSortingChange`
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回呼函式**。

`on[State]Change` 和 `onStateChange` 回呼函式的工作方式與 React 中的 `setState` 函式完全相同。更新器值可以是一個新的狀態值，也可以是一個接收先前狀態值並返回新狀態值的回呼函式。

這有什麼影響？這意味著如果你想在任何 `on[State]Change` 回呼函式中加入一些額外邏輯，你可以這樣做，但你需要檢查新的傳入更新器值是函式還是值。

```jsx
const [sorting, setSorting] = React.useState([])
const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

const table = useReactTable({
  columns,
  data,
  //...
  state: {
    pagination,
    sorting,
  }
  //語法 1
  onPaginationChange: (updater) => {
    setPagination(old => {
      const newPaginationValue = updater instanceof Function ? updater(old) : updater
      //對新的分頁值進行一些操作
      //...
      return newPaginationValue
    })
  },
  //語法 2
  onSortingChange: (updater) => {
    const newSortingValue = updater instanceof Function ? updater(sorting) : updater
    //對新的排序值進行一些操作
    //...
    setSorting(updater) //正常的狀態更新
  }
})
```

### 狀態類型

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，你可以導入和使用。這對於確保你為控制的狀態值使用正確的資料結構和屬性非常有用。

```tsx
import { useReactTable, type SortingState } from '@tanstack/react-table'
//...
const [sorting, setSorting] = React.useState<SortingState[]>([
  {
    id: 'age', //你應該會看到 `id` 和 `desc` 屬性的自動完成
    desc: true,
  }
])
```
