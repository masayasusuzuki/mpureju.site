# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ドキュメント更新ルール

開発中に仕様変更・設計判断が生じた場合、実装と同時に以下のファイルを必ずアップデートすること。

| ファイル | 更新すべき内容 |
|----------|--------------|
| `docs/REQUIREMENTS.md` | スキーマ設計・フェーズ計画・仕様の変更・設計判断の理由 |
| `docs/INSTAGRAM_PIPELINE.md` | Instagram自動記事パイプラインの要件定義（取得→判定→記事生成→CMS投稿の全フロー、DB設計、管理画面仕様） |
| `docs/diagrams/site-structure.html` | ページ構成・データ設計・導線の変更 |
| `memory/MEMORY.md` | プロジェクト全体に影響する決定事項・重要な変更 |
| `memory/implementation.md` | 短期的な実装メモ。`## 日付 / 作業概要` の見出しでグルーピングし、各セクションに **「やったこと」「注意点」「次の作業」** を記載する。注意点は実装完了したら `~~取り消し線~~` で消す。削除はしない。セッション終了時に必ず最新化すること |

---

## Instagram 参考投稿 URL の管理

Instagram投稿URLは `docs/TODO.md` の冒頭「Instagram 参考投稿 URL」セクションにまとめて管理している。
microCMS `media` APIへの登録素材やコンテンツ作成の参考として使用する。
新しいURLが出てきたら必ずこのセクションに追記すること。

---

## Supabase SQL 管理ルール

- SQLファイルは `supabase/` ディレクトリに保存する
- ファイル名は `001_create_tables.sql`, `002_seed_data.sql` のように連番プレフィックスで管理
- 各ファイルの冒頭にコメントで目的を記載する
- Supabase ダッシュボードの SQL Editor で実行した内容は必ずこのディレクトリにも保存し、実行履歴を追えるようにする
- テーブル変更（ALTER）やデータ投入（INSERT）も個別ファイルとして記録する

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
      campaigns, faqs, setcourses, staff, media, staff_blog,
      machines, medicines

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

**重要**: カスタム CSS クラスは原則 `@layer components {}` 内に書くこと。外に書くと Tailwind ユーティリティより優先されて `mb-*` / `py-*` 等が効かなくなる。
**例外**: `prose`（@tailwindcss/typography）のデフォルトスタイルを上書きする必要がある場合（例: `.table-scroll-wrapper`）は、`@layer` の外に書くことで utilities 層より高い優先度を持たせる。

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
- `font-serif` → Noto Serif JP (`--font-noto-serif`) ← ページ見出し・セクション見出しなどアクセント用途のみ
- `font-en` → Cormorant Garamond (`--font-cormorant`) ← 英語見出し

**フォント運用方針**: 記事コンテンツ（prose 内）の見出しは明朝体を使わず、ゴシック体（font-light + tracking-wide）で統一。明朝体は冷たい印象になるため、ページタイトルやセクション見出し等のアクセント用途に限定する。

### Reusable Components

- `SectionHeading` — `number`(01〜09) + `en` + `ja` props。左縦ゴールドバーデザイン
- `ParallaxImage` — Framer Motion `useScroll` + `useTransform`、y: ±15%
- `TeamMarquee` — CSS `@keyframes` 無限横スクロール。`members` 未指定でプレースホルダー表示
- `MediaSection` — Instagram / YouTube グリッド（プレースホルダー版: `MediaSectionPlaceholder`）
- `PillarTemplate` — ピラー一覧ページの共通テンプレート（`PillarConfig` で設定を注入）
- `TreatmentDetailTemplate` — 施術詳細ページの共通テンプレート（`PillarInfo` で pillar 固有情報を注入）。5ピラー共通で使用し、各 `[slug]/page.tsx` はデータ取得 + pillar 設定のみ
- `RichContent` — microCMS リッチエディタ HTML を表示。`<table>` を検出し `.table-scroll-wrapper` で囲む + モバイルカード表示用に `data-label` 属性を自動付与
- `MarkdownContent` — Markdown 本文を表示。見出しアンカー自動生成
- `Pagination` — 記事一覧ページ共通のページネーション。`currentPage`, `totalPages`, `pageHref` props。column / case / staff-blog で共用
- `ConsultationCTA` — 全記事ページ末尾の共通CTA。`variant` + `subtitle` props
- `SidebarCampaign` — サイドバー用キャンペーン表示

### 記事システム（Article System）

記事コンテンツ（column / case / staff_blog）は共通コンポーネントで統一管理する。

#### microCMS 記事スキーマ共通仕様

新しい記事タイプをmicroCMSに作る際は、以下のフィールドを基本とする。

| フィールドID | 表示名 | 種類 | 必須 | 備考 |
|---|---|---|---|---|
| title | タイトル | テキスト | ○ | |
| slug | スラッグ | テキスト | ○ | |
| thumbnail | サムネイル | 画像 | ○ | |
| images | 記事画像 | 画像（複数） | | カルーセル表示用 |
| body / content | 本文 | テキストエリア | ○ | **Markdown保存**（リッチエディタは使わない） |
| category | カテゴリ | セレクト（複数） | ○ | |
| tags | タグ | テキスト | | カンマ区切り |
| instagram_url | Instagram URL | テキスト | | 元投稿URL |
| published_at | 公開日 | 日時 | ○ | |

記事タイプ固有のフィールド（caseの `pillar`, `concern`, `risks` 等）は上記に追加する。

> ⚠️ **本文は必ずテキストエリア（Markdown）で保存する。** リッチエディタは使わない。投稿スクリプトで `marked()` 等のHTML変換をしてはならない。表示は全て `MarkdownContent` コンポーネントで統一する。

#### ArticleDetailLayout（記事詳細テンプレート）

`components/article/ArticleDetailLayout.tsx` — 全記事タイプ共通の詳細ページレイアウト。

**構造:**
```
Hero (cream背景 + パンくず + バッジ + 日付 + タイトル)
├─ メインカラム
│   ├─ サムネイル (thumbnailConfig で aspectRatio/fit/maxWidth を制御)
│   ├─ 画像カルーセル (images)
│   ├─ タグ (tags)
│   ├─ [extraBefore] ← 記事タイプ固有のスロット
│   ├─ 目次 (toc: true/false)
│   ├─ 本文 (MarkdownContent)
│   ├─ [extraAfter] ← 記事タイプ固有のスロット
│   ├─ Instagramリンク (instagramUrl)
│   └─ 戻るリンク (backLink)
├─ サイドバー
│   ├─ SidebarCampaign (campaigns)
│   └─ [sidebarExtra] ← 記事タイプ固有のスロット
└─ ConsultationCTA
```

**props分類:**
- **必須**: `breadcrumbs`, `badges`, `date`, `title`, `body`, `campaigns`, `backLink`
- **オプション（データ駆動）**: `thumbnail`, `images`, `tags`, `instagramUrl`, `author`, `toc`
- **スロット（ReactNode）**: `extraBefore`, `extraAfter`, `sidebarExtra`

**thumbnailConfig 設定値:**

| タイプ | aspectRatio | fit | maxWidth |
|--------|-----------|-----|----------|
| column | `"square"` | `"contain"` | デフォルト |
| case | `"square"` | `"cover"` | `"max-w-lg"` |
| staff_blog | `"square"` | `"cover"` | `"max-w-md"` |

**使用例（ページファイルの全体像）:**
```tsx
// app/新タイプ/[slug]/page.tsx — データ取得 + props設定のみ
export default async function Page({ params }) {
  const [post, campaigns] = await Promise.all([...]);
  return (
    <ArticleDetailLayout
      breadcrumbs={[{ label: "一覧名", href: "/xxx" }]}
      badges={post.category.map(c => ({ label: c }))}
      date={post.published_at}
      title={post.title}
      thumbnail={post.thumbnail}
      images={post.images}
      tags={post.tags}
      body={post.body}
      instagramUrl={post.instagram_url}
      campaigns={campaigns}
      sidebarExtra={<SidebarList title="最新記事" items={latest} basePath="/xxx" />}
      backLink={{ href: "/xxx", label: "一覧に戻る" }}
    />
  );
}
```

#### SidebarList（サイドバー記事リスト）

`components/article/SidebarList.tsx` — サイドバーの記事リスト。56pxサムネ + ラベル + タイトルの統一UI。

```tsx
<SidebarList
  title="最新記事"
  items={posts.map(p => ({ id: p.id, slug: p.slug, title: p.title, thumbnail: p.thumbnail, label: p.category[0] }))}
  basePath="/recruit/staff-blog"
/>
```

#### 記事一覧ページのUIパターン

新しい記事一覧ページを作る際は、`app/column/page.tsx` を正としてデザインパターンを統一すること。

| 要素 | パターン |
|------|---------|
| カード外枠 | `border border-[var(--color-brand-brown)]/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow` |
| 画像コンテナ | `aspect-square bg-[var(--color-brand-cream)] overflow-hidden` |
| 画像フィット | `object-contain`（コラム系）/ `object-cover`（症例・スタッフブログ等の写真メイン） |
| テキストエリア | `px-5 py-5` |
| カテゴリ表示 | `text-[0.6rem] tracking-[0.2em] text-[var(--color-brand-gold)]` |
| 日付フォーマット | `YYYY.MM.DD`（`.replace(/\//g, ".")`） |
| タイトル | `text-sm font-light text-[var(--color-brand-dark)] leading-relaxed tracking-wide line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors` |
| グリッド | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8` |
| フィーチャード | 1ページ目のみ。`md:grid md:grid-cols-[1fr_1fr]` + PICK UP バッジ |
| ページネーション | `<Pagination>` コンポーネント使用 |
| CTA | `<ConsultationCTA />` をページ末尾に配置 |

#### 投稿スクリプト

`scripts/` 配下に記事タイプ別の投稿スクリプトを配置。

- `microcms-case-post.js` — 症例記事投稿
- `microcms-post.js` — コラム記事投稿
- `microcms-staff-blog-post.js` — スタッフブログ記事投稿
- `cms-bulk-post.sh` — 症例一括投稿
- `staff-bulk-post.sh` — スタッフブログ一括投稿

**投稿ルール:**
- 本文（body/content）は **Markdownのまま保存**。`marked()` 等でHTML変換しない
- サムネイル・本文中画像は Management API でアップロードしてURLを差し替え
- `published_at` は ISO 8601 形式で送信
- slug重複チェックを投稿前に行う

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
/reservation/             予約ガイド（Web/LINE/電話の手順・初診の流れ）
/first-visit/             初めての方へ（カウンセリングの流れ・注意事項）
/payment/                 お支払い方法（医療ローン詳細）
/commitment/              当院のこだわり（衛生管理・使用機器・麻酔方針）
/aftercare/               アフターケアガイド（施術後の過ごし方）
/comparison/              施術比較（埋没 vs 切開 等）
/campaign/                キャンペーン一覧
/monitor/                 モニター募集
/glossary/                美容医療用語集
/machine/                 医療機器一覧（フラットグリッド、microCMS管理、6件/ページ）
/machine/[slug]/          医療機器詳細
/medicine/                内服薬・処方薬一覧（カテゴリ別カードグリッド、microCMS `medicines` API管理）
/medicine/[slug]/         内服薬詳細（microCMS管理）
/recruit/                 採用情報一覧（職種データはハードコード）
/staff-blog/              スタッフブログ一覧
/staff-blog/[slug]/       スタッフブログ詳細
/privacy                  プライバシーポリシー
/medical-guidelines       医療広告ガイドライン
/cancel-policy            キャンセルポリシー
/legal                    特定商取引法に基づく表示
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

## 管理画面

- メインサイト: `mpureju.site`（このリポジトリ）
- 管理画面: `mpureju.admin`（別リポジトリ）— Supabase Auth で保護、Instagram投稿管理・問い合わせ管理等

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
- 予約フォーム自前実装（外部リンク: `https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d`）
- ダウンタイムカレンダーの予約可否表示（仮定提示のみ）
