"use client";

import { useState } from "react";
import Link from "next/link";

type View = "menu" | "chat" | "photo";

const PILLAR_LINKS = [
  { label: "目元", href: "/eye/" },
  { label: "鼻", href: "/nose/" },
  { label: "口元", href: "/mouth/" },
  { label: "リフトアップ", href: "/lift/" },
  { label: "美容皮膚科", href: "/skin/" },
];

const WINDOW_BASE = "fixed z-[60] right-4 bottom-20 lg:right-8 lg:bottom-24 w-[calc(100vw-2rem)] max-w-[520px] flex flex-col bg-white rounded-2xl shadow-2xl border border-[var(--color-brand-brown)]/10 overflow-hidden";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>("menu");

  const handleClose = () => {
    setIsOpen(false);
    setView("menu");
  };

  return (
    <>
      {/* ══════ ウェルカムカード（高さ auto） ══════ */}
      {isOpen && view === "menu" && (
        <div className={WINDOW_BASE}>
          <div className="px-4 pt-4 pb-1 flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--color-brand-dark)] tracking-wide">AIサポート</p>
            <button
              onClick={handleClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--color-brand-cream)] transition-colors text-[var(--color-brand-brown)]/40"
              aria-label="閉じる"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-2">
            <button
              onClick={() => setView("chat")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-brand-cream)]/50 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <span className="text-sm text-[var(--color-brand-dark)]">テキストで相談する</span>
            </button>
            <button
              onClick={() => setView("photo")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-brand-cream)]/50 transition-colors text-left"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
              <span className="text-sm text-[var(--color-brand-dark)]">写真でおすすめ診断</span>
            </button>
            <Link
              href="/column/faq/"
              onClick={handleClose}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--color-brand-cream)]/50 transition-colors"
            >
              <svg className="w-5 h-5 text-[var(--color-brand-gold)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
              </svg>
              <span className="text-sm text-[var(--color-brand-dark)]">よくある質問</span>
            </Link>
          </div>
        </div>
      )}

      {/* ══════ チャット画面（高さ固定） ══════ */}
      {isOpen && view === "chat" && (
        <div className={`${WINDOW_BASE} h-[min(600px,calc(100dvh-8rem))]`}>
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-brand-dark)] text-white shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("menu")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="メニューに戻る"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <p className="text-sm font-medium tracking-wide">AIサポート</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[var(--color-brand-cream)]/30">
            <div className="flex gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-brand-gold)] flex items-center justify-center mt-1">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-5 py-3.5 text-sm text-[var(--color-brand-dark)] leading-relaxed shadow-sm max-w-[80%]">
                こんにちは！施術や料金について、お気軽にご質問ください。
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-11">
              {["施術について相談したい", "料金を知りたい", "ダウンタイムが気になる", "予約方法を教えて"].map((label) => (
                <button
                  key={label}
                  className="text-xs px-3.5 py-2 rounded-full border border-[var(--color-brand-gold)]/30 text-[var(--color-brand-dark)]/70 bg-white"
                  disabled
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-2.5 bg-[var(--color-brand-cream)] text-center shrink-0">
            <p className="text-xs text-[var(--color-brand-brown)]/60">現在準備中です。もうしばらくお待ちください。</p>
          </div>

          <div className="border-t border-[var(--color-brand-brown)]/10 p-4 bg-white shrink-0">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="準備中..."
                className="flex-1 text-sm px-4 py-2.5 rounded-full bg-[var(--color-brand-cream)]/50 border border-[var(--color-brand-brown)]/10 focus:outline-none placeholder:text-[var(--color-brand-brown)]/30 opacity-50"
                disabled
              />
              <button
                className="shrink-0 w-10 h-10 rounded-full bg-[var(--color-brand-gold)] flex items-center justify-center text-white disabled:opacity-40"
                disabled
                aria-label="送信"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════ 写真診断画面（高さ auto） ══════ */}
      {isOpen && view === "photo" && (
        <div className={WINDOW_BASE}>
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-brand-dark)] text-white shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView("menu")}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
                aria-label="メニューに戻る"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              <p className="text-sm font-medium tracking-wide">写真でおすすめ診断</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="閉じる"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-5 pt-5 pb-3">
            <p className="text-sm text-[var(--color-brand-dark)] leading-relaxed">
              気になる部位の写真をアップロードしてください。AIがお悩みを分析し、おすすめの施術をご提案します。
            </p>
            <p className="text-[11px] text-[var(--color-brand-brown)]/50 mt-2 leading-relaxed">
              ※ 本機能は医療診断ではありません。参考情報としてご利用ください。
            </p>
          </div>

          <div className="px-5 pb-4">
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-[var(--color-brand-gold)]/30 rounded-xl bg-[var(--color-brand-cream)]/30 cursor-not-allowed opacity-60">
              <svg className="w-10 h-10 text-[var(--color-brand-gold)]/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
              <p className="text-sm text-[var(--color-brand-dark)]/50 font-medium">写真をアップロード</p>
              <p className="text-[11px] text-[var(--color-brand-brown)]/40 mt-1">JPG, PNG（最大10MB）</p>
              <input type="file" accept="image/*" className="hidden" disabled />
            </label>
          </div>

          {/* お悩みテキスト入力 */}
          <div className="px-5 pb-4">
            <label className="text-xs text-[var(--color-brand-brown)]/50 block mb-2">お悩みを入力（任意）</label>
            <textarea
              placeholder="例：頬のたるみが気になる、目の下のクマを改善したい..."
              className="w-full text-sm px-4 py-3 rounded-xl bg-[var(--color-brand-cream)]/30 border border-[var(--color-brand-brown)]/10 focus:outline-none focus:border-[var(--color-brand-gold)]/40 placeholder:text-[var(--color-brand-brown)]/30 resize-none opacity-50"
              rows={3}
              disabled
            />
          </div>

          {/* お悩みタグ */}
          <div className="px-5 pb-4">
            <p className="text-xs text-[var(--color-brand-brown)]/50 mb-2.5">または、お悩みから選ぶ</p>
            <div className="flex flex-wrap gap-2">
              {["シミ・くすみ", "たるみ", "シワ", "毛穴", "ニキビ", "クマ", "二重", "鼻の形", "口元"].map((concern) => (
                <button
                  key={concern}
                  disabled
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-brand-gold)]/25 text-[var(--color-brand-dark)]/60 bg-white cursor-not-allowed"
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          {/* 送信ボタン + 準備中 */}
          <div className="px-5 pb-4">
            <button
              disabled
              className="w-full py-3 rounded-full bg-[var(--color-brand-gold)] text-white text-sm font-medium tracking-wide disabled:opacity-40"
            >
              AIに診断してもらう
            </button>
            <p className="text-[11px] text-[var(--color-brand-brown)]/50 text-center mt-2">
              現在準備中です。もうしばらくお待ちください。
            </p>
          </div>
        </div>
      )}

      {/* ── フローティングボタン ── */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`fixed z-[60] bottom-20 right-4 lg:bottom-8 lg:right-8 shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "w-14 h-14 rounded-full bg-[var(--color-brand-dark)]"
            : "gap-2 px-5 h-14 rounded-full bg-[var(--color-brand-gold)] hover:scale-105"
        }`}
        aria-label={isOpen ? "チャットを閉じる" : "チャットを開く"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <>
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
            </svg>
            <span className="text-white text-xs font-medium tracking-wide">AIサポートに質問する</span>
          </>
        )}
      </button>
    </>
  );
}
