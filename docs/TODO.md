# Maison PUREJU サイト全体 TODO リスト

最終更新: 2026-04-01

---

## Instagram 参考投稿 URL

microCMS `media` API への登録や、コンテンツ作成時の参考素材として使用するInstagram投稿URL。

| タイトル | URL |
|---|---|
| 参考素材（予約ページ） | https://www.instagram.com/p/C5SyPunSTfy |
| 人気治療 | https://www.instagram.com/p/DDwVlvvSgq2/?img_index=1 |
| 乾燥肌におすすめ高湿コスメ | https://www.instagram.com/p/DEE-Ti9S__W/?img_index=1 |
| セレックVの魅力 | https://www.instagram.com/p/DC6NrPVSmD_/?img_index=1 |
| スタッフ推し | https://www.instagram.com/p/C_pN031ycAj/?img_index=1 |

---

## 凡例

- ✅ 完了
- 🔧 一部完了・改善余地あり
- ⬜ 未着手

---

## 1. ページ実装状況

### トップ・共通

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| トップページ | `/` | ✅ | FV・選ばれる理由・年代別メニュー・院長メッセージ・キャンペーン・メディア・ニュース |
| ヘッダー | — | 🔧 | メガメニュー・予約ドロップダウン。「美容コラム」リンク未追加 |
| フッター | — | ✅ | |
| 検索 | `/search` | ✅ | 施術料金・施術記事・美容コラム・よくある質問の4セクション |

### ピラーページ（部位別一覧）

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 口元 | `/mouth/` | ✅ | |
| 目元 | `/eye/` | ✅ | |
| 鼻 | `/nose/` | ✅ | |
| 糸リフト | `/lift/` | ✅ | |
| 美容皮膚科 | `/skin/` | ✅ | |

### 施術詳細ページ

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 口元施術詳細 | `/mouth/[slug]/` | ✅ | `TreatmentDetailTemplate` 共通テンプレート |
| 目元施術詳細 | `/eye/[slug]/` | ✅ | |
| 鼻施術詳細 | `/nose/[slug]/` | ✅ | |
| 糸リフト施術詳細 | `/lift/[slug]/` | ✅ | |
| 美容皮膚科施術詳細 | `/skin/[slug]/` | ✅ | |

### コンテンツページ

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 施術一覧 | `/treatment/` | ✅ | |
| 料金一覧 | `/price/` | ✅ | Supabase DB取得。タブ選択・キーワード検索対応 |
| シミュレーター | `/simulator/` | ✅ | |
| お問い合わせ | `/contact/` | 🔧 | フォーム UI 完了。Supabase 送信未実装 |
| ニュース一覧 | `/news/` | ✅ | |
| ニュース詳細 | `/news/[slug]/` | ✅ | |
| よくある質問 | `/column/faq/` | 🔧 | ハードコード。URLハッシュで該当項目へスクロール・自動展開対応済み |
| 医療機器一覧 | `/machine/` | ✅ | |
| 医療機器詳細 | `/machine/[slug]/` | ✅ | |
| 内服薬一覧 | `/medicine/` | ✅ | microCMS 接続済み |
| 内服薬詳細 | `/medicine/[slug]/` | ✅ | microCMS 接続済み |
| 美容コラム一覧 | `/column/` | ✅ | microCMS `columns` API 接続済み |
| 美容コラム詳細 | `/column/[slug]/` | ✅ | 画像カルーセル・目次・タグ表示 |
| 院長・スタッフ紹介 | `/doctor/` | ✅ | 院長情報はハードコード済み。microCMS不要 |
| クリニック紹介・アクセス | `/about/` | ✅ | |
| 予約・ご来院の流れ | `/reservation/` | 🔧 | 基本構造完了。営業カレンダーウィジェット未実装 |
| キャンペーン一覧 | `/campaign/` | — | 不要と判断。トップ・サイドバーで表示済み |

### 採用関連

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 採用情報 | `/recruit/` | ✅ | |
| エントリーフォーム | `/recruit/entry/` | 🔧 | ステップ式ウィザード UI 完了（郵便番号自動補完含む）。Supabase 送信未実装 |
| スタッフブログ一覧 | `/recruit/staff-blog/` | ✅ | |
| スタッフブログ詳細 | `/recruit/staff-blog/[slug]/` | ✅ | |

### 管理画面

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 管理画面ログイン | `/admin/login` | ✅ | Supabase Auth |
| 問い合わせ管理 | `/admin/inquiries/` | ✅ | |
| チャットログ | `/admin/chat/` | ⬜ | Phase 3 |
| ナレッジ管理 | `/admin/knowledge/` | ⬜ | Phase 3 |

### 未実装ページ（優先度順）

| ページ | URL | Phase | 備考 |
|--------|-----|-------|------|
| キャンペーン一覧 | `/campaign/` | 1 | microCMS `campaigns` API 既存 |
| 症例写真（全体） | `/case/` | 2 | microCMS `cases` API、フィルター |
| 部位別症例 | `/[pillar]/case/` | 2 | 5ページ |
| お支払い方法 | `/payment/` | 2 | 医療ローン詳細 |
| 当院のこだわり | `/commitment/` | 2 | 衛生管理・使用機器 |
| アフターケア | `/aftercare/` | 2 | |
| 施術比較 | `/comparison/` | 2 | 埋没 vs 切開 等 |
| モニター募集 | `/monitor/` | 2 | |
| 美容医療用語集 | `/glossary/` | 2 | SEO ロングテール |

### 法的ページ

| ページ | URL | 状態 |
|--------|-----|------|
| プライバシーポリシー | `/privacy` | ✅ |
| 医療広告ガイドライン | `/medical-guidelines` | ✅ |
| キャンセルポリシー | `/cancel-policy` | ✅ |
| 特商法 | `/legal` | ✅ |

---

## 2. microCMS API 状況

| API | エンドポイント | スキーマ | コンテンツ | フロント接続 |
|-----|--------------|---------|-----------|------------|
| 施術情報 | `treatments` | ✅ | ✅ | ✅ |
| 症例記事 | `cases` | ✅ | ⬜ | ⬜ |
| お知らせ | `news` | ✅ | ✅ | ✅ |
| コラム記事 | `columns` | ✅ | 🔧 投稿中 | ✅ |
| 院長プロフィール | `doctor` | ✅ | ⬜ | ✅（ページ作成済み） |
| キャンペーン | `campaigns` | ✅ | ✅ | ✅ トップ + サイドバー |
| よくある質問 | `faqs` | ⬜ | ⬜ | ⬜（ハードコード中） |
| セットコース | `setcourses` | ⬜ | ⬜ | ⬜ |
| スタッフ | `staff` | ⬜ | ⬜ | ⬜ |
| SNSメディア | `media` | ✅ | ✅ | ✅ |
| スタッフブログ | `staff_blog` | ✅ | ✅ | ✅ |
| 医療機器 | `machines` | ✅ | ✅ | ✅ |
| 内服薬・処方薬 | `medicines` | ✅ | ✅ | ✅ |
| 料金 | `prices` | ⬜ | ⬜ | ⬜（Supabase `price_items` で代替） |
| サイト画像 | `site_images` | ⬜ | ⬜ | ⬜（`/public/` にハードコード中） |
| 営業カレンダー | `clinic_calendar` | ⬜ | ⬜ | ⬜ |

---

## 3. Supabase / バックエンド

| 項目 | 状態 | 備考 |
|------|------|------|
| Supabase プロジェクト作成 | ✅ | |
| `price_items` テーブル | ✅ | 料金データ全件投入済み |
| `treatment_items` テーブル | ✅ | 施術一覧データ投入済み |
| `inquiries` テーブル作成 | ⬜ | |
| `conversion_events` テーブル作成 | ⬜ | |
| `/api/contact` エンドポイント | ⬜ | ContactForm → Supabase |
| `/api/recruit/entry` エンドポイント | ⬜ | EntryForm → Supabase |
| `/api/events` エンドポイント | ⬜ | コンバージョン計測 |
| Admin 認証（Supabase Auth） | ✅ | |
| Admin 問い合わせ管理 | ✅ | |
| RLS（Row Level Security）設定 | ⬜ | |

---

## 4. Phase 3: AI チャットボット

| 項目 | 状態 | 備考 |
|------|------|------|
| pgvector 拡張有効化 | ⬜ | |
| `chat_sessions` テーブル | ⬜ | |
| `chat_messages` テーブル | ⬜ | |
| `chatbot_knowledge` テーブル | ⬜ | |
| `chatbot_prompts` テーブル | ⬜ | |
| `knowledge_embeddings` テーブル | ⬜ | |
| OpenAI 埋め込みベクトル生成 | ⬜ | |
| DeepSeek API 接続 | ⬜ | |
| RAG パイプライン実装 | ⬜ | |
| チャットウィジェット UI | 🔧 | フローティングボタン+ウィンドウ枠実装済み（準備中表示）。バックエンド未接続 |
| Admin ナレッジ CRUD | ⬜ | |
| Admin プロンプト管理 | ⬜ | |
| Admin 会話ログ閲覧 | ⬜ | |

---

## 5. デザイン・UI

| 項目 | 状態 | 備考 |
|------|------|------|
| テーブルスタイル | ✅ | |
| 記事コンテンツフォント | ✅ | ゴシック体統一 |
| サイドバーキャンペーン | ✅ | |
| 施術詳細テンプレート統一 | ✅ | |
| 写真プレースホルダー | 🔧 | 各所に「PHOTO」プレースホルダーが残っている |
| レスポンシブ確認 | ⬜ | 全ページの SP/タブレット表示確認 |
| ヘッダーに「美容コラム」リンク追加 | ✅ | |

---

## 6. SEO・アクセス解析

| 項目 | 状態 | 備考 |
|------|------|------|
| 全ページ metadata 設定 | 🔧 | 実装済みページは設定済み |
| OG 画像 | ⬜ | |
| sitemap.xml | ⬜ | 動的生成 |
| robots.txt | ⬜ | `/admin/`, `/api/` を disallow |
| GA4 導入 | ⬜ | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| コンバージョン計測 | ⬜ | 予約ボタン・LINE・電話クリック |
| 構造化データ（JSON-LD） | ⬜ | MedicalBusiness, FAQPage 等 |

---

## 7. デプロイ・インフラ

| 項目 | 状態 | 備考 |
|------|------|------|
| Vercel プロジェクト設定 | ✅ | |
| 環境変数設定（本番） | 🔧 | Supabase 変数が未設定だった（要確認） |
| ドメイン設定 | ⬜ | |
| SSL | ⬜ | Vercel 自動 |
| ステージング環境 | ⬜ | |

---

## 8. 素材・コンテンツ

| 項目 | 状態 | 備考 |
|------|------|------|
| トップページ FV 写真 | 🔧 | 仮画像使用中 |
| クリニック内観写真 | ⬜ | |
| 院長プロフィール写真 | 🔧 | `/staff/hirose.jpg` あり。高品質版要確認 |
| スタッフ写真 | ⬜ | |
| 施術 hero_image | ⬜ | microCMS に登録が必要 |
| 医療機器サムネイル | ⬜ | |
| 内服薬カテゴリ画像 | ⬜ | |
| 採用ページ職種写真 | ⬜ | |
| 年代別ペルソナ写真 | 🔧 | 仮画像使用中 |
| 「選ばれる理由」写真 | 🔧 | 仮画像使用中 |
| 症例写真（Before/After） | ⬜ | |
| doctor API コンテンツ投入 | ⬜ | ページは存在するがCMSデータなし |
| コラム記事追加投稿 | 🔧 | pipeline で順次投稿中 |

---

## 9. 追加ページ要件定義

### `/reservation/` — 予約・ご来院の流れ

**参考素材**: https://www.instagram.com/p/C5SyPunSTfy

#### 残タスク
- [ ] 営業カレンダーウィジェット（microCMS `clinic_calendar` API 作成 → コンポーネント実装）

---

## 優先度まとめ（直近対応推奨）

| 優先 | タスク |
|------|--------|
| 🔴 高 | `/contact` Supabase 送信実装（`inquiries` テーブル作成） |
| 🔴 高 | `/recruit/entry` Supabase 送信実装 |
| ✅ 済 | ヘッダーに「美容コラム」リンク追加 → 実装済み |
| 🟡 中 | sitemap.xml・robots.txt |
| 🟡 中 | OG画像（openGraph設定済み・画像未指定） |
| 🟡 中 | GA4 導入 |
| 🟡 中 | 本番環境変数の確認・設定 |
| 🟡 中 | 各所の仮画像を本番素材に差し替え |
| 🟢 低 | `/case/` 症例ページ（素材待ち） |
| 🟢 低 | Phase 3 AIチャットボット |
| 🟢 低 | 未実装ページ群（`/payment/`, `/commitment/` 等） |
