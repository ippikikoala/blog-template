# ブログ仕様書 - 概要

## プロジェクト名
いっぴきこあらの大冒険

## 概要
鄙びた集落・旅館・廃線・温泉を巡る旅行記ブログ。写真を主体としたコンテンツ。

## 参考サイト
- 移行元: https://ippikikoala.hatenablog.com/
- デザイン参考: https://tamaism.com/

## 技術スタック
| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS 4 |
| コンテンツ | MDX |
| ホスティング | Vercel |
| 画像 | Cloudflare R2 |
| スマホ編集 | GitHub Mobile |

## ドキュメント構成
- [00-overview.md](./00-overview.md) - 概要（このファイル）
- [01-design.md](./01-design.md) - デザイン仕様
- [02-components.md](./02-components.md) - コンポーネント設計
- [03-content.md](./03-content.md) - コンテンツ仕様
- [04-pages.md](./04-pages.md) - ページ構成
- [05-infrastructure.md](./05-infrastructure.md) - インフラ・デプロイ
- [06-config.md](./06-config.md) - サイト設定情報
- [07-mobile-editing.md](./07-mobile-editing.md) - スマホ編集環境
- [08-cloudflare-r2.md](./08-cloudflare-r2.md) - Cloudflare R2セットアップ
- [09-migration-guide.md](./09-migration-guide.md) - はてなブログからの移行ガイド
- [10-category-hierarchy.md](./10-category-hierarchy.md) - カテゴリ階層構造仕様

## 実装状況

### Phase 1: 基盤構築 ✅ 完了
- [x] Next.jsプロジェクトセットアップ
- [x] デザインシステム（カラー、タイポグラフィ）
- [x] 2カラムレイアウト（ヘッダー、サイドバー、フッター）
- [x] カード型記事一覧ページ
- [x] 記事詳細ページ（目次自動生成）
- [x] 画像Lightbox機能
- [x] カテゴリ・タグ機能
- [x] RSS/OGP対応
- [x] ページネーション

### Phase 2: Cloudflare R2セットアップ ✅ 完了
- [x] Cloudflareアカウント作成
- [x] R2バケット作成（ippikikoala-blog）
- [x] 公開URL設定（pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev）
- [x] Next.js Image設定（next.config.ts）
- [x] 画像アップロード完了（3,238枚）

### Phase 3: GitHub連携 ✅ 完了
- [x] GitHubリポジトリ作成（ippikikoala/blog-template）
- [x] ローカルリポジトリ連携
- [x] SSH鍵設定
- [x] 画像ファイルを.gitignoreに追加（リポジトリ軽量化）

### Phase 4: コンテンツ移行 ✅ 完了（2026年1月7日）
- [x] はてなブログからエクスポート
- [x] 画像ダウンロード（3,238枚）
- [x] 画像をR2にアップロード
- [x] MDX形式へ変換（139記事）
- [x] 全記事の動作確認

### Phase 5: 本番公開 ✅ 完了（2026年1月8日）
- [x] GitHubにプッシュ
- [x] Vercelデプロイ（自動デプロイ有効）
- [x] サイト動作確認
- [x] 独自ドメイン取得・設定（ippikikoala.com）
- [ ] Vercel Analytics有効化（オプション）
- [ ] はてなブログからの誘導設定（オプション）

### Phase 6: カテゴリ階層化 ✅ 完了（2026年1月10日）
- [x] 設定ファイルベースのカテゴリ管理（src/config/categories.ts）
- [x] 地方別階層表示（8地方区分）
- [x] 複数カテゴリ対応（配列形式サポート）
- [x] サイドバーUI更新（地方ごとにグループ化）
- [x] 重複カウント機能
- [x] ドキュメント作成（10-category-hierarchy.md）

---

## 本番環境情報

| 項目 | URL/情報 |
|------|----------|
| **本番サイト** | https://ippikikoala.com |
| **Vercel URL** | https://ippikikoala-blog.vercel.app |
| **GitHubリポジトリ** | https://github.com/ippikikoala/blog-template |
| **画像ホスティング** | https://pub-521ec77a6aeb44b18091baa73887e9b7.r2.dev |
| **ドメイン** | ippikikoala.com（お名前.com） |
| **記事数** | 139記事 |
| **画像数** | 3,238枚 |

---

## 次に必要なアクション（オプション）

### 優先度：中

1. **Vercel Analytics有効化**
   - Vercelダッシュボードで有効化

2. **はてなブログからの誘導設定**
   - 旧ブログにリダイレクト案内を追加
