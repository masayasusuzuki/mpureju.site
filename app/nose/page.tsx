import type { Metadata } from "next";
import { PillarTemplate, type PillarConfig, type Treatment } from "@/components/pillar/PillarTemplate";
import { getCasesByPillar, getTreatmentsByPillar } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "鼻の整形｜Maison PUREJU 銀座の美容外科",
  description:
    "プロテーゼ・鼻尖形成・鼻翼縮小・鼻中隔延長など鼻の美容外科施術。形成外科専門医が丁寧にご対応いたします。",
};

/* ── フォールバック（CMS未接続 or 0件時） ── */
const FALLBACK_TREATMENTS: Treatment[] = [
  { name: "プロテーゼ", slug: "implant", desc: "医療用シリコンを鼻腔内から挿入し、自然な鼻筋を高くします。傷跡が外から見えません。" },
  { name: "鼻尖形成", slug: "tip-plasty", desc: "余分な軟骨・脂肪を除去し鼻翼軟骨処理を行うことで、丸い鼻先を細く整えます。" },
  { name: "耳介軟骨移植", slug: "ear-cartilage", desc: "耳後面から自身の軟骨を採取し鼻先に移植。自家組織なので拒絶反応のリスクが低く自然な仕上がりです。" },
  { name: "ストラット法", slug: "strut", desc: "軟骨を「柱」として鼻柱に組み込み、安定した高さと鼻先の形状を形成します。鼻尖形成のオプションとして使用されます。" },
  { name: "鼻中隔軟骨移植", slug: "septal-cartilage", desc: "鼻中隔の軟骨を使用して安全に鼻先の高さを出す方法です。自家組織のため異物反応のリスクがありません。" },
  { name: "肋軟骨移植", slug: "rib-cartilage", desc: "肋軟骨を採取し、自然で安定した鼻先の形成や鼻翼基部の改善に使用します。十分な軟骨量を確保できます。" },
  { name: "鼻中隔延長", slug: "septum-extension", desc: "鼻中隔に軟骨を移植・固定し、鼻先を下向きに整えて横顔と正面のバランスを改善します。" },
  { name: "鼻翼縮小", slug: "alar-reduction", desc: "鼻翼の皮膚を切除し小鼻の広がりや鼻の穴の見え方を改善します。外側・内側・両方から適した術式を選択します。" },
  { name: "鼻孔縁下降", slug: "nostril-margin", desc: "耳軟骨を鼻孔縁に移植しアーチを下げることで、鼻の穴の目立ちを自然に解消します。" },
  { name: "鼻翼挙上", slug: "alar-elevation", desc: "垂れ下がった小鼻を引き上げ、鼻全体のバランスを整えます。" },
  { name: "鼻孔縁挙上", slug: "nostril-rim-elevation", desc: "鼻孔のラインを引き上げて、洗練されたすっきりとした鼻の印象に仕上げます。" },
  { name: "鼻骨骨切り", slug: "osteotomy", desc: "鼻骨を切って中央に寄せ、太く広がった鼻筋や曲がった鼻筋を細くまっすぐに整えます。" },
  { name: "ハンプ切除", slug: "hump-reduction", desc: "鼻骨の出っ張り（ハンプ）部分を切除し、鼻筋の隆起を平らにして鷲鼻を改善します。" },
  { name: "鼻翼基部形成（貴族手術）", slug: "alar-base", desc: "小鼻横の凹みを解消し、法令線を目立たなくする施術です。鼻に立体感を出します。" },
  { name: "鼻柱基部形成（猫手術）", slug: "columella-base", desc: "肋軟骨で横顔の凹みを持ち上げ、Eラインを整える施術です。" },
  { name: "側頭筋膜移植", slug: "temporal-fascia", desc: "側頭部の筋膜と肋軟骨を組み合わせ、自然な鼻筋を形成します。プロテーゼを使わない隆鼻術です。" },
  { name: "プロテーゼ抜去", slug: "implant-removal", desc: "以前挿入したプロテーゼの摘出と修正を行います。他院で施術された場合にも対応いたします。" },
];

export default async function NosePage() {
  const [data, caseData] = await Promise.all([
    getTreatmentsByPillar("nose"),
    getCasesByPillar("鼻"),
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
    slug: "nose",
    label: "鼻の整形",
    labelEn: "Nose",
    tagline: "顔の中心が変わると、印象が変わる。\n理想の鼻筋を、自然に形成する。",
    heroImage: "/pillarpage/nose_hero.jpg",
    concerns: [
      "鼻が低い",
      "鼻先が丸い・大きい",
      "小鼻が張っている",
      "鼻筋を通したい",
      "鼻の穴が目立つ",
      "ハンプ（鷲鼻）が気になる",
      "鼻柱が短い",
    ],
    treatments,
    faqs: [
      { q: "プロテーゼ挿入後のダウンタイムはどれくらいですか？", a: "腫れや内出血は2〜4週間ほど続きます。鼻の通りにくさを感じる場合がありますが、通常は1週間ほどで改善します。" },
      { q: "鼻の施術は複数同時に受けられますか？", a: "プロテーゼ＋鼻尖形成など、複数の施術を組み合わせることが多いです。ダウンタイムを1回にまとめられるメリットもあります。カウンセリングにてご相談ください。" },
      { q: "プロテーゼは将来的に取り出すことができますか？", a: "プロテーゼは取り出すことが可能です。長期間挿入している場合は拘縮が生じていることがあり、抜去が困難になる場合もあります。" },
      { q: "自分の軟骨と人工のプロテーゼ、どちらが良いですか？", a: "自家軟骨は拒絶反応がなく自然な感触ですが、採取部位への負担があります。シリコンプロテーゼは形の調整がしやすく実績も豊富です。ご希望や状態によって最適な方法をご提案します。" },
      { q: "鼻手術の傷跡は目立ちますか？", a: "多くの術式は鼻腔内から切開するため、外から傷跡が見えません。鼻翼縮小など一部の術式では鼻翼周囲に小さな傷跡が残りますが、時間の経過とともに目立たなくなります。" },
    ],
    caseCategory: "鼻",
    cases: caseData.contents.map(c => ({
      id: c.id, slug: c.slug, title: c.title, pillar: c.pillar,
      treatment_label: c.treatment_label, timing: c.timing, concern: c.concern,
      thumbnail: c.thumbnail,
    })),
  };

  return <PillarTemplate config={config} />;
}
