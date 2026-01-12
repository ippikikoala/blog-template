# カテゴリー管理手順書

このドキュメントでは、ブログのカテゴリー管理方法を説明します。

> [!IMPORTANT]
> **カテゴリ変更時の重要な注意点**
> - `src/config/categories.ts` でカテゴリを定義しても、**各記事の frontmatter** を変更しなければ反映されません
> - 記事の `category: "カテゴリ名"` は、`categories.ts` で定義した `name` と正確に一致する必要があります
> - 変更後は開発サーバーを再起動（または `npm run build`）し、ブラウザをハードリフレッシュ（Cmd + Shift + R）してください

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `src/config/categories.ts` | カテゴリ設定（地方・都道府県・テーマ定義） |
| `src/lib/categoryUtils.ts` | ユーティリティ関数 |
| `src/lib/posts.ts` | 記事データ層 |
| `src/components/CategoryAccordion.tsx` | サイドバーのアコーディオン表示 |
| `src/components/MobileMenu.tsx` | モバイルメニュー表示 |

---

## 1. 新しいテーマ別カテゴリを追加する

**例**: 「温泉」カテゴリを追加する

### 手順

#### Step 1: 設定ファイルにカテゴリを追加

`src/config/categories.ts` の `themeCategories` 配列に追加:

```typescript
themeCategories: [
  { id: 'it', name: 'IT', order: 1 },
  { id: 'oyamada', name: '小山田壮平', order: 2 },
  { id: 'onsen', name: '温泉', order: 3 },  // ← 追加
],
```

> [!TIP]
> `order` は表示順序です。小さい数字が先に表示されます。

#### Step 2: 記事のカテゴリを変更

対象となる記事の `frontmatter` を修正:

```yaml
---
category: "温泉"  # ← 新しいカテゴリ名
tags: ["温泉", ...]
---
```

#### Step 3: ビルド確認

```bash
npm run build
```

エラーがなければ完了です。サイドバーに新しいカテゴリが表示されます。

---

## 2. テーマ別カテゴリを階層型に変更する

**例**: ITカテゴリを「プログラミング」「AI」などのサブカテゴリを持つアコーディオンに変更する

### 手順

#### Step 1: 設定ファイルを変更

`src/config/categories.ts` で、`themeCategories` から削除し、`regions` に新しい「地方」として追加:

```typescript
regions: [
  // ... 既存の地方
  {
    id: 'it',
    name: 'IT',
    order: 9,  // 九州・沖縄の後
    prefectures: [
      { id: 'programming', name: 'プログラミング', order: 1 },
      { id: 'ai', name: 'AI', order: 2 },
      { id: 'infrastructure', name: 'インフラ', order: 3 },
    ],
  },
],
themeCategories: [
  // { id: 'it', name: 'IT', order: 1 },  ← 削除
  { id: 'oyamada', name: '小山田壮平', order: 1 },
],
```

#### Step 2: 記事のカテゴリを新しいサブカテゴリに変更

```yaml
---
category: "プログラミング"  # ← サブカテゴリ名
---
```

#### Step 3: ビルド確認

```bash
npm run build
```

---

## 3. カテゴリを削除する

**例**: 「小山田壮平」カテゴリを削除して記事を「愛知県」に戻す

### 手順

#### Step 1: 記事のカテゴリを変更

対象ファイルを特定:

```bash
grep -r 'category: "小山田壮平"' content/posts/
```

各記事のカテゴリを変更:

```yaml
---
category: "愛知県"  # ← 変更
---
```

#### Step 2: 設定ファイルからカテゴリを削除

`src/config/categories.ts`:

```typescript
themeCategories: [
  { id: 'it', name: 'IT', order: 1 },
  // { id: 'oyamada', name: '小山田壮平', order: 2 },  ← 削除
],
```

#### Step 3: ビルド確認

```bash
npm run build
```

> [!WARNING]
> 記事を移動せずにカテゴリを削除すると、該当記事が「その他」扱いになる可能性があります。

---

## 4. 記事のカテゴリを一括変更する

**例**: 「その他」カテゴリで特定タグを持つ記事を新カテゴリに移行

### スクリプトを使用する方法

`scripts/add_new_categories.py` を参考にスクリプトを作成:

```python
#!/usr/bin/env python3
import os
import re
from pathlib import Path

POSTS_DIR = Path("content/posts")

def update_category(file_path: Path) -> bool:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # frontmatterを抽出
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if not match:
        return False

    frontmatter = match.group(1)
    body = match.group(2)

    # 条件: category が「その他」かつ tags に「温泉」を含む
    category_match = re.search(r'^category:\s*"([^"]*)"', frontmatter, re.MULTILINE)
    tags_match = re.search(r'^tags:\s*\[(.*?)\]', frontmatter, re.MULTILINE)

    if not category_match:
        return False

    category = category_match.group(1)
    tags_str = tags_match.group(1) if tags_match else ""
    tags = [tag.strip().strip('"') for tag in tags_str.split(",") if tag.strip()]

    if category == "その他" and "温泉" in tags:
        # カテゴリを「温泉」に変更
        new_frontmatter = re.sub(
            r'^category:\s*"[^"]*"',
            'category: "温泉"',
            frontmatter,
            flags=re.MULTILINE
        )
        new_content = f"---\n{new_frontmatter}\n---\n{body}"
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  Updated: {file_path.name}")
        return True

    return False

if __name__ == "__main__":
    for mdx_file in sorted(POSTS_DIR.glob("*.mdx")):
        update_category(mdx_file)
```

実行:

```bash
python scripts/migrate_category.py
npm run build
```

---

## 5. カテゴリの表示順を変更する

### テーマ別カテゴリの順序変更

`src/config/categories.ts` の `order` フィールドを変更:

```typescript
themeCategories: [
  { id: 'oyamada', name: '小山田壮平', order: 1 },  // ← 順序入れ替え
  { id: 'it', name: 'IT', order: 2 },
],
```

### 地方の順序変更

各 `region` の `order` フィールドを変更:

```typescript
regions: [
  { id: 'hokkaido', name: '北海道', order: 1 },
  { id: 'tohoku', name: '東北', order: 2 },
  // ...
],
```

### 都道府県の順序変更

各 `prefecture` の `order` フィールドを変更:

```typescript
prefectures: [
  { id: 'aomori', name: '青森県', order: 1 },
  { id: 'iwate', name: '岩手県', order: 2 },
  // ...
],
```

---

## 6. 現在のカテゴリ構造

### 地方別カテゴリ（アコーディオン表示）

| 地方 | 都道府県数 |
|-----|----------|
| 北海道 | 1 |
| 東北 | 6 |
| 関東 | 7 |
| 中部 | 9 |
| 近畿 | 7 |
| 中国 | 5 |
| 四国 | 4 |
| 九州・沖縄 | 8 |

### テーマ別カテゴリ（単独リンク表示）

| カテゴリ | 記事数 |
|---------|--------|
| IT | 10 |
| 音楽 | 2 |

---

## トラブルシューティング

### Q: 新しいカテゴリがサイドバーに表示されない

**原因**: そのカテゴリの記事が0件

**解決**: 記事のカテゴリを正しく設定しているか確認:

```bash
grep -r 'category: "カテゴリ名"' content/posts/
```

### Q: ビルドエラーが発生する

**原因**: TypeScriptの型不整合

**解決**: `src/config/categories.ts` の構文を確認:

```bash
npx tsc --noEmit
```

### Q: カテゴリページが404になる

**原因**: Next.jsのキャッシュ

**解決**: キャッシュをクリアして再ビルド:

```bash
rm -rf .next
npm run build
```
