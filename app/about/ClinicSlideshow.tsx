"use client";

import { useState, useEffect } from "react";

const IMAGES = [
  { src: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/a012ed402444491aa610eab6cb2da366/01.jpg?w=1360&fit=crop&crop=entropy&auto=compress", alt: "クリニック内観 01" },
  { src: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/2add2ba2f37b45e68e313abe04447c95/02.jpg?w=1360&fit=crop&crop=entropy&auto=compress", alt: "クリニック内観 02" },
  { src: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/d226e3b24072400a96e86c858bc4dd57/03.jpg?w=1360&fit=crop&crop=entropy&auto=compress", alt: "クリニック内観 03" },
  { src: "https://images.microcms-assets.io/assets/e0edb1da60cb4aca82ba53064009bd74/dbeec0fb36d7477f85fcb8a0f76aa3da/04.jpg?w=1360&fit=crop&crop=entropy&auto=compress", alt: "クリニック内観 04" },
];

const INTERVAL = 4000;
const FADE_DURATION = 800;

export function ClinicSlideshow() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        setFading(false);
      }, FADE_DURATION);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full aspect-video overflow-hidden bg-[var(--color-brand-dark)]/5">
      {IMAGES.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className="absolute inset-0 w-full h-full object-cover transition-opacity"
          style={{
            opacity: i === current ? (fading ? 0 : 1) : 0,
            transitionDuration: `${FADE_DURATION}ms`,
          }}
        />
      ))}
      {/* ドットインジケーター */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(false); setCurrent(i); }}
            aria-label={`内観写真 ${i + 1}`}
            className="w-1.5 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i === current ? "var(--color-brand-gold)" : "rgba(255,255,255,0.5)",
              transform: i === current ? "scale(1.4)" : "scale(1)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
