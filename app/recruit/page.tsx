import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollFadeIn } from "@/components/ui/ScrollFadeIn";
import { ValuesCarousel } from "@/components/sections/ValuesCarousel";
import { PositionAccordion } from "@/components/sections/PositionAccordion";
import { IdealCandidateCarousel } from "./IdealCandidateCarousel";
import { getStaffBlogList } from "@/lib/microcms/client";

export const metadata: Metadata = {
  title: "採用情報",
  description:
    "Maison PUREJU（銀座）の採用情報。看護師・受付カウンセラー・広報など、美容クリニックで一緒に働く仲間を募集しています。",
};

/* ── 募集職種 ── */
const POSITIONS = [
  {
    id: "nurse",
    title: "看護師",
    tagline: "銀座で働く美容ナース募集｜未経験からプロの美容医療へ",
    employmentType: "正社員",
    tasks: [
      "採血 / 点滴",
      "医療機器による処置",
      "医師のサポート / 手術介助等看護業務全般",
      "その他クリニック業務全般",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "35万円〜 ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
  },
  {
    id: "receptionist",
    title: "受付カウンセラー",
    tagline: "銀座の美容クリニック受付カウンセラー募集｜未経験歓迎・社割あり",
    employmentType: "正社員",
    tasks: [
      "受付対応",
      "カウンセリング業務",
      "契約業務 / 会計",
      "予約受付 / 電話対応",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "26万円〜 ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
  },
  {
    id: "pr-creator",
    title: "広報 / SNSクリエイター",
    tagline: "SNS運用・動画編集クリエイター募集｜銀座から美容医療の魅力を発信",
    employmentType: "正社員",
    tasks: [
      "クリニックの広報業務全般",
      "SNS投稿撮影 / 編集",
    ],
    hours: "9:45〜18:45（休憩1h、固定残業代：なし）",
    salary: "給与はお問い合わせください ※前職給与も含め総合判断します（試用期間6ヶ月、条件別途）",
    requirements: [
      "WEBデザインソフトを使用可能",
      "美容クリニック1年以上経験",
      "SNSクリエイター：動画編集技術",
    ],
    preferred: [
      "スチール・ムービー撮影の技術",
      "動画編集経験（Premiere、Final Cutなど）",
      "画像編集経験（Photoshop、Lightroom、Canvaなど）",
      "SNS運用経験（YouTube、Instagram、TikTok）",
      "ライティング能力",
    ],
  },
];

/* ── 働く魅力 ── */
const VALUES = [
  {
    title: "患者様の人生が変わる瞬間に立ち会える",
    description:
      "美容医療は見た目だけでなく、患者様の自信や生き方まで変えていく仕事です。「来てよかった」の一言が、日々のやりがいになります。",
  },
  {
    title: "専門医のそばで日々成長を実感できる",
    description:
      "形成外科専門医である院長のすぐ近くで働くからこそ、技術や知識が自然と身についていく。自分自身の成長を毎日感じられる環境です。",
  },
  {
    title: "働きながら、自分自身もキレイになれる",
    description:
      "毎月5万円の美容施術手当に加え、施術や化粧品の社員割引も。自分自身が美容医療を体験できるから、患者様へのご案内にも説得力が生まれます。",
  },
];

/* ── 求める人材像 ── */
const IDEAL_CANDIDATE = [
  {
    number: "01",
    en: "Harmony",
    ja: "調和",
    text: "思いやりを持って、まわりと調和しながら働ける方。チーム医療の現場では、医師・看護師・カウンセラーが密に連携します。お互いの専門性を尊重し、気持ちよく協力し合える姿勢を大切にしています。",
    icon: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 中央の人 -->
      <circle cx="60" cy="34" r="8" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M48 60C48 50 53 46 60 46C67 46 72 50 72 60" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 左の人 -->
      <circle cx="28" cy="42" r="6" stroke="#c9a96e" stroke-width="1.2" opacity="0.6"/>
      <path d="M19 62C19 54 22.5 51 28 51C33.5 51 37 54 37 62" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      <!-- 右の人 -->
      <circle cx="92" cy="42" r="6" stroke="#c9a96e" stroke-width="1.2" opacity="0.6"/>
      <path d="M83 62C83 54 86.5 51 92 51C97.5 51 101 54 101 62" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      <!-- つながりの円弧 -->
      <path d="M38 44C44 36 52 32 60 32" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 3" opacity="0.35"/>
      <path d="M82 44C76 36 68 32 60 32" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" stroke-dasharray="2 3" opacity="0.35"/>
      <!-- ハートのシルエット（調和の象徴） -->
      <path d="M52 76C52 72 54 70 58 70C60 70 60 72 60 72C60 72 60 70 62 70C66 70 68 72 68 76C68 82 60 88 60 88C60 88 52 82 52 76Z" stroke="#c9a96e" stroke-width="1.2" opacity="0.4"/>
      <!-- 手をつなぐ線 -->
      <path d="M37 58L48 56" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <path d="M72 56L83 58" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <!-- 装飾ドット -->
      <circle cx="46" cy="28" r="1.5" fill="#c9a96e" opacity="0.15"/>
      <circle cx="74" cy="28" r="1.5" fill="#c9a96e" opacity="0.15"/>
      <circle cx="60" cy="20" r="1" fill="#c9a96e" opacity="0.2"/>
    </svg>`,
  },
  {
    number: "02",
    en: "Empathy",
    ja: "寄り添い",
    text: "お客様の心に寄り添い、真摯に向き合える方。美容医療はお客様にとって大きな決断です。不安や悩みに丁寧に耳を傾け、一人ひとりに合わせた最適なご提案ができるホスピタリティを重視しています。",
    icon: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- スタッフ（左） -->
      <circle cx="40" cy="32" r="7" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M29 56C29 47 33 44 40 44C47 44 51 47 51 56" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 髪のアクセント -->
      <path d="M34 28C36 25 40 24 43 26" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <!-- お客様（右・椅子に座っている） -->
      <circle cx="78" cy="36" r="7" stroke="#c9a96e" stroke-width="1.5" opacity="0.7"/>
      <path d="M68 58C68 50 72 47 78 47C84 47 88 50 88 58" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
      <!-- 椅子 -->
      <path d="M66 58L66 68L90 68L90 58" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <line x1="68" y1="68" x2="68" y2="74" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <line x1="88" y1="68" x2="88" y2="74" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <!-- 寄り添うジェスチャー（手を添える） -->
      <path d="M50 50C54 48 58 50 60 54" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <!-- 吹き出し（傾聴） -->
      <ellipse cx="56" cy="24" rx="10" ry="7" stroke="#c9a96e" stroke-width="1" opacity="0.3"/>
      <path d="M52 30L48 34" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <!-- 吹き出し中のハート -->
      <path d="M53 22C53 20.5 54 20 55 20C55.8 20 56 20.8 56 20.8C56 20.8 56.2 20 57 20C58 20 59 20.5 59 22C59 24 56 26 56 26C56 26 53 24 53 22Z" fill="#c9a96e" opacity="0.25"/>
      <!-- 温かさの波紋 -->
      <circle cx="60" cy="52" r="16" stroke="#c9a96e" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.15"/>
      <circle cx="60" cy="52" r="24" stroke="#c9a96e" stroke-width="0.6" stroke-dasharray="3 5" opacity="0.1"/>
      <!-- 装飾 -->
      <circle cx="30" cy="70" r="1.5" fill="#c9a96e" opacity="0.12"/>
      <circle cx="96" cy="26" r="1" fill="#c9a96e" opacity="0.15"/>
    </svg>`,
  },
  {
    number: "03",
    en: "Growth",
    ja: "成長",
    text: "新しい知識や技術を前向きに学び、成長を楽しめる方。美容医療は日々進化しています。最新のレーザー治療から高度な外科手術まで、幅広い施術に携わるなかで常に学びを深め、自身のキャリアを磨いていける環境です。",
    icon: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 人（本を持つ / 学ぶ姿勢） -->
      <circle cx="44" cy="30" r="7" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M33 54C33 45 37 42 44 42C51 42 55 45 55 54" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 開いた本 -->
      <path d="M36 60L44 56L52 60" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
      <line x1="44" y1="56" x2="44" y2="66" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <line x1="38" y1="62" x2="42" y2="60" stroke="#c9a96e" stroke-width="0.8" opacity="0.3"/>
      <line x1="46" y1="60" x2="50" y2="62" stroke="#c9a96e" stroke-width="0.8" opacity="0.3"/>
      <!-- 上昇する階段 -->
      <path d="M62 78L62 68L72 68L72 58L82 58L82 48L92 48L92 38" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
      <!-- 階段の上の星 -->
      <path d="M92 30L94 35L99 35L95 38.5L96.5 44L92 41L87.5 44L89 38.5L85 35L90 35Z" fill="#c9a96e" opacity="0.2"/>
      <!-- 上昇矢印 -->
      <path d="M92 38L92 28" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M88 32L92 28L96 32" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 芽吹き（成長の象徴） -->
      <path d="M20 86C20 86 24 78 20 70" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <path d="M20 76C16 72 18 66 24 68" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.25"/>
      <path d="M20 70C24 66 28 68 26 74" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.25"/>
      <!-- 知識の光の粒 -->
      <circle cx="68" cy="44" r="1.5" fill="#c9a96e" opacity="0.15"/>
      <circle cx="76" cy="36" r="1" fill="#c9a96e" opacity="0.2"/>
      <circle cx="84" cy="28" r="1.5" fill="#c9a96e" opacity="0.15"/>
      <!-- 装飾 -->
      <circle cx="104" cy="56" r="1" fill="#c9a96e" opacity="0.12"/>
      <line x1="14" y1="82" x2="26" y2="82" stroke="#c9a96e" stroke-width="0.8" opacity="0.15"/>
    </svg>`,
  },
];

const CANDIDATE_MESSAGE = [
  "最先端の美容皮膚科レーザー治療から専門性の高い美容外科手術まで、幅広い施術を提供しています。常に学びと成長を実感できる、やりがいある職場です。",
  "皆様の能力と貢献は正当に評価され、昇給制度に反映しております。経験者は優遇いたしますので、これまでのご経験を活かし、さらなる高みを目指したい方は、ぜひお気軽にお問い合わせください。",
];

/* ── 共通福利厚生 ── */
const COMMON_BENEFITS = [
  "交通費支給",
  "社会保険完備",
  "社員割引（施術・化粧品）",
  "美容施術手当（月5万円）",
  "有給休暇",
  "年末年始休暇",
  "研修制度あり",
];

/* ── 選考フロー ── */
const SELECTION_STEPS = [
  {
    label: "エントリー",
    description: "応募フォームから必要事項を送信",
    icon: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- スマホ -->
      <rect x="30" y="12" width="36" height="60" rx="4" stroke="#c9a96e" stroke-width="1.5"/>
      <line x1="42" y1="16" x2="54" y2="16" stroke="#c9a96e" stroke-width="1" stroke-linecap="round"/>
      <circle cx="48" cy="66" r="2" fill="#c9a96e"/>
      <!-- フォーム行 -->
      <line x1="38" y1="30" x2="58" y2="30" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <line x1="38" y1="37" x2="54" y2="37" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <line x1="38" y1="44" x2="50" y2="44" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
      <!-- 送信矢印 -->
      <path d="M56 50L62 44L56 38" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.8"/>
      <!-- 人 -->
      <circle cx="20" cy="44" r="5" stroke="#c9a96e" stroke-width="1.2"/>
      <path d="M12 62C12 55 15.5 52 20 52C24.5 52 28 55 28 62" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
  },
  {
    label: "書類選考",
    description: "履歴書・職務経歴書を確認",
    icon: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 書類 後ろ -->
      <rect x="32" y="14" width="38" height="50" rx="2" stroke="#c9a96e" stroke-width="1" opacity="0.3"/>
      <!-- 書類 前 -->
      <rect x="26" y="20" width="38" height="50" rx="2" stroke="#c9a96e" stroke-width="1.5" fill="white"/>
      <line x1="34" y1="32" x2="56" y2="32" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <line x1="34" y1="39" x2="52" y2="39" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <line x1="34" y1="46" x2="48" y2="46" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <line x1="34" y1="53" x2="54" y2="53" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <!-- チェックマーク -->
      <circle cx="66" cy="58" r="12" fill="#c9a96e" opacity="0.12"/>
      <path d="M60 58L64 62L73 53" stroke="#c9a96e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- ペン -->
      <path d="M68 28L74 22" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M74 22L76 24L70 30L68 28Z" stroke="#c9a96e" stroke-width="1"/>
    </svg>`,
  },
  {
    label: "面接",
    description: "対面またはオンライン",
    icon: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 左の人 -->
      <circle cx="28" cy="32" r="7" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M16 56C16 47 21 43 28 43C35 43 40 47 40 56" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 右の人 -->
      <circle cx="68" cy="32" r="7" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M56 56C56 47 61 43 68 43C75 43 80 47 80 56" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 会話吹き出し -->
      <ellipse cx="38" cy="22" rx="8" ry="5" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <path d="M34 26L32 30" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <ellipse cx="58" cy="18" rx="8" ry="5" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <path d="M62 22L64 26" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <!-- テーブル -->
      <line x1="24" y1="62" x2="72" y2="62" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="36" y1="62" x2="36" y2="72" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <line x1="60" y1="62" x2="60" y2="72" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  },
  {
    label: "内定",
    description: "条件のご提示",
    icon: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 封筒 -->
      <rect x="20" y="30" width="56" height="38" rx="3" stroke="#c9a96e" stroke-width="1.5"/>
      <path d="M20 33L48 52L76 33" stroke="#c9a96e" stroke-width="1.5" stroke-linejoin="round"/>
      <!-- 書類が出ている -->
      <rect x="32" y="16" width="32" height="24" rx="2" stroke="#c9a96e" stroke-width="1" opacity="0.5" fill="white"/>
      <line x1="38" y1="24" x2="58" y2="24" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <line x1="38" y1="30" x2="52" y2="30" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <!-- 星 -->
      <path d="M70 16L72 21L77 21L73 24.5L74.5 30L70 27L65.5 30L67 24.5L63 21L68 21Z" fill="#c9a96e" opacity="0.25"/>
      <!-- キラキラ -->
      <line x1="22" y1="20" x2="22" y2="26" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <line x1="19" y1="23" x2="25" y2="23" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.3"/>
      <circle cx="82" cy="44" r="1.5" fill="#c9a96e" opacity="0.2"/>
      <circle cx="14" cy="50" r="1" fill="#c9a96e" opacity="0.2"/>
    </svg>`,
  },
  {
    label: "入社",
    description: "勤務開始",
    icon: `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 建物 -->
      <rect x="30" y="24" width="36" height="48" rx="2" stroke="#c9a96e" stroke-width="1.5"/>
      <!-- 窓 -->
      <rect x="36" y="32" width="8" height="6" rx="1" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <rect x="52" y="32" width="8" height="6" rx="1" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <rect x="36" y="44" width="8" height="6" rx="1" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <rect x="52" y="44" width="8" height="6" rx="1" stroke="#c9a96e" stroke-width="1" opacity="0.5"/>
      <!-- ドア -->
      <rect x="43" y="58" width="10" height="14" rx="1" stroke="#c9a96e" stroke-width="1.2"/>
      <circle cx="51" cy="66" r="1" fill="#c9a96e"/>
      <!-- 十字マーク（クリニック） -->
      <line x1="48" y1="16" x2="48" y2="22" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <line x1="45" y1="19" x2="51" y2="19" stroke="#c9a96e" stroke-width="1.5" stroke-linecap="round"/>
      <!-- 人が歩いてくる -->
      <circle cx="18" cy="50" r="5" stroke="#c9a96e" stroke-width="1.2"/>
      <path d="M14 66C14 60 15.5 58 18 58C20.5 58 22 60 22 66" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round"/>
      <!-- 足 -->
      <line x1="16" y1="66" x2="14" y2="70" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round"/>
      <line x1="20" y1="66" x2="24" y2="70" stroke="#c9a96e" stroke-width="1.2" stroke-linecap="round"/>
      <!-- 矢印 -->
      <path d="M26 58L30 58" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
      <path d="M28 56L30 58L28 60" stroke="#c9a96e" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
    </svg>`,
  },
];

export default async function RecruitPage() {
  const staffBlogData = await getStaffBlogList({ limit: 3 });
  const staffBlogs = staffBlogData.contents;
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">採用情報</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            RECRUIT
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-tight">
            採用情報
          </h1>
          <p className="text-sm md:text-base tracking-wide text-[var(--color-text-secondary)] leading-relaxed">
            ALL for YOU — あなたの&ldquo;本気&rdquo;が、誰かの人生を変える
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)] overflow-hidden">
        <div className="section-container">
          <SectionHeading en="Mission" ja="私たちの使命" number="01" className="mb-14" />

          <ScrollFadeIn>
            <div className="flex flex-col md:flex-row gap-0">
              <div
                className="relative w-full md:w-5/12 aspect-square shrink-0 overflow-hidden bg-[var(--color-brand-cream)]"
                style={{ clipPath: "polygon(0 0, calc(100% - 3.5rem) 0, 100% 3.5rem, 100% 100%, 0 100%)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[var(--color-text-secondary)]/25 text-xs tracking-[0.25em]">PHOTO</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center py-10 md:py-14 md:pl-12 lg:pl-16">
                <p
                  className="font-en text-8xl md:text-9xl leading-none text-[var(--color-brand-dark)] select-none mb-1"
                  style={{ opacity: 0.06 }}
                  aria-hidden="true"
                >
                  Mission
                </p>
                <div className="w-8 h-px bg-[var(--color-brand-gold)] mb-6" />

                <p className="font-serif text-lg md:text-xl leading-relaxed text-[var(--color-brand-dark)] mb-8">
                  患者様の心に寄り添い、
                  <br />
                  お悩みのその先に広がる
                  <br />
                  「なりたい自分」を共に叶える
                </p>

                <div className="mb-6">
                  <p className="text-xs tracking-widest text-[var(--color-brand-gold)] mb-2">院長</p>
                  <p className="font-serif text-xl text-[var(--color-brand-dark)]">廣瀬 雅史</p>
                  <p className="font-en text-sm tracking-wider text-[var(--color-text-secondary)] mt-1">Masashi Hirose</p>
                </div>

                <p className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light max-w-md">
                  あなたの人生を豊かにする美容医療。自信と輝きをもたらしてくれます。それが美容医療の本質的な価値です。今までの美容クリニックの枠にとらわれず、私達は皆様にその感動体験を届けます。
                </p>

                <p className="mt-6 text-xs text-[var(--color-text-secondary)]/50 leading-relaxed max-w-md">
                  &ldquo;Maison&rdquo;は家やオートクチュールの店という意味。皆さんが安心して美容医療を受けられる「家」になれるようにという想いを込めています。
                </p>
              </div>
            </div>
          </ScrollFadeIn>

        </div>
      </section>

      {/* ── 働く魅力 ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container mb-14">
          <SectionHeading en="Why Maison PUREJU?" ja="働く魅力" number="02" />
        </div>
        <ValuesCarousel items={VALUES} />
      </section>

      {/* ── スタッフブログ ── */}
      {staffBlogs.length > 0 && (
        <section className="py-16 md:py-24 bg-white">
          <div className="section-container">
            <SectionHeading en="Staff Blog" ja="スタッフブログ" number="03" className="mb-14" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {staffBlogs.map((post, i) => (
                <ScrollFadeIn key={post.id} delay={i * 0.1}>
                  <Link href={`/recruit/staff-blog/${post.slug}`} className="block bg-[var(--color-brand-cream)] overflow-hidden h-full group">
                    <div className="aspect-video relative overflow-hidden">
                      <Image
                        src={post.thumbnail.url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="px-5 py-4">
                      <p className="font-serif text-sm text-[var(--color-brand-dark)] leading-relaxed line-clamp-2 group-hover:text-[var(--color-brand-gold)] transition-colors">
                        {post.title}
                      </p>
                    </div>
                  </Link>
                </ScrollFadeIn>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/recruit/staff-blog"
                className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-gold)] hover:underline underline-offset-4 font-light tracking-wide"
              >
                スタッフブログをもっと見る →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── 求める人材像 ── */}
      <section className="py-16 md:py-24 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <SectionHeading en="Ideal Candidate" ja="求める人材像" number="04" className="mb-10" />

          <IdealCandidateCarousel items={IDEAL_CANDIDATE} />

          <ScrollFadeIn>
            <div className="max-w-3xl mx-auto space-y-4 mt-14">
              {CANDIDATE_MESSAGE.map((msg, i) => (
                <p key={i} className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
                  {msg}
                </p>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── 募集中の職種 ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="Open Positions" ja="募集中の職種" number="05" className="mb-14" />
          <div className="max-w-3xl">
            <PositionAccordion positions={POSITIONS} />
          </div>
        </div>
      </section>

      {/* ── 福利厚生 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container">
          <SectionHeading en="Benefits" ja="福利厚生" number="06" className="mb-14" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--color-brand-brown)]/10">
            {COMMON_BENEFITS.map((item, i) => (
              <ScrollFadeIn key={item} delay={i * 0.04}>
                <div className="flex items-center gap-3 bg-[var(--color-brand-white)] px-5 py-5">
                  <span className="text-[var(--color-brand-gold)]">—</span>
                  <span className="text-sm text-[var(--color-brand-dark)] tracking-wide font-light">{item}</span>
                </div>
              </ScrollFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── 選考フロー ── */}
      <section
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading en="Flow" ja="選考フロー" number="07" className="mb-14" />
          <ScrollFadeIn>
            {/* ── デスクトップ: タイムライン ── */}
            <div className="hidden md:block">
              {/* SVG イラスト */}
              <div className="grid grid-cols-5 gap-0 mb-2">
                {SELECTION_STEPS.map((s) => (
                  <div key={s.label} className="flex justify-center">
                    <div className="w-24 h-24" dangerouslySetInnerHTML={{ __html: s.icon }} />
                  </div>
                ))}
              </div>

              {/* タイムライン */}
              <div className="relative flex items-center px-[10%] mb-2">
                <span className="text-[0.625rem] text-[var(--color-brand-gold)] tracking-wider pr-3 shrink-0">選考開始</span>
                <div className="flex-1 relative h-[2px] bg-[var(--color-brand-gold)]/25">
                  {/* ドット */}
                  {SELECTION_STEPS.map((_, i) => (
                    <span
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-brand-gold)] border-2 border-white"
                      style={{ left: `${(i / (SELECTION_STEPS.length - 1)) * 100}%`, transform: "translate(-50%, -50%)" }}
                    />
                  ))}
                  {/* 矢印 */}
                  <svg className="absolute -right-1 top-1/2 -translate-y-1/2 text-[var(--color-brand-gold)]/40" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M1 1L6 6L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[0.625rem] text-[var(--color-brand-gold)] tracking-wider pl-4 shrink-0 font-medium">入社</span>
              </div>

              {/* ラベル + 説明 */}
              <div className="grid grid-cols-5 gap-0">
                {SELECTION_STEPS.map((s) => (
                  <div key={s.label} className="text-center px-2 pt-4 border-t border-transparent">
                    <p className="text-sm font-medium text-[var(--color-brand-dark)] mb-1.5">{s.label}</p>
                    <p className="text-[0.6875rem] text-[var(--color-text-secondary)] leading-relaxed">{s.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── モバイル: 縦タイムライン ── */}
            <div className="md:hidden space-y-0">
              {SELECTION_STEPS.map((s, i) => (
                <div key={s.label} className="flex gap-4">
                  {/* 縦線 + ドット */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[var(--color-brand-gold)] border-2 border-white z-10 mt-1" />
                    {i < SELECTION_STEPS.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--color-brand-gold)]/20" />
                    )}
                  </div>
                  {/* コンテンツ */}
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 shrink-0" dangerouslySetInnerHTML={{ __html: s.icon }} />
                      <p className="text-sm font-medium text-[var(--color-brand-dark)]">{s.label}</p>
                    </div>
                    <p className="text-[0.6875rem] text-[var(--color-text-secondary)] leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollFadeIn>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-28 bg-[var(--color-brand-cream)]">
        <div className="section-container text-center">
          <p
            className="font-en text-6xl md:text-7xl leading-none text-[var(--color-brand-gold)] select-none mb-4"
            style={{ opacity: 0.12 }}
            aria-hidden="true"
          >
            Entry
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-4 leading-relaxed tracking-wide">
            ご応募・ご質問はお気軽にどうぞ
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed font-light">
            美容医療に情熱を持ち、ともに成長していける仲間をお待ちしています。
          </p>
          <Link
            href="/recruit/entry"
            className="inline-flex items-center justify-center gap-4 min-w-[280px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity"
          >
            エントリーはこちら
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
