"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DayPicker } from "react-day-picker";
import { format, addDays } from "date-fns";
import { ja } from "date-fns/locale";
import "react-day-picker/dist/style.css";

import {
  ALL_TREATMENTS,
  PILLAR_LABELS,
  type TreatmentDowntime,
  type Pillar,
} from "@/lib/simulator/data";
import { calcSimulation, stringifySlugs } from "@/lib/simulator/logic";

const PILLARS: Pillar[] = ["eye", "nose", "mouth", "lift", "skin"];

// ─── 施術選択 ─────────────────────────────────────────────────────────────────

function TreatmentSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (slug: string) => void;
}) {
  const [openPillar, setOpenPillar] = useState<Pillar | null>("eye");

  return (
    <div>
      {PILLARS.map((pillar) => {
        const treatments = ALL_TREATMENTS.filter((t) => t.pillar === pillar);
        const selectedCount = treatments.filter((t) => selected.includes(t.slug)).length;
        const isOpen = openPillar === pillar;

        return (
          <div key={pillar} className="border-b border-[var(--color-brand-brown)]/10 last:border-0">
            <button
              onClick={() => setOpenPillar(isOpen ? null : pillar)}
              className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-[var(--color-brand-cream)] transition-colors"
            >
              <span className="text-xs tracking-[0.15em] text-[var(--color-brand-dark)]">
                {PILLAR_LABELS[pillar]}
              </span>
              <div className="flex items-center gap-2.5">
                {selectedCount > 0 && (
                  <span className="text-[10px] bg-[var(--color-brand-gold)] text-white w-5 h-5 flex items-center justify-center rounded-full">
                    {selectedCount}
                  </span>
                )}
                <span
                  className="text-[var(--color-brand-gold)] text-[10px] transition-transform duration-200"
                  style={{ display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  ▼
                </span>
              </div>
            </button>

            {isOpen && (
              <div className="px-5 pb-4 pt-1 space-y-0.5 bg-[var(--color-brand-cream)]/30">
                {treatments.map((t) => {
                  const checked = selected.includes(t.slug);
                  return (
                    <button
                      key={t.slug}
                      onClick={() => onToggle(t.slug)}
                      className={`w-full flex items-center gap-3 py-2.5 px-3 text-left transition-colors rounded-sm ${
                        checked
                          ? "bg-white border border-[var(--color-brand-gold)]/50"
                          : "hover:bg-white/60"
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 flex-shrink-0 border transition-colors ${
                          checked
                            ? "bg-[var(--color-brand-gold)] border-[var(--color-brand-gold)]"
                            : "border-[var(--color-brand-brown)]/30"
                        } flex items-center justify-center`}
                      >
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                            <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1">
                        <span className={`text-xs tracking-wide ${checked ? "text-[var(--color-brand-dark)] font-medium" : "text-[var(--color-brand-dark)]"}`}>
                          {t.name}
                        </span>
                        <span className="text-[10px] text-[var(--color-text-secondary)] ml-2">
                          {t.downtime_min_days}〜{t.downtime_max_days}日
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── タイムライン ─────────────────────────────────────────────────────────────

function Timeline({ result }: { result: ReturnType<typeof calcSimulation> }) {
  if (result.milestones.length === 0) return null;

  return (
    <div className="space-y-0">
      {/* 施術日 */}
      <div className="flex items-stretch gap-0">
        <div className="flex flex-col items-center w-8 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[var(--color-brand-gold)] mt-3 z-10 flex-shrink-0" />
          <div className="w-px flex-1 bg-[var(--color-brand-gold)]/25 mt-1" />
        </div>
        <div className="pb-5 pt-2">
          <p className="text-[10px] tracking-widest text-[var(--color-brand-gold)] uppercase mb-0.5">
            Operation Day
          </p>
          <p className="text-sm text-[var(--color-brand-dark)] font-medium tracking-wide">
            {format(result.operationDate, "yyyy年M月d日(E)", { locale: ja })}
          </p>
        </div>
      </div>

      {result.milestones.map((ms, i) => (
        <div key={i} className="flex items-stretch gap-0">
          <div className="flex flex-col items-center w-8 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--color-brand-gold)] bg-white mt-3 z-10 flex-shrink-0" />
            <div className="w-px flex-1 bg-[var(--color-brand-gold)]/25 mt-1" />
          </div>
          <div className="pb-5 pt-2">
            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-xs font-medium text-[var(--color-brand-dark)] tracking-wide">
                {ms.label}
              </span>
              <span className="text-[10px] text-[var(--color-brand-gold)] tracking-wider">
                {ms.dateLabel}
              </span>
            </div>
            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
              {ms.description}
            </p>
          </div>
        </div>
      ))}

      {/* 完了 */}
      <div className="flex items-start gap-0">
        <div className="flex flex-col items-center w-8 flex-shrink-0">
          <div className="w-3 h-3 rounded-full bg-[var(--color-brand-dark)] mt-3 z-10 flex-shrink-0" />
        </div>
        <div className="pt-2">
          <p className="text-[10px] tracking-widest text-[var(--color-text-secondary)] uppercase mb-0.5">
            Downtime End
          </p>
          <p className="text-sm text-[var(--color-brand-dark)] font-medium tracking-wide">
            {format(result.recoveryDate, "yyyy年M月d日(E)", { locale: ja })}
          </p>
          <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
            施術から約 {result.downtimeMaxDays} 日
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── メイン ───────────────────────────────────────────────────────────────────

export function SimulatorClient({ initialSlugs }: { initialSlugs: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [operationDate, setOperationDate] = useState<Date | undefined>(undefined);

  const selectedTreatments = useMemo(
    () => ALL_TREATMENTS.filter((t) => selectedSlugs.includes(t.slug)),
    [selectedSlugs]
  );

  const result = useMemo(
    () =>
      operationDate && selectedTreatments.length > 0
        ? calcSimulation(selectedTreatments, operationDate)
        : null,
    [selectedTreatments, operationDate]
  );

  const handleToggle = useCallback(
    (slug: string) => {
      const next = selectedSlugs.includes(slug)
        ? selectedSlugs.filter((s) => s !== slug)
        : [...selectedSlugs, slug];
      setSelectedSlugs(next);
      const params = new URLSearchParams(searchParams.toString());
      if (next.length > 0) {
        params.set("t", stringifySlugs(next));
      } else {
        params.delete("t");
      }
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [selectedSlugs, router, searchParams]
  );

  const highlightedDays = useMemo(
    () => (result ? result.milestones.map((ms) => ms.date) : []),
    [result]
  );

  const lineUrl = `https://lin.ee/maisonpureju`;

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-8 lg:gap-12 items-start">

      {/* ── 左: 施術選択 ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[var(--color-brand-gold)] font-en text-2xl font-light">01</span>
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-dark)]">施術を選ぶ</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] tracking-wider mt-0.5">複数選択可</p>
          </div>
        </div>

        <div className="bg-white border border-[var(--color-brand-brown)]/10">
          <TreatmentSelector selected={selectedSlugs} onToggle={handleToggle} />
        </div>

        {selectedTreatments.length > 0 && (
          <div className="mt-4 p-4 bg-[var(--color-brand-dark)] text-white">
            <p className="text-[10px] tracking-widest text-[var(--color-brand-gold)] mb-2 uppercase">Selected</p>
            <div className="flex flex-wrap gap-1.5">
              {selectedTreatments.map((t) => (
                <span
                  key={t.slug}
                  className="text-[11px] border border-[var(--color-brand-gold)]/40 px-2.5 py-1 text-[var(--color-brand-cream)] tracking-wide"
                >
                  {t.name}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-[var(--color-brand-gold)]/70 mt-3 tracking-wider">
              ダウンタイム目安: {selectedTreatments.length > 0
                ? `${Math.min(...selectedTreatments.map(t => t.downtime_min_days))}〜${Math.max(...selectedTreatments.map(t => t.downtime_max_days))}日`
                : "—"}
            </p>
          </div>
        )}
      </div>

      {/* ── 右: 日程 + 結果 ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-[var(--color-brand-gold)] font-en text-2xl font-light">02</span>
          <div>
            <p className="text-xs tracking-[0.2em] text-[var(--color-brand-dark)]">施術希望日（仮）を選ぶ</p>
            <p className="text-[10px] text-[var(--color-text-secondary)] tracking-wider mt-0.5">実際の予約可否はカウンセリングで確認</p>
          </div>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          {/* カレンダー */}
          <div className="bg-white border border-[var(--color-brand-brown)]/10 shadow-sm" style={{ boxShadow: "0 4px 32px rgba(61,43,26,0.06), 0 1px 4px rgba(61,43,26,0.04)" }}>
            <DayPicker
              mode="single"
              selected={operationDate}
              onSelect={setOperationDate}
              locale={ja}
              disabled={{ before: new Date() }}
              modifiers={{
                milestone: highlightedDays,
                recovery: result?.recoveryDate ? [result.recoveryDate] : [],
              }}
              modifiersStyles={{
                milestone: {
                  backgroundColor: "rgba(201,169,110,0.18)",
                  color: "var(--color-brand-dark)",
                  fontWeight: "500",
                },
                recovery: {
                  backgroundColor: "var(--color-brand-dark)",
                  color: "white",
                },
              }}
            />
            {result && (
              <div className="mx-4 mb-4 pt-3 border-t border-[var(--color-brand-brown)]/10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-brand-gold)] flex-shrink-0" />
                  <span className="text-[10px] text-[var(--color-text-secondary)] tracking-wider">施術日</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: "rgba(201,169,110,0.18)" }} />
                  <span className="text-[10px] text-[var(--color-text-secondary)] tracking-wider">マイルストーン</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--color-brand-dark)] flex-shrink-0" />
                  <span className="text-[10px] text-[var(--color-text-secondary)] tracking-wider">ダウンタイム終了目安</span>
                </div>
              </div>
            )}
          </div>

          {/* タイムライン or プレースホルダー */}
          <div>
            {!result ? (
              <div className="py-8 text-center">
                <p className="text-xs text-[var(--color-text-secondary)] tracking-wider leading-relaxed">
                  {selectedTreatments.length === 0
                    ? "施術を選択して\n希望日を入力してください"
                    : "カレンダーで\n希望日を選択してください"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-[10px] tracking-widest text-[var(--color-text-secondary)] uppercase mb-5">
                  Recovery Timeline
                </p>
                <Timeline result={result} />

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-[var(--color-brand-brown)]/10 space-y-3">
                  <a
                    href={lineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-4 bg-[#06C755] text-white text-xs tracking-[0.2em] hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                    </svg>
                    この日程でLINE相談する
                  </a>
                  <a
                    href="https://mpureju.com/reservation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-4 border border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] text-xs tracking-[0.2em] hover:bg-[var(--color-brand-gold)] hover:text-white transition-colors"
                  >
                    カウンセリングで空き日程を確認する
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
