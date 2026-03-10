/**
 * ダウンタイムシミュレーター 静的データ
 *
 * Phase 2以降: microCMS treatments スキーマの
 * downtime_min_days / downtime_max_days / downtime_milestones[] に差し替え予定
 */

export type Pillar = "eye" | "nose" | "mouth" | "lift" | "skin";

export type Milestone = {
  label: string;       // 例: "腫れのピーク"
  days_after: number;  // 施術日から何日後
  description: string; // 例: "患部が最も腫れる時期です"
};

export type TreatmentDowntime = {
  slug: string;
  name: string;
  pillar: Pillar;
  downtime_min_days: number;
  downtime_max_days: number;
  milestones: Milestone[];
};

// ─── 目元 ────────────────────────────────────────────────────────────────────

const EYE: TreatmentDowntime[] = [
  {
    slug: "double-burial",
    name: "二重埋没",
    pillar: "eye",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "腫れのピーク",     days_after: 2,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 3,  description: "アイメイク以外のメイクが可能になります" },
      { label: "アイメイク可能",   days_after: 7,  description: "アイメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 3,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 7,  description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 30, description: "自然な二重に落ち着いてくる時期です" },
    ],
  },
  {
    slug: "double-incision",
    name: "二重全切開",
    pillar: "eye",
    downtime_min_days: 14,
    downtime_max_days: 21,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 10, description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 21, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が落ち着き自然な仕上がりになります" },
    ],
  },
  {
    slug: "epicanthoplasty",
    name: "目頭切開",
    pillar: "eye",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が落ち着いてくる時期です" },
    ],
  },
  {
    slug: "fat-removal",
    name: "脱脂",
    pillar: "eye",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 3,  description: "アイメイク以外のメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 5,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 60, description: "くまの改善効果が安定してくる時期です" },
    ],
  },
  {
    slug: "ptosis-incision",
    name: "眼瞼下垂（切開）",
    pillar: "eye",
    downtime_min_days: 14,
    downtime_max_days: 21,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 10, description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 21, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "目の開きが安定してくる時期です" },
    ],
  },
];

// ─── 鼻 ──────────────────────────────────────────────────────────────────────

const NOSE: TreatmentDowntime[] = [
  {
    slug: "nose-prosthesis",
    name: "プロテーゼ",
    pillar: "nose",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "テープ除去",       days_after: 7,  description: "固定テープが外れます" },
      { label: "メイク可能",       days_after: 7,  description: "テープ除去後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "腫れが完全に引き自然な鼻筋に落ち着きます" },
    ],
  },
  {
    slug: "nose-tip",
    name: "鼻尖形成",
    pillar: "nose",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "テープ除去",       days_after: 7,  description: "固定テープが外れます" },
      { label: "メイク可能",       days_after: 7,  description: "テープ除去後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "鼻先の形が安定してくる時期です" },
    ],
  },
  {
    slug: "septum-extension",
    name: "鼻中隔延長",
    pillar: "nose",
    downtime_min_days: 14,
    downtime_max_days: 21,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜4日が最も腫れやすい時期です" },
      { label: "テープ除去",       days_after: 10, description: "固定テープが外れます" },
      { label: "メイク可能",       days_after: 10, description: "テープ除去後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 14, description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 21, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 180, description: "軟骨が定着し完成形に近づく時期です" },
    ],
  },
  {
    slug: "alar-reduction",
    name: "鼻翼縮小",
    pillar: "nose",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が落ち着き自然な小鼻に仕上がります" },
    ],
  },
];

// ─── 口元 ────────────────────────────────────────────────────────────────────

const MOUTH: TreatmentDowntime[] = [
  {
    slug: "corner-lift",
    name: "口角挙上",
    pillar: "mouth",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が落ち着き自然な口角に仕上がります" },
    ],
  },
  {
    slug: "philtrum-shortening",
    name: "人中短縮",
    pillar: "mouth",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜4日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が目立たなくなってくる時期です" },
    ],
  },
  {
    slug: "m-lip",
    name: "M字リップ",
    pillar: "mouth",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "立体感のある唇に仕上がってくる時期です" },
    ],
  },
  {
    slug: "lip-reduction",
    name: "口唇縮小",
    pillar: "mouth",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜3日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 7,  description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 7,  description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "傷跡が落ち着きすっきりした唇に仕上がります" },
    ],
  },
];

// ─── 糸の施術・リフトアップ ───────────────────────────────────────────────────

const LIFT: TreatmentDowntime[] = [
  {
    slug: "thread-lift",
    name: "糸リフト",
    pillar: "lift",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "腫れのピーク",     days_after: 2,  description: "施術後1〜2日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 3,  description: "施術部位以外のメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 3,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 30, description: "引き上げ効果が安定してくる時期です" },
    ],
  },
  {
    slug: "fat-suction-face",
    name: "脂肪吸引（顔）",
    pillar: "lift",
    downtime_min_days: 7,
    downtime_max_days: 14,
    milestones: [
      { label: "腫れのピーク",     days_after: 3,  description: "施術後2〜4日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 3,  description: "傷口以外のメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 7,  description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 14, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 90, description: "フェイスラインが安定してくる時期です" },
    ],
  },
  {
    slug: "macs-facelift",
    name: "MACSフェイスリフト",
    pillar: "lift",
    downtime_min_days: 14,
    downtime_max_days: 21,
    milestones: [
      { label: "腫れのピーク",     days_after: 4,  description: "施術後3〜5日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 10, description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 10, description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 14, description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 30, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 180, description: "リフトアップ効果が定着してくる時期です" },
    ],
  },
  {
    slug: "smas-facelift",
    name: "SMASフェイスリフト",
    pillar: "lift",
    downtime_min_days: 21,
    downtime_max_days: 30,
    milestones: [
      { label: "腫れのピーク",     days_after: 5,  description: "施術後3〜5日が最も腫れやすい時期です" },
      { label: "抜糸",             days_after: 10, description: "傷口の抜糸を行います" },
      { label: "メイク可能",       days_after: 10, description: "抜糸後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 21, description: "軽い仕事・日常生活に戻れる目安です" },
      { label: "激しい運動可",     days_after: 30, description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 180, description: "自然なリフトアップ効果が定着します" },
    ],
  },
];

// ─── 美容皮膚科 ───────────────────────────────────────────────────────────────

const SKIN: TreatmentDowntime[] = [
  {
    slug: "botox",
    name: "ボトックス / コアトックス",
    pillar: "skin",
    downtime_min_days: 0,
    downtime_max_days: 3,
    milestones: [
      { label: "メイク可能",       days_after: 1,  description: "翌日からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 0,  description: "当日から日常生活に戻れます" },
      { label: "効果発現",         days_after: 3,  description: "筋肉の動きが抑制され始める時期です" },
      { label: "ほぼ完成",         days_after: 14, description: "効果が安定してくる時期です" },
    ],
  },
  {
    slug: "hyaluronic-acid",
    name: "ヒアルロン酸",
    pillar: "skin",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "腫れのピーク",     days_after: 1,  description: "施術後1〜2日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 1,  description: "翌日からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 1,  description: "翌日から日常生活に戻れます" },
      { label: "ほぼ完成",         days_after: 14, description: "ヒアルロン酸が馴染んで自然な仕上がりになります" },
    ],
  },
  {
    slug: "potenza",
    name: "ポテンツァ",
    pillar: "skin",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "赤みのピーク",     days_after: 1,  description: "施術後1〜2日が赤みが最も出やすい時期です" },
      { label: "メイク可能",       days_after: 3,  description: "3日程度でメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 2,  description: "2日程度で日常生活に戻れます" },
      { label: "激しい運動可",     days_after: 7,  description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 30, description: "肌のハリ・引き締め効果が安定してくる時期です" },
    ],
  },
  {
    slug: "hifu",
    name: "ウルトラセルZi（HIFU）",
    pillar: "skin",
    downtime_min_days: 1,
    downtime_max_days: 3,
    milestones: [
      { label: "メイク可能",       days_after: 1,  description: "翌日からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 0,  description: "当日から日常生活に戻れます" },
      { label: "激しい運動可",     days_after: 3,  description: "3日程度でジム・スポーツが可能になります" },
      { label: "効果実感",         days_after: 30, description: "コラーゲン生成が促進され効果を実感できる時期です" },
      { label: "ほぼ完成",         days_after: 90, description: "たるみ・リフトアップ効果が安定してくる時期です" },
    ],
  },
  {
    slug: "laser",
    name: "レーザー",
    pillar: "skin",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "赤みのピーク",     days_after: 1,  description: "施術後1〜2日が赤みが最も出やすい時期です" },
      { label: "かさぶた形成",     days_after: 3,  description: "シミ・照射部位にかさぶたができることがあります" },
      { label: "メイク可能",       days_after: 5,  description: "かさぶた脱落後からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 2,  description: "2日程度で日常生活に戻れます" },
      { label: "ほぼ完成",         days_after: 30, description: "シミの改善・肌のきめが整ってくる時期です" },
    ],
  },
  {
    slug: "fat-dissolving",
    name: "脂肪溶解注射",
    pillar: "skin",
    downtime_min_days: 3,
    downtime_max_days: 7,
    milestones: [
      { label: "腫れのピーク",     days_after: 2,  description: "施術後1〜3日が最も腫れやすい時期です" },
      { label: "メイク可能",       days_after: 1,  description: "翌日からメイクが可能になります" },
      { label: "日常生活復帰",     days_after: 2,  description: "2日程度で日常生活に戻れます" },
      { label: "激しい運動可",     days_after: 7,  description: "ジム・スポーツ等が可能になります" },
      { label: "ほぼ完成",         days_after: 60, description: "脂肪細胞の排出が進み効果が安定してくる時期です" },
    ],
  },
];

// ─── 全施術リスト ─────────────────────────────────────────────────────────────

export const ALL_TREATMENTS: TreatmentDowntime[] = [
  ...EYE,
  ...NOSE,
  ...MOUTH,
  ...LIFT,
  ...SKIN,
];

export const PILLAR_LABELS: Record<Pillar, string> = {
  eye:   "目元",
  nose:  "鼻の整形",
  mouth: "口元",
  lift:  "リフトアップ",
  skin:  "美容皮膚科",
};

export const PILLAR_HREFS: Record<Pillar, string> = {
  eye:   "/eye",
  nose:  "/nose",
  mouth: "/mouth",
  lift:  "/lift",
  skin:  "/skin",
};
