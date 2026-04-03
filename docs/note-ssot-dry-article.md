# 「動くコード」と「壊れないコード」の違い ── TypeScript初心者が最初に身につけるべき3つの原則

## はじめに

プログラミングを学び始めると、まず「動くコード」を書くことに集中します。
それは正しい。動かないコードに価値はありません。

でも、ある程度書けるようになった頃、こんな経験をしませんか？

- 1箇所直したのに、別の画面でバグが出た
- 同じようなコードをコピペしまくって、どこを直せばいいかわからなくなった
- たまにアプリが真っ白になって、原因がさっぱりわからない

これは「動くけど壊れやすいコード」を書いているサインです。

この記事では、**実際の美容クリニックのWebサイト開発**で遭遇した問題をもとに、初心者が最初に覚えるべき3つの原則を解説します。

---

## 原則1: SSOT（同じ情報は1箇所だけに書く）

### SSOTとは

**SSOT = Single Source of Truth**（シングル・ソース・オブ・トゥルース）。
日本語にすると「信頼できる情報源は1つだけにしよう」という意味です。

### 悪い例：同じURLを20箇所に書く

たとえば、予約ページへのリンクがサイト内のいろんなページにあるとします。

```tsx
// トップページ
<a href="https://example.com/reservation/abc123">Web予約</a>

// 料金ページ（同じURLをコピペ）
<a href="https://example.com/reservation/abc123">Web予約</a>

// 症例ページ（また同じURLをコピペ）
<a href="https://example.com/reservation/abc123">Web予約</a>

// ... こんなのが20ファイルに散らばっている
```

一見、問題なく動きます。

でもある日、予約システムが変わってURLが変わったら？
**20ファイル全部を手作業で直す必要があります。**

1箇所でも直し忘れたら、そのページだけ古いURLに飛んで予約できない。
しかもテストしないと気づかない。最悪です。

### 良い例：1箇所に定義して、参照する

```tsx
// lib/constants.ts ← ここだけに書く
export const CLINIC = {
  reservationUrl: "https://example.com/reservation/abc123",
  lineUrl: "https://lin.ee/example",
  phone: "03-1234-5678",
} as const;
```

```tsx
// トップページ（定数を参照するだけ）
import { CLINIC } from "@/lib/constants";
<a href={CLINIC.reservationUrl}>Web予約</a>

// 料金ページ（同じ定数を参照）
import { CLINIC } from "@/lib/constants";
<a href={CLINIC.reservationUrl}>Web予約</a>
```

URLが変わっても `constants.ts` の1行を直すだけ。全ページに自動で反映されます。

### ポイント

SSOTの考え方はURLに限りません。

- **住所、電話番号、営業時間** → 定数ファイルに
- **色やフォントサイズ** → CSS変数やテーマに
- **カテゴリ一覧やメニュー項目** → 配列として1箇所に

「この情報が変わったとき、何箇所直す必要がある？」と自問してください。
答えが2以上なら、SSOTに違反しています。

---

## 原則2: DRY（同じコードを繰り返さない）

### DRYとは

**DRY = Don't Repeat Yourself**（同じことを繰り返すな）。

SSOTが「データ」の話だったのに対し、DRYは「コード」の話です。

### 悪い例：同じUIを14ファイルにコピペ

サイトの下部に「ご予約はこちら」というセクションがあるとします。

```tsx
// doctor/page.tsx
<section className="py-16 bg-white border-t">
  <div className="max-w-5xl mx-auto text-center">
    <p className="text-xs tracking-widest text-gold mb-4">CONSULTATION</p>
    <h2 className="text-2xl mb-3">ご予約・ご相談はこちら</h2>
    <p className="text-sm text-gray-500 mb-8">
      まずはカウンセリングでお気軽にご相談ください。
    </p>
    <a href="https://example.com/reservation" className="bg-gold px-10 py-4">
      Web予約
    </a>
    <a href="https://lin.ee/example" className="border px-10 py-4">
      LINE予約
    </a>
  </div>
</section>
```

これとほぼ同じコードが14ファイルにコピペされていたら、何が起きるか。

- ボタンのデザインを変えたい → **14ファイル全部直す**
- 「電話予約」ボタンを追加したい → **14ファイル全部に追加**
- あるページだけ微妙にコードが違う → **バグなのか意図的なのかわからない**

### 良い例：コンポーネントにする

```tsx
// components/ConsultationCTA.tsx ← 1箇所にまとめる
export function ConsultationCTA({ subtitle = "デフォルトのテキスト" }) {
  return (
    <section className="py-16 bg-white border-t">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-xs tracking-widest text-gold mb-4">CONSULTATION</p>
        <h2 className="text-2xl mb-3">ご予約・ご相談はこちら</h2>
        <p className="text-sm text-gray-500 mb-8">{subtitle}</p>
        <a href={CLINIC.reservationUrl} className="bg-gold px-10 py-4">
          Web予約
        </a>
        <a href={CLINIC.lineUrl} className="border px-10 py-4">
          LINE予約
        </a>
      </div>
    </section>
  );
}
```

```tsx
// 各ページ（1行で済む）
<ConsultationCTA subtitle="まずはカウンセリングでお気軽にご相談ください。" />
```

30行のコピペが1行になりました。

### 「でもページごとに少し違うんだけど...」

よくある悩みです。コンポーネント化を躊躇する一番の理由がこれ。

答えは **props（プロパティ）で差分を吸収する** です。

```tsx
// variant で大きな違いを、subtitle で細かい違いを制御
<ConsultationCTA variant="center" subtitle="お気軽にご相談ください。" />
<ConsultationCTA variant="left" subtitle="料金についてはカウンセリングで。" />
```

全部が完全に同じである必要はありません。
「構造は同じで、テキストやレイアウトが少し違う」ならコンポーネント化の対象です。

### DRYにしすぎない判断

ただし注意点もあります。
たまたま似ているだけで、**今後別々に変わっていくもの**を無理に共通化すると、後で分離するのが大変です。

判断基準はシンプル：

- **同じ理由で同時に変わる** → 共通化すべき（DRY）
- **たまたま今似てるだけ** → 別々でいい

---

## 原則3: 防御的プログラミング（外から来るデータを信用しない）

### なぜ必要か

TypeScriptで型を書いていると「型があるから安全」と思いがちです。
でも型はあくまでコンパイル時のチェック。**実行時にデータがその通り来る保証はありません。**

データベース、API、ユーザー入力 ── コードの「外側」から来るものは全部疑ってかかるべきです。

### 悪い例1：データベースが落ちたらページが真っ白

```tsx
// APIからデータを取得
async function getTreatments() {
  const { data } = await supabase.from("treatments").select("*");
  return data ?? [];
}
```

一見問題なさそうですが、`supabase.from(...)` 自体が例外を投げたら？
（ネットワークエラー、タイムアウト、DB停止など）

try/catchがないので、エラーがそのまま上に伝わって**ページ全体が500エラー**になります。
ユーザーには真っ白な画面が表示されます。

```tsx
// 修正後
async function getTreatments() {
  try {
    const { data } = await supabase.from("treatments").select("*");
    return data ?? [];
  } catch (e) {
    console.error("getTreatments failed:", e);
    return []; // 空配列を返す → ページ自体は表示される
  }
}
```

データ取得に失敗しても、ページのレイアウトは表示されます。
「施術一覧」の部分が空になるだけで、予約ボタンや他の情報は見えます。

### 悪い例2：「絶対あるはず」という思い込み

```tsx
const current = tabs.find((t) => t.id === activeId)!;
//                                                  ^ この「!」が危険
```

TypeScriptの `!` は **非nullアサーション** といって、「これは絶対nullじゃないから型チェックしなくていいよ」という意味です。

でも本当に「絶対」でしょうか？

- `activeId` の初期値がtypoしていたら？
- `tabs` のデータ構造が変わったら？
- CMSの設定が変わってデータが来なくなったら？

```tsx
// 修正後：見つからないケースを正直に処理する
const current = tabs.find((t) => t.id === activeId);
if (!current) return null; // 見つからなかったら何も表示しない
```

### 悪い例3：配列やプロパティが空かもしれない

```tsx
// concern が undefined なら .split() で即クラッシュ
{item.concern.split(",").join("・")}

// category が空配列なら [0] は undefined
{item.category[0]}
```

```tsx
// 修正後：optional chaining（?.）で安全にアクセス
{item.concern?.split(",").join("・") ?? ""}
{item.category?.[0] ?? ""}
```

`?.` は「左側がnull/undefinedだったら、そこで止めてundefinedを返す」という構文です。
`??` は「左側がnull/undefinedだったら、右側の値を使う」という構文です。

この2つはTypeScript初心者が真っ先に覚えるべき構文です。

### どこまで守ればいいのか

全部にガードを入れると冗長になります。基準はこうです：

| データの出どころ | 信頼度 | 対応 |
|---|---|---|
| 自分のコード内で定義した定数 | 高い | そのまま使ってOK |
| API / データベースからの取得 | 低い | try/catch + nullチェック |
| ユーザーの入力（フォーム等） | 最低 | バリデーション必須 |

**コードの「境界」を意識すること。** 外の世界との接点にだけ防御を入れれば十分です。

---

## 3つの原則のつながり

| 原則 | 守るもの | 一言 |
|---|---|---|
| SSOT | データの一貫性 | 「この情報はどこにある？」に即答できる |
| DRY | コードの保守性 | 「この変更は何箇所直す？」の答えが常に1 |
| 防御的プログラミング | アプリの安定性 | 「外のデータが壊れてもページは表示される」 |

この3つは独立しているようで、根っこはつながっています。

**「変更に強いコードを書く」** という1つのゴールに向かっている。

コードは書いた瞬間から古くなります。URLは変わるし、デザインは変わるし、APIは落ちる。
「変わること」を前提に書くのが、プロのコードです。

---

## まとめ：今日からできること

1. **コピペしたくなったら立ち止まる。** 「これ、定数にできない？コンポーネントにできない？」と5秒考える
2. **外からデータを取る関数には必ずtry/catchを書く。** 空配列を返すだけでいい
3. **`!`（非nullアサーション）を使わない。** 代わりに `if (!x) return` で安全に処理する
4. **`?.` と `??` を習慣にする。** データが来ないケースは必ずある

完璧なコードをいきなり書く必要はありません。
「このコード、半年後の自分が見て直せるかな？」と想像するだけで、コードの質は変わります。
