"use client";

/**
 * microCMS リッチエディタの HTML を表示するコンポーネント。
 * <table> を検出したら横スクロール可能なラッパーで囲む。
 */

import { useRef, useEffect } from "react";

interface Props {
  html: string;
  className?: string;
}

export function RichContent({ html, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const tables = ref.current.querySelectorAll("table");
    tables.forEach((table) => {
      // 既にラッパーがあればスキップ
      if (table.parentElement?.classList.contains("table-scroll-wrapper")) return;

      // モバイルカード表示用: 各 td に対応する th テキストを data-label として付与
      const headers = Array.from(table.querySelectorAll("thead th, tr:first-child th"));
      if (headers.length > 0) {
        const labels = headers.map((th) => th.textContent?.trim() ?? "");
        table.querySelectorAll("tbody tr, tr:not(:first-child)").forEach((row) => {
          row.querySelectorAll("td").forEach((td, i) => {
            if (labels[i]) td.setAttribute("data-label", labels[i]);
          });
        });
      }

      const wrapper = document.createElement("div");
      wrapper.className = "table-scroll-wrapper";
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }, [html]);

  return (
    <div
      ref={ref}
      className={`rich-content ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
