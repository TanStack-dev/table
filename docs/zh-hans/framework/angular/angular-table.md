---
source-updated-at: '2025-01-20T06:07:15.000Z'
translation-updated-at: '2025-05-02T16:55:56.276Z'
title: Angular 表格适配器
---
`@tanstack/angular-table` 适配器是对核心表格逻辑的封装层，其主要职责是以 "Angular 信号 (angular signals)" 的方式管理状态，并提供类型定义以及单元格/表头/页脚模板的渲染实现。

## 导出内容

`@tanstack/angular-table` 重新导出了 `@tanstack/table-core` 的所有 API 及以下内容：

### `createAngularTable`

接收一个返回表格配置项的函数或计算值，并返回表格实例。

```ts
import {createAngularTable} from '@tanstack/angular-table'

export class AppComponent {
  data = signal<Person[]>([])

  table = createAngularTable(() => ({
    data: this.data(),
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
  }))
}

// ...在模板中渲染表格
```

### `FlexRender`

一个 Angular 结构型指令，用于渲染包含动态值的单元格/表头/页脚模板。

FlexRender 支持 Angular 支持的所有内容类型：
- 字符串或通过 `innerHTML` 渲染的 HTML 字符串
- [TemplateRef](https://angular.dev/api/core/TemplateRef)
- 封装为 `FlexRenderComponent` 的[组件](https://angular.dev/api/core/Component)

虽然可以直接使用 `cell.renderValue` 或 `cell.getValue` API 渲染单元格内容，但这些 API 仅会输出原始单元格值（来自访问器函数）。如果使用了 `cell: () => any` 列定义选项，则需要使用适配器提供的 `FlexRenderDirective`。

单元格列定义是**响应式**的，并运行在**注入上下文**中，因此可以注入服务或使用信号 (signals) 自动修改渲染内容。

#### 示例

```ts
@Component({
  imports: [FlexRenderDirective],
  //...
})
class YourComponent {}
```

```angular-html
<tbody>
@for (row of table.getRowModel().rows; track row.id) {
  <tr>
    @for (cell of row.getVisibleCells(); track cell.id) {
      <td>
        <ng-container
          *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
        >
          <!-- 渲染普通字符串 -->
          {{ cell }}
          <!-- 渲染 HTML 字符串 -->
          <div [innerHTML]="cell"></div>
        </ng-container>
      </td>
    }
  </tr>
}
</tbody>
```

#### 渲染组件

要将组件渲染到特定列的表头/单元格/页脚，可以传递一个用 `ComponentType` 实例化的 `FlexRenderComponent`，并支持包含 inputs、outputs 和自定义注入器等参数。

```ts
import {flexRenderComponent} from "./flex-render-component";
import {ChangeDetectionStrategy, input, output} from "@angular/core";

@Component({
  template: `
    ...
  `,
  standalone: true,
  changeDetectionStrategy: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'clickEvent.emit($event)'
  }
})
class CustomCell {
  readonly content = input.required<string>();
  readonly cellType = input<MyType>();

  // 每个单元格点击时触发的输出事件
  readonly clickEvent = output<Event>();
}

class AppComponent {
  columns: ColumnDef<unknown>[] = [
    {
      id: 'custom-cell',
      header: () => {
        const translateService = inject(TranslateService);
        return translateService.translate('...');
      },
      cell: (context) => {
        return flexRenderComponent(
          MyCustomComponent,
          {
            injector, // 可选的注入器
            inputs: {
              // 必须的 input（因为使用了 input.required()）
              content: context.row.original.rowProperty,
              // cellType? - 可选的 input
            },
            outputs: {
              clickEvent: () => {
                // 执行某些操作
              }
            }
          }
        )
      },
    },
  ]
}
```

底层实现使用了 [ViewContainerRef#createComponent](https://angular.dev/api/core/ViewContainerRef#createComponent) API，因此自定义 inputs 应使用 @Input 装饰器或 input/model 信号声明。

仍可通过 `injectFlexRenderContext` 函数访问表格单元格上下文，该函数根据传递给 `FlexRenderDirective` 的 props 返回上下文值。

```ts
@Component({
  // ...
})
class CustomCellComponent {
  // 单元格组件的上下文
  readonly context = injectFlexRenderContext<CellContext<TData, TValue>>();
  // 表头/页脚组件的上下文
  readonly context = injectFlexRenderContext<HeaderContext<TData, TValue>>();
}
```

或者，也可以通过将组件类型传递给相应的列定义来渲染组件。这些列定义将与 `context` 一起提供给 `flexRender` 指令。

```ts
class AppComponent {
  columns: ColumnDef<Person>[] = [
    {
      id: 'select',
      header: () => TableHeadSelectionComponent<Person>,
      cell: () => TableRowSelectionComponent<Person>,
    },
  ]
}
```

```angular-html
<ng-container
  *flexRender="
    header.column.columnDef.header;
    props: header.getContext();
    let headerCell
  "
>
  {{ headerCell }}
</ng-container>
```

`flexRender` 指令提供的 `context` 属性可在组件中访问。可以显式定义组件所需的上下文属性。此示例中，flexRender 提供的上下文类型为 HeaderContext。输入信号 `table`（HeaderContext 的属性之一，与 `column` 和 `header` 属性一起）随后在组件中被定义使用。如果组件需要任何上下文属性，可自由使用它们。请注意，使用此方法定义上下文属性访问时，仅支持输入信号。

```angular-ts
@Component({
  template: `
    <input
      type="checkbox"
      [checked]="table().getIsAllRowsSelected()"
      [indeterminate]="table().getIsSomeRowsSelected()"
      (change)="table().toggleAllRowsSelected()"
    />
  `,
  // ...
})
export class TableHeadSelectionComponent<T> {
  //column = input.required<Column<T, unknown>>()
  //header = input.required<Header<T, unknown>>()
  table = input.required<Table<T>>()
}
```

#### 渲染 TemplateRef

要将 TemplateRef 渲染到特定列的表头/单元格/页脚，可以将 TemplateRef 传入列定义。

可通过 `$implicit` 属性访问 TemplateRef 数据，其值基于 flexRender 的 props 字段传递的内容。

大多数情况下，每个 TemplateRef 将根据单元格类型以如下方式渲染：

- 表头: `HeaderContext<T, ?>`
- 单元格: `CellContext<T, ?>`
- 页脚: `HeaderContext<T, ?>`

```angular-html
<ng-container
  *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
>
  <!-- 渲染普通字符串 -->
  {{ cell }}
  <!-- 渲染 HTML 字符串 -->
  <div [innerHTML]="cell"></div>
</ng-container>

<ng-template #myCell let-context>
  <!-- 使用 context 渲染内容 -->
</ng-template>
```

完整示例：

```angular-ts
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from '@tanstack/angular-table'
import {Component, TemplateRef, viewChild} from '@angular/core'

@Component({
  template: `
    <tbody>
      @for (row of table.getRowModel().rows; track row.id) {
        <tr>
          @for (cell of row.getVisibleCells(); track cell.id) {
            <td>
              <ng-container
                *flexRender="
                  cell.column.columnDef.cell;
                  props: cell.getContext(); // 传递给 TemplateRef 的数据
                  let cell
                "
              >
                <!-- 渲染普通字符串 -->
                {{ cell }}
                <!-- 渲染 HTML 字符串 -->
                <div [innerHTML]="cell"></div>
              </ng-container>
            </td>
          }
        </tr>
      }
    </tbody>

    <ng-template #customHeader let-context>
      {{ context.getValue() }}
    </ng-template>
    <ng-template #customCell let-context>
      {{ context.getValue() }}
    </ng-template>
  `,
})
class AppComponent {
  customHeader =
    viewChild.required<TemplateRef<{ $implicit: HeaderContext<any, any> }>>(
      'customHeader'
    )
  customCell =
    viewChild.required<TemplateRef<{ $implicit: CellContext<any, any> }>>(
      'customCell'
    )

  columns: ColumnDef<unknown>[] = [
    {
      id: 'customCell',
      header: () => this.customHeader(),
      cell: () => this.customCell(),
    },
  ]
}
```
