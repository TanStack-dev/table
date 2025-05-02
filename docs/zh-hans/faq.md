---
source-updated-at: '2024-03-28T21:06:30.000Z'
translation-updated-at: '2025-05-02T16:50:14.598Z'
title: 常见问题解答
---
## 如何避免无限渲染循环？

如果你在使用 React，有一个常见的陷阱会导致无限渲染。如果你未能为 `columns`、`data` 或 `state` 提供稳定的引用，React 会在表格状态发生任何变化时进入无限重新渲染循环。

为什么会这样？这是 TanStack Table 的 bug 吗？**不是**。*这是 React 的基本工作原理*，正确管理你的列、数据和状态可以避免这个问题。

TanStack Table 的设计会在传入表格的 `data` 或 `columns` 发生变化时，或表格的任何状态发生变化时触发重新渲染。

> 未能为 `columns` 或 `data` 提供稳定的引用会导致无限重新渲染循环。

### 陷阱 1：在每次渲染时创建新的列或数据

```js
export default function MyComponent() {
  //😵 错误：这将导致无限重新渲染循环，因为 `columns` 在每次渲染时被重新定义为一个新数组！
  const columns = [
    // ...
  ];

  //😵 错误：这将导致无限重新渲染循环，因为 `data` 在每次渲染时被重新定义为一个新数组！
  const data = [
    // ...
  ];

  //❌ 列和数据在 `useReactTable` 的同一作用域内定义且没有稳定引用，会导致无限循环！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 解决方案 1：使用 useMemo 或 useState 提供稳定引用

在 React 中，你可以通过将变量定义在组件外部/上方，或使用 `useMemo`、`useState`，或使用第三方状态管理库（如 Redux 或 React Query 😉）来提供“稳定”引用。

```js
//✅ 正确：在组件外部定义列
const columns = [
  // ...
];

//✅ 正确：在组件外部定义数据
const data = [
  // ...
];

// 通常更实际的做法是在组件内部定义列和数据，因此使用 `useMemo` 或 `useState` 来提供稳定引用
export default function MyComponent() {
  //✅ 正确：这不会导致无限重新渲染循环，因为 `columns` 是一个稳定引用
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正确：这不会导致无限重新渲染循环，因为 `data` 是一个稳定引用
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 列和数据具有稳定引用，不会导致无限循环！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 陷阱 2：原地修改列或数据

即使你为初始的 `columns` 和 `data` 提供了稳定引用，如果你原地修改它们，仍然可能陷入无限循环。这是一个常见的陷阱，一开始可能不会注意到。像简单的内联 `data.filter()` 这样的操作如果不小心处理，也可能导致无限循环。

```js
export default function MyComponent() {
  //✅ 正确
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正确（React Query 会自动为数据提供稳定引用）
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useReactTable({
    columns,
    //❌ 错误：这将导致无限重新渲染循环，因为 `data` 被原地修改（破坏了稳定引用）
    data: data?.filter(d => d.isActive) ?? [],
  });

  return <table>...</table>;
}
```

### 解决方案 2：缓存数据转换

为了避免无限循环，你应该始终缓存数据转换操作。可以使用 `useMemo` 或类似方法实现。

```js
export default function MyComponent() {
  //✅ 正确
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正确
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ 正确：这不会导致无限重新渲染循环，因为 `filteredData` 被缓存了
  const filteredData = useMemo(() => data?.filter(d => d.isActive) ?? [], [data]);

  const table = useReactTable({
    columns,
    data: filteredData, // 稳定引用！
  });

  return <table>...</table>;
}
```

### React Forget

当 React Forget 发布后，这些问题可能会成为过去。或者直接使用 Solid.js... 🤓

## 如何在数据变化时阻止表格状态自动重置？

大多数插件使用的状态在数据源变化时*通常*应该重置，但有时如果你在外部过滤数据、不可变地编辑数据时查看数据，或只是对数据做任何不希望触发表格状态自动重置的外部操作时，你需要阻止这种自动重置行为。

对于这些情况，每个插件都提供了禁用状态自动重置的方法。通过将它们中的任何一个设置为 `false`，你可以阻止自动重置被触发。

以下是一个基于 React 的示例，展示了在编辑表格的 `data` 源时阻止所有状态自动重置的方法：

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // 当通过此函数更新数据时，设置一个标志
  // 以禁用所有自动重置
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // 表格更新后，始终移除标志
  skipPageResetRef.current = false
})

useReactTable({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

现在，当我们更新数据时，上述表格状态将不会自动重置！
