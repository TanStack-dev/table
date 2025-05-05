---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:27:46.207Z'
title: ヘッダーグループ
---
以下は翻訳です:

これらはすべてのヘッダーグループに対する**コア**なオプションとAPIプロパティです。他の[テーブル機能](../guide/features)ではさらに多くのオプションとAPIプロパティが利用可能です。

## ヘッダーグループ API

すべてのヘッダーグループオブジェクトは以下のプロパティを持ちます:

### `id`

```tsx
id: string
```

ヘッダーグループの一意な識別子。

### `depth`

```tsx
depth: number
```

ヘッダーグループの深さ（0から始まるインデックス）。

### `headers`

```tsx
type headers = Header<TData>[]
```

このヘッダーグループに属する[Header](../api/core/header)オブジェクトの配列。
