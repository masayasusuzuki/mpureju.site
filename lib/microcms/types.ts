import type { MicroCMSImage, MicroCMSListContent } from "microcms-js-sdk";

export type Pillar = "mouth" | "eye" | "nose" | "lift" | "skin";

export type Treatment = {
  title: string;
  slug: string;
  pillar: [Pillar];
  catch_copy: string;
  description: string;
  recommended_for: string;
  procedure_flow: string;
  doctor_comment: string;
  hero_image: MicroCMSImage;
  risks: string;
  downtime_min_days: number;
  downtime_max_days: number;
} & MicroCMSListContent;
