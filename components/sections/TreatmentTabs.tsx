"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = [
  {
    id: "mouth",
    label: "口元",
    pillarHref: "/mouth",
    treatments: [
      { name: "口角挙上",        desc: "下がった口角を引き上げる",          href: "/mouth/lip-corner-lift" },
      { name: "M字リップ",       desc: "M字型の立体的な唇に",              href: "/mouth/m-lip" },
      { name: "人中短縮",        desc: "鼻の下をすっきり短く",              href: "/mouth/philtrum-shortening" },
      { name: "口唇縮小",        desc: "厚ぼったい唇を薄く整える",          href: "/mouth/lip-reduction" },
      { name: "ガミースマイル",  desc: "笑ったときの歯茎の見え過ぎを改善",  href: "/mouth/gummy-smile" },
      { name: "口唇拡大",        desc: "唇を自然に厚く見せる",              href: "/treatment/lip-enlargement" },
      { name: "外側人中短縮",    desc: "上唇外側を引き上げ顔の余白を整える", href: "/treatment/lateral-philtrum" },
      { name: "ピーナッツリップ", desc: "下唇に立体的なくびれを出す",        href: "/treatment/peanut-lip" },
    ],
  },
  {
    id: "eye",
    label: "目元",
    pillarHref: "/eye",
    treatments: [
      { name: "二重埋没",     desc: "糸で自然な二重を形成",            href: "/eye/double-eyelid-suture" },
      { name: "二重全切開",   desc: "半永久的な二重を切開で形成",       href: "/eye/double-eyelid-incision" },
      { name: "眼瞼下垂",     desc: "まぶたの開きを改善し目力アップ",   href: "/eye/ptosis" },
      { name: "眉下切開",     desc: "まぶたのたるみを自然に除去",       href: "/eye/brow-lift" },
      { name: "目頭切開",     desc: "目の横幅を広げより大きな目元に",   href: "/eye/epicanthoplasty" },
      { name: "脱脂",         desc: "下まぶたのクマ・たるみを改善",     href: "/eye/under-eye-fat-removal" },
      { name: "ハムラ法",     desc: "クマ・段差を脂肪再配置で解消",     href: "/eye/hamra" },
      { name: "目尻切開",     desc: "切れ長で大きな目元に",             href: "/treatment/eye-corner" },
      { name: "グラマラス",   desc: "垂れ目で色気のある目元に",         href: "/treatment/glamorous" },
      { name: "蒙古襞形成",   desc: "見えすぎた涙丘をさりげなく隠す",   href: "/treatment/epicanthal-fold" },
    ],
  },
  {
    id: "nose",
    label: "鼻",
    pillarHref: "/nose",
    treatments: [
      { name: "プロテーゼ",           desc: "シリコンで鼻筋を高く通す",      href: "/nose/implant" },
      { name: "鼻尖形成",             desc: "丸い鼻先を細く整える",          href: "/nose/tip-plasty" },
      { name: "鼻翼縮小",             desc: "張った小鼻を小さくする",        href: "/nose/alar-reduction" },
      { name: "鼻中隔延長",           desc: "鼻先を下方向に伸ばす",          href: "/nose/septum-extension" },
      { name: "耳介軟骨移植",         desc: "自家軟骨で自然に形成",          href: "/treatment/ear-cartilage" },
      { name: "鼻骨骨切り",           desc: "鼻筋を細くまっすぐに整える",    href: "/treatment/nasal-osteotomy" },
      { name: "ハンプ切除",           desc: "鷲鼻の出っ張り部分を除去",      href: "/treatment/hump" },
      { name: "鼻孔縁下降",           desc: "鼻の穴のアーチを目立たなく",    href: "/treatment/nostril-margin" },
      { name: "鼻翼基部形成（貴族）", desc: "小鼻の付け根に立体感を出す",    href: "/treatment/alar-base" },
    ],
  },
  {
    id: "lift",
    label: "リフトアップ",
    pillarHref: "/lift",
    treatments: [
      { name: "糸リフト",              desc: "特殊な糸でたるみを引き上げる",      href: "/lift/thread-lift" },
      { name: "ソフウェーブ",          desc: "超音波でコラーゲン生成・引き締め",  href: "/lift/sofwave" },
      { name: "HIFU（ウルトラセルZi）", desc: "筋膜層から切らずに引き上げる",     href: "/lift/hifu" },
      { name: "MACSフェイスリフト",    desc: "フェイスラインを自然に引き締める",  href: "/treatment/macs-facelift" },
      { name: "SMASフェイスリフト",    desc: "筋膜ごと引き上げ最大限の効果",     href: "/treatment/smas-facelift" },
      { name: "ネックリフト",          desc: "首・あごのたるみを改善",           href: "/treatment/neck-lift" },
      { name: "脂肪吸引",              desc: "顔の脂肪を吸引してすっきり小顔に", href: "/treatment/liposuction" },
      { name: "バッカルファット除去",  desc: "ほほの深部脂肪を取り除く",         href: "/treatment/buccal-fat" },
      { name: "脂肪注入",              desc: "自家脂肪でくぼみ・ハリを補う",     href: "/treatment/fat-injection" },
    ],
  },
  {
    id: "skin",
    label: "美容皮膚科",
    pillarHref: "/skin",
    treatments: [
      { name: "ポテンツァ",              desc: "毛穴・ニキビ跡・肌質を改善",         href: "/skin/potenza" },
      { name: "ボトックス",              desc: "しわ・エラ張りを自然に緩和",         href: "/skin/botox" },
      { name: "ヒアルロン酸",            desc: "ほうれい線・唇・鼻筋を整える",       href: "/skin/hyaluronic-acid" },
      { name: "レーザー",                desc: "シミ・毛穴・肌の色ムラを改善",       href: "/skin/laser" },
      { name: "IPL / フォトフェイシャル", desc: "光でシミ・赤ら顔を総合的に改善",    href: "/treatment/ipl" },
      { name: "ピーリング",              desc: "肌のターンオーバーを促し質感アップ", href: "/treatment/peeling" },
      { name: "スキンブースター",        desc: "美容成分を肌の奥深くに届ける",       href: "/treatment/skin-booster" },
      { name: "脂肪溶解注射",            desc: "脂肪細胞を分解・排出してすっきり",   href: "/treatment/fat-dissolving" },
      { name: "サーマジェン（RF）",      desc: "高周波で引き締め・ハリを改善",       href: "/treatment/thermagen" },
    ],
  },
];

export function TreatmentTabs() {
  const [activeId, setActiveId] = useState<string>("mouth");
  const current = TABS.find((t) => t.id === activeId)!;

  return (
    <div>
      {/* タブ */}
      <div className="flex flex-wrap border-b border-[var(--color-brand-brown)]/20 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={`relative px-4 md:px-6 py-3 text-sm tracking-wider transition-colors ${
              activeId === tab.id
                ? "text-[var(--color-brand-gold)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-brand-dark)]"
            }`}
          >
            {tab.label}
            {activeId === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-gold)]" />
            )}
          </button>
        ))}
      </div>

      {/* 施術リスト */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 mb-10">
        {current.treatments.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="group flex items-start gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-[var(--color-brand-gold)] shrink-0 mt-0.5">—</span>
            <span>
              <span className="block text-sm text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                {item.name}
              </span>
              <span className="block text-xs text-[var(--color-text-secondary)] font-light mt-0.5 leading-relaxed">
                {item.desc}
              </span>
            </span>
          </Link>
        ))}
      </div>

      {/* ピラーページへ */}
      <div className="flex justify-end">
        <Link
          href={current.pillarHref}
          className="text-xs tracking-widest text-[var(--color-text-secondary)] border-b border-current pb-0.5 hover:text-[var(--color-brand-gold)] transition-colors"
        >
          {current.label}の施術をすべて見る →
        </Link>
      </div>
    </div>
  );
}
