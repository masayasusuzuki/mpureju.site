import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMedicineList, getMedicineBySlug, getCampaigns } from "@/lib/microcms/client";
import { findMedicinePriceRows } from "@/lib/supabase/queries";
import { SidebarCampaign } from "@/components/sections/SidebarCampaign";
import { InlinePricePanel } from "@/components/sections/InlinePricePanel";

/* ── フォールバック（microCMS未投入時） ── */
type FallbackMedicine = {
  slug: string;
  name: string;
  category: string | string[];
  catch_copy: string;
  description: string;
  usage: string;
  side_effects: string;
  contraindications: string;
};

const FALLBACK_MEDICINES: FallbackMedicine[] = [
  {
    slug: "tranexamic-set",
    name: "トラネキサム酸 / シナール / ユベラ / ハイチオール",
    category: "美肌・シミ対策",
    catch_copy: "シミ・肝斑を抑え込み、抗酸化の力で弾むような白玉肌を内側から呼び覚ます美白内服セットです。",
    description: "<p>トラネキサム酸はメラニン生成を抑制し、シミ・肝斑の改善に効果が期待できます。シナール（ビタミンC）は抗酸化作用とメラニン還元作用、ユベラ（ビタミンE）は血行促進と抗酸化、ハイチオール（L-システイン）はメラニンの排出を促します。4剤を組み合わせることで、総合的な美白効果が期待できます。</p>",
    usage: "医師の指示に従い、1日2〜3回に分けて服用してください。効果を実感するまでに1〜3ヶ月程度かかる場合があります。",
    side_effects: "胃部不快感・食欲不振・発疹など。いずれも軽度で、服用を中止すれば改善します。",
    contraindications: "血栓症の既往がある方、妊娠中・授乳中の方は医師にご相談ください。",
  },
  {
    slug: "nb-x",
    name: "NB-X（総合ビタミンB）",
    category: "美肌・シミ対策",
    catch_copy: "疲れも肌荒れもまとめてリセット。ビタミンB群を総合的に補い、毎日をベストコンディションへ導きます。",
    description: "<p>NB-Xは、ビタミンB1・B2・B6・B12・ナイアシン・パントテン酸・葉酸・ビオチンを含む総合ビタミンBサプリメントです。肌のターンオーバーを促進し、口内炎・肌荒れ・疲労感の改善に効果が期待できます。</p>",
    usage: "医師の指示に従い、1日1〜2回服用してください。",
    side_effects: "特に重大な副作用は報告されていませんが、まれに胃部不快感を感じる場合があります。",
    contraindications: "特にありませんが、アレルギーのある方は医師にご相談ください。",
  },
  {
    slug: "vitamin-cd",
    name: "ビタミンC＋D",
    category: "美肌・シミ対策",
    catch_copy: "体にとって重要なビタミンCを高用量で補給。骨を丈夫にするビタミンDとの組み合わせで、さまざまな健康効果が期待できます。",
    description: "<p>高用量ビタミンC（2000〜3000mg）とビタミンDを組み合わせた処方です。ビタミンCは抗酸化作用・コラーゲン生成促進・免疫力向上、ビタミンDは骨代謝・免疫調節に寄与します。顆粒タイプとカプセルタイプからお選びいただけます。</p>",
    usage: "医師の指示に従い、1日1〜3回に分けて服用してください。",
    side_effects: "高用量のビタミンCにより、まれに下痢・胃部不快感が生じることがあります。",
    contraindications: "腎機能障害のある方は医師にご相談ください。",
  },
  {
    slug: "zinc",
    name: "亜鉛 / 亜鉛-X",
    category: "頭皮・毛髪ケア",
    catch_copy: "テカリを抑え、ツヤを育む。抜け毛を防ぎ、芯から強い健やかな美しさを支えるミネラルサプリメントです。",
    description: "<p>亜鉛は皮膚・毛髪・爪の健康に不可欠なミネラルです。皮脂分泌の調整、毛髪の成長促進、免疫機能の維持に寄与します。亜鉛-Xはより高吸収の処方で、効率的に亜鉛を補給できます。</p>",
    usage: "医師の指示に従い、1日1回服用してください。食後の服用が推奨されます。",
    side_effects: "空腹時の服用で胃部不快感・吐き気が生じることがあります。",
    contraindications: "特にありませんが、他のミネラルサプリメントとの併用は医師にご相談ください。",
  },
  {
    slug: "cellactin",
    name: "セルアクチン",
    category: "頭皮・毛髪ケア",
    catch_copy: "細胞から時計の針を巻き戻す。全身の若々しさを内側から更新するエイジングケアサプリメントです。",
    description: "<p>セルアクチンは細胞の活性化を促し、全身のエイジングケアをサポートするサプリメントです。毛髪の成長促進、肌のハリ・ツヤ改善、全身の活力向上が期待できます。</p>",
    usage: "医師の指示に従い、1日1〜2回服用してください。",
    side_effects: "重大な副作用は報告されていません。",
    contraindications: "妊娠中・授乳中の方は医師にご相談ください。",
  },
  {
    slug: "finasteride",
    name: "フィナステリド / デュタステリド",
    category: "AGA治療",
    catch_copy: "内側から薄毛の進行を防ぎ、自信の髪を守る。男性型脱毛症（AGA）が原因の薄毛に改善効果が期待できます。",
    description: "<p>フィナステリドは5α還元酵素II型を阻害し、DHT（ジヒドロテストステロン）の生成を抑制することで薄毛の進行を防ぎます。デュタステリドはI型・II型の両方を阻害し、より強力な効果が期待できます。</p>",
    usage: "1日1回、毎日同じ時刻に服用してください。効果を実感するまでに3〜6ヶ月程度かかります。",
    side_effects: "性欲減退・勃起不全・肝機能障害など。発現頻度は低いですが、異常を感じた場合は服用を中止し医師にご相談ください。",
    contraindications: "女性（特に妊娠中・妊娠の可能性がある方）は触れることも禁忌です。肝機能障害のある方は医師にご相談ください。",
  },
  {
    slug: "minoxidil",
    name: "ミノキシジル",
    category: "AGA治療",
    catch_copy: "毛母細胞を活性化し、強い髪を育て伸ばす。発毛した毛を太く長くさせる効果も期待できます。",
    description: "<p>ミノキシジルは毛母細胞を直接刺激し、毛細血管を拡張させることで毛根への栄養供給を改善します。内服タイプは外用に比べて全身への作用があり、より強力な発毛効果が期待できます。</p>",
    usage: "医師の指示に従い、1日1回服用してください。効果を実感するまでに3〜6ヶ月程度かかります。",
    side_effects: "多毛症・動悸・むくみ・血圧低下など。定期的な血液検査と血圧測定をお勧めします。",
    contraindications: "心疾患・低血圧の方、妊娠中・授乳中の方は服用できません。",
  },
  {
    slug: "rizaben",
    name: "リザベン",
    category: "ニキビ・肌荒れ",
    catch_copy: "炎症を抑え、跡が残りにくい肌へ。線維芽細胞によるコラーゲンの過剰生成を抑えて瘢痕形成を防ぎます。",
    description: "<p>リザベン（トラニラスト）は、肥満細胞からのヒスタミン遊離を抑制し、線維芽細胞の過剰なコラーゲン産生を抑えることで、ケロイドや肥厚性瘢痕の予防・改善に効果が期待できます。術後の瘢痕予防にも使用されます。</p>",
    usage: "医師の指示に従い、1日3回、食後に服用してください。",
    side_effects: "膀胱炎様症状（頻尿・排尿痛）・胃部不快感・肝機能障害など。異常を感じた場合は服用を中止してください。",
    contraindications: "妊娠中・妊娠の可能性がある方は服用できません。",
  },
  {
    slug: "isotretinoin",
    name: "イソトレチノイン",
    category: "ニキビ・肌荒れ",
    catch_copy: "毛穴の詰まり抑制・皮脂分泌抑制・抗菌抗炎症作用で、繰り返すニキビを根本から改善します。",
    description: "<p>イソトレチノインはビタミンA誘導体の内服薬で、重症ニキビに対して高い改善効果が期待できます。皮脂腺を縮小させ皮脂分泌を大幅に減少させるほか、毛穴の角化異常の改善、抗炎症作用により、難治性のニキビに対応します。</p>",
    usage: "医師の指示に従い、1日1〜2回、食後に服用してください。治療期間は通常4〜6ヶ月程度です。",
    side_effects: "皮膚・粘膜の乾燥（口唇・鼻腔）・肝機能障害・脂質異常・筋肉痛など。定期的な血液検査が必要です。",
    contraindications: "妊娠中・妊娠の可能性がある方は絶対に服用できません（催奇形性あり）。服用中および服用終了後一定期間は避妊が必要です。",
  },
  {
    slug: "aldactone",
    name: "アルダクトン",
    category: "ニキビ・肌荒れ",
    catch_copy: "皮脂分泌を減らし、大人ニキビの改善に有効。肌の不安定期に終止符を打ちます。",
    description: "<p>アルダクトン（スピロノラクトン）は本来利尿薬ですが、抗アンドロゲン作用により皮脂分泌を抑制する効果があります。ホルモンバランスの乱れによる大人ニキビ、特に顎・フェイスラインに繰り返すニキビに効果が期待できます。</p>",
    usage: "医師の指示に従い、1日1〜2回服用してください。",
    side_effects: "月経不順・乳房痛・高カリウム血症・倦怠感など。定期的な血液検査をお勧めします。",
    contraindications: "妊娠中・授乳中の方、高カリウム血症の方、腎不全の方は服用できません。",
  },
  {
    slug: "saireito",
    name: "柴苓湯",
    category: "ダウンタイム軽減",
    catch_copy: "術後の腫れやむくみを内側から素早く取り去り、軽やかな回復を叶える漢方薬です。",
    description: "<p>柴苓湯（さいれいとう）は、小柴胡湯と五苓散を合わせた漢方薬です。抗炎症作用と利水作用を併せ持ち、術後の腫れ・むくみ・内出血の軽減に効果が期待できます。当院では施術前後の服用をお勧めしています。</p>",
    usage: "医師の指示に従い、1日3回、食前または食間に服用してください。施術の数日前から服用を開始し、術後1〜2週間程度継続します。",
    side_effects: "胃部不快感・食欲不振など。漢方薬特有の味が苦手な方はお湯に溶かして服用してください。",
    contraindications: "肝機能障害のある方、他の漢方薬を服用中の方は医師にご相談ください。",
  },
  {
    slug: "lumigan",
    name: "ルミガン",
    category: "まつ毛育成",
    catch_copy: "毛周期の成長期を伸ばすことで、まつ毛を太く長くする効果が期待できる外用薬です。",
    description: "<p>ルミガン（ビマトプロスト）は、もともと緑内障治療用の点眼薬ですが、まつ毛の成長期を延長させる効果があることが発見されました。専用のアプリケーターで上まつ毛の生え際に塗布することで、まつ毛を長く・太く・濃くする効果が期待できます。</p>",
    usage: "1日1回、就寝前に専用アプリケーターで上まつ毛の生え際に塗布してください。効果を実感するまでに4〜8週間程度かかります。",
    side_effects: "目の充血・かゆみ・色素沈着（まぶたの黒ずみ）・虹彩色素沈着など。塗布部位以外に付着した場合はすぐに拭き取ってください。",
    contraindications: "妊娠中・授乳中の方、眼疾患のある方は医師にご相談ください。",
  },
];

const TOC = [
  { id: "description", label: "薬剤について" },
  { id: "usage", label: "用法・用量" },
  { id: "side-effects", label: "副作用" },
  { id: "contraindications", label: "使用上の注意" },
];

export async function generateStaticParams() {
  const { contents } = await getMedicineList();
  if (contents.length > 0) {
    return contents.map((m) => ({ slug: m.slug }));
  }
  return FALLBACK_MEDICINES.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const medicine = await getMedicineBySlug(slug);
  const fallback = FALLBACK_MEDICINES.find((m) => m.slug === slug);
  const data = medicine ?? fallback;
  if (!data) return {};
  return {
    title: `${data.name}｜内服薬・処方薬｜Maison PUREJU`,
    description: data.catch_copy,
  };
}

export default async function MedicineDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const medicine = await getMedicineBySlug(slug);
  const fallback = FALLBACK_MEDICINES.find((m) => m.slug === slug);
  const data = medicine ?? fallback;
  if (!data) notFound();

  const [{ contents: allMedicines }, campaigns, priceRows] = await Promise.all([
    getMedicineList(),
    getCampaigns(),
    findMedicinePriceRows(data.name),
  ]);
  const otherList = allMedicines.length > 0
    ? allMedicines.filter((m) => m.slug !== slug)
    : FALLBACK_MEDICINES.filter((m) => m.slug !== slug);

  return (
    <article>
      {/* ── Hero ── */}
      <section className="relative w-full min-h-[200px] md:min-h-[260px] bg-[var(--color-brand-cream)]">
        <div className="absolute inset-0 flex flex-col justify-end pb-10 md:pb-12">
          <div style={{ paddingLeft: "max(1.5rem, calc((100vw - 1200px) / 2 + 2rem))" }}>
            <nav className="flex items-center gap-2 text-xs text-[var(--color-brand-dark)]/50 mb-4 tracking-wider">
              <Link href="/" className="hover:text-[var(--color-brand-dark)] transition-colors">HOME</Link>
              <span>/</span>
              <Link href="/medicine" className="hover:text-[var(--color-brand-dark)] transition-colors">内服薬</Link>
              <span>/</span>
              <span className="text-[var(--color-brand-dark)]/80">{data.name}</span>
            </nav>
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] mb-2">
              {Array.isArray(data.category) ? data.category[0] : data.category}
            </p>
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-[var(--color-brand-dark)] tracking-wide">
              {data.name}
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)] mt-3 max-w-4xl leading-relaxed">
              {data.catch_copy}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2カラム：メイン + サイドバー ── */}
      <div className="section-container py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* ── メインコンテンツ ── */}
          <div className="flex-1 min-w-0 space-y-14 md:space-y-20">

            {/* 目次 */}
            <nav className="border border-[var(--color-brand-brown)]/15 p-5 md:p-6">
              <p className="text-xs tracking-[0.2em] text-[var(--color-brand-gold)] mb-3 font-medium">
                CONTENTS
              </p>
              <ol className="space-y-2">
                {TOC.map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="flex items-baseline gap-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] transition-colors"
                    >
                      <span className="text-xs text-[var(--color-brand-gold)]">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            {/* 薬剤について */}
            <section id="description">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                薬剤について
              </h2>
              <div
                className="prose prose-neutral max-w-none prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9]"
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </section>

            {/* 用法・用量 */}
            <section id="usage">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                用法・用量
              </h2>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
                {data.usage}
              </p>
            </section>

            {/* 副作用 */}
            <section id="side-effects">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                副作用
              </h2>
              <div
                className="prose prose-neutral max-w-none prose-p:text-[var(--color-text-secondary)] prose-p:leading-[1.9]"
                dangerouslySetInnerHTML={{ __html: data.side_effects }}
              />
            </section>

            {/* 使用上の注意 */}
            <section id="contraindications">
              <h2 className="font-serif text-xl md:text-2xl text-[var(--color-brand-dark)] mb-8 border-l-4 border-[var(--color-brand-gold)] pl-4">
                使用上の注意
              </h2>
              <div className="bg-[var(--color-brand-cream)] border border-[var(--color-brand-gold)]/20 p-5 md:p-6 rounded-sm">
                <p className="text-sm md:text-base text-[var(--color-text-secondary)] leading-[1.9]">
                  {data.contraindications}
                </p>
              </div>
            </section>
          </div>

          {/* ── サイドバー ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">

              {/* キャンペーン */}
              <SidebarCampaign campaigns={campaigns} />

              {/* 料金 */}
              <InlinePricePanel title={data.name} rows={priceRows} />

              {/* その他の内服薬 */}
              {otherList.length > 0 && (
                <div className="border border-[var(--color-brand-brown)]/10 rounded-sm">
                  <div className="px-4 py-3 border-b border-[var(--color-brand-brown)]/10">
                    <p className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)] font-medium">
                      その他の内服薬
                    </p>
                  </div>
                  <ul className="divide-y divide-[var(--color-brand-brown)]/5">
                    {otherList.map((m) => (
                      <li key={m.slug}>
                        <Link
                          href={`/medicine/${m.slug}`}
                          className="block px-4 py-3 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)]/50 transition-colors"
                        >
                          {m.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>

        </div>
      </div>

      {/* ── CTA ── */}
      <section className="bg-white border-t border-[var(--color-brand-gold)]/20 py-16 md:py-20">
        <div className="section-container text-center">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">
            CONSULTATION
          </p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            お悩みに合わせた処方について、お気軽にカウンセリングでご相談ください。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
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
        </div>
      </section>
    </article>
  );
}
