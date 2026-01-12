# AWS移行ガイド

ブログをVercelからAWSに移行するための手順書です。

> [!NOTE]
> このガイドは将来的な移行に備えた計画書です。現在VercelとCloudflare R2の無料枠内で運用できている場合、急いで移行する必要はありません。

---

## 目次

1. [現在の構成](#現在の構成)
2. [移行後の構成](#移行後の構成)
3. [コスト比較](#コスト比較)
4. [移行手順](#移行手順)
5. [移行前チェックリスト](#移行前チェックリスト)
6. [ロールバック手順](#ロールバック手順)

---

## 現在の構成

| コンポーネント | サービス | 備考 |
|--------------|---------|------|
| ホスティング | Vercel | Next.js App Router |
| 画像ストレージ | Cloudflare R2 | 無料枠 |
| ドメイン | お名前.com | Vercel DNSを使用 |
| リポジトリ | GitHub | push時に自動デプロイ |
| アナリティクス | Vercel Analytics | @vercel/analytics |

---

## 移行後の構成

| コンポーネント | サービス | 理由 |
|--------------|---------|-----|
| ホスティング | **AWS Amplify** | Vercelに似た使い勝手、Next.jsサポート、無料枠あり |
| 画像ストレージ | **Amazon S3** | CloudFrontと連携可能、無料枠あり |
| CDN | **Amazon CloudFront** | S3の画像配信高速化（オプション） |
| ドメイン | お名前.com（継続）| AWS Route 53は有料のため |
| DNS | AWS Amplify | Amplifyが自動設定 |

### なぜAWS Amplifyを推奨するか

1. **簡単**: Vercelと同様にGitHub連携で自動デプロイ
2. **安い**: 無料枠が充実（月1000ビルド分、15GB転送量など）
3. **Next.js対応**: App Routerを含むNext.jsをフルサポート
4. **初心者向け**: コンソールからGUIで設定可能

> [!WARNING]
> AWS Amplifyは**SSR（サーバーサイドレンダリング）**をサポートしていますが、一部のNext.js機能に制限があります。現在のブログは静的生成（SSG）が中心のため問題ありませんが、将来的に動的機能を追加する場合は確認が必要です。

---

## コスト比較

### 無料枠の比較

| サービス | Vercel無料枠 | AWS Amplify無料枠 |
|---------|-------------|------------------|
| ビルド | 6000分/月 | 1000分/月 |
| 帯域幅 | 100GB/月 | 15GB/月（12ヶ月） |
| 同時ビルド | 1 | 1 |
| カスタムドメイン | ✅ | ✅ |

| サービス | Cloudflare R2無料枠 | Amazon S3無料枠 |
|---------|---------------------|-----------------|
| ストレージ | 10GB | 5GB（12ヶ月） |
| 読み取りリクエスト | 1000万/月 | 20,000/月（12ヶ月） |
| 書き込みリクエスト | 100万/月 | 2,000/月（12ヶ月） |

### 有料になった場合の月額目安

| 構成 | 概算月額 |
|-----|---------|
| Vercel Pro | $20/月〜 |
| AWS Amplify + S3 | $1〜5/月程度（小規模ブログの場合） |

> [!IMPORTANT]
> AWS無料枠は**アカウント作成から12ヶ月間**の期限付きです。12ヶ月経過後は従量課金になりますが、小規模ブログであれば月額数ドル程度です。

---

## 移行手順

### Phase 1: AWSアカウント準備（所要時間: 30分）

#### Step 1-1: AWSアカウント作成

1. [AWS公式サイト](https://aws.amazon.com/jp/)にアクセス
2. 「無料アカウントを作成」をクリック
3. 必要情報を入力（クレジットカード登録が必要）
4. 本人確認を完了

> [!CAUTION]
> AWSは従量課金制です。予期せぬ課金を防ぐため、以下を設定してください：
> - **請求アラート**: 月額$5を超えたら通知
> - **ルートユーザーMFA**: セキュリティのため必須

#### Step 1-2: 請求アラートの設定

1. AWS Console → 右上のアカウント名 → 「Billing and Cost Management」
2. 左メニュー「Budgets」→「Create budget」
3. 「Cost budget」を選択
4. 月額$5でアラート設定

---

### Phase 2: 画像のS3移行（所要時間: 1〜2時間）

#### Step 2-1: S3バケット作成

1. AWS Console → S3
2. 「バケットを作成」
3. 設定：
   - バケット名: `ippikikoala-blog-images`（グローバルで一意）
   - リージョン: `ap-northeast-1`（東京）
   - パブリックアクセス: **ブロックを解除**（画像公開のため）
4. バケットポリシーを設定（公開読み取り許可）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ippikikoala-blog-images/*"
    }
  ]
}
```

#### Step 2-2: 画像のアップロード

1. Cloudflare R2から全画像をダウンロード
2. AWS CLI または S3コンソールでアップロード

```bash
# AWS CLIを使用する場合（要インストール）
aws s3 sync ./downloaded-images s3://ippikikoala-blog-images/
```

#### Step 2-3: 記事内の画像URLを置換

```bash
# 画像URLを一括置換するスクリプトを実行
# 例: https://r2.example.com/image.jpg → https://ippikikoala-blog-images.s3.ap-northeast-1.amazonaws.com/image.jpg
python scripts/replace_image_urls.py
```

> [!TIP]
> CloudFrontを使うと画像配信が高速化されますが、初期設定では不要です。S3の直接URLで十分機能します。

---

### Phase 3: AWS Amplifyでホスティング（所要時間: 30分）

#### Step 3-1: Amplifyアプリ作成

1. AWS Console → Amplify
2. 「新しいアプリを作成」→「Webアプリをホスト」
3. GitHubを選択してリポジトリ連携
4. リポジトリ: `blog`、ブランチ: `main` を選択

#### Step 3-2: ビルド設定

Amplifyが自動検出しますが、以下を確認：

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 3-3: 環境変数の設定

1. Amplify Console → アプリ → 環境変数
2. 必要な環境変数を追加（現在の`.env.local`を参考）

#### Step 3-4: 初回デプロイ

1. 「保存してデプロイ」をクリック
2. ビルドログを確認
3. プレビューURLでサイト確認

---

### Phase 4: カスタムドメイン設定（所要時間: 30分〜1時間）

#### Step 4-1: Amplifyでドメイン追加

1. Amplify Console → ドメイン管理
2. 「ドメインを追加」
3. `ippikikoala.com` を入力

#### Step 4-2: お名前.comでDNS設定変更

Amplifyが提示するDNSレコードをお名前.comに設定：

1. お名前.com → ドメイン設定 → DNS設定
2. Vercelの既存レコードを削除
3. Amplify指定のCNAMEレコードを追加

| ホスト名 | TYPE | VALUE |
|---------|------|-------|
| @ | CNAME | (Amplifyが提示) |
| www | CNAME | (Amplifyが提示) |

#### Step 4-3: SSL証明書の確認

- Amplifyが自動でSSL証明書を発行・管理
- 数分〜数時間でHTTPS有効化

---

### Phase 5: 動作確認と切り替え（所要時間: 30分）

#### Step 5-1: 動作確認チェックリスト

- [ ] トップページが表示される
- [ ] 記事一覧が正しく表示される
- [ ] 記事詳細ページが表示される（目次、画像含む）
- [ ] カテゴリ・タグページが動作する
- [ ] モバイル表示が正常
- [ ] 画像が全て表示される
- [ ] 内部リンクが動作する
- [ ] RSSフィードが生成される

#### Step 5-2: Vercelの停止

1. 動作確認完了後、Vercelプロジェクトを削除 or 一時停止
2. GitHub連携を解除（Amplifyと競合しないため）

---

## 移行前チェックリスト

移行を開始する前に確認：

### 準備物

- [ ] AWSアカウント（クレジットカード登録済み）
- [ ] お名前.comの管理画面にアクセス可能
- [ ] Cloudflare R2の画像ダウンロード権限
- [ ] 現在の`.env.local`の内容バックアップ
- [ ] GitHubリポジトリへのアクセス権限

### バックアップ

- [ ] 全MDXファイルのバックアップ
- [ ] 全画像のローカルバックアップ
- [ ] `package.json`、`next.config.ts`のバックアップ

### タイミング

- [ ] アクセスが少ない時間帯を選ぶ（深夜など）
- [ ] DNS切り替えは浸透に時間がかかるため、数時間〜24時間の猶予を見る

---

## ロールバック手順

移行に問題があった場合のロールバック：

### 1. DNS切り替え前の問題

- Amplifyのプレビューで確認しているため、本番影響なし
- 問題を修正してから再デプロイ

### 2. DNS切り替え後の問題

1. お名前.comでDNSレコードをVercelに戻す
2. DNS浸透を待つ（数時間〜24時間）

### 3. 画像URL移行後の問題

- 画像URLは段階的に移行（一部記事ずつ）
- 問題があればGitで元に戻す

---

## 参考リンク

- [AWS Amplify Hosting 公式ドキュメント](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [Next.js on AWS Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Amazon S3 入門](https://docs.aws.amazon.com/ja_jp/AmazonS3/latest/userguide/Welcome.html)
- [AWS無料利用枠](https://aws.amazon.com/jp/free/)

---

## 移行後のワークフロー

移行後のデプロイフローはVercelと同様：

1. ローカルで記事を編集
2. `git commit` & `git push`
3. Amplifyが自動でビルド・デプロイ
4. 数分後に本番反映

---

最終更新: 2026-01-12
