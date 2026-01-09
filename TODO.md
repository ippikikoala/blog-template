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
- [x] 元のHatenaブログエクスポートデータを確認
- [x] タグ復元スクリプト作成 (`scripts/restore_tags.py`)
- [x] 全記事のfrontmatterにタグを追加（44ファイル更新）
- [x] 動作確認（タグページ、記事詳細ページ）

**優先度**: 中
**対象**: `content/posts/*.mdx`
**スクリプト**: `scripts/restore_tags.py`
**ステータス**: ✅ 完了

### 補足
- Hatenaブログエクスポートの`CATEGORY`フィールドを解析
- 最初のCATEGORYはcategory（既存）、2番目以降をtagsとして復元
- 44件のファイルにタグを追加（82件はタグなし記事）
- 復元されたタグ: 廃線(9), 炭鉱(8), IT(6), ロードバイク(6), 旅館(5), 島(4), 温泉(2), 機材(2), 他

---

## 5. iframe埋め込みの実装

### 問題点
- `[Google Maps埋め込み]` プレースホルダーのまま（14記事）
- YouTube埋め込みが欠落（77件）

### 対応
- [x] YouTube埋め込みコンポーネント作成（`src/components/embeds/YouTube.tsx`）
- [x] Google Maps埋め込みコンポーネント作成（`src/components/embeds/GoogleMap.tsx`）
- [x] MDXRemoteコンポーネント設定更新（`src/app/posts/[slug]/page.tsx`）
- [x] iframe情報抽出スクリプト作成（`scripts/extract_iframes.py`）
  - YouTube: 77件検出
  - Google Maps: 33件検出
  - 対象記事: 31件
- [x] 更新ガイド生成スクリプト作成（`scripts/update_mdx_iframes.py`）
- [x] 更新ガイド生成（`iframe_update_guide.md`）
- [x] 自動更新スクリプト作成（`scripts/auto_update_iframes.py`）
- [x] Google Maps自動更新実行（13記事、31件）
- [x] ビルド確認（エラーなし）
- [ ] YouTube埋め込み追加（77件、任意）
- [ ] 全埋め込みの表示確認（ブラウザ確認）

**優先度**: 高
**ステータス**: ✅ 完了（Google Maps埋め込み）

**実装完了ファイル**:
- `src/components/embeds/YouTube.tsx` - YouTubeコンポーネント
- `src/components/embeds/GoogleMap.tsx` - Google Mapsコンポーネント
- `src/app/posts/[slug]/page.tsx` - MDXRemote設定更新
- `scripts/extract_iframes.py` - iframe情報抽出スクリプト
- `scripts/update_mdx_iframes.py` - 更新ガイド生成スクリプト
- `scripts/auto_update_iframes.py` - 自動更新スクリプト
- `iframe_mapping.json` - 抽出結果
- `iframe_update_guide.md` - 手動更新用ガイド

**更新完了記事（14記事）**:
- 手動更新: 2025-12-28-174758.mdx（Google Maps 2件）
- 自動更新: 13記事（Google Maps 31件）
  - 2025-05-06-231710.mdx（5件）
  - 2025-05-18-185739.mdx（4件）
  - 2026-01-04-223535.mdx（4件）
  - 2025-11-04-230836.mdx（3件）
  - 2025-11-09-172638.mdx（3件）
  - 2025-12-21-171641.mdx（3件）
  - 2025-11-09-010007.mdx（2件）
  - 2026-01-04-185146.mdx（2件）
  - 2025-10-29-233946.mdx（1件）
  - 2025-11-04-235915.mdx（1件）
  - 2026-01-04-160039.mdx（1件）
  - 2026-01-04-160836.mdx（1件）
  - 2026-01-05-001743.mdx（1件）

**次のステップ（任意）**:
1. YouTube埋め込み追加（77件）
   - `iframe_update_guide.md` を参照
   - 手動で各記事に追加
2. 各記事を `npm run dev` で表示確認
3. YouTube動画の再生確認
4. Google Mapsの操作確認（ドラッグ、ズーム）
5. レスポンシブ表示確認

---

## 6. 目次に中見出し・小見出しが表示されない

### 問題点
- 目次（TableOfContents）にh2-h4しか表示されていなかった
- h5・h6が無視されていた（Hatenaブログでは全レベル表示されていた）

### 対応
- [x] `src/components/TableOfContents.tsx` の正規表現を`#{2,6}`に変更
- [x] `src/app/posts/[slug]/page.tsx` でh5/h6にもID付与
- [x] `src/app/globals.css` でh2-h6の階層的スタイリング実装
  - h2: 太字15px（インデントなし）
  - h3: 14px、16pxインデント
  - h4: 14px（インデントなし）
  - h5: 13px、16pxインデント
  - h6: 12px、32pxインデント
- [x] ビルドして動作確認（225ページ生成成功）

**優先度**: 高
**ファイル**:
- `src/components/TableOfContents.tsx`
- `src/app/posts/[slug]/page.tsx`
- `src/app/globals.css`
**ステータス**: ✅ 完了

---

## 7. スマホのハンバーガーメニューが機能しない

### 問題点
- スマホでハンバーガーメニューを押すと「Menu」というテキストしか表示されない
- カテゴリ一覧などのナビゲーションが表示されない

### 対応
- [x] `src/components/Header.tsx` のモバイルメニュー実装を確認
- [x] メニュー展開時にカテゴリ一覧を表示するよう修正
- [x] 必要に応じてSidebarコンポーネントとの連携を検討
- [x] 実機またはDevToolsのモバイル表示で動作確認

**優先度**: 高
**ファイル**:
- `src/components/Header.tsx` - サーバーコンポーネントに変更
- `src/components/MobileMenu.tsx` - 新規作成（クライアントコンポーネント）
**ステータス**: ✅ 完了

### 実装内容
- `Header.tsx`をサーバーコンポーネントに変更し、カテゴリ・タグデータをサーバーサイドで取得
- `MobileMenu.tsx`を新規作成し、モバイルメニューのインタラクティブ部分を分離
- モバイルメニューにカテゴリ一覧（上位10件）とタグ一覧（上位12件）を表示
- 各リンククリック時にメニューを自動的に閉じる動作を実装

---

## 8. スマホ版サイドバーのカテゴリ表示修正

### 問題点
- モバイル表示時にサイドバーのカテゴリが使いにくい

### 対応
- [x] スマホで実際の表示を確認
- [x] 問題箇所を特定
- [x] モバイルメニューにカテゴリ・タグを追加（#7で対応）
- [x] モバイルでの表示確認

**優先度**: 中
**ファイル**:
- `src/components/MobileMenu.tsx` - モバイル用カテゴリ・タグ表示を実装
**ステータス**: ✅ 完了

### 実装内容
- #7の対応でモバイルメニューにカテゴリ・タグを追加したことで解決
- サイドバーは大画面（lg以上）で表示、モバイルではハンバーガーメニューからアクセス

---

## 7. その他の改善（オプション）

- [ ] favicon追加 (`public/favicon.ico`)
- [ ] OGP画像作成 (`public/og-image.png`)
- [ ] Vercel Analytics有効化
- [ ] 検索機能追加（将来的に）

---

## 進捗管理

- **完了**: 8/9
- **進行中**: 0/9
- **未着手**: 1/9（オプションタスク）

---

## メモ

- 各タスク完了後はビルド & 動作確認を実施
- 重要な変更後はgitコミット
- 本番反映前にプレビュー環境で確認

---

最終更新: 2026-01-09
