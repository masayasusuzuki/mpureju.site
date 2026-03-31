-- ============================================================
-- treatment_items: 施術一覧ページ用
-- ============================================================
create table treatment_items (
  id bigint generated always as identity primary key,
  section text not null,          -- '皮膚科', '外科', '点滴', '内服薬'
  sub_tab text,                   -- '目', '鼻', '口' 等（外科のみ。他はnull）
  name text not null,             -- 施術名
  description text not null,      -- 概要
  risks text not null,            -- リスク・副作用
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- price_items: 料金一覧ページ + 施術詳細サイドバー用
-- ============================================================
create table price_items (
  id bigint generated always as identity primary key,
  section text not null,          -- '皮膚科', '外科', '点滴', '内服薬', '化粧品', 'その他'
  sub_tab text not null,          -- 'ヒアルロン酸', 'ボトックス' 等
  category text not null default '',  -- 施術名/グループ名
  option text,                    -- オプション（1本, 2本 等）
  price text not null,            -- '¥99,000' 等
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLSポリシー: 誰でも読み取りOK、書き込みはservice_role_keyのみ
-- ============================================================
alter table treatment_items enable row level security;
alter table price_items enable row level security;

create policy "Public read access" on treatment_items
  for select using (true);

create policy "Public read access" on price_items
  for select using (true);

-- ============================================================
-- updated_at 自動更新トリガー
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger treatment_items_updated_at
  before update on treatment_items
  for each row execute function update_updated_at();

create trigger price_items_updated_at
  before update on price_items
  for each row execute function update_updated_at();
