-- instagram_posts にスキップ理由列を追加
ALTER TABLE instagram_posts ADD COLUMN IF NOT EXISTS skip_reason TEXT;

-- 既存スキップ投稿に理由を付与

-- 動画のみ（画像なし）
UPDATE instagram_posts SET skip_reason = '動画のみ'
WHERE shortcode IN ('DWD19eLExzj', 'DWYhQySkzIz', 'DWGjAmLk3Yp', 'DV256CGEhDn', 'DWa7qcHku-4', 'DWTREVbEjuY', 'DV-poW_krP2')
AND status = 'skipped';

-- DLエラー
UPDATE instagram_posts SET skip_reason = 'DLエラー'
WHERE shortcode = 'DWBdwC0E5zt'
AND status = 'skipped';

-- キャンペーン告知
UPDATE instagram_posts SET skip_reason = 'キャンペーン告知'
WHERE shortcode IN ('DWirn3okgwo', 'DVV09uukkkp')
AND status = 'skipped';

-- 予約開始告知
UPDATE instagram_posts SET skip_reason = '予約開始告知'
WHERE shortcode = 'DWkeEPqkjdW'
AND status = 'skipped';

-- classification に 'news' を追加
ALTER TABLE instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_classification_check;
ALTER TABLE instagram_posts ADD CONSTRAINT instagram_posts_classification_check
  CHECK (classification IN ('column', 'case', 'news', 'skip'));
