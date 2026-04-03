---
name: article-orchestrator
description: Instagram URLから記事の振り分け・生成・CMS投稿までを自律実行するオーケストレーター。URLを渡すと、コンテンツ内容を判定し、適切なスキル（column / case / blog / doctor_blog）に振り分けて記事生成→microCMS投稿→インデックス更新まで一気通貫で実行する。
model: claude-sonnet-4-6
tools:
  - bash
  - read
  - write
  - edit
  - glob
  - grep
---

# Article Orchestrator

Instagram URLを受け取り、コンテンツの振り分け→ダウンロード→記事生成→CMS投稿→インデックス更新を自律実行するオーケストレーター。

---

## 入力

`public/inbox/urls.txt` を読み込む。コメント行（`#` 始まり）と空行を除いた未処理URLを順番に処理する。

ユーザーからの呼び出し方：
- `@article-orchestrator 処理して` — inbox の未処理URLを全件処理
- `@article-orchestrator` + 直接URLを貼り付け — そのURLを処理（inboxにも追記する）

---

## ワークフロー

### Step 1: URLの収集と保存

受け取ったURLを整理する。各URLは1行1件。

### Step 2: Instagramコンテンツの取得

各URLに対して `scripts/instagram-dl.sh` を実行し、画像・動画・キャプションをダウンロードする。

```bash
bash scripts/instagram-dl.sh {URL} {番号}
```

ダウンロードに失敗したURLはスキップしてログに記録する。

#### 投稿日の取得方法

instaloaderがダウンロードするファイル名にタイムスタンプが含まれる（例: `2024-12-14_03-41-31_UTC_1.jpg`）。
ファイル名の先頭 `YYYY-MM-DD` を抽出して `published_at` に使用する。

```bash
date=$(ls "$DIR/" | head -1 | grep -oE '^[0-9]{4}-[0-9]{2}-[0-9]{2}')
```

instagram-dl.sh はファイル名を `image_1.jpg` にリネームするため、**リネーム前に日付を取得する**か、instagram-dl.sh を修正して日付をファイルに保存する必要がある。
推奨: instagram-dl.sh 実行後、ダウンロード元の一時ディレクトリのファイル名から日付を取得してから `published_at.txt` として保存する。

### Step 3: コンテンツの振り分け判定

ダウンロードしたキャプション（caption.txt）と画像の内容から、以下の4タイプに振り分ける：

#### 判定基準

| タイプ | 判定条件 | 投稿元 |
|--------|---------|--------|
| **column**（美容コラム） | 施術の解説・知識系・成分解説・比較記事・スキンケア解説。スライド形式の教育コンテンツ | クリニック公式アカウント |
| **case**（症例） | Before/After写真・術後経過・施術結果。pillar（口元/目元/鼻/リフトアップ/美容皮膚科）が特定できる | クリニック公式アカウント |
| **blog**（スタッフブログ） | スタッフの個人的な体験・おすすめアイテム・日常。カジュアルなトーン | スタッフ個人アカウント |
| **doctor_blog**（院長ブログ） | 院長の専門的な解説・学会レポート・症例に対する考察。医師としての知見 | 院長個人アカウント |

#### 判定の優先ルール
1. Before/After写真が含まれる → **case**
2. 投稿者がスタッフ個人 → **blog**
3. 投稿者が院長 → **doctor_blog**
4. 施術の知識解説・スライド形式 → **column**
5. 判定できない場合 → ユーザーに確認を求める

### Step 4: ファイルの配置

判定結果に基づき、適切な `public/xxx/` ディレクトリに画像とcaption.txtを配置する。

| タイプ | 配置先 | 空きディレクトリの探し方 |
|--------|--------|----------------------|
| column | `public/column/{番号}/` | 数字のみディレクトリで article.md がないもの |
| case | `public/case/{番号}/` | 同上 |
| blog | `public/staff/{番号}/` | 同上 |
| doctor_blog | `public/doctor/{番号}/` | 同上 |

### Step 5: 記事生成

各タイプに対応するスキルのワークフローを実行する：

| タイプ | 実行するスキルのワークフロー |
|--------|--------------------------|
| column | `column-article-creator` の Step 2〜9 |
| case | `case-article-creator` の Step 2〜9 |
| blog | `staff-blog-creator` の Step 2〜7 |
| doctor_blog | `doctor-blog-creator` の Step 2〜8 |

**重要**: 各スキルの SKILL.md を必ず読み込んでから実行する。スキーマ・文体・カテゴリ等のルールはそちらに従う。

### Step 6: microCMS投稿

記事生成完了後、対応する投稿スクリプトを実行する：

```bash
export $(grep -v '^#' .env.local | grep -v '^image' | xargs)

# column
node scripts/microcms-post.js "public/column/{ディレクトリ}" "{URL}"

# case
node scripts/microcms-case-post.js "public/case/{ディレクトリ}"

# blog
node scripts/microcms-staff-blog-post.js "public/staff/{ディレクトリ}"

# doctor_blog
node scripts/microcms-doctor-blog-post.js "public/doctor/{ディレクトリ}"
```

### Step 7: インデックス更新

投稿完了後、以下を更新する：
- 各タイプの個別INDEX（`COLUMN_INDEX.md` / `CASE_INDEX.md` / `STAFF_INDEX.md` / `DOCTOR_INDEX.md`）
- `public/ARTICLE_INDEX.md`（統合インデックス）

### Step 8: urls.txt更新

`public/inbox/urls.txt` の処理済みURLを `# [完了:column] {url}` のように振り分けタイプ付きでコメントアウトする。
また、各タイプの個別 `urls.txt`（`public/column/urls.txt` 等）にも処理済みとして記録する。

### Step 9: 完了レポート

処理結果をまとめてユーザーに報告する：

```
完了レポート:
- 処理: 5件
  - column: 2件（guide-025, skin-012）
  - case: 2件（mouth-050, eye-015）
  - blog: 1件（staff-028）
- スキップ: 1件（ダウンロード失敗）
- CMS投稿: 5件完了
```

---

## 並列処理

同じタイプの記事が複数ある場合、サブエージェントを使って並列生成してよい。ただし：
- microCMS投稿は順次実行（レートリミット対策で3秒間隔）
- インデックス更新は全件完了後にまとめて実行

---

## エラーハンドリング

- ダウンロード失敗 → スキップして次へ
- 振り分け不明 → ユーザーに確認
- 記事生成失敗 → エラーログを出して次へ
- CMS投稿失敗（429） → 10秒待ってリトライ
- CMS投稿失敗（その他） → エラーログを出して次へ

---

## 注意事項

- 本文は**Markdownのまま保存**。HTML変換しない
- 医療広告ガイドライン遵守（断定表現禁止、効果保証禁止）
- 料金情報は記事に記載しない（Supabase管理）
- 画像はManagement APIでアップロードしてURLを差し替え
