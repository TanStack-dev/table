---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:14:58.706Z'
title: 列尺寸调整
---
## 示例

想直接查看实现方式？请参考以下示例：

- [列宽调整](../framework/react/examples/column-sizing)
- [高性能列宽调整](../framework/react/examples/column-resizing-performant)

## API

[列宽调整 API](../api/features/column-sizing)

## 列宽调整指南

列宽调整功能允许你为每列指定宽度（包括最小和最大宽度），同时也支持用户动态调整所有列的宽度，例如通过拖拽列标题实现。

### 列宽设置

默认情况下，列具有以下尺寸参数：

```tsx
export const defaultColumnSizing = {
  size: 150,
  minSize: 20,
  maxSize: Number.MAX_SAFE_INTEGER,
}
```

这些默认值可以通过 `tableOptions.defaultColumn` 和单独的列定义按顺序覆盖。

```tsx
const columns = [
  {
    accessorKey: 'col1',
    size: 270, //为本列设置宽度
  },
  //...
]

const table = useReactTable({
  //覆盖默认列尺寸
  defaultColumn: {
    size: 200, //初始列宽
    minSize: 50, //调整列宽时的最小值
    maxSize: 500, //调整列宽时的最大值
  },
})
```

列的 "尺寸" 以数字形式存储在表格状态中，通常被解释为像素单位值，但你可以根据需要将这些列宽值关联到 CSS 样式中。

作为一个无头工具 (headless utility)，表格的列宽逻辑实际上只是一组状态集合，你可以按需应用到自己的布局中（我们的示例实现了两种样式逻辑）。这些宽度测量可以通过多种方式应用：

- 语义化的 `table` 元素或任何以表格 CSS 模式显示的元素
- `div/span` 元素或任何以非表格 CSS 模式显示的元素
  - 具有固定宽度的块级元素
  - 具有固定宽度的绝对定位元素
  - 具有弹性宽度的 Flexbox 布局元素
  - 具有弹性宽度的 Grid 布局元素
- 实际上任何能将单元格宽度插入表格结构的布局机制

每种方法都有其权衡和限制，这些通常是 UI/组件库或设计系统的设计考量，幸运的是这不关你的事 😉。

### 列宽调整功能

TanStack Table 提供内置的列宽调整状态和 API，让你能够轻松在表格 UI 中实现列宽调整，并提供多种用户体验和性能选项。

#### 启用列宽调整

默认情况下，`column.getCanResize()` API 对所有列返回 `true`，但你可以通过 `enableColumnResizing` 表格选项全局禁用列宽调整，或通过 `enableResizing` 列选项单独禁用。

```tsx
const columns = [
  {
    accessorKey: 'id',
    enableResizing: false, //仅禁用本列调整
    size: 200, //初始列宽
  },
  //...
]
```

#### 列宽调整模式

默认列宽调整模式为 `"onEnd"`。这意味着 `column.getSize()` API 只在用户完成调整（拖拽）列宽后返回新尺寸。通常在调整过程中会显示一个小型 UI 指示器。

在 React TanStack Table 适配器中，根据表格或网页的复杂程度，实现 60 fps 的列宽调整渲染可能较为困难。`"onEnd"` 列宽调整模式可以作为一个良好的默认选项，避免用户在调整列宽时出现卡顿或延迟。这并不是说使用 TanStack React Table 无法实现 60 fps 的列宽调整渲染，但你可能需要进行额外的记忆化 (memoization) 或其他性能优化才能实现。

> 高级列宽调整性能技巧将在[下方讨论](#高级列宽调整性能优化)。

如需将列宽调整模式改为 `"onChange"` 以实现即时渲染，可通过 `columnResizeMode` 表格选项设置。

```tsx
const table = useReactTable({
  //...
  columnResizeMode: 'onChange', //将列宽调整模式改为 "onChange"
})
```

#### 列宽调整方向

默认情况下，TanStack Table 假设表格标记是按从左到右方向布局的。对于从右到左的布局，可能需要将列宽调整方向改为 `"rtl"`。

```tsx
const table = useReactTable({
  //...
  columnResizeDirection: 'rtl', //为特定语言环境改为从右到左调整
})
```

#### 将列宽调整 API 连接到 UI

有几个非常方便的 API 可用于将列宽调整的拖拽交互连接到你的 UI。

##### 列尺寸 API

要将列尺寸应用到列标题单元格、数据单元格或页脚单元格，可以使用以下 API：

```ts
header.getSize()
column.getSize()
cell.column.getSize()
```

如何将这些尺寸样式应用到标记由你决定，但通常使用 CSS 变量或内联样式来设置列宽。

```tsx
<th
  key={header.id}
  colSpan={header.colSpan}
  style={{ width: `${header.getSize()}px` }}
>
```

不过，如[高级列宽调整性能章节](#高级列宽调整性能优化)所述，建议考虑使用 CSS 变量来设置列宽。

##### 列宽调整 API

TanStack Table 提供预构建的事件处理器来简化拖拽交互的实现。这些事件处理器是调用其他内部 API 来更新列宽状态并重新渲染表格的便捷函数。使用 `header.getResizeHandler()` 来连接列宽调整的拖拽交互，同时支持鼠标和触摸事件。

```tsx
<ColumnResizeHandle
  onMouseDown={header.getResizeHandler()} //桌面端
  onTouchStart={header.getResizeHandler()} //移动端
/>
```

##### 使用 ColumnSizingInfoState 显示调整指示器

TanStack Table 会跟踪一个名为 `columnSizingInfo` 的状态对象，可用于渲染列宽调整指示器 UI。

```jsx
<ColumnResizeIndicator
  style={{
    transform: header.column.getIsResizing()
      ? `translateX(${table.getState().columnSizingInfo.deltaOffset}px)`
      : '',
  }}
/>
```

#### 高级列宽调整性能优化

如果你正在创建大型或复杂的表格（并且使用 React 😉），可能会发现如果没有为渲染逻辑添加适当的记忆化，用户在调整列宽时可能会遇到性能下降的问题。

我们创建了一个[高性能列宽调整示例](../framework/react/examples/column-resizing-performant)，展示了如何通过复杂表格实现 60 fps 的列宽调整渲染（否则可能会出现渲染缓慢的情况）。建议直接查看该示例了解实现方式，但以下是需要记住的基本要点：

1. 不要在每个表头和每个数据单元格上使用 `column.getSize()`。相反，**预先计算并记忆化**所有列宽！
2. 在调整过程中记忆化表格主体 (Table Body)。
3. 使用 CSS 变量将列宽传递给表格单元格。

如果遵循这些步骤，应该能在列宽调整时看到显著的性能提升。

如果你不使用 React，而是使用 Svelte、Vue 或 Solid 适配器，可能不需要太担心这个问题，但类似的原则同样适用。
