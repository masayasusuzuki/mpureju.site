-- スタッフブログ Instagram投稿データ投入
-- source: 'staff' / classification: 'staff_blog'
-- 27件（フォルダ001〜027 019欠番=26件 + フォルダなし1件）

-- CHECK制約を更新: source に 'staff'、classification に 'staff_blog' を追加
ALTER TABLE instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_source_check;
ALTER TABLE instagram_posts ADD CONSTRAINT instagram_posts_source_check
  CHECK (source IN ('clinic', 'doctor', 'staff'));

ALTER TABLE instagram_posts DROP CONSTRAINT IF EXISTS instagram_posts_classification_check;
ALTER TABLE instagram_posts ADD CONSTRAINT instagram_posts_classification_check
  CHECK (classification IN ('column', 'case', 'news', 'staff_blog', 'skip'));

INSERT INTO instagram_posts (url, shortcode, source, caption, classification, status)
VALUES
  -- 001〜010
  ('https://www.instagram.com/p/C3o1hSZyi5a/', 'C3o1hSZyi5a', 'staff', '洗顔購入品紹介', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C47ieBGOG5b/', 'C47ieBGOG5b', 'staff', 'ニキビ闘い記録', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C5tHTVuyVm3/', 'C5tHTVuyVm3', 'staff', '春UV対策アイテム', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C6MOd5LyaHr/', 'C6MOd5LyaHr', 'staff', 'むっちり泡洗顔', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C7hHZ1SSQFe/', 'C7hHZ1SSQFe', 'staff', '下半期施術計画', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C8wFlEQyAWR/', 'C8wFlEQyAWR', 'staff', 'UVスプレー実験', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C9ZaIYeS7_S/', 'C9ZaIYeS7_S', 'staff', 'UVスプレー塗り方', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C9yidjTybHC/', 'C9yidjTybHC', 'staff', '美ナースアンバサダー', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/C-L_noVSj4P/', 'C-L_noVSj4P', 'staff', '靴擦れ防止ケア', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DAKsJNCS8-z/', 'DAKsJNCS8-z', 'staff', 'サーマジェン三拍子', 'staff_blog', 'published'),
  -- 011〜018
  ('https://www.instagram.com/p/DIeSW0HT44C/', 'DIeSW0HT44C', 'staff', '相棒ナース卒業', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DJ3kWB1uxl3/', 'DJ3kWB1uxl3', 'staff', '去年の日焼け止め検証', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DJ9gKpSTOTM/', 'DJ9gKpSTOTM', 'staff', 'ボトックスマップ', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DKRGII6OCqA/', 'DKRGII6OCqA', 'staff', '休日アート体験', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DK0geb3zHg5/', 'DK0geb3zHg5', 'staff', '旅行UVケアセット', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DLGfcFETZJF/', 'DLGfcFETZJF', 'staff', '先輩方と食事会', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DNS1HeHymfM/', 'DNS1HeHymfM', 'staff', 'サーマハンド症例', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DNvAW8RZFlL/', 'DNvAW8RZFlL', 'staff', 'シワの種類と対策', 'staff_blog', 'published'),
  -- 020〜027（019欠番）
  ('https://www.instagram.com/p/DOaFLF0EuEi/', 'DOaFLF0EuEi', 'staff', '骨萎縮たるみ', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DO6HcUPksy-/', 'DO6HcUPksy-', 'staff', '筋肉たるみ', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DPnM5rAks_O/', 'DPnM5rAks_O', 'staff', 'パスタ職人', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DRMHrqJkmH_/', 'DRMHrqJkmH_', 'staff', 'クリスマス', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DSpQen6Ek7c/', 'DSpQen6Ek7c', 'staff', 'ヒアルロン酸', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DVaXD5Bkkcd/', 'DVaXD5Bkkcd', 'staff', 'ボツリヌストキシン', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DVqNAtXkrNI/', 'DVqNAtXkrNI', 'staff', '春スキンケア', 'staff_blog', 'published'),
  ('https://www.instagram.com/p/DWk-4hRktOO/', 'DWk-4hRktOO', 'staff', '自己紹介', 'staff_blog', 'published'),
  -- フォルダなし（urls.txt最終行）
  ('https://www.instagram.com/p/C2HXG5Qy3kJ/', 'C2HXG5Qy3kJ', 'staff', '', 'staff_blog', 'published')
ON CONFLICT (url) DO NOTHING;
