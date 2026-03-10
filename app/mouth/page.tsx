import type { Metadata } from "next";
import { PillarTemplate, type PillarConfig } from "@/components/pillar/PillarTemplate";

export const metadata: Metadata = {
  title: "口の整形・唇の整形｜Maison PUREJU 銀座の美容外科",
  description:
    "口角挙上・人中短縮・M字リップなど口元の美容外科施術。形成外科専門医が丁寧にご対応いたします。",
};

const CONFIG: PillarConfig = {
  slug: "mouth",
  label: "口の整形・唇の整形",
  labelEn: "Mouth & Lips",
  tagline: "唇の美しさが、表情を変える。\n繊細な口元に、確かな技術を。",
  heroImage: "/pillarpage/mouth_hero.jpg",
  concerns: [
    "口角が下がっている",
    "人中が長い",
    "唇を薄くしたい",
    "唇を厚くしたい",
    "笑うと歯茎が見える",
    "口元の印象を変えたい",
    "左右の非対称が気になる",
  ],
  treatments: [
    {
      name: "口角挙上",
      slug: "lip-corner-lift",
      desc: "下がった口角の皮膚・粘膜を切開し筋肉処理を行うことで、口角を上外側に引き上げます。",
    },
    {
      name: "M字リップ",
      slug: "m-lip",
      desc: "上唇の一部を切除しM字型の立体感ある唇ラインを形成。筋弁作成オプションによるさらなる立体化も可能です。",
    },
    {
      name: "人中短縮",
      slug: "philtrum-shortening",
      desc: "鼻の下を切開し余分な皮膚を切除することで人中を短くし、顔の縦バランスを整えます。",
    },
    {
      name: "口唇縮小",
      slug: "lip-reduction",
      desc: "厚ぼったい唇（たらこ唇）を切除・形成し、すっきりとした自然な口元を実現します。",
    },
    {
      name: "ガミースマイル手術",
      slug: "gummy-smile",
      desc: "上唇の裏から粘膜を切除し、笑ったときに歯茎が見える面積を自然に減らします。",
    },
    {
      name: "口唇拡大",
      slug: "lip-enlargement",
      desc: "口の裏側粘膜をW字切開し表側に移動させ、唇を自然に厚く見せます。",
    },
    {
      name: "外側人中短縮",
      slug: "lateral-philtrum",
      desc: "上唇外側の余分な皮膚を切除して上唇を引き上げ、顔全体の余白バランスを整えます。",
    },
    {
      name: "ピーナッツリップ",
      slug: "peanut-lip",
      desc: "下唇の一部を切除しピーナッツ型の立体感ある唇の形を実現します。",
    },
  ],
  faqs: [
    {
      q: "口角挙上のダウンタイムはどれくらいですか？",
      a: "腫れや内出血は2〜4週間ほど続くことがあります。抜糸は術後7日前後に行います。術後のむくみが落ち着くにつれ、徐々に自然な仕上がりになります。",
    },
    {
      q: "人中短縮は傷跡が残りますか？",
      a: "鼻の下（鼻柱基部）に沿って切開するため、傷跡が目立ちにくい位置になります。通常3〜6ヶ月で傷跡はほとんど目立たなくなりますが、個人差があります。",
    },
    {
      q: "M字リップは後戻りしますか？",
      a: "切開法のため埋没法と比較して後戻りはほとんどありません。ただし加齢による変化は生じることがあります。",
    },
    {
      q: "複数の口元施術を同時に受けられますか？",
      a: "複数の施術を組み合わせることが可能です。ダウンタイムや回復状況を考慮したうえで、カウンセリングにてご提案いたします。",
    },
    {
      q: "施術を受けられない方はいますか？",
      a: "妊娠中・授乳中の方、重篤な全身疾患のある方などは施術をお断りする場合があります。詳しくはカウンセリングにてご確認ください。",
    },
  ],
  caseCategory: "mouth",
};

export default function MouthPage() {
  return <PillarTemplate config={CONFIG} />;
}
