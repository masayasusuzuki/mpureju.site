-- instagram_posts に取得処理実行日列を追加
ALTER TABLE instagram_posts ADD COLUMN IF NOT EXISTS fetched_at TIMESTAMPTZ DEFAULT now();
