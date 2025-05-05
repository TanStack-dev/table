---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:55.773Z'
title: 展開
---
## サンプル

実装の詳細を確認したいですか？以下のサンプルを参照してください：

- [展開 (expanding)](../framework/react/examples/expanding)
- [グループ化 (grouping)](../framework/react/examples/grouping)
- [サブコンポーネント (sub-components)](../framework/react/examples/sub-components)

## API

[展開 API (Expanding API)](../api/features/expanding)

## 展開機能ガイド

展開機能は、特定の行に関連する追加のデータ行を表示または非表示にする機能です。階層構造を持つデータがあり、ユーザーが上位レベルからデータを掘り下げられるようにしたい場合や、行に関連する追加情報を表示したい場合に便利です。

### 展開機能のさまざまなユースケース

TanStack Tableにおける展開機能には、以下のような複数のユースケースがあります。

1. サブ行の展開（子行、集計行など）
2. カスタムUIの展開（詳細パネル、サブテーブルなど）

### クライアントサイド展開の有効化

クライアントサイドの展開機能を使用するには、テーブルオプションで`getExpandedRowModel`関数を定義する必要があります。この関数は、展開された行モデルを返す役割を担います。

```ts
const table = useReactTable({
  // 他のオプション...
  getExpandedRowModel: getExpandedRowModel(),
})
```

展開データには、テーブル行または表示したい任意のデータを含めることができます。このガイドでは、両方のケースの扱い方について説明します。

### 展開データとしてのテーブル行

展開行は基本的に親行と同じ列構造を継承する子行です。データオブジェクトに既にこれらの展開行データが含まれている場合、`getSubRows`関数を使用してこれらの子行を指定できます。データオブジェクトに展開行データが含まれていない場合、それらはカスタム展開データとして扱うことができます（次のセクションで説明します）。

例えば、以下のようなデータオブジェクトがある場合：

```ts
type Person = {
  id: number
  name: string
  age: number
  children?: Person[] | undefined
}

const data: Person[] =  [
  { id: 1, 
  name: 'John', 
  age: 30, 
  children: [
      { id: 2, name: 'Jane', age: 5 },
      { id: 5, name: 'Jim', age: 10 }
    ] 
  },
  { id: 3,
   name: 'Doe', 
   age: 40, 
    children: [
      { id: 4, name: 'Alice', age: 10 }
    ] 
  },
]
```

`getSubRows`関数を使用して、各行の`children`配列を展開行として返すことができます。これにより、テーブルインスタンスは各行のサブ行をどこで探すべきかを理解します。

```ts
const table = useReactTable({
  // 他のオプション...
  getSubRows: (row) => row.children, // children配列をサブ行として返す
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
```

> **注意:** 複雑な`getSubRows`関数を定義することもできますが、この関数はすべての行とサブ行に対して実行されるため、最適化されていないとパフォーマンスに影響を与える可能性があります。非同期関数はサポートされていません。

### カスタム展開UI

場合によっては、テーブルデータオブジェクトの一部であるかどうかにかかわらず、行の展開データなど、追加の詳細や情報を表示したいことがあります。この種の展開行UIは、「展開可能な行 (expandable rows)」、「詳細パネル (detail panels)」、「サブコンポーネント (sub-components)」など、さまざまな名前で呼ばれてきました。

デフォルトでは、`row.getCanExpand()`行インスタンスAPIは、行に`subRows`が見つからない限りfalseを返します。これは、テーブルインスタンスオプションで独自の`getRowCanExpand`関数を実装することで上書きできます。

```ts
//...
const table = useReactTable({
  // 他のオプション...
  getRowCanExpand: (row) => true, // 行が展開可能かどうかを決定するロジックを追加。trueはすべての行に展開データが含まれることを意味します
  getCoreRowModel: getCoreRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
})
//...
<tbody>
  {table.getRowModel().rows.map((row) => (
    <React.Fragment key={row.id}>
     {/* 通常の行UI */}
      <tr>
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id}>
            <FlexRender
              render={cell.column.columnDef.cell}
              props={cell.getContext()}
            />
          </td>
        ))}
      </tr>
      {/* 行が展開されている場合、展開UIを単一のセルを持つ別の行としてレンダリングし、テーブルの幅全体に広げます */}
      {row.getIsExpanded() && (
        <tr>
          <td colSpan={row.getAllCells().length}> // 親行と同じ列を共有しない展開データの場合にスパンする列の数
            // カスタムUIをここに配置
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>
//...
```

### 展開行の状態

テーブル内の行の展開状態を制御する必要がある場合は、`expanded`状態と`onExpandedChange`オプションを使用して行うことができます。これにより、要件に応じて展開状態を管理できます。

```ts
const [expanded, setExpanded] = useState<ExpandedState>({})

const table = useReactTable({
  // 他のオプション...
  state: {
    expanded: expanded, // 展開状態をテーブルに戻す必要があります
  },
  onExpandedChange: setExpanded
})
```

`ExpandedState`型は以下のように定義されています：

```ts
type ExpandedState = true | Record<string, boolean>
```

`ExpandedState`が`true`の場合、すべての行が展開されていることを意味します。レコードの場合、レコード内のキーとして存在し、値が`true`に設定されているIDを持つ行のみが展開されます。例えば、展開状態が`{ row1: true, row2: false }`の場合、IDが`row1`の行は展開され、IDが`row2`の行は展開されません。この状態は、テーブルがどの行が展開されているか、およびサブ行（存在する場合）を表示する必要があるかを判断するために使用されます。

### 展開行のUIトグルハンドラ

TanStack Tableは、展開データのトグルハンドラUIをテーブルに自動的に追加しません。ユーザーが行を展開および折りたためることができるように、各行のUI内に手動で追加する必要があります。例えば、列定義内にボタンUIを追加できます。

```ts
const columns = [
  {
    accessorKey: 'name',
    header: '名前',
  },
  {
    accessorKey: 'age',
    header: '年齢',
  },
  {
    header: '子要素',
    cell: ({ row }) => {
      return row.getCanExpand() ?
        <button
          onClick={row.getToggleExpandedHandler()}
          style={{ cursor: 'pointer' }}
        >
        {row.getIsExpanded() ? '👇' : '👉'}
        </button>
       : '';
    },
  },
]
```

### 展開行のフィルタリング

デフォルトでは、フィルタリング処理は親行から開始され、下方向に進みます。つまり、親行がフィルタによって除外されると、そのすべての子行も除外されます。ただし、`filterFromLeafRows`オプションを使用してこの動作を変更できます。このオプションを有効にすると、フィルタリング処理はリーフ（子）行から開始され、上方向に進みます。これにより、子または孫行の少なくとも1つがフィルタ条件を満たしている限り、親行がフィルタ結果に含まれるようになります。さらに、`maxLeafRowFilterDepth`オプションを使用して、フィルタ処理が考慮する子階層の深さを制御できます。このオプションでは、フィルタが考慮する子行の最大深度を指定できます。

```ts
//...
const table = useReactTable({
  // 他のオプション...
  getSubRows: row => row.subRows,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  filterFromLeafRows: true, // 展開行を検索
  maxLeafRowFilterDepth: 1, // 検索される展開行の深度を制限
})
```

### 展開行のページネーション

デフォルトでは、展開行はテーブルの他の部分と一緒にページネーションされます（つまり、展開行は複数のページにまたがる可能性があります）。この動作を無効にしたい場合（つまり、展開行は常に親のページにレンダリングされます。これにより、設定されたページサイズよりも多くの行がレンダリングされることも意味します）、`paginateExpandedRows`オプションを使用できます。

```ts
const table = useReactTable({
  // 他のオプション...
  paginateExpandedRows: false,
})
```

### 展開行のピン留め

展開行のピン留めは、通常の行のピン留めと同じように機能します。展開行をテーブルの上部または下部にピン留めできます。行のピン留めに関する詳細は、[ピン留めガイド (Pinning Guide)](./pinning.md)を参照してください。

### 展開行のソート

デフォルトでは、展開行はテーブルの他の部分と一緒にソートされます。

### 手動展開（サーバーサイド）

サーバーサイドの展開を行う場合、`manualExpanding`オプションを`true`に設定することで手動行展開を有効にできます。これは、`getExpandedRowModel`が行の展開に使用されず、独自のデータモデルで展開を実行することが期待されることを意味します。

```ts
const table = useReactTable({
  // 他のオプション...
  manualExpanding: true,
})
```
