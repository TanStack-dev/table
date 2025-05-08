---
source-updated-at: '2025-01-20T06:07:15.000Z'
translation-updated-at: '2025-05-08T23:43:28.754Z'
title: Angular 表格適配器
---
`@tanstack/angular-table` 適配器是核心表格邏輯的封裝層，其主要職責是以「Angular 訊號 (signals)」的方式管理狀態，並提供型別定義以及單元格/表頭/表尾模板的渲染實現。

## 導出項目

`@tanstack/angular-table` 重新導出了 `@tanstack/table-core` 的所有 API 以及以下內容：

### `createAngularTable`

接受一個回傳表格選項的函數或計算值，並回傳一個表格實例。

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

// ...在模板中渲染你的表格
```

### `FlexRender`

一個 Angular 結構型指令，用於渲染帶有動態值的單元格/表頭/表尾模板。

FlexRender 支援 Angular 支援的任何內容類型：

- 字串或透過 `innerHTML` 傳遞的 HTML 字串
- [TemplateRef](https://angular.dev/api/core/TemplateRef)
- 包裝成 `FlexRenderComponent` 的[元件 (Component)](https://angular.dev/api/core/Component)

你可以直接使用 `cell.renderValue` 或 `cell.getValue` API 來渲染表格單元格。然而，這些 API 僅會輸出原始單元格值（來自存取函數）。若你使用 `cell: () => any` 欄位定義選項，則需要使用適配器提供的 `FlexRenderDirective`。

單元格欄位定義是**響應式 (reactive)** 的，並在**注入上下文 (injection context)** 中執行，因此你可以注入服務或使用訊號來自動修改渲染內容。

#### 範例

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
          <!-- 若要渲染簡單字串 -->
          {{ cell }}
          <!-- 若要渲染 HTML 字串 -->
          <div [innerHTML]="cell"></div>
        </ng-container>
      </td>
    }
  </tr>
}
</tbody>
```

#### 渲染元件

若要將元件渲染到特定欄位的表頭/單元格/表尾，你可以傳遞一個 `FlexRenderComponent` 實例，其中包含你的 `ComponentType`，並可設定輸入參數、輸出事件和自訂注入器。

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

  // 點擊事件輸出
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
            injector, // 可選注入器
            inputs: {
              // 必填輸入項（因使用 `input.required()`）
              content: context.row.original.rowProperty,
              // cellType? - 可選輸入項
            },
            outputs: {
              clickEvent: () => {
                // 執行某些操作
              }
            }
          }
        )
      },
    },
  ]
}
```

底層實作使用了 [ViewContainerRef#createComponent](https://angular.dev/api/core/ViewContainerRef#createComponent) API。因此，你應使用 `@Input` 裝飾器或 input/model 訊號來宣告自訂輸入項。

你仍可透過 `injectFlexRenderContext` 函數存取表格單元格上下文，該函數會根據傳遞給 `FlexRenderDirective` 的 props 回傳對應的上下文值。

```ts
@Component({
  // ...
})
class CustomCellComponent {
  // 單元格元件的上下文
  readonly context = injectFlexRenderContext<CellContext<TData, TValue>>();
  // 表頭/表尾元件的上下文
  readonly context = injectFlexRenderContext<HeaderContext<TData, TValue>>();
}
```

或者，你可以透過將元件類型傳遞給對應的欄位定義，將元件渲染到特定欄位的表頭、單元格或表尾。這些欄位定義會連同 `context` 一起提供給 `flexRender` 指令。

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

`flexRender` 指令提供的 `context` 屬性可被你的元件存取。你可以明確定義元件所需的上下文屬性。在此範例中，提供給 flexRender 的上下文類型為 `HeaderContext`。輸入訊號 `table` 是 `HeaderContext` 的屬性之一，與 `column` 和 `header` 屬性一起定義，供元件使用。若需要存取其他上下文屬性，可自由使用。請注意，此方式僅支援輸入訊號。

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

若要將 `TemplateRef` 渲染到特定欄位的表頭/單元格/表尾，你可以將 `TemplateRef` 傳遞給欄位定義。

你可以透過 `$implicit` 屬性存取 `TemplateRef` 的資料，該屬性的值基於 `flexRender` 的 `props` 欄位傳遞的內容。

在多數情況下，每個 `TemplateRef` 會根據單元格類型以下列方式渲染 `$implicit` 上下文：

- 表頭：`HeaderContext<T, ?>`
- 單元格：`CellContext<T, ?>`
- 表尾：`HeaderContext<T, ?>`

```angular-html
<ng-container
  *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
>
  <!-- 若要渲染簡單字串 -->
  {{ cell }}
  <!-- 若要渲染 HTML 字串 -->
  <div [innerHTML]="cell"></div>
</ng-container>

<ng-template #myCell let-context>
  <!-- 使用 context 渲染內容 -->
</ng-template>
```

完整範例：

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
                  props: cell.getContext(); // 提供給 TemplateRef 的資料
                  let cell
                "
              >
                <!-- 若要渲染簡單字串 -->
                {{ cell }}
                <!-- 若要渲染 HTML 字串 -->
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
