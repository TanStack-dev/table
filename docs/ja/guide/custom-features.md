---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:29:28.276Z'
title: カスタム機能
---
```markdown
## サンプル

実装に直接進みたいですか？以下のサンプルをチェックしてください：

- [custom-features](../framework/react/examples/custom-features)

## カスタム機能ガイド

このガイドでは、TanStack Tableをカスタム機能で拡張する方法を説明します。その過程で、TanStack Table v8のコードベースの構造や動作についても詳しく学びます。

### TanStack Tableは軽量であることを目指す

TanStack Tableには、ソート、フィルタリング、ページネーションなど、ライブラリに組み込まれたコア機能セットがあります。多くのリクエストや、時にはよく考えられたPRが、さらに多くの機能をライブラリに追加するために寄せられます。ライブラリの改善には常にオープンですが、TanStack Tableがほとんどのユースケースで使用されないような肥大化やコードを含まない、軽量なライブラリであり続けることも重要です。すべてのPRがコアライブラリに受け入れられるわけではなく、また受け入れるべきでもありません。たとえそれが実際の問題を解決するものであってもです。これは、TanStack Tableがユースケースの90%を解決するが、もう少し制御が必要な開発者にとってはフラストレーションの原因になるかもしれません。

TanStack Tableは、少なくともv7以降、高度に拡張可能な方法で構築されています。使用しているフレームワークアダプター（`useReactTable`、`useVueTable`など）から返される`table`インスタンスは、追加のプロパティやAPIを追加できるプレーンなJavaScriptオブジェクトです。コンポジションを使用して、テーブルインスタンスにカスタムロジック、状態、APIを追加することは常に可能でした。[Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/hooks/useMRT_TableInstance.ts)のようなライブラリは、単に`useReactTable`フックの周りにカスタムラッパーフックを作成し、テーブルインスタンスをカスタム機能で拡張しています。

しかし、バージョン8.14.0から、TanStack Tableは新しい`_features`テーブルオプションを公開し、組み込みのテーブル機能とまったく同じ方法でカスタムコードをテーブルインスタンスに統合できるようにしました。

> TanStack Table v8.14.0では、テーブルインスタンスにカスタム機能を追加できる新しい`_features`オプションが導入されました。

この新しい統合により、より複雑なカスタム機能をテーブルに簡単に追加でき、コミュニティと共有することも可能になります。今後の展開を見守りましょう。将来的なv9リリースでは、すべての機能をオプトインにすることでTanStack Tableのバンドルサイズをさらに削減するかもしれませんが、これはまだ検討中です。

### TanStack Tableの機能の動作

TanStack Tableのソースコードは、ある意味シンプルです（少なくとも私たちはそう考えています）。各機能のコードは、初期状態、デフォルトのテーブルおよびカラムオプション、`table`、`header`、`column`、`row`、`cell`インスタンスに追加できるAPIメソッドを持つ独自のオブジェクト/ファイルに分割されています。

機能オブジェクトのすべての機能は、TanStack Tableからエクスポートされる`TableFeature`型で記述できます。この型は、機能を作成するために必要な機能オブジェクトの形状を記述するTypeScriptインターフェースです。

```ts
export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ) => void
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  createRow?: (row: Row<TData>, table: Table<TData>) => void
  createTable?: (table: Table<TData>) => void
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  getDefaultOptions?: (
    table: Table<TData>
  ) => Partial<TableOptionsResolved<TData>>
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>
}
```

少し混乱するかもしれませんので、これらのメソッドのそれぞれが何をするのかを分解してみましょう：

#### デフォルトオプションと初期状態

<br />

##### getDefaultOptions

テーブル機能の`getDefaultOptions`メソッドは、その機能のデフォルトテーブルオプションを設定する責任があります。例えば、[Column Sizing](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts)機能では、`getDefaultOptions`メソッドがデフォルトの`columnResizeMode`オプションを`"onEnd"`というデフォルト値で設定します。

<br />

##### getDefaultColumnDef

テーブル機能の`getDefaultColumnDef`メソッドは、その機能のデフォルトカラムオプションを設定する責任があります。例えば、[Sorting](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts)機能では、`getDefaultColumnDef`メソッドがデフォルトの`sortUndefined`カラムオプションを`1`というデフォルト値で設定します。

<br />

##### getInitialState

テーブル機能の`getInitialState`メソッドは、その機能のデフォルト状態を設定する責任があります。例えば、[Pagination](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowPagination.ts)機能では、`getInitialState`メソッドがデフォルトの`pageSize`状態を`10`、`pageIndex`状態を`0`に設定します。

#### APIクリエーター

<br />

##### createTable

テーブル機能の`createTable`メソッドは、`table`インスタンスにメソッドを追加する責任があります。例えば、[Row Selection](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts)機能では、`createTable`メソッドが`toggleAllRowsSelected`、`getIsAllRowsSelected`、`getIsSomeRowsSelected`などの多くのテーブルインスタンスAPIメソッドを追加します。したがって、`table.toggleAllRowsSelected()`を呼び出すとき、`RowSelection`機能によってテーブルインスタンスに追加されたメソッドを呼び出しています。

<br />

##### createHeader

テーブル機能の`createHeader`メソッドは、`header`インスタンスにメソッドを追加する責任があります。例えば、[Column Sizing](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts)機能では、`createHeader`メソッドが`getStart`などの多くのヘッダーインスタンスAPIメソッドを追加します。したがって、`header.getStart()`を呼び出すとき、`ColumnSizing`機能によってヘッダーインスタンスに追加されたメソッドを呼び出しています。

<br />

##### createColumn

テーブル機能の`createColumn`メソッドは、`column`インスタンスにメソッドを追加する責任があります。例えば、[Sorting](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts)機能では、`createColumn`メソッドが`getNextSortingOrder`、`toggleSorting`などの多くのカラムインスタンスAPIメソッドを追加します。したがって、`column.toggleSorting()`を呼び出すとき、`RowSorting`機能によってカラムインスタンスに追加されたメソッドを呼び出しています。

<br />

##### createRow

テーブル機能の`createRow`メソッドは、`row`インスタンスにメソッドを追加する責任があります。例えば、[Row Selection](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts)機能では、`createRow`メソッドが`toggleSelected`、`getIsSelected`などの多くの行インスタンスAPIメソッドを追加します。したがって、`row.toggleSelected()`を呼び出すとき、`RowSelection`機能によって行インスタンスに追加されたメソッドを呼び出しています。

<br />

##### createCell

テーブル機能の`createCell`メソッドは、`cell`インスタンスにメソッドを追加する責任があります。例えば、[Column Grouping](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnGrouping.ts)機能では、`createCell`メソッドが`getIsGrouped`、`getIsAggregated`などの多くのセルインスタンスAPIメソッドを追加します。したがって、`cell.getIsGrouped()`を呼び出すとき、`ColumnGrouping`機能によってセルインスタンスに追加されたメソッドを呼び出しています。

### カスタム機能の追加

仮想的なユースケースのためにカスタムテーブル機能を作成する手順を見ていきましょう。ユーザーがテーブルの「密度」（セルのパディング）を変更できる機能をテーブルインスタンスに追加したいとします。

完全な実装については、[custom-features](../framework/react/examples/custom-features)サンプルを確認してください。ここでは、カスタム機能を作成する手順を詳しく見ていきます。

#### ステップ1：TypeScriptの型を設定

TanStack Tableの組み込み機能と同じ完全な型安全性が必要な場合、新しい機能のためのTypeScriptの型をすべて設定しましょう。新しいテーブルオプション、状態、テーブルインスタンスAPIメソッドの型を作成します。

これらの型はTanStack Table内部で使用されている命名規則に従っていますが、好きな名前を付けることができます。これらの型をTanStack Tableにまだ追加していませんが、次のステップで行います。

```ts
// 新しい機能のカスタム状態の型を定義
export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
  density: DensityState
}

// 新しい機能のテーブルオプションの型を定義
export interface DensityOptions {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// 新しい機能のテーブルAPIの型を定義
export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}
```

#### ステップ2：宣言マージを使用して新しい型をTanStack Tableに追加

TypeScriptに、TanStack Tableからエクスポートされる型を変更して、新しい機能の型を含めるように指示できます。これは「宣言マージ」と呼ばれ、TypeScriptの強力な機能です。これにより、新しい機能のコードやアプリケーションコードで`as unknown as CustomTable`や`// @ts-ignore`のようなTypeScriptのハックを使用する必要がなくなります。

```ts
// 宣言マージを使用して、新しい機能のAPIと状態の型をTanStack Tableの既存の型に追加
declare module '@tanstack/react-table' { // または使用しているフレームワークアダプター
  // 新しい機能の状態を既存のテーブル状態にマージ
  interface TableState extends DensityTableState {}
  // 新しい機能のオプションを既存のテーブルオプションにマージ
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions {}
  // 新しい機能のインスタンスAPIを既存のテーブルインスタンスAPIにマージ
  interface Table<TData extends RowData> extends DensityInstance {}
  // セルインスタンスAPIを追加する必要がある場合...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // 行インスタンスAPIを追加する必要がある場合...
  // interface Row<TData extends RowData> extends DensityRow
  // カラムインスタンスAPIを追加する必要がある場合...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // ヘッダーインスタンスAPIを追加する必要がある場合...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // 注：`ColumnDef`に対する宣言マージは、複雑な型でありインターフェースではないため不可能です。
  // ただし、`ColumnDef.meta`に対しては宣言マージを使用できます。
}
```

これを正しく行えば、新しい機能のコードを作成し、アプリケーションで使用しようとするときにTypeScriptエラーが発生しなくなります。

##### 宣言マージの注意点

宣言マージの注意点の1つは、コードベース内のすべてのテーブルのTanStack Tableの型に影響を与えることです。アプリケーション内のすべてのテーブルに同じ機能セットをロードする予定であれば問題ありませんが、一部のテーブルが追加機能をロードし、一部がロードしない場合は問題になる可能性があります。あるいは、TanStack Tableの型を拡張して新しい機能を追加したカスタム型をたくさん作ることもできます。これは、[Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/types.ts)が、通常のTanStack Tableテーブルの型に影響を与えないようにするために行っている方法ですが、少し面倒で、特定の時点で多くの型キャストが必要になります。

#### ステップ3：機能オブジェクトを作成

すべてのTypeScriptの設定が完了したら、新しい機能の機能オブジェクトを作成できます。ここで、テーブルインスタンスに追加されるすべてのメソッドを定義します。

`TableFeature`型を使用して、機能オブジェクトを正しく作成していることを確認します。TypeScriptの型が正しく設定されていれば、新しい状態、オプション、インスタンスAPIで機能オブジェクトを作成するときにTypeScriptエラーが発生しません。

```ts
export const DensityFeature: TableFeature<any> = { // TableFeature型を使用！！
  // 新しい機能の初期状態を定義
  getInitialState: (state): DensityTableState => {
    return {
      density: 'md',
      ...state,
    }
  },

  // 新しい機能のデフォルトオプションを定義
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    } as DensityOptions
  },
  // デフォルトのカラム定義を追加する必要がある場合...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } // カラムDefに直接追加する代わりにmetaを使用して、回避が難しいTypeScriptの問題を避ける
  // },

  // 新しい機能のテーブルインスタンスメソッドを定義
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = updater => {
      const safeUpdater: Updater<DensityState> = old => {
        let newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = value => {
      table.setDensity(old => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // 3つのオプションを循環
      })
    }
  },

  // 行インスタンスAPIを追加する必要がある場合...
  // createRow: <TData extends RowData>(row, table): void => {},
  // セルインスタンスAPIを追加する必要がある場合...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // カラムインスタンスAPIを追加する必要がある場合...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // ヘッダーインスタンスAPIを追加する必要がある場合...
  // createHeader: <TData extends RowData>(header, table): void => {},
}
```

#### ステップ4：機能をテーブルに追加

機能オブジェクトができたので、テーブルインスタンスを作成するときに`_features`オプションに渡すことで、テーブルインスタンスに追加できます。

```ts
const table = useReactTable({
  _features: [DensityFeature], // 新しい機能を組み込み機能とマージして渡す
  columns,
  data,
  //..
})
```

#### ステップ5：アプリケーションで機能を使用

機能がテーブルインスタンスに追加されたので、アプリケーションで新しいインスタンスAPI、オプション、状態を使用できます。

```tsx
const table = useReactTable({
  _features: [DensityFeature], // テーブル作成時にインスタンス化するためにカスタム機能を渡す
  columns,
  data,
  //...
  state: {
    density, // 密度状態をテーブルに渡す、TSはまだ満足 :)
  },
  onDensityChange: setDensity, // 新しいonDensityChangeオプションを使用、TSはまだ満足 :)
})
//...
const { density } = table
