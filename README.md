# いっぴきこあらの大冒険

鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ

## 本番環境

| 項目 | URL |
|------|-----|
| **サイト** | https://ippikikoala-blog.vercel.app |
| **リポジトリ** | https://github.com/ippikikoala/blog-template |
| **画像** | Cloudflare R2 |

## ドキュメント

詳細な仕様は `docs/` フォルダを参照：

- [概要](docs/00-overview.md) - プロジェクト概要・技術スタック・実装状況
- [デザイン仕様](docs/01-design.md) - カラー・タイポグラフィ・レイアウト
- [コンポーネント設計](docs/02-components.md) - 各コンポーネントの仕様
- [コンテンツ仕様](docs/03-content.md) - MDXフロントマター・カテゴリ/タグ
- [ページ構成](docs/04-pages.md) - ルーティング・ページ仕様
- [インフラ](docs/05-infrastructure.md) - Vercel・R2設定
- [サイト設定](docs/06-config.md) - プロフィール・SNS・ナビゲーション
- [スマホ編集](docs/07-mobile-editing.md) - GitHub Mobileでの編集方法
- [Cloudflare R2](docs/08-cloudflare-r2.md) - 画像ホスティング設定
- [移行ガイド](docs/09-migration-guide.md) - はてなブログからの移行手順
- [カテゴリ階層](docs/10-category-hierarchy.md) - カテゴリ階層構造・複数カテゴリ対応

## 開発環境

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run start    # 本番サーバー起動
npm run lint     # Lint
```

開発サーバー起動後、http://localhost:3000 でアクセス

## 技術スタック

- **フレームワーク**: Next.js 16 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS 4
- **コンテンツ**: MDX
- **ホスティング**: Vercel
- **画像**: Cloudflare R2
- **スマホ編集**: GitHub Mobile

## 記事の追加

`content/posts/` に MDX ファイルを作成：

```yaml
---
title: "記事タイトル"
date: "2025-01-05"
description: "記事の説明"
category: "北海道"              # 単一カテゴリ
# category: ["熊本県", "宮崎県"] # 複数カテゴリも可能
tags: ["温泉", "秘湯"]
image: "/images/xxx.jpg"
---

## 見出し

本文...

## iframe埋め込み

YouTube動画やGoogle Mapsを埋め込む場合：

<YouTube id="動画ID" title="動画タイトル" />

<GoogleMap
  src="https://www.google.com/maps/embed?pb=..."
  title="場所名"
/>
```

## プロジェクト構成

```
content/posts/            # MDX記事
src/app/                  # App Routerページ
src/components/           # UIコンポーネント
  └── embeds/             # iframe埋め込みコンポーネント
      ├── YouTube.tsx     # YouTube埋め込み
      └── GoogleMap.tsx   # Google Maps埋め込み
src/config/               # 設定ファイル
  └── categories.ts       # カテゴリ階層構造定義
src/lib/
  ├── posts.ts            # 記事読み込み処理
  └── categoryUtils.ts    # カテゴリユーティリティ
scripts/                  # ユーティリティスクリプト
  ├── extract_iframes.py        # iframe情報抽出
  ├── update_mdx_iframes.py     # 更新ガイド生成
  └── auto_update_iframes.py    # Google Maps自動更新
docs/                     # 仕様書
```

## ユーティリティスクリプト

### iframe埋め込み関連

```bash
# iframe情報をはてなブログエクスポートから抽出
python3 scripts/extract_iframes.py

# 更新ガイド生成
python3 scripts/update_mdx_iframes.py

# Google Mapsを自動更新（ドライラン）
python3 scripts/auto_update_iframes.py --dry-run

# Google Mapsを自動更新（実行）
python3 scripts/auto_update_iframes.py
```

## ライセンス

© 2026 いっぴきこあらの大冒険. All rights reserved.
