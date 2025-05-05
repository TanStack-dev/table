---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:18.204Z'
title: カラム固定
---
## 実装例

実装に直接進みたい場合は、以下の例を参照してください:

- [column-pinning](../framework/react/examples/column-pinning)
- [sticky-column-pinning](../framework/react/examples/column-pinning-sticky)

### その他の例
 
- [Svelte column-pinning](../framework/svelte/examples/column-pinning)
- [Vue column-pinning](../framework/vue/examples/column-pinning)

## API

[カラムピン固定 API](../api/features/column-pinning)

## カラムピン固定ガイド

TanStack Tableは、テーブルUIでカラムピン固定機能を実装するのに役立つ状態とAPIを提供します。カラムピン固定は複数の方法で実装できます。ピン固定されたカラムを別々のテーブルに分割するか、すべてのカラムを同じテーブルに保持しつつ、ピン固定状態を使用してカラムを正しく並べ替え、sticky CSSを使用してカラムを左または右に固定することができます。

### カラムピン固定がカラム順序に与える影響

カラムの順序を変更する可能性があるテーブル機能は3つあり、以下の順序で実行されます:

1. **カラムピン固定** - ピン固定が有効な場合、カラムは左、中央（ピン固定なし）、右のピン固定カラムに分割されます。
2. 手動[カラム順序設定](../guide/column-ordering) - 手動で指定されたカラム順序が適用されます。
3. [グループ化](../guide/grouping) - グループ化が有効で、グループ化状態がアクティブかつ`tableOptions.groupedColumnMode`が`'reorder' | 'remove'`に設定されている場合、グループ化されたカラムはカラムフローの先頭に再配置されます。

ピン固定されたカラムの順序を変更する唯一の方法は、`columnPinning.left`および`columnPinning.right`状態自体です。`columnOrder`状態はピン固定されていない（「中央」の）カラムの順序にのみ影響します。

### カラムピン固定状態

`columnPinning`状態の管理はオプションであり、通常は永続的な状態機能を追加しない限り必要ありません。TanStack Tableはすでにカラムピン固定状態を追跡しています。必要に応じて、他のテーブル状態と同様に`columnPinning`状態を管理します。

```jsx
const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
  left: [],
  right: [],
});
//...
const table = useReactTable({
  //...
  state: {
    columnPinning,
    //...
  }
  onColumnPinningChange: setColumnPinning,
  //...
});
```

### デフォルトでカラムをピン固定する

非常に一般的なユースケースは、いくつかのカラムをデフォルトでピン固定することです。これは、`columnPinning`状態をピン固定するcolumnIdsで初期化するか、`initialState`テーブルオプションを使用して行うことができます。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnPinning: {
      left: ['expand-column'],
      right: ['actions-column'],
    },
    //...
  }
  //...
});
```

### 便利なカラムピン固定API

> 注: これらのAPIの一部はv8.12.0で新しく追加されました

カラムピン固定機能を実装するのに役立つ便利なカラムAPIメソッドがいくつかあります:

- [`column.getCanPin`](../api/features/column-pinning#getcanpin): カラムをピン固定できるかどうかを判断するために使用します。
- [`column.pin`](../api/features/column-pinning#pin): カラムを左または右にピン固定するために使用します。または、カラムのピン固定を解除するために使用します。
- [`column.getIsPinned`](../api/features/column-pinning#getispinned): カラムがどこにピン固定されているかを判断するために使用します。
- [`column.getStart`](../api/features/column-pinning#getstart): ピン固定されたカラムに正しい`left` CSS値を提供するために使用します。
- [`column.getAfter`](../api/features/column-pinning#getafter): ピン固定されたカラムに正しい`right` CSS値を提供するために使用します。
- [`column.getIsLastColumn`](../api/features/column-pinning#getislastcolumn): カラムがピン固定グループの最後のカラムかどうかを判断するために使用します。box-shadowを追加するのに便利です。
- [`column.getIsFirstColumn`](../api/features/column-pinning#getisfirstcolumn): カラムがピン固定グループの最初のカラムかどうかを判断するために使用します。box-shadowを追加するのに便利です。

### テーブル分割によるカラムピン固定

sticky CSSを使用してカラムをピン固定するだけの場合、ほとんどの場合、`table.getHeaderGroups`および`row.getVisibleCells`メソッドを使用して通常通りテーブルをレンダリングできます。

ただし、ピン固定されたカラムを別々のテーブルに分割する場合は、`table.getLeftHeaderGroups`、`table.getCenterHeaderGroups`、`table.getRightHeaderGroups`、`row.getLeftVisibleCells`、`row.getCenterVisibleCells`、および`row.getRightVisibleCells`メソッドを使用して、現在のテーブルに関連するカラムのみをレンダリングできます。
