# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ドキュメント更新ルール

開発中に仕様変更・設計判断が生じた場合、実装と同時に以下のファイルを必ずアップデートすること。

| ファイル | 更新すべき内容 |
|----------|--------------|
| `docs/REQUIREMENTS.md` | スキーマ設計・フェーズ計画・仕様の変更・設計判断の理由 |
| `docs/diagrams/site-structure.html` | ページ構成・データ設計・導線の変更 |
| `memory/MEMORY.md` | プロジェクト全体に影響する決定事項・重要な変更 |
| `memory/implementation.md` | 短期的な実装メモ。`## 日付 / 作業概要` の見出しでグルーピングし、各セクションに **「やったこと」「注意点」「次の作業」** を記載する。注意点は実装完了したら `~~取り消し線~~` で消す。削除はしない。セッション終了時に必ず最新化すること |

---

## Operator Rules (Must Follow)

- **git コマンドは一切実行しない** — commit, push, add, reset 等すべてユーザーが行う
- **開発サーバー起動コマンドは実行しない** — `npm run dev` / `next dev` 等はユーザーが行う
- **すべてのファイル操作は `mpureju.site/` 内で完結させる** — 親ディレクトリや `~/.claude/` 等の外部パスにファイルを作成・保存しないこと

## Commands

```bash
npm run build   # プロダクションビルド（エラー確認に使う）
npm run lint    # ESLint チェック
```

## Architecture Overview

**Next.js 16 App Router + Tailwind CSS v4 + microCMS + Supabase**

美容クリニック（Maison PUREJU / 銀座）のウェブサイト。3フェーズで段階的に実装する。

### Data Flow

```
microCMS (コンテンツ管理)
  └── treatments, prices（予定）, cases, news, columns, doctor,
      campaigns, faqs, setcourses, staff, media, recruit

Supabase (DB / バックエンド)
  ├── inquiries (お問い合わせフォーム)
  ├── conversion_events (コンバージョン計測)
  └── Phase 3: chat_sessions, chat_messages,
               chatbot_knowledge, chatbot_prompts,
               knowledge_embeddings (pgvector + RAG)

DeepSeek API (Phase 3 AIチャットボット)
OpenAI API   (Phase 3 埋め込みベクトル生成のみ)
```

### Key Clients

- `lib/microcms/client.ts` — `microcms` インスタンス（Server Component から呼ぶ）
- `lib/supabase/server.ts` — `createSupabaseServerClient()` / `createSupabaseAdminClient()`
- `lib/supabase/client.ts` — `createSupabaseClient()` (ブラウザ用、`"use client"` 内)

### CSS Architecture (Tailwind v4)

`globals.css` で `@import "tailwindcss"` + `@theme inline {}` を使用（設定ファイルなし）。

**重要**: カスタム CSS クラスは必ず `@layer components {}` 内に書くこと。外に書くと Tailwind ユーティリティより優先されて `mb-*` / `py-*` 等が効かなくなる。

`.section-container` — コンテンツ幅制限（max-w: 1200px、水平パディング付き）。`margin` shorthand は使わず `margin-left: auto; margin-right: auto;` を使う。

### Brand Colors

`globals.css` の `@theme inline` で定義。Tailwind クラス名 `bg-brand-dark` 等で使用可能。

| Variable | Value | 用途 |
|---|---|---|
| `--color-brand-dark` | `#1a1408` | メインテキスト・ヘッダー |
| `--color-brand-brown` | `#3d2b1a` | サブテキスト |
| `--color-brand-gold` | `#c9a96e` | アクセント・CTA |
| `--color-brand-cream` | `#f5f0e8` | ライト背景 |
| `--color-brand-white` | `#fdfcfa` | オフホワイト背景 |
| `--color-footer-bg` | `#1e1510` | フッター背景 |

### Fonts

`app/layout.tsx` で CSS 変数として設定。

- `font-sans` → Noto Sans JP (`--font-noto-sans`)
- `font-serif` → Noto Serif JP (`--font-noto-serif`)
- `font-en` → Cormorant Garamond (`--font-cormorant`) ← 英語見出し

### Reusable Components

- `SectionHeading` — `number`(01〜09) + `en` + `ja` props。左縦ゴールドバーデザイン
- `ParallaxImage` — Framer Motion `useScroll` + `useTransform`、y: ±15%
- `TeamMarquee` — CSS `@keyframes` 無限横スクロール。`members` 未指定でプレースホルダー表示
- `MediaSection` — Instagram / YouTube グリッド（プレースホルダー版: `MediaSectionPlaceholder`）

### Environment Variables

`.env.local.example` を参照。必須変数:

```
MICROCMS_API_KEY
MICROCMS_SERVICE_DOMAIN
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Phase 3 追加:
```
DEEPSEEK_API_KEY
OPENAI_API_KEY
NEXT_PUBLIC_GA_MEASUREMENT_ID
```

## 医療広告ガイドライン（コピー生成時に必ず守る）

- 「絶対」「必ず」「確実に」等の断定表現を使わない
- 効果を保証する表現を使わない（「〜できます」より「〜が期待できます」）
- Before/After 写真には必ず適切な注釈を付ける
- 料金は税込総額で明示する

## URL Structure

```
/                         トップページ
/mouth/                   口元ピラー（以下5ページ共通構造）
/eye/                     目元ピラー
/nose/                    鼻ピラー
/lift/                    リフトアップピラー
/skin/                    美容皮膚科ピラー
/treatment/               施術一覧（全施術横断）
/treatment/[slug]/        施術詳細（Phase 2）
/simulator/               料金・ダウンタイムシミュレーター
/price/                   料金一覧
/case/                    症例写真総合（Phase 3でフィルター実装）
/[pillar]/case/           部位別症例（例: /mouth/case/）
/doctor/                  院長・スタッフ紹介
/column/                  コラム一覧
/column/faq/              よくある質問
/news/                    お知らせ
/contact/                 お問い合わせ
/about/                   クリニック紹介・アクセス
/recruit/                 採用情報一覧
/recruit/[slug]/          求人詳細
/admin/                   管理画面（Supabase Auth で保護）
```

SEO方針: すべてのページを3階層以内に収める。ピラーページ + 施術詳細のトピッククラスター構造。

## Simulator 仕様

- **ライブラリ**: `react-day-picker`（カレンダーUI）、`date-fns`（日付計算）、`framer-motion`（SPタイムライン）
- 複数施術選択時はダウンタイム各マイルストーンの**最大値**を採用
- カレンダーはあくまで「仮定」として提示。実際の予約可否は示さない
  - 入力欄: 「施術希望日（仮）を入力」と明記
  - CTA: 「予約する」は使わない → 「この日程でLINE相談する」「カウンセリングで空き日程を確認する」
- `/simulator/` は独立ページ + 各ピラーページにも埋め込み（その部位施術に絞る）

## 管理画面 `/admin/`

- Supabase Auth（メール＋パスワード）で認証
- Phase 1: 問い合わせ一覧（ステータス管理・担当割り当て）
- Phase 3 追加: 会話ログ・ナレッジ管理（chatbot_knowledge CRUD）・プロンプト管理

## microCMS 命名規則

- **API名（管理画面の表示名）** → 必ず日本語（例: 採用情報、施術情報、お知らせ）
- **エンドポイント** → 英語（例: recruit, treatments, news）

## microCMS スキーマ間のリレーション

- **`prices` → `treatments`** へのコンテンツ参照（1施術 : N料金プラン）。`prices` API が料金の単一ソース。
- `campaigns.related_treatments[]` → treatments へのリレーション。施術詳細ページのサイドバーに紐づくキャンペーンを自動表示。未設定時は最新キャンペーンをデフォルト表示。
- `setcourses.treatments[]` → treatments へのリレーション。各ピラーページの「おすすめセットコース」セクションで使用。
- `treatments` のダウンタイムフィールド: `downtime_min_days`, `downtime_max_days`, `downtime_milestones[]`（API作成後に追加）。

> ⚠️ **注意**: 料金データは treatments 内ではなく独立 API `prices` で管理する（設計変更済み）。詳細は `docs/REQUIREMENTS.md` 参照。

## Phase Plan

- **Phase 1**: トップ・5ピラー・料金・お問い合わせ・管理画面ベース
- **Phase 2**: 施術詳細・院長・コラム・about
- **Phase 3**: 症例フィルター・AIチャットボット（DeepSeek + pgvector RAG）

## Out of Scope (実装しない)

- マイページ / 予約管理（Medicalforce 公開 API なし）
- 予約フォーム自前実装（外部リンク: `https://mpureju.com/reservation`）
- ダウンタイムカレンダーの予約可否表示（仮定提示のみ）
