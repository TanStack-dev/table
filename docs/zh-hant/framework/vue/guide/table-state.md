---
source-updated-at: '2024-08-10T14:15:46.000Z'
translation-updated-at: '2025-05-08T23:45:17.806Z'
title: 表格狀態
---
## 表格狀態 (Vue) 指南

TanStack Table 的核心是**框架無關 (framework agnostic)** 的，這意味著無論您使用哪種框架，其 API 都是相同的。根據您使用的框架，提供了適配器 (adapters) 來簡化與表格核心的互動。請參閱適配器選單以查看可用的適配器。

### 存取表格狀態

您無需特別設定即可讓表格狀態運作。如果您沒有向 `state`、`initialState` 或任何 `on[State]Change` 表格選項傳入任何內容，表格將在內部管理自己的狀態。您可以使用 `table.getState()` 表格實例 API 來存取此內部狀態的任何部分。

```ts
const table = useVueTable({
  columns,
  data: dataRef, // 支援響應式資料
  //...
})

console.log(table.getState()) //存取整個內部狀態
console.log(table.getState().rowSelection) //僅存取行選擇狀態
```

### 使用響應式資料

> **v8.20.0 新增功能**

`useVueTable` 鉤子現在支援響應式資料。這意味著您可以將包含資料的 Vue `ref` 或 `computed` 傳遞給 `data` 選項。表格將自動響應資料的變更。

```ts
const columns = [
  { accessor: 'id', Header: 'ID' },
  { accessor: 'name', Header: 'Name' }
]

const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

const table = useVueTable({
  columns,
  data: dataRef, // 傳遞響應式資料 ref
})

// 之後，更新 dataRef 將自動更新表格
dataRef.value = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Doe' }
]
```

> ⚠️ 出於效能考慮，底層使用了 `shallowRef`，這意味著資料不是深度響應的，只有 `.value` 是。要更新資料，您必須直接變更資料。

```ts
const dataRef = ref([
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' }
])

// 這將不會更新表格 ❌
dataRef.value.push({ id: 4, name: 'John' })

// 這將更新表格 ✅
dataRef.value = [
  ...dataRef.value,
  { id: 4, name: 'John' }
]
```

### 自訂初始狀態

如果您只需要為某些狀態自訂其初始預設值，您仍然不需要自行管理任何狀態。您只需在表格實例的 `initialState` 選項中設定值即可。

```jsx
const table = useVueTable({
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

> **注意**：每個特定狀態只能在 `initialState` 或 `state` 中指定，但不能同時指定。如果您將特定狀態值同時傳遞給 `initialState` 和 `state`，則 `state` 中的初始化狀態將覆蓋 `initialState` 中的任何對應值。

### 受控狀態

如果您需要在應用程式的其他區域輕鬆存取表格狀態，TanStack Table 讓您可以輕鬆地在自己的狀態管理系統中控制和管理的任何或所有表格狀態。您可以通過將自己的狀態和狀態管理函數傳遞給 `state` 和 `on[State]Change` 表格選項來實現這一點。

#### 個別受控狀態

您可以僅控制您需要輕鬆存取的狀態。如果不需要，您不必控制所有表格狀態。建議根據具體情況僅控制您需要的狀態。

為了控制特定狀態，您需要將對應的 `state` 值和 `on[State]Change` 函數都傳遞給表格實例。

讓我們以「手動」伺服器端資料獲取場景中的篩選、排序和分頁為例。您可以將篩選、排序和分頁狀態存儲在自己的狀態管理中，但如果您的 API 不關心這些值，則可以忽略其他狀態，如欄位順序、欄位可見性等。

```ts
const columnFilters = ref([]) //無預設篩選條件
const sorting = ref([{
  id: 'age',
  desc: true, //預設按年齡降序排序
}])
const pagination = ref({ pageIndex: 0, pageSize: 15 }

//使用我們受控的狀態值來獲取資料
const tableQuery = useQuery({
  queryKey: ['users', columnFilters, sorting, pagination],
  queryFn: () => fetchUsers(columnFilters, sorting, pagination),
  //...
})

const table = useVueTable({
  columns,
  data: tableQuery.data,
  //...
  state: {
    get columnFilters() {
      return columnFilters.value
    },
    get sorting() {
      return sorting.value
    },
    get pagination() {
      return pagination.value
    }
  },
  onColumnFiltersChange: updater => {
    columnFilters.value =
      updater instanceof Function
        ? updater(columnFilters.value)
        : updater
  },
  onSortingChange: updater => {
    sorting.value =
      updater instanceof Function
        ? updater(sorting.value)
        : updater
  },
  onPaginationChange: updater => {
    pagination.value =
      updater instanceof Function
        ? updater(pagination.value)
        : updater
  },
})
//...
```

#### 完全受控狀態

或者，您可以使用 `onStateChange` 表格選項來控制整個表格狀態。這將把整個表格狀態提升到您自己的狀態管理系統中。請謹慎使用此方法，因為您可能會發現將一些頻繁變更的狀態值（如 `columnSizingInfo` 狀態）提升到 React 樹中可能會導致效能問題。

可能需要一些技巧來實現這一點。如果您使用 `onStateChange` 表格選項，則 `state` 的初始值必須填充您想要使用的所有相關狀態值。您可以手動輸入所有初始狀態值，或者使用 `table.setOptions` API，如下所示。

```jsx
//使用預設狀態值建立表格實例
const table = useVueTable({
  get columns() {
    return columns.value
  },
  data,
  //... 注意：尚未傳入 `state` 值
})

const state = ref({
  ...table.initialState,
  pagination: {
    pageIndex: 0,
    pageSize: 15
  }
})
const setState = updater => {
  state.value = updater instanceof Function ? updater(state.value) : updater
}

//使用 table.setOptions API 將我們完全受控的狀態合併到表格實例中
table.setOptions(prev => ({
  ...prev, //保留我們上面設定的任何其他選項
  get state() {
    return state.value
  },
  onStateChange: setState //任何狀態變更將被提升到我們自己的狀態管理
}))
```

### 狀態變更回呼

到目前為止，我們已經看到 `on[State]Change` 和 `onStateChange` 表格選項如何將表格狀態變更「提升」到我們自己的狀態管理中。然而，使用這些選項時有一些需要注意的事項。

#### 1. **狀態變更回呼必須在 `state` 選項中有對應的狀態值**。

指定 `on[State]Change` 回呼會告訴表格實例這將是一個受控狀態。如果您沒有指定對應的 `state` 值，該狀態將「凍結」其初始值。

```jsx
const sorting = ref([])
const setSorting = updater => {
  sorting.value = updater instanceof Function ? updater(sorting.value) : updater
}
//...
const table = useVueTable({
  columns,
  data,
  //...
  state: {
    get sorting() {
      return sorting //必需，因為我們正在使用 `onSortingChange`
    },
  },
  onSortingChange: setSorting, //使 `state.sorting` 受控
})
```

#### 2. **更新器可以是原始值或回呼函數**。

`on[State]Change` 和 `onStateChange` 回呼的工作方式與 React 中的 `setState` 函數完全相同。更新器值可以是新的狀態值，也可以是接收先前狀態值並返回新狀態值的回呼函數。

這有什麼影響？這意味著如果您想在任何 `on[State]Change` 回呼中添加一些額外邏輯，您可以這樣做，但您需要檢查新的更新器值是函數還是值。

這就是為什麼我們在上面的 `setState` 函數中有 `updater instanceof Function` 檢查。此檢查允許我們在同一函數中處理原始值和回呼函數。

### 狀態類型

TanStack Table 中的所有複雜狀態都有自己的 TypeScript 類型，您可以導入和使用。這對於確保您為控制的狀態值使用正確的資料結構和屬性非常有用。

```tsx
import { useVueTable, type SortingState } from '@tanstack/vue-table'
//...
const sorting = ref<SortingState[]>([
  {
    id: 'age', //您應該可以自動完成 `id` 和 `desc` 屬性
    desc: true,
  }
])
```
