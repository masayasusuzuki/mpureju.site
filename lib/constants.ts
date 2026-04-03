import type { Pillar } from "@/lib/microcms/types";

/** サイト全体で使用するクリニック定数 — SSOT */

export const CLINIC = {
  name: "Maison PUREJU",
  reservationUrl:
    "https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d",
  lineUrl: "https://lin.ee/maisonpureju",
  phone: "03-3289-1222",
  phoneTel: "tel:0332891222",
  postal: "〒104-0061",
  address: "東京都中央区銀座５丁目３−１３",
  building: "Ginza SS 85ビル 4F",
  hours: "10:00〜19:00",
  closedDay: "月曜・不定休",
  googleMapsUrl:
    "https://www.google.com/maps?ll=35.671645,139.76263&z=16&t=m&hl=ja&gl=JP&mapclient=embed&cid=11387186794925088261",
} as const;

export const PILLARS: readonly { id: Pillar; label: string; path: string }[] = [
  { id: "mouth", label: "口元", path: "/mouth" },
  { id: "eye", label: "目元", path: "/eye" },
  { id: "nose", label: "鼻", path: "/nose" },
  { id: "lift", label: "リフトアップ", path: "/lift" },
  { id: "skin", label: "美容皮膚科", path: "/skin" },
];

/** ピラー id→label/path の逆引きマップ */
export const PILLAR_MAP = Object.fromEntries(
  PILLARS.map((p) => [p.id, p])
) as Record<Pillar, (typeof PILLARS)[number]>;

/** ピラー label→id の逆引きマップ（CMS の日本語ラベルから id を引く） */
export const PILLAR_BY_LABEL = Object.fromEntries(
  PILLARS.map((p) => [p.label, p])
) as Record<string, (typeof PILLARS)[number]>;
