---
source-updated-at: '2024-07-27T18:15:45.000Z'
translation-updated-at: '2025-05-02T17:05:46.367Z'
title: 表格状态
---
## 表格状态 (Angular) 指南

TanStack Table 的核心是 **框架无关 (framework agnostic)** 的，这意味着无论您使用何种框架，其 API 都保持一致。根据您使用的框架，提供了适配器 (Adapters) 来简化与表格核心的交互。可用的适配器请参阅 Adapters 菜单。

### 访问表格状态

您无需进行任何特殊设置即可使用表格状态。如果不向 `state`、`initialState` 或任何 `on[State]Change` 表格选项中传递任何内容，表格将在内部自行管理其状态。您可以通过使用 `table.getState()` 表格实例 API 访问此内部状态的任何部分。

```ts
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  //...
}))

someHandler() {
  console.log(this.table.getState()) //访问整个内部状态
  console.log(this.table.getState().rowSelection) //仅访问行选择状态
}
```

### 自定义初始状态

如果对于某些状态，您只需要自定义它们的初始默认值，那么您仍然不需要自行管理任何状态。您只需在表格实例的 `initialState` 选项中设置值即可。

```jsx
table = createAngularTable(() => ({
  columns: this.columns,
  data: this.data(),
  initialState: {
    columnOrder: ['age', 'firstName', 'lastName'], //自定义初始列顺序
    columnVisibility: {
      id: false //默认隐藏 id 列
    },
    expanded: true, //默认展开所有行
    sorting: [
      {
        id: 'age',
        desc: true //默认按年龄降序排序
      }
    ]
  },
  //...
}))
```

> **注意**：每个特定状态只能在 `initialState` 或 `state` 中指定，而不能同时在两者中指定。如果某个状态值同时传递给 `initialState` 和 `state`，`state` 中的初始化状态将覆盖 `initialState` 中的相应值。

### 受控状态

如果您需要在应用程序的其他部分轻松访问表格状态，TanStack Table 可以让您轻松地在自己的状态管理系统中控制和管理表格状态的任何部分或全部。您可以通过将自己的状态和状态管理函数传递给 `state` 和 `on[State]Change` 表格选项来实现这一点。

#### 单独受控状态

您可以仅控制需要轻松访问的状态。如果不需要，您不必控制所有表格状态。建议根据具体情况仅控制所需的状态。

为了控制特定状态，您需要将相应的 `state` 值和 `on[State]Change` 函数都传递给表格实例。

以“手动”服务器端数据获取场景中的过滤、排序和分页为例。您可以将过滤、排序和分页状态存储在自己的状态管理中，但如果您的 API 不关心列顺序、列可见性等值，则可以忽略这些状态。

```ts
import {signal} from '@angular/core';
import {SortingState, ColumnFiltersState, PaginationState} from '@tanstack/angular-table'
import {toObservable} from "@angular/core/rxjs-interop";
import {combineLatest, switchMap} from 'rxjs';

class TableComponent {
  readonly columnFilters = signal<ColumnFiltersState>([]) //无默认过滤器
  readonly sorting = signal<SortingState>([
    {
      id: 'age',
      desc: true, //默认按年龄降序排序
    }
  ])
  readonly pagination = signal<PaginationState>({
    pageIndex: 0,
    pageSize: 15
  })

  //使用受控状态值获取数据
  readonly data$ = combineLatest({
    filters: toObservable(this.columnFilters),
    sorting: toObservable(this.sorting),
    pagination: toObservable(this.pagination)
  }).pipe(
    switchMap(({filters, sorting, pagination}) => fetchData(filters, sorting, pagination))
  )
  readonly data = toSignal(this.data$);

  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      columnFilters: this.columnFilters(), //将受控状态传递回表格（覆盖内部状态）
      sorting: this.sorting(),
      pagination: this.pagination(),
    },
    onColumnFiltersChange: updater => { //将 columnFilters 状态提升到自己的状态管理
      updater instanceof Function
        ? this.columnFilters.update(updater)
        : this.columnFilters.set(updater)
    },
    onSortingChange: updater => {
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    },
    onPaginationChange: updater => {
      updater instanceof Function
        ? this.pagination.update(updater)
        : this.pagination.set(updater)
    },
  }))
}

//...
```

#### 完全受控状态

或者，您可以使用 `onStateChange` 表格选项控制整个表格状态。这会将整个表格状态提升到您自己的状态管理系统中。使用此方法时要小心，因为您可能会发现将一些频繁变化的状态值（如 `columnSizingInfo` 状态）提升到组件树中可能会导致性能问题。

可能需要一些额外的技巧来实现这一点。如果使用 `onStateChange` 表格选项，`state` 的初始值必须填充所有相关状态值，以便使用所有所需功能。您可以手动输入所有初始状态值，或者如下所示以特殊方式使用构造函数。

```ts


class TableComponent {
  // 创建一个空的表格状态，稍后覆盖它
  readonly state = signal({} as TableState);

  // 使用默认状态值创建表格实例
  readonly table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    // 完全受控状态覆盖内部状态
    state: this.state(),
    onStateChange: updater => {
      // 任何状态更改都将推送到我们自己的状态管理
      this.state.set(
        updater instanceof Function ? updater(this.state()) : updater
      )
    }
  }))

  constructor() {
    // 设置初始表格状态
    this.state.set({
      // 使用表格实例中的所有默认状态值填充初始状态
      ...this.table.initialState,
      pagination: {
        pageIndex: 0,
        pageSize: 15, // 可选自定义初始分页状态
      },
    })
  }
}
```

### 状态变更回调

到目前为止，我们已经看到 `on[State]Change` 和 `onStateChange` 表格选项用于将表格状态更改“提升”到我们自己的状态管理中。然而，使用这些选项时需要注意以下几点。

#### 1. **状态变更回调必须在 `state` 选项中有对应的状态值**。

指定 `on[State]Change` 回调会告诉表格实例这是一个受控状态。如果未指定相应的 `state` 值，该状态将“冻结”为其初始值。

```ts
class TableComponent {
  sorting = signal<SortingState>([])

  table = createAngularTable(() => ({
    columns: this.columns,
    data: this.data(),
    //...
    state: {
      sorting: this.sorting(), // 必需，因为我们使用了 `onSortingChange`
    },
    onSortingChange: updater => { // 使 `state.sorting` 受控
      updater instanceof Function
        ? this.sorting.update(updater)
        : this.sorting.set(updater)
    }
  }))
}
```

#### 2. **更新器可以是原始值或回调函数**。

`on[State]Change` 和 `onStateChange` 回调的工作方式与 React 中的 `setState` 函数完全相同。更新器值可以是新的状态值，也可以是接收先前状态值并返回新状态值的回调函数。

这意味着什么？这意味着如果您想在 `on[State]Change` 回调中添加一些额外逻辑，可以这样做，但需要检查新的更新器值是函数还是值。

这就是为什么在上面的示例中会看到 `updater instanceof Function ? this.state.update(updater) : this.state.set(updater)` 模式。此模式检查更新器是否为函数，如果是，则使用先前的状态值调用该函数以获取新状态值，否则信号将要求使用 `signal.update` 而不是 `signal.set` 来调用更新器。

### 状态类型

TanStack Table 中的所有复杂状态都有自己的 TypeScript 类型，您可以导入并使用。这对于确保您为控制的状态值使用正确的数据结构和属性非常有用。

```ts
import {createAngularTable, type SortingState} from '@tanstack/angular-table'

class TableComponent {
  readonly sorting = signal<SortingState>([
    {
      id: 'age', // 您应该会获得 `id` 和 `desc` 属性的自动完成
      desc: true,
    }
  ])
}
```
