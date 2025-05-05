---
source-updated-at: '2024-12-30T21:50:15.000Z'
translation-updated-at: '2025-05-05T19:24:54.984Z'
title: V8への移行
---
## V8への移行ガイド

TanStack Table V8は、React Table v7をTypeScriptで一から書き直したメジャーリニューアル版です。マークアップやCSSの全体的な構造/構成は大きく変わりませんが、多くのAPIが改名または置き換えられています。

### 主な変更点

- TypeScriptによる完全な書き直し（基本パッケージに型定義を含む）
- プラグインシステムの廃止（代わりに制御の反転を採用）
- 大幅に拡張・改善されたAPI（ピン留めなどの新機能を含む）
- より優れた制御状態管理
- サーバーサイド操作 (server-side operations) のサポート強化
- 完全な（ただしオプションの）データパイプライン制御
- フレームワークに依存しないコア (agnostic core) とReact、Solid、Svelte、Vue用アダプター（将来的にさらに追加予定）
- 新しい開発者ツール (Dev Tools)

### 新しいバージョンのインストール

TanStack Tableの新バージョンは`@tanstack`スコープで公開されています。お好きなパッケージマネージャーを使って新しいパッケージをインストールしてください：

```bash
npm uninstall react-table @types/react-table
npm install @tanstack/react-table
```

```tsx
- import { useTable } from 'react-table' // [!code --]
+ import { useReactTable } from '@tanstack/react-table' // [!code ++]
```

型定義は基本パッケージに含まれるようになったため、`@types/react-table`パッケージは削除できます。

> 必要に応じて、古い`react-table`パッケージをインストールしたままにし、コードを段階的に移行することも可能です。別々のテーブルで両方のパッケージを同時に使用しても問題ありません。

### テーブルオプションの更新

- `useTable`を`useReactTable`に改名
- 古いフックとプラグインシステムは廃止され、各機能ごとにtree-shaking可能な行モデルインポートに置き換えられました。

```tsx
- import { useTable, usePagination, useSortBy } from 'react-table'; // [!code --]
+ import { // [!code ++]
+   useReactTable, // [!code ++]
+   getCoreRowModel, // [!code ++]
+   getPaginationRowModel, // [!code ++]
+   getSortedRowModel // [!code ++]
+ } from '@tanstack/react-table'; // [!code ++]

// ...

-   const tableInstance = useTable( // [!code --]
-     { columns,  data }, // [!code --]
-     useSortBy, // [!code --]
-     usePagination, //order of hooks used to matter // [!code --]
-     // etc. // [!code --]
-   ); // [!code --]
+   const tableInstance = useReactTable({ // [!code ++]
+     columns, // [!code ++]
+     data, // [!code ++]
+     getCoreRowModel: getCoreRowModel(), // [!code ++]
+     getPaginationRowModel: getPaginationRowModel(), // [!code ++]
+     getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore! // [!code ++]
+     // etc. // [!code ++]
+   }); // [!code ++]
```

- すべての`disable*`テーブルオプションは`enable*`テーブルオプションに改名されました（例：`disableSortBy`は`enableSorting`に、`disableGroupBy`は`enableGrouping`に変更など）
- ...

### カラム定義の更新

- accessorは`accessorKey`または`accessorFn`に改名されました（文字列か関数かによって使い分け）
- width、minWidth、maxWidthはsize、minSize、maxSizeに改名
- オプションで、より良いTypeScriptヒントを得るために、新しい`createColumnHelper`関数を各カラム定義で使用できます（従来通りカラム定義の配列を使用することも可能）
  - 第一引数はアクセサ関数またはアクセサ文字列
  - 第二引数はカラムオプションのオブジェクト

```tsx
const columns = [
-  { // [!code --]
-    accessor: 'firstName', // [!code --]
-    Header: 'First Name', // [!code --]
-  }, // [!code --]
-  { // [!code --]
-    accessor: row => row.lastName, // [!code --]
-    Header: () => <span>Last Name</span>, // [!code --]
-  }, // [!code --]

// TypeScriptで最適な開発体験（特に後で`cell.getValue()`を使用する場合）
+  columnHelper.accessor('firstName', { //accessorKey // [!code ++]
+    header: 'First Name', // [!code ++]
+  }), // [!code ++]
+  columnHelper.accessor(row => row.lastName, { //accessorFn // [!code ++]
+    header: () => <span>Last Name</span>, // [!code ++]
+  }), // [!code ++]

// または（従来のスタイルを希望する場合）
+ { // [!code ++]
+   accessorKey: 'firstName', // [!code ++]
+   header: 'First Name', // [!code ++]
+ }, // [!code ++]
+ { // [!code ++]
+   accessorFn: row => row.lastName, // [!code ++]
+   header: () => <span>Last Name</span>, // [!code ++]
+ }, // [!code ++]
]
```

> 注意：コンポーネント内でカラムを定義する場合、カラム定義に安定した識別性を持たせるようにしてください。パフォーマンス向上と不要な再レンダリングを防ぐために、カラム定義を`useMemo`または`useState`フックに保存します。

- カラムオプション名の変更
  - `Header`は`header`に改名
  - `Cell`は`cell`に改名（セルレンダリング関数も変更あり。下記参照）
  - `Footer`は`footer`に改名
  - すべての`disable*`カラムオプションは`enable*`カラムオプションに改名（例：`disableSortBy`は`enableSorting`に、`disableGroupBy`は`enableGrouping`に変更など）
  - `sortType`は`sortingFn`に改名
  - ...

- カスタムセルレンダラーの変更
  - `value`は`getValue`に改名（値は直接提供されるのではなく、`getValue`関数を通じて評価されるようになりました。この変更により、`getValue()`が呼び出された時点で値が評価されキャッシュされるため、パフォーマンスが向上します）
  - `cell: { isGrouped, isPlaceholder, isAggregated }`は`cell: { getIsGrouped, getIsPlaceholder, getIsAggregated }`に変更
  - `column`: ベースレベルのプロパティはRT固有のものになりました。定義時にオブジェクトに追加した値は、`columnDef`の1階層下に移動しました。
  - `table`: `useTable`フックに渡されたプロパティは`options`の下に表示されます。

### テーブルマークアップの移行

- `cell.render('Cell')`や`column.render('Header')`などの代わりに`flexRender()`を使用
- `getHeaderProps`、`getFooterProps`、`getCellProps`、`getRowProps`などはすべて非推奨 (deprecated) になりました
  - TanStack Tableはデフォルトの`style`や`role`などのアクセシビリティ属性を提供しなくなりました。これらは依然として重要ですが、フレームワークに依存しないようにするために削除されました。
  - `onClick`ハンドラを手動で定義する必要がありますが、新しい`get*Handler`ヘルパー関数でシンプルに記述できます。
  - `key`プロパティを手動で定義する必要があります
  - グループ化ヘッダーや集計などの機能を使用する場合は、`colSpan`プロパティを手動で定義する必要があります

```tsx
- <th {...header.getHeaderProps()}>{cell.render('Header')}</th> // [!code --]
+ <th colSpan={header.colSpan} key={column.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     header.column.columnDef.header, // [!code ++]
+     header.getContext() // [!code ++]
+   )} // [!code ++]
+ </th> // [!code ++]
```

```tsx
- <td {...cell.getCellProps()}>{cell.render('Cell')}</td> // [!code --]
+ <td key={cell.id}> // [!code ++]
+   {flexRender( // [!code ++]
+     cell.column.columnDef.cell, // [!code ++]
+     cell.getContext() // [!code ++]
+   )} // [!code ++]
+ </td> // [!code ++]
```

```tsx
// このケースでのカラム定義内
- Header: ({ getToggleAllRowsSelectedProps }) => ( // [!code --]
-   <input type="checkbox" {...getToggleAllRowsSelectedProps()} /> // [!code --]
- ), // [!code --]
- Cell: ({ row }) => ( // [!code --]
-   <input type="checkbox" {...row.getToggleRowSelectedProps()} /> // [!code --]
- ), // [!code --]
+ header: ({ table }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={table.getIsAllRowsSelected()} // [!code ++]
+     indeterminate={table.getIsSomeRowsSelected()} // [!code ++]
+     onChange={table.getToggleAllRowsSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
+ cell: ({ row }) => ( // [!code ++]
+   <Checkbox // [!code ++]
+     checked={row.getIsSelected()} // [!code ++]
+     disabled={!row.getCanSelect()} // [!code ++]
+     indeterminate={row.getIsSomeSelected()} // [!code ++]
+     onChange={row.getToggleSelectedHandler()} // [!code ++]
+   /> // [!code ++]
+ ), // [!code ++]
```

### その他の変更点

- カスタム`filterTypes`（現在は`filterFns`）は、行を含めるかどうかのブール値のみを返す新しい関数シグネチャになりました

```tsx
- (rows: Row[], id: string, filterValue: any) => Row[] // [!code --]
+ (row: Row, id: string, filterValue: any) => boolean // [!code ++]
```

- ...

> このガイドは現在進行中の作業です。時間があればぜひ貢献をお願いします！
