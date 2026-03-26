import type { Metadata } from "next";
import { PillarTemplate, type PillarConfig, type Treatment } from "@/components/pillar/PillarTemplate";
import { getTreatmentsByPillar } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "美容皮膚科",
  description:
    "ポテンツァ・ボトックス・レーザー・ヒアルロン酸など美容皮膚科施術。医師が丁寧にご対応いたします。",
};

/* ── フォールバック（CMS未接続 or 0件時） ── */
const FALLBACK_TREATMENTS: Treatment[] = [
  {
    name: "ブレッシング",
    slug: "bressing",
    desc: "極細の針を皮膚に斜めに挿入し、高周波エネルギーと美容成分を肌の奥深くまで届けます。コラーゲン生成促進・ニキビ跡クレーター改善に効果が期待できます。",
  },
  {
    name: "ソフウェーブ",
    slug: "sofwave",
    desc: "皮膚の深い層に超音波エネルギーを照射し、コラーゲンとエラスチンの生成を促進。ダウンタイムがほとんどないリフトアップ治療です。",
  },
  {
    name: "ポテンツァ",
    slug: "potenza",
    desc: "マイクロニードルとRFを組み合わせた次世代の肌再生治療。毛穴・ニキビ跡・肌のハリ改善に高い効果が期待できます。",
  },
  {
    name: "ボトックス注射",
    slug: "botox",
    desc: "筋肉の緊張をほぐし、額・眉間・目尻などのしわを自然に整えます。小顔・肩こりへの応用も可能です。",
  },
  {
    name: "ヒアルロン酸注射",
    slug: "hyaluronic-acid",
    desc: "体内に存在するヒアルロン酸を注入し、ほうれい線・涙袋・唇などを自然に整えます。",
  },
  {
    name: "レーザー治療",
    slug: "laser",
    desc: "シミ・そばかす・肝斑・毛穴など様々な肌悩みに対応。フラクショナル・トーニング・ジェネシスなど複数のメニューを展開。",
  },
  {
    name: "IPL / フォトフェイシャル",
    slug: "ipl",
    desc: "IPL（強力パルス光）でシミ・赤ら顔・そばかすを総合的に改善。ダウンタイムが少なく人気の施術です。",
  },
  {
    name: "ピーリング",
    slug: "peeling",
    desc: "マッサージピール・ミラノリピールなど高品質なピーリングでターンオーバーを促進。肌の質感を底上げします。",
  },
  {
    name: "HIFU（ウルトラセルZi）",
    slug: "hifu",
    desc: "超音波エネルギーをSMAS層まで届け、切らずにリフトアップ・たるみ改善が期待できます。",
  },
  {
    name: "スキンブースター",
    slug: "skin-booster",
    desc: "医師による手打ちで皮内にドラッグデリバリー。小じわ・くすみ・毛穴・乾燥を包括的に改善します。",
  },
  {
    name: "サーマジェン（RF）",
    slug: "thermagen",
    desc: "高周波を皮膚表面から脂肪層まで照射し、リフトアップ・脂肪引き締め・肌のハリ改善に効果が期待できます。",
  },
  {
    name: "ほくろ・イボ除去",
    slug: "mole-removal",
    desc: "CO2レーザーによる蒸散除去または切除法で対応。サイズ・深さに応じて最適な方法をご提案いたします。",
  },
];

export default async function SkinPage() {
  const data = await getTreatmentsByPillar("skin");

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
    slug: "skin",
    label: "美容皮膚科",
    labelEn: "Skin Care",
    tagline: "素肌の美しさが、自信を生む。\n最新の医療機器と薬剤で、理想の肌へ。",
    heroImage: "/pillarpage/skin_hero.jpg",
    concerns: [
      "毛穴の開き・黒ずみ",
      "シミ・そばかす",
      "ニキビ・ニキビ跡",
      "肌のたるみ",
      "しわ・小じわ",
      "赤ら顔",
      "肌のくすみ・ハリ不足",
      "ほくろ・イボが気になる",
    ],
    treatments,
    faqs: [
      {
        q: "ポテンツァのダウンタイムはどれくらいですか？",
        a: "施術後2〜3日ほど点状の出血（針跡）や赤みが出ることがあります。メイクは通常翌日から可能です。施術内容によって個人差があります。",
      },
      {
        q: "ボトックスの効果はどれくらい持続しますか？",
        a: "一般的に3〜6ヶ月ほど持続するとされています。繰り返し施術することで効果の持続が長くなる場合があります。",
      },
      {
        q: "レーザーとIPLはどう違いますか？",
        a: "レーザーは特定の波長の光を照射するため、ピンポイントでの治療に適しています。IPLは幅広い波長を照射するため、シミ・赤ら顔・毛穴など複合的な肌悩みに一度に対応できます。",
      },
      {
        q: "施術の組み合わせは可能ですか？",
        a: "複数の施術を組み合わせることで、相乗効果が期待できます。肌の状態や目標に合わせて最適な組み合わせをご提案します。",
      },
      {
        q: "敏感肌でも施術を受けられますか？",
        a: "敏感肌の方でも受けられる施術は多くありますが、事前にパッチテストが必要な場合があります。カウンセリングにて肌の状態をご確認のうえご提案いたします。",
      },
    ],
    caseCategory: "skin",
  };

  return <PillarTemplate config={config} />;
}
