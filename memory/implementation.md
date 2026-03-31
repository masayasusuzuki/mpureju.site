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
- ~~`app/mouth/corner-lip-lift/page.tsx` は静的ディレクトリ＋ハードコード slug で動いている~~ → `app/mouth/[slug]/page.tsx` 動的ルートに切り替え済み。eye/nose/liftも同様に実装済み
- ~~ピラーページの施術一覧はハードコード~~ → mouth/eye/nose/lift/skinすべて `getTreatmentsByPillar()` で動的取得+フォールバック構造に移行済み
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
- ~~`/recruit/staff-blog/` 一覧ページが未実装（詳細ページのみ存在）~~ → 実装済み（page.tsx + [slug]/page.tsx 両方存在確認）

---

## 2026-03-24 / 医療機器・施術一覧・内服薬の大幅アップデート

### やったこと

**医療機器（/machine/）:**
- `Machine` 型: `category` 削除 → `target_concerns` 追加
- 一覧ページ: カテゴリグルーピング廃止 → フラットグリッド（3列、6件/ページのページネーション、`scroll={false}`）
- 詳細ページ: 概要バー「カテゴリ」→「対象のお悩み」、サイドバーにキャンペーン枠追加、「同カテゴリ」→「その他のマシン」
- `client.ts`: `normalizeMachine` 削除（カテゴリ廃止で不要に）
- カードに常時シャドウ（`shadow-sm`）、サムネ16:9 `object-cover`
- `docs/machine-data.md`: 13台→10台に整理（ソフウェーブ/サーマZii/ブレッシング/IPL/ブースター削除）、Q+C/CO2レーザー/セレックV追加
- `globals.css`: `.machine-description.prose h2` スタイル追加（ゴールドグラデ背景帯+左バー+下線）
- description部分をコードブロック（プレーンテキスト）で独立させ、microCMSリッチエディタにコピペしやすい構造に

**施術ピラーページ:**
- 目（9→17施術）: 二重抜糸/目頭上切開/上眼瞼除皺/下眼瞼除皺/下眼瞼除皺+脱脂/脂肪再配置/表ハムラ・裏ハムラ分離/蒙古襞形成を追加
- 鼻（9→17施術）: ストラット法/鼻中隔軟骨移植/肋軟骨移植/鼻翼挙上/鼻孔縁挙上/鼻柱基部形成/側頭筋膜移植/プロテーゼ抜去を追加
- 糸・リフト（9→11施術）: ショートスレッド/アイスレッドを追加
- 目・鼻・糸リフトの一覧ページをmicroCMS取得+フォールバック構造に変更（mouthと同パターン）
- `app/eye/[slug]/page.tsx`, `app/nose/[slug]/page.tsx`, `app/lift/[slug]/page.tsx` — 詳細ページ新規作成

**内服薬（/medicine/）:**
- `app/medicine/page.tsx` — 一覧ページ新規作成（6カテゴリ、machineと同じカードグリッド）
- `app/medicine/[slug]/page.tsx` — 詳細ページ新規作成（12薬品ハードコード、目次+薬剤説明+用法用量+副作用+使用上の注意+サイドバー）
- `components/layout/Header.tsx` — メニューに「内服薬」追加

### 注意点
- ~~`category` はセレクトフィールドで5つの選択肢を設定~~ → カテゴリ廃止済み
- [ ] マシンのサムネイル画像（16:9）を用意してmicroCMSに登録する
- [ ] 内服薬ページはハードコード運用中。microCMS `medicines` API の構成が決まったら移行する
- [ ] 内服薬一覧のサムネイルエリアにカテゴリ名プレースホルダーが表示されている。microCMS移行時に画像に差し替え
- [ ] `app/nose/[slug]/page.tsx` と `app/lift/[slug]/page.tsx` は sed で生成。微調整が必要な場合あり

### 次の作業
- microCMS `medicines` API構成の確定 → ハードコードからAPI取得に移行
- 内服薬の画像素材準備

---

## 2026-03-26 / skin microCMS接続 + 施術詳細テンプレート統一 + CSS改善

### やったこと

**skin ピラー microCMS 接続:**
- `app/skin/page.tsx` — `getTreatmentsByPillar("skin")` で動的取得+フォールバック構造に移行
- `app/skin/[slug]/page.tsx` — 施術詳細ページ新規作成（19件の SSG ページ生成）

**施術詳細ページのテンプレート統一（リファクタリング）:**
- `components/pillar/TreatmentDetailTemplate.tsx` — 共通テンプレート作成（約270行）
- 5ピラーの `[slug]/page.tsx` を約350行 → 約50行に縮小（`PillarInfo` 設定 + データ取得のみ）
- 今後の UI 修正は `TreatmentDetailTemplate.tsx` の1ファイルで完結

**テーブル CSS 根本修正:**
- `.table-scroll-wrapper` スタイルを `@layer components` → unlayered に移動（`prose` の utilities 層に負けていた問題を解消）
- デスクトップ: `table-layout: fixed`（均等列幅）、クリームグラデヘッダー
- モバイル: CSS でカード型レイアウトに変換（`thead` 非表示、`data-label` 属性でラベル表示）
- `RichContent` コンポーネント: テーブルラップ時に各 `td` へ対応する `th` テキストを `data-label` として自動付与

**フォント方針変更:**
- 記事コンテンツ内の見出し: 明朝体 → ゴシック体（`font-light` + `tracking-wide`）に統一（全8ファイル）
- テーブルヘッダー・ラベルの明朝体も削除

**ドクターコメント UI 刷新:**
- クリーム背景ボックス + 四角い写真 → 丸アイコン + 吹き出し風レイアウトに変更
- 「ドクターコメント」タイトル → 英字ラベル「DOCTOR'S COMMENT」+ 吹き出しデザイン
- セクション位置: 施術説明の直後（施術の流れの前）に移動
- TOC ラベル: 「ドクターコメント」→「院長より」

### 注意点
- ~~skin 詳細ページ CTA「医師が」と「院長が」の不一致~~ → テンプレート統一で解消
- ~~5ファイルの施術詳細ページでコード重複~~ → `TreatmentDetailTemplate` に統一済み
- [ ] ドクターコメントの吹き出しデザインは mouth で調整中。合格後に他ピラーに反映（テンプレート統一済みなので自動反映）

### 次の作業
- ドクターコメントの最終デザイン確定
- テーブルの実機確認（モバイルカード表示）

---

## 2026-03-27 / チャットボットUI + microCMS medicines スキーマ確定

### やったこと

**チャットボットUI（Phase 3 先行）:**
- `components/chat/ChatBot.tsx` — フローティングチャットボタン+ウィンドウ新規作成
- `app/layout.tsx` — ChatBot コンポーネントを追加（全ページ共通表示）
- 右下常駐ゴールドボタン、タップでチャットウィンドウ開閉
- 初期メッセージ + 5つの候補ボタン（施術相談・料金・ダウンタイム・予約方法・カウンセリング）
- 「準備中」バナー表示、入力欄disabled
- モバイル: MobileBottomNavの上に配置（bottom-20）、PC: 右下（bottom-8）

**microCMS `medicines` スキーマ確定:**
- API名: 内服薬・処方薬 / エンドポイント: medicines
- 10フィールド: name, slug, category（セレクト6択）, thumbnail, catch_copy, description（richtext）, usage, side_effects, contraindications, sort_order
- カテゴリ選択肢: 美肌・シミ対策 / 頭皮・毛髪ケア / AGA治療 / ニキビ・肌荒れ / ダウンタイム軽減 / まつ毛育成
- FAQはハードコードのまま（変更頻度が低いためCMS化不要と判断）

### 注意点
- [ ] チャットボットはUI枠のみ。Phase 3でDeepSeek + pgvector RAG接続時に有効化
- [ ] medicines APIにコンテンツ（12薬品）を投入し、フロント側をAPI取得に切り替える

### 次の作業
- microCMS medicines APIにコンテンツ投入（ハードコードデータを移行）
- フロント側を `getMedicineList()` / `getMedicineBySlug()` に切り替え

---

## 2026-03-30 / 当院についてページ新規作成

### やったこと
- `docs/scraping/about_mpureju_com.txt` — 旧サイト https://mpureju.com/about/ をスクレイピングしてコンテンツ収集
- `app/about/page.tsx` — 新規作成（7セクション構成）
  - Hero + コンセプト / 6つのこだわり / 内観写真 / 診療情報 / 院長簡略 / アクセス / CTA
- `components/layout/Header.tsx` — PCナビ・モバイルメニューに「当院について」追加（院長紹介の隣）
- `components/layout/Footer.tsx` — col1Links の「Access」→「About」(/about) に変更
- `docs/REQUIREMENTS.md` — /about/ のステータスを ✅ に更新

### 注意点
- 内観写真は既存の `/public/toppage/clinicimage01.jpg` / `clinicimage02.jpg` を流用。実際の写真素材があれば差し替える
- 6つのこだわりのテキストはスクレイピング結果をベースに新サイト向けに加筆。旧サイトの「行動指標」と同内容

### 次の作業
- `/doctor/` 院長・スタッフ紹介ページの実装

---

## 2026-03-27 / 施術詳細FAQ追加 + Supabase プロジェクト作成 + 料金・施術一覧DB化

### やったこと

**施術詳細ページ FAQ セクション追加:**
- `lib/faq-data.ts` — 全48施術のFAQデータ（施術slug → Q&A配列のマッピング）を新規作成
  - 既存16施術分は `docs/FAQ.txt` から移行
  - 残り32施術分は既存トーンに合わせて新規作成（各5問、計約250問）
- `components/pillar/TreatmentDetailTemplate.tsx` — `faqs` props追加、CTAセクション直上にFAQセクション表示（`SectionHeading` + `FaqAccordion`）
- `app/{mouth,eye,nose,lift,skin}/[slug]/page.tsx` — `getFaqsBySlug(slug)` でFAQデータを取得し `faqs` propsとして渡す（全5ファイル）

**チャットボット メニューUI改善:**
- `components/chat/ChatBot.tsx` — メニューカードのデザインを刷新（ウェルカムヘッダー + アイコンボックス + サブテキスト + ポップアニメーション）
- `app/globals.css` — `@keyframes menuPop` 追加

**Supabase プロジェクト作成 + テーブル設計:**
- Supabase プロジェクト `mpureju-site` を新規作成（org: maisonpureju, region: Tokyo）
- `.env.local` に URL / anon key / service role key を設定
- `supabase/001_create_tables.sql` — `treatment_items` + `price_items` テーブル作成 + RLS + updated_atトリガー
- `supabase/002_seed_treatment_items.sql` — 施術一覧データ投入（72行）
- `supabase/003_seed_price_items.sql` — 料金データ投入（約300行）
- 3ファイルすべて Supabase SQL Editor で実行済み

**ドキュメント更新:**
- `CLAUDE.md` — Supabase SQL管理ルールを追加
- `docs/REQUIREMENTS.md` — 料金管理方針を microCMS → Supabase に変更、テーブル設計追記、管理画面の分離方針追記

### 注意点
- [ ] `lib/price-data.ts`（ハードコード）→ Supabase 読み込みへの切り替えが未実施
- [ ] `app/treatment/page.tsx`（ハードコード）→ Supabase 読み込みへの切り替えが未実施
- [ ] `mpureju.admin`（管理画面）の開発は未着手。別リポジトリとして分離予定
- [ ] FAQデータ（`lib/faq-data.ts`）は現状ハードコード。将来的にSupabase化も検討可

### 次の作業
- `mpureju.admin` リポジトリの初期セットアップ + 施術・料金 CRUD 画面
- `mpureju.site` のページを Supabase 読み込みに切り替え（`/treatment/`, `/price/`, サイドバー料金パネル）
