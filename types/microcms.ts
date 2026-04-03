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

/** microCMS blog スキーマ */
export interface Blog {
  id: string;
  title: string;
  slug: string;
  thumbnail: MicroCMSImage;
  images?: MicroCMSImage[];
  body: string;
  category: string[];
  tags?: string;
  author?: string;
  instagram_url?: string;
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

/** microCMS cases スキーマ */
export type CasePillar = "口元" | "目元" | "鼻" | "リフトアップ" | "美容皮膚科";

export interface Case {
  id: string;
  title: string;
  slug: string;
  pillar: CasePillar[]; // 複数選択可
  treatment_label: string; // カンマ区切り（例: "糸リフト,サーマジェン"）
  timing?: string; // 経過タイミング（例: "1週間後"）。任意
  concern: string; // カンマ区切り（例: "口元の突出感,人中の長さ"）
  risks: string; // リスク・副作用（医療広告GL必須）
  tags?: string; // カンマ区切り。検索用
  thumbnail: MicroCMSImage;
  images?: MicroCMSImage[]; // サムネ以外の解説画像
  content: string; // Markdown（テキストエリア）
  instagram_url?: string;
  published_at: string;
}


