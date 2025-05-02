---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:00:26.469Z'
title: 列定义
---
## API

[列定义 (Column Def)](../api/core/column-def)

## 列定义指南

> 注意：本指南介绍的是为表格设置列定义，而非表格实例中实际生成的 [`column`](../guide/columns) 对象。

列定义是构建表格最重要的部分，它们负责：

- 构建底层数据模型，该模型将用于排序、筛选、分组等所有功能
- 将数据模型格式化为表格中显示的内容
- 创建 [表头组 (header groups)](../api/core/header-group)、[表头 (headers)](../api/core/header) 和 [表尾 (footers)](../api/core/column-def#footer)
- 创建仅用于展示的列，例如操作按钮、复选框、展开器、迷你图等

## 列定义类型

以下列定义"类型"并非实际的 TypeScript 类型，而是用于描述列定义的整体分类方式：

- `访问器列 (Accessor Columns)`
  - 访问器列具有底层数据模型，因此可以进行排序、筛选、分组等操作
- `展示列 (Display Columns)`
  - 展示列**没有**数据模型，因此无法排序、筛选等，但可用于在表格中显示任意内容，例如行操作按钮、复选框、展开器等
- `分组列 (Grouping Columns)`
  - 分组列**没有**数据模型，因此同样无法排序、筛选等，用于将其他列组合在一起。通常为列分组定义表头或表尾

## 列辅助工具

虽然列定义本质上只是普通对象，但表格核心提供了 `createColumnHelper` 函数，当传入行类型调用时，会返回一个工具函数，用于以最高类型安全性创建不同类型的列定义。

以下是创建和使用列辅助工具的示例：

```tsx
// 定义行数据结构
type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  status: string
  progress: number
}

const columnHelper = createColumnHelper<Person>()

// 创建列！
const defaultColumns = [
  // 展示列
  columnHelper.display({
    id: 'actions',
    cell: props => <RowActions row={props.row} />,
  }),
  // 分组列
  columnHelper.group({
    header: '姓名',
    footer: props => props.column.id,
    columns: [
      // 访问器列
      columnHelper.accessor('firstName', {
        cell: info => info.getValue(),
        footer: props => props.column.id,
      }),
      // 访问器列
      columnHelper.accessor(row => row.lastName, {
        id: 'lastName',
        cell: info => info.getValue(),
        header: () => <span>姓氏</span>,
        footer: props => props.column.id,
      }),
    ],
  }),
  // 分组列
  columnHelper.group({
    header: '信息',
    footer: props => props.column.id,
    columns: [
      // 访问器列
      columnHelper.accessor('age', {
        header: () => '年龄',
        footer: props => props.column.id,
      }),
      // 分组列
      columnHelper.group({
        header: '更多信息',
        columns: [
          // 访问器列
          columnHelper.accessor('visits', {
            header: () => <span>访问次数</span>,
            footer: props => props.column.id,
          }),
          // 访问器列
          columnHelper.accessor('status', {
            header: '状态',
            footer: props => props.column.id,
          }),
          // 访问器列
          columnHelper.accessor('progress', {
            header: '资料进度',
            footer: props => props.column.id,
          }),
        ],
      }),
    ],
  }),
]
```

## 创建访问器列

数据列的特殊之处在于必须配置为从 `data` 数组中的每个项提取原始值。

有三种实现方式：

- 如果项是 `对象`，使用与要提取值对应的对象键
- 如果项是嵌套 `数组`，使用与要提取值对应的数组索引
- 使用返回要提取值的访问器函数

## 对象键

如果每个项是具有以下结构的对象：

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

可以这样提取 `firstName` 值：

```tsx
columnHelper.accessor('firstName')

// 或

{
  accessorKey: 'firstName',
}
```

## 深层键

如果每个项是具有以下结构的对象：

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

可以这样提取 `first` 值：

```tsx
columnHelper.accessor('name.first', {
  id: 'firstName',
})

// 或

{
  accessorKey: 'name.first',
  id: 'firstName',
}
```

## 数组索引

如果每个项是具有以下结构的数组：

```tsx
type Sales = [Date, number]
```

可以这样提取 `number` 值：

```tsx
columnHelper.accessor(1)

// 或

{
  accessorKey: 1,
}
```

## 访问器函数

如果每个项是具有以下结构的对象：

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

可以这样提取计算得到的全名值：

```tsx
columnHelper.accessor(row => `${row.firstName} ${row.lastName}`, {
  id: 'fullName',
})

// 或

{
  id: 'fullName',
  accessorFn: row => `${row.firstName} ${row.lastName}`,
}
```

> 🧠 记住，访问的值将用于排序、筛选等操作，因此需要确保访问器函数返回的原始值能以有意义的方式操作。如果返回非原始值（如对象或数组），则需要提供相应的筛选/排序/分组函数来操作它们，甚至可能需要自定义这些函数！😬

## 唯一列 ID

列通过以下三种策略进行唯一标识：

- 如果使用对象键或数组索引定义访问器列，则相同的键或索引将用于唯一标识列
  - 对象键中的任何句点 (`.`) 都将替换为下划线 (`_`)
- 如果使用访问器函数定义访问器列
  - 将使用列的 `id` 属性唯一标识列，或
  - 如果提供了原始 `string` 类型的表头，则该表头字符串将用于唯一标识列

> 🧠 简单记忆方法：如果使用访问器函数定义列，请提供字符串表头或唯一的 `id` 属性。

## 列格式化与渲染

默认情况下，列单元格会将其数据模型值显示为字符串。可以通过提供自定义渲染实现来覆盖此行为。每个实现都会获得有关单元格、表头或表尾的相关信息，并返回框架适配器可以渲染的内容，例如 JSX/组件/字符串等。具体取决于使用的适配器。

有几种格式化器可供使用：

- `cell`：用于格式化单元格
- `aggregatedCell`：用于格式化聚合时的单元格
- `header`：用于格式化表头
- `footer`：用于格式化表尾

## 单元格格式化

可以通过向 `cell` 属性传递函数并使用 `props.getValue()` 函数访问单元格值来提供自定义单元格格式化器：

```tsx
columnHelper.accessor('firstName', {
  cell: props => <span>{props.getValue().toUpperCase()}</span>,
})
```

单元格格式化器还可以获取 `row` 和 `table` 对象，允许超越单元格值进行更灵活的格式化。以下示例虽然使用 `firstName` 作为访问器，但同时显示位于原始行对象上的带前缀用户 ID：

```tsx
columnHelper.accessor('firstName', {
  cell: props => (
    <span>{`${props.row.original.id} - ${props.getValue()}`}</span>
  ),
})
```

## 聚合单元格格式化

有关聚合单元格的更多信息，请参阅 [分组 (grouping)](../guide/grouping)。

## 表头与表尾格式化

表头和表尾无法访问行数据，但仍使用相同的概念来显示自定义内容。
