---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:24:50.264Z'
title: ヘッダーグループ
---
## API

[Header Group API](../api/core/header-group)

## ヘッダーグループガイド

このクイックガイドでは、TanStack Tableでヘッダーグループオブジェクトを取得および操作するさまざまな方法について説明します。

### ヘッダーグループとは？

ヘッダーグループは、単純にヘッダーの「行」です。名前が紛らわしいかもしれませんが、実はとてもシンプルです。ほとんどのテーブルは1行のヘッダー（単一のヘッダーグループ）しか持ちませんが、[Column Groupsの例](../framework/react/examples/column-groups)のようにネストした列構造を定義すると、複数行のヘッダー（複数のヘッダーグループ）を持つことができます。

### ヘッダーグループの取得方法

テーブルインスタンスからヘッダーグループを取得するには、複数の`table`インスタンスAPIを使用できます。`table.getHeaderGroups`が最も一般的に使用されるAPIですが、使用している機能によっては、他のAPIを使用する必要がある場合があります。例えば、カラムピニング機能を使用している場合は、`table.get[Left/Center/Right]HeaderGroups`などのAPIを使用する必要があります。

### ヘッダーグループオブジェクト

ヘッダーグループオブジェクトは[Row](../guide/rows)オブジェクトと似ていますが、ボディ行ほど複雑ではないため、よりシンプルです。

デフォルトでは、ヘッダーグループには次の3つのプロパティしかありません：

- `id`: ヘッダーグループの深さ（インデックス）から生成される一意の識別子。Reactコンポーネントのキーとして有用です。
- `depth`: ヘッダーグループの深さで、ゼロベースのインデックスです。これはすべてのヘッダー行における行インデックスと考えることができます。
- `headers`: このヘッダーグループ（行）に属する[Header](../guide/headers)セルオブジェクトの配列。

### ヘッダーセルへのアクセス

ヘッダーグループ内のヘッダーセルをレンダリングするには、ヘッダーグループオブジェクトの`headers`配列をマッピングします。

```jsx
<thead>
  {table.getHeaderGroups().map(headerGroup => {
    return (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map(header => ( // headerGroupのheaders配列をマッピング
          <th key={header.id} colSpan={header.colSpan}>
            {/* */}
          </th>
        ))}
      </tr>
    )
  })}
</thead>
```
