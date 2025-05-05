---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:24:53.275Z'
title: テーブルインスタンス
---
## API

[Table API](../api/core/table)

## テーブルインスタンスガイド

TanStack TableはヘッドレスUIライブラリです。`table` または「テーブルインスタンス」について話す場合、実際の`<table>`要素を指しているのではありません。代わりに、テーブルの状態とAPIを含むコアテーブルオブジェクトを指しています。`table`インスタンスは、アダプターの`createTable`関数（例：`useReactTable`、`useVueTable`、`createSolidTable`、`createSvelteTable`、`createAngularTable`、`useQwikTable`）を呼び出すことで作成されます。

フレームワークアダプターから返される`table`インスタンスは、テーブルの状態を読み取り、変更するためにやり取りする主要なオブジェクトです。TanStack Tableではすべてがこの`table`インスタンスを中心に行われます。UIをレンダリングする段階では、この`table`インスタンスのAPIを使用します。

### テーブルインスタンスの作成

テーブルインスタンスを作成するには、3つの`options`が必要です：`columns`、`data`、および`getCoreRowModel`の実装です。他にも多くのテーブルオプションがありますが、これら3つは必須です。

#### データの定義

データは安定した参照を持つオブジェクトの配列として定義します。`data`はAPIレスポンスやコード内で静的に定義されたものなど、どこからでも取得できますが、無限再レンダリングを防ぐために安定した参照を持つ必要があります。TypeScriptを使用する場合、データに与える型は`TData`ジェネリックとして使用されます。詳細は[データガイド](../guide/data)を参照してください。

#### カラムの定義

カラム定義については、前のセクションの[カラム定義ガイド](../guide/column-defs)で詳しく説明しています。ただし、カラムの型を定義する際には、データに使用したのと同じ`TData`型を使用する必要があることに注意してください。

```ts
const columns: ColumnDef<User>[] = [] //User型をジェネリックTData型として渡す
//または
const columnHelper = createColumnHelper<User>() //User型をジェネリックTData型として渡す
```

カラム定義では、`accessorKey`または`accessorFn`を使用して、各カラムが行データにどのようにアクセスまたは変換するかをTanStack Tableに指示します。詳細は[カラム定義ガイド](../guide/column-defs#creating-accessor-columns)を参照してください。

#### 行モデルの指定

これについては[行モデルガイド](../guide/row-models)で詳しく説明されていますが、ここではTanStack Tableから`getCoreRowModel`関数をインポートし、テーブルオプションとして渡すだけです。使用予定の機能によっては、後で追加の行モデルを渡す必要がある場合があります。

```ts
import { getCoreRowModel } from '@tanstack/[framework]-table'

const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

#### テーブルインスタンスの初期化

`columns`、`data`、`getCoreRowModel`を定義したら、他のテーブルオプションと共に基本的なテーブルインスタンスを作成できます。

```ts
//vanilla js
const table = createTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//angular
this.table = createAngularTable({ columns: this.columns, data: this.data(), getCoreRowModel: getCoreRowModel() })

//lit
const table = this.tableController.table({ columns, data, getCoreRowModel: getCoreRowModel() })

//qwik
const table = useQwikTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//react
const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//solid
const table = createSolidTable({ columns, get data() { return data() }, getCoreRowModel: getCoreRowModel() })

//svelte
const table = createSvelteTable({ columns, data, getCoreRowModel: getCoreRowModel() })

//vue
const table = useVueTable({ columns, data, getCoreRowModel: getCoreRowModel() })
```

では、`table`インスタンスには何が含まれているのでしょうか？テーブルインスタンスとのインタラクションを見てみましょう。

### テーブルの状態

テーブルインスタンスにはすべてのテーブルの状態が含まれており、`table.getState()` APIを通じてアクセスできます。各テーブル機能は、テーブルの状態にさまざまな状態を登録します。例えば、行選択機能は`rowSelection`状態を、ページネーション機能は`pagination`状態を登録します。

各機能には、テーブルインスタンス上に対応する状態設定APIと状態リセットAPIもあります。例えば、行選択機能には`setRowSelection` APIと`resetRowSelection`があります。

```ts
table.getState().rowSelection //行選択状態を読み取る
table.setRowSelection((old) => ({...old})) //行選択状態を設定する
table.resetRowSelection() //行選択状態をリセットする
```

詳細は[テーブル状態ガイド](../framework/react/guide/table-state)で説明されています。

### テーブルAPI

各機能によって作成された数十のテーブルAPIがあり、さまざまな方法でテーブルの状態を読み取ったり変更したりするのに役立ちます。

コアテーブルインスタンスおよび他のすべての機能APIのAPIリファレンスドキュメントは、APIドキュメント全体に記載されています。

例えば、コアテーブルインスタンスのAPIドキュメントはこちらで確認できます：[Table API](../api/core/table#table-api)

### テーブル行モデル

テーブルインスタンスから行を読み取るための特別なAPIセットがあり、行モデルと呼ばれます。TanStack Tableには、生成される行が最初に渡した`data`の配列と大きく異なる場合がある高度な機能があります。テーブルオプションとして渡せるさまざまな行モデルの詳細については、[行モデルガイド](../guide/row-models)を参照してください。
