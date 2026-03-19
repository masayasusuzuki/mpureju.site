"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

const TABS = [
  { id: "nurse", label: "看護師" },
  { id: "receptionist", label: "受付カウンセラー" },
  { id: "pr-creator", label: "広報 / SNSクリエイター" },
];

type FormState = {
  name: string;
  furigana: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  resume: File | null;
  cv: File | null;
  agreed: boolean;
};

const INITIAL: FormState = {
  name: "",
  furigana: "",
  email: "",
  phone: "",
  portfolioUrl: "",
  resume: null,
  cv: null,
  agreed: false,
};

export function EntryForm() {
  const searchParams = useSearchParams();
  const positionParam = searchParams.get("position") ?? "";
  const initialTab = TABS.find((t) => t.id === positionParam)?.id ?? TABS[0].id;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files?.[0] ?? null,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // TODO: Supabase 接続時に実装
    // position は activeTab から取得: TABS.find(t => t.id === activeTab)?.label
    await new Promise((r) => setTimeout(r, 800));
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="py-16 text-center">
        <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
          THANK YOU
        </p>
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

  return (
    <div>
      {/* タブ */}
      <div className="flex border-b border-[var(--color-brand-brown)]/15 mb-10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 text-sm tracking-wider transition-colors relative ${
              activeTab === tab.id
                ? "text-[var(--color-brand-gold)] font-medium"
                : "text-[var(--color-text-secondary)]/60 hover:text-[var(--color-text-secondary)]"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-brand-gold)]" />
            )}
          </button>
        ))}
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* 氏名 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            氏名
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-white border-b border-[var(--color-brand-brown)]/30 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors"
          />
        </div>

        {/* フリガナ */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            フリガナ
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="text"
            name="furigana"
            value={form.furigana}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-white border-b border-[var(--color-brand-brown)]/30 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors"
          />
        </div>

        {/* メールアドレス */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            メールアドレス
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-white border-b border-[var(--color-brand-brown)]/30 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors"
          />
        </div>

        {/* 電話番号 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            電話番号
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-white border-b border-[var(--color-brand-brown)]/30 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] transition-colors"
          />
        </div>

        {/* 履歴書 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            履歴書添付
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="file"
            name="resume"
            onChange={handleFile}
            required
            accept=".pdf,.doc,.docx"
            className="text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--color-brand-brown)]/20 file:text-sm file:bg-white file:text-[var(--color-brand-dark)] file:cursor-pointer hover:file:bg-[var(--color-brand-cream)] file:transition-colors"
          />
        </div>

        {/* 職務経歴書 */}
        <div>
          <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
            職務経歴書添付
            <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
              必須
            </span>
          </label>
          <input
            type="file"
            name="cv"
            onChange={handleFile}
            required
            accept=".pdf,.doc,.docx"
            className="text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:border file:border-[var(--color-brand-brown)]/20 file:text-sm file:bg-white file:text-[var(--color-brand-dark)] file:cursor-pointer hover:file:bg-[var(--color-brand-cream)] file:transition-colors"
          />
        </div>

        {/* ポートフォリオURL（広報/SNSクリエイターのみ） */}
        {activeTab === "pr-creator" && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-brand-dark)] mb-2">
              ポートフォリオURL
              <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-sm align-middle">
                必須
              </span>
            </label>
            <input
              type="url"
              name="portfolioUrl"
              value={form.portfolioUrl}
              onChange={handleChange}
              required
              placeholder="https://drive.google.com/..."
              className="w-full px-4 py-3 text-sm bg-white border-b border-[var(--color-brand-brown)]/30 focus:border-[var(--color-brand-gold)] focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
            />
            <p className="mt-2 text-xs text-[var(--color-text-secondary)]/60 leading-relaxed">
              ポートフォリオまたは実績動画の外部ストレージ（Google Drive, Dropbox, YouTube等の限定公開リンクなど）のURLをご記載ください。
            </p>
          </div>
        )}

        {/* 同意チェック */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <input
            type="checkbox"
            name="agreed"
            id="entry-agreed"
            checked={form.agreed}
            onChange={handleChange}
            required
            className="w-4 h-4 accent-[var(--color-brand-gold)] shrink-0"
          />
          <label htmlFor="entry-agreed" className="text-xs text-[var(--color-text-secondary)] cursor-pointer">
            <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-brand-gold)] transition-colors">
              利用規約
            </a>
            ・
            <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-brand-gold)] transition-colors">
              プライバシーポリシー
            </a>
            に同意する
          </label>
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={status === "submitting" || !form.agreed}
            className="flex items-center justify-center gap-4 min-w-[280px] py-4 bg-[var(--color-brand-dark)] text-white text-sm tracking-widest rounded-full hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "送信中..." : "送信する"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
