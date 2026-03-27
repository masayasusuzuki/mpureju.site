"use client";

import { useState } from "react";

interface Step {
  number: string;
  title: string;
  desc: string;
  image?: string;
  note?: { label: string; text: string }[];
}

const SKIN_STEPS: Step[] = [
  {
    number: "1",
    title: "事前問診票の記入",
    desc: "ご予約完了後、事前Web問診票のご入力によりご来院の際にスムーズにご案内可能です。",
    image: "/reservation/skin_step1.jpg",
  },
  {
    number: "2",
    title: "ご来院〜ご案内",
    desc: "当院は完全個室のため、ご来院から施術まですべての行程をプライベート空間でお過ごしいただけます。",
    image: "/reservation/skin_step2.jpg",
  },
  {
    number: "3",
    title: "カウンセラーによるカウンセリング",
    desc: "カウンセラーにあなたのお悩みをお気軽にご相談ください。",
    image: "/reservation/skin_step3.jpg",
  },
  {
    number: "4",
    title: "洗顔",
    desc: "完全個室のため、移動せずに洗顔が可能です。こだわりの洗顔料をぜひお試しください。",
    image: "/reservation/skin_step4.jpg",
  },
  {
    number: "5",
    title: "肌診断機 お肌状態の分析",
    desc: "お肌診断機で今のあなたのお肌状態を分析。お肌状態を知ることで、最適な治療のご提案が可能です。",
    image: "/reservation/skin_step5.jpg",
  },
  {
    number: "6",
    title: "医師によるカウンセリング・診察",
    desc: "肌診断機での分析後は医師による診察へ。あなただけの最適な治療をご提案させていただきます。",
    image: "/reservation/skin_step6.jpg",
  },
  {
    number: "7",
    title: "同意書記入・お会計",
    desc: "施術内容が確定いたしましたら、お手続きに移ります。",
    image: "/reservation/skin_step7.jpg",
    note: [
      { label: "当日施術の場合", text: "同意書記入・お会計" },
      { label: "後日施術希望の場合", text: "同意書記入・お会計→ご帰宅" },
    ],
  },
  {
    number: "8",
    title: "看護師による施術",
    desc: "技術力とホスピタリティあふれる熟練の看護師により、ひとりひとりのお悩みにあわせて施術いたします。",
    image: "/reservation/skin_step8.jpg",
  },
  {
    number: "9",
    title: "パウダールーム・帰宅",
    desc: "パウダールームはスキンケアのご用意もございます。ご準備が終わりましたら、ご帰宅となります。",
    image: "/reservation/skin_step9.jpg",
  },
];

const SURGERY_STEPS: Step[] = [
  {
    number: "1",
    title: "事前問診票の記入",
    desc: "ご予約完了後、事前Web問診票のご入力によりご来院の際にスムーズにご案内可能です。",
    image: "/reservation/surgery_step1.jpg",
  },
  {
    number: "2",
    title: "ご来院〜ご案内",
    desc: "当院は完全個室のため、ご来院から施術まですべての行程をプライベート空間でお過ごしいただけます。",
    image: "/reservation/surgery_step2.jpg",
  },
  {
    number: "3",
    title: "カウンセラーによるカウンセリング",
    desc: "カウンセラーにあなたのお悩みをお気軽にご相談ください。",
    image: "/reservation/surgery_step3.jpg",
  },
  {
    number: "6",
    title: "医師によるカウンセリング・診察",
    desc: "医師が直接カウンセリング・診察を行い、あなただけの最適な治療をご提案させていただきます。",
    image: "/reservation/surgery_step6.jpg",
  },
  {
    number: "7",
    title: "同意書記入・お会計",
    desc: "施術内容が確定いたしましたら、お手続きに移ります。",
    image: "/reservation/surgery_step7.jpg",
    note: [
      { label: "当日施術の場合", text: "同意書記入・お会計" },
      { label: "後日施術希望の場合", text: "同意書記入・お会計→ご帰宅" },
    ],
  },
  {
    number: "8",
    title: "術前採血・帰宅",
    desc: "手術をするにあたり、血液検査を実施いたします。ご帰宅前に採血をし、ご帰宅となります。",
    image: "/reservation/surgery_step8.jpg",
  },
  {
    number: "9",
    title: "パウダールーム・帰宅",
    desc: "ご準備が終わりましたら、ご帰宅となります。",
    image: "/reservation/surgery_step9.jpg",
  },
];

const TABS = [
  { key: "skin", label: "美容皮膚科", steps: SKIN_STEPS },
  { key: "surgery", label: "美容外科", steps: SURGERY_STEPS },
] as const;

export function ReservationFlow() {
  const [active, setActive] = useState<string>("skin");
  const [step, setStep] = useState(0);
  const tab = TABS.find((t) => t.key === active)!;
  const current = tab.steps[step];

  const switchTab = (key: string) => {
    setActive(key);
    setStep(0);
  };
  const prev = () => setStep((s) => Math.max(0, s - 1));
  const next = () => setStep((s) => Math.min(tab.steps.length - 1, s + 1));

  return (
    <div>
      {/* タブ */}
      <div className="flex justify-center gap-1 mb-10">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => switchTab(t.key)}
            className={`px-6 py-3 text-sm tracking-wider transition-colors rounded-sm ${
              active === t.key
                ? "bg-[var(--color-brand-dark)] text-white"
                : "bg-white text-[var(--color-brand-dark)] border border-[var(--color-brand-brown)]/15 hover:bg-[var(--color-brand-cream)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* カルーセル: ボタン横配置 */}
      <div className="max-w-3xl mx-auto">
        {/* プログレスバー */}
        <div className="flex gap-1 mb-6 max-w-2xl mx-auto">
          {tab.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= step
                  ? "bg-[var(--color-brand-gold)]"
                  : "bg-[var(--color-brand-brown)]/10"
              }`}
            />
          ))}
        </div>

        {/* カード + 左右ボタン */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* 左ボタン */}
          <button
            onClick={prev}
            disabled={step === 0}
            className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/25 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* カード */}
          <div className="flex-1 min-w-0 bg-white border border-[var(--color-brand-brown)]/8 rounded-lg overflow-hidden">
            {/* 画像 */}
            {current.image && (
              <div className="w-full aspect-[2/1] bg-[var(--color-brand-cream)] overflow-hidden">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            {/* テキスト */}
            <div className="px-5 py-5 md:px-8 md:py-6">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-8 h-8 rounded-full bg-[var(--color-brand-gold)] text-white text-sm font-medium flex items-center justify-center">
                  {step + 1}
                </span>
                <span className="text-xs tracking-[0.15em] text-[var(--color-brand-gold)] font-medium">
                  STEP {step + 1}
                </span>
              </div>

              <h3 className="text-lg font-medium text-[var(--color-brand-dark)] mb-3">
                {current.title}
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)] leading-[1.8]">
                {current.desc}
              </p>

              {current.note && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {current.note.map((n) => (
                    <div
                      key={n.label}
                      className="bg-[var(--color-brand-cream)] px-4 py-2.5 rounded-sm"
                    >
                      <p className="text-[0.6875rem] font-medium text-[var(--color-brand-gold)] mb-1">
                        {n.label}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)]">
                        {n.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右ボタン */}
          <button
            onClick={next}
            disabled={step === tab.steps.length - 1}
            className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/25 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 2L10 7L5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* カウンター */}
        <p className="text-center mt-4 text-xs text-[var(--color-text-secondary)]">
          <span className="font-en font-medium text-[var(--color-brand-dark)]">{step + 1}</span>
          <span className="mx-1">/</span>
          <span className="font-en">{tab.steps.length}</span>
        </p>
      </div>
    </div>
  );
}
