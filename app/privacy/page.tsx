import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜Maison PUREJU",
  description:
    "Maison PUREJU（銀座）のプライバシーポリシー。個人情報の取り扱いについてご説明いたします。",
};

export default function PrivacyPage() {
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
            <span className="text-[var(--color-text-secondary)]">プライバシーポリシー</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            PRIVACY POLICY
          </p>
          <h1 className="font-serif text-4xl md:text-5xl tracking-widest text-[var(--color-brand-dark)] leading-tight">
            プライバシーポリシー
          </h1>
        </div>
      </section>

      {/* ── 本文 ── */}
      <section className="py-16 md:py-24 bg-white">
        <div className="section-container max-w-3xl">
          <div className="space-y-12 text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">

            <PolicySection title="個人情報の定義">
              <p>
                本ポリシーにおいて「個人情報」とは、生存する個人に関する情報であって、氏名、生年月日、住所、電話番号、メールアドレス等、特定の個人を識別することができるものをいいます。
              </p>
            </PolicySection>

            <PolicySection title="個人情報の管理">
              <p>
                当院は、お客様からお預かりした個人情報について、不正アクセス、紛失、漏えい等が起こらないよう、慎重かつ適切に管理いたします。
              </p>
            </PolicySection>

            <PolicySection title="個人情報の利用目的">
              <p>当院では、お客様からお預かりした個人情報を以下の目的で利用いたします。</p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>診療・治療・アフターケアの提供</li>
                <li>お問い合わせに対する回答・ご連絡</li>
                <li>サービスの提供</li>
                <li>メールマガジンの配信、イベント等のご案内</li>
                <li>アンケートへのご協力のお願い</li>
                <li>商品・景品等の発送</li>
                <li>サービスの向上・改善のための分析</li>
                <li>個人を識別できない形式での統計データの作成</li>
              </ul>
            </PolicySection>

            <PolicySection title="個人情報の第三者提供">
              <p>
                当院は、個人情報保護法その他の法令に基づき開示が認められる場合を除き、お客様ご本人の同意を得ずに第三者に個人情報を提供することはありません。ただし、以下の場合はこの限りではありません。
              </p>
              <ul className="list-disc pl-5 mt-3 space-y-1">
                <li>法令に基づく場合</li>
                <li>人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき</li>
                <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
                <li>国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合</li>
              </ul>
            </PolicySection>

            <PolicySection title="個人情報の開示・訂正・削除">
              <p>
                お客様ご本人からの個人情報の開示・訂正・削除のお申し出があった場合は、ご本人確認の上、速やかに対応いたします。下記のお問い合わせ窓口までご連絡ください。
              </p>
            </PolicySection>

            <PolicySection title="Cookie（クッキー）について">
              <p>
                当院のウェブサイトでは、利便性の向上およびアクセス状況の分析のためにCookieを使用しています。Cookieにより個人を特定する情報は収集しておりません。ブラウザの設定によりCookieの受け取りを拒否することも可能ですが、一部のサービスがご利用いただけなくなる場合があります。
              </p>
            </PolicySection>

            <PolicySection title="アクセス解析ツールについて">
              <p>
                当院のウェブサイトでは、Googleアナリティクスを利用してトラフィックデータを収集しています。このデータはCookieを使用して匿名で収集されており、個人を特定するものではありません。収集されたデータはサービスの改善のために使用いたします。詳細については、
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-brand-gold)] underline underline-offset-2"
                >
                  Googleのプライバシーポリシー
                </a>
                をご参照ください。
              </p>
            </PolicySection>

            <PolicySection title="本ポリシーの変更について">
              <p>
                当院は、法令の改正やサービス内容の変更等により、本ポリシーの内容を予告なく変更する場合があります。変更後のプライバシーポリシーは、当院ウェブサイトに掲載した時点から効力を生じるものとします。
              </p>
            </PolicySection>

            <PolicySection title="お問い合わせ窓口">
              <div className="bg-[var(--color-brand-cream)] px-6 py-5 mt-3">
                <p className="font-medium text-[var(--color-brand-dark)] mb-2">Maison PUREJU</p>
                <p>〒104-0061 東京都中央区銀座５丁目３−１３ Ginza SS 85ビル 4F</p>
                <p>TEL: 03-3289-1222</p>
                <p>
                  お問い合わせフォーム:{" "}
                  <Link href="/contact" className="text-[var(--color-brand-gold)] underline underline-offset-2">
                    こちら
                  </Link>
                </p>
              </div>
            </PolicySection>
          </div>
        </div>
      </section>
    </>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-medium text-[var(--color-brand-dark)] mb-4 pb-2 border-b border-[var(--color-brand-gold)]/30 tracking-wide">
        {title}
      </h2>
      <div className="text-sm text-[var(--color-text-secondary)] leading-[2.2] font-light">
        {children}
      </div>
    </div>
  );
}
