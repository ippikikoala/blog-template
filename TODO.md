# ブログ改善TODO

このドキュメントは、ブログの改善点を管理するためのチェックリストです。
完了したタスクには ✅ をつけています。

---

## 1. フォントサイズの調整

- [x] `src/app/globals.css` の body font-size を 17px → 15px に変更
- [x] ビルドして表示確認

**優先度**: 高（簡単）
**ファイル**: `src/app/globals.css`
**ステータス**: ✅ 完了

---

## 2. 目次（TableOfContents）の修正

### 問題点
- 目次のリンクが見出しに飛ばない（ID不一致）
- 記事本文冒頭に旧目次リンクが残っている

### 対応
- [x] `github-slugger` パッケージをインストール
- [x] `src/app/posts/[slug]/page.tsx` でMDXコンポーネントにID付与
- [x] TableOfContents.tsx の ID生成ロジックを github-slugger に統一
- [x] ビルドして目次のリンクが正常に動作するか確認
- [x] Pythonスクリプトで本文冒頭の旧目次リンクを削除（47ファイル修正）

**優先度**: 高
**ファイル**:
- `src/app/posts/[slug]/page.tsx`
- `src/components/TableOfContents.tsx`
- `scripts/remove_old_toc.py`
- `content/posts/*.mdx` (47ファイル)
- `package.json`
**ステータス**: ✅ 完了

---

## 3. MDXファイルのクリーンアップ

### 問題点
- 本文冒頭に旧目次リンク `[見出し](#見出し)` が残っている
- descriptionフィールドに目次テキストが混入している
- Hatenaキーワードリンク `d.hatena.ne.jp` が残っている

### 対応
- [x] クリーンアップスクリプト作成（Python）
  - [x] 本文冒頭の目次リンク削除
  - [x] descriptionから目次テキスト除去
  - [x] Hatenaキーワードリンク `[テキスト](https://d.hatena.ne.jp/...)` をプレーンテキスト化
  - [x] description内の裸のHatena URL `(https://d.hatena.ne.jp/...)` を削除
  - [x] truncateされたHatena URL（末尾が`...`）にも対応
- [x] 全139記事に対してスクリプト実行（136ファイル修正）
- [x] ビルドして動作確認
- [x] 変更をコミット

**優先度**: 高
**対象**: `content/posts/*.mdx` (139ファイル)
**スクリプト**: `scripts/cleanup_mdx.py`
**ステータス**: ✅ 完了

---

## 4. タグの復元

### 問題点
- 移行時にタグ情報が失われ `tags: []` になっている

### 対応
- [ ] 元のHatenaブログエクスポートデータを確認
- [ ] タグ復元スクリプト作成
- [ ] 全記事のfrontmatterにタグを追加
- [ ] 動作確認（タグページ、記事詳細ページ）

**優先度**: 中
**対象**: `content/posts/*.mdx`

---

## 5. Google Maps埋め込みの修正

### 問題点
- `[Google Maps埋め込み]` というプレースホルダーのまま

### 対応
- [ ] Google Maps埋め込みがある記事を特定
  ```bash
  grep -r "Google Maps埋め込み" content/posts/
  ```
- [ ] 各記事に正しいGoogle Maps iframeコードを追加
- [ ] next.config.ts に Google Maps ドメインを追加（必要に応じて）
- [ ] 表示確認

**優先度**: 中
**ファイル**:
- 該当する `content/posts/*.mdx`
- `next.config.ts`（必要に応じて）

---

## 6. スマホ版サイドバーのカテゴリ表示修正

### 問題点
- モバイル表示時にサイドバーのカテゴリが使いにくい

### 対応
- [ ] スマホで実際の表示を確認
- [ ] 問題箇所を特定
- [ ] `src/components/Sidebar.tsx` のレスポンシブスタイルを調整
- [ ] モバイルでの表示確認

**優先度**: 中
**ファイル**:
- `src/components/Sidebar.tsx`
- `src/components/Header.tsx`（必要に応じて）

---

## 7. その他の改善（オプション）

- [ ] favicon追加 (`public/favicon.ico`)
- [ ] OGP画像作成 (`public/og-image.png`)
- [ ] Vercel Analytics有効化
- [ ] 検索機能追加（将来的に）

---

## 進捗管理

- **完了**: 3/7
- **進行中**: 0/7
- **未着手**: 4/7

---

## メモ

- 各タスク完了後はビルド & 動作確認を実施
- 重要な変更後はgitコミット
- 本番反映前にプレビュー環境で確認

---

最終更新: 2026-01-09
