---
source-updated-at: '2024-05-19T21:37:34.000Z'
translation-updated-at: '2025-05-05T19:23:57.032Z'
title: インストール
---
APIの詳細に入る前に、まずはセットアップをしましょう！

お気に入りのnpmパッケージマネージャーを使用して、テーブルアダプターを依存関係としてインストールします。

_以下のパッケージのうち、1つだけをインストールしてください:_

## React Table

```bash
npm install @tanstack/react-table
```

`@tanstack/react-table`パッケージは、React 16.8、React 17、React 18、およびReact 19で動作します。

> 注意: ReactアダプターはReact 19で動作しますが、React 19と同時にリリースされる新しいReactコンパイラでは動作しない可能性があります。これは今後のTanStack Tableのアップデートで修正される予定です。

## Vue Table

```bash
npm install @tanstack/vue-table
```

`@tanstack/vue-table`パッケージはVue 3で動作します。

## Solid Table

```bash
npm install @tanstack/solid-table
```

`@tanstack/solid-table`パッケージはSolid-JS 1で動作します。

## Svelte Table

```bash
npm install @tanstack/svelte-table
```

`@tanstack/svelte-table`パッケージはSvelte 3およびSvelte 4で動作します。

> 注意: 現時点ではSvelte 5用の組み込みアダプターはありませんが、`@tanstack/table-core`パッケージをインストールし、コミュニティ製のカスタムアダプターを使用することで、TanStack TableをSvelte 5で利用できます。この[PR](https://github.com/TanStack/table/pull/5403)を参考にしてください。

## Qwik Table

```bash
npm install @tanstack/qwik-table
```

`@tanstack/qwik-table`パッケージはQwik 1で動作します。

> 注意: 近い将来、Qwik 2をサポートするための「破壊的変更」を含むリリースが予定されています。これはマイナーバージョンアップとしてリリースされますが、ドキュメントに記載されます。Qwik 2自体には破壊的変更はありませんが、npmレジストリ上の名前が変更され、異なるピア依存関係が必要になります。

> 注意: 現在のqwikアダプターはCSR（クライアントサイドレンダリング）のみに対応しています。さらなる改善は今後のテーブルバージョンまで利用できない可能性があります。

## Angular Table

```bash
npm install @tanstack/angular-table
```

`@tanstack/angular-table`パッケージはAngular 17で動作します。Angularアダプターは新しいAngular Signal実装を使用しています。

## Lit Table

```bash
npm install @tanstack/lit-table
```

`@tanstack/lit-table`パッケージはLit 3で動作します。

## Table Core (フレームワーク不要)

```bash
npm install @tanstack/table-core
```

お気に入りのフレームワーク（またはフレームワークの特定バージョン）がリストにありませんか？`@tanstack/table-core`パッケージを使用して、独自のコードベースでアダプターを構築することもできます。通常、特定のフレームワーク向けに状態管理とレンダリングを処理するための薄いラッパーのみが必要です。他のすべてのアダプターの[ソースコード](https://github.com/TanStack/table/tree/main/packages)を参照して、その動作を確認してください。
