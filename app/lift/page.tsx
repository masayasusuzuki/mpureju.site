import type { Metadata } from "next";
import { PillarTemplate, type PillarConfig, type Treatment } from "@/components/pillar/PillarTemplate";
import { getCasesByPillar, getTreatmentsByPillar } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "リフトアップ｜Maison PUREJU 銀座の美容外科",
  description:
    "糸リフト・MACSフェイスリフト・SMASフェイスリフトなどたるみ・リフトアップ施術。形成外科専門医が丁寧にご対応いたします。",
};

/* ── フォールバック（CMS未接続 or 0件時） ── */
const FALLBACK_TREATMENTS: Treatment[] = [
  { name: "糸リフト", slug: "thread-lift", desc: "独自の吸収糸でたるみを引き上げます。切開不要でダウンタイムが短く、肌質改善やコラーゲン生成効果も期待できます。" },
  { name: "ショートスレッド", slug: "short-thread", desc: "極細の短い糸を肌に埋入し、土台から引き締めます。異物リスクを最小限に抑えながら、ハリとツヤが徐々に向上します。" },
  { name: "アイスレッド", slug: "eye-thread", desc: "極細糸で目元のコラーゲン増産を促進。切らずに目元の凹みやクマを内側から改善し、明るい表情を取り戻します。" },
  { name: "MACSフェイスリフト", slug: "macs-facelift", desc: "耳周囲切開でSMASの裏面を剥離せずに引き上げる術式。フェイスリフトの中でも比較的ダウンタイムが短い。" },
  { name: "SMASフェイスリフト", slug: "smas-facelift", desc: "SMAS（顔面表在筋膜）ごと皮下組織を持ち上げる最大限のリフトアップ術式。効果の持続期間が長い。" },
  { name: "ネックリフト", slug: "neck-lift", desc: "耳後ろの余分な皮膚を除去し皮膚・筋膜を引き上げることで、首〜あごのたるみを改善します。" },
  { name: "脂肪吸引（フェイス）", slug: "facial-liposuction", desc: "カニューレで顔の脂肪を吸引しフェイスラインをすっきり小顔に仕上げます。" },
  { name: "バッカルファット除去", slug: "buccal-fat", desc: "口横の深い脂肪（バッカルファット）を除去。将来のたるみ予防にも効果が期待できます。" },
  { name: "脂肪注入", slug: "fat-injection", desc: "自身の脂肪を採取し顔のくぼんだ部分に注入。肌のハリ・血流改善効果もあります。" },
  { name: "ペリカンリフト", slug: "pelican-lift", desc: "あご下切開で深い脂肪の切除と筋肉の引き締めを行い、あご下のたるみを改善します。" },
  { name: "こめかみリフト", slug: "temporal-lift", desc: "こめかみ付近の余分な皮膚を切除し、目元・目尻のたるみを解消します。" },
];

export default async function LiftPage() {
  const [data, caseData] = await Promise.all([
    getTreatmentsByPillar("lift"),
    getCasesByPillar("リフトアップ"),
  ]);

  const treatments: Treatment[] =
    data.contents.length > 0
      ? data.contents.map((t) => ({
          name: t.title,
          slug: t.slug,
          desc: t.catch_copy,
          image: t.hero_image ? { url: t.hero_image.url } : undefined,
        }))
      : FALLBACK_TREATMENTS;

  const config: PillarConfig = {
    slug: "lift",
    label: "糸の施術・リフトアップ",
    labelEn: "Lift & Contour",
    tagline: "時を重ねた輪郭に、若々しい引き締めを。\n確かな技術で、フェイスラインを取り戻す。",
    heroImage: "/pillarpage/lift_hero.jpg",
    concerns: [
      "頬のたるみが気になる",
      "フェイスラインが緩んできた",
      "ほうれい線が深い",
      "首・あごのたるみ",
      "顔の脂肪を落としたい",
      "マリオネットラインが気になる",
      "バッカルファットを取りたい",
    ],
    treatments,
    faqs: [
      { q: "糸リフトの効果はどれくらい持続しますか？", a: "使用する糸の種類によりますが、1〜2年ほど持続するとされています。コラーゲン生成の効果が加わることで、糸が吸収された後も一定の効果が残ることが期待できます。" },
      { q: "フェイスリフト後のダウンタイムはどれくらいですか？", a: "MACSフェイスリフトで2〜4週間、SMASフェイスリフトで4〜6週間程度が目安です。抜糸は術後1〜2週間で行います。" },
      { q: "糸リフトと切開リフトはどう違いますか？", a: "糸リフトはダウンタイムが短く気軽に受けられますが、効果の持続期間は切開リフトより短い傾向があります。切開リフトは一度の施術で長期間の効果が期待できますが、回復に時間がかかります。年齢や状態に応じてご提案いたします。" },
      { q: "バッカルファット除去は将来たるみに影響しますか？", a: "バッカルファットは加齢とともに垂れ下がる脂肪のため、早期に除去することでたるみ予防効果が期待できます。ただし過剰な除去は頬こけの原因となるため、適切な量の見極めが重要です。" },
      { q: "脂肪注入はどのくらい生着しますか？", a: "注入した脂肪の定着率は概ね30〜60%とされています。一度定着した脂肪は長期間持続するとされています。当院ではナノリッチ法により細かく精製した脂肪を注入し、より高い生着率を目指しています。" },
    ],
    caseCategory: "リフトアップ",
    cases: caseData.contents.map(c => ({
      id: c.id, slug: c.slug, title: c.title, pillar: c.pillar,
      treatment_label: c.treatment_label, timing: c.timing, concern: c.concern,
      thumbnail: c.thumbnail,
    })),
  };

  return <PillarTemplate config={config} />;
}
