// microCMS スキーマ型定義

export interface MicroCMSImage {
  url: string;
  width: number;
  height: number;
}

export interface Media {
  id: string;
  title: string;
  url: string;
  thumbnail?: MicroCMSImage;
  published_at: string;
}
