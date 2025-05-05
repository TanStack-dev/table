---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:46.830Z'
title: カラム表示/非表示
---
## 例

実装に直接進みたいですか？以下の例を確認してください:

- [column-visibility](../framework/react/examples/column-visibility)
- [column-ordering](../framework/react/examples/column-ordering)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

### その他の例

- [SolidJS column-visibility](../framework/solid/examples/column-visibility)
- [Svelte column-visibility](../framework/svelte/examples/column-visibility)

## API

[Column Visibility API](../api/features/column-visibility)

## カラム可視性ガイド

カラム可視性機能を使用すると、テーブルのカラムを動的に表示/非表示にできます。以前のバージョンのreact-tableでは、この機能はカラムの静的プロパティでしたが、v8では専用の`columnVisibility`ステートとAPIが用意され、カラムの可視性を動的に管理できるようになりました。

### カラム可視性ステート

`columnVisibility`ステートは、カラムIDとブール値のマップです。カラムIDがマップ内に存在し、値が`false`の場合、そのカラムは非表示になります。カラムIDがマップ内に存在しないか、値が`true`の場合、カラムは表示されます。

```jsx
const [columnVisibility, setColumnVisibility] = useState({
  columnId1: true,
  columnId2: false, //このカラムはデフォルトで非表示
  columnId3: true,
});

const table = useReactTable({
  //...
  state: {
    columnVisibility,
    //...
  },
  onColumnVisibilityChange: setColumnVisibility,
});
```

または、テーブルの外部でカラム可視性ステートを管理する必要がない場合は、`initialState`オプションを使用して初期のデフォルトカラム可視性ステートを設定することもできます。

> **注**: `columnVisibility`が`initialState`と`state`の両方に提供される場合、`state`の初期化が優先され、`initialState`は無視されます。`columnVisibility`を`initialState`と`state`の両方に提供しないでください。どちらか一方のみに提供してください。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnVisibility: {
      columnId1: true,
      columnId2: false, //このカラムはデフォルトで非表示
      columnId3: true,
    },
    //...
  },
});
```

### カラムの非表示を無効化

デフォルトでは、すべてのカラムを非表示または表示できます。特定のカラムを非表示にできないようにするには、それらのカラムに対して`enableHiding`カラムオプションを`false`に設定します。

```jsx
const columns = [
  {
    header: 'ID',
    accessorKey: 'id',
    enableHiding: false, // このカラムの非表示を無効化
  },
  {
    header: '名前',
    accessor: 'name', // 非表示に可能
  },
];
```

### カラム可視性トグルAPI

UIでカラム可視性トグルをレンダリングする際に便利なカラムAPIメソッドがいくつかあります。

- `column.getCanHide` - `enableHiding`が`false`に設定されているカラムの可視性トグルを無効にするのに便利です。
- `column.getIsVisible` - 可視性トグルの初期状態を設定するのに便利です。
- `column.toggleVisibility` - カラムの可視性をトグルするのに便利です。
- `column.getToggleVisibilityHandler` - `column.toggleVisibility`メソッドをUIイベントハンドラに接続するショートカットです。

```jsx
{table.getAllColumns().map((column) => (
  <label key={column.id}>
    <input
      checked={column.getIsVisible()}
      disabled={!column.getCanHide()}
      onChange={column.getToggleVisibilityHandler()}
      type="checkbox"
    />
    {column.columnDef.header}
  </label>
))}
```

### カラム可視性を考慮したテーブルAPI

ヘッダー、ボディ、フッターセルをレンダリングする際、多くのAPIオプションが利用可能です。`table.getAllLeafColumns`や`row.getAllCells`のようなAPIを見かけることがありますが、これらのAPIを使用すると、カラム可視性が考慮されません。代わりに、`table.getVisibleLeafColumns`や`row.getVisibleCells`などの「可視」バリアントのAPIを使用する必要があります。

```jsx
<table>
  <thead>
    <tr>
      {table.getVisibleLeafColumns().map((column) => ( // カラム可視性を考慮
        //
      ))}
    </tr>
  </thead>
  <tbody>
    {table.getRowModel().rows.map((row) => (
      <tr key={row.id}>
        {row.getVisibleCells().map((cell) => ( // カラム可視性を考慮
          //
        ))}
      </tr>
    ))}
  </tbody>
</table>
```

ヘッダーグループAPIを使用している場合、これらはすでにカラム可視性を考慮しています。
