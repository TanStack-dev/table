---
source-updated-at: '2025-01-20T06:07:15.000Z'
translation-updated-at: '2025-05-05T19:24:47.875Z'
title: Angularテーブルアダプター
---
`@tanstack/angular-table`アダプターは、コアのテーブルロジックをラップするものです。その主な役割は、状態を「Angularシグナル」の方法で管理し、型を提供し、セル/ヘッダー/フッターテンプレートのレンダリング実装を行うことです。

## エクスポート

`@tanstack/angular-table`は、`@tanstack/table-core`のすべてのAPIと以下を再エクスポートします:

### `createAngularTable`

テーブルオプションを返すオプション関数または計算値を受け取り、テーブルを返します。

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

// ...テンプレートでテーブルをレンダリング
```

### `FlexRender`

セル/ヘッダー/フッターテンプレートを動的な値でレンダリングするためのAngular構造ディレクティブです。

FlexRenderは、Angularがサポートするあらゆるタイプのコンテンツをサポートします:

- 文字列、または`innerHTML`経由のHTML文字列
- [TemplateRef](https://angular.dev/api/core/TemplateRef)
- `FlexRenderComponent`でラップされた[Component](https://angular.dev/api/core/Component)

テーブルのセルをレンダリングするには、`cell.renderValue`や`cell.getValue` APIを使用できます。ただし、これらのAPIは生のセル値（アクセサ関数からの値）のみを出力します。`cell: () => any`カラム定義オプションを使用している場合、アダプターの`FlexRenderDirective`を使用する必要があります。

セルカラム定義は**リアクティブ**であり、**インジェクションコンテキスト**で実行されるため、サービスを注入したりシグナルを使用してレンダリングされるコンテンツを自動的に変更したりできます。

#### 例

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
          <!-- 単純な文字列をレンダリングする場合 -->
          {{ cell }}
          <!-- HTML文字列をレンダリングする場合 -->
          <div [innerHTML]="cell"></div>
        </ng-container>
      </td>
    }
  </tr>
}
</tbody>
```

#### コンポーネントのレンダリング

特定のカラムのヘッダー/セル/フッターにコンポーネントをレンダリングするには、`FlexRenderComponent`に`ComponentType`を渡し、入力、出力、カスタムインジェクターなどのパラメータを含めることができます。

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

  // セルクリックごとに発火する出力
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
            injector, // オプショナルなインジェクター
            inputs: {
              // `input.required()`を使用しているため必須の入力
              content: context.row.original.rowProperty,
              // cellType? - オプショナルな入力
            },
            outputs: {
              clickEvent: () => {
                // 何か処理を行う
              }
            }
          }
        )
      },
    },
  ]
}
```

内部的には、これは[ViewContainerRef#createComponent](https://angular.dev/api/core/ViewContainerRef#createComponent) APIを利用しています。そのため、カスタム入力は@Inputデコレータまたはinput/modelシグナルを使用して宣言する必要があります。

`FlexRenderDirective`に渡すpropsに基づいてコンテキスト値を返す`injectFlexRenderContext`関数を通じて、テーブルセルのコンテキストにアクセスできます。

```ts
@Component({
  // ...
})
class CustomCellComponent {
  // セルコンポーネントのコンテキスト
  readonly context = injectFlexRenderContext<CellContext<TData, TValue>>();
  // ヘッダー/フッターコンポーネントのコンテキスト
  readonly context = injectFlexRenderContext<HeaderContext<TData, TValue>>();
}
```

あるいは、コンポーネントタイプを対応するカラム定義に渡すことで、特定のカラムのヘッダー、セル、またはフッターにコンポーネントをレンダリングできます。これらのカラム定義は、`context`とともに`flexRender`ディレクティブに提供されます。

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

`flexRender`ディレクティブで提供される`context`のプロパティは、コンポーネントからアクセス可能です。コンポーネントが必要とするコンテキストプロパティを明示的に定義できます。この例では、flexRenderに提供されるコンテキストはHeaderContext型です。HeaderContextのプロパティである`table`、`column`、`header`のうち、`table`入力シグナルがコンポーネントで使用されるように定義されています。コンテキストプロパティのいずれかが必要な場合は、自由に使用してください。このアプローチを使用する場合、コンテキストプロパティへのアクセスを定義する際には、入力シグナルのみがサポートされていることに注意してください。

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

#### TemplateRefのレンダリング

特定のカラムのヘッダー/セル/フッターにTemplateRefをレンダリングするには、TemplateRefをカラム定義に渡します。

TemplateRefのデータには、flexRenderのpropsフィールドで渡された内容に基づいて値が設定される`$implicit`プロパティを介してアクセスできます。

ほとんどの場合、各TemplateRefは以下のようにセルタイプに基づいた`$implicit`コンテキストでレンダリングされます:

- ヘッダー: `HeaderContext<T, ?>`
- セル: `CellContext<T, ?>`,
- フッター: `HeaderContext<T, ?>`

```angular-html
<ng-container
  *flexRender="
              cell.column.columnDef.cell;
              props: cell.getContext();
              let cell
            "
>
  <!-- 単純な文字列をレンダリングする場合 -->
  {{ cell }}
  <!-- HTML文字列をレンダリングする場合 -->
  <div [innerHTML]="cell"></div>
</ng-container>

<ng-template #myCell let-context>
  <!-- contextを使用して何かをレンダリング -->
</ng-template>
```

完全な例:

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
                  props: cell.getContext(); // TemplateRefに渡されるデータ
                  let cell
                "
              >
                <!-- 単純な文字列をレンダリングする場合 -->
                {{ cell }}
                <!-- HTML文字列をレンダリングする場合 -->
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
