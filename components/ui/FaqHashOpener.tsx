"use client";

import { useEffect } from "react";

export function FaqHashOpener() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash.startsWith("faq-")) return;

    const el = document.getElementById(hash);
    if (!el) return;

    // details要素を開く
    if (el.tagName === "DETAILS") {
      (el as HTMLDetailsElement).open = true;
    }

    // スクロール（ヘッダー分オフセット）
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    }, 100);
  }, []);

  return null;
}
