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
