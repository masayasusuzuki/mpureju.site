---
name: column-pipeline
description: Maison PUREJUのコラム記事を一括生成するパイプラインスキル。public/column/urls.txtを読み込み、未処理のディレクトリに対してInstagramダウンロード→記事生成→microCMS即公開を自律的に順番に実行する。「コラムをまとめて作って」「パイプラインを実行して」「urls.txtの記事を処理して」と言われたときに使用する。
---

# Column Pipeline

`public/column/urls.txt` に記載されたInstagram URLを元に、ダウンロードから記事生成まで自律的に実行するスキル。

---

## ワークフロー

### Step 1: urls.txt を読み込む

`public/column/urls.txt` を読み込み、コメント行（`#` 始まり）と空行を除いたURLを順番に取得する。

形式はURLのみ（1行1件）:
```
https://www.instagram.com/reel/XXXX/
https://www.instagram.com/p/YYYY/
```

### Step 2: 空きディレクトリとURLを対応付ける

`public/column/` 配下のディレクトリを番号順にスキャンし、以下の条件を満たすものを「空きディレクトリ」として収集する:
- ディレクトリ名が数字のみ（例: `005`, `006`）
- `article.md` が存在しない
- 画像・動画ファイルが1件もない

収集した空きディレクトリに、urls.txtのURLを**上から順に1対1で割り当てる**。

例:
```
005 ← https://www.instagram.com/reel/AAA/
006 ← https://www.instagram.com/reel/BBB/
007 ← https://www.instagram.com/p/CCC/
```

### Step 3: 未処理エントリを1件ずつ処理する

対象エントリを**1件ずつ順番に**以下を実行する。並列実行はしない。

#### 3-1. Instagram ダウンロード

メディアファイル（jpg/mp4）が1件もない場合のみ実行する（すでにある場合はスキップ）。

```bash
bash scripts/instagram-dl.sh {URL} {割り当て番号}
```

実行後、`public/column/{番号}/` に以下が揃っているか確認する:
- 画像ファイル（image_1.jpg 等）または動画（video_1.mp4）
- caption.txt（投稿文）

ダウンロードに失敗した場合は、エラーをユーザーに報告してその番号をスキップし、次のエントリへ進む。

#### 3-2. 記事生成

`column-article-creator` スキルのワークフロー（Step 2〜8）をそのまま実行する。

**ただし以下を補足適用する:**
- `caption.txt` が存在する場合、それをInstagramキャプション（投稿文の原文）として記事の骨格に使用する
- `instagram_url` フィールドには urls.txt から取得したURLを自動で入力する
- ディレクトリのリネームも自動で行う

#### 3-3. microCMS投稿

記事生成・ディレクトリリネーム完了後、以下のコマンドで即公開する。

```bash
export $(grep -v '^#' .env.local | grep -v '^image' | xargs) && node scripts/microcms-post.js "public/column/{リネーム後のディレクトリパス}" "{InstagramURL}"
```

`microcms-post.js` は以下を自動で処理する：
- `thumbnail` フィールド: frontmatterで指定した画像をアップロード
- `images` フィールド: ディレクトリ内のサムネ以外の画像（`.jpg/.jpeg/.png`）をすべて番号順にアップロード

第2引数にInstagramURLを渡すことで、投稿成功後に `urls.txt` の該当行が `# [完了] {url}` に自動更新される。

- 成功した場合: microCMSのコンテンツIDとURLをログに出力する
- 失敗した場合: エラー内容をユーザーに報告し、そのエントリをスキップして次へ進む

#### 3-4. 完了報告

1件の処理が完了したら以下を報告する:
```
✅ [{番号}] 完了
   タイトル: {article.mdのtitle}
   slug: {slug}
   ディレクトリ: public/column/{番号_タイトル}/
   microCMS: 公開済み（ID: {content_id}）
```

### Step 4: 全件完了後にサマリーを出力する

```
================================================
 パイプライン完了
================================================
処理済み: X 件
スキップ: X 件（処理済み or URL未設定）
エラー:   X 件

【公開済み記事】
- {番号}: slug={slug}  https://app.microcms.io/services/mpureju/apis/columns/editor/{id}
...
```

---

## 注意事項

- Instagramがログインを要求してダウンロードに失敗した場合は、そのエントリをスキップして続行する
- 記事生成は1件ずつ行う（コンテキストが混在しないように）
- COLUMN_INDEX.md の更新も各記事生成時に必ず行う
- urls.txt のコメントアウト（処理済みマーク）は行わない。ディレクトリのリネームが「処理済み」の証跡になる
