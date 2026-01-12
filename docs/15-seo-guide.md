# SEO対策ガイド

このドキュメントでは、ブログのSEO（検索エンジン最適化）設定について説明します。

---

## 1. サイトマップ

### 概要

サイトマップ（`sitemap.xml`）は、サイト内のすべてのURLをリスト化したXMLファイルです。
検索エンジンがサイトの構造を効率的にクロールするために使用します。

### 自動生成

Next.js App Routerの機能を使い、`src/app/sitemap.ts` で自動生成されます。

**生成されるURL:**
- トップページ（`/`）
- アバウトページ（`/about`）
- アーカイブページ（`/archive`）
- 都道府県カテゴリページ（`/categories/北海道` など47件）
- テーマカテゴリページ（`/categories/IT` など）
- 全記事ページ（`/posts/YYYY-MM-DD-slug`）

### 確認方法

```
https://www.ippikikoala.com/sitemap.xml
```

---

## 2. robots.txt

### 概要

`robots.txt` は、検索エンジンのクローラーに対してクロールの許可/拒否を指示するファイルです。

### 自動生成

`src/app/robots.ts` で自動生成されます。

**設定内容:**
```
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://www.ippikikoala.com/sitemap.xml
```

### 確認方法

```
https://www.ippikikoala.com/robots.txt
```

---

## 3. Google Search Console

### 概要

Google Search Console は、Googleが提供する無料のSEO管理ツールです。
以下の機能があります：

- サイトのインデックス状況を確認
- 検索パフォーマンス（クリック数、表示回数、検索キーワード）を分析
- サイトマップの送信
- クロールエラーの検出

### 登録手順

#### Step 1: サイトを登録

1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. 「プロパティを追加」をクリック
3. **URL プレフィックス** を選択
4. `https://www.ippikikoala.com` を入力
5. 「続行」をクリック

#### Step 2: 所有権を確認

以下のいずれかの方法で所有権を確認します：

**方法A: DNSレコード（推奨）**
1. Googleが表示するTXTレコードをコピー
2. ドメイン管理画面（お名前.com等）でDNS設定を開く
3. TXTレコードを追加
4. 反映まで数分〜数時間待つ
5. Google Search Consoleで「確認」をクリック

**方法B: HTMLファイル**
1. Googleが提供するHTMLファイルをダウンロード
2. `public/` フォルダに配置
3. デプロイ
4. Google Search Consoleで「確認」をクリック

**方法C: HTMLタグ**
1. Googleが提供するメタタグをコピー
2. `src/app/layout.tsx` の `<head>` 内に追加

```tsx
// src/app/layout.tsx
export const metadata: Metadata = {
  // 既存の設定...
  verification: {
    google: 'ここにGoogleから提供された確認コード',
  },
}
```

3. デプロイ
4. Google Search Consoleで「確認」をクリック

#### Step 3: サイトマップを送信

1. 左メニューから「サイトマップ」を選択
2. `https://www.ippikikoala.com/sitemap.xml` を入力
3. 「送信」をクリック
4. ステータスが「成功しました」になることを確認

---

## 4. はてなブログからのリダイレクト設定

旧ブログ（はてなブログ）から新ブログへリダイレクトすることで、
検索エンジンとユーザーを新サイトに誘導できます。

### 手順

1. はてなブログの管理画面にログイン
2. 「設定」→「詳細設定」を開く
3. 「headに要素を追加」に以下のコードを追加：

```html
<script>
(function() {
  const path = location.pathname;
  
  // 記事ページ: /entry/YYYY/MM/DD/HHMMSS
  const entryMatch = path.match(/\/entry\/(\d{4})\/(\d{2})\/(\d{2})\/(\d{6})/);
  if (entryMatch) {
    const [, y, m, d, t] = entryMatch;
    location.replace(`https://www.ippikikoala.com/posts/${y}-${m}-${d}-${y}-${m}-${d}-${t}`);
    return;
  }
  
  // トップページ
  if (path === '/' || path === '') {
    location.replace('https://www.ippikikoala.com/');
    return;
  }
  
  // その他のページは新サイトトップへ
  location.replace('https://www.ippikikoala.com/');
})();
</script>
```

4. 「変更する」をクリックして保存

### 注意事項

- JavaScriptリダイレクトは301リダイレクトほどSEO効果がありません
- はてなブログでは301リダイレクトを直接設定できないため、これが現実的な選択肢です
- 3〜6ヶ月程度は旧ブログを維持することを推奨します

---

## 5. SEOチェックリスト

### 初期設定（2026-01-12 完了）

- [x] サイトマップ（`sitemap.xml`）を作成
- [x] robots.txt を作成
- [x] Google Search Console にサイトを登録（HTMLファイル方式で所有権確認）
- [x] サイトマップを送信
- [x] はてなブログにリダイレクト設定

### 継続的な運用

- [ ] 月1回程度、Search Consoleでインデックス状況を確認
- [ ] クロールエラーがあれば対処
- [ ] 検索パフォーマンスをモニタリング

---

## 6. 関連ファイル

| ファイル | 説明 |
|---|---|
| `src/app/sitemap.ts` | サイトマップ自動生成 |
| `src/app/robots.ts` | robots.txt自動生成 |
| `src/app/layout.tsx` | メタデータ（OGP、タイトル等）設定 |
| `src/config/categories.ts` | カテゴリ定義（サイトマップに使用） |
| `src/lib/posts.ts` | 記事一覧取得（サイトマップに使用） |
| `public/google35e293fc2e7112bb.html` | Google Search Console 所有権確認ファイル |

---

## 7. トラブルシューティング

### サイトマップが表示されない

1. ビルドを再実行: `npm run build`
2. デプロイを確認
3. `https://www.ippikikoala.com/sitemap.xml` に直接アクセスして確認

### Search Consoleで所有権が確認できない

1. DNSレコードの反映に時間がかかっている可能性（最大48時間）
2. HTMLファイル方式に切り替える
3. デプロイが完了しているか確認

### インデックスが増えない

1. サイトマップが正しく送信されているか確認
2. robots.txtで意図せずブロックしていないか確認
3. 数週間待つ（新サイトのインデックスには時間がかかる）

---

最終更新: 2026-01-12
