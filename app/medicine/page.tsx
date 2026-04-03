import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getMedicineList } from "@/lib/microcms/client";
import type { Medicine } from "@/types/microcms";
import { ConsultationCTA } from "@/components/sections/ConsultationCTA";

export const metadata: Metadata = {
  title: "内服薬・処方薬｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "美肌・シミ対策、AGA治療、ニキビ改善、ダウンタイム軽減など、医師が処方する内服薬・外用薬のご案内。",
};

const CATEGORY_EN: Record<string, string> = {
  "美肌・シミ対策": "SKIN BRIGHTENING",
  "頭皮・毛髪ケア": "HAIR CARE",
  "AGA治療": "AGA TREATMENT",
  "ニキビ・肌荒れ": "ACNE CARE",
  "ダウンタイム軽減": "RECOVERY",
  "まつ毛育成": "EYELASH GROWTH",
};

/* ── フォールバック（microCMS未投入時） ── */
const FALLBACK: Medicine[] = [
  { id: "1", name: "トラネキサム酸 / シナール / ユベラ / ハイチオール", slug: "tranexamic-set", catch_copy: "シミ・肝斑を抑え込み、抗酸化の力で弾むような白玉肌を内側から呼び覚ます美白内服セットです。", category: "美肌・シミ対策", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "2", name: "NB-X（総合ビタミンB）", slug: "nb-x", catch_copy: "疲れも肌荒れもまとめてリセット。ビタミンB群を総合的に補い、毎日をベストコンディションへ導きます。", category: "美肌・シミ対策", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "3", name: "ビタミンC＋D", slug: "vitamin-cd", catch_copy: "体にとって重要なビタミンCを高用量で補給。骨を丈夫にするビタミンDとの組み合わせで、さまざまな健康効果が期待できます。", category: "美肌・シミ対策", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "4", name: "亜鉛 / 亜鉛-X", slug: "zinc", catch_copy: "テカリを抑え、ツヤを育む。抜け毛を防ぎ、芯から強い健やかな美しさを支えるミネラルサプリメントです。", category: "頭皮・毛髪ケア", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "5", name: "セルアクチン", slug: "cellactin", catch_copy: "細胞から時計の針を巻き戻す。全身の若々しさを内側から更新するエイジングケアサプリメントです。", category: "頭皮・毛髪ケア", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "6", name: "フィナステリド / デュタステリド", slug: "finasteride", catch_copy: "内側から薄毛の進行を防ぎ、自信の髪を守る。男性型脱毛症（AGA）が原因の薄毛に改善効果が期待できます。", category: "AGA治療", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "7", name: "ミノキシジル", slug: "minoxidil", catch_copy: "毛母細胞を活性化し、強い髪を育て伸ばす。発毛した毛を太く長くさせる効果も期待できます。", category: "AGA治療", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "8", name: "リザベン", slug: "rizaben", catch_copy: "炎症を抑え、跡が残りにくい肌へ。線維芽細胞によるコラーゲンの過剰生成を抑えて瘢痕形成を防ぎます。", category: "ニキビ・肌荒れ", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "9", name: "イソトレチノイン", slug: "isotretinoin", catch_copy: "毛穴の詰まり抑制・皮脂分泌抑制・抗菌抗炎症作用で、繰り返すニキビを根本から改善します。", category: "ニキビ・肌荒れ", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "10", name: "アルダクトン", slug: "aldactone", catch_copy: "皮脂分泌を減らし、大人ニキビの改善に有効。肌の不安定期に終止符を打ちます。", category: "ニキビ・肌荒れ", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "11", name: "柴苓湯", slug: "saireito", catch_copy: "術後の腫れやむくみを内側から素早く取り去り、軽やかな回復を叶える漢方薬です。", category: "ダウンタイム軽減", description: "", usage: "", side_effects: "", contraindications: "" },
  { id: "12", name: "ルミガン", slug: "lumigan", catch_copy: "毛周期の成長期を伸ばすことで、まつ毛を太く長くする効果が期待できる外用薬です。", category: "まつ毛育成", description: "", usage: "", side_effects: "", contraindications: "" },
];

function normalizeCategory(category: string | string[]): string {
  return Array.isArray(category) ? category[0] ?? "" : category;
}

function groupByCategory(medicines: Medicine[]) {
  const map = new Map<string, Medicine[]>();
  for (const m of medicines) {
    const cat = normalizeCategory(m.category);
    const list = map.get(cat) ?? [];
    list.push(m);
    map.set(cat, list);
  }
  return Array.from(map.entries());
}

export default async function MedicinePage() {
  const { contents } = await getMedicineList();
  const medicines = contents.length > 0 ? contents : FALLBACK;
  const grouped = groupByCategory(medicines);

  return (
    <>
      {/* ===== Hero ===== */}
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
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">内服薬・処方薬</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            MEDICINE
          </p>
          <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-relaxed">
            内服薬・処方薬
          </h1>
          <p className="text-sm tracking-widest text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
            医師の診察のもと、お悩みに合わせた内服薬・外用薬を処方いたします。
          </p>
        </div>
      </section>

      {/* ===== カテゴリ別一覧 ===== */}
      {grouped.map(([category, items], idx) => (
        <section
          key={category}
          className="py-14 md:py-20"
          style={{
            background: idx % 2 === 0
              ? "var(--color-brand-white)"
              : "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)",
          }}
        >
          <div className="section-container">
            {/* カテゴリ見出し */}
            <div className="mb-10">
              <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-2">
                {CATEGORY_EN[category]}
              </p>
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] border-l-4 border-[var(--color-brand-gold)] pl-4">
                {category}
              </h2>
            </div>

            {/* 薬品カード */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 md:gap-6">
              {items.map((m) => (
                <Link
                  key={m.slug}
                  href={`/medicine/${m.slug}`}
                  className="group block bg-white border border-[var(--color-brand-brown)]/10 rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
                >
                  {/* サムネイル */}
                  <div className="relative aspect-video bg-[var(--color-brand-cream)] flex items-center justify-center">
                    {m.thumbnail ? (
                      <Image
                        src={m.thumbnail.url}
                        alt={m.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <span className="font-serif text-sm text-[var(--color-brand-dark)]/30 tracking-widest">
                        {normalizeCategory(m.category)}
                      </span>
                    )}
                  </div>
                  {/* テキスト */}
                  <div className="px-3 py-3 md:px-4 md:py-4">
                    <p className="text-sm font-medium text-[var(--color-brand-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors">
                      {m.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1.5 line-clamp-2 leading-relaxed">
                      {m.catch_copy}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ===== 注意事項 ===== */}
      <section className="py-14 md:py-20 bg-[var(--color-brand-cream)]">
        <div className="section-container">
          <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
            処方に関するご注意
          </h2>
          <div className="space-y-4 text-sm text-[var(--color-text-secondary)] leading-[1.9]">
            <p>内服薬・外用薬は、医師の診察・処方が必要です。カウンセリングにて症状やご希望をお伺いしたうえで、最適な薬剤をご提案いたします。</p>
            <p>妊娠中・授乳中の方、アレルギーをお持ちの方、現在服用中のお薬がある方は、必ず事前にお申し出ください。</p>
            <p>効果や副作用には個人差があります。服用中に気になる症状が現れた場合は、速やかに当院へご連絡ください。</p>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <ConsultationCTA subtitle="お悩みに合わせた処方について、お気軽にカウンセリングでご相談ください。" />
    </>
  );
}
