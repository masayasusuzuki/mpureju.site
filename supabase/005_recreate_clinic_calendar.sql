-- 営業カレンダー再作成: 既存テーブルをDROPして作り直す

DROP TABLE IF EXISTS clinic_holiday_overrides;
DROP TABLE IF EXISTS clinic_regular_holidays;

-- 定休曜日
CREATE TABLE clinic_regular_holidays (
  day_of_week smallint PRIMARY KEY CHECK (day_of_week BETWEEN 0 AND 6),
  label text NOT NULL
);

-- 臨時休診 / 休診取消
CREATE TABLE clinic_holiday_overrides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date date NOT NULL UNIQUE,
  type text NOT NULL CHECK (type IN ('extra', 'cancel')),
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_holiday_overrides_date ON clinic_holiday_overrides(date);
CREATE INDEX idx_holiday_overrides_type ON clinic_holiday_overrides(type);

-- RLS
ALTER TABLE clinic_regular_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_holiday_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read regular holidays"
  ON clinic_regular_holidays FOR SELECT USING (true);

CREATE POLICY "Public read holiday overrides"
  ON clinic_holiday_overrides FOR SELECT USING (true);

-- 初期データ: 定休曜日（月曜のみ）
INSERT INTO clinic_regular_holidays (day_of_week, label) VALUES
  (1, '月曜');
