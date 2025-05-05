---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:26:21.530Z'
title: カラム順序
---
## 例

実装に直接進みたいですか？以下の例を確認してください：

- [column-ordering](../framework/react/examples/column-ordering)
- [column-dnd](../framework/react/examples/column-dnd)

## API

[Column Ordering API](../api/features/column-ordering)

## カラム順序ガイド

デフォルトでは、カラムは`columns`配列で定義された順序で並びます。ただし、`columnOrder`ステートを使用してカラムの順序を手動で指定できます。カラムピン留めやグループ化などの他の機能もカラムの順序に影響を与えることがあります。

### カラム順序に影響する要素

カラムの順序を変更する可能性があるテーブル機能は3つあり、以下の順序で適用されます：

1. [カラムピン留め](../guide/column-pinning) - ピン留めが有効な場合、カラムは左、中央（ピン留めされていない）、右ピン留めカラムに分割されます。
2. 手動による**カラム順序指定** - 手動で指定されたカラム順序が適用されます。
3. [グループ化](../guide/grouping) - グループ化が有効で、グループ化ステートがアクティブかつ`tableOptions.groupedColumnMode`が`'reorder' | 'remove'`に設定されている場合、グループ化されたカラムがカラムフローの先頭に並べ替えられます。

> **注意:** `columnOrder`ステートは、カラムピン留めと併用する場合、ピン留めされていないカラムにのみ影響します。

### カラム順序ステート

`columnOrder`ステートを指定しない場合、TanStack Tableは`columns`配列のカラム順序を使用します。ただし、`columnOrder`ステートにカラムIDの配列を指定することで、カラムの順序を指定できます。

#### デフォルトのカラム順序

初期のカラム順序を指定するだけでよい場合は、`initialState`テーブルオプションで`columnOrder`ステートを指定できます。

```jsx
const table = useReactTable({
  //...
  initialState: {
    columnOrder: ['columnId1', 'columnId2', 'columnId3'],
  }
  //...
});
```

> **注意:** `state`テーブルオプションで`columnOrder`ステートも指定している場合、`initialState`は効果がありません。特定のステートは`initialState`または`state`のいずれかで指定してください。両方で指定しないでください。

#### カラム順序ステートの管理

カラム順序を動的に変更する必要がある場合、またはテーブル初期化後にカラム順序を設定する必要がある場合は、他のテーブルステートと同様に`columnOrder`ステートを管理できます。

```jsx
const [columnOrder, setColumnOrder] = useState<string[]>(['columnId1', 'columnId2', 'columnId3']); //オプションでカラム順序を初期化
//...
const table = useReactTable({
  //...
  state: {
    columnOrder,
    //...
  }
  onColumnOrderChange: setColumnOrder,
  //...
});
```

### カラムの並べ替え

ユーザーがカラムを並べ替えることができるUIをテーブルに実装する場合、ロジックは次のように設定できます：

```tsx
const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(c => c.id));

//使用するDnDソリューションによっては、このようなステートが必要ない場合もあります
const [movingColumnId, setMovingColumnId] = useState<string | null>(null);
const [targetColumnId, setTargetColumnId] = useState<string | null>(null);

//columnOrder配列をスプライスして並べ替えるユーティリティ関数
const reorderColumn = <TData extends RowData>(
  movingColumnId: Column<TData>,
  targetColumnId: Column<TData>,
): string[] => {
  const newColumnOrder = [...columnOrder];
  newColumnOrder.splice(
    newColumnOrder.indexOf(targetColumnId),
    0,
    newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0],
  );
  setColumnOrder(newColumnOrder);
};

const handleDragEnd = (e: DragEvent) => {
  if(!movingColumnId || !targetColumnId) return;
  setColumnOrder(reorderColumn(movingColumnId, targetColumnId));
};

//任意のDnDソリューションを使用
```

#### ドラッグアンドドロップによるカラム並べ替えの提案（React）

TanStack Tableと一緒にドラッグアンドドロップ機能を実装する方法は数多くあります。以下は、問題を避けるためのいくつかの提案です：

1. React 18以降を使用している場合、[`"react-dnd"`](https://react-dnd.github.io/react-dnd/docs/overview)を使用**しないでください**。React DnDはその時代において重要なライブラリでしたが、現在はあまり更新されておらず、特にReact Strict ModeではReact 18との互換性に問題があります。動作させることは可能ですが、より互換性が高く、活発にメンテナンスされている新しい代替手段があります。React DnDのProviderは、アプリ内で試す他のDnDソリューションと競合する可能性もあります。

2. [`"@dnd-kit/core"`](https://dndkit.com/)を使用してください。DnD Kitはモダンでモジュール化された軽量なドラッグアンドドロップライブラリで、現代のReactエコシステムと高い互換性があり、セマンティックな`<table>`マークアップとよく連携します。公式のTanStack DnD例である[Column DnD](../framework/react/examples/column-dnd)と[Row DnD](../framework/react/examples/row-dnd)は、どちらも現在DnD Kitを使用しています。

3. [`"react-beautiful-dnd"`](https://github.com/atlassian/react-beautiful-dnd)などの他のDnDライブラリも検討できますが、バンドルサイズの大きさ、メンテナンス状況、`<table>`マークアップとの互換性に注意してください。

4. 軽量なドラッグアンドドロップ機能を実装するために、ネイティブのブラウザイベントとステート管理を使用することを検討してください。ただし、このアプローチは、適切なタッチイベントを実装しない限り、モバイルユーザーにとって最適ではない可能性があることに注意してください。[Material React Table V2](https://www.material-react-table.com/docs/examples/column-ordering)は、`onDragStart`、`onDragEnd`、`onDragEnter`などのブラウザのドラッグアンドドロップイベントのみを使用してTanStack Tableを実装したライブラリの例です。ソースコードを参照して実装方法を確認してください。
