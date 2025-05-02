---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:31:11.271Z'
title: 表头分组
---
以下是适用于所有表头组 (header groups) 的**核心**选项和 API 属性。更多选项和 API 属性可能适用于其他[表格功能](../guide/features)。

## 表头组 API (Header Group API)

所有表头组对象都具有以下属性：

### `id`

```tsx
id: string
```

表头组的唯一标识符。

### `depth`

```tsx
depth: number
```

表头组的深度，从零开始计数 (zero-indexed)。

### `headers`

```tsx
type headers = Header<TData>[]
```

属于该表头组的[表头 (Header)](../api/core/header) 对象数组。
