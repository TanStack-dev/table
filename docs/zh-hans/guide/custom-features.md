---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-02T17:29:08.150Z'
title: 自定义功能
---
## 示例

想直接查看实现代码？请参考以下示例：

- [custom-features](../framework/react/examples/custom-features)

## 自定义功能指南

本指南将介绍如何扩展 TanStack Table 以添加自定义功能，同时我们也会深入了解 TanStack Table v8 代码库的结构和工作原理。

### TanStack Table 追求精简

TanStack Table 内置了一套核心功能，如排序、过滤、分页等。我们收到了许多请求，有时甚至是经过深思熟虑的 PR，希望在库中添加更多功能。虽然我们始终欢迎对库进行改进，但也希望确保 TanStack Table 保持精简，不会包含太多在大多数用例中不太可能使用的冗余代码。并非每个 PR 都能或应该被合并到核心库中，即使它确实解决了实际问题。对于 TanStack Table 能满足 90% 需求但需要更多控制的开发者来说，这可能会令人沮丧。

TanStack Table 从 v7 开始就设计为高度可扩展。无论你使用哪个框架适配器（`useReactTable`、`useVueTable` 等），返回的 `table` 实例都是一个普通的 JavaScript 对象，可以添加额外的属性或 API。一直以来，都可以通过组合的方式向表实例添加自定义逻辑、状态和 API。像 [Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/hooks/useMRT_TableInstance.ts) 这样的库，就是通过在 `useReactTable` 钩子上创建自定义包装钩子来扩展表实例的功能。

然而，从 v8.14.0 开始，TanStack Table 提供了一个新的 `_features` 表选项，允许你以与内置表功能完全相同的方式，更紧密、更清晰地集成自定义代码到表实例中。

> TanStack Table v8.14.0 引入了新的 `_features` 选项，允许你向表实例添加自定义功能。

通过这种更紧密的集成，你可以轻松地为表格添加更复杂的自定义功能，甚至可以将它们打包并与社区分享。我们将观察这一功能如何随时间发展。在未来的 v9 版本中，我们可能会通过让所有功能变为可选来进一步减小 TanStack Table 的包体积，但这仍在探索中。

### TanStack Table 功能的工作原理

TanStack Table 的源代码可以说相对简单（至少我们这样认为）。每个功能的代码都拆分到自己的对象/文件中，包含创建初始状态的方法、默认表和列选项，以及可以添加到 `table`、`header`、`column`、`row` 和 `cell` 实例的 API 方法。

所有功能对象的功能都可以通过 TanStack Table 导出的 `TableFeature` 类型来描述。这个类型是一个 TypeScript 接口，描述了创建功能所需的对象结构。

```ts
export interface TableFeature<TData extends RowData = any> {
  createCell?: (
    cell: Cell<TData, unknown>,
    column: Column<TData>,
    row: Row<TData>,
    table: Table<TData>
  ) => void
  createColumn?: (column: Column<TData, unknown>, table: Table<TData>) => void
  createHeader?: (header: Header<TData, unknown>, table: Table<TData>) => void
  createRow?: (row: Row<TData>, table: Table<TData>) => void
  createTable?: (table: Table<TData>) => void
  getDefaultColumnDef?: () => Partial<ColumnDef<TData, unknown>>
  getDefaultOptions?: (
    table: Table<TData>
  ) => Partial<TableOptionsResolved<TData>>
  getInitialState?: (initialState?: InitialTableState) => Partial<TableState>
}
```

这可能有点令人困惑，让我们分解一下这些方法的作用：

#### 默认选项和初始状态

<br />

##### getDefaultOptions

表功能中的 `getDefaultOptions` 方法负责为该功能设置默认表选项。例如，在 [列调整大小](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`getDefaultOptions` 方法设置了默认的 `columnResizeMode` 选项，其默认值为 `"onEnd"`。

<br />

##### getDefaultColumnDef

表功能中的 `getDefaultColumnDef` 方法负责为该功能设置默认列选项。例如，在 [排序](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`getDefaultColumnDef` 方法设置了默认的 `sortUndefined` 列选项，其默认值为 `1`。

<br />

##### getInitialState

表功能中的 `getInitialState` 方法负责为该功能设置默认状态。例如，在 [分页](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowPagination.ts) 功能中，`getInitialState` 方法设置了默认的 `pageSize` 状态值为 `10`，默认的 `pageIndex` 状态值为 `0`。

#### API 创建器

<br />

##### createTable

表功能中的 `createTable` 方法负责向 `table` 实例添加方法。例如，在 [行选择](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createTable` 方法添加了许多表实例 API 方法，如 `toggleAllRowsSelected`、`getIsAllRowsSelected`、`getIsSomeRowsSelected` 等。因此，当你调用 `table.toggleAllRowsSelected()` 时，你调用的就是由 `RowSelection` 功能添加到表实例的方法。

<br />

##### createHeader

表功能中的 `createHeader` 方法负责向 `header` 实例添加方法。例如，在 [列调整大小](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnSizing.ts) 功能中，`createHeader` 方法添加了许多表头实例 API 方法，如 `getStart` 等。因此，当你调用 `header.getStart()` 时，你调用的就是由 `ColumnSizing` 功能添加到表头实例的方法。

<br />

##### createColumn

表功能中的 `createColumn` 方法负责向 `column` 实例添加方法。例如，在 [排序](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSorting.ts) 功能中，`createColumn` 方法添加了许多列实例 API 方法，如 `getNextSortingOrder`、`toggleSorting` 等。因此，当你调用 `column.toggleSorting()` 时，你调用的就是由 `RowSorting` 功能添加到列实例的方法。

<br />

##### createRow

表功能中的 `createRow` 方法负责向 `row` 实例添加方法。例如，在 [行选择](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/RowSelection.ts) 功能中，`createRow` 方法添加了许多行实例 API 方法，如 `toggleSelected`、`getIsSelected` 等。因此，当你调用 `row.toggleSelected()` 时，你调用的就是由 `RowSelection` 功能添加到行实例的方法。

<br />

##### createCell

表功能中的 `createCell` 方法负责向 `cell` 实例添加方法。例如，在 [列分组](https://github.com/TanStack/table/blob/main/packages/table-core/src/features/ColumnGrouping.ts) 功能中，`createCell` 方法添加了许多单元格实例 API 方法，如 `getIsGrouped`、`getIsAggregated` 等。因此，当你调用 `cell.getIsGrouped()` 时，你调用的就是由 `ColumnGrouping` 功能添加到单元格实例的方法。

### 添加自定义功能

让我们通过一个假设的用例来逐步实现一个自定义表功能。假设我们想向表实例添加一个功能，允许用户更改表格的“密度”（单元格的内边距）。

查看完整的 [custom-features](../framework/react/examples/custom-features) 示例以了解完整实现，以下是创建自定义功能的详细步骤。

#### 步骤 1：设置 TypeScript 类型

假设你希望像 TanStack Table 内置功能一样拥有完整的类型安全，让我们为新功能设置所有 TypeScript 类型。我们将为新的表选项、状态和表实例 API 方法创建类型。

这些类型遵循 TanStack Table 内部使用的命名约定，但你可以随意命名。我们暂时不会将这些类型添加到 TanStack Table 中，下一步会进行。

```ts
// 为新功能的自定义状态定义类型
export type DensityState = 'sm' | 'md' | 'lg'
export interface DensityTableState {
  density: DensityState
}

// 为新功能的表选项定义类型
export interface DensityOptions {
  enableDensity?: boolean
  onDensityChange?: OnChangeFn<DensityState>
}

// 为新功能的表 API 定义类型
export interface DensityInstance {
  setDensity: (updater: Updater<DensityState>) => void
  toggleDensity: (value?: DensityState) => void
}
```

#### 步骤 2：使用声明合并将新类型添加到 TanStack Table

我们可以告诉 TypeScript 修改从 TanStack Table 导出的类型，以包含新功能的类型。这称为“声明合并”，是 TypeScript 的一个强大功能。这样，我们在新功能的代码或应用代码中就不需要使用 `as unknown as CustomTable` 或 `// @ts-ignore` 等 TypeScript 技巧。

```ts
// 使用声明合并将新功能的 API 和状态类型添加到 TanStack Table 的现有类型中。
declare module '@tanstack/react-table' { // 或你正在使用的任何框架适配器
  // 将新功能的状态与现有表状态合并
  interface TableState extends DensityTableState {}
  // 将新功能的选项与现有表选项合并
  interface TableOptionsResolved<TData extends RowData>
    extends DensityOptions {}
  // 将新功能的实例 API 与现有表实例 API 合并
  interface Table<TData extends RowData> extends DensityInstance {}
  // 如果需要添加单元格实例 API...
  // interface Cell<TData extends RowData, TValue> extends DensityCell
  // 如果需要添加行实例 API...
  // interface Row<TData extends RowData> extends DensityRow
  // 如果需要添加列实例 API...
  // interface Column<TData extends RowData, TValue> extends DensityColumn
  // 如果需要添加表头实例 API...
  // interface Header<TData extends RowData, TValue> extends DensityHeader

  // 注意：无法对 `ColumnDef` 进行声明合并，因为它是一个复杂类型，而不是接口。
  // 但你仍然可以对 `ColumnDef.meta` 进行声明合并。
}
```

正确完成后，我们在创建新功能代码和在应用中使用它时应该不会有 TypeScript 错误。

##### 使用声明合并的注意事项

使用声明合并的一个注意事项是，它会影响代码库中所有表的 TanStack Table 类型。如果你计划为应用中的每个表加载相同的功能集，这不是问题，但如果某些表加载额外功能而某些不加载，可能会出现问题。或者，你可以创建一组自定义类型，从 TanStack Table 类型扩展并添加新功能。[Material React Table](https://github.com/KevinVandy/material-react-table/blob/v2/packages/material-react-table/src/types.ts) 就是这样做的，以避免影响普通 TanStack Table 表的类型，但这更繁琐，并且在某些地方需要进行大量类型转换。

#### 步骤 3：创建功能对象

完成所有 TypeScript 设置后，我们现在可以为新功能创建功能对象。在这里，我们定义将添加到表实例的所有方法。

使用 `TableFeature` 类型确保你正确创建功能对象。如果 TypeScript 类型设置正确，创建包含新状态、选项和实例 API 的功能对象时应该不会有 TypeScript 错误。

```ts
export const DensityFeature: TableFeature<any> = { // 使用 TableFeature 类型！！
  // 定义新功能的初始状态
  getInitialState: (state): DensityTableState => {
    return {
      density: 'md',
      ...state,
    }
  },

  // 定义新功能的默认选项
  getDefaultOptions: <TData extends RowData>(
    table: Table<TData>
  ): DensityOptions => {
    return {
      enableDensity: true,
      onDensityChange: makeStateUpdater('density', table),
    } as DensityOptions
  },
  // 如果需要添加默认列定义...
  // getDefaultColumnDef: <TData extends RowData>(): Partial<ColumnDef<TData>> => {
  //   return { meta: {} } // 使用 meta 而不是直接添加到 columnDef，以避免难以解决的 TypeScript 问题
  // },

  // 定义新功能的表实例方法
  createTable: <TData extends RowData>(table: Table<TData>): void => {
    table.setDensity = updater => {
      const safeUpdater: Updater<DensityState> = old => {
        let newState = functionalUpdate(updater, old)
        return newState
      }
      return table.options.onDensityChange?.(safeUpdater)
    }
    table.toggleDensity = value => {
      table.setDensity(old => {
        if (value) return value
        return old === 'lg' ? 'md' : old === 'md' ? 'sm' : 'lg' // 在 3 个选项间循环
      })
    }
  },

  // 如果需要添加行实例 API...
  // createRow: <TData extends RowData>(row, table): void => {},
  // 如果需要添加单元格实例 API...
  // createCell: <TData extends RowData>(cell, column, row, table): void => {},
  // 如果需要添加列实例 API...
  // createColumn: <TData extends RowData>(column, table): void => {},
  // 如果需要添加表头实例 API...
  // createHeader: <TData extends RowData>(header, table): void => {},
}
```

#### 步骤 4：将功能添加到表

现在我们有了功能对象，可以在创建表实例时通过 `_features` 选项将其添加到表实例中。

```ts
const table = useReactTable({
  _features: [DensityFeature], // 将新功能传递给表，与所有内置功能在底层合并
  columns,
  data,
  //..
})
```

#### 步骤 5：在应用中使用功能

现在功能已添加到表实例中，你可以在应用中使用新的实例 API、选项和状态。

```tsx
const table = useReactTable({
  _features: [DensityFeature], // 将自定义功能传递给表，在创建时实例化
  columns,
  data,
  //...
  state: {
    density, // 将密度状态传递给表，TS 仍然正常 :)
  },
  onDensityChange: setDensity, // 使用新的 onDensityChange 选项，TS 仍然正常 :)
})
//...
const { density } = table.getState()
return(
  <td
    key={cell.id}
    style={{
      // 在代码中使用新功能
      padding:
        density === 'sm'
          ? '4px'
          : density === 'md'
            ? '8px'
            : '16px',
      transition: 'padding 0.2s',
    }}
  >
    {flexRender(
      cell.column.columnDef.cell,
      cell.getContext()
    )}
  </td>
)
```

#### 必须这样做吗？

这只是将自定义代码与 TanStack Table 内置功能集成的新方法。在上面的示例中，我们也可以将 `density` 状态存储在 `React.useState` 中，在任何地方定义自己的 `toggleDensity` 处理程序，并在代码中独立于表实例使用它。在 TanStack Table 旁边构建表格功能，而不是深度集成到表实例中，仍然是构建自定义功能的完全有效方式。根据你的用例，这可能不是扩展 TanStack Table 自定义功能的最简洁方式。
