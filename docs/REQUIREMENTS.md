# Maison PUREJU 新サイト 要件定義書

## プロジェクト概要

**対象：** mpureju.com（銀座・美容外科クリニック）
**目的：** 現WordPress サイト（254ページ）を刷新し、SEO・CVR・管理効率を大幅改善する
**方針：** 新規ドメインに新規構築（既存サイトとは別に開発）

---

## 技術スタック

| 項目 | 採用技術 | 備考 |
|------|----------|------|
| Framework | Next.js 16 (App Router) | TypeScript必須 |
| Styling | Tailwind CSS v4 | |
| CMS | microCMS | コンテンツ全般を管理 |
| DB / Backend | Supabase | 管理機能・動的データ |
| Hosting | Vercel | |
| 予約システム | Medicalforce（外部） | 自前では作らない |
| アクセス解析 | Google Analytics 4 | |
| AI Chatbot | DeepSeek API | Phase 3以降 |

---

## microCMS スキーマ設計

| # | API名（日本語） | エンドポイント | 用途 | 主なフィールド |
|---|----------------|--------------|------|----------------|
| 1 | 施術情報 | `treatments` | 施術詳細ページのコンテンツ管理 | title, slug, pillar, catch_copy, description, recommended_for, procedure_flow, doctor_comment, hero_image, risks, downtime_min_days, downtime_max_days ※全フィールド必須。**料金は別API `prices` で管理**（後述） |
| 2 | 症例記事 | `cases` | 記事形式の症例コンテンツ。サムネ+本文で編集自由度を確保 | title, slug, thumbnail, category, treatment（relation）, age_group, gender, concern, content（richtext）, before_photo, after_photo, published_at |
| 3 | お知らせ | `news` | クリニックからのお知らせ | title, content, category（notice/explanation/price-change）, thumbnail, published_at |
| 4 | コラム記事 | `columns` | ブログ・読み物コンテンツ | title, slug, content, category, thumbnail, tags[], published_at |
| 5 | 院長プロフィール | `doctor` | 院長紹介ページ・Message セクション | name, title, photo, profile, message, career, qualifications[], media_appearances[], kol_activities |
| 6 | キャンペーン | `campaigns` | Campaign Bannerの管理 + 施術ページのサイドバー表示 | title, image, link_url, start_date, end_date, is_active, **related_treatments[]**（treatmentsへのリレーション） |
| 7 | よくある質問 | `faqs` | サイト表示用FAQ（ピラーページ・FAQページ） | question, answer, category（mouth/eye/nose/lift/skin/general/price/booking/recruit）, sort_order |
| 8 | セットコース | `setcourses` | 悩み別の施術組み合わせ提案 | title, tagline, concern, category, treatments[]（relation）, is_same_day, before_photo, after_photo, is_popular |
| 9 | スタッフ | `staff` | `/doctor/` ページのスタッフ紹介 + Team Slideの写真 | name, role（例：形成外科専門医・看護師等）, photo, profile, action_photos[]（施術中の様子）, sort_order |
| 10 | SNSメディア | `media` | トップページのMedia セクション。InstagramリールとYouTube動画のサムネイル + リンクを管理 | platform（`instagram` / `youtube`）, title（説明文・YouTube用）, thumbnail（MicroCMSImage）, url（投稿URL）, published_at |
| 11 | ~~採用情報~~ | ~~`recruit`~~ | **廃止** — 職種が3つのみのためハードコード運用に変更。APIは削除済み | — |
| 12 | スタッフブログ | `staff_blog` | `/recruit/staff-blog/` 採用ページ内のスタッフブログ | title, slug, thumbnail, body（richtext）, category[], published_at |
| 13 | 医療機器 | `machines` | `/machine/` 医療機器一覧・詳細ページ。フラットグリッド表示（カテゴリ廃止） | name, name_en, slug, thumbnail, type, catch_copy, target_concerns, description（richtext）, sort_order |
| 14 | 内服薬 | `medicines` | `/medicine/` 内服薬一覧・詳細ページ（予定）。現在はハードコード運用 | name, slug, category, catch_copy, description（richtext）, usage, side_effects, contraindications, sort_order |

> **⚠️ 料金の管理方針（重要・設計変更）：**
> 料金は `treatments` 内の繰り返しフィールドではなく、**独立した microCMS API `prices`（予定）で管理する**。
> - `prices` API から treatments へコンテンツ参照でリレーション（1施術 : N料金プラン）
> - `/price/` ページ → `prices` API を直接取得
> - 施術詳細ページ → 該当 treatment に紐づく prices を取得（2回のAPI呼び出し）
> - 施術一覧・ピラーページ → 必要に応じて prices を取得
> - **料金の更新は `prices` API のみで完結**する（treatments を編集する必要なし）
>
> ※ `prices` API のスキーマ設計は未確定。確定次第このドキュメントを更新すること。
>
> **症例写真の管理方針：** `cases` の `before_photo` と `after_photo` は結合済み画像ではなく**別フィールドで個別管理**する。理由：①画像編集ソフト不要でそのままアップロード可能、②片方だけの差し替えが容易、③フロント側でホバー切替・左右スライダー比較など表示パターンを柔軟に変えられる。`setcourses` の before/after も同様。
>
> **チャットボットのプロンプト・RAGナレッジはmicroCMSで管理しない。** Supabaseテーブルで直接管理し、管理画面からCRUD操作する。

### treatments 詳細スキーマ

| # | フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|---|
| 1 | `title` | 施術名 | テキストフィールド | ✅ | |
| 2 | `slug` | URLスラッグ | テキストフィールド | ✅ | |
| 3 | `pillar` | 部位 | セレクトフィールド | ✅ | mouth / eye / nose / lift / skin |
| 4 | `catch_copy` | キャッチコピー | テキストフィールド | ✅ | 施術一覧・ピラーページで表示 |
| 5 | `description` | 施術説明 | リッチエディタ | ✅ | |
| 6 | `recommended_for` | こんな方におすすめ | リッチエディタ | ✅ | 箇条書き想定 |
| 7 | `procedure_flow` | 施術の流れ | リッチエディタ | ✅ | カウンセリング→施術→アフターケア等 |
| 8 | `doctor_comment` | ドクターコメント | テキストエリア | ✅ | |
| 9 | `hero_image` | メイン画像 | 画像 | ✅ | |
| 10 | `risks` | リスク・副作用 | リッチエディタ | ✅ | |
| 11 | `downtime_min_days` | DT最小日数 | 数字 | ✅ | シミュレーター用 |
| 12 | `downtime_max_days` | DT最大日数 | 数字 | ✅ | シミュレーター用 |

> **⚠️ 旧スキーマからの変更点：**
> - `category` → `pillar` にリネーム（部位の意味をより明確に）
> - `catch_copy` を新規追加（施術一覧・カード表示用のキャッチコピー）
> - `thumbnail` → `hero_image` にリネーム（メイン画像としての用途を明確に）
> - `risks` をテキストエリア → **リッチエディタ** に変更（箇条書き・太字等の書式が必要なため）
> - `price_options[]` を削除 → **独立 API `prices` に分離**（後述）
> - `downtime_milestones[]` は API 作成後にカスタムフィールド/繰り返しフィールドとして追加予定
> - **全フィールドを必須に設定**（下書き段階でも全項目入力を運用ルールとする）

### ~~recruit 詳細スキーマ~~ （廃止）

> **変更理由：** 募集職種が3つ（看護師・受付カウンセラー・広報）のみのため、microCMS管理は過剰と判断。`app/recruit/page.tsx` 内にハードコードで運用。APIエンドポイントは削除済み。

### staff_blog 詳細スキーマ

| # | フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|---|
| 1 | `title` | タイトル | テキストフィールド | ✅ | |
| 2 | `slug` | URLスラッグ | テキストフィールド | ✅ | |
| 3 | `thumbnail` | サムネイル | 画像 | ✅ | |
| 4 | `body` | 本文 | リッチエディタ | ✅ | |
| 5 | `category` | カテゴリ | セレクトフィールド（複数） | ❌ | |
| 6 | `published_at` | 公開日 | 日時 | ✅ | |

### machines 詳細スキーマ

> **設計変更（2026-03-24）：** `category` フィールドを廃止し、`target_concerns` を追加。一覧ページのカテゴリグルーピングを廃止しフラットグリッド表示に変更。理由：10台程度のマシン数ではカテゴリ分けが不要、1台しかないカテゴリが多く意味が薄い。`type` で技術種別、`target_concerns` でお悩みタグを表示。

| # | フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|---|
| 1 | `name` | マシン名 | テキストフィールド | ✅ | 例: ウルトラセルzi |
| 2 | `name_en` | マシン名（英語） | テキストフィールド | ✅ | 例: ULTRAcel zi |
| 3 | `slug` | スラッグ | テキストフィールド | ✅ | URL用。例: `ultracel-zi` → `/machine/ultracel-zi` |
| 4 | `thumbnail` | サムネイル画像 | 画像 | ✅ | 16:9。一覧カード・詳細ページで使用 |
| 5 | `type` | 種別 | テキストフィールド | ✅ | HIFU / RF / ニードルRF / レーザー / CO2レーザー / 光治療 / LEDライト / エレクトロポレーション |
| 6 | `catch_copy` | キャッチコピー | テキストフィールド | ✅ | 1行の概要説明。meta descriptionにも使用 |
| 7 | `target_concerns` | 対象のお悩み | テキストフィールド | ❌ | 例: たるみ / 毛穴・ニキビ跡。一覧カードにタグ表示 |
| 8 | `description` | 詳細説明 | リッチエディタ | ✅ | 詳細ページの本文 |
| 9 | `sort_order` | 表示順 | 数値 | ❌ | 小さい順に表示。未入力は末尾 |

### machines データ一覧（10台）

| マシン名 | type | target_concerns |
|---|---|---|
| ウルトラセルzi | HIFU | たるみ |
| サーマジェン | RF | たるみ |
| XERF（ザーフ） | RF | たるみ |
| ポテンツァ | ニードルRF | 毛穴・ニキビ跡 |
| サーマニードル | ニードルRF | 毛穴・ニキビ跡 |
| Q+C | レーザー | シミ・くすみ・赤み |
| CO2レーザー | CO2レーザー | ホクロ・イボ |
| セレックV | 光治療 | 幅広いお悩み |
| KOライト | LEDライト | ダウンタイム軽減・ニキビ・発毛 |
| メソナJ | エレクトロポレーション | 乾燥・くすみ・赤み |

> **採用ページ共通コンテンツの扱い：**
> 院長メッセージ・全職種共通の福利厚生・選考フロー・FAQはコード側にハードコード。
> - 院長メッセージは `doctor` API から取得も可
> - 採用FAQは `faqs` API に `category: recruit` を追加して管理

---

## 開発参照ドキュメント（コンテンツ整備用）

施術名・料金データは microCMS 接続前の開発フェーズにおいて、以下のファイルで管理する。

| ファイル | 内容 | 用途 |
|---------|------|------|
| `docs/treatment-menu.md` | 施術名・概要・リスク副作用一覧 | 現行WordPressより抽出。施術コンテンツ整備・microCMS投入の起点。 |
| `docs/price-list.md` | 全施術・化粧品の料金一覧（税込） | WordPressコードエディタ出力から整理。microCMS `prices` API への投入データ。 |
| `docs/codeediter` | WordPressコードエディタ出力（raw） | 現行サイトの PRICE ページ ブロック構造そのまま。参照・検証のみ。直接編集不可。 |

**料金データの流れ:**

```
現行WordPress（ブロックエディタ）
  ↓ 手動抽出
docs/price-list.md（開発参照ドキュメント）
  ↓ microCMS 投入時に参照
microCMS prices API（本番単一ソース）← treatments へコンテンツ参照でリレーション
  ↓ API取得
/price/ ページ（prices 直接取得）
施術詳細ページ（treatments + 紐づく prices を取得）
```

> **注意:** `docs/price-list.md` はあくまで開発用の中間ドキュメント。microCMS 投入後は microCMS が正となる。料金変更は `prices` API のみを更新すること。

---

## 予約・問い合わせ導線

```
ユーザー
  ↓
各ページの [Web予約] ボタン
  └── Medicalforce（外部予約システム）← 予約はすべてここで完結

[LINE相談] ボタン
  └── LINE公式アカウント → 最終的にMedicalforceで予約

[お問い合わせフォーム]（サイト内に新設）
  └── Supabase inquiries テーブルに保存
  └── 管理画面で一覧・ステータス管理
```

---

## Supabase 設計

### 役割分担
```
microCMS  → 施術情報・症例・コラム等（コンテンツ管理）
Supabase  → 問い合わせ・ログ・管理機能（アプリケーションデータ）
GA4       → PV・セッション等の基本アクセス解析
```

### テーブル設計

#### `inquiries`（問い合わせ管理）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| name | varchar | お名前 |
| email | varchar | メールアドレス |
| phone | varchar nullable | 電話番号 |
| subject | varchar | 件名 |
| message | text | 本文 |
| status | enum | `unread` / `in_progress` / `done` |
| assigned_to | UUID nullable | 担当スタッフ（auth.users参照） |
| created_at | timestamp | 受信日時 |
| updated_at | timestamp | 更新日時 |

#### `conversion_events`（重要イベント記録）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| event_type | enum | `booking_click` / `line_click` / `phone_click` |
| page_url | varchar | クリック元ページ |
| created_at | timestamp | 発生日時 |

> GA4でカバーしきれない「どのページから予約ボタンを押したか」等を自前で計測

#### `chat_sessions`（チャットボット・Phase 3用）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | セッションID（PK） |
| page_url | varchar | チャット開始ページ |
| user_agent | varchar | デバイス情報 |
| started_at | timestamp | 開始日時 |
| ended_at | timestamp nullable | 終了日時 |

#### `chat_messages`（チャットボット・Phase 3用）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| session_id | UUID | FK → chat_sessions |
| role | enum | `user` / `assistant` |
| content | text | メッセージ内容 |
| created_at | timestamp | 送信日時 |

#### `chatbot_knowledge`（RAGナレッジ・Phase 3用）
> `chatbot_faqs` は廃止。FAQも含めすべてのナレッジをこのテーブルに統一。
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| title | varchar | ナレッジのタイトル（管理用） |
| content | text | チャンク単位のテキスト |
| category | varchar | 料金 / 予約 / 施術 / クリニック情報 等 |
| is_active | boolean | 有効/無効 |
| created_at | timestamp | |
| updated_at | timestamp | |

#### `chatbot_prompts`（プロンプト管理・Phase 3用）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| name | varchar | 識別名（例：`system_prompt` / `medical_guidelines`） |
| content | text | プロンプト本文 |
| is_active | boolean | 有効/無効 |
| version | integer | 変更履歴用バージョン番号 |
| updated_at | timestamp | |

#### `knowledge_embeddings`（RAGベクトルDB・Phase 3用）
| カラム | 型 | 説明 |
|--------|----|------|
| id | UUID | PK |
| knowledge_id | UUID | FK → chatbot_knowledge |
| content | text | 元テキスト（検索結果として返す） |
| embedding | vector(1536) | ベクトル（pgvector拡張） |
| updated_at | timestamp | knowledge更新時に自動再生成 |

### チャットボットRAGアーキテクチャ（Phase 3）
```
【ナレッジ登録フロー】
管理画面でchatbot_knowledgeを追加・編集
  ↓ 保存時にSupabase Edge Functionをトリガー
  ↓ Embedding APIでベクトル化
knowledge_embeddings テーブルにupsert

【応答フロー】
ユーザーの質問
  ↓ ベクトル化
pgvectorで類似度検索（Supabase）
  ↓ 関連チャンク上位N件 + chatbot_prompts（active）を取得
DeepSeek APIへ（システムプロンプト + コンテキスト + 質問）
  ↓
回答 → chat_messagesテーブルに保存
```
> microCMSは一切介在しない。すべてSupabase + 管理画面で完結。

### 管理画面（Next.js内 `/admin/`）

**Phase 1から実装：**
- **認証：** Supabase Auth（メール＋パスワード）
- **問い合わせ一覧：** ステータス管理・担当割り当て

**Phase 3で追加：**
- **会話ログ：** セッション一覧・メッセージ履歴確認
- **ナレッジ管理：** chatbot_knowledgeのCRUD・embedding再生成
- **プロンプト管理：** chatbot_promptsの編集・バージョン確認

---

## サイト構造（全体）

```
/                     トップページ
/price/               料金表
/contact/             予約・お問い合わせ（Medicalforce / LINEへ誘導）

/mouth/               口元 [ピラーページ]
  /mouth/corner-lip-lift/    口角挙上
  /mouth/m-lip/       M字リップ
  /mouth/philtrum/    人中短縮
  /mouth/lip-reduction/ 口唇縮小
  /mouth/gummy-smile/ ガミースマイル
  /mouth/case/        口元症例一覧

/eye/                 目元 [ピラーページ]
  /eye/double-eyelid/ 二重整形
  /eye/ptosis/        眼瞼下垂
  /eye/brow-lift/     眉下切開
  /eye/under-eye/     目の下のたるみ・クマ
  /eye/epicanthoplasty/ 目頭切開
  /eye/case/          目元症例一覧

/nose/                鼻 [ピラーページ]
  /nose/implant/      プロテーゼ
  /nose/tip/          鼻尖形成
  /nose/alar/         鼻翼縮小
  /nose/septum/       鼻中隔
  /nose/case/         鼻症例一覧

/lift/                リフトアップ [ピラーページ]
  /lift/thread/       糸リフト
  /lift/sofwave/      ソフウェーブ
  /lift/hifu/         HIFU
  /lift/case/         リフトアップ症例一覧

/skin/                美容皮膚科 [ピラーページ]
  /skin/potenza/      ポテンツァ
  /skin/injection/    注入治療
  /skin/laser/        レーザー治療
  /skin/case/         皮膚科症例一覧

/treatment/           施術一覧（全施術を横断的に掲載）← 「施術名から探す」のリンク先
/simulator/           料金・ダウンタイムシミュレーター（独立ページ）

/case/                症例写真総合（フィルター検索）
/doctor/              院長紹介・実績
/column/              コラム・FAQ
  /column/faq/        よくある質問
/news/                お知らせ
/contact/             お問い合わせ（フォーム + LINE/Medicalforceへの誘導）
/machine/             医療機器一覧（カテゴリ別カードグリッド）
/machine/[slug]/      医療機器詳細
/recruit/             採用情報一覧
/recruit/[slug]/      求人詳細
/about/               クリニック紹介・院長・アクセス統合
/reservation/         予約ガイド（Web予約・LINE予約・電話の手順・初診の流れ）
/first-visit/         初めての方へ（カウンセリングの流れ・当日の持ち物・注意事項）
/aftercare/           アフターケアガイド（施術後の過ごし方・緊急連絡先）
/commitment/          当院のこだわり（衛生管理・使用機器・麻酔方針）
/comparison/          施術比較（埋没 vs 切開、糸リフト vs 切開リフト等）
/payment/             お支払い方法（クレジット・医療ローン詳細・分割シミュレーション）
/glossary/            美容医療用語集（SEOロングテール狙い）
/campaign/            キャンペーン一覧
/monitor/             モニター募集（割引条件・対象施術・応募フォーム）
/sitemap/             サイトマップ
```

---

## トップページ ナビゲーション設計

### 「お悩みから探す」と「施術名から探す」の導線統一

どちらのセクションからも、最終的に**同じ施術詳細ページ**に辿り着く設計とする。

```
お悩みから探す（顔SVG インタラクティブUI）
  └→ 部位クリック（例: 口元）→ /mouth/（ピラーページ）
       └→ ピラーページ内の施術リスト → /mouth/corner-lip-lift/ 等（施術詳細）

施術名から探す（タブUI）
  └→ 口元タブ → 「口角挙上」クリック → /mouth/corner-lip-lift/（施術詳細）
```

### 施術詳細ページのURL設計

| 種別 | URL形式 | 例 |
|-----|--------|----|
| ピラー主要施術 | `/[pillar]/[slug]/` | `/mouth/corner-lip-lift/` |
| その他全施術 | `/treatment/[slug]/` | `/treatment/peanut-lip/` |

**ピラー主要施術（定義済みURL）:**
- 口元: `/mouth/corner-lip-lift` `/mouth/m-lip` `/mouth/philtrum` `/mouth/lip-reduction` `/mouth/gummy-smile`
- 目元: `/eye/double-eyelid` `/eye/ptosis` `/eye/brow-lift` `/eye/under-eye` `/eye/epicanthoplasty`
- 鼻: `/nose/implant` `/nose/tip` `/nose/alar` `/nose/septum`
- リフトアップ: `/lift/thread` `/lift/sofwave` `/lift/hifu`
- 美容皮膚科: `/skin/potenza` `/skin/injection` `/skin/laser`

**上記以外の施術**（ハムラ法・脂肪吸引・ピーリング等）は `/treatment/[slug]/` を使用。

### Phase別対応

| Phase | 状態 |
|-------|------|
| Phase 1 | 施術詳細ページ未実装。タブのリンクは404になるが許容。 |
| Phase 2 | 全施術詳細ページを実装。microCMS `treatments` スキーマと連携。TreatmentTabsも動的取得に切り替え。 |

---

## ページ別セクション構成

### トップページ（`/`）
> 参考デザイン：LIANクリニック（上品・清潔感・ベージュトーン）

| # | セクション | 内容 |
|---|-----------|------|
| 1 | **Hero** | クリニック内観写真・ロゴ・グローバルナビ |
| 2 | **Campaign Banner** | キャンペーンのバナー画像（横幅全体 or カード型）。複数ある場合はスライダー対応 |
| 3 | **お悩みから探す（Face Menu）** | 顔写真に各部位へのラベルを線で繋いだインタラクティブUI。ラベルをクリックすると各ピラーページへ遷移。対象部位：目元 / 鼻 / 口元 / リフトアップ・たるみ / 美容皮膚科。実装：SVGまたはCSSの絶対配置でラベルを顔写真上に配置、線はSVG lineで描画。スマホでは縦並びリストに切り替え。 |
| 4 | **施術名から探す** | **タブUI**（口元 / 目元 / 鼻 / リフトアップ / 美容皮膚科）。タブ切替で各カテゴリの施術名リストを表示。各施術名リンクの遷移先は下記「ナビゲーション設計」を参照。Phase 1では詳細ページ未実装のため一部404となるが許容。 |
| 5 | **症例実績（Case Results）** | Phase 1ではUIブロック・カルーセルの枠のみ実装。コンテンツはmicroCMS（casesスキーマ）から取得する構造を用意し、データは後からインポート。部位別タブ（口元/目元/鼻/リフト/皮膚科）→ /case/ |
| 6 | **Media** | 雑誌掲載・TV出演・KOL実績など |
| 7 | **内観フルワイド写真** | クリニック内装の全幅写真 |
| 8 | **Value** | 選ばれる理由4項目：形成外科専門医 / 完全個室 / 銀座 / こだわりの技術 |
| 9 | **Message** | 廣瀬院長の写真 + メッセージ文 |
| 10 | **Team Slide** | セクションタイトル（例：「Introduction of our Team」）+ 説明文 + `staff.action_photos[]` から取得したアクションショットを横方向に無限ループ表示。実装：CSS animation（translateX）または Embla Carousel等で無限ループ。 |
| 11 | **News** | 最新お知らせ3〜5件 → /news/ |
| 12 | **内観フルワイド写真②** | 別アングルのクリニック内装 |
| 13 | **Access** | 地図・最寄駅・診療時間・休診日 |
| 14 | **Reserve CTA** | [LINE相談] [Web予約] ボタン |
| 15 | **Footer** | サイトマップ・各種リンク |

---

### ピラーページ共通（`/mouth/` `/eye/` `/nose/` `/lift/` `/skin/`）

| # | セクション | 内容 |
|---|-----------|------|
| 1 | **Hero** | 部位タイトル + キャッチコピー + 症例数などの実績 |
| 2 | **こんなお悩みの方へ** | 悩み別タグ一覧（旧troubleページをここに統合） |
| 3 | **施術一覧** | 各施術カード（施術名・概要・料金目安）→ 各詳細ページ（Phase 2） |
| 4 | **おすすめセットコース** | `setcourses` から該当カテゴリのコースを表示。悩み×セット施術の組み合わせ提案 |
| 5 | **施術の選び方** | 悩み × 施術の対応表 |
| 6 | **シミュレーター（埋め込み）** | 料金・ダウンタイムシミュレーターをこのページの部位施術に絞って表示。`/simulator/` へのリンクも併設 |
| 7 | **院長のこだわり** | 形成外科的アプローチの説明 + 廣瀬院長コメント・写真 |
| 8 | **症例写真** | この部位の厳選ケース数件 → /[部位]/case/ |
| 9 | **よくある質問** | この部位に関するQ&A（5〜8問） |
| 10 | **CTA** | 「まずはカウンセリングから」[LINE相談] [Web予約] |

---

### ドクター・スタッフページ（`/doctor/`）

| # | セクション | 内容・データソース |
|---|-----------|----------------|
| 1 | **Hero** | ページタイトル + クリニックのキャッチコピー |
| 2 | **クリニック紹介** | Maison PUREJUのコンセプト・理念・施設紹介。内観写真複数枚 |
| 3 | **院長紹介** | `doctor` スキーマから取得。写真・経歴・専門医資格・メディア実績・KOL活動 |
| 4 | **スタッフ紹介** | `staff` スキーマから取得。メンバー一覧（顔写真・名前・役職・一言プロフィール） |
| 5 | **CTA** | [LINE相談] [Web予約] |

---

### 料金一覧（`/price/`）

| # | セクション | 内容 |
|---|-----------|------|
| 1 | **ヘッダー** | 「施術料金表」タイトル + 「すべて税込総額表示」の明記 |
| 2 | **カテゴリ別料金表** | 口元 / 目元 / 鼻 / リフトアップ / 美容皮膚科 / 内服薬 |
| 3 | **注意事項** | 麻酔・オプション等の補足・モニター価格案内 |
| 4 | **お支払い方法** | クレジットカード・医療ローン等 |
| 5 | **医療費控除** | 医療費控除の対象について |
| 6 | **CTA** | 「詳細はカウンセリングで」[Web予約] [LINE相談] |

---

## フェーズ計画

### Phase 1（現在のスコープ）

**実装済み:**
- [x] プロジェクト初期設定（Next.js + microCMS + Supabase + Tailwind）
- [x] 環境変数設定（Vercel）
- [x] 共通レイアウト（Header・Footer・スマホ固定フッター）
- [x] グローバルナビゲーション（メガメニュー）
- [x] トップページ（`/`）
- [x] 口元ピラーページ（`/mouth/`）
- [x] 目元ピラーページ（`/eye/`）
- [x] 鼻ピラーページ（`/nose/`）
- [x] リフトアップピラーページ（`/lift/`）
- [x] 美容皮膚科ピラーページ（`/skin/`）
- [x] 施術一覧ページ（`/treatment/`）
- [x] シミュレーターページ（`/simulator/`）
- [x] 料金一覧ページ（`/price/`）
- [x] お問い合わせページ（`/contact/`）
- [x] お知らせ一覧（`/news/`）・詳細（`/news/[slug]/`）
- [x] 検索ページ（`/search/`）
- [x] 採用情報（`/recruit/`）※職種はハードコード運用
- [x] エントリーフォーム（`/recruit/entry/`）
- [x] スタッフブログ一覧・詳細（`/recruit/staff-blog/`）
- [x] よくあるご質問（`/column/faq/`）
- [x] プライバシーポリシー（`/privacy`）
- [x] 医療広告ガイドライン（`/medical-guidelines`）
- [x] キャンセルポリシー（`/cancel-policy`）
- [x] 特定商取引法（`/legal`）

**未実装:**
- [ ] 管理画面ベース（`/admin/`）認証 + 問い合わせ管理
- [ ] Supabase inquiries 連携（お問い合わせ・エントリーフォーム）

### Phase 1.5（追加ページ — ハードコードで先行実装）

| ページ | 優先度 | 内容 |
|--------|--------|------|
| `/about/` | 高 | クリニック紹介・アクセス（院内写真、地図、理念） |
| `/doctor/` | 高 | 院長・スタッフ紹介（経歴、資格、メッセージ） |
| `/reservation/` | 高 | 予約ガイド（Web予約・LINE予約・電話の手順、初診の流れ、持ち物） |
| `/first-visit/` | 高 | 初めての方へ（カウンセリングの流れ、当日の流れ、所要時間、注意事項） |
| `/payment/` | 中 | お支払い方法（クレジット・医療ローン詳細・分割シミュレーション） |
| `/commitment/` | 中 | 当院のこだわり（衛生管理・使用機器・麻酔方針） |
| `/aftercare/` | 中 | アフターケアガイド（施術後の過ごし方・緊急連絡先） |
| `/comparison/` | 中 | 施術比較（埋没 vs 切開、糸リフト vs 切開リフト等） |
| `/campaign/` | 中 | キャンペーン一覧 |
| `/monitor/` | 低 | モニター募集（割引条件・対象施術・応募フォーム） |
| `/glossary/` | 低 | 美容医療用語集（SEOロングテール狙い） |

### Phase 2
- [ ] 施術詳細ページ（`/mouth/[slug]/` 全ピラー展開）
- [ ] コラム一覧・記事（`/column/`）
- [ ] microCMS `faqs` API 移行（ハードコード → CMS管理）

### Phase 3
- [ ] 症例写真フィルター機能（`/case/`・`/[pillar]/case/`）
- [ ] AIチャットボット（DeepSeek API + Supabase pgvector）
- [ ] 管理画面（`/admin/`）チャットボットFAQ・会話ログ

---

## フッター設計
> 参考デザイン：LIANクリニック（ダークブラウン背景・エレガントな3カラム構成）

### レイアウト構造

```
┌─────────────────────────────────────────────────────────┐
│  [LINE予約ボタン]                            （右上固定）  │
├──────────────────┬──────────────────┬───────────────────┤
│  Col 1           │  Col 2（Menu）   │  Col 3            │
│                  │                  │                   │
│  News            │ お悩みから探す   │ Simulation        │
│  Doctor          │ ─────────────    │ Reservation       │
│  Price           │ 口元が気になる   │ Contact           │
│  Case            │ 目元を変えたい   │                   │
│  Access          │ 鼻を整えたい     │ プライバシーポリシー│
│  Column          │ たるみ・リフト   │ 医療広告ガイドライン│
│  Simulator       │ 肌トラブル       │ キャンセルポリシー │
│  Recruit         │                  │                   │
│                  │                  │ 特定商取引法に基づく│
│                  │ 施術から探す     │ 表示              │
│                  │ ─────────────    │                   │
│                  │ 口元の施術  ＋   │ [Instagram]       │
│                  │ 目元の施術  ＋   │ [YouTube]         │
│                  │ 鼻の施術    ＋   │ [X]               │
│                  │ リフトアップ ＋  │ [LINE]            │
│                  │ 美容皮膚科  ＋   │                   │
│                  │                  │                   │
│                  │ [すべての施術一覧]│                   │
├──────────────────┴──────────────────┴───────────────────┤
│  [Maison PUREJU ロゴ]                                    │
│  〒104-0061 東京都中央区銀座○-○-○  Google Maps          │
└─────────────────────────────────────────────────────────┘
```

### デザイン仕様
- **背景色：** ダークブラウン系（LIANに準じた上質感）
- **文字色：** オフホワイト
- **タイポグラフィ：** Col 1・3のメインリンクは大きめのセリフ or サンセリフ、サブリンクは小さめ
- **施術から探す：** `+` アイコン付き（アコーディオン展開 or `/treatment/` への各カテゴリリンク）
- **SNSアイコン：** Instagram / YouTube / X（Twitter） / LINE の4つ

### スマホ対応
- 3カラム → 縦1カラムに折りたたみ
- Menuセクションはアコーディオンで展開

---

## ナビゲーション設計

### PC：メガメニュー
```
[口元] [目元] [鼻] [リフトアップ] [美容皮膚科] [症例写真] [料金表] [院長紹介] [予約 ←赤ボタン]
```
各カテゴリをホバーするとサブメニュー（施術一覧・症例へのリンク）が展開

### スマホ：画面下部固定フッター（4ボタン）
```
[LINE相談] [Web予約] [電話] [メニュー]
```

---

## SEO方針

- **3階層以内**にすべてのページを収める
- ピラーページ + 施術詳細ページの**トピッククラスター構造**
- 悩み別ページは各ピラーページ内の「こんなお悩みの方へ」セクションに統合（個別ページとしては作らない）
- 各施術ページには施術名を含む明確なtitle/meta
- 症例ページは構造化データ対応（Phase 3）

---

## デザイン方針

- 既存サイトのデザインは踏襲せず**新規デザイン**
- ブランドイメージ：上品・清潔感・信頼感（銀座のクリニック）
- カラー・フォント等は別途決定

---

## シミュレーター仕様

### 配置
- `/simulator/` — 独立ページ（全施術横断）
- 各ピラーページ内にも埋め込み（その部位の施術に絞った表示）

### 料金シミュレーター
- 施術をチェックボックスで複数選択
- `prices` API から該当施術の料金を取得し、合計金額レンジを自動計算して表示
- CTA：「この組み合わせでLINE相談する」「カウンセリングで詳細を確認する → Medicalforce」

### ダウンタイムシミュレーター（カレンダーUI）
- 「施術希望日（仮）」を日付ピッカーで入力
- 選択した施術のダウンタイムをもとに、カレンダー上に回復フェーズを色分け表示
  - 🔴 安静期間 / 🟡 経過期間（外出可・マスク推奨）/ 🟢 社会復帰 / ⭐ 完成目安
- マイルストーン一覧（洗顔・メイク・コンタクト・運動・飲酒・完成）を日付で表示
- 複数施術選択時は各マイルストーンの**最大値**を採用
- PC：月カレンダーグリッド / SP：横スクロールタイムライン

#### 重要：あくまで「仮定」として提示
> カレンダーはダウンタイムのシミュレーションです。
> 実際の予約可否はカウンセリング時にご確認ください。

- 入力欄：「施術希望日（仮）を入力」と明記
- CTAは「予約する」ではなく「この日程でLINE相談する」「カウンセリングで空き日程を確認する」

#### 使用ライブラリ
| 用途 | ライブラリ |
|------|-----------|
| カレンダーUI | `react-day-picker` |
| SPタイムライン | CSS + `framer-motion` |
| 日付計算 | `date-fns` |

### microCMSスキーマへの追加フィールド（API作成後に設定）

**`treatments` に追加（繰り返しフィールド）：**
- `downtime_milestones[]`: 繰り返しフィールド（label / days_after / description）
- ※ `downtime_min_days`, `downtime_max_days` は基本フィールドとして作成済み

**`setcourses`（新規スキーマ）：**
- title, tagline, concern（解決する悩み）
- category（mouth/eye/nose/lift/skin）
- treatments[]（treatmentsへのリレーション）
- is_same_day（同日施術可否フラグ）
- before_photo / after_photo
- is_popular（人気フラグ）

**`campaigns` に追加：**
- `related_treatments[]`（treatmentsへのリレーション）
- 施術ページを開いた時、紐づくキャンペーンをサイドバーに自動表示。未設定の場合は最新キャンペーンをデフォルト表示

### 施術ページのレイアウト（キャンペーンサイドバー）
```
┌──────────────────────┬─────────────────┐
│                      │ 🏷 今月のキャンペーン │
│  施術コンテンツ       │ [バナー画像]     │
│  （メインエリア）     │                 │
│                      │ ¥198,000        │
│                      │ → ¥158,000      │
│                      │ [詳細を見る]    │
│                      │                 │
│                      │ ← sticky表示    │
└──────────────────────┴─────────────────┘
```

---

## 環境変数（Vercel で管理）

| 変数名 | 用途 |
|--------|------|
| `MICROCMS_API_KEY` | microCMS APIキー |
| `MICROCMS_SERVICE_DOMAIN` | microCMSサービスドメイン |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー（クライアント用） |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase サービスロールキー（サーバー専用） |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 測定ID |
| `DEEPSEEK_API_KEY` | DeepSeek API キー（Phase 3） |
| `OPENAI_API_KEY` | Embedding生成用（Phase 3・pgvector用途のみ） |

> すべてVercelのEnvironment Variablesで管理。`NEXT_PUBLIC_` プレフィックスのある変数のみブラウザに公開される。

---

## 医療広告ガイドライン遵守事項

- 「絶対」「必ず」等の断定表現を使わない
- 効果を保証する表現を使わない
- Before/Afterは適切な注釈を付ける
- 料金は税込総額で明示

---

*作成日：2026-03-02*
