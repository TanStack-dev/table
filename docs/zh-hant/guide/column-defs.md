---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:03.765Z'
title: 欄位定義
---
## API

[欄位定義](../api/core/column-def)

## 欄位定義指南

> 注意：本指南是關於為表格設定欄位定義，而非關於表格實例中實際生成的 [`column`](../guide/columns) 物件。

欄位定義是構建表格最重要的部分。它們負責：

- 建立將用於排序、篩選、分組等所有功能的底層資料模型
- 將資料模型格式化為表格中顯示的內容
- 建立 [標題群組](../api/core/header-group)、[標題](../api/core/header) 和 [頁尾](../api/core/column-def#footer)
- 建立僅用於顯示的欄位，例如操作按鈕、核取方塊、展開器、走勢圖等

## 欄位定義類型

以下「類型」的欄位定義並非實際的 TypeScript 類型，而是用來描述欄位定義的整體分類：

- `存取器欄位 (Accessor Columns)`
  - 存取器欄位具有底層資料模型，因此可以進行排序、篩選、分組等操作
- `顯示欄位 (Display Columns)`
  - 顯示欄位**沒有**資料模型，因此無法排序、篩選等，但可用於在表格中顯示任意內容，例如行操作按鈕、核取方塊、展開器等
- `分組欄位 (Grouping Columns)`
  - 分組欄位**沒有**資料模型，因此也無法排序、篩選等，主要用於將其他欄位分組。通常會為欄位群組定義標題或頁尾

## 欄位輔助工具

雖然欄位定義最終只是普通物件，但表格核心提供了一個 `createColumnHelper` 函式，當傳入行類型時，會返回一個用於以最高類型安全性建立不同欄位定義類型的工具。

以下是建立和使用欄位輔助工具的範例：

```tsx
// 定義你的行結構
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

// 建立一些欄位！
const defaultColumns = [
  // 顯示欄位
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  // 分組欄位
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      // 存取器欄位
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      // 存取器欄位
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  // 分組欄位
  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      // 存取器欄位
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      // 分組欄位
      columnHelper.group({
        header: 'More Info',
        columns: [
          // 存取器欄位
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          // 存取器欄位
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          // 存取器欄位
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

## 建立存取器欄位

資料欄位的獨特之處在於必須配置為從 `data` 陣列中的每個項目提取原始值。

有三種方法可以做到這一點：

- 如果你的項目是 `物件`，使用對應於你想提取值的物件鍵
- 如果你的項目是巢狀 `陣列`，使用對應於你想提取值的陣列索引
- 使用返回你想提取值的存取器函式

## 物件鍵

如果你的每個項目是具有以下結構的物件：

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

你可以這樣提取 `firstName` 值：

```tsx
columnHelper.accessor('firstName')

// 或

{
  accessorKey: 'firstName',
}
```

## 深層鍵

如果你的每個項目是具有以下結構的物件：

```tsx
type Person = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}
```

你可以這樣提取 `first` 值：

```tsx
columnHelper.accessor('name.first', {
  id: 'firstName',
})

// 或

{
  accessorKey: 'name.first',
  id: 'firstName',
}
```

## 陣列索引

如果你的每個項目是具有以下結構的陣列：

```tsx
type Sales = [Date, number]
```

你可以這樣提取 `number` 值：

```tsx
columnHelper.accessor(1)

// 或

{
  accessorKey: 1,
}
```

## 存取器函式

如果你的每個項目是具有以下結構的物件：

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

你可以這樣提取計算後的全名值：

```tsx
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// 或

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

> 🧠 記住，存取的值是用於排序、篩選等的，因此你需要確保存取器函式返回一個可以有意義操作的原始值。如果返回非原始值（如物件或陣列），則需要適當的篩選/排序/分組函式來操作它們，甚至可能需要提供自己的函式！😬

## 唯一欄位 ID

欄位通過以下三種策略唯一標識：

- 如果使用物件鍵或陣列索引定義存取器欄位，則相同的鍵或索引將用於唯一標識欄位
  - 物件鍵中的任何句點 (`.`) 將被替換為底線 (`_`)
- 如果使用存取器函式定義存取器欄位
  - 欄位的 `id` 屬性將用於唯一標識欄位，或
  - 如果提供了原始 `字串` 標題，則該標題字串將用於唯一標識欄位

> 🧠 簡單記住：如果使用存取器函式定義欄位，請提供字串標題或唯一的 `id` 屬性

## 欄位格式化與渲染

預設情況下，欄位單元格會將其資料模型值顯示為字串。你可以通過提供自訂渲染實現來覆蓋此行為。每個實現都會獲得有關單元格、標題或頁尾的相關資訊，並返回你的框架適配器可以渲染的內容，例如 JSX/元件/字串等。這取決於你使用的適配器。

有幾種格式化器可供使用：

- `cell`：用於格式化單元格
- `aggregatedCell`：用於在聚合時格式化單元格
- `header`：用於格式化標題
- `footer`：用於格式化頁尾

## 單元格格式化

你可以通過將函式傳遞給 `cell` 屬性並使用 `props.getValue()` 函式來存取單元格的值，從而提供自訂單元格格式化器：

```tsx
columnHelper.accessor('firstName', {
  cell: props => <span>{props.getValue().toUpperCase()}</span>,
})
```

單元格格式化器還提供了 `row` 和 `table` 物件，允許你不僅基於單元格值來自訂單元格格式化。以下範例提供了 `firstName` 作為存取器，但同時顯示了位於原始行物件上的前置使用者 ID：

```tsx
columnHelper.accessor('firstName', {
  cell: props => (
    <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  ),
})
```

## 聚合單元格格式化

有關聚合單元格的更多資訊，請參閱 [分組](../guide/grouping)

## 標題與頁尾格式化

標題和頁尾無法存取行資料，但仍使用相同的概念來顯示自訂內容
