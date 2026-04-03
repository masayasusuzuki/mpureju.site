
]# Instagram → サイト記事 自動パイプライン 要件定義

## 概要

Instagram投稿から自動的にWebサイト用コンテンツ（美容コラム / 症例記事 / お知らせ）を生成し、microCMSに投稿するパイプライン。
GitHub Actionsで3日に1回自動実行される。人手の介入は不要。

---

## 対象アカウント

| アカウント | 変数名 | 主な用途 |
|---|---|---|
| @maison_pureju（クリニック公式） | clinic | 美容コラム（column） |
| @hirose_masashi_1（院長個人） | doctor | 症例記事（case） |

---

## パイプライン全体フロー

```
GitHub Actions（3日に1回）
  │
  ├─ ① 取得（Playwright）
  │    Instagram プロフィールページから最新10件のURLを取得
  │
  ├─ ② フィルタリング
  │    ピン留め除外 → shortcode重複排除 → DB重複除外 → 新規のみ INSERT(pending)
  │
  ├─ ③ ダウンロード
  │    画像・キャプションを取得（instaloader）
  │
  ├─ ④ 判定
  │    DL結果 + キャプション内容から分類（column / case / skip）
  │
  ├─ ⑤ 記事生成
  │    Claude API で article.md を生成
  │
  ├─ ⑥ CMS投稿
  │    microCMS API で公開 → DB status を published に更新
  │
  └─ 完了
```

---

## 各ステップ詳細

### ① 取得

- Playwright でプロフィールページを開く（**スクロールしない**）
- 初期表示の投稿リンクから上位10件を取得
- 各投稿ページを巡回し、URL・キャプション・投稿日を取得
- セッションCookieで認証（`sessionid`を環境変数で管理）

**ピン留め投稿の扱い:**
- 先頭3件はピン留め枠として扱う
- ピン留め枠のうち、4件目以降の投稿より日付が古いものは除外
- ピン留め枠でも最新のものは対象に含める

### ② フィルタリング

取得した投稿に対して以下のフィルターを順に適用：

1. **ピン留め除外**: アカウントごとに先頭3件はピン留め枠として扱う。ピン留め枠のうち、4件目以降の最古の投稿より日付が古いものを除外
2. **shortcode重複排除**: 同じ投稿が両アカウントに表示されるケースがある（リポスト・シェア等）。shortcodeで重複を検出し、先に出現した方を残す
3. **DB重複除外**: `instagram_posts.url` と照合し、既に存在するURL（published含む）を除外。これにより過去に記事化済みの投稿を再処理しない
4. **INSERT**: フィルターを通過したものだけ `instagram_posts` テーブルに `status = 'pending'` で保存

### ③ ダウンロード

- `status = 'pending'` の全投稿に対して実行（判定前に行う。画像の有無が判定に必要なため）
- instaloader で画像・動画・キャプションをダウンロード
- ファイル構成: `image_1.jpg`, `image_2.jpg`, ..., `caption.txt`

### ④ 判定

DL結果（画像の有無）とキャプション内容を元に分類する。

**判定順序（上から優先）：**

| 順序 | 条件 | classification | status |
|---|---|---|---|
| 1 | DLエラー | skip | skipped |
| 2 | 動画のみ（画像なし） | skip | skipped |
| 3 | キャンペーン告知・予約開始・お知らせ等の運営系 | news | pending（次ステップへ） |
| 4 | 画像あり + clinic アカウント | column | pending（次ステップへ） |
| 5 | 画像あり + doctor アカウント | case | pending（次ステップへ） |
| 6 | グレーゾーン（症例っぽいコラム等） | Claude API が判定 | pending（次ステップへ） |

**運営系投稿の判定キーワード例：**
キャプション冒頭に「キャンペーン」「予約を開始」「お知らせ」「感謝祭」等が含まれる場合は news として分類。
これらは施術解説や症例ではないが、microCMS の `news` APIに投稿してサイトのお知らせセクションに反映する。

**判定はClaude APIで実行。** キャプション全文と画像1枚目を入力として、column / case / news / skip を返す。

### ⑤ 記事生成

Claude API を使用して `article.md` を生成する。

**column の場合:**
- column-article-creator スキルと同等のプロンプトを使用
- 構成: 導入 → 解説 → 効果 → 対象者 → ダウンタイム・注意点 → まとめ
- frontmatter: title, slug, category, tags, thumbnail, instagram_url, published_at

**case の場合:**
- case-article-creator スキルと同等のプロンプトを使用
- 構成: この症例について → 施術のポイント → 施術詳細 → こんな方に向いています
- frontmatter: title, slug, pillar, treatment_label, timing, concern, risks, tags, thumbnail, instagram_url, published_at
- pillar の判定は treatment_label（施術名）に基づく（部位や効果ではない）

**news の場合:**
- キャプションを元に簡潔なお知らせ記事を生成
- 投稿先: microCMS `news` API
- frontmatter: title, slug, content, thumbnail, instagram_url, published_at

**共通制約:**
- 医療広告ガイドライン準拠（断定表現禁止、効果保証禁止）
- 料金情報は記載しない（Supabaseで別管理）
- 文末は「。」+ 改行
- `published_at` はInstagram投稿日（取得した `posted_at`）を使用する。記事生成日ではない

### ⑥ CMS投稿

- 画像を microCMS Media API にアップロード
- article.md を パースして microCMS columns/cases API に POST
- 成功後、`instagram_posts` テーブルを更新:
  - `status` → `published`
  - `microcms_id` → microCMS から返された記事ID

---

## データベース設計

### instagram_posts テーブル

```sql
id              UUID (PK, auto)
url             TEXT (UNIQUE)      -- Instagram投稿URL
shortcode       TEXT               -- 投稿のショートコード
source          TEXT               -- 'clinic' or 'doctor'
caption         TEXT               -- キャプション全文
posted_at       DATE               -- Instagram投稿日
classification  TEXT               -- 'column' / 'case' / 'news' / 'skip' / NULL
status          TEXT (default 'pending') -- 'pending' / 'processing' / 'skipped' / 'published'
skip_reason     TEXT               -- スキップ理由（例: '動画のみ', 'キャンペーン告知', 'DLエラー'）
microcms_id     TEXT               -- microCMS記事ID
fetched_at      TIMESTAMPTZ (auto) -- パイプライン取得日時
created_at      TIMESTAMPTZ (auto)
updated_at      TIMESTAMPTZ (auto)
```

---

## 管理画面（mpureju.admin）

### /instagram ページ

- instagram_posts テーブルの一覧表示
- 表示列: 投稿日、ソース、取得日、キャプション（縮小）、判定、状態、スキップ理由、URL
- ソースフィルター: タブUI（すべて / 公式 / 院長）で切り替え
- 状態フィルター: セレクトボックス（すべて / 未処理 / 公開済み / スキップ）
- 判定（column/case/skip）を手動で変更可能
- 各投稿のInstagram元URLへのリンク

### ダッシュボード

- 「Instagram未処理」件数カードを表示

---

## 実行環境・アーキテクチャ

### 処理の分担

```
GitHub Actions（3日に1回、全処理を実行）
  ├─ ① Playwright → Instagram URL取得
  ├─ ② instaloader → 画像を VM の /tmp にDL
  ├─ ③ Claude API → 画像(base64) + キャプション → article.md 生成
  ├─ ④ microCMS Media API → 画像アップロード（唯一の画像保存先）
  ├─ ⑤ microCMS columns/cases API → 記事投稿
  ├─ ⑥ Supabase → DB status 更新
  └─ VM 終了で /tmp 自動削除（画像はローカルに残らない）

管理画面 mpureju.admin（結果の確認・手動修正のみ）
  ├─ instagram_posts テーブルの一覧表示
  ├─ 判定（column/case/skip）の手動変更
  └─ 処理状態の確認
```

### 画像の保存方針

- **ローカル / Supabase には画像を保存しない**
- **microCMS Media が唯一の画像保存先**（プラン容量内で追加コストなし）
- GitHub Actions の VM 上で一時的にDLし、microCMS にアップロード後は VM 終了で自動削除

### GitHub Actions

- スケジュール: 3日に1回（cron: `0 0 */3 * *`）
- ランタイム: ubuntu-latest + Node.js + Playwright + Python(instaloader)
- 実行時間: 5〜15分程度

### 必要な環境変数（GitHub Actions Secrets）

```
# Instagram認証
IG_SESSION_ID          -- sessionid Cookie値

# Supabase
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY

# microCMS
MICROCMS_SERVICE_DOMAIN
MICROCMS_WRITE_API_KEY
MICROCMS_MANAGEMENT_API_KEY

# Claude API（記事生成用）
ANTHROPIC_API_KEY
```

---

## 既存ツール・スクリプト

| ファイル | 役割 | GitHub Actions での利用 |
|---|---|---|
| `scripts/instagram-fetch-profile.js` | プロフィールから投稿URL取得 | Playwright 部分を流用 |
| `scripts/instagram-dl.sh` | 個別投稿の画像・キャプションDL | /tmp にDL先を変更して使用 |
| `scripts/microcms-post.js` | column記事をmicroCMSに投稿 | そのまま使用 |
| `scripts/microcms-case-post.js` | case記事をmicroCMSに投稿 | そのまま使用 |

---

## 制約・注意事項

- Instagram のスクレイピングは規約上グレーゾーン。将来的に Graph API（公式）への移行を検討
- sessionid Cookie は有効期限あり（約1年）。期限切れ時は再取得が必要
- Claude API の利用料が発生する（1記事あたり数円程度）
- 記事品質は自動生成のため、定期的に管理画面で確認を推奨
- microCMS Media の容量はプラン上限に注意（画像が蓄積されるため）
