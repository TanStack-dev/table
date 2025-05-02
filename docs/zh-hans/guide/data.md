---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T16:59:13.372Z'
title: 数据
---
## 数据指南

表格始于您的数据。列定义和行数据将取决于数据的结构。TanStack Table 提供了一些 TypeScript 功能，可帮助您以类型安全的方式构建表格代码。如果正确设置数据和类型，TanStack Table 将能够推断数据的结构，并确保列定义的正确性。

### TypeScript

使用 TanStack Table 并不强制要求 TypeScript... ***但*** TanStack Table 的编写和组织方式使其出色的 TypeScript 体验成为该库的主要卖点之一。如果不使用 TypeScript，您将错过许多优秀的自动补全和类型检查功能，这些功能既能加快开发速度，又能减少代码中的错误。

#### TypeScript 泛型

对 TypeScript 泛型及其工作原理有基本了解将有助于更好地理解本指南，但即使不熟悉也能轻松上手。官方 [TypeScript 泛型文档](https://www.typescriptlang.org/docs/handbook/2/generics.html) 可能对尚未熟悉 TypeScript 的开发者有所帮助。

### 定义数据类型

`data` 是一个对象数组，将被转换为表格的行。数组中的每个对象通常代表一行数据。如果使用 TypeScript，我们通常会为数据的结构定义一个类型。此类型用作表格、列、行和单元格实例的泛型类型。在 TanStack Table 的类型和 API 中，此泛型通常称为 `TData`。

例如，如果有一个显示用户列表的表格，数据如下：

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

我们可以定义一个 `User` (`TData`) 类型：

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

然后可以用此类型定义 `data` 数组，TanStack Table 将能够智能推断后续列、行、单元格等的类型。这是因为 `data` 类型实际上是 `TData` 泛型类型。传递给 `data` 表格选项的内容将成为表格实例其余部分的 `TData` 类型。只需确保后续定义列时使用与 `data` 相同的 `TData` 类型。

```ts
//注意：data 需要一个“稳定”的引用以防止无限重新渲染
const data: User[] = []
//或
const [data, setData] = React.useState<User[]>([])
//或
const data = ref<User[]>([]) //vue
//等等...
```

#### 深层键控数据

如果数据不是简单的扁平对象数组，也没关系！定义列时，可以通过访问器策略访问深层嵌套数据。

如果 `data` 如下所示：

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

可以定义如下类型：

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

然后可以在列定义中通过 `accessorKey` 的点符号或 `accessorFn` 访问数据。

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

更多细节请参阅 [列定义指南](../guide/column-defs)。

> 注意：JSON 数据中的“键”通常可以是任何内容，但键中的句点将被解释为深层键并可能导致错误。

#### 嵌套子行数据

如果使用展开功能，数据中可能会有嵌套的子行。这会形成一个略有不同的递归类型。

如果数据如下：

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

可以定义如下类型：

```ts
type User = {
  firstName: string
  lastName: string
  subRows?: User[] //不必命名为 "subRows"，可以是任意名称
}
```

其中 `subRows` 是 `User` 对象的可选数组。更多细节请参阅 [展开指南](../guide/expanding)。

### 为数据提供“稳定”引用

传递给表格实例的 `data` 数组 ***必须*** 具有“稳定”的引用，以防止导致无限重新渲染的 bug（尤其是在 React 中）。

这取决于您使用的框架适配器，但在 React 中，通常应使用 `React.useState`、`React.useMemo` 或类似方法确保 `data` 和 `columns` 表格选项具有稳定的引用。

```tsx
const fallbackData = []

export default function MyComponent() {
  //✅ 良好：`columns` 是稳定引用，不会导致无限重新渲染
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良好：`data` 是稳定引用，不会导致无限重新渲染
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 列和数据定义在稳定引用中，不会导致无限循环！
  const table = useReactTable({
    columns,
    data ?? fallbackData, //也可以使用组件外部定义的备用数组（稳定引用）
  });

  return <table>...</table>;
}
```

`React.useState` 和 `React.useMemo` 并非唯一提供稳定引用的方式。也可以在组件外部定义数据，或使用 Redux、Zustand 或 TanStack Query 等第三方状态管理库。

主要避免的是在 `useReactTable` 调用的同一作用域内定义 `data` 数组。这会导致 `data` 数组在每次渲染时重新定义，从而引发无限重新渲染循环。

```tsx
export default function MyComponent() {
  //😵 错误：`columns` 在每次渲染时重新定义为新数组，会导致无限重新渲染！
  const columns = [
    // ...
  ];

  //😵 错误：`data` 在每次渲染时重新定义为新数组，会导致无限重新渲染！
  const data = [
    // ...
  ];

  //❌ 列和数据在 `useReactTable` 的同一作用域内定义且无稳定引用，会导致无限循环！
  const table = useReactTable({
    columns,
    data ?? [], //❌ 备用数组在每次渲染时重新创建，同样不好
  });

  return <table>...</table>;
}
```

### TanStack Table 如何转换数据

在文档的其他部分，您将看到 TanStack Table 如何处理传递给表格的 `data`，并生成用于创建表格的行和单元格对象。TanStack Table 不会修改传递给表格的 `data`，但行和单元格中的实际值可能会通过列定义中的访问器或其他功能（如分组或聚合）进行转换，这些功能由 [行模型](../guide/row-models) 执行。

### TanStack Table 能处理多少数据？

信不信由您，TanStack Table 实际上是为处理客户端可能数十万行数据而构建的。这显然并不总是可行，具体取决于每列数据的大小和列数。但排序、筛选、分页和分组功能在设计时都考虑了大型数据集的性能。

开发者构建数据网格的默认思维是为大型数据集实现服务端分页、排序和筛选。这通常仍是个好主意，但许多开发者低估了现代浏览器和适当优化后客户端实际能处理的数据量。如果表格的行数永远不会超过几千行，您可能可以利用 TanStack Table 的客户端功能，而不是自己在服务端实现。当然，在决定让 TanStack Table 的客户端功能处理大型数据集之前，应使用实际数据进行测试，以确保性能满足需求。

更多细节请参阅 [分页指南](../guide/pagination#should-you-use-client-side-pagination)。
