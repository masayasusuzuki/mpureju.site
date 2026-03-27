"use client";

import { useState } from "react";

const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"] as const;
const MONTH_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAY_MAP: Record<string, number> = {
  日曜: 0, 月曜: 1, 火曜: 2, 水曜: 3, 木曜: 4, 金曜: 5, 土曜: 6,
};

interface Props {
  regularHolidays: string[];
  extraHolidays: string[];
  cancelHolidays: string[];
}

function parseDates(lines: string[]): Set<string> {
  return new Set(lines.filter((l) => /^\d{4}-\d{2}-\d{2}$/.test(l)));
}

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function MonthCalendar({
  year,
  month,
  holidayWeekdays,
  extraSet,
  cancelSet,
}: {
  year: number;
  month: number;
  holidayWeekdays: Set<number>;
  extraSet: Set<string>;
  cancelSet: Set<string>;
}) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const today = fmt(new Date());

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      {/* 月ヘッダー */}
      <div className="mb-4 text-center">
        <p className="font-en text-[0.6rem] tracking-[0.3em] text-[var(--color-brand-gold)] uppercase">
          {MONTH_EN[month]}
        </p>
        <p className="font-en text-3xl font-extralight text-[var(--color-brand-dark)] leading-tight">
          {String(month + 1)}
        </p>
        <p className="font-en text-[0.625rem] text-[var(--color-text-secondary)] tracking-widest">
          {year}
        </p>
      </div>

      {/* 区切り線 */}
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-brand-gold)]/30 to-transparent mb-3" />

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`text-center text-[0.6rem] tracking-wider py-1.5 font-medium ${
              i === 0 ? "text-rose-300" : i === 6 ? "text-sky-300" : "text-[var(--color-brand-dark)]/40"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;

          const date = new Date(year, month, day);
          const dateStr = fmt(date);
          const dow = date.getDay();

          const isHoliday =
            (holidayWeekdays.has(dow) || extraSet.has(dateStr)) &&
            !cancelSet.has(dateStr);
          const isToday = dateStr === today;

          return (
            <div key={day} className="flex items-center justify-center py-0.5">
              <span
                className={`
                  w-8 h-8 flex items-center justify-center rounded-full text-xs transition-colors
                  ${isToday
                    ? "bg-[var(--color-brand-gold)] text-white font-medium"
                    : isHoliday
                      ? "bg-rose-50 text-rose-300 line-through decoration-rose-200"
                      : dow === 0
                        ? "text-rose-400"
                        : dow === 6
                          ? "text-sky-400"
                          : "text-[var(--color-brand-dark)]"
                  }
                `}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ClinicCalendarWidget({ regularHolidays, extraHolidays, cancelHolidays }: Props) {
  const now = new Date();
  const [baseMonth, setBaseMonth] = useState(() => now.getMonth());
  const [baseYear, setBaseYear] = useState(() => now.getFullYear());

  const holidayWeekdays = new Set(
    regularHolidays.map((h) => WEEKDAY_MAP[h]).filter((v) => v !== undefined)
  );
  const extraSet = parseDates(extraHolidays);
  const cancelSet = parseDates(cancelHolidays);

  const nextMonth = baseMonth === 11 ? 0 : baseMonth + 1;
  const nextYear = baseMonth === 11 ? baseYear + 1 : baseYear;

  const prevNav = () => {
    if (baseMonth === 0) { setBaseMonth(11); setBaseYear(baseYear - 1); }
    else setBaseMonth(baseMonth - 1);
  };
  const nextNav = () => {
    if (baseMonth === 11) { setBaseMonth(0); setBaseYear(baseYear + 1); }
    else setBaseMonth(baseMonth + 1);
  };

  const holidayLabel = regularHolidays.length > 0
    ? regularHolidays.map((h) => h.replace("曜", "")).join("・") + "曜定休"
    : null;

  return (
    <div>
      {/* ナビ */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={prevNav}
          aria-label="前の月"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 2L3.5 6L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {holidayLabel && (
          <p className="text-[0.625rem] text-[var(--color-text-secondary)] tracking-wider">
            {holidayLabel}
          </p>
        )}
        <button
          onClick={nextNav}
          aria-label="次の月"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-brand-gold)]/20 text-[var(--color-brand-gold)] hover:bg-[var(--color-brand-cream)] transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 2L8.5 6L4.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* 2ヶ月表示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:divide-x sm:divide-[var(--color-brand-gold)]/10">
        <MonthCalendar
          year={baseYear}
          month={baseMonth}
          holidayWeekdays={holidayWeekdays}
          extraSet={extraSet}
          cancelSet={cancelSet}
        />
        <div className="sm:pl-8">
          <MonthCalendar
            year={nextYear}
            month={nextMonth}
            holidayWeekdays={holidayWeekdays}
            extraSet={extraSet}
            cancelSet={cancelSet}
          />
        </div>
      </div>

      {/* 凡例 */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-[var(--color-brand-brown)]/5">
        <div className="flex items-center gap-1.5 text-[0.625rem] text-[var(--color-text-secondary)]">
          <span className="w-6 h-6 rounded-full bg-[var(--color-brand-gold)] inline-flex items-center justify-center text-white text-[0.5rem]">
            {new Date().getDate()}
          </span>
          本日
        </div>
        <div className="flex items-center gap-1.5 text-[0.625rem] text-[var(--color-text-secondary)]">
          <span className="w-6 h-6 rounded-full bg-rose-50 inline-flex items-center justify-center text-rose-300 text-[0.5rem] line-through">
            00
          </span>
          休診
        </div>
      </div>
    </div>
  );
}
