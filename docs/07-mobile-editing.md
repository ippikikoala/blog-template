# スマホ編集環境

## 概要

iPhone（スマホ）からの記事編集を可能にする環境を構築する。

### 利用想定
- **頻度**: たまに使う（外出先での修正・追記）
- **用途**:
  - 新規記事作成
  - 既存記事の修正・追加
  - 下書き保存（後でPC清書）
  - 画像アップロード
- **Gitスキル**: 初心者（概念は知っている）

---

## 採用構成

**GitHub Mobile + Cloudflare R2（画像）**

### 理由
- ✅ 完全無料
- ✅ アプリインストールだけで完結
- ✅ Gitの複雑な操作不要
- ✅ すぐに始められる

---

## セットアップ手順

### 1. GitHubアカウント作成（まだの場合）

1. https://github.com にアクセス
2. Sign up
3. メールアドレス、パスワード設定
4. 認証完了

### 2. リポジトリのGitHub連携

```bash
# ローカルでGitリポジトリ初期化（未実施の場合）
cd /Users/ippiki_koala/Desktop/Claude/blog
git init
git add .
git commit -m "Initial commit"

# GitHubにリポジトリ作成（Web UIで）
# リポジトリ名: blog（または任意）
# Public/Private: Private推奨

# リモート追加してpush
git remote add origin https://github.com/ippiki_koala/blog.git
git branch -M main
git push -u origin main
```

### 3. GitHub Mobileアプリインストール

**App Store**から「GitHub」をインストール

### 4. Cloudflare R2セットアップ（画像用）

別途 [08-cloudflare-r2.md](./08-cloudflare-r2.md) を参照

---

## スマホでの編集フロー

### パターン1: 新規記事作成

1. **GitHub Mobileアプリを開く**
2. **リポジトリ選択**: `blog`
3. **ファイル移動**: `content/posts/` に移動
4. **新規ファイル作成**: 右上の「+」→ Create new file
5. **ファイル名入力**: `2025-01-15-new-post.mdx`
6. **内容入力**:
```yaml
---
title: "新しい記事タイトル"
date: "2025-01-15"
description: "記事の説明"
category: "北海道"
tags: ["温泉", "旅行記"]
image: ""
---

## 見出し

本文をここに書く...
```
7. **Commit**: 下部の「Commit changes」
8. **Commit message**: "Add new post: タイトル"
9. **Commit直接**: "Commit to main"
10. **完了**: Vercelが自動デプロイ（約1分）

### パターン2: 既存記事の修正

1. **GitHub Mobileアプリを開く**
2. **リポジトリ選択**: `blog`
3. **ファイル選択**: `content/posts/記事ファイル.mdx`
4. **編集アイコン**: 右上のペンアイコンをタップ
5. **内容修正**: テキストを編集
6. **Commit**: 下部の「Commit changes」
7. **Commit message**: "Fix typo" など
8. **完了**: 自動デプロイ

### パターン3: 下書き保存

1. **新規記事作成**（パターン1と同じ）
2. **フロントマター**に `draft: true` を追加:
```yaml
---
title: "下書き記事"
date: "2025-01-15"
description: "下書き"
draft: true
---
```
3. **Commit**
4. **後でPCで清書**: `draft: true` を削除

---

## 画像アップロード（スマホ）

### 方法1: GitHub経由（簡易）

1. **GitHub Mobileアプリ**
2. **public/images/posts/** に移動
3. **Upload files**
4. **写真選択**: カメラロールから選択
5. **Commit**
6. **記事に画像パス記載**:
```markdown
![説明](/images/posts/image.jpg)
```

**制限事項**:
- ファイルサイズ: 25MB以下
- 大量アップロードには不向き

### 方法2: Cloudflare R2経由（推奨）

→ [08-cloudflare-r2.md](./08-cloudflare-r2.md) を参照

---

## Git操作の基礎（初心者向け）

### GitHub Mobileで必要な操作

| 操作 | 説明 | 実際の画面 |
|------|------|-----------|
| **Commit** | 変更を保存 | "Commit changes"ボタン |
| **Commit message** | 変更内容のメモ | "Fix typo"など短文でOK |
| **Branch** | 作業の枝分かれ | 基本は"main"で直接編集 |
| **Pull Request** | 変更提案 | 今回は使わない |

### Commit messageの書き方

```
良い例:
- "Add new post: 北海道温泉巡り"
- "Fix typo in about page"
- "Update image in hokkaido post"

悪い例:
- "update"（何を更新したか不明）
- "test"（テストは別ブランチで）
- ""（空白）
```

### トラブル時の対処

#### 1. Commitに失敗する
- **原因**: ネットワークエラー
- **対処**: 再度Commitボタンを押す

#### 2. ファイルが見つからない
- **原因**: ディレクトリ間違い
- **対処**: `content/posts/` にいることを確認

#### 3. デプロイされない
- **原因**: ビルドエラー
- **対処**: Vercelダッシュボードでエラー確認

---

## ベストプラクティス

### 1. こまめにCommit
- 1つの修正ごとにCommit
- 大きな変更は複数に分割

### 2. Commit messageは日本語でOK
```
○ "温泉記事の誤字修正"
○ "新記事追加: 青森の廃線跡"
× "update"
```

### 3. 画像は圧縮してからアップロード
- iPhoneの「写真」アプリで「サイズ調整」
- または後でPCで圧縮

### 4. 下書きは `draft: true` を活用
- 公開前に内容確認
- PCで最終チェック

---

## 制限事項

### GitHub Mobileでできないこと
- ❌ 複数ファイルの同時編集
- ❌ フォルダの一括操作
- ❌ 高度なGit操作（rebase, cherry-pickなど）
- ❌ 画像プレビュー（アップロード前）

### 推奨される使い方
- ✅ 1ファイルずつ編集
- ✅ 短文の追記・修正
- ✅ 新規記事の下書き
- ✅ 誤字脱字の修正

**複雑な作業はPCで行う**

---

## 将来の拡張オプション

### より快適な編集体験が必要になった場合

#### オプション1: Working Copy + iA Writer
- **コスト**: 約5,000円（買い切り）
- **メリット**: オフライン編集、Markdown専用エディタ
- **移行難易度**: 低（同じGitリポジトリ）

#### オプション2: Netlify CMS追加
- **コスト**: 無料
- **メリット**: Web管理画面
- **移行難易度**: 中（設定ファイル追加が必要）

#### オプション3: Notion連携
- **コスト**: 無料〜
- **メリット**: Notionで記事作成
- **移行難易度**: 高（API実装が必要）

---

## 参考リンク

- [GitHub Mobile公式ガイド](https://github.com/mobile)
- [Markdown記法チートシート](https://www.markdownguide.org/cheat-sheet/)
- [Gitの基礎](https://git-scm.com/book/ja/v2)
