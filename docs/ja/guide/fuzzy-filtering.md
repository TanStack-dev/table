---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:07.952Z'
title: ファジーフィルタリング
---
## サンプル

実装に直接進みたいですか？以下のサンプルを確認してください:

- [filters-fuzzy](../framework/react/examples/filters-fuzzy)

## API

[フィルターAPI](../api/features/filters)

## ファジーフィルタリングガイド

ファジーフィルタリング (fuzzy filtering) は、近似一致に基づいてデータをフィルタリングする技術です。これは、完全一致ではなく、指定された値に類似したデータを検索したい場合に便利です。

カスタムフィルター関数を定義することで、クライアントサイドのファジーフィルタリングを実装できます。この関数は行、columnId、フィルター値を引数に取り、その行をフィルタリングされたデータに含めるかどうかを示すブール値を返します。

ファジーフィルタリングは主にグローバルフィルタリングで使用されますが、個々の列にも適用できます。両方のケースでの実装方法について説明します。

> **注:** ファジーフィルタリングを使用するには、`@tanstack/match-sorter-utils`ライブラリをインストールする必要があります。
> TanStack Match Sorter Utils は、Kent C. Dodds の [match-sorter](https://github.com/kentcdodds/match-sorter) のフォークです。TanStack Tableの行ごとのフィルタリングアプローチにより適切に動作するようにフォークされました。

match-sorterライブラリの使用は任意ですが、TanStack Match Sorter Utilsライブラリは、ファジーフィルタリングと、返されるランク情報によるソートの両方を可能にする優れた方法を提供します。これにより、検索クエリに最も近い一致順に行をソートできます。

### カスタムファジーフィルター関数の定義

以下はカスタムファジーフィルター関数の例です:

```typescript
import { rankItem } from '@tanstack/match-sorter-utils';
import { FilterFn } from '@tanstack/table';

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // アイテムをランク付け
  const itemRank = rankItem(row.getValue(columnId), value)

  // itemRank情報を保存
  addMeta({ itemRank })

  // アイテムをフィルタリングするかどうかを返す
  return itemRank.passed
}
```

この関数では、@tanstack/match-sorter-utilsライブラリのrankItem関数を使用してアイテムをランク付けしています。その後、ランキング情報を行のメタデータに保存し、アイテムがランキング基準を通過したかどうかを返します。

### グローバルフィルタリングでのファジーフィルタリングの使用

グローバルフィルタリングでファジーフィルタリングを使用するには、テーブルインスタンスのglobalFilterFnオプションでファジーフィルター関数を指定します:

```typescript
const table = useReactTable({ // または使用するフレームワークの同等関数
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter, //カラム定義で使用できるフィルター関数として定義
    },
    globalFilterFn: 'fuzzy', //グローバルフィルターにファジーフィルターを適用（ファジーフィルターの最も一般的な使用例）
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //クライアントサイドフィルタリング
    getSortedRowModel: getSortedRowModel(), //ソートも使用する場合はクライアントサイドソートが必要
})
```

### カラムフィルタリングでのファジーフィルタリングの使用

カラムフィルタリングでファジーフィルタリングを使用するには、まずテーブルインスタンスのfilterFnsオプションでファジーフィルター関数を定義します。その後、カラム定義のfilterFnオプションでファジーフィルター関数を指定できます:

```typescript
const column = [
  {
    accessorFn: row => `${row.firstName} ${row.lastName}`,
    id: 'fullName',
    header: 'Full Name',
    cell: info => info.getValue(),
    filterFn: 'fuzzy', //カスタムファジーフィルター関数を使用
  },
  // 他のカラム...
];
```

この例では、データのfirstNameフィールドとlastNameフィールドを結合したカラムにファジーフィルターを適用しています。

#### ファジーフィルタリングでのソート

カラムフィルタリングでファジーフィルタリングを使用する場合、ランキング情報に基づいてデータをソートすることもできます。これはカスタムソート関数を定義することで実現できます:

```typescript
import { compareItems } from '@tanstack/match-sorter-utils'
import { sortingFns } from '@tanstack/table'

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // カラムにランキング情報がある場合のみランクでソート
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // ランクが等しい場合の英数字フォールバックを提供
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
```

この関数では、2つの行のランキング情報を比較しています。ランクが等しい場合は、英数字ソートにフォールバックします。

このソート関数は、カラム定義のsortFnオプションで指定できます:

```typescript
{
  accessorFn: row => `${row.firstName} ${row.lastName}`,
  id: 'fullName',
  header: 'Full Name',
  cell: info => info.getValue(),
  filterFn: 'fuzzy', //カスタムファジーフィルター関数を使用
  sortFn: 'fuzzySort', //カスタムファジーソート関数を使用
}
```
