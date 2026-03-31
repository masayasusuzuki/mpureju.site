# Maison PUREJU サイト制作 作業時間レポート

作成日: 2026-03-30
担当: 1名
技術スタック: Next.js 16 App Router / Tailwind CSS v4 / microCMS / Supabase
集計方法: 実装ログ（memory/implementation.md）＋タスク一覧（docs/TODO.md）をもとに、
　　　　　同規模・同技術スタックの一般的な工数水準で推計。
　　　　　デザインカンプなし・1名体制での実装工数として算出。

---

## 総合計

| フェーズ | 推計時間 |
|----------|---------|
| Phase 1（実装済み） | **約 430h** |
| Phase 1.5（未着手コンテンツページ） | 約 60h |
| Phase 2（残タスク） | 約 50h |
| Phase 3（AIチャットボット・症例フィルター等） | 約 80h |
| **プロジェクト全体（完成時）** | **約 620h** |

---

## Phase 1 実装済み詳細（約 430h）

### 1. 環境構築・設計（24h）

| 作業内容 | 時間 |
|----------|------|
| Next.js 16 App Router + Tailwind v4 プロジェクト初期構築 | 4h |
| ブランドデザインシステム（カラー変数・フォント・CSS 設計） | 8h |
| microCMS / Supabase クライアント設計 | 4h |
| 要件定義・URL 設計・フェーズ計画 | 8h |

### 2. 共通レイアウト（42h）

| 作業内容 | 時間 |
|----------|------|
| ヘッダー（メガメニュー・レスポンシブ・予約ドロップダウン） | 20h |
| フッター | 6h |
| 共通コンポーネント群（SectionHeading / ParallaxImage / TeamMarquee / MediaSection / MobileBottomNav） | 16h |

### 3. トップページ（34h）

| 作業内容 | 時間 |
|----------|------|
| FV（ファーストビュー・パララックス） | 8h |
| 選ばれる理由セクション | 4h |
| 年代別メニューセクション | 6h |
| 院長メッセージセクション | 4h |
| キャンペーンセクション（microCMS 取得・自動フェード切替） | 6h |
| メディア・ニュースセクション | 6h |

### 4. ピラーページ × 5（28h）

| 作業内容 | 時間 |
|----------|------|
| PillarTemplate 共通テンプレート設計・実装 | 8h |
| 口元・目元・鼻・糸リフト・美容皮膚科 各ページ（microCMS 動的取得 + フォールバック） | 20h |

### 5. 施術詳細ページ 全5ピラー（56h）

| 作業内容 | 時間 |
|----------|------|
| [slug]/page.tsx 動的ルート × 5 ピラー 初期実装 | 24h |
| RichContent コンポーネント（テーブル横スクロール・data-label 自動付与） | 6h |
| SSG（generateStaticParams）設定 | 4h |
| TreatmentDetailTemplate 統一リファクタリング（5ファイル → 1テンプレート） | 16h |
| ドクターコメント UI 刷新（吹き出しデザイン） | 6h |

### 6. microCMS API 接続・型定義（18h）

| 作業内容 | 時間 |
|----------|------|
| 全 API スキーマ設計（treatments / news / machines / media / campaigns / staff_blog / medicines 等） | 8h |
| client.ts 取得関数実装（getList / getBySlug / getByPillar 等） | 6h |
| types/microcms.ts 型定義 | 4h |

### 7. 施術 FAQ 実装（20h）

| 作業内容 | 時間 |
|----------|------|
| lib/faq-data.ts 作成（48施術 × 5問 = 約250問、ライティング含む） | 16h |
| FaqAccordion コンポーネント作成 | 2h |
| TreatmentDetailTemplate への組み込み（全5ピラー） | 2h |

### 8. 医療機器ページ（16h）

| 作業内容 | 時間 |
|----------|------|
| 一覧ページ（フラットグリッド・6件/ページネーション） | 8h |
| 詳細ページ（概要バー・キャンペーンサイドバー・関連マシン） | 8h |

### 9. 内服薬ページ（14h）

| 作業内容 | 時間 |
|----------|------|
| 一覧ページ（6カテゴリ・カードグリッド） | 6h |
| 詳細ページ（目次・薬剤説明・用法用量・副作用・使用上の注意・サイドバー） | 8h |

### 10. シミュレーター（32h）

| 作業内容 | 時間 |
|----------|------|
| 施術選択 UI（複数選択・ピラー別フィルター） | 10h |
| ダウンタイム計算ロジック（複数施術の最大値採用） | 8h |
| react-day-picker カレンダー UI・date-fns 日付計算 | 8h |
| SP タイムライン（framer-motion） | 6h |

### 11. 採用情報ページ（38h）

| 作業内容 | 時間 |
|----------|------|
| /recruit/ 一覧ページ（Hero・Mission・働く魅力・募集職種・福利厚生・選考フロー） | 20h |
| ValuesCarousel / PositionAccordion コンポーネント | 8h |
| /recruit/entry/ エントリーフォーム（3職種タブ切替・URLパラメータ初期選択） | 10h |

### 12. Supabase セットアップ・DB 設計・データ投入（18h）

| 作業内容 | 時間 |
|----------|------|
| プロジェクト作成・環境変数設定 | 2h |
| treatment_items / price_items テーブル設計・RLS・トリガー（SQL 001） | 8h |
| 施術データ投入（SQL 002、72件） | 4h |
| 料金データ投入（SQL 003、約300行） | 4h |

### 13. チャットボット UI（12h）

| 作業内容 | 時間 |
|----------|------|
| ChatBot.tsx（フローティングボタン・チャットウィンドウ・候補メニュー） | 8h |
| メニューカード UI 刷新・menuPop アニメーション | 4h |

### 14. その他コンテンツページ（44h）

| 作業内容 | 時間 |
|----------|------|
| 料金一覧（/price/） | 8h |
| 施術一覧（/treatment/） | 8h |
| ニュース一覧・詳細（/news/） | 8h |
| 予約・ご来院の流れ（/reservation/ ※カレンダーウィジェット除く） | 12h |
| スタッフブログ詳細（/recruit/staff-blog/[slug]/） | 4h |
| 法的ページ × 4（/privacy・/legal・/cancel-policy・/medical-guidelines） | 4h |

### 15. 検索ページ（8h）

| 作業内容 | 時間 |
|----------|------|
| /search/ 施術横断検索 | 8h |

### 16. CSS 設計・テーブルスタイル・フォント調整（12h）

| 作業内容 | 時間 |
|----------|------|
| テーブル CSS 根本修正（unlayered 化・fixed layout・モバイルカード変換） | 6h |
| フォント方針変更（記事内見出し 明朝 → ゴシック、全8ファイル対応） | 4h |
| machine-description prose スタイル追加 | 2h |

### 17. ドキュメント整備（18h）

| 作業内容 | 時間 |
|----------|------|
| docs/REQUIREMENTS.md（スキーマ設計・フェーズ計画・設計判断の記録） | 6h |
| docs/diagrams/site-structure.html（インタラクティブ構成図） | 8h |
| CLAUDE.md・memory/ 更新・運用ルール整備 | 4h |

---

## Phase 1 残タスク（約 30h）

| タスク | 推計 |
|--------|------|
| スタッフブログ一覧（/recruit/staff-blog/） | 4h |
| 管理画面（/admin/ — Supabase Auth + 問い合わせ管理） | 16h |
| Supabase inquiries 連携（/api/contact・/api/recruit/entry） | 6h |
| 料金・施術一覧の Supabase 読み込み切り替え | 4h |

---

## Phase 1.5 未着手（約 60h）

| タスク | 推計 |
|--------|------|
| 院長・スタッフ紹介（/doctor/） | 12h |
| クリニック紹介・アクセス（/about/） | 10h |
| お支払い方法（/payment/） | 6h |
| 当院のこだわり（/commitment/） | 6h |
| アフターケア（/aftercare/） | 4h |
| 施術比較（/comparison/） | 6h |
| キャンペーン一覧（/campaign/） | 4h |
| モニター募集（/monitor/） | 4h |
| 美容医療用語集（/glossary/） | 8h |
| 予約ページ 営業カレンダーウィジェット（microCMS clinic_calendar） | 8h |
| 内服薬 microCMS 接続（コンテンツ投入 + フロント切り替え） | 6h |

---

## Phase 2 残タスク（約 50h）

| タスク | 推計 |
|--------|------|
| コラム一覧・詳細（/column/） | 10h |
| 症例写真一覧・部位別（/case/ + /[pillar]/case/ × 5） | 20h |
| microCMS faqs API 移行（ハードコード → CMS管理） | 6h |
| SEO（全ページ metadata / OG 画像 / sitemap.xml / robots.txt / 構造化データ） | 14h |

---

## Phase 3（約 80h）

| タスク | 推計 |
|--------|------|
| AI チャットボット バックエンド（DeepSeek API + pgvector RAG） | 40h |
| 管理画面拡張（ナレッジ管理・プロンプト管理・会話ログ） | 20h |
| GA4・コンバージョン計測 | 6h |
| Vercel 本番デプロイ・ドメイン設定 | 6h |
| 全ページ レスポンシブ確認・最終調整 | 8h |

---

*本レポートは実装ログ・タスク管理ファイルをもとに、同規模プロジェクトの一般的な工数水準で推計した値です。*
