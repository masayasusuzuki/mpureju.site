# プロジェクト全体像 — Maison PUREJU サイト

最終更新: 2026-03-27

---

## 現状サマリー

| カテゴリ | 完了 | 一部完了 | 未着手 |
|---------|------|---------|--------|
| ページ実装 | 25 | 6 | 14 |
| microCMS API接続 | 7/16 | 1 | 8 |
| Supabaseバックエンド | 1/8 | 0 | 7 |
| SEO・インフラ | 0/11 | 1 | 10 |

---

## Phase 1 残作業（見積: 8〜12日）

| タスク | 内容 | 見積 |
|--------|------|------|
| 内服薬 microCMS接続 | `/medicine/` と `/medicine/[slug]/` をmicroCMSから動的取得に切替 | 0.5日 |
| スタッフブログ一覧 | `/recruit/staff-blog/` 一覧ページ作成（詳細は実装済み） | 0.5日 |
| 院長・スタッフ紹介 | `/doctor/` ページ新規作成 + microCMS `doctor`/`staff` APIスキーマ設計 | 1.5日 |
| FAQ microCMS移行 | `/column/faq/` をハードコード → microCMS `faqs` APIへ | 1日 |
| Supabase テーブル作成 | `inquiries`, `conversion_events` テーブル + RLS設定 | 0.5日 |
| お問い合わせAPI | `/api/contact` エンドポイント + ContactFormとの接続 | 1日 |
| 採用エントリーAPI | `/api/recruit/entry` エンドポイント + FormとSupabase接続 | 1日 |
| 営業カレンダー | microCMS `clinic_calendar` API設計 + ウィジェットコンポーネント実装 | 1.5日 |
| レスポンシブ確認・修正 | 全実装済みページのSP/タブレット表示チェック＆修正 | 2日 |
| 写真プレースホルダー差替 | 仮画像を実写真に差替え（素材提供後） | 1日 |

---

## Phase 2 残作業（見積: 15〜20日）

| タスク | 内容 | 見積 |
|--------|------|------|
| クリニック紹介 | `/about/` — Google Maps埋め込み・内観写真・アクセス情報 | 1.5日 |
| コラム一覧・詳細 | `/column/`, `/column/[slug]/` + microCMS `columns` APIスキーマ設計・接続 | 2日 |
| 症例写真（全体） | `/case/` — microCMS `cases` API接続 + フィルターUI（部位・施術） | 2.5日 |
| 部位別症例 | `/[pillar]/case/` × 5ページ — pillarフィルター付き | 1日 |
| お支払い方法 | `/payment/` — 医療ローン詳細・支払い手段説明 | 0.5日 |
| 当院のこだわり | `/commitment/` — 衛生管理・使用機器・麻酔方針 | 1日 |
| アフターケア | `/aftercare/` — 施術後の過ごし方ガイド | 0.5日 |
| 施術比較 | `/comparison/` — 埋没vs切開等のテーブル比較 | 1日 |
| モニター募集 | `/monitor/` — 応募フォーム含む | 1日 |
| 用語集 | `/glossary/` — SEOロングテール用 | 1日 |
| キャンペーン一覧 | `/campaign/` — microCMS `campaigns`は接続済み、一覧ページのみ | 0.5日 |
| 料金 microCMS移行 | `prices` APIスキーマ設計 + `/price/` のハードコード → 動的取得 | 2日 |
| セットコース | microCMS `setcourses` API設計 + ピラーページへの組み込み | 1日 |
| 管理画面（基盤） | `/admin/` ログイン + 問い合わせ管理画面 | 2.5日 |

---

## Phase 3 残作業 — AIチャットボット（見積: 10〜15日）

| タスク | 内容 | 見積 |
|--------|------|------|
| Supabase pgvector設定 | pgvector拡張有効化 + 5テーブル作成（chat_sessions, chat_messages, chatbot_knowledge, chatbot_prompts, knowledge_embeddings） | 1日 |
| RAGパイプライン | OpenAI埋め込み生成 + ベクトル検索 + ナレッジ投入フロー | 3日 |
| DeepSeek API接続 | チャットAPI統合 + プロンプトテンプレート | 2日 |
| チャットウィジェット完成 | 既存UIとバックエンド接続 + ストリーミング応答 | 2日 |
| Admin ナレッジCRUD | `/admin/knowledge/` — ナレッジ登録・編集・削除 | 1.5日 |
| Admin プロンプト管理 | `/admin/prompts/` — システムプロンプト設定 | 1日 |
| Admin 会話ログ | `/admin/chat/` — ユーザー会話の閲覧・検索 | 1.5日 |

---

## SEO・デプロイ（見積: 3〜5日）

| タスク | 見積 |
|--------|------|
| sitemap.xml + robots.txt 動的生成 | 0.5日 |
| 全ページ metadata + OG画像 | 1日 |
| 構造化データ（JSON-LD: MedicalBusiness, FAQPage等） | 1日 |
| GA4導入 + コンバージョン計測 | 0.5日 |
| Vercelデプロイ + ドメイン + ステージング環境 | 1日 |

---

## 全体見積サマリー

| フェーズ | 見積日数 | 前提 |
|---------|---------|------|
| Phase 1 残り | 8〜12日 | microCMS APIスキーマ作成含む |
| Phase 2 | 15〜20日 | 素材（写真等）が揃っている前提 |
| Phase 3 (AIチャット) | 10〜15日 | DeepSeek/OpenAI API動作確認含む |
| SEO・デプロイ | 3〜5日 | |
| **合計** | **36〜52日** | 1人開発・フルタイム想定 |

> **注意**: 素材（写真・テキスト原稿）の準備待ち時間は含んでいません。特に症例写真・院長プロフィール・クリニック内観写真の用意がボトルネックになりやすいです。

---

## 実装済みページ一覧（参考）

### 完了（25ページ）

- `/` トップページ
- `/mouth/`, `/eye/`, `/nose/`, `/lift/`, `/skin/` — 5ピラー一覧
- `/mouth/[slug]/`, `/eye/[slug]/`, `/nose/[slug]/`, `/lift/[slug]/`, `/skin/[slug]/` — 5ピラー詳細
- `/treatment/` 施術一覧
- `/simulator/` シミュレーター
- `/news/`, `/news/[slug]/` ニュース
- `/machine/`, `/machine/[slug]/` 医療機器
- `/search` 施術横断検索
- `/recruit/` 採用情報
- `/recruit/staff-blog/[slug]/` スタッフブログ詳細
- `/privacy`, `/medical-guidelines`, `/cancel-policy`, `/legal` 法的ページ

### 一部完了（6ページ）

- `/price/` — 表示完了、データはハードコード
- `/contact/` — フォームUI完了、Supabase未接続
- `/medicine/`, `/medicine/[slug]/` — ページ存在、microCMS未接続
- `/recruit/entry/` — フォームUI完了、Supabase未接続
- `/column/faq/` — 表示完了、データはハードコード
- `/reservation/` — 基本構造完了、営業カレンダー未実装

### 未着手（14ページ）

- `/doctor/` 院長・スタッフ紹介
- `/about/` クリニック紹介・アクセス
- `/column/`, `/column/[slug]/` コラム
- `/case/` 症例写真
- `/[pillar]/case/` 部位別症例 × 5
- `/payment/` お支払い方法
- `/commitment/` 当院のこだわり
- `/aftercare/` アフターケア
- `/comparison/` 施術比較
- `/monitor/` モニター募集
- `/glossary/` 美容医療用語集
- `/campaign/` キャンペーン一覧
- `/admin/*` 管理画面全般
