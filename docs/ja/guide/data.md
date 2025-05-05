---
source-updated-at: '2025-03-20T21:15:29.000Z'
translation-updated-at: '2025-05-05T19:25:22.255Z'
title: データ
---
## データガイド

テーブルはデータから始まります。列定義と行はデータの形状に依存します。TanStack TableにはTypeScriptの機能があり、タイプセーフな体験を提供しながらテーブルコードを作成するのに役立ちます。データと型を正しく設定すれば、TanStack Tableはデータの形状を推論し、列定義が正しく作成されるように強制できます。

### TypeScript

TanStack Tableパッケージを使用するためにTypeScriptは必須ではありません... ***しかし***、TanStack TableはTypeScriptの優れた体験をライブラリの主な売りの1つとして感じられるように書かれ、構成されています。TypeScriptを使用していない場合、開発時間を短縮し、コードのバグを減らす多くの優れたオートコンプリートや型チェック機能を逃すことになります。

#### TypeScriptジェネリクス

TypeScriptジェネリクスが何であり、どのように機能するかを基本的に理解していると、このガイドをよりよく理解するのに役立ちますが、進めながら簡単に習得できるはずです。公式の[TypeScriptジェネリクスドキュメント](https://www.typescriptlang.org/docs/handbook/2/generics.html)は、TypeScriptにまだ慣れていない人にとって役立つかもしれません。

### データ型の定義

`data`はテーブルの行に変換されるオブジェクトの配列です。配列内の各オブジェクトは（通常の状況では）データの行を表します。TypeScriptを使用している場合、通常はデータの形状に対して型を定義します。この型は、他のすべてのテーブル、列、行、セルインスタンスのジェネリック型として使用されます。このジェネリックは、TanStack Tableの型とAPI全体で通常`TData`と呼ばれます。

例えば、次のようなユーザーのリストを表示するテーブルがある場合:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "age": 33,
    "visits": 100,
    "progress": 50,
    "status": "Married"
  },
  {
    "firstName": "Kevin",
    "lastName": "Vandy",
    "age": 27,
    "visits": 200,
    "progress": 100,
    "status": "Single"
  }
]
```

次のようにUser（TData）型を定義できます:

```ts
//TData
type User = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: string
}
```

この型で`data`配列を定義すると、TanStack Tableは後で列、行、セルなどで多くの型をインテリジェントに推論できるようになります。これは`data`型が文字通り`TData`ジェネリック型として定義されているためです。`data`テーブルオプションに渡すものは、テーブルインスタンスの残りの部分の`TData`型になります。後で列定義を行う際に、`data`型と同じ`TData`型を使用するようにしてください。

```ts
//注: 無限再レンダリングを防ぐため、dataは「安定した」参照が必要
const data: User[] = []
//または
const [data, setData] = React.useState<User[]>([])
//または
const data = ref<User[]>([]) //vue
//など...
```

#### 深いキーを持つデータ

データがフラットなオブジェクトの配列でなくても問題ありません！列を定義する際に、アクセサーで深くネストされたデータにアクセスするための戦略があります。

`data`が次のような場合:

```json
[
  {
    "name": {
      "first": "Tanner",
      "last": "Linsley"
    },
    "info": {
      "age": 33,
      "visits": 100,
    }
  },
  {
    "name": {
      "first": "Kevin",
      "last": "Vandy"
    },
    "info": {
      "age": 27,
      "visits": 200,
    }
  }
]
```

次のように型を定義できます:

```ts
type User = {
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

そして、列定義で`accessorKey`のドット表記または`accessorFn`を使用してデータにアクセスできます。

```ts
const columns = [
  {
    header: 'First Name',
    accessorKey: 'name.first',
  },
  {
    header: 'Last Name',
    accessorKey: 'name.last',
  },
  {
    header: 'Age',
    accessorFn: row => row.info.age, 
  },
  //...
]
```

これについての詳細は[列定義ガイド](../guide/column-defs)で説明されています。

> 注: jsonデータの「キー」は通常何でも構いませんが、キーにピリオドが含まれている場合、深いキーとして解釈され、エラーが発生する可能性があります。

#### ネストされたサブ行データ

展開機能を使用している場合、データにネストされたサブ行があることが一般的です。これにより、少し異なる再帰型が生じます。

データが次のような場合:

```json
[
  {
    "firstName": "Tanner",
    "lastName": "Linsley",
    "subRows": [
      {
        "firstName": "Kevin",
        "lastName": "Vandy",
      },
      {
        "firstName": "John",
        "lastName": "Doe",
        "subRows": [
          //...
        ]
      }
    ]
  },
  {
    "firstName": "Jane",
    "lastName": "Doe",
  }
]
```

次のように型を定義できます:

```ts
type User = {
  firstName: string
  lastName: string
  subRows?: User[] //「subRows」という名前でなくてもよい、任意の名前を付けられる
}
```

ここで`subRows`は`User`オブジェクトのオプションの配列です。これについての詳細は[展開ガイド](../guide/expanding)で説明されています。

### データに「安定した」参照を与える

テーブルインスタンスに渡す`data`配列は、無限再レンダリング（特にReactで）を引き起こすバグを防ぐために***必ず***「安定した」参照を持っている必要があります。

これは使用するフレームワークアダプターによって異なりますが、Reactでは`React.useState`、`React.useMemo`、または類似の方法を使用して、`data`と`columns`テーブルオプションの両方が安定した参照を持つようにする必要があります。

```tsx
const fallbackData = []

export default function MyComponent() {
  //✅ 良い: `columns`は安定した参照なので、無限再レンダリングループを引き起こさない
  const columns = useMemo(() => [
    // ...
  ], []);

  //✅ 良い: `data`は安定した参照なので、無限再レンダリングループを引き起こさない
  const [data, setData] = useState(() => [
    // ...
  ]);

  // 列とデータは安定した参照で定義されているため、無限ループを引き起こさない！
  const table = useReactTable({
    columns,
    data ?? fallbackData, //コンポーネントの外で定義されたフォールバック配列を使用するのも良い（安定した参照）
  });

  return <table>...</table>;
}
```

`React.useState`と`React.useMemo`だけがデータに安定した参照を与える方法ではありません。コンポーネントの外でデータを定義したり、Redux、Zustand、TanStack Queryなどのサードパーティの状態管理ライブラリを使用することもできます。

主に避けるべきは、`useReactTable`呼び出しと同じスコープ内で`data`配列を定義することです。これにより、`data`配列が毎回のレンダリングで再定義され、無限再レンダリングループが発生します。

```tsx
export default function MyComponent() {
  //😵 悪い: `columns`が毎回のレンダリングで新しい配列として再定義されるため、無限再レンダリングループを引き起こす！
  const columns = [
    // ...
  ];

  //😵 悪い: `data`が毎回のレンダリングで新しい配列として再定義されるため、無限再レンダリングループを引き起こす！
  const data = [
    // ...
  ];

  //❌ 列とデータが安定した参照なしで`useReactTable`と同じスコープ内で定義されているため、無限ループを引き起こす！
  const table = useReactTable({
    columns,
    data ?? [], //❌ フォールバック配列が毎回のレンダリングで再作成されるため、これも悪い
  });

  return <table>...</table>;
}
```

### TanStack Tableがデータを変換する方法

これらのドキュメントの他の部分では、TanStack Tableがテーブルに渡した`data`を処理し、テーブルを作成するために使用される行とセルオブジェクトを生成する方法を見ていきます。テーブルに渡す`data`はTanStack Tableによって変更されることはありませんが、行とセルの実際の値は、列定義のアクセサーや[行モデル](../guide/row-models)によるグループ化や集計などの他の機能によって変換される場合があります。

### TanStack Tableが処理できるデータ量

信じられないかもしれませんが、TanStack Tableは実際にクライアント側で数十万行のデータを処理できるように構築されています。これは各列のデータのサイズや列数によって常に可能というわけではありませんが、ソート、フィルタリング、ページネーション、グループ化機能はすべて大規模なデータセットを考慮してパフォーマンスを意識して構築されています。

データグリッドを構築する開発者のデフォルトの考え方は、大規模なデータセットに対してサーバーサイドのページネーション、ソート、フィルタリングを実装することです。これはまだ通常良いアイデアですが、多くの開発者は現代のブラウザと適切な最適化があれば、実際にクライアント側で処理できるデータ量を過小評価しています。テーブルが数千行を超えることがない場合、サーバー側で自分で実装する代わりに、TanStack Tableのクライアント側機能を利用できる可能性があります。もちろん、TanStack Tableのクライアント側機能に大規模なデータセットを処理させる前に、実際のデータでテストして、ニーズに十分なパフォーマンスが得られるか確認する必要があります。

これについての詳細は[ページネーションガイド](../guide/pagination#should-you-use-client-side-pagination)で説明されています。
