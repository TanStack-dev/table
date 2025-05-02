---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:31:02.769Z'
title: 表格
---
## `createAngularTable` / `useReactTable` / `createSolidTable` / `useQwikTable` / `useVueTable` / `createSvelteTable`

```tsx
type useReactTable = <TData extends AnyData>(
  options: TableOptions<TData>
) => Table<TData>
```

这些函数用于创建表格实例，具体使用哪一个取决于你所采用的框架适配器。

## 选项参数

以下是表格的**核心**选项和 API 属性。更多选项和 API 属性可参见其他 [表格功能](../guide/features)。

### `data`

```tsx
data: TData[]
```

表格需要展示的数据数组。该数组理论上可以是任意类型，但通常建议与 `table.setRowType<...>` 指定的类型匹配。常见情况下数组中的每个元素是键值对对象（但非强制要求），列可以通过字符串/索引或函数访问器来获取这些数据。

当 `data` 选项的引用发生变化时（通过 `Object.is` 比较），表格会重新处理数据。任何依赖核心数据模型的其他数据处理（如分组、排序、筛选等）也会随之重新执行。

> 🧠 确保仅在需要表格重新处理数据时才更新 `data` 选项。如果每次渲染时都内联传入 `[]` 或新建数据数组，会导致大量不必要的重复处理。在小型表格中可能不易察觉，但在大型表格中会明显影响性能。

### `columns`

```tsx
type columns = ColumnDef<TData>[]
```

用于表格的列定义数组。创建列定义的详细信息请参阅 [列定义指南](../../docs/guide/column-defs)。

### `defaultColumn`

```tsx
defaultColumn?: Partial<ColumnDef<TData>>
```

为所有列定义提供默认配置选项。适用于设置默认的单元格/表头/表尾渲染器、排序/筛选/分组选项等。传入 `options.columns` 的所有列定义都会与此默认配置合并生成最终列定义。

### `initialState`

```tsx
initialState?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

通过此选项可选择性传入表格的初始状态。该状态会在重置表格时被使用（例如通过 `options.autoResetPageIndex` 自动重置，或调用 `table.resetRowSelection()` 等方法）。大多数重置函数允许传递标志位来重置为空白/默认状态而非初始状态。

> 🧠 此对象变化时不会触发表格状态重置，因此初始状态对象无需保持稳定引用。

### `autoResetAll`

```tsx
autoResetAll?: boolean
```

设置此选项可覆盖所有 `autoReset...` 功能选项。

### `meta`

```tsx
meta?: TableMeta // 此接口可通过声明合并扩展，见下文！
```

可通过 `options.meta` 传递任意对象，并在表格实例可访问的任何地方通过 `table.options.meta` 获取。该类型全局作用于所有表格，扩展方式如下：

```tsx
declare module '@tanstack/table-core' {
  interface TableMeta<TData extends RowData> {
    foo: string
  }
}
```

> 🧠 可将此选项视为表格的任意"上下文"。这是在不污染其他接口的情况下，向表格传递任意数据或函数的理想方式。典型用例包括传递本地化对象用于格式化日期/数字，或像 [可编辑数据示例](../framework/react/examples/editable-data) 中那样传递更新函数。

### `state`

```tsx
state?: Partial<
  VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
>
```

通过 `state` 选项可以选择性_控制_部分或全部表格状态。此处传入的状态会与表格内部自动管理的状态合并，并覆盖后者形成最终状态。同时可通过 `onStateChange` 选项监听状态变化。

### `onStateChange`

```tsx
onStateChange: (updater: Updater<TableState>) => void
```

此选项用于选择性监听表格内部状态变化。若提供此选项，则需要自行控制和更新表格状态，并通过 `state` 选项将状态回传给表格。

### `debugAll`

> ⚠️ 调试功能仅在开发模式下可用。

```tsx
debugAll?: boolean
```

设为 true 可将所有调试信息输出到控制台。

### `debugTable`

> ⚠️ 调试功能仅在开发模式下可用。

```tsx
debugTable?: boolean
```

设为 true 可输出表格调试信息到控制台。

### `debugHeaders`

> ⚠️ 调试功能仅在开发模式下可用。

```tsx
debugHeaders?: boolean
```

设为 true 可输出表头调试信息到控制台。

### `debugColumns`

> ⚠️ 调试功能仅在开发模式下可用。

```tsx
debugColumns?: boolean
```

设为 true 可输出列调试信息到控制台。

### `debugRows`

> ⚠️ 调试功能仅在开发模式下可用。

```tsx
debugRows?: boolean
```

设为 true 可输出行调试信息到控制台。

### `_features`

```tsx
_features?: TableFeature[]
```

可添加到表格实例的额外功能数组。

### `render`

> ⚠️ 此选项仅在你实现表格适配器时需要。

```tsx
type render = <TProps>(template: Renderable<TProps>, props: TProps) => any
```

`render` 选项为表格提供渲染器实现，用于将表头和单元格模板转换为用户框架支持的输出结果。

### `mergeOptions`

> ⚠️ 此选项仅在你实现表格适配器时需要。

```tsx
type mergeOptions = <T>(defaultOptions: T, options: Partial<T>) => T
```

此选项用于实现表格选项的合并逻辑。某些框架（如 solid-js）使用代理追踪响应式和使用情况，需要谨慎处理响应式对象的合并。此选项将合并过程的控制权交给适配器。

### `getCoreRowModel`

```tsx
getCoreRowModel: (table: Table<TData>) => () => RowModel<TData>
```

此必选项是用于计算并返回表格核心行模型的工厂函数。每个表格实例仅调用**一次**，应返回一个**新函数**用于计算和返回行模型。

各表格适配器通过 `{ getCoreRowModel }` 导出提供默认实现。

### `getSubRows`

```tsx
getSubRows?: (
  originalRow: TData,
  index: number
) => undefined | TData[]
```

此可选函数用于获取任意行的子行数据。若使用嵌套行结构，需通过此函数从行数据中返回子行数组（或 undefined）。

### `getRowId`

```tsx
getRowId?: (
  originalRow: TData,
  index: number,
  parent?: Row<TData>
) => string
```

此可选函数用于派生行的唯一 ID。未提供时默认使用行索引（嵌套行通过祖先行索引用 `.` 连接，如 `index.index.index`）。若需要标识来自服务端的行数据，建议使用此函数返回具有业务意义的 ID（如 userId、taskId 或数据库 ID 字段等）。

## 表格 API

表格实例上可用的属性和方法：

### `initialState`

```tsx
initialState: VisibilityTableState &
  ColumnOrderTableState &
  ColumnPinningTableState &
  FiltersTableState &
  SortingTableState &
  ExpandedTableState &
  GroupingTableState &
  ColumnSizingTableState &
  PaginationTableState &
  RowSelectionTableState
```

表格解析后的初始状态。

### `reset`

```tsx
reset: () => void
```

调用此函数可将表格状态重置为初始状态。

### `getState`

```tsx
getState: () => TableState
```

获取表格当前状态。建议使用此函数及其返回的状态（尤其在手动管理表格状态时），这与表格内部用于所有功能和逻辑的状态完全一致。

> 🧠 返回的状态是自动管理的内部状态与通过 `options.state` 传入的手动管理状态的浅合并结果。

### `setState`

```tsx
setState: (updater: Updater<TableState>) => void
```

更新表格状态。建议传入更新函数 `(prevState) => newState`，但也可直接传入状态对象。

> 🧠 若提供了 `options.onStateChange`，此函数触发时会调用该回调并传入新状态。

### `options`

```tsx
options: TableOptions<TData>
```

表格当前选项的只读引用。

> ⚠️ 此属性通常供内部或适配器使用。可通过传入新选项更新（具体方式因适配器而异）。适配器必须通过 `setOptions` 函数更新选项。

### `setOptions`

```tsx
setOptions: (newOptions: Updater<TableOptions<TData>>) => void
```

> ⚠️ 此函数通常由适配器用于更新表格选项。虽然可直接调用，但通常不建议绕过适配器的选项更新策略。

### `getCoreRowModel`

```tsx
getCoreRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

返回未经任何处理的原始行模型。

### `getRowModel`

```tsx
getRowModel: () => {
  rows: Row<TData>[],
  flatRows: Row<TData>[],
  rowsById: Record<string, Row<TData>>,
}
```

返回经过所有功能处理后的最终行模型。

### `getAllColumns`

```tsx
type getAllColumns = () => Column<TData>[]
```

返回表格中所有规范化且保持嵌套结构的列（与传入的列定义结构一致）。

### `getAllFlatColumns`

```tsx
type getAllFlatColumns = () => Column<TData>[]
```

返回所有平铺到单层级的列（包含层次结构中的父列对象）。

### `getAllLeafColumns`

```tsx
type getAllLeafColumns = () => Column<TData>[]
```

返回所有平铺到单层级的叶子节点列（不包含父列）。

### `getColumn`

```tsx
type getColumn = (id: string) => Column<TData> | undefined
```

根据 ID 返回单个列。

### `getHeaderGroups`

```tsx
type getHeaderGroups = () => HeaderGroup<TData>[]
```

返回表格的表头组。

### `getFooterGroups`

```tsx
type getFooterGroups = () => HeaderGroup<TData>[]
```

返回表格的表尾组。

### `getFlatHeaders`

```tsx
type getFlatHeaders = () => Header<TData>[]
```

返回平铺的表头对象数组（包含父表头）。

### `getLeafHeaders`

```tsx
type getLeafHeaders = () => Header<TData>[]
```

返回平铺的叶子节点表头对象数组。
