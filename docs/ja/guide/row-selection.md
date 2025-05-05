---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:28:03.173Z'
title: 行選択
---
## 実装例

実装に直接進みたいですか？以下の例を確認してください:

- [React 行選択](../framework/react/examples/row-selection)
- [Vue 行選択](../framework/vue/examples/row-selection)
- [React 展開](../framework/react/examples/expanding)

## API

[行選択 API](../api/features/row-selection)

## 行選択ガイド

行選択機能は、どの行が選択されているかを追跡し、さまざまな方法で行の選択を切り替えることができます。一般的な使用例を見ていきましょう。

### 行選択状態へのアクセス

テーブルインスタンスはすでに行選択状態を管理しています（ただし、以下で見るように、行選択状態を独自のスコープで管理した方が便利な場合があります）。いくつかのAPIから内部の行選択状態または選択された行にアクセスできます。

- `getState().rowSelection` - 内部の行選択状態を返す
- `getSelectedRowModel()` - 選択された行を返す
- `getFilteredSelectedRowModel()` - フィルタリング後の選択行を返す
- `getGroupedSelectedRowModel()` - グループ化とソート後の選択行を返す

```ts
console.log(table.getState().rowSelection) //行選択状態を取得 - { 1: true, 2: false, etc... }
console.log(table.getSelectedRowModel().rows) //クライアント側の選択行全体を取得
console.log(table.getFilteredSelectedRowModel().rows) //フィルタリングされたクライアント側の選択行を取得
console.log(table.getGroupedSelectedRowModel().rows) //グループ化されたクライアント側の選択行を取得
```

> 注意: `manualPagination`を使用している場合、`getSelectedRowModel` APIは現在のページの選択行のみを返します。テーブルの行モデルは渡された`data`に基づいてのみ行を生成できるためです。ただし、行選択状態は`data`配列に存在しない行IDを含むことができます。

### 行選択状態の管理

テーブルインスタンスが行選択状態を管理しますが、API呼び出しやその他のアクションに使用できる選択行IDに簡単にアクセスするために、通常は独自のスコープで状態を管理する方が便利です。

`onRowSelectionChange`テーブルオプションを使用して、行選択状態を独自のスコープに引き上げます。次に、`state`テーブルオプションを使用して行選択状態をテーブルインスタンスに戻します。

```ts
const [rowSelection, setRowSelection] = useState<RowSelectionState>({}) //独自の行選択状態を管理

const table = useReactTable({
  //...
  onRowSelectionChange: setRowSelection, //行選択状態を独自のスコープに引き上げる
  state: {
    rowSelection, //行選択状態をテーブルインスタンスに戻す
  },
})
```

### 有用な行ID

デフォルトでは、各行の行IDは単に`row.index`です。行選択機能を使用している場合、行選択状態が行IDでキー付けされるため、より有用な行識別子を使用する必要があります。`getRowId`テーブルオプションを使用して、各行の一意の行IDを返す関数を指定できます。

```ts
const table = useReactTable({
  //...
  getRowId: row => row.uuid, //データベースの行のuuidを行IDとして使用
})
```

これで、行が選択されると、行選択状態は次のようになります:

```json
{
  "13e79140-62a8-4f9c-b087-5da737903b76": true,
  "f3e2a5c0-5b7a-4d8a-9a5c-9c9b8a8e5f7e": false
  //...
}
```

この代わりに:

```json
{
  "0": true,
  "1": false
  //...
}
```

### 条件付きで行選択を有効化

行選択はデフォルトですべての行に対して有効になっています。特定の行に対して条件付きで行選択を有効にするか、すべての行に対して行選択を無効にするには、`enableRowSelection`テーブルオプションを使用します。このオプションは、ブール値またはより詳細な制御のための関数を受け入れます。

```ts
const table = useReactTable({
  //...
  enableRowSelection: row => row.original.age > 18, //成人のみ行選択を有効化
})
```

UIで行が選択可能かどうかを強制するには、チェックボックスまたは他の選択UIに`row.getCanSelect()` APIを使用できます。

### 単一行選択

デフォルトでは、テーブルは複数の行を同時に選択できます。ただし、一度に1つの行のみを選択できるようにしたい場合は、`enableMultiRowSelection`テーブルオプションを`false`に設定して複数行選択を無効にするか、行のサブ行に対して条件付きで複数行選択を無効にする関数を渡します。

これは、チェックボックスの代わりにラジオボタンを持つテーブルを作成する場合に便利です。

```ts
const table = useReactTable({
  //...
  enableMultiRowSelection: false, //一度に1つの行のみ選択可能
  // enableMultiRowSelection: row => row.original.age > 18, //成人に対してのみ1つの行を選択可能
})
```

### サブ行選択

デフォルトでは、親行を選択するとそのすべてのサブ行が選択されます。自動サブ行選択を無効にしたい場合は、`enableSubRowSelection`テーブルオプションを`false`に設定してサブ行選択を無効にするか、行のサブ行に対して条件付きでサブ行選択を無効にする関数を渡します。

```ts
const table = useReactTable({
  //...
  enableSubRowSelection: false, //サブ行選択を無効化
  // enableSubRowSelection: row => row.original.age > 18, //成人に対してサブ行選択を無効化
})
```

### 行選択UIのレンダリング

TanStackテーブルは、行選択UIをどのようにレンダリングするかを規定しません。チェックボックス、ラジオボタンを使用するか、単に行自体にクリックイベントをフックできます。テーブルインスタンスは、行選択UIをレンダリングするのに役立ついくつかのAPIを提供します。

#### チェックボックス入力に行選択APIを接続

TanStackテーブルは、行選択を切り替えるためにチェックボックス入力に直接接続できるいくつかのハンドラ関数を提供します。これらの関数は、行選択状態を更新し、テーブルを再レンダリングするために他の内部APIを自動的に呼び出します。

`row.getToggleSelectedHandler()` APIを使用して、行の選択を切り替えるためにチェックボックス入力に接続します。

`table.getToggleAllRowsSelectedHandler()`または`table.getToggleAllPageRowsSelectedHandler` APIを使用して、「すべて選択」チェックボックス入力に接続し、すべての行の選択を切り替えます。

これらの関数ハンドラをより詳細に制御する必要がある場合は、常に`row.toggleSelected()`または`table.toggleAllRowsSelected()` APIを直接使用できます。または、他の状態更新プログラムと同様に、`table.setRowSelection()` APIを直接呼び出して行選択状態を設定することもできます。これらのハンドラ関数は単なる便利機能です。

```tsx
const columns = [
  {
    id: 'select-col',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()} //またはgetToggleAllPageRowsSelectedHandler
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  //... その他の列定義...
]
```

#### UIに行選択APIを接続

よりシンプルな行選択UIが必要な場合は、行自体にクリックイベントをフックするだけです。`row.getToggleSelectedHandler()` APIはこの使用例にも役立ちます。

```tsx
<tbody>
  {table.getRowModel().rows.map(row => {
    return (
      <tr
        key={row.id}
        className={row.getIsSelected() ? 'selected' : null}
        onClick={row.getToggleSelectedHandler()}
      >
        {row.getVisibleCells().map(cell => {
          return <td key={cell.id}>{/* */}</td>
        })}
      </tr>
    )
  })}
</tbody>
```
