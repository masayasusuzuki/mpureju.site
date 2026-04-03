# コードリファクタリング計画

最終更新: 2026-04-02

コードレビューで検出した問題の修正計画。影響範囲が大きい順に並べる。

---

## 凡例

- ⬜ 未着手
- 🔧 作業中
- ✅ 完了

---

## 1. ~~定数の一元管理（SSOT）~~ ✅

**対象:** `lib/constants.ts`（新規作成）

~~サイト全体で同じ値がハードコードされている。1箇所変更するとき全ファイルを手動で直す必要があり、漏れが発生しやすい。~~

### 1-1. ~~`lib/constants.ts` を作成~~ ✅

`CLINIC` 定数（URL, 住所, 電話, 営業時間等）と `PILLARS` 定数を定義済み。

### 1-2. ~~予約URL を定数に置換（20ファイル）~~ ✅

CTA コンポーネント経由 + 直接参照で全ファイル置換済み。

### 1-3. ~~LINE URL を定数に置換（20ファイル）~~ ✅

1-2 と同時に完了。

### 1-4. ~~住所・電話・営業時間を定数に置換~~ ✅

Footer, MobileBottomNav, about, contact, reservation で `CLINIC.*` 定数に置換済み。

---

## 2. ~~CTA セクションの共通コンポーネント化~~ ✅

**対象:** `components/sections/ConsultationCTA.tsx`（新規作成）

~~「ご予約・ご相談はこちら」CTA が 14ファイル にほぼ同一のコードでコピペされている。~~

### 2-1. ~~`ConsultationCTA` コンポーネントを作成~~ ✅

`variant="center"` / `variant="left"` の2バリアント。`subtitle` props でテキスト差し替え可能。

### 2-2. ~~14ファイルのインライン CTA を `<ConsultationCTA />` に置換~~ ✅

置換済みファイル:
- ~~app/about/page.tsx~~
- ~~app/case/[slug]/page.tsx~~
- ~~app/case/page.tsx~~
- ~~app/column/[slug]/page.tsx~~
- ~~app/column/page.tsx~~
- ~~app/doctor/page.tsx~~
- ~~app/machine/[slug]/page.tsx~~
- ~~app/machine/page.tsx~~
- ~~app/medicine/[slug]/page.tsx~~
- ~~app/medicine/page.tsx~~
- ~~app/price/page.tsx~~
- ~~app/treatment/page.tsx~~
- ~~components/pillar/PillarTemplate.tsx~~
- ~~components/pillar/TreatmentDetailTemplate.tsx~~

※ `app/faq/page.tsx` はCTAデザインが独自のため対象外（URLのみ定数化済み）

---

## 3. ~~Supabase クエリのエラーハンドリング追加~~ ✅

**対象:** `lib/supabase/queries.ts`

~~現状 try/catch が一切ない。DB接続エラーやテーブル不在でアプリがクラッシュする。~~

### 3-1. ~~全クエリ関数に try/catch + 空フォールバックを追加~~ ✅

全8関数に `console.error("[supabase] functionName failed:", e)` + 空フォールバック追加済み。

---

## 4. ~~Null 安全性の修正~~ ✅

### 4-1. ~~`TreatmentTabs.tsx:47` — 非null assertionを除去~~ ✅

`tabs.find()` の `!` を除去し、`if (!current) return null;` ガード追加。

### 4-2. ~~`TreatmentSubTabs.tsx` — 空配列ガード追加~~ ✅

`if (!tabs.length) return null;` を追加。

### 4-3. ~~`app/case/page.tsx` — concern の optional chaining~~ ✅

`c.concern?.split(...)` + `?? []` フォールバック追加。

### 4-4. ~~`app/column/[slug]/page.tsx` — category 空配列ガード~~ ✅

`c.category?.[0] ?? ""` と `r.category?.[0] ?? ""` の2箇所修正。

---

## 5. ~~ピラー定義の一元化~~ ✅

**対象:** `lib/constants.ts` に `PILLARS` / `PILLAR_MAP` / `PILLAR_BY_LABEL` 定義済み

### 5-1. ~~PILLARS 定数を定義~~ ✅

`lib/constants.ts` に `PILLARS`, `PILLAR_MAP`, `PILLAR_BY_LABEL` を定義。`Pillar` 型と連携。

### 5-2. ~~CaseCarousel・TreatmentTabs から PILLARS を参照~~ ✅

- `CaseCarousel.tsx` — ハードコード CATEGORIES 配列を `PILLARS.map()` で生成に変更
- `TreatmentTabs.tsx` — `PILLAR_META` / `PILLAR_ORDER` を削除し `PILLARS` / `PILLAR_MAP` を参照

---

## 6. ~~microCMS client のエラーログ統一~~ ✅

**対象:** `lib/microcms/client.ts`

### 6-1. ~~全 catch ブロックに console.error を追加~~ ✅

全13関数の空 catch ブロックに `console.error("[microcms] functionName failed:", e)` 追加済み。

---

## 作業順序

~~影響範囲と依存関係を考慮した推奨順:~~

```
✅ 1. lib/constants.ts 作成（1-1）
✅ 2. CTA コンポーネント作成（2-1）※ constants を import
✅ 3. 各ページの URL 置換 + CTA 置換を同時に行う（1-2, 1-3, 1-4, 2-2）
✅ 4. Supabase エラーハンドリング（3-1）
✅ 5. Null 安全性修正（4-1 〜 4-4）
✅ 6. ピラー定数化（5-2）
✅ 7. microCMS エラーログ統一（6-1）
```

残りは **5-2（ピラー名ハードコードの定数参照化）** のみ。
