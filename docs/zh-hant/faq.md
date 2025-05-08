---
source-updated-at: '2024-03-28T21:06:30.000Z'
translation-updated-at: '2025-05-08T23:40:08.738Z'
title: 常見問題
---
## 如何避免無限渲染迴圈？

如果你使用 React，有一個常見的陷阱可能導致無限渲染。如果你沒有為 `columns`、`data` 或 `state` 提供穩定的參考 (stable reference)，React 會在表格狀態發生任何變化時進入無限重新渲染的迴圈。

為什麼會這樣？這是 TanStack Table 的錯誤嗎？**不是**，這不是錯誤。*這基本上是 React 的運作方式*，妥善管理你的 columns、data 和 state 就能避免這個問題。

TanStack Table 的設計是當傳入表格的 `data` 或 `columns` 發生變化，或表格的任何狀態發生變化時，就會觸發重新渲染。

> 未能為 `columns` 或 `data` 提供穩定的參考可能導致無限重新渲染迴圈。

### 陷阱 1：在每次渲染時創建新的 columns 或 data

```js
export default function MyComponent() {
  //😵 錯誤：這會導致無限重新渲染迴圈，因為 `columns` 在每次渲染時都被重新定義為一個新陣列！
  const columns = [
    // ...
  ];

  //😵 錯誤：這會導致無限重新渲染迴圈，因為 `data` 在每次渲染時都被重新定義為一個新陣列！
  const data = [
    // ...
  ];

  //❌ Columns 和 data 在與 `useReactTable` 相同的範圍內定義且沒有穩定參考，將導致無限迴圈！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 解決方案 1：使用 useMemo 或 useState 提供穩定參考

在 React 中，你可以透過將變數定義在元件外部/上方、使用 `useMemo` 或 `useState`，或使用第三方狀態管理庫（如 Redux 或 React Query 😉）來提供「穩定」的參考。

```js
//✅ 正確：在元件外部定義 columns
const columns = [
  // ...
];

//✅ 正確：在元件外部定義 data
const data = [
  // ...
];

// 通常更實際的做法是在元件內部定義 columns 和 data，因此使用 `useMemo` 或 `useState` 來提供穩定參考
export default function MyComponent() {
  //✅ 正確：這不會導致無限重新渲染迴圈，因為 `columns` 是一個穩定參考
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正確：這不會導致無限重新渲染迴圈，因為 `data` 是一個穩定參考
  const [data, setData] = useState(() => [
    // ...
  ]);

  // Columns 和 data 定義為穩定參考，不會導致無限迴圈！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 陷阱 2：原地修改 columns 或 data

即使你為初始的 `columns` 和 `data` 提供了穩定參考，如果你原地修改它們，仍然可能陷入無限迴圈。這是一個常見的陷阱，一開始可能不會注意到。即使是簡單的內聯 `data.filter()`，如果不小心使用，也可能導致無限迴圈。

```js
export default function MyComponent() {
  //✅ 正確
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正確（React Query 會自動為 data 提供穩定參考）
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useReactTable({
    columns,
    //❌ 錯誤：這會導致無限重新渲染迴圈，因為 `data` 被原地修改（破壞了穩定參考）
    data: data?.filter(d => d.isActive) ?? [],
  });

  return <table>...</table>;
}
```

### 解決方案 2：記憶化你的資料轉換

為了避免無限迴圈，你應該總是記憶化你的資料轉換。這可以透過 `useMemo` 或類似方法實現。

```js
export default function MyComponent() {
  //✅ 正確
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 正確
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ 正確：這不會導致無限重新渲染迴圈，因為 `filteredData` 被記憶化了
  const filteredData = useMemo(() => data?.filter(d => d.isActive) ?? [], [data]);

  const table = useReactTable({
    columns,
    data: filteredData, // 穩定參考！
  });

  return <table>...</table>;
}
```

### React Forget

當 React Forget 發布後，這些問題可能就會成為過去式。或者直接使用 Solid.js... 🤓

## 如何在資料變更時避免表格狀態自動重置？

大多數插件使用的狀態*通常*應該在資料來源變更時重置，但有時如果你在外部過濾資料、不可變地編輯資料時查看資料，或只是對資料進行任何不希望觸發表格狀態自動重置的外部操作，你可能需要抑制這種行為。

對於這些情況，每個插件都提供了一種方法來禁用狀態在資料或其他依賴項變更時自動重置。通過將任何相關選項設置為 `false`，你可以阻止自動重置被觸發。

以下是一個基於 React 的範例，展示如何在編輯表格的 `data` 來源時阻止所有狀態像平常那樣變更：

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // 當使用此函數更新資料時，設置一個標記
  // 以禁用所有自動重置
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // 在表格更新後，總是移除標記
  skipPageResetRef.current = false
})

useReactTable({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

現在，當我們更新資料時，上述表格狀態將不會自動重置！
