# Maison PUREJU サイト全体 TODO リスト

最終更新: 2026-04-02

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

## 進捗サマリ

| 指標 | 値 |
|---|---|
| Phase 1 ページ実装 | 28/29（97%） |
| Phase 2 ページ実装 | 1/1（100%） |
| CMS コンテンツ登録 | 325件 |
| microCMS API 接続 | 10/11（91%） |
| Supabase バックエンド | 4/9（44%） |
| SEO / 公開準備 | 2/8（25%） |

---

## 1. ページ実装状況

### トップ・共通

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| トップページ | `/` | ✅ | FV・施術メニュー（CMS動的取得）・年代別・院長メッセージ・キャンペーン・メディア・ニュース |
| ヘッダー | — | ✅ | メガメニュー・予約ドロップダウン |
| フッター | — | ✅ | |
| 検索 | `/search` | ✅ | 施術料金・施術記事・美容コラム・よくある質問の4セクション |

### ピラーページ（部位別一覧）

| ページ | URL | 状態 |
|--------|-----|------|
| 口元 | `/mouth/` | ✅ |
| 目元 | `/eye/` | ✅ |
| 鼻 | `/nose/` | ✅ |
| 糸リフト | `/lift/` | ✅ |
| 美容皮膚科 | `/skin/` | ✅ |

### 施術詳細ページ

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 全5ピラー共通 | `/[pillar]/[slug]/` | ✅ | `TreatmentDetailTemplate` 共通テンプレート。CMS 64施術分が動的生成 |

### コンテンツページ

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 施術一覧 | `/treatment/` | ✅ | Supabase `treatment_items` 取得 |
| 料金一覧 | `/price/` | ✅ | Supabase `price_items` 取得。タブ選択・キーワード検索 |
| シミュレーター | `/simulator/` | ✅ | |
| 症例写真 | `/case/` | ✅ | microCMS `cases` 134件。ピラータブ切替 |
| お問い合わせ | `/contact/` | 🔧 | フォーム UI 完了。**Supabase 送信未実装** |
| ニュース一覧 | `/news/` | ✅ | |
| ニュース詳細 | `/news/[slug]/` | ✅ | |
| よくある質問 | `/faq/` | ✅ | ハードコード。URLハッシュスクロール・自動展開対応 |
| 医療機器一覧 | `/machine/` | ✅ | microCMS 10件 |
| 医療機器詳細 | `/machine/[slug]/` | ✅ | |
| 内服薬一覧 | `/medicine/` | ✅ | microCMS 12件 |
| 内服薬詳細 | `/medicine/[slug]/` | ✅ | |
| 美容コラム一覧 | `/column/` | ✅ | microCMS 87件 |
| 美容コラム詳細 | `/column/[slug]/` | ✅ | 画像カルーセル・目次・タグ表示 |
| 院長・スタッフ紹介 | `/doctor/` | ✅ | |
| クリニック紹介・アクセス | `/about/` | ✅ | |
| 予約ガイド | `/reservation/` | 🔧 | 基本構造完了。営業カレンダーウィジェット未実装（**Supabase で休診日管理**。microCMS ではなく Supabase に集約する方針） |

### 採用関連

| ページ | URL | 状態 | 備考 |
|--------|-----|------|------|
| 採用情報 | `/recruit/` | ✅ | |
| エントリーフォーム | `/recruit/entry/` | 🔧 | ウィザード UI 完了。**Supabase 送信未実装** |
| スタッフブログ一覧 | `/recruit/staff-blog/` | ✅ | |
| スタッフブログ詳細 | `/recruit/staff-blog/[slug]/` | ✅ | |

### 法的ページ

| ページ | URL | 状態 |
|--------|-----|------|
| プライバシーポリシー | `/privacy` | ✅ |
| 医療広告ガイドライン | `/medical-guidelines` | ✅ |
| キャンセルポリシー | `/cancel-policy` | ✅ |
| 特商法 | `/legal` | ✅ |

### 管理画面

別リポジトリ `mpureju.admin` に分離済み。Supabase Auth 認証。

---

## 2. CMS コンテンツ状況

### microCMS 登録件数（2026-04-02 時点）

| API | エンドポイント | 登録件数 | フロント接続 |
|-----|--------------|---------|------------|
| 施術情報 | `treatments` | 64件 | ✅ |
| 症例記事 | `cases` | 134件 | ✅ |
| コラム記事 | `columns` | 87件 | ✅ |
| お知らせ | `news` | 5件 | ✅ |
| キャンペーン | `campaigns` | 2件 | ✅ |
| SNSメディア | `media` | 8件 | ✅ |
| スタッフブログ | `staff_blog` | 3件 | ✅ |
| 医療機器 | `machines` | 10件 | ✅ |
| 内服薬 | `medicines` | 12件 | ✅ |
| チーム写真 | `team_photos` | — | ✅ |
| **合計** | | **325件** | |

### 未実装 microCMS API

| API | エンドポイント | 備考 |
|-----|--------------|------|
| よくある質問 | `faqs` | 現在ハードコード。CMS化すれば検索・ピラーページ連動可能 |

※ `setcourses`, `staff`, `site_images`, `clinic_calendar`, `prices` は現時点で不要（Supabase代替 or ハードコードで運用中）

---

## 3. Supabase / バックエンド

| 項目 | 状態 | 備考 |
|------|------|------|
| Supabase プロジェクト作成 | ✅ | |
| `price_items` テーブル | ✅ | 料金データ全件投入済み |
| `treatment_items` テーブル | ✅ | 施術一覧データ投入済み |
| Admin 認証（Supabase Auth） | ✅ | mpureju.admin で運用 |
| `inquiries` テーブル作成 | ⬜ | |
| `/api/contact` エンドポイント | ⬜ | ContactForm → Supabase |
| `/api/recruit/entry` エンドポイント | ⬜ | EntryForm → Supabase |
| `conversion_events` テーブル | ⬜ | コンバージョン計測用 |
| RLS（Row Level Security）設定 | ⬜ | |

---

## 4. SEO・アクセス解析

| 項目 | 状態 | 備考 |
|------|------|------|
| 全ページ metadata 設定 | ✅ | 実装済みページは設定済み |
| OG 画像 | ⬜ | |
| sitemap.xml | ⬜ | 動的生成 |
| robots.txt | ⬜ | `/admin/`, `/api/` を disallow |
| GA4 導入 | ⬜ | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |
| コンバージョン計測 | ⬜ | 予約ボタン・LINE・電話クリック |
| 構造化データ（JSON-LD） | ⬜ | MedicalBusiness, FAQPage 等 |

---

## 5. デプロイ・インフラ

| 項目 | 状態 | 備考 |
|------|------|------|
| Vercel プロジェクト設定 | ✅ | |
| 環境変数設定（本番） | 🔧 | Supabase 変数が未設定だった（要確認） |
| ドメイン設定 | ⬜ | |
| SSL | ⬜ | Vercel 自動 |

---

## 6. 素材・コンテンツ

| 項目 | 状態 | 備考 |
|------|------|------|
| トップページ FV 写真 | 🔧 | 仮画像使用中 |
| クリニック内観写真 | ⬜ | |
| 院長プロフィール写真 | 🔧 | `/staff/hirose.jpg` あり |
| スタッフ写真 | ⬜ | |
| 施術 hero_image | ⬜ | microCMS に登録が必要 |
| 年代別ペルソナ写真 | 🔧 | 仮画像使用中 |
| 「選ばれる理由」写真 | 🔧 | 仮画像使用中 |
| コラム記事追加投稿 | 🔧 | pipeline で順次投稿中 |

---

## 7. Phase 3: AI チャットボット

| 項目 | 状態 |
|------|------|
| チャットウィジェット UI | 🔧（フローティングボタン+枠のみ。「準備中」表示） |
| pgvector / RAG パイプライン | ⬜ |
| DeepSeek API 接続 | ⬜ |
| ナレッジ管理（Admin） | ⬜ |

---

## 優先度まとめ（直近対応推奨）

| 優先 | タスク |
|------|--------|
| 🔴 高 | `/contact` Supabase 送信実装（`inquiries` テーブル作成） |
| 🔴 高 | `/recruit/entry` Supabase 送信実装 |
| 🟡 中 | sitemap.xml・robots.txt |
| 🟡 中 | GA4 導入 |
| 🟡 中 | 本番環境変数の確認・設定 |
| 🟡 中 | 仮画像を本番素材に差し替え |
| 🟡 中 | `/reservation` 営業カレンダー（Supabase で休診日管理 → ウィジェット実装） |
| 🟡 中 | treatments の hero_image を microCMS に登録（64件） |
| 🟢 低 | FAQのmicroCMS化 |
| 🟢 低 | Phase 3 AIチャットボット |
