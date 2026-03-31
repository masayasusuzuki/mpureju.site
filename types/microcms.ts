// microCMS スキーマ型定義

export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

/** microCMS campaigns スキーマ */
export interface Campaign {
  id: string;
  title: string;
  image: MicroCMSImage;
  link_url?: string;
  start_at: string;
  is_active: boolean;
}

/** microCMS news スキーマ */
export interface News {
  id: string;
  title: string;
  slug: string;
  category: string[] | string;
  thumbnail?: MicroCMSImage;
  description?: string;
  published_at: string;
}

/** microCMS team_photos スキーマ */
export interface TeamPhoto {
  id: string;
  photo: MicroCMSImage;
}

/** microCMS media スキーマ */
export interface Media {
  id: string;
  platform: ("Instagram" | "YouTube")[] | "Instagram" | "YouTube";
  url: string;
  thumbnail?: MicroCMSImage;
  title?: string;
}

/** microCMS staff_blog スキーマ */
export interface StaffBlog {
  id: string;
  title: string;
  slug: string;
  thumbnail: MicroCMSImage;
  body: string;
  category: string[];
  published_at: string;
}

/** microCMS machines スキーマ */
export interface Machine {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  thumbnail: MicroCMSImage;
  type: string;
  catch_copy: string;
  target_concerns?: string;
  description: string;
  sort_order?: number;
}

/** microCMS medicines スキーマ */
export interface Medicine {
  id: string;
  name: string;
  slug: string;
  category: string | string[];
  thumbnail?: MicroCMSImage;
  catch_copy: string;
  description: string;
  usage: string;
  side_effects: string;
  contraindications: string;
  sort_order?: number;
}

/** microCMS columns スキーマ */
export type ColumnCategory =
  | "施術ガイド"
  | "肌悩み・ケア"
  | "美容アイテム"
  | "美容知識"
  | "ライフスタイル";

export interface Column {
  id: string;
  title: string;
  slug: string;
  category: ColumnCategory[]; // 複数選択可
  thumbnail?: MicroCMSImage;
  images?: MicroCMSImage[]; // サムネ以外の記事画像（複数）
  tags?: string; // カンマ区切りテキスト（例: "ミラノリピール,ケミカルピーリング"）
  content: string; // Markdownテキスト（microCMSフィールドタイプ: テキストエリア）
  instagram_url?: string; // 元リール投稿URL（任意）
  published_at: string;
}

/** microCMS clinic_calendar スキーマ（オブジェクト形式） */
export interface ClinicCalendar {
  regular_holidays: string[];
  extra_holidays?: string;
  cancel_holidays?: string;
}

