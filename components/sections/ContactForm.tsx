"use client";

import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  agreed: boolean;
};

const INITIAL: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  agreed: false,
};

export function ContactForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // TODO: Phase 1 Supabase 接続時に実装
    // const { error } = await supabase.from("inquiries").insert({ ... });
    await new Promise((r) => setTimeout(r, 800)); // 仮の遅延
    setStatus("done");
  }

  if (status === "done") {
    return (
      <div className="py-16 text-center">
        <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
          THANK YOU
        </p>
        <h2 className="font-serif text-2xl text-[var(--color-brand-dark)] mb-4 leading-relaxed">
          お問い合わせを受け付けました
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          内容を確認の上、担当者よりご連絡いたします。<br />
          通常2〜3営業日以内にご返信いたします。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* お名前 */}
      <div>
        <label className="block text-xs tracking-wider text-[var(--color-text-secondary)] mb-2">
          お名前
          <span className="ml-2 text-[var(--color-brand-gold)]">*</span>
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="山田 花子"
          className="w-full px-4 py-3 text-sm bg-white border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/60 focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
        />
      </div>

      {/* メールアドレス */}
      <div>
        <label className="block text-xs tracking-wider text-[var(--color-text-secondary)] mb-2">
          メールアドレス
          <span className="ml-2 text-[var(--color-brand-gold)]">*</span>
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="example@email.com"
          className="w-full px-4 py-3 text-sm bg-white border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/60 focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
        />
      </div>

      {/* 電話番号 */}
      <div>
        <label className="block text-xs tracking-wider text-[var(--color-text-secondary)] mb-2">
          電話番号
          <span className="ml-2 text-[var(--color-text-secondary)]/40 text-[10px]">任意</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="03-0000-0000"
          className="w-full px-4 py-3 text-sm bg-white border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/60 focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
        />
      </div>

      {/* 件名 */}
      <div>
        <label className="block text-xs tracking-wider text-[var(--color-text-secondary)] mb-2">
          件名
          <span className="ml-2 text-[var(--color-brand-gold)]">*</span>
        </label>
        <input
          type="text"
          name="subject"
          value={form.subject}
          onChange={handleChange}
          required
          placeholder="施術についてのご相談"
          className="w-full px-4 py-3 text-sm bg-white border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/60 focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors"
        />
      </div>

      {/* お問い合わせ内容 */}
      <div>
        <label className="block text-xs tracking-wider text-[var(--color-text-secondary)] mb-2">
          お問い合わせ内容
          <span className="ml-2 text-[var(--color-brand-gold)]">*</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={6}
          placeholder="ご質問・ご相談内容をご記入ください"
          className="w-full px-4 py-3 text-sm bg-white border border-[var(--color-brand-brown)]/20 focus:border-[var(--color-brand-gold)]/60 focus:outline-none text-[var(--color-brand-dark)] placeholder:text-[var(--color-text-secondary)]/40 transition-colors resize-none"
        />
      </div>

      {/* プライバシーポリシー同意 */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          name="agreed"
          id="agreed"
          checked={form.agreed}
          onChange={handleChange}
          required
          className="mt-0.5 w-4 h-4 accent-[var(--color-brand-gold)] shrink-0"
        />
        <label htmlFor="agreed" className="text-xs text-[var(--color-text-secondary)] leading-relaxed cursor-pointer">
          <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--color-brand-gold)] transition-colors">
            プライバシーポリシー
          </a>
          に同意の上、送信してください
          <span className="ml-2 text-[var(--color-brand-gold)]">*</span>
        </label>
      </div>

      {/* 送信ボタン */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "submitting" || !form.agreed}
          className="px-12 py-4 bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] text-sm tracking-widest font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? "送信中..." : "送信する"}
        </button>
      </div>
    </form>
  );
}
