---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:41:57.428Z'
title: 資料
---
## 資料指南

表格始於您的資料。您的欄位定義與資料列將取決於資料的結構。TanStack Table 提供了一些 TypeScript 功能，能協助您以類型安全的方式建立表格程式碼。若正確設定資料與類型，TanStack Table 將能推論資料結構，並確保欄位定義的正確性。

### TypeScript

使用 TanStack Table 套件並不需要 TypeScript... ***但*** TanStack Table 的撰寫與組織方式，讓其出色的 TypeScript 體驗成為該函式庫的主要賣點之一。若未使用 TypeScript，您將錯失許多自動完成與類型檢查功能，這些功能既能加速開發，也能減少程式碼中的錯誤。

#### TypeScript 泛型 (Generics)

基本了解 TypeScript 泛型及其運作方式，將有助於理解本指南，但您也能在過程中逐步掌握。官方 [TypeScript 泛型文件](https://www.typescriptlang.org/docs/handbook/2/generics.html) 對不熟悉 TypeScript 的人可能有所幫助。

### 定義資料類型

`data` 是一個物件陣列，將轉換為表格的資料列。陣列中的每個物件代表一列資料（一般情況下）。若使用 TypeScript，我們通常會為資料結構定義一個類型。此類型將作為其他表格、欄位、資料列與儲存格實例的泛型類型。在 TanStack Table 的類型與 API 中，此泛型通常稱為 `TData`。

例如，若有一個顯示使用者清單的表格，其資料陣列如下：

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

則我們可以定義一個使用者 (`TData`) 類型如下：

```ts
//TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

接著，我們可以用此類型定義 `data` 陣列，TanStack Table 將能智慧推論後續欄位、資料列、儲存格等的類型。這是因為 `data` 類型實際上就是 `TData` 泛型類型。傳遞給表格選項 `data` 的內容，將成為該表格實例的 `TData` 類型。只需確保後續定義欄位時，使用與 `data` 相同的 `TData` 類型。

```ts
//注意：data 需要一個「穩定」的參照，以避免無限重新渲染
const data: User[] = []
//或
const [data, setData] = React.useState<User[]>([])
//或
const data = ref<User[]>([]) //vue
//等等...
```

#### 深層鍵值資料

若您的資料不是平整的物件陣列，也沒關係！定義欄位時，有策略可以存取深層巢狀資料。

若您的 `data` 如下所示：

```json
[
  {
    "name": {
      "first": "Tanner",
      "last": "Linsley"
    },
    "info": {
      "age": 33,
      "visits": 100,
    }
  },
  {
    "name": {
      "first": "Kevin",
      "last": "Vandy"
    },
    "info": {
      "age": 27,
      "visits": 200,
    }
  }
]
```

您可以定義這樣的類型：

```ts
type User = {
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

並在欄位定義中，透過 `accessorKey` 的點記法或 `accessorFn` 存取資料。

```ts
const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: row => row.info.age, 
  },
  //...
]
```

更詳細的討論請參閱 [欄位定義指南](../guide/column-defs)。

> 注意：json 資料中的「鍵」通常可以是任何內容，但鍵中的句點會被解讀為深層鍵，可能導致錯誤。

#### 巢狀子資料列

若使用展開功能，資料中常有巢狀子資料列，這會產生稍有不同的遞迴類型。

若資料如下：

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "subRows": [
      {
        "firstName": "Kevin",
        "lastName": "Vandy",
      },
      {
        "firstName": "John",
        "lastName": "Doe",
        "subRows": [
          //...
        ]
      }
    ]
  },
  {
    "firstName": "Jane",
    "lastName": "Doe",
  }
]
```

您可以定義這樣的類型：

```ts
type User = {
  firstName: string
  lastName: string
  subRows?: User[] //不必命名為 "subRows"，可任意命名
}
```

其中 `subRows` 是 `User` 物件的可選陣列。更詳細的討論請參閱 [展開指南](../guide/expanding)。

### 給予資料「穩定」參照

傳遞給表格實例的 `data` 陣列 ***必須*** 有「穩定」的參照，以避免導致無限重新渲染的錯誤（特別是在 React 中）。

這取決於您使用的框架適配器，但在 React 中，通常應使用 `React.useState`、`React.useMemo` 或類似方法，確保 `data` 和 `columns` 表格選項有穩定的參照。

```tsx
const fallbackData = []

export default function MyComponent() {
  //✅ 良好：`columns` 有穩定參照，不會導致無限重新渲染
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良好：`data` 有穩定參照，不會導致無限重新渲染
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 欄位與資料定義於穩定參照中，不會導致無限迴圈！
  const table = useReactTable({
    columns,
    data ?? fallbackData, //也可使用定義於元件外的備用陣列（穩定參照）
  });

  return <table>...</table>;
}
```

`React.useState` 和 `React.useMemo` 並非唯一提供穩定參照的方法。您也可將資料定義於元件外，或使用第三方狀態管理函式庫如 Redux、Zustand 或 TanStack Query。

主要需避免的是在與 `useReactTable` 呼叫相同的範圍內定義 `data` 陣列。這會導致 `data` 陣列在每次渲染時重新定義，進而引發無限重新渲染的迴圈。

```tsx
export default function MyComponent() {
  //😵 不良：`columns` 在每次渲染時重新定義為新陣列，會導致無限重新渲染！
  const columns = [
    // ...
  ];

  //😵 不良：`data` 在每次渲染時重新定義為新陣列，會導致無限重新渲染！
  const data = [
    // ...
  ];

  //❌ 欄位與資料定義於 `useReactTable` 相同範圍且無穩定參照，會導致無限迴圈！
  const table = useReactTable({
    columns,
    data ?? [], //❌ 備用陣列在每次渲染時重新建立，同樣不良
  });

  return <table>...</table>;
}
```

### TanStack Table 如何轉換資料

在文件的其他部分，您將看到 TanStack Table 如何處理傳遞給表格的 `data`，並產生用於建立表格的資料列與儲存格物件。TanStack Table 不會變更您傳遞的 `data`，但資料列與儲存格中的實際值可能透過欄位定義中的存取器，或由 [資料列模型](../guide/row-models) 執行的其他功能（如分組或聚合）轉換。

### TanStack Table 能處理多少資料？

信不信由您，TanStack Table 實際上設計用於在客戶端處理可能高達數十萬筆的資料列。當然，這取決於每欄資料的大小與欄位數量，並非總是可行。然而，排序、篩選、分頁與分組功能皆以高效能處理大型資料集為設計考量。

開發者建立資料表格時，通常預設對大型資料集實作伺服器端分頁、排序與篩選。這通常仍是好主意，但許多開發者低估了現代瀏覽器與適當優化下，客戶端實際能處理的資料量。若表格永遠不會超過數千筆資料列，您或許能利用 TanStack Table 的客戶端功能，而非自行在伺服器實作。當然，在讓 TanStack Table 的客戶端功能處理大型資料集前，應以實際資料測試其效能是否符合需求。

更詳細的討論請參閱 [分頁指南](../guide/pagination#should-you-use-client-side-pagination)。
