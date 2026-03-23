import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表示｜Maison PUREJU",
  description:
    "Maison PUREJU（銀座）の特定商取引法に基づく表示。",
};

export default function LegalPage() {
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
            <span className="text-[var(--color-text-secondary)]">特定商取引法に基づく表示</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            LEGAL NOTICE
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            特定商取引法に基づく表示
          </h1>
        </div>
      </section>

      {/* ── 本文 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-0">
            <LegalRow label="販売事業者" value="医療法人社団Maison PUREJU" />
            <LegalRow label="院長（責任者）" value="廣瀬 雅史" />
            <LegalRow label="所在地" value="〒104-0061 東京都中央区銀座５丁目３−１３ Ginza SS 85ビル 4F" />
            <LegalRow label="電話番号" value="03-3289-1222" />
            <LegalRow label="メールアドレス" value="お問い合わせフォームよりご連絡ください" link={{ href: "/contact", text: "お問い合わせフォーム" }} />
            <LegalRow label="診療時間" value="10:00〜19:00" />
            <LegalRow label="休診日" value="月曜日・不定休" />
            <LegalRow
              label="販売価格"
              value="各施術の料金ページに税込総額を表示しております"
              link={{ href: "/price", text: "料金一覧" }}
            />
            <LegalRow label="販売価格以外の必要料金" value="初診料・カウンセリング料は無料です。別途費用が発生する場合は、事前にご説明いたします。" />
            <LegalRow label="お支払い方法" value="現金 / クレジットカード（VISA・Mastercard・JCB・AMEX・Diners） / 医療ローン" />
            <LegalRow label="お支払い時期" value="施術当日のお支払い。医療ローンの場合は契約に基づくお支払い。" />
            <LegalRow label="サービスの提供時期" value="ご予約いただいた日時に施術を提供いたします。" />
            <LegalRow
              label="キャンセル・返金について"
              value="キャンセルポリシーに準じます。施術前のキャンセルは前日19:00までにご連絡ください。施術後の返金は原則としてお受けしておりませんが、医学的な理由がある場合は個別にご相談ください。"
              link={{ href: "/cancel-policy", text: "キャンセルポリシー" }}
            />
            <LegalRow label="中途解約について" value="コース契約の場合、未消化分については特定商取引法に基づき、所定の手数料を差し引いた金額を返金いたします。詳細はご契約時にご説明いたします。" />
            <LegalRow label="クーリング・オフ" value="特定商取引法に基づき、契約書面を受領した日から8日間以内であれば、書面によりクーリング・オフが可能です。" />
          </div>

          <div className="mt-16 pt-8 border-t border-[var(--color-brand-brown)]/10">
            <p className="text-xs text-[var(--color-text-secondary)]/60 leading-relaxed">
              ※ 上記内容は法令の改正等により変更される場合がございます。最新の情報は当院にお問い合わせください。
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function LegalRow({
  label,
  value,
  link,
}: {
  label: string;
  value: string;
  link?: { href: string; text: string };
}) {
  return (
    <div className="flex flex-col md:flex-row border-b border-[var(--color-brand-brown)]/10">
      <dt className="w-full md:w-56 shrink-0 py-4 md:py-5 text-sm font-medium text-[var(--color-brand-dark)] tracking-wide">
        {label}
      </dt>
      <dd className="flex-1 pb-4 md:py-5 text-sm text-[var(--color-text-secondary)] leading-[2] font-light">
        {value}
        {link && (
          <>
            {" "}
            <Link href={link.href} className="text-[var(--color-brand-gold)] underline underline-offset-2">
              {link.text}
            </Link>
          </>
        )}
      </dd>
    </div>
  );
}
