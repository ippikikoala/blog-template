# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

「いっぴきこあらの大冒険」- 鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ。

## ドキュメント

詳細な仕様は `docs/` フォルダを参照：

- [docs/00-overview.md](docs/00-overview.md) - 概要
- [docs/01-design.md](docs/01-design.md) - デザイン仕様（カラー、タイポグラフィ、レイアウト）
- [docs/02-components.md](docs/02-components.md) - コンポーネント設計
- [docs/03-content.md](docs/03-content.md) - コンテンツ仕様（MDXフロントマター）
- [docs/04-pages.md](docs/04-pages.md) - ページ構成
- [docs/05-infrastructure.md](docs/05-infrastructure.md) - インフラ・デプロイ
- [docs/06-config.md](docs/06-config.md) - サイト設定情報
- [docs/07-mobile-editing.md](docs/07-mobile-editing.md) - スマホ編集環境
- [docs/08-cloudflare-r2.md](docs/08-cloudflare-r2.md) - Cloudflare R2セットアップ
- [docs/09-migration-guide.md](docs/09-migration-guide.md) - はてなブログからの移行ガイド
- [docs/10-new-post-guide.md](docs/10-new-post-guide.md) - PC新規記事投稿ガイド

## コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run start    # 本番サーバー起動
npm run lint     # Lint
```

## ディレクトリ構成

```
content/posts/       # MDX記事
src/app/             # App Routerページ
src/components/      # UIコンポーネント
src/lib/posts.ts     # 記事読み込み処理
docs/                # 仕様書
```

## 記事の追加

`content/posts/` に `.mdx` ファイルを作成：

```yaml
---
title: "記事タイトル"
date: "2025-01-05"
description: "記事の説明"
category: "北海道"          # 都道府県
tags: ["温泉", "秘湯"]      # テーマタグ
image: "/images/xxx.jpg"   # オプション
---
```

## デザインルール

- ダークモードなし（常にライトテーマ）
- カラーはCSS変数で管理（globals.css参照）
- アクセントカラー: #4a8cb7

## 主要依存関係

- Next.js 16 (App Router)
- Tailwind CSS 4
- next-mdx-remote
- gray-matter
- @tailwindcss/typography
