---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-08T23:43:55.956Z'
title: 標題群組
---
以下是所有標頭群組 (Header Group) 的**核心**選項與 API 屬性。更多選項與 API 屬性可能在其他[表格功能](../guide/features)中提供。

## 標頭群組 API (Header Group API)

所有標頭群組物件皆具有以下屬性：

### `id`

```tsx
id: string
```

標頭群組的唯一識別碼。

### `depth`

```tsx
depth: number
```

標頭群組的深度，以零為起始索引。

### `headers`

```tsx
type headers = Header<TData>[]
```

屬於此標頭群組的[標頭 (Header)](../api/core/header) 物件陣列
