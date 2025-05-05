---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:25:13.911Z'
title: カラム定義
---
## API

[Column Def](../api/core/column-def)

## カラム定義ガイド

> 注: このガイドはテーブルのカラム定義の設定に関するものであり、テーブルインスタンス内で生成される実際の[`column`](../guide/columns)オブジェクトについては扱いません。

カラム定義はテーブル構築において最も重要な部分です。これらは以下の役割を担います:

- ソート、フィルタリング、グループ化などすべての処理に使用される基礎データモデルの構築
- データモデルをテーブルに表示する形式への変換
- [ヘッダーグループ](../api/core/header-group)、[ヘッダー](../api/core/header)、[フッター](../api/core/column-def#footer)の作成
- アクションボタン、チェックボックス、エキスパンダー、スパークラインなど表示専用のカラム作成

## カラム定義の種類

以下のカラム定義「タイプ」は実際のTypeScriptの型ではなく、カラム定義の全体的なカテゴリを説明するための概念です:

- `アクセサーカラム (Accessor Columns)`
  - データモデルを持つため、ソート、フィルタリング、グループ化などが可能
- `ディスプレイカラム (Display Columns)`
  - データモデルを持たないためソートやフィルタリングは不可だが、テーブルに任意のコンテンツ（行アクションボタン、チェックボックス、エキスパンダーなど）を表示可能
- `グループ化カラム (Grouping Columns)`
  - データモデルを持たないためソートやフィルタリングは不可で、他のカラムをグループ化するために使用。カラムグループのヘッダーやフッターを定義するのが一般的

## カラムヘルパー

カラム定義は結局のところ単なるオブジェクトですが、テーブルコアから`createColumnHelper`関数が公開されています。この関数に行タイプを渡すと、可能な限り型安全な方法で様々なカラム定義タイプを作成するユーティリティが返されます。

以下はカラムヘルパーの作成と使用例です:

```tsx
// 行の形状を定義
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

// カラムを作成
const defaultColumns = [
  // ディスプレイカラム
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  // グループ化カラム
  columnHelper.group({
    header: 'Name',
    footer: props => props.column.id,
    columns: [
      // アクセサーカラム
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      // アクセサーカラム
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>Last Name</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  // グループ化カラム
  columnHelper.group({
    header: 'Info',
    footer: props => props.column.id,
    columns: [
      // アクセサーカラム
      columnHelper.accessor('age', {
        header: () => 'Age',
        footer: props => props.column.id,
      }),
      // グループ化カラム
      columnHelper.group({
        header: 'More Info',
        columns: [
          // アクセサーカラム
          columnHelper.accessor('visits', {
            header: () => <span>Visits</span>,
            footer: props => props.column.id,
          }),
          // アクセサーカラム
          columnHelper.accessor('status', {
            header: 'Status',
            footer: props => props.column.id,
          }),
          // アクセサーカラム
          columnHelper.accessor('progress', {
            header: 'Profile Progress',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

## アクセサーカラムの作成

データカラムは、`data`配列の各アイテムからプリミティブ値を抽出するように設定する必要がある点で特殊です。

これには3つの方法があります:

- アイテムが`オブジェクト`の場合、抽出したい値に対応するオブジェクトキーを使用
- アイテムがネストされた`配列`の場合、抽出したい値に対応する配列インデックスを使用
- 抽出したい値を返すアクセサー関数を使用

## オブジェクトキー

各アイテムが以下の形状のオブジェクトの場合:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

`firstName`値を以下のように抽出できます:

```tsx
columnHelper.accessor('firstName')

// または

{
  accessorKey: 'firstName',
}
```

## 深いキー

各アイテムが以下の形状のオブジェクトの場合:

```tsx
type Person = {
  name: {
    first: string
    last: string
  }
  info: {
    age: number
    visits: number
  }
}
```

`first`値を以下のように抽出できます:

```tsx
columnHelper.accessor('name.first', {
  id: 'firstName',
})

// または

{
  accessorKey: 'name.first',
  id: 'firstName',
}
```

## 配列インデックス

各アイテムが以下の形状の配列の場合:

```tsx
type Sales = [Date, number]
```

`number`値を以下のように抽出できます:

```tsx
columnHelper.accessor(1)

// または

{
  accessorKey: 1,
}
```

## アクセサー関数

各アイテムが以下の形状のオブジェクトの場合:

```tsx
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}
```

計算されたフルネーム値を以下のように抽出できます:

```tsx
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// または

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

> 🧠 アクセサー関数が返す値はソートやフィルタリングなどに使用されるため、意味のある操作が可能なプリミティブ値を返すようにしてください。オブジェクトや配列のような非プリミティブ値を返す場合は、適切なフィルター/ソート/グループ化関数を用意するか、独自の関数を提供する必要があります！😬

## ユニークなカラムID

カラムは3つの方法で一意に識別されます:

- オブジェクトキーまたは配列インデックスでアクセサーカラムを定義する場合、同じ値がカラムの一意識別に使用されます
  - オブジェクトキー内のピリオド(`.`)はアンダースコア(`_`)に置換されます
- アクセサー関数でアクセサーカラムを定義する場合
  - カラムの`id`プロパティが一意識別に使用されるか
  - プリミティブな`文字列`ヘッダーが提供されている場合、そのヘッダー文字列が一意識別に使用されます

> 🧠 簡単に覚える方法: アクセサー関数でカラムを定義する場合は、文字列ヘッダーを提供するか、一意の`id`プロパティを提供してください。

## カラムのフォーマットとレンダリング

デフォルトでは、カラムセルはデータモデル値を文字列として表示します。カスタムレンダリング実装を提供することでこの動作を上書きできます。各実装にはセル、ヘッダー、フッターに関する関連情報が提供され、使用するフレームワークアダプターがレンダリングできるもの（JSX/コンポーネント/文字列など）を返します。これは使用するアダプターによって異なります。

利用可能なフォーマッター:

- `cell`: セルのフォーマットに使用
- `aggregatedCell`: 集約時のセルフォーマットに使用
- `header`: ヘッダーのフォーマットに使用
- `footer`: フッターのフォーマットに使用

## セルフォーマット

`cell`プロパティに関数を渡し、`props.getValue()`関数を使用してセルの値にアクセスすることで、カスタムセルフォーマッタを提供できます:

```tsx
columnHelper.accessor('firstName', {
  cell: props => <span>{props.getValue().toUpperCase()}</span>,
})
```

セルフォーマッタには`row`と`table`オブジェクトも渡されるため、セル値だけでなくセルのフォーマットをさらにカスタマイズできます。以下の例では`firstName`をアクセサーとして指定していますが、元の行オブジェクトにあるユーザーIDを接頭辞として表示しています:

```tsx
columnHelper.accessor('firstName', {
  cell: props => (
    <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  ),
})
```

## 集約セルフォーマット

集約セルの詳細については、[グループ化](../guide/grouping)を参照してください。

## ヘッダーとフッターのフォーマット

ヘッダーとフッターは行データにアクセスできませんが、カスタムコンテンツを表示するための同じ概念を使用します。
