---
source-updated-at: '2024-03-28T21:06:30.000Z'
translation-updated-at: '2025-05-05T19:24:20.984Z'
title: FAQ
---
## 無限レンダリングループを防ぐ方法

Reactを使用している場合、無限レンダリングを引き起こす非常に一般的な落とし穴があります。`columns`、`data`、または`state`に安定した参照を提供しないと、テーブルの状態が変更されるたびにReactが無限に再レンダリングを繰り返します。

なぜこれが起こるのでしょうか？これはTanStack Tableのバグでしょうか？**いいえ**、そうではありません。*これはReactの基本的な動作*であり、columns、data、stateを適切に管理することで防ぐことができます。

TanStack Tableは、テーブルに渡される`data`または`columns`が変更されたとき、またはテーブルの状態が変更されたときに再レンダリングをトリガーするように設計されています。

> `columns`や`data`に安定した参照を提供しないと、無限の再レンダリングループが発生する可能性があります。

### 落とし穴1: 毎回のレンダリングで新しいcolumnsやdataを作成する

```js
export default function MyComponent() {
  //😵 悪い例: `columns`が毎回のレンダリングで新しい配列として再定義されるため、無限レンダリングループが発生します！
  const columns = [
    // ...
  ];

  //😵 悪い例: `data`が毎回のレンダリングで新しい配列として再定義されるため、無限レンダリングループが発生します！
  const data = [
    // ...
  ];

  //❌ columnsとdataが`useReactTable`と同じスコープで定義されており、安定した参照がないため、無限ループが発生します！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 解決策1: useMemoまたはuseStateで安定した参照を提供する

Reactでは、変数に「安定した」参照を提供するために、コンポーネントの外側/上部で定義するか、`useMemo`や`useState`を使用するか、サードパーティの状態管理ライブラリ（ReduxやReact Queryなど😉）を使用します。

```js
//✅ 良い例: コンポーネントの外側でcolumnsを定義
const columns = [
  // ...
];

//✅ 良い例: コンポーネントの外側でdataを定義
const data = [
  // ...
];

// 通常、columnsとdataはコンポーネント内で定義する方が実用的なので、`useMemo`や`useState`を使用して安定した参照を提供します
export default function MyComponent() {
  //✅ 良い例: `columns`が安定した参照を持つため、無限レンダリングループが発生しません
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良い例: `data`が安定した参照を持つため、無限レンダリングループが発生しません
  const [data, setData] = useState(() => [
    // ...
  ]);

  // columnsとdataが安定した参照を持つため、無限ループが発生しません！
  const table = useReactTable({
    columns,
    data,
  });

  return <table>...</table>;
}
```

### 落とし穴2: columnsやdataを直接変更する

初期の`columns`や`data`に安定した参照を提供していても、それらを直接変更すると無限ループに陥る可能性があります。これは最初は気づきにくい落とし穴です。単純なインラインの`data.filter()`でさえ、注意しないと無限ループを引き起こす可能性があります。

```js
export default function MyComponent() {
  //✅ 良い例
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良い例 (React Queryは自動的にdataに安定した参照を提供します)
  const { data, isLoading } = useQuery({
    //...
  });

  const table = useReactTable({
    columns,
    //❌ 悪い例: `data`が直接変更されるため（安定した参照が破壊される）、無限レンダリングループが発生します
    data: data?.filter(d => d.isActive) ?? [],
  });

  return <table>...</table>;
}
```

### 解決策2: データ変換をメモ化する

無限ループを防ぐためには、データ変換を常にメモ化する必要があります。これは`useMemo`などで行うことができます。

```js
export default function MyComponent() {
  //✅ 良い例
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良い例
  const { data, isLoading } = useQuery({
    //...
  });

  //✅ 良い例: `filteredData`がメモ化されているため、無限レンダリングループが発生しません
  const filteredData = useMemo(() => data?.filter(d => d.isActive) ?? [], [data]);

  const table = useReactTable({
    columns,
    data: filteredData, // 安定した参照！
  });

  return <table>...</table>;
}
```

### React Forget

React Forgetがリリースされれば、これらの問題は過去のものになるかもしれません。またはSolid.jsを使うのも手です... 🤓

## データ変更時にテーブルの状態が自動リセットされるのを防ぐ方法

ほとんどのプラグインは、データソースが変更されたときに通常リセットされるべき状態を使用しますが、外部でデータをフィルタリングしている場合や、データを不変的に編集しながら表示している場合、または単にデータに対して自動的にテーブルの状態をリセットさせたくない操作を行っている場合には、これを抑制する必要があるかもしれません。

そのような状況では、各プラグインはデータや他の依存関係が変更されたときに内部で状態が自動リセットされるのを無効にする方法を提供しています。いずれかを`false`に設定することで、自動リセットがトリガーされるのを防ぐことができます。

以下は、テーブルの`data`ソースを編集している間に、通常発生するすべての状態変更を基本的に停止するReactベースの例です:

```js
const [data, setData] = React.useState([])
const skipPageResetRef = React.useRef()

const updateData = newData => {
  // この関数でデータが更新されるとき、すべての自動リセットを無効にするフラグを設定します
  skipPageResetRef.current = true

  setData(newData)
}

React.useEffect(() => {
  // テーブルが更新された後、常にフラグを削除します
  skipPageResetRef.current = false
})

useReactTable({
  ...
  autoResetPageIndex: !skipPageResetRef.current,
  autoResetExpanded: !skipPageResetRef.current,
})
```

これで、データを更新しても上記のテーブル状態は自動的にリセットされません！
