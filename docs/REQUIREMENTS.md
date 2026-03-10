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

| # | スキーマ名 | 用途 | 主なフィールド |
|---|-----------|------|----------------|
| 1 | **treatments**（施術情報） | 施術詳細ページ + 料金一覧の単一ソース | title, slug, category, description, doctor_comment, risks, thumbnail, price_options[]（name・price・note）, **downtime_min_days, downtime_max_days, downtime_milestones[]**（label・days_after・description） |
| 2 | **cases**（症例記事） | 記事形式の症例コンテンツ。サムネ+本文で編集自由度を確保 | title, slug, thumbnail, category, treatment（relation）, age_group, gender, concern, content（richtext）, before_photo, after_photo, published_at |
| 3 | **news**（お知らせ） | クリニックからのお知らせ | title, content, category（notice/explanation/price-change）, thumbnail, published_at |
| 4 | **columns**（コラム記事） | ブログ・読み物コンテンツ | title, slug, content, category, thumbnail, tags[], published_at |
| 5 | **doctor**（院長プロフィール） | 院長紹介ページ・Message セクション | name, title, photo, profile, message, career, qualifications[], media_appearances[], kol_activities |
| 6 | **campaigns**（キャンペーン） | Campaign Bannerの管理 + 施術ページのサイドバー表示 | title, image, link_url, start_date, end_date, is_active, **related_treatments[]**（treatmentsへのリレーション） |
| 7 | **faqs**（よくある質問） | サイト表示用FAQ（ピラーページ・FAQページ） | question, answer, category（mouth/eye/nose/lift/skin/general/price/booking）, sort_order |
| 8 | **setcourses**（セットコース） | 悩み別の施術組み合わせ提案 | title, tagline, concern, category, treatments[]（relation）, is_same_day, before_photo, after_photo, is_popular |
| 9 | **staff**（スタッフ） | `/doctor/` ページのスタッフ紹介 + Team Slideの写真 | name, role（例：形成外科専門医・看護師等）, photo, profile, action_photos[]（施術中の様子）, sort_order |
| 10 | **media**（SNSメディア） | トップページのMedia セクション。InstagramリールとYouTube動画のサムネイル + リンクを管理 | platform（`instagram` / `youtube`）, title（説明文・YouTube用）, thumbnail（MicroCMSImage）, url（投稿URL）, published_at |
| 11 | **jobs**（求人情報） | `/recruit/` 一覧・詳細ページのコンテンツ管理。職種ごとに記事形式で管理 | title, slug, employment_type（正社員/パート/業務委託）, description（richtext）, requirements（応募条件・richtext）, conditions（待遇・勤務条件・richtext）, is_active（募集中フラグ）, published_at |

> **料金の管理方針：** `treatments` の `price_options[]` が単一ソース。施術詳細ページと `/price/` 一覧ページの両方がこのデータを参照するため、更新箇所は1か所で済む。
>
> **症例写真の管理方針：** `cases` の `before_photo` と `after_photo` は結合済み画像ではなく**別フィールドで個別管理**する。理由：①画像編集ソフト不要でそのままアップロード可能、②片方だけの差し替えが容易、③フロント側でホバー切替・左右スライダー比較など表示パターンを柔軟に変えられる。`setcourses` の before/after も同様。
>
> **チャットボットのプロンプト・RAGナレッジはmicroCMSで管理しない。** Supabaseテーブルで直接管理し、管理画面からCRUD操作する。

---

## 開発参照ドキュメント（コンテンツ整備用）

施術名・料金データは microCMS 接続前の開発フェーズにおいて、以下のファイルで管理する。

| ファイル | 内容 | 用途 |
|---------|------|------|
| `docs/treatment-menu.md` | 施術名・概要・リスク副作用一覧 | 現行WordPressより抽出。施術コンテンツ整備・microCMS投入の起点。 |
| `docs/price-list.md` | 全施術・化粧品の料金一覧（税込） | WordPressコードエディタ出力から整理。microCMS `treatments.price_options[]` への投入データ。 |
| `docs/codeediter` | WordPressコードエディタ出力（raw） | 現行サイトの PRICE ページ ブロック構造そのまま。参照・検証のみ。直接編集不可。 |

**料金データの流れ:**

```
現行WordPress（ブロックエディタ）
  ↓ 手動抽出
docs/price-list.md（開発参照ドキュメント）
  ↓ microCMS 投入時に参照
microCMS treatments.price_options[]（本番単一ソース）
  ↓ API取得
/price/ ページ + 各施術詳細ページ（フロント表示）
```

> **注意:** `docs/price-list.md` はあくまで開発用の中間ドキュメント。microCMS 投入後は microCMS が正となる。料金変更は microCMS 側のみを更新すること。

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
  /mouth/lip-lift/    口角挙上
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
/recruit/             採用情報一覧
/recruit/[slug]/      求人詳細
/about/               クリニック紹介・院長・アクセス統合
/sitemap/             サイトマップ
```

---

## トップページ ナビゲーション設計

### 「お悩みから探す」と「施術名から探す」の導線統一

どちらのセクションからも、最終的に**同じ施術詳細ページ**に辿り着く設計とする。

```
お悩みから探す（顔SVG インタラクティブUI）
  └→ 部位クリック（例: 口元）→ /mouth/（ピラーページ）
       └→ ピラーページ内の施術リスト → /mouth/lip-lift/ 等（施術詳細）

施術名から探す（タブUI）
  └→ 口元タブ → 「口角挙上」クリック → /mouth/lip-lift/（施術詳細）
```

### 施術詳細ページのURL設計

| 種別 | URL形式 | 例 |
|-----|--------|----|
| ピラー主要施術 | `/[pillar]/[slug]/` | `/mouth/lip-lift/` |
| その他全施術 | `/treatment/[slug]/` | `/treatment/peanut-lip/` |

**ピラー主要施術（定義済みURL）:**
- 口元: `/mouth/lip-lift` `/mouth/m-lip` `/mouth/philtrum` `/mouth/lip-reduction` `/mouth/gummy-smile`
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
- [ ] プロジェクト初期設定（Next.js + microCMS + Supabase + Tailwind）
- [ ] 環境変数設定（Vercel）
- [ ] 共通レイアウト（Header・Footer・スマホ固定フッター）
- [ ] グローバルナビゲーション（メガメニュー）
- [ ] トップページ（`/`）
- [ ] 口元ピラーページ（`/mouth/`）
- [ ] 目元ピラーページ（`/eye/`）
- [ ] 鼻ピラーページ（`/nose/`）
- [ ] リフトアップピラーページ（`/lift/`）
- [ ] 美容皮膚科ピラーページ（`/skin/`）
- [ ] 施術一覧ページ（`/treatment/`）
- [ ] シミュレーターページ（`/simulator/`）
- [ ] 料金一覧ページ（`/price/`）
- [ ] お問い合わせページ（`/contact/`）+ Supabase inquiries 連携
- [ ] 管理画面ベース（`/admin/`）認証 + 問い合わせ管理

### Phase 2
- [ ] 施術詳細ページ（`/treatment/[slug]/` 全施術）
- [ ] 院長紹介（`/doctor/`）+ リクルートセクション
- [ ] コラム一覧・記事（`/column/`）
- [ ] クリニック紹介（`/about/`）
- [ ] 採用情報（`/recruit/`・`/recruit/[slug]/`）microCMS jobs スキーマ

### Phase 3
- [ ] 症例写真フィルター機能（`/case/`）
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
- `treatments.price_options[]` から合計金額レンジを自動計算して表示
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

### microCMSスキーマへの追加フィールド

**`treatments` に追加：**
- `downtime_min_days`: number
- `downtime_max_days`: number
- `downtime_milestones[]`: 繰り返しフィールド（label / days_after / description）

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
