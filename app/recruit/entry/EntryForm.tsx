"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const TABS = [
  { id: "nurse", label: "看護師" },
  { id: "receptionist", label: "受付カウンセラー" },
  { id: "pr-creator", label: "広報 / SNSクリエイター" },
];

const PREFECTURES = [
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県","岐阜県",
  "静岡県","愛知県","三重県","滋賀県","京都府","大阪府","兵庫県",
  "奈良県","和歌山県","鳥取県","島根県","岡山県","広島県","山口県",
  "徳島県","香川県","愛媛県","高知県","福岡県","佐賀県","長崎県",
  "熊本県","大分県","宮崎県","鹿児島県","沖縄県",
];

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type Education = {
  schoolName: string;
  department: string;
  graduationYear: string;
  graduationMonth: string;
};

type WorkHistory = {
  companyName: string;
  jobTitle: string;
  periodFrom: string;
  periodTo: string;
  isCurrent: boolean;
  description: string;
};

type FormState = {
  name: string; furigana: string;
  birthYear: string; birthMonth: string; birthDay: string; gender: string;
  email: string; phone: string;
  postalCode: string; prefecture: string; address: string; addressBuilding: string;
  photo: File | null;
  education: Education[];
  workHistory: WorkHistory[];
  qualifications: string;
  motivation: string;
  selfPr: string;
  workStyle: string;
  desiredSalary: string;
  portfolioUrl: string;
  agreed: boolean;
};

type StepId =
  | "position" | "name" | "birth" | "contact" | "address"
  | "photo" | "education" | "work" | "qualifications"
  | "motivation" | "selfpr" | "conditions" | "portfolio" | "confirm";

// ─────────────────────────────────────────────────────────────
// Step metadata
// ─────────────────────────────────────────────────────────────

const STEP_META: Record<StepId, { question: string; hint?: string; optional?: boolean }> = {
  position:       { question: "応募する職種を\n選んでください" },
  name:           { question: "お名前を\n教えてください" },
  birth:          { question: "生年月日を\n教えてください" },
  contact:        { question: "ご連絡先を\n教えてください" },
  address:        { question: "ご住所を\n教えてください" },
  photo:          { question: "顔写真をアップロード\nしてください", hint: "任意でスキップできます", optional: true },
  education:      { question: "学歴を\n教えてください" },
  work:           { question: "職歴を\n教えてください", hint: "職歴なしの場合はスキップできます", optional: true },
  qualifications: { question: "保有する資格・免許を\n教えてください", hint: "なければスキップできます", optional: true },
  motivation:     { question: "志望動機を\n教えてください" },
  selfpr:         { question: "自己PRを\n入力してください", hint: "任意でスキップできます", optional: true },
  conditions:     { question: "希望条件を\n教えてください", hint: "任意でスキップできます", optional: true },
  portfolio:      { question: "ポートフォリオの\nURLを教えてください" },
  confirm:        { question: "内容を確認して\n送信してください" },
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function buildSteps(hasInitialTab: boolean, tab: string): StepId[] {
  const steps: StepId[] = [];
  if (!hasInitialTab) steps.push("position");
  steps.push(
    "name", "birth", "contact", "address", "photo",
    "education", "work", "qualifications",
    "motivation", "selfpr", "conditions",
  );
  if (tab === "pr-creator") steps.push("portfolio");
  steps.push("confirm");
  return steps;
}

function isValid(id: StepId, form: FormState, tab: string): boolean {
  switch (id) {
    case "position":    return !!tab;
    case "name":        return form.name.trim() !== "" && form.furigana.trim() !== "";
    case "birth":       return form.birthYear !== "" && form.birthMonth !== "" && form.birthDay !== "";
    case "contact":     return /\S+@\S+\.\S+/.test(form.email) && form.phone.trim() !== "";
    case "address":     return form.postalCode !== "" && form.prefecture !== "" && form.address.trim() !== "";
    case "motivation":  return form.motivation.trim().length >= 20;
    case "portfolio":   return form.portfolioUrl.trim() !== "";
    case "confirm":     return form.agreed;
    default:            return true;
  }
}

const EMPTY_EDU: Education  = { schoolName: "", department: "", graduationYear: "", graduationMonth: "" };
const EMPTY_WORK: WorkHistory = { companyName: "", jobTitle: "", periodFrom: "", periodTo: "", isCurrent: false, description: "" };

const INITIAL: FormState = {
  name: "", furigana: "", birthYear: "", birthMonth: "", birthDay: "", gender: "",
  email: "", phone: "", postalCode: "", prefecture: "", address: "", addressBuilding: "",
  photo: null,
  education: [{ ...EMPTY_EDU }],
  workHistory: [{ ...EMPTY_WORK }],
  qualifications: "", motivation: "", selfPr: "", workStyle: "", desiredSalary: "",
  portfolioUrl: "", agreed: false,
};

// Shared input styles (underline only – matches brand aesthetic)
const INPUT   = "w-full px-0 py-3 text-base bg-transparent border-b border-[var(--color-brand-brown)]/40 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors placeholder:text-[var(--color-text-secondary)]/30";
const TEXTAREA = "w-full px-0 py-3 text-base bg-transparent border-b border-[var(--color-brand-brown)]/40 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors resize-none leading-relaxed placeholder:text-[var(--color-text-secondary)]/30";

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function EntryForm() {
  const searchParams = useSearchParams();
  const positionParam = searchParams.get("position") ?? "";
  const hasInitialTab = TABS.some((t) => t.id === positionParam);

  const [activeTab,   setActiveTab]   = useState(hasInitialTab ? positionParam : "");
  const [form,        setForm]        = useState<FormState>(INITIAL);
  const [stepIdx,     setStepIdx]     = useState(0);
  const [direction,   setDirection]   = useState<"forward" | "backward">("forward");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [status,      setStatus]      = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [isLookingUp, setIsLookingUp] = useState(false);

  const visibleSteps = buildSteps(hasInitialTab, activeTab);
  const currentId    = visibleSteps[stepIdx];
  const meta         = STEP_META[currentId];
  const total        = visibleSteps.length;
  const isOptional   = meta.optional ?? false;
  const valid        = isValid(currentId, form, activeTab);
  const canNext      = valid || isOptional;

  // ── Navigation ──
  function goNext() {
    setDirection("forward");
    setStepIdx((s) => Math.min(s + 1, total - 1));
  }
  function goBack() {
    if (stepIdx === 0) return;
    setDirection("backward");
    setStepIdx((s) => s - 1);
  }

  // ── 郵便番号自動補完 ──
  async function handlePostalLookup(digits: string) {
    setIsLookingUp(true);
    try {
      const res  = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`);
      const data = await res.json();
      const r    = data.results?.[0];
      if (r) {
        setForm((prev) => ({
          ...prev,
          prefecture: r.address1,
          address:    r.address2 + r.address3,
        }));
      }
    } catch {
      // ネットワークエラー時はそのまま手入力
    } finally {
      setIsLookingUp(false);
    }
  }

  // ── Form handlers ──
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    const asInput = e.target as HTMLInputElement;
    setForm((prev) => ({
      ...prev,
      [name]: asInput.type === "checkbox" ? asInput.checked : value,
    }));
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((prev) => ({ ...prev, photo: file }));
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  }

  // Education
  function updateEdu(i: number, field: keyof Education, value: string) {
    setForm((prev) => ({
      ...prev,
      education: prev.education.map((e, idx) => idx === i ? { ...e, [field]: value } : e),
    }));
  }
  function addEdu()        { setForm((prev) => ({ ...prev, education:    [...prev.education,    { ...EMPTY_EDU  }] })); }
  function removeEdu(i: number) { setForm((prev) => ({ ...prev, education:    prev.education.filter((_, idx) => idx !== i) })); }

  // Work history
  function updateWork(i: number, field: keyof WorkHistory, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      workHistory: prev.workHistory.map((w, idx) => idx === i ? { ...w, [field]: value } : w),
    }));
  }
  function addWork()        { setForm((prev) => ({ ...prev, workHistory: [...prev.workHistory, { ...EMPTY_WORK }] })); }
  function removeWork(i: number) { setForm((prev) => ({ ...prev, workHistory: prev.workHistory.filter((_, idx) => idx !== i) })); }

  // Submit
  async function handleSubmit() {
    setStatus("submitting");
    // TODO: Supabase 接続時に実装
    await new Promise((r) => setTimeout(r, 1000));
    setStatus("done");
  }

  // ── Done state ──
  if (status === "done") {
    return (
      <div className="py-20 text-center">
        <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">THANK YOU</p>
        <h2 className="font-serif text-2xl text-[var(--color-brand-dark)] mb-4 leading-relaxed">
          ご応募を受け付けました
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          内容を確認の上、担当者よりご連絡いたします。
          <br />
          通常3〜5営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto">

      {/* ── Progress bar ── */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          {/* 戻る */}
          <button
            type="button"
            onClick={goBack}
            className={`flex items-center gap-1.5 text-xs tracking-wider text-[var(--color-text-secondary)]/50 hover:text-[var(--color-text-secondary)] transition-colors ${stepIdx === 0 ? "invisible pointer-events-none" : ""}`}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            戻る
          </button>
          {/* Step counter */}
          <span className="text-xs tracking-[0.2em] text-[var(--color-text-secondary)]/50 font-light">
            {stepIdx + 1}
            <span className="mx-1.5 text-[var(--color-brand-brown)]/20">/</span>
            {total}
          </span>
        </div>
        <div className="h-px bg-[var(--color-brand-brown)]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--color-brand-gold)] transition-all duration-500 ease-out"
            style={{ width: `${((stepIdx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Step content (animated) ── */}
      <div
        key={`${stepIdx}-${direction}`}
        style={{
          animation: `${direction === "forward" ? "stepInRight" : "stepInLeft"} 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
        }}
      >
        {/* Question heading */}
        <div className="mb-10">
          <p className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] leading-[1.6] whitespace-pre-line">
            {meta.question}
          </p>
          {meta.hint && (
            <p className="mt-2 text-xs tracking-wide text-[var(--color-text-secondary)]/50">{meta.hint}</p>
          )}
        </div>

        {/* Fields */}
        <div className="min-h-[200px] mb-12">
          <StepContent
            id={currentId}
            form={form}
            activeTab={activeTab}
            photoPreview={photoPreview}
            isLookingUp={isLookingUp}
            onPostalLookup={handlePostalLookup}
            onChangeTab={(tab) => {
              setActiveTab(tab);
              // Auto-advance after selection
              setTimeout(() => {
                setDirection("forward");
                setStepIdx((s) => Math.min(s + 1, total - 1));
              }, 380);
            }}
            onChange={handleChange}
            onPhoto={handlePhoto}
            onUpdateEdu={updateEdu}
            onAddEdu={addEdu}
            onRemoveEdu={removeEdu}
            onUpdateWork={updateWork}
            onAddWork={addWork}
            onRemoveWork={removeWork}
          />
        </div>

        {/* Actions */}
        {currentId !== "position" && (
          <div className="flex flex-col items-center gap-3">
            {currentId === "confirm" ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!valid || status === "submitting"}
                className="flex items-center justify-center gap-4 min-w-[260px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "送信中..." : "応募する"}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                  className="flex items-center justify-center gap-4 min-w-[260px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  次へ
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {isOptional && (
                  <button
                    type="button"
                    onClick={goNext}
                    className="text-xs tracking-wider text-[var(--color-text-secondary)]/40 hover:text-[var(--color-text-secondary)] transition-colors py-2"
                  >
                    スキップ →
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// StepContent – renders fields for each step
// ─────────────────────────────────────────────────────────────

type StepContentProps = {
  id: StepId;
  form: FormState;
  activeTab: string;
  photoPreview: string | null;
  isLookingUp: boolean;
  onChangeTab: (tab: string) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onPostalLookup: (digits: string) => void;
  onPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateEdu: (i: number, field: keyof Education, value: string) => void;
  onAddEdu: () => void;
  onRemoveEdu: (i: number) => void;
  onUpdateWork: (i: number, field: keyof WorkHistory, value: string | boolean) => void;
  onAddWork: () => void;
  onRemoveWork: (i: number) => void;
};

function StepContent({ id, form, activeTab, photoPreview, isLookingUp, onChangeTab, onChange, onPostalLookup, onPhoto, onUpdateEdu, onAddEdu, onRemoveEdu, onUpdateWork, onAddWork, onRemoveWork }: StepContentProps) {
  switch (id) {

    // ── 職種選択 ──
    case "position":
      return (
        <div className="flex flex-col gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`w-full py-4 px-6 text-left text-sm tracking-wider border transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-[var(--color-brand-gold)] text-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/5"
                  : "border-[var(--color-brand-brown)]/20 text-[var(--color-text-secondary)] hover:border-[var(--color-brand-gold)]/40 hover:text-[var(--color-brand-dark)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      );

    // ── 氏名 ──
    case "name":
      return (
        <div className="space-y-7">
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">氏名</p>
            <input type="text" name="name" value={form.name} onChange={onChange} placeholder="山田 花子" className={INPUT} autoFocus />
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">フリガナ</p>
            <input type="text" name="furigana" value={form.furigana} onChange={onChange} placeholder="ヤマダ ハナコ" className={INPUT} />
          </div>
        </div>
      );

    // ── 生年月日 ──
    case "birth":
      return (
        <div className="space-y-8">
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-4">生年月日</p>
            <div className="flex items-end gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <input type="number" name="birthYear" value={form.birthYear} onChange={onChange} placeholder="1995" min="1950" max="2010" className={`${INPUT} w-24 text-center`} autoFocus />
                <span className="text-xs text-[var(--color-text-secondary)]/50">年</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <input type="number" name="birthMonth" value={form.birthMonth} onChange={onChange} placeholder="4" min="1" max="12" className={`${INPUT} w-16 text-center`} />
                <span className="text-xs text-[var(--color-text-secondary)]/50">月</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <input type="number" name="birthDay" value={form.birthDay} onChange={onChange} placeholder="1" min="1" max="31" className={`${INPUT} w-16 text-center`} />
                <span className="text-xs text-[var(--color-text-secondary)]/50">日</span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-4">性別（任意）</p>
            <div className="flex gap-6">
              {["男性", "女性", "回答しない"].map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={onChange} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-brand-dark)]">{g}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      );

    // ── 連絡先 ──
    case "contact":
      return (
        <div className="space-y-7">
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">メールアドレス</p>
            <input type="email" name="email" value={form.email} onChange={onChange} placeholder="example@mail.com" className={INPUT} autoFocus />
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">電話番号</p>
            <input type="tel" name="phone" value={form.phone} onChange={onChange} placeholder="090-0000-0000" className={INPUT} />
          </div>
        </div>
      );

    // ── 住所 ──
    case "address":
      return (
        <div className="space-y-6">
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">郵便番号</p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={(e) => {
                  onChange(e);
                  const digits = e.target.value.replace(/[^0-9]/g, "");
                  if (digits.length === 7) onPostalLookup(digits);
                }}
                placeholder="000-0000"
                maxLength={8}
                className={`${INPUT} max-w-[160px]`}
                autoFocus
              />
              {isLookingUp && (
                <span className="text-xs text-[var(--color-brand-gold)] tracking-wider animate-pulse">
                  検索中…
                </span>
              )}
            </div>
            <p className="mt-1.5 text-xs text-[var(--color-text-secondary)]/40">7桁入力で自動入力されます</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">都道府県</p>
            <div className="relative">
              <select name="prefecture" value={form.prefecture} onChange={onChange} className={`${INPUT} appearance-none cursor-pointer`}>
                <option value="">選択してください</option>
                {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]/40">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">市区町村・番地</p>
            <input type="text" name="address" value={form.address} onChange={onChange} placeholder="中央区銀座1-1-1" className={INPUT} />
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">建物名・部屋番号（任意）</p>
            <input type="text" name="addressBuilding" value={form.addressBuilding} onChange={onChange} placeholder="○○ビル 101号室" className={INPUT} />
          </div>
        </div>
      );

    // ── 顔写真 ──
    case "photo":
      return (
        <div className="flex flex-col items-center gap-6">
          <div className="w-28 h-36 bg-[var(--color-brand-cream)] border border-[var(--color-brand-brown)]/15 flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="顔写真プレビュー" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] tracking-wider text-[var(--color-text-secondary)]/30">PHOTO</span>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <label className="cursor-pointer">
              <span className="inline-block px-6 py-2.5 border border-[var(--color-brand-brown)]/20 text-sm text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-cream)] transition-colors">
                {photoPreview ? "写真を変更する" : "ファイルを選択"}
              </span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} className="hidden" />
            </label>
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-2 px-6 py-2.5 border border-[var(--color-brand-brown)]/20 text-sm text-[var(--color-brand-dark)] hover:bg-[var(--color-brand-cream)] transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                カメラを起動
              </span>
              <input type="file" accept="image/*" capture="user" onChange={onPhoto} className="hidden" />
            </label>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]/40">JPG / PNG / WebP・5MB以内</p>
        </div>
      );

    // ── 学歴 ──
    case "education":
      return (
        <div className="space-y-6">
          {form.education.map((edu, i) => (
            <div key={i} className="pb-6 border-b border-[var(--color-brand-brown)]/10 last:border-0">
              {form.education.length > 1 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs tracking-wider text-[var(--color-brand-gold)]">{i + 1}校目</span>
                  <button type="button" onClick={() => onRemoveEdu(i)} className="text-xs text-[var(--color-text-secondary)]/40 hover:text-red-400 transition-colors">削除</button>
                </div>
              )}
              <div className="space-y-5">
                <input type="text" value={edu.schoolName} onChange={(e) => onUpdateEdu(i, "schoolName", e.target.value)} placeholder="学校名" className={INPUT} autoFocus={i === 0} />
                <input type="text" value={edu.department} onChange={(e) => onUpdateEdu(i, "department", e.target.value)} placeholder="学部・学科" className={INPUT} />
                <div className="flex items-end gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <input type="number" value={edu.graduationYear} onChange={(e) => onUpdateEdu(i, "graduationYear", e.target.value)} placeholder="2020" min="1970" max="2030" className={`${INPUT} w-24 text-center`} />
                    <span className="text-xs text-[var(--color-text-secondary)]/50">年</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <input type="number" value={edu.graduationMonth} onChange={(e) => onUpdateEdu(i, "graduationMonth", e.target.value)} placeholder="3" min="1" max="12" className={`${INPUT} w-16 text-center`} />
                    <span className="text-xs text-[var(--color-text-secondary)]/50">月卒業</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button type="button" onClick={onAddEdu} className="flex items-center gap-2 text-xs tracking-wider text-[var(--color-brand-gold)] hover:opacity-70 transition-opacity py-1">
            <span className="w-4 h-4 border border-[var(--color-brand-gold)] rounded-full flex items-center justify-center text-sm leading-none">+</span>
            学歴を追加
          </button>
        </div>
      );

    // ── 職歴 ──
    case "work":
      return (
        <div className="space-y-6">
          {form.workHistory.map((work, i) => (
            <div key={i} className="pb-6 border-b border-[var(--color-brand-brown)]/10 last:border-0">
              {form.workHistory.length > 1 && (
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs tracking-wider text-[var(--color-brand-gold)]">{i + 1}社目</span>
                  <button type="button" onClick={() => onRemoveWork(i)} className="text-xs text-[var(--color-text-secondary)]/40 hover:text-red-400 transition-colors">削除</button>
                </div>
              )}
              <div className="space-y-5">
                <input type="text" value={work.companyName} onChange={(e) => onUpdateWork(i, "companyName", e.target.value)} placeholder="会社名" className={INPUT} autoFocus={i === 0} />
                <input type="text" value={work.jobTitle} onChange={(e) => onUpdateWork(i, "jobTitle", e.target.value)} placeholder="職種・役職" className={INPUT} />
                <div className="flex items-center gap-3 flex-wrap">
                  <input type="month" value={work.periodFrom} onChange={(e) => onUpdateWork(i, "periodFrom", e.target.value)} className={`${INPUT} w-40`} />
                  <span className="text-sm text-[var(--color-text-secondary)]/50">〜</span>
                  {work.isCurrent ? (
                    <span className="text-sm text-[var(--color-brand-gold)] tracking-wider">現在</span>
                  ) : (
                    <input type="month" value={work.periodTo} onChange={(e) => onUpdateWork(i, "periodTo", e.target.value)} className={`${INPUT} w-40`} />
                  )}
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={work.isCurrent} onChange={(e) => onUpdateWork(i, "isCurrent", e.target.checked)} className="w-3.5 h-3.5 accent-[var(--color-brand-gold)]" />
                    <span className="text-xs text-[var(--color-text-secondary)]">現在在籍中</span>
                  </label>
                </div>
                <textarea value={work.description} onChange={(e) => onUpdateWork(i, "description", e.target.value)} rows={3} placeholder="業務内容" className={TEXTAREA} />
              </div>
            </div>
          ))}
          <button type="button" onClick={onAddWork} className="flex items-center gap-2 text-xs tracking-wider text-[var(--color-brand-gold)] hover:opacity-70 transition-opacity py-1">
            <span className="w-4 h-4 border border-[var(--color-brand-gold)] rounded-full flex items-center justify-center text-sm leading-none">+</span>
            職歴を追加
          </button>
        </div>
      );

    // ── 資格・免許 ──
    case "qualifications":
      return (
        <textarea
          name="qualifications" value={form.qualifications} onChange={onChange}
          rows={5} placeholder={"看護師免許（取得: 2020年3月）\n普通自動車免許\nなど"}
          className={TEXTAREA} autoFocus
        />
      );

    // ── 志望動機 ──
    case "motivation":
      return (
        <>
          <textarea
            name="motivation" value={form.motivation} onChange={onChange}
            rows={7} placeholder="当院を志望する理由や、どのように貢献したいかをご記載ください"
            className={TEXTAREA} autoFocus
          />
          <p className={`mt-2 text-xs transition-colors ${form.motivation.length < 20 && form.motivation.length > 0 ? "text-red-400" : "text-[var(--color-text-secondary)]/40"}`}>
            {form.motivation.length} 文字（20文字以上）
          </p>
        </>
      );

    // ── 自己PR ──
    case "selfpr":
      return (
        <textarea
          name="selfPr" value={form.selfPr} onChange={onChange}
          rows={6} placeholder="強み・経験・スキルなど自由にご記載ください"
          className={TEXTAREA} autoFocus
        />
      );

    // ── 希望条件 ──
    case "conditions":
      return (
        <div className="space-y-8">
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-4">希望勤務形態</p>
            <div className="flex flex-col gap-4">
              {["正社員", "契約社員", "パート・アルバイト", "どちらでも可"].map((ws) => (
                <label key={ws} className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="workStyle" value={ws} checked={form.workStyle === ws} onChange={onChange} className="w-4 h-4 accent-[var(--color-brand-gold)]" />
                  <span className="text-sm text-[var(--color-brand-dark)] group-hover:text-[var(--color-brand-gold)] transition-colors">{ws}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 mb-3">希望給与・その他（任意）</p>
            <textarea name="desiredSalary" value={form.desiredSalary} onChange={onChange} rows={2} placeholder="例: 月給〇〇万円以上、週3日〜可、時短勤務希望など" className={TEXTAREA} />
          </div>
        </div>
      );

    // ── ポートフォリオ ──
    case "portfolio":
      return (
        <>
          <input
            type="url" name="portfolioUrl" value={form.portfolioUrl} onChange={onChange}
            placeholder="https://..." className={INPUT} autoFocus
          />
          <p className="mt-3 text-xs text-[var(--color-text-secondary)]/40 leading-relaxed">
            Google Drive, Dropbox, YouTube等の限定公開リンクなどをご記載ください。
          </p>
        </>
      );

    // ── 確認・送信 ──
    case "confirm":
      return (
        <div className="space-y-5">
          <div className="space-y-3">
            <SummaryRow label="応募職種" value={TABS.find((t) => t.id === activeTab)?.label ?? ""} />
            <SummaryRow label="氏名" value={`${form.name}（${form.furigana}）`} />
            {form.birthYear && <SummaryRow label="生年月日" value={`${form.birthYear}年${form.birthMonth}月${form.birthDay}日`} />}
            {form.gender && <SummaryRow label="性別" value={form.gender} />}
            <SummaryRow label="メール" value={form.email} />
            <SummaryRow label="電話" value={form.phone} />
            <SummaryRow label="住所" value={[form.prefecture, form.address, form.addressBuilding].filter(Boolean).join(" ")} />
            {form.motivation && <SummaryRow label="志望動機" value={form.motivation.slice(0, 50) + (form.motivation.length > 50 ? "…" : "")} />}
          </div>
          <div className="pt-5 border-t border-[var(--color-brand-brown)]/10">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="agreed" checked={form.agreed} onChange={onChange} className="w-4 h-4 mt-0.5 accent-[var(--color-brand-gold)] shrink-0" />
              <span className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-brand-gold)] transition-colors">プライバシーポリシー</a>
                に同意して応募する
              </span>
            </label>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-4">
      <span className="text-xs tracking-wider text-[var(--color-text-secondary)]/50 w-20 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-[var(--color-brand-dark)] leading-relaxed flex-1 break-all">{value}</span>
    </div>
  );
}
