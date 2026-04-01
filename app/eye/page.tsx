import type { Metadata } from "next";
import { PillarTemplate, type PillarConfig, type Treatment } from "@/components/pillar/PillarTemplate";
import { getCasesByPillar, getTreatmentsByPillar } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "目・目元の整形｜Maison PUREJU 銀座の美容外科",
  description:
    "二重埋没・眼瞼下垂・脱脂・ハムラ法など目元の美容外科施術。形成外科専門医が丁寧にご対応いたします。",
};

/* ── フォールバック（CMS未接続 or 0件時） ── */
const FALLBACK_TREATMENTS: Treatment[] = [
  {
    name: "二重埋没",
    slug: "double-eyelid-suture",
    desc: "線留めで腫れを最小限に抑えながら自然な二重を形成。日常生活への影響が少なく人気の術式です。",
  },
  {
    name: "二重抜糸",
    slug: "double-eyelid-removal",
    desc: "以前の埋没法による違和感やゴロゴロ感を解消。最小限の傷跡で本来の目元を取り戻します。",
  },
  {
    name: "二重全切開",
    slug: "double-eyelid-incision",
    desc: "皮膚を切開し半永久的な二重を形成。皮膚のたるみや余分な脂肪の除去も同時に対応可能です。",
  },
  {
    name: "眼瞼下垂",
    slug: "ptosis",
    desc: "眼瞼挙筋の腱膜を調整しまぶたの開きを改善。目力アップや疲れ目・頭痛の改善にも効果が期待できます。",
  },
  {
    name: "眉下切開",
    slug: "brow-lift",
    desc: "眉毛下の皮膚を切除しまぶたのたるみを改善。自然な仕上がりで二重のデザインを変えずに行えます。",
  },
  {
    name: "目頭切開",
    slug: "epicanthoplasty",
    desc: "蒙古襞を切開し目の横幅を広げることで、より大きく印象的な目元を実現します。",
  },
  {
    name: "目頭上切開",
    slug: "upper-epicanthoplasty",
    desc: "目頭の突っ張りを解消し、内側から二重ラインをクッキリさせる施術です。",
  },
  {
    name: "脱脂（下まぶた）",
    slug: "under-eye-fat-removal",
    desc: "下まぶた裏側から眼窩脂肪を取り出しクマ・たるみを改善。傷跡が表面に残りません。",
  },
  {
    name: "上眼瞼除皺（睫毛上切開）",
    slug: "upper-blepharoplasty",
    desc: "加齢によるまぶたのたるみ・ハム目を解消し、若々しくすっきりとした目元を実現します。",
  },
  {
    name: "下眼瞼除皺",
    slug: "lower-blepharoplasty",
    desc: "目の下のたるみやシワを切除し引き締めることで、疲れた印象を改善します。",
  },
  {
    name: "下眼瞼除皺＋脱脂",
    slug: "lower-blepharoplasty-fat",
    desc: "下まぶたのたるみ切除と脂肪除去を同時に行い、老けた印象を効果的に改善する複合施術です。",
  },
  {
    name: "脂肪再配置",
    slug: "fat-repositioning",
    desc: "目の下の凹凸やくぼみの原因となる脂肪を適切な位置に移動・固定し、自然なハリを取り戻します。",
  },
  {
    name: "表ハムラ",
    slug: "hamra",
    desc: "皮膚側から切開し眼窩脂肪を移動・固定することで、目の下のくい込みやクマを改善します。",
  },
  {
    name: "裏ハムラ",
    slug: "transconjunctival-hamra",
    desc: "結膜側からアプローチし眼窩脂肪を再配置。皮膚に傷跡を残さず影クマ・たるみを根本改善します。",
  },
  {
    name: "目尻切開",
    slug: "lateral-canthoplasty",
    desc: "まぶた外側を切開し白目を大きくすることで、切れ長で印象的な目元を実現します。",
  },
  {
    name: "グラマラスライン",
    slug: "glamorous",
    desc: "下まぶたを下げて垂れ目にすることで、パッと明るく可愛らしい表情を実現します。",
  },
  {
    name: "蒙古襞形成",
    slug: "mongolian-fold",
    desc: "離れた目頭に蒙古襞を作ることで、目と目の距離を調整し優しい印象に仕上げます。",
  },
];

export default async function EyePage() {
  const [data, caseData] = await Promise.all([
    getTreatmentsByPillar("eye"),
    getCasesByPillar("目元"),
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
    slug: "eye",
    label: "目・目元の整形",
    labelEn: "Eye",
    tagline: "目元の輝きが、印象を変える。\n繊細な技術で、理想の目元へ。",
    heroImage: "/pillarpage/eye_hero.jpg",
    concerns: [
      "一重まぶたが気になる",
      "目が小さく見える",
      "まぶたのたるみ",
      "目が開きにくい（眼瞼下垂）",
      "黒クマ・目のたるみ",
      "目と目が離れている",
      "目尻が下がっている",
    ],
    treatments,
    faqs: [
      {
        q: "二重埋没はどれくらい持続しますか？",
        a: "個人差はありますが、数年〜十数年持続するとされています。まぶたの脂肪が多い方や、二重の幅が広い方は取れやすい傾向があります。当院ではPVDF糸を使用し、取れにくさを高めています。",
      },
      {
        q: "眼瞼下垂の術後はどのような状態になりますか？",
        a: "術後はまぶたが開きやすくなり、目力アップや疲れ目の改善が期待できます。腫れは1〜2週間ほどで引いてきますが、完成は3〜6ヶ月程度かかります。",
      },
      {
        q: "二重手術後のダウンタイムはどれくらいですか？",
        a: "埋没法の場合は腫れが1〜2週間ほど。全切開の場合は2〜4週間ほどのダウンタイムが目安となります。個人差がありますので、余裕を持ったスケジュールでご検討ください。",
      },
      {
        q: "脱脂手術はどのようなクマに有効ですか？",
        a: "眼窩脂肪の突出による「黒クマ」「茶クマ」に効果が期待できます。血行不良による「青クマ」や色素沈着による「茶クマ」は別のアプローチが必要な場合があります。カウンセリングにてご確認ください。",
      },
      {
        q: "他院で施術を受けましたが修正は可能ですか？",
        a: "他院修正にも対応しております。過去の施術内容によって対応方法が異なるため、カウンセリングにて詳しくご確認ください。",
      },
    ],
    caseCategory: "目元",
    cases: caseData.contents.map(c => ({
      id: c.id, slug: c.slug, title: c.title, pillar: c.pillar,
      treatment_label: c.treatment_label, timing: c.timing, concern: c.concern,
      thumbnail: c.thumbnail,
    })),
  };

  return <PillarTemplate config={config} />;
}
