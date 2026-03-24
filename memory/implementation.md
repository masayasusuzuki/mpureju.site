# 実装TODO・注意点

完了したら取り消し線（`~~テキスト~~`）で消す。

---

## 2026-03-10 / microCMS treatments API 初期接続・口角挙上詳細ページ作成

### やったこと
- microCMS に treatments APIスキーマを作成（10フィールド、全必須）
- 口角挙上の記事を microCMS に投入・公開
- `lib/microcms/types.ts` — Treatment 型定義
- `lib/microcms/client.ts` — `getTreatments()` / `getTreatmentBySlug()` / `getTreatmentsByPillar()` 追加
- `app/mouth/corner-lip-lift/page.tsx` — 口角挙上の詳細ページ作成（2カラム構成、サイドバー sticky）
- `next.config.ts` — microCMS 画像ドメイン（images.microcms-assets.io）を許可
- `globals.css` — `@tailwindcss/typography` 追加（リッチエディタ HTML 用）
- REQUIREMENTS.md — treatments スキーマ更新、料金を独立API `prices` に分離する方針を記載
- `app/mouth/page.tsx` — 口角挙上の slug を `lip-corner-lift` → `lip-lift` に修正

### 注意点
- [ ] `app/mouth/corner-lip-lift/page.tsx` は静的ディレクトリ＋ハードコード slug で動いている。全施術を microCMS に投入完了したら `app/mouth/[slug]/page.tsx`（動的ルート）に切り替えること。他ピラー（eye, nose, lift, skin）も同様。
- [ ] ピラーページ（`/mouth/` 等）の施術一覧はハードコード。全施術を microCMS に入れ終わったら `getTreatmentsByPillar()` で動的取得に切り替え、サムネイルも `hero_image` から表示する。カード用の別APIは不要（treatments の `title` / `catch_copy` / `hero_image` で足りる）。
- [ ] `prices` API（料金）のスキーマが未確定。確定したら REQUIREMENTS.md を更新し、フロントの料金取得ロジックを実装する。

### 次の作業
- `/mouth/corner-lip-lift` のUI確認・チューニング（Hero画像なし・2カラム構成の状態を確認）

---

## 2026-03-19 / 採用情報ページ（/recruit/）新規作成

### やったこと
- `app/recruit/page.tsx` — 採用一覧ページ（Hero / Mission / 働く魅力カルーセル / 求める人材像 / 募集職種アコーディオン / 福利厚生 / 選考フロー / CTA）
- `app/recruit/entry/page.tsx` + `EntryForm.tsx` — エントリーフォーム（3職種タブ切替、URLパラメータで初期選択、広報のみポートフォリオURL欄）
- `components/sections/ValuesCarousel.tsx` — 横スクロール式カルーセル（CSS overflow-x: auto）
- `components/sections/PositionAccordion.tsx` — 職種詳細アコーディオン（排他開閉、写真・テーブル・エントリーCTA）
- `components/ui/RichContent.tsx` — microCMSリッチエディタのテーブルを横スクロールラッパーで囲むコンポーネント
- `globals.css` — `.table-scroll-wrapper` テーブルスタイル追加
- `app/mouth/corner-lip-lift/page.tsx` — RichContent適用（テーブル横スクロール対応）
- `recruit-spec.md` — v2に更新（ベンチマーク分析、ページ構成、APIスキーマ）
- 3職種の詳細情報ハードコード（業務内容・勤務時間・給与・応募条件）

### 注意点
- ~~microCMS recruit APIは未作成。現状ハードコードで運用~~ → ハードコードで確定（3職種なのでCMS不要と判断）
- [ ] 写真プレースホルダー（PHOTO）が各所に残っている。院長写真・職種写真・働く魅力写真の素材が必要
- [ ] エントリーフォームのバックエンド未実装（TODO: Supabase接続）
- ~~`app/recruit/[slug]/page.tsx` が残っている。ハードコード運用に切り替えたので不要になる可能性あり~~ → 2026-03-23 削除済み

### 次の作業
- 写真素材の投入
- エントリーフォームのSupabase接続

---

## 2026-03-23 / recruit APIコード整理 + ドキュメント更新

### やったこと
- microCMS `recruit` エンドポイントは廃止済み（職種3つのためハードコード運用）。関連するデッドコードを削除:
  - `app/recruit/[slug]/page.tsx` — 求人詳細ページを削除
  - `lib/microcms/client.ts` — `getRecruitList`, `getRecruitListAll`, `getRecruitBySlug` を削除
  - `types/microcms.ts` — `Recruit` 型を削除
- `staff_blog` APIが別途作成されていたことを確認し、ドキュメントに反映:
  - `docs/REQUIREMENTS.md` — recruit スキーマを廃止表記、staff_blog スキーマを追加
  - `CLAUDE.md` — Data Flow・URL構造を更新
  - `memory/implementation.md` — 本セクション追記

### 注意点
- [ ] `/recruit/staff-blog/` 一覧ページが未実装（詳細ページのみ存在）

---

## 2026-03-24 / 医療機器一覧ページ（/machine/）新規作成

### やったこと
- `types/microcms.ts` — `Machine` 型追加（name, name_en, slug, thumbnail, category, type, catch_copy, description, sort_order）
- `lib/microcms/client.ts` — `getMachineList()`, `getMachineBySlug()` 追加
- `app/machine/page.tsx` — 一覧ページ作成。カテゴリ別カードグリッド（PC4列/タブ3列/SP2列）。5カテゴリはフロント側で定義済み（データ0件でもセクション表示）
- `app/machine/[slug]/page.tsx` — 詳細ページ作成。マシン画像+RichContent説明+サイドバー（同カテゴリマシン）
- `components/layout/Header.tsx` — メニュードロップダウンに「マシンリスト」追加
- `globals.css` — `.table-scroll-wrapper` を `@layer components` 内に移動（Tailwind v4の詳細度問題を修正）
- `docs/REQUIREMENTS.md` — machines スキーマ・URL構造を追記
- `CLAUDE.md` — URL Structure に `/machine/` を追記

### 注意点
- [ ] microCMS に `machines` API を作成する必要あり（API名: 医療機器 / エンドポイント: machines）
- [ ] `category` はセレクトフィールドで5つの選択肢を設定: たるみ・リフトアップ系 / 高周波（RF）系 / ニードルRF・肌再生系 / レーザー・光治療系 / 導入・スキンケア系
- [ ] マシンのサムネイル画像を用意してmicroCMSに登録する

### 次の作業
- microCMS で machines API 作成 → テストデータ投入 → 表示確認
