"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  /** 遅延（秒）。複数要素を時差で出したいときに使う */
  delay?: number;
  /** 下からの距離（px）。ビューポートに入ったと判定するマージン */
  margin?: string;
}

export function ScrollFadeIn({ children, className, delay = 0, margin = "-60px" }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
