"use client";

import { useRef, useEffect } from "react";
import { marked } from "marked";

interface Props {
  markdown: string;
  className?: string;
}

export function MarkdownContent({ markdown, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const html = marked(markdown) as string;

  useEffect(() => {
    if (!ref.current) return;
    // h2 に toc-N の id を付与
    const h2s = ref.current.querySelectorAll("h2");
    h2s.forEach((el, i) => {
      el.id = `toc-${i}`;
    });
  }, [html]);

  useEffect(() => {
    if (!ref.current) return;
    const tables = ref.current.querySelectorAll("table");
    tables.forEach((table) => {
      if (table.parentElement?.classList.contains("table-scroll-wrapper")) return;

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
