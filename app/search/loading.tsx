export default function SearchLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-brand-white)]">
      <style>{`
        @keyframes sl-swing {
          0%   { transform: rotate(-22deg) translateY(0px); }
          25%  { transform: rotate(0deg)   translateY(-6px); }
          50%  { transform: rotate(22deg)  translateY(0px); }
          75%  { transform: rotate(0deg)   translateY(-6px); }
          100% { transform: rotate(-22deg) translateY(0px); }
        }
        @keyframes sl-scan {
          0%   { transform: translateY(-9px); opacity: 0; }
          15%  { opacity: 0.7; }
          85%  { opacity: 0.7; }
          100% { transform: translateY(9px);  opacity: 0; }
        }
        @keyframes sl-dot {
          0%, 60%, 100% { opacity: 0.2; transform: translateY(0); }
          30%            { opacity: 1;   transform: translateY(-5px); }
        }
        @keyframes sl-ring {
          0%   { transform: scale(0.85); opacity: 0.5; }
          60%  { transform: scale(1.2);  opacity: 0; }
          100% { transform: scale(1.2);  opacity: 0; }
        }
      `}</style>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-24 h-24 rounded-full border border-[var(--color-brand-gold)]/30"
          style={{ animation: "sl-ring 2s ease-out infinite" }} />
        <div className="absolute w-24 h-24 rounded-full border border-[var(--color-brand-gold)]/20"
          style={{ animation: "sl-ring 2s ease-out infinite", animationDelay: "0.6s" }} />
        <div style={{ animation: "sl-swing 1.6s ease-in-out infinite", transformOrigin: "75% 75%" }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" stroke="var(--color-brand-gold)" strokeWidth="1.4" />
            <line x1="5.5" y1="11" x2="16.5" y2="11"
              stroke="var(--color-brand-gold)" strokeWidth="1" strokeOpacity="0.45"
              style={{ animation: "sl-scan 1.6s ease-in-out infinite" }} />
            <path d="M21 21l-4.35-4.35" stroke="var(--color-brand-gold)" strokeWidth="1.4" />
          </svg>
        </div>
      </div>

      <p className="font-serif text-base tracking-[0.2em] text-[var(--color-brand-dark)] mb-3">
        検索しています
      </p>
      <div className="flex items-center gap-1.5">
        {[0, 0.18, 0.36].map((delay, i) => (
          <span
            key={i}
            className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-brand-gold)]"
            style={{ animation: "sl-dot 1.2s ease-in-out infinite", animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
