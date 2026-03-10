import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PriceSubTabs, type SubTab, type PriceRow } from "@/components/sections/PriceSubTabs";
import { PriceNav, type SearchRow } from "@/components/sections/PriceNav";

export const metadata: Metadata = {
  title: "料金一覧｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの施術料金一覧。皮膚科・外科・点滴・内服薬・化粧品の税込価格をカテゴリ別に掲載しています。",
};

// ============================================================
// PRICE DATA
// TODO: Phase 2 で microCMS treatments.price_options[] に移行
// 参照元: docs/price-list.md
// ============================================================

const HIFUKA_TABS: SubTab[] = [
  {
    label: "ヒアルロン酸",
    rows: [
      { category: "ボルベラ/ボリフト/ボリューマ/ボラックス/レスチレン", option: "1本", price: "¥99,000" },
      { category: "", option: "2本", price: "¥190,000" },
      { category: "", option: "3本", price: "¥270,000" },
      { category: "", option: "4本目以降", price: "¥80,000" },
      { category: "", option: "鈍針追加", price: "¥2,500" },
      { category: "ボライト", option: "1本", price: "¥88,000" },
      { category: "", option: "2本", price: "¥149,000" },
      { category: "", option: "3本", price: "¥199,000" },
    ],
  },
  {
    label: "ボトックス",
    rows: [
      { category: "アラガン", option: "表情筋1部位（12単位まで）", price: "¥19,800" },
      { category: "", option: "50単位まで", price: "¥75,000" },
      { category: "", option: "100単位まで", price: "¥139,000" },
      { category: "", option: "タッチアップ（1ヶ月以内）", price: "¥9,900〜" },
      { category: "", option: "12単位（6ヶ月以内リピート）", price: "¥17,820" },
      { category: "", option: "50単位（6ヶ月以内リピート）", price: "¥63,750" },
      { category: "", option: "100単位（6ヶ月以内リピート）", price: "¥111,200" },
      { category: "コアトックス", option: "100単位まで", price: "¥84,000" },
    ],
  },
  {
    label: "ソフウェーブ",
    rows: [
      { category: "ソフウェーブ", option: "頬のみ", price: "¥165,000" },
      { category: "", option: "口横＋顎下", price: "¥165,000" },
      { category: "", option: "全顔", price: "¥198,000" },
      { category: "", option: "全顔＋あご下＋首", price: "¥248,000" },
      { category: "ドクター照射代", option: "", price: "¥80,000" },
    ],
  },
  {
    label: "ブレッシング",
    rows: [
      { category: "DRS/VRS", option: "", price: "¥77,000" },
      { category: "薬剤", option: "マックーム", price: "¥22,000" },
      { category: "", option: "PRP", price: "¥22,000" },
      { category: "", option: "ジュベルック", price: "¥22,000" },
      { category: "", option: "プルリアル", price: "¥22,000" },
      { category: "", option: "ジャルプロ", price: "¥22,000" },
      { category: "", option: "ボトックス", price: "¥10,000" },
    ],
  },
  {
    label: "ウルトラセルZi（HIFU）",
    rows: [
      { category: "ウルトラセルZi", option: "400shot", price: "¥108,000" },
      { category: "", option: "500shot", price: "¥133,000" },
      { category: "", option: "600shot", price: "¥153,000" },
      { category: "ウルトラセルZi：脂肪（1回200shot）", option: "1回", price: "¥55,000" },
      { category: "", option: "3回", price: "¥145,000" },
      { category: "ドクター照射代", option: "", price: "¥50,000" },
    ],
  },
  {
    label: "XERF（RF）",
    rows: [
      { category: "スタンダード", price: "¥99,000" },
      { category: "プレミアム", price: "¥165,000" },
      { category: "HIFU＋XERF", price: "¥207,000" },
      { category: "ドクター照射代", price: "¥50,000" },
    ],
  },
  {
    label: "サーマジェン（RF）",
    rows: [
      { category: "サーマジェン400shot", option: "1回", price: "¥78,000" },
      { category: "", option: "3回", price: "¥198,000" },
      { category: "サーマジェン100shot追加", option: "", price: "¥18,000" },
      { category: "ドクター照射代", option: "", price: "¥50,000" },
    ],
  },
  {
    label: "サーマハンド",
    rows: [
      { category: "サーマハンド", price: "¥99,000" },
      { category: "ドクター照射代", price: "¥50,000" },
    ],
  },
  {
    label: "サーマZi（RF＋HIFU）",
    rows: [
      { category: "サーマジェン＋ウルトラセルZi 計800shot", option: "1回", price: "¥168,000" },
      { category: "ドクター照射代", option: "", price: "¥50,000" },
    ],
  },
  {
    label: "ポテンツァ",
    rows: [
      { category: "ニキビ跡・毛穴", option: "1回", price: "¥99,000" },
      { category: "", option: "3回", price: "¥270,000" },
      { category: "肌育成", option: "1回", price: "¥70,000" },
      { category: "", option: "3回", price: "¥189,000" },
      { category: "肝斑", option: "1回", price: "¥55,000" },
      { category: "", option: "5回", price: "¥229,000" },
      { category: "ニキビ", option: "10個まで", price: "¥35,000" },
      { category: "ダイヤモンド", option: "1回", price: "¥55,000" },
      { category: "", option: "3回", price: "¥150,000" },
      { category: "ポテンツァアイ", option: "1回", price: "¥55,000" },
      { category: "", option: "3回", price: "¥150,000" },
      { category: "ドクター照射代", option: "", price: "¥50,000" },
    ],
  },
  {
    label: "サーマニードル",
    rows: [
      { category: "全顔", option: "1回", price: "¥69,000" },
      { category: "顎下追加", option: "", price: "¥10,000" },
      { category: "首追加", option: "", price: "¥10,000" },
      { category: "肌育（肝斑）", option: "1回", price: "¥55,000" },
      { category: "エクソソーム追加（肝斑）", option: "", price: "¥10,000" },
      { category: "ドクター照射代", option: "", price: "¥50,000" },
    ],
  },
  {
    label: "メソナJ",
    rows: [
      { category: "メソナJ", option: "1回", price: "¥29,000" },
      { category: "", option: "3回", price: "¥79,000" },
      { category: "メソナJ（プレミアム）", option: "1回", price: "¥33,000" },
      { category: "", option: "3回", price: "¥90,000" },
    ],
  },
  {
    label: "レーザー",
    rows: [
      { category: "スポット", option: "5mm未満", price: "¥11,000" },
      { category: "【ピンポイントのしみ】", option: "5mm以上", price: "¥22,000" },
      { category: "", option: "全顔", price: "¥99,000" },
      { category: "ルビーフラクショナル", option: "1回", price: "¥33,000" },
      { category: "【複数のしみ・そばかす】", option: "3回", price: "¥89,000" },
      { category: "カスタマイズトーニング", option: "1回", price: "¥25,500" },
      { category: "【くすみ・肝斑】", option: "3回", price: "¥69,000" },
      { category: "ジェネシス（全顔＋首）", option: "1回", price: "¥25,500" },
      { category: "【赤み・肌のハリ】", option: "3回", price: "¥69,000" },
      { category: "ジェネシス（手の甲/首）", option: "1回", price: "¥16,500" },
      { category: "", option: "3回", price: "¥45,000" },
      { category: "トーニング＋ジェネシス", option: "1回", price: "¥44,000" },
      { category: "", option: "3回", price: "¥118,000" },
      { category: "フラクショナル", option: "1回", price: "¥33,000" },
      { category: "【毛穴・小じわ】", option: "3回", price: "¥89,000" },
      { category: "カスタマイズレーザー", option: "1回", price: "¥59,000" },
      { category: "【フラクショナル＋トーニング＋ジェネシス】", option: "3回", price: "¥159,000" },
    ],
  },
  {
    label: "IPL/フォトフェイシャル",
    rows: [
      { category: "セレックV", option: "1回", price: "¥27,500" },
      { category: "", option: "3回", price: "¥75,000" },
    ],
  },
  {
    label: "KOライト",
    rows: [
      { category: "全顔1回", price: "¥6,600" },
      { category: "全顔5回", price: "¥29,900" },
      { category: "他院術後1回", price: "¥11,000" },
      { category: "他院術後5回", price: "¥49,900" },
    ],
  },
  {
    label: "スキンブースター（手打ち）",
    rows: [
      { category: "ベビーピンク", option: "", price: "¥39,000" },
      { category: "ジャルプロクラシック（3cc）", option: "1回", price: "¥55,000" },
      { category: "", option: "4回", price: "¥200,000" },
      { category: "ジャルプロスーパーハイドロ", option: "1回", price: "¥110,000" },
      { category: "", option: "3回", price: "¥300,000" },
      { category: "エラスティックブースター（6cc）", option: "全顔/手の甲", price: "¥88,000" },
      { category: "", option: "首追加", price: "¥20,000" },
      { category: "うるおいシルキー注射（8cc）", option: "全顔/手の甲", price: "¥140,000" },
      { category: "", option: "首追加", price: "¥40,000" },
      { category: "プレミアムシルキー注射", option: "全顔", price: "¥180,000" },
      { category: "", option: "首追加", price: "¥50,000" },
      { category: "エクソソーム（顔/頭皮）", option: "1回", price: "¥99,000" },
      { category: "", option: "3回", price: "¥270,000" },
      { category: "", option: "首追加", price: "¥60,000" },
    ],
  },
  {
    label: "ブースター（機械導入）",
    rows: [
      { category: "ベビーピンク", price: "¥22,000" },
      { category: "マックーム", price: "¥22,000" },
      { category: "PRP", price: "¥22,000" },
      { category: "ジュベルック", price: "¥22,000" },
      { category: "PN2%", price: "¥22,000" },
      { category: "ジャルプロクラシック", price: "¥22,000" },
      { category: "プルリアル", price: "¥22,000" },
      { category: "エクソソーム", price: "¥33,000" },
      { category: "ボトックス", price: "¥10,000" },
      { category: "ナノゴールド", price: "¥5,500" },
    ],
  },
  {
    label: "脂肪溶解注射",
    rows: [
      { category: "チンセラプラス", option: "4cc", price: "¥50,000" },
      { category: "", option: "8cc", price: "¥90,000" },
    ],
  },
  {
    label: "ピーリング",
    rows: [
      { category: "メイクアップピール", option: "", price: "¥20,000" },
      { category: "", option: "他施術併用", price: "¥16,500" },
      { category: "ミックスピールマヌカ", option: "", price: "¥20,000" },
      { category: "", option: "他施術併用", price: "¥16,500" },
      { category: "マッサージピール", option: "顔", price: "¥20,000" },
      { category: "", option: "顔＋首", price: "¥29,700" },
      { category: "", option: "手の甲", price: "¥16,500" },
      { category: "ペパーミントピール", option: "", price: "¥20,000" },
      { category: "ミラノリピール", option: "顔 1回", price: "¥25,000" },
      { category: "", option: "顔 3回", price: "¥68,000" },
      { category: "", option: "体", price: "¥35,000" },
    ],
  },
  {
    label: "その他",
    rows: [
      { category: "ヒアルロニダーゼ", option: "自院", price: "¥25,000" },
      { category: "", option: "他院", price: "¥45,000" },
      { category: "ヒレネックス（ヒト由来）", option: "自院", price: "¥40,000" },
      { category: "", option: "他院", price: "¥60,000" },
      { category: "オビソート", option: "自院", price: "¥15,000" },
      { category: "", option: "他院", price: "¥55,000" },
      { category: "ケナコルト", option: "自院", price: "¥11,000" },
      { category: "", option: "他院", price: "¥33,000" },
      { category: "サブシジョン", option: "2×2cm", price: "¥33,000" },
      { category: "", option: "5×5cm", price: "¥99,000" },
      { category: "", option: "5×5cm 2ヶ所", price: "¥165,000" },
      { category: "", option: "PRP注入追加", price: "¥99,000" },
    ],
  },
  {
    label: "パック",
    rows: [
      { category: "SRSパック", price: "¥2,200" },
      { category: "シカパック", price: "¥3,300" },
    ],
  },
];

const GEKA_TABS: SubTab[] = [
  {
    label: "目",
    rows: [
      { category: "二重埋没", price: "¥140,000" },
      { category: "二重抜糸", option: "自院（1本）", price: "¥22,000" },
      { category: "", option: "他院（1本）", price: "¥55,000" },
      { category: "二重全切開", price: "¥380,000" },
      { category: "", option: "眼窩脂肪除去", price: "¥66,000" },
      { category: "眼瞼下垂", option: "埋没", price: "¥280,000" },
      { category: "", option: "切開", price: "¥600,000" },
      { category: "眉下切開", price: "¥380,000" },
      { category: "", option: "吊り上げ固定", price: "¥33,000" },
      { category: "", option: "ROOF切除", price: "¥66,000" },
      { category: "目頭切開/目頭上切開", price: "¥280,000" },
      { category: "脱脂", price: "¥280,000" },
      { category: "上眼瞼除皺", price: "¥330,000" },
      { category: "下眼瞼除皺", price: "¥380,000" },
      { category: "下眼瞼除皺＋脱脂", price: "¥450,000" },
      { category: "脂肪再配置", price: "¥450,000" },
      { category: "表ハムラ", price: "¥550,000" },
      { category: "", option: "吊り上げ固定", price: "¥88,000" },
      { category: "裏ハムラ", price: "¥550,000" },
      { category: "目尻切開", price: "¥280,000" },
      { category: "グラマラス", option: "埋没", price: "¥280,000" },
      { category: "", option: "切開", price: "¥380,000" },
      { category: "蒙古襞形成", price: "¥380,000" },
    ],
  },
  {
    label: "鼻",
    rows: [
      { category: "プロテーゼ", price: "¥250,000" },
      { category: "鼻尖形成", price: "¥330,000" },
      { category: "耳介軟骨移植", price: "¥250,000" },
      { category: "ストラット法オプション", price: "¥100,000" },
      { category: "鼻中隔軟骨移植", price: "¥300,000" },
      { category: "肋軟骨移植", price: "¥500,000" },
      { category: "鼻中隔延長", price: "¥500,000" },
      { category: "鼻翼縮小", option: "内または外", price: "¥280,000" },
      { category: "", option: "内＋外", price: "¥380,000" },
      { category: "鼻孔縁下降", price: "¥350,000" },
      { category: "鼻翼挙上", price: "¥380,000" },
      { category: "鼻孔縁挙上", price: "¥350,000" },
      { category: "鼻骨骨切り", price: "¥500,000" },
      { category: "ハンプ切除", price: "¥440,000" },
      { category: "鼻翼基部形成（貴族）", price: "¥440,000" },
      { category: "鼻柱基部形成（猫）", price: "¥440,000" },
      { category: "側頭筋膜移植", price: "¥250,000" },
      { category: "プロテーゼ抜去", option: "自院", price: "¥110,000" },
      { category: "", option: "他院", price: "¥220,000" },
    ],
  },
  {
    label: "口",
    rows: [
      { category: "口角挙上", price: "¥450,000" },
      { category: "M字リップ", price: "¥380,000" },
      { category: "", option: "筋弁作成", price: "¥110,000" },
      { category: "ピーナッツリップ", price: "¥320,000" },
      { category: "人中短縮", price: "¥380,000" },
      { category: "外側人中短縮", price: "¥380,000" },
      { category: "", option: "筋肉処理", price: "¥33,000" },
      { category: "口唇縮小", option: "上または下", price: "¥280,000" },
      { category: "", option: "上＋下", price: "¥480,000" },
      { category: "口唇拡大", option: "上または下", price: "¥450,000" },
      { category: "ガミースマイル手術", price: "¥380,000" },
    ],
  },
  {
    label: "糸",
    rows: [
      { category: "糸リフト", option: "メンテナンス（4〜8本）", price: "¥200,000" },
      { category: "", option: "スタンダード（6〜12本）", price: "¥350,000" },
      { category: "", option: "プレミアム（10〜16本）", price: "¥500,000" },
      { category: "ショートスレッド", option: "40本", price: "¥110,000" },
      { category: "", option: "60本", price: "¥145,000" },
      { category: "", option: "80本", price: "¥170,000" },
      { category: "", option: "100本", price: "¥190,000" },
      { category: "アイスレッド", option: "20本", price: "¥110,000" },
      { category: "マルチフィル", option: "1本", price: "¥45,000" },
      { category: "エクステンダー", option: "1本", price: "¥55,000" },
      { category: "フラットリフト", option: "1本", price: "¥40,000" },
    ],
  },
  {
    label: "輪郭",
    rows: [
      { category: "脂肪吸引", option: "頬", price: "¥240,000" },
      { category: "", option: "あご下", price: "¥240,000" },
      { category: "", option: "頬＋あご下", price: "¥390,000" },
      { category: "バッカルファット除去", price: "¥280,000" },
      { category: "脂肪採取", price: "¥200,000" },
      { category: "ナノリッチ作成", price: "¥150,000" },
      { category: "脂肪注入", option: "額以外", price: "¥110,000" },
      { category: "", option: "額", price: "¥220,000" },
      { category: "", option: "全顔", price: "¥400,000" },
      { category: "MACSフェイスリフト", price: "¥990,000" },
      { category: "SMASフェイスリフト", price: "¥1,270,000" },
      { category: "ネックリフト", price: "¥660,000" },
      { category: "フェイス＋ネックリフト", price: "¥1,650,000" },
      { category: "ペリカンリフト", price: "¥770,000" },
      { category: "こめかみリフト", price: "¥550,000" },
      { category: "前額リフト", price: "¥770,000" },
      { category: "こめかみ＋前額リフト", price: "¥990,000" },
    ],
  },
  {
    label: "ほくろ・いぼ",
    rows: [
      { category: "ほくろ除去（CO2レーザー）", option: "1mm", price: "¥7,700" },
      { category: "いぼ除去（CO2レーザー）", option: "1個", price: "¥7,700" },
      { category: "", option: "全顔", price: "¥99,000" },
      { category: "", option: "首", price: "¥99,000" },
      { category: "ほくろ/いぼ除去（切除）", option: "〜5mm", price: "¥80,000" },
      { category: "", option: "〜10mm", price: "¥150,000" },
      { category: "", option: "1mm追加", price: "¥20,000" },
    ],
  },
  {
    label: "その他",
    rows: [
      { category: "血液検査代", option: "局所/静脈麻酔", price: "¥5,500" },
      { category: "", option: "全身麻酔", price: "¥11,000" },
      { category: "他院修正代", option: "小", price: "¥110,000" },
      { category: "", option: "中", price: "¥220,000" },
      { category: "", option: "大", price: "¥330,000" },
      { category: "KOライト（自院術後）", option: "1回", price: "¥6,600" },
    ],
  },
];

const TENTEKI_ROWS: PriceRow[] = [
  { category: "高濃度ビタミンC", option: "半量", price: "¥6,000" },
  { category: "", option: "全量", price: "¥12,000" },
  { category: "高濃度ビタミンC 採血", option: "", price: "¥7,700" },
  { category: "エクソソーム点滴", option: "1回", price: "¥66,000" },
  { category: "", option: "3回", price: "¥180,000" },
  { category: "", option: "倍量1回", price: "¥99,000" },
  { category: "", option: "倍量3回", price: "¥270,000" },
];

const NAIFUKU_ROWS: PriceRow[] = [
  { category: "肝斑セット（トラネキサム酸＋シナール＋ユベラ＋ハイチオール）", option: "1ヶ月分", price: "¥13,500" },
  { category: "基本セット（トラネキサム酸＋シナール）", option: "1ヶ月分", price: "¥7,700" },
  { category: "トラネキサム酸", option: "1ヶ月分", price: "¥5,000" },
  { category: "シナール（ビタミンC）", option: "1ヶ月分", price: "¥3,500" },
  { category: "ユベラ（ビタミンE）", option: "1ヶ月分", price: "¥3,500" },
  { category: "ハイチオール", option: "1ヶ月分", price: "¥3,500" },
  { category: "NB-X（総合ビタミンB）", option: "120錠", price: "¥6,696" },
  { category: "ビタミンC(3000)＋D（顆粒）", option: "30包", price: "¥5,832" },
  { category: "ビタミンC(2000)＋D（カプセル）", option: "30錠", price: "¥4,536" },
  { category: "亜鉛/亜鉛-X", option: "90錠", price: "¥5,940" },
  { category: "セルアクチン", option: "60錠", price: "¥36,000" },
  { category: "フィナステリド", option: "30錠", price: "¥7,500" },
  { category: "デュタステリド", option: "30錠", price: "¥7,500" },
  { category: "ミノキシジル", option: "100錠", price: "¥6,000" },
  { category: "タダラフィル", option: "1錠", price: "¥660" },
  { category: "リザベン", option: "1ヶ月分", price: "¥6,600" },
  { category: "イソトレチノイン", option: "1錠", price: "¥720" },
  { category: "アルダクトン", option: "1錠", price: "¥120" },
  { category: "柴苓湯", option: "1週間分", price: "¥6,600" },
  { category: "ルミガン", option: "1本", price: "¥5,500" },
];

const KESHOUHIN_TABS: SubTab[] = [
  {
    label: "レカルカ",
    rows: [
      { category: "ヒアルBXCボリューマーリップ", price: "¥4,180" },
      { category: "ハニームースクレンジング", price: "¥3,300" },
      { category: "ブライトリーモイストシャインバブル", price: "¥3,850" },
      { category: "FVC5バブルパック", price: "¥13,200" },
      { category: "CFセラムアドバンス（01）", price: "¥13,200" },
      { category: "シムセラムEX（02）", price: "¥15,400" },
      { category: "EXクリーム（03）", price: "¥16,500" },
      { category: "ブライトリーモイストシャインミスト", price: "¥7,920" },
      { category: "ファビラスA-DR", price: "¥14,300" },
      { category: "DREXエッセンス", price: "¥16,500" },
      { category: "モイストロボシャインマスクBXC", price: "¥8,800" },
      { category: "スキンスムーサー", price: "¥8,250" },
      { category: "イルミネイトパウダー", price: "¥6,600" },
      { category: "DREXモイストリペアミスト", price: "¥9,020" },
    ],
  },
  {
    label: "リビジョン",
    rows: [
      { category: "C＋ コレクティングコンプレックス30%", price: "¥21,780" },
      { category: "DEJフェイスクリーム", price: "¥20,900" },
      { category: "DEJ ナイトフェイスクリーム", price: "¥21,780" },
      { category: "DEJデイリーブースティングセラム", price: "¥29,700" },
    ],
  },
  {
    label: "ガウディスキン",
    rows: [
      { category: "インナーモイストTAローション", price: "¥6,820" },
      { category: "HQクリア", price: "¥9,900" },
      { category: "デュアルレチノプラス", price: "¥8,800" },
      { category: "エクラリバイブ", price: "¥19,800" },
    ],
  },
  {
    label: "ゼオスキン",
    rows: [
      { category: "バランサートナー", price: "¥7,700" },
      { category: "デイリーPD", price: "¥24,200" },
      { category: "ミラミン", price: "¥14,300" },
      { category: "ミラミックス", price: "¥14,300" },
      { category: "シーセラム", price: "¥16,280" },
      { category: "ロザトロール", price: "¥16,500" },
      { category: "スキンブライセラム0.25", price: "¥14,300" },
      { category: "スキンブライセラム0.5", price: "¥16,060" },
      { category: "Wテクスチャーリペア", price: "¥24,640" },
      { category: "イルミネーションAOXセラム", price: "¥21,780" },
    ],
  },
  {
    label: "ピュレアジー",
    rows: [
      { category: "フェイシャルクレンジングフォーム", price: "¥4,950" },
      { category: "カーミングフェイシャルミスト", price: "¥6,930" },
      { category: "カーミングトナー", price: "¥7,150" },
      { category: "ファーミングマスク", option: "1箱（5枚）", price: "¥7,150" },
    ],
  },
  {
    label: "シスペラ",
    rows: [
      { category: "シスペラ", price: "¥35,200" },
    ],
  },
  {
    label: "reveiller",
    rows: [
      { category: "The Cocktail", price: "¥8,800" },
      { category: "The Eye", price: "¥19,800" },
    ],
  },
  {
    label: "Lov me Touch",
    rows: [
      { category: "グラナクティブ2%", price: "¥4,620" },
      { category: "グラナクティブ7%", price: "¥6,820" },
      { category: "ホワイトシャインローション", price: "¥5,720" },
      { category: "スキンバリアナノミルク", price: "¥3,080" },
      { category: "シルキーUVミルク", price: "¥2,980" },
    ],
  },
  {
    label: "サンソリット",
    rows: [
      { category: "ユーブロックベースクリーム", price: "¥3,960" },
      { category: "ユーブロック（内服）30粒", price: "¥7,020" },
    ],
  },
  {
    label: "プラスリストア",
    rows: [
      { category: "クレンジングソープ泡ピールケア", price: "¥4,070" },
      { category: "UVローション〈SPF50 PA＋〉", price: "¥3,300" },
    ],
  },
];

const SONOTA_TABS: SubTab[] = [
  {
    label: "診察料",
    rows: [
      { category: "皮膚科初診料", price: "¥5,500" },
      { category: "皮膚科再診料", price: "¥1,100" },
      { category: "外科初診料", price: "¥5,500" },
      { category: "外科再診料", price: "¥5,500" },
      { category: "最終来院より6ヶ月以降の再診料", price: "¥5,500" },
    ],
  },
  {
    label: "麻酔",
    rows: [
      { category: "笑気麻酔", option: "30分", price: "¥5,500" },
      { category: "ブロック麻酔", price: "¥3,300" },
      { category: "局所麻酔", price: "¥2,200" },
      { category: "静脈麻酔", price: "¥55,000" },
      { category: "全身麻酔", price: "¥165,000" },
      { category: "麻酔テープ", price: "¥2,200" },
      { category: "麻酔クリーム", price: "¥2,200" },
    ],
  },
  {
    label: "書類",
    rows: [
      { category: "診断書作成", price: "¥11,000" },
      { category: "紹介状作成", price: "¥11,000" },
      { category: "Aura画像提供料", price: "¥5,500" },
      { category: "Aura再撮影料", price: "¥3,300" },
      { category: "NeoVoir 画像提供料", price: "¥5,500" },
      { category: "NeoVoir 再撮影料", price: "¥3,300" },
    ],
  },
];

// ============================================================
// SEARCH DATA（全データをフラット化して PriceNav に渡す）
// ============================================================
function flattenTabs(section: string, tabs: SubTab[]): SearchRow[] {
  const rows: SearchRow[] = [];
  for (const tab of tabs) {
    let lastCategory = "";
    for (const row of tab.rows) {
      const cat = row.category || lastCategory;
      if (row.category) lastCategory = row.category;
      rows.push({ section, subTab: tab.label, category: cat, option: row.option, price: row.price });
    }
  }
  return rows;
}

function flattenRows(section: string, sourceRows: PriceRow[]): SearchRow[] {
  let lastCategory = "";
  return sourceRows.map((row) => {
    const cat = row.category || lastCategory;
    if (row.category) lastCategory = row.category;
    return { section, category: cat, option: row.option, price: row.price };
  });
}

const ALL_ROWS: SearchRow[] = [
  ...flattenTabs("皮膚科", HIFUKA_TABS),
  ...flattenTabs("外科", GEKA_TABS),
  ...flattenRows("点滴", TENTEKI_ROWS),
  ...flattenRows("内服薬", NAIFUKU_ROWS),
  ...flattenTabs("化粧品", KESHOUHIN_TABS),
  ...flattenTabs("その他", SONOTA_TABS),
];

// ============================================================
// SIMPLE TABLE COMPONENT（サーバーサイドレンダリング可）
// ============================================================
function SimpleTable({ rows }: { rows: PriceRow[] }) {
  const hasOption = rows.some((r) => r.option);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[420px] border-collapse">
        <thead>
          <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-64">
              カテゴリー
            </th>
            {hasOption && (
              <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-40">
                オプション
              </th>
            )}
            <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-32">
              価格（税込）
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-[var(--color-brand-brown)]/10 ${
                i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
              }`}
            >
              <td className="py-3 px-4 text-[var(--color-text-primary)] leading-relaxed">
                {row.category}
              </td>
              {hasOption && (
                <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs">
                  {row.option ?? ""}
                </td>
              )}
              <td className="py-3 px-4 text-right font-medium text-[var(--color-brand-dark)] tabular-nums">
                {row.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function PricePage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        {/* ゴールドの光彩（淡く） */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">料金一覧</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            PRICE LIST
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            料金一覧
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            表示価格はすべて税込総額です
          </p>
        </div>
      </section>

      {/* ===== スティッキーカテゴリナビ + 検索 ===== */}
      <Suspense fallback={null}>
        <PriceNav allRows={ALL_ROWS} />
      </Suspense>

      {/* ===== 皮膚科 ===== */}
      <section
        id="hifuka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="01" en="Dermatology" ja="皮膚科" />
          <div className="mt-10">
            <PriceSubTabs tabs={HIFUKA_TABS} />
          </div>
        </div>
      </section>

      {/* ===== 外科 ===== */}
      <section
        id="geka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="02" en="Surgery" ja="外科" />
          <div className="mt-10">
            <PriceSubTabs tabs={GEKA_TABS} />
          </div>
        </div>
      </section>

      {/* ===== 点滴 ===== */}
      <section
        id="tenteki"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="03" en="IV Drip" ja="点滴" />
          <div className="mt-10">
            <SimpleTable rows={TENTEKI_ROWS} />
          </div>
        </div>
      </section>

      {/* ===== 内服薬 ===== */}
      <section
        id="naifuku"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="04" en="Oral Medication" ja="内服薬" />
          <div className="mt-10">
            <SimpleTable rows={NAIFUKU_ROWS} />
          </div>
        </div>
      </section>

      {/* ===== 化粧品 ===== */}
      <section
        id="keshouhin"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="05" en="Cosmetics" ja="化粧品" />
          <div className="mt-10">
            <PriceSubTabs tabs={KESHOUHIN_TABS} />
          </div>
        </div>
      </section>

      {/* ===== その他 ===== */}
      <section
        id="sonota"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="06" en="Others" ja="その他" />
          <div className="mt-10">
            <PriceSubTabs tabs={SONOTA_TABS} />
          </div>
        </div>
      </section>

      {/* ===== 注意事項 ===== */}
      <section className="py-12 md:py-16 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">
            NOTES
          </p>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              料金表の価格はすべて税込総額での表示となっております。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              当院の施術はすべて自由診療です。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              診察の結果、施術の適応がない場合も診察料を頂戴いたします。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              お支払いは現金・各種クレジットカード・医療用ローンにてお承りしております。詳しくはカウンセリング時にご確認ください。
            </li>
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">
            CONSULTATION
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed">
            料金・施術内容・ダウンタイムなど、<br className="md:hidden" />
            ご不明な点はカウンセリングにてご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <a
              href="https://mpureju.com/reservation"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              Web予約
            </a>
            <a
              href="https://lin.ee/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
            >
              LINE予約
            </a>
          </div>
          <Link
            href="/contact"
            className="text-xs tracking-wider text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-brand-gold)] transition-colors"
          >
            メールでのお問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
