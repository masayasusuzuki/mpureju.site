# 実装TODO・注意点

完了したら取り消し線（`~~テキスト~~`）で消す。

---

## 2026-03-10 / microCMS treatments API 初期接続・口角挙上詳細ページ作成

### やったこと
- microCMS に treatments APIスキーマを作成（10フィールド、全必須）
- 口角挙上の記事を microCMS に投入・公開
- `lib/microcms/types.ts` — Treatment 型定義
- `lib/microcms/client.ts` — `getTreatments()` / `getTreatmentBySlug()` / `getTreatmentsByPillar()` 追加
- `app/mouth/lip-lift/page.tsx` — 口角挙上の詳細ページ作成（2カラム構成、サイドバー sticky）
- `next.config.ts` — microCMS 画像ドメイン（images.microcms-assets.io）を許可
- `globals.css` — `@tailwindcss/typography` 追加（リッチエディタ HTML 用）
- REQUIREMENTS.md — treatments スキーマ更新、料金を独立API `prices` に分離する方針を記載
- `app/mouth/page.tsx` — 口角挙上の slug を `lip-corner-lift` → `lip-lift` に修正

### 注意点
- [ ] `app/mouth/lip-lift/page.tsx` は静的ディレクトリ＋ハードコード slug で動いている。全施術を microCMS に投入完了したら `app/mouth/[slug]/page.tsx`（動的ルート）に切り替えること。他ピラー（eye, nose, lift, skin）も同様。
- [ ] ピラーページ（`/mouth/` 等）の施術一覧はハードコード。全施術を microCMS に入れ終わったら `getTreatmentsByPillar()` で動的取得に切り替え、サムネイルも `hero_image` から表示する。カード用の別APIは不要（treatments の `title` / `catch_copy` / `hero_image` で足りる）。
- [ ] `prices` API（料金）のスキーマが未確定。確定したら REQUIREMENTS.md を更新し、フロントの料金取得ロジックを実装する。

### 次の作業
- `/mouth/lip-lift` のUI確認・チューニング（Hero画像なし・2カラム構成の状態を確認）
