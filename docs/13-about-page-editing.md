# Aboutページの編集方法

Aboutページの内容を編集する方法を説明します。

## 対象ファイル

| 項目 | ファイルパス |
|------|-------------|
| Aboutページ | `src/app/about/page.tsx` |
| プロフィール画像 | `public/ippikikoala_profile.png` |

---

## 1. プロフィール画像に変更する

現在、Aboutページでは絵文字（🐨）が表示されていますが、サイドバーと同じプロフィール画像に変更できます。

### 編集手順

`src/app/about/page.tsx` を開き、以下の部分を変更します。

**変更前（20〜24行目）:**
```tsx
<div className="text-center mb-8">
  <div className="inline-block w-32 h-32 rounded-full bg-[var(--background-secondary)] flex items-center justify-center text-6xl">
    🐨
  </div>
</div>
```

**変更後:**
```tsx
<div className="text-center mb-8">
  <img
    src="/ippikikoala_profile.png"
    alt="いっぴきこあら"
    className="inline-block w-32 h-32 rounded-full object-cover"
  />
</div>
```

### 変更のポイント

- `<div>` と絵文字を `<img>` タグに置き換えます
- `src="/ippikikoala_profile.png"` でpublicフォルダの画像を参照します
- `rounded-full` で円形に表示されます
- `object-cover` で画像が切り抜かれて収まります

---

## 2. 文章を編集する

### 編集可能な箇所

Aboutページには以下のセクションがあります（各 `<h2>` タグ以降の `<p>` タグ内を編集）：

| セクション | 行番号 | 現在の内容 |
|-----------|-------|-----------|
| いっぴきこあらの大冒険 | 27-30行目 | ブログの概要説明 |
| このブログについて | 33-36行目 | ブログのコンテンツ説明 |
| 著者について | 39-42行目 | 著者の自己紹介 |
| お問い合わせ | 45行目 | 連絡方法 |

### 編集例

例えば「著者について」を編集する場合：

**変更前:**
```tsx
<h2>著者について</h2>
<p>
  ひねくれ夫婦で日本各地をドライブ旅行しています。
  有名な観光地よりも、人があまり訪れない場所に惹かれます。
</p>
```

**変更後:**
```tsx
<h2>著者について</h2>
<p>
  夫婦で日本各地を旅しています。
  鄙びた温泉や廃線跡を求めて、週末になると車を走らせています。
</p>
```

---

## 3. セクションを追加する

新しいセクションを追加するには、既存のセクションの後に同じ形式で追加します。

### 追加例

お問い合わせの後に「リンク」セクションを追加する場合：

```tsx
<h2>お問い合わせ</h2>
<p>お問い合わせはTwitterのDMからお願いします。</p>

{/* 以下を追加 */}
<h2>リンク</h2>
<p>
  <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
    Twitter
  </a>
</p>
```

---

## 4. メタデータの編集

ページのタイトルや説明文（SEO用）を変更するには、ファイル冒頭の `metadata` を編集します。

```tsx
export const metadata: Metadata = {
  title: "About",                           // ブラウザタブのタイトル
  description: "いっぴきこあらの大冒険について",  // 検索エンジン用の説明
};
```

---

## 5. 変更の確認方法

1. 開発サーバーを起動（起動していない場合）：
   ```bash
   cd /Users/ippiki_koala/Desktop/Claude/blog
   npm run dev
   ```

2. ブラウザで確認：
   ```
   http://localhost:3000/about
   ```

3. 変更を保存するたびに自動でリロードされます

---

## 注意事項

> [!IMPORTANT]
> TSX（React）形式のため、HTMLとは異なるルールがあります：
> - `class` ではなく `className` を使用
> - タグは必ず閉じる（`<img />` など）
> - `{/* コメント */}` の形式でコメントを書く

> [!TIP]
> 編集後にエラーが出た場合は、ターミナルのエラーメッセージを確認してください。
> よくある原因：
> - タグの閉じ忘れ
> - クォーテーションの不一致
> - 日本語のみの文字が途切れている
