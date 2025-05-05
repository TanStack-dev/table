---
source-updated-at: '2024-05-12T19:19:51.000Z'
translation-updated-at: '2025-05-05T19:24:27.877Z'
title: 概要
---
# 概要

TanStack Tableのコアは**フレームワーク非依存 (framework agnostic)** であり、使用するフレームワークに関係なくAPIは同じです。各フレームワークに対応するアダプターが提供されており、テーブルコアを簡単に扱えるようになっています。利用可能なアダプターについては、Adaptersメニューを参照してください。

## TypeScript

TanStack Tableは[TypeScript](https://www.typescriptlang.org/)で書かれていますが、アプリケーションでTypeScriptを使用することはオプションです（ただし、コードベースと開発者双方に優れた利点をもたらすため、使用を推奨します）。

TypeScriptを使用する場合、すべてのテーブルAPIと状態に対して最高レベルの型安全性とエディタのオートコンプリート機能が得られます。

## ヘッドレス (Headless)

[イントロダクション](../introduction)セクションで詳しく説明されているように、TanStack Tableは**ヘッドレス (headless)** です。つまり、DOM要素をレンダリングせず、代わりにUI/UX開発者であるあなたがテーブルのマークアップとスタイルを提供する必要があります。これは、React、Vue、Solid、Svelte、Qwik、AngularなどのUIフレームワークや、React NativeのようなJS-to-ネイティブプラットフォームでも使用できるテーブルを構築する優れた方法です。

## 非依存性 (Agnostic)

TanStack TableはヘッドレスでバニラJavaScriptコア上で動作するため、次の点で非依存性を持っています：

1. **フレームワーク非依存 (Framework Agnostic)** - 任意のJavaScriptフレームワーク（またはライブラリ）で使用できます。TanStack TableはReact、Vue、Solid、Svelte、Qwik向けのすぐに使えるアダプターを提供していますが、必要に応じて独自のアダプターを作成することも可能です。
2. **CSS/コンポーネントライブラリ非依存 (CSS / Component Library Agnostic)** - 任意のCSS戦略やコンポーネントライブラリと一緒にTanStack Tableを使用できます。TanStack Table自体はテーブルのマークアップやスタイルをレンダリングしません。あなた自身でそれらを用意します！TailwindやShadCNを使いたいですか？問題ありません！Material UIやBootstrapを使いたいですか？問題ありません！独自のデザインシステムを持っていますか？TanStack Tableはあなたのために作られています！

## コアオブジェクトと型

テーブルコアでは、アダプターによって一般的に公開される以下の抽象化が使用されます：

- [データ (Data)](../guide/data) - テーブルに提供するコアデータ配列
- [カラム定義 (Column Defs)](../guide/column-defs): カラムとそのデータモデル、表示テンプレートなどを設定するためのオブジェクト
- [テーブルインスタンス (Table Instance)](../guide/tables): 状態とAPIを含むコアテーブルオブジェクト
- [行モデル (Row Models)](../guide/row-models): 使用する機能に応じて`data`配列が有用な行に変換される方法
- [行 (Rows)](../guide/rows): 各行は対応する行データを反映し、行固有のAPIを提供
- [セル (Cells)](../guide/cells): 各セルは対応する行-列の交差点を反映し、セル固有のAPIを提供
- [ヘッダーグループ (Header Groups)](../guide/header-groups): ヘッダーグループはネストされたヘッダーレベルの計算されたスライスで、各グループにはヘッダーのグループが含まれる
- [ヘッダー (Headers)](../guide/headers): 各ヘッダーはカラム定義に直接関連付けられているか、そこから派生し、ヘッダー固有のAPIを提供
- [カラム (Columns)](../guide/columns): 各カラムは対応するカラム定義を反映し、カラム固有のAPIも提供

## 機能

TanStack Tableを使えば、想像できるほぼあらゆるタイプのテーブルを構築できます。以下の機能に対して組み込みの状態とAPIが用意されています：

- [カラムファセット (Column Faceting)](../guide/column-faceting) - カラム値の一意なリストやカラムの最小/最大値をリスト表示
- [カラムフィルタリング (Column Filtering)](../guide/column-filtering) - カラムの検索値に基づいて行をフィルタリング
- [カラムグループ化 (Column Grouping)](../guide/grouping) - カラムをグループ化し、集計などを実行
- [カラム順序変更 (Column Ordering)](../guide/column-ordering) - カラムの順序を動的に変更
- [カラム固定 (Column Pinning)](../guide/column-pinning) - カラムをテーブルの左または右に固定（フリーズ）
- [カラムサイズ変更 (Column Sizing)](../guide/column-sizing) - カラムのサイズを動的に変更（カラムリサイズハンドル）
- [カラム表示/非表示 (Column Visibility)](../guide/column-visibility) - カラムを表示/非表示
- [グローバルファセット (Global Faceting)](../guide/global-faceting) - テーブル全体のカラム値の一意なリストや最小/最大値をリスト表示
- [グローバルフィルタリング (Global Filtering)](../guide/global-filtering) - テーブル全体の検索値に基づいて行をフィルタリング
- [行展開 (Row Expanding)](../guide/expanding) - 行を展開/折りたたみ（サブ行）
- [行ページネーション (Row Pagination)](../guide/pagination) - 行をページ分割
- [行固定 (Row Pinning)](../guide/row-pinning) - 行をテーブルの上部または下部に固定（フリーズ）
- [行選択 (Row Selection)](../guide/row-selection) - 行を選択/選択解除（チェックボックス）
- [行ソート (Row Sorting)](../guide/sorting) - カラム値で行をソート

これらはTanStack Tableで構築できる機能の一部にすぎません。組み込み機能と併用して追加できる多くの機能が存在します。

[仮想化 (Virtualization)](../guide/virtualization)は、TanStack Tableに組み込まれていない機能の一例ですが、[TanStack Virtual](https://tanstack.com/virtual/v3)のような別のライブラリを使用し、他のテーブルレンダリングロジックと一緒に追加することで実現できます。

TanStack Tableはまた、[カスタム機能 (Custom Features)](../guide/custom-features)（プラグイン）をサポートしており、テーブルインスタンスを変更して、より統合された方法で独自のカスタムロジックをテーブルに追加できます。

もちろん、テーブルに必要な他の機能を追加するために、独自の状態やフックを書くこともできます。TanStack Tableコアの機能は、パフォーマンスと開発者体験 (DX) に重点を置いた、構築のための強固な基盤にすぎません。
