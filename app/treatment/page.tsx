import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TreatmentNav, type TreatmentSearchRow } from "@/components/sections/TreatmentNav";
import { TreatmentSubTabs, type TreatmentRow, type TreatmentSubTab } from "@/components/sections/TreatmentSubTabs";

export const metadata: Metadata = {
  title: "施術一覧｜Maison PUREJU 銀座の美容外科・美容皮膚科",
  description:
    "Maison PUREJUの全施術一覧。皮膚科・外科・点滴・内服薬の施術内容・リスク・副作用をカテゴリ別に掲載しています。",
};

// ============================================================
// TREATMENT DATA
// 参照元: docs/treatment-menu.md
// ============================================================

// ===== 皮膚科 =====
const HIFUKA_ROWS: TreatmentRow[] = [
  {
    name: "ボトックス / コアトックス",
    desc: "筋肉の緊張をほぐし、額・眉間・目尻などのしわを自然に整える。小顔・肩こりへの応用も可能。",
    risks: "アレルギー・内出血・抗体産生など",
  },
  {
    name: "ヒアルロン酸",
    desc: "体内にある成分のヒアルロン酸を注入し、皮膚を膨らませほうれい線やしわを改善。",
    risks: "腫れ・内出血・血管閉塞・感染・硬結など",
  },
  {
    name: "ソフウェーブ",
    desc: "皮膚の深い層に超音波エネルギーを照射し、コラーゲンとエラスチンの生成を促進。ダウンタイムがほとんどない。",
    risks: "腫れ・内出血・血管閉塞・感染・硬結など",
  },
  {
    name: "ブレッシング",
    desc: "極細の針を皮膚に斜めに挿入し、高周波エネルギーと美容成分を肌の奥深くまで届ける。コラーゲン生成促進・ニキビ跡クレーター改善。",
    risks: "腫れ・内出血・血管閉塞・感染・硬結など",
  },
  {
    name: "メソナJ",
    desc: "エレクトロポレーション法で美容成分を肌の奥深い層まで浸透させる導入治療。",
    risks: "赤み・かゆみ・発疹など",
  },
  {
    name: "ウルトラセルZi（HIFU）",
    desc: "HIFU（高密度焦点式超音波）でSMAS層（筋膜）に熱エネルギーを届ける「切らないしわ・たるみ治療」。",
    risks: "熱傷・神経麻痺・色素沈着・毛包炎・紅斑など",
  },
  {
    name: "XERFザーフ（RF）",
    desc: "2MHzと6.78MHzの2種類の周波数のRFを照射し、皮膚表面からSMAS層まで熱を加えリフトアップ・小じわ改善。",
    risks: "熱傷・神経麻痺・色素沈着・毛包炎・紅斑",
  },
  {
    name: "サーマジェン（RF）",
    desc: "4MHzのRFを皮膚表面から脂肪層まで照射し、リフトアップや脂肪の引き締め。",
    risks: "熱傷・神経麻痺・色素沈着・毛包炎・紅斑",
  },
  {
    name: "サーマZi（RF＋HIFU）",
    desc: "ウルトラセルZi（HIFU）とサーマジェン（RF）を組み合わせ、筋膜から皮膚まで全層で複合的にリフトアップ。",
    risks: "熱傷・神経麻痺・色素沈着・毛包炎・紅斑",
  },
  {
    name: "ポテンツァ",
    desc: "マイクロニードル治療とRF治療を組み合わせた施術。ドラッグデリバリーシステムにより薬剤の高浸透も可能。",
    risks: "腫れ・点状出血・赤み・色素沈着など",
  },
  {
    name: "サーマニードル",
    desc: "マイクロニードル治療とRF治療を組み合わせた施術（ポテンツァと類似。機器が異なる）。",
    risks: "腫れ・点状出血・赤み・色素沈着など",
  },
  {
    name: "レーザー",
    desc: "シミ・そばかす・肝斑・毛穴など様々な肌悩みに対応。スポット・ルビーフラクショナル・カスタマイズトーニング・ジェネシス・フラクショナルなど複数のメニューを展開。",
    risks: "赤み・色素沈着・再発など",
  },
  {
    name: "IPL / フォトフェイシャル",
    desc: "IPL（Intense Pulsed Light）でシミ・そばかす・赤ら顔を総合的に改善。9種類のフィルターで対応。",
    risks: "赤み・熱感など",
  },
  {
    name: "KOライト",
    desc: "超高輝度LED（赤・青・混合色）による治療。血流改善・抗炎症・ダウンタイム軽減効果。",
    risks: "赤み・熱感など",
  },
  {
    name: "スキンブースター（手打ち）",
    desc: "医師が手打ちで皮内にドラッグデリバリー。小皺・くすみ・毛穴・乾燥・赤みなど改善。",
    risks: "内出血・アレルギーなど",
  },
  {
    name: "ブースター（機械導入）",
    desc: "ニードルRFや導入機器を用いて皮内にドラッグデリバリー。スキンブースター（手打ち）の機械版。",
    risks: "内出血・アレルギーなど",
  },
  {
    name: "脂肪溶解注射",
    desc: "デオキシコール酸（0.8%）で脂肪細胞を破壊・排出。リバウンドしにくい痩身効果。",
    risks: "腫れ・内出血・アレルギー・皮下結節・壊死など",
  },
  {
    name: "ピーリング",
    desc: "メイクアップピール・ミックスピールマヌカ・マッサージピール・ペパーミントピール・ミラノリピールなど、ターンオーバーを促進し肌の質感を底上げする高品質なピーリング。",
    risks: "赤み・熱感・皮剥け・アレルギーなど",
  },
  {
    name: "ヒアルロニダーゼ",
    desc: "ヒアルロン酸を分解する酵素。ヒアルロン酸の修正・除去。",
    risks: "腫れ・内出血・アレルギー・感染・血管拡張など",
  },
  {
    name: "ヒレネックス（ヒト由来）",
    desc: "ヒト由来のヒアルロニダーゼ。アレルギーリスクが低い。",
    risks: "腫れ・内出血・アレルギー・感染・血管拡張など",
  },
  {
    name: "オビソート",
    desc: "ボツリヌストキシンの効果を抑制する注射。",
    risks: "腫れ・内出血・アレルギーなど",
  },
  {
    name: "ケナコルト",
    desc: "盛り上がった傷（ケロイド・肥厚性瘢痕）を平坦化する。",
    risks: "腫れ・内出血・アレルギーなど",
  },
  {
    name: "サブシジョン",
    desc: "医療用針でニキビ跡クレーターの皮膚下線維を切断。PRP注入との併用も可能。",
    risks: "腫れ・内出血・アレルギー・感染・血管拡張など",
  },
];

// ===== 外科（サブタブ） =====
const GEKA_TABS: TreatmentSubTab[] = [
  {
    label: "目",
    rows: [
      { name: "二重埋没", desc: "線留めで腫れ最小限・取れにくい二重。PVDF糸使用。", risks: "腫れ・内出血・左右差・感染・後戻り・糸の露出・ドライアイ" },
      { name: "二重抜糸", desc: "埋没法の糸を抜去。", risks: "腫れ・内出血・取れない可能性" },
      { name: "二重全切開", desc: "皮膚切開で半永久的な二重。同時に皮膚たるみ・脂肪除去も可。", risks: "腫れ・内出血・左右差・傷跡・後戻り・ドライアイ" },
      { name: "眼瞼下垂（埋没）", desc: "眼瞼挙筋の腱膜を糸でたぐり寄せ目の開きを改善。", risks: "腫れ・内出血・左右差・糸の露出・後戻り・眼瞼痙攣・ドライアイ" },
      { name: "眼瞼下垂（切開）", desc: "上まぶた切開で腱膜を短縮し目の開きを改善。二重全切開を含む。", risks: "腫れ・内出血・左右差・傷跡・後戻り・眼瞼痙攣・ドライアイ" },
      { name: "眉下切開", desc: "眉毛下の皮膚切除でたるみ除去。筋肉処理・ROOF切除・吊り上げ固定も可。", risks: "腫れ・内出血・左右差・傷跡・ドライアイ" },
      { name: "目頭切開 / 目頭上切開", desc: "蒙古襞切開（目の距離が縮まる）または皮膚入れ替え（距離は変わらない）。", risks: "腫れ・内出血・左右差・傷跡・ドライアイ" },
      { name: "脱脂", desc: "下まぶた裏側から眼窩脂肪を取り出しクマを改善。傷跡が表面に残らない。", risks: "腫れ・内出血・左右差・凹み・後戻り・外反・複視" },
      { name: "上眼瞼除皺", desc: "二重ラインまたはまつ毛上の皮膚切除で上まぶたのたるみ除去。", risks: "腫れ・内出血・左右差・傷跡・ドライアイ" },
      { name: "下眼瞼除皺", desc: "下まぶたの余った皮膚切除＋筋肉引き上げリフトアップ。", risks: "腫れ・内出血・左右差・傷跡・外反・ドライアイ" },
      { name: "脂肪再配置", desc: "眼窩脂肪の切除＋リガメント剥離で脂肪を再固定。裏側切開で傷跡が見えない。", risks: "腫れ・内出血・左右差・凹み・後戻り・外反・複視" },
      { name: "表ハムラ", desc: "眼窩脂肪をリガメント部位に敷き込み固定。余った皮膚切除・筋肉リフトも可。", risks: "腫れ・内出血・左右差・傷跡・外反・ドライアイ・凹み・複視" },
      { name: "裏ハムラ", desc: "表ハムラと同内容だが裏側切開で傷跡が見えない。", risks: "腫れ・内出血・左右差・凹み・後戻り・外反・複視" },
      { name: "目尻切開", desc: "まぶた外側切開で白目を大きくし切れ長の目に。", risks: "腫れ・内出血・左右差・後戻り・浮腫" },
      { name: "グラマラス", desc: "下まぶたを下げて垂れ目にし目を大きく見せる。", risks: "腫れ・内出血・左右差・後戻り・浮腫" },
      { name: "蒙古襞形成", desc: "見えすぎた涙丘を隠すため蒙古襞を新たに形成。", risks: "腫れ・内出血・左右差・傷跡" },
    ],
  },
  {
    label: "鼻",
    rows: [
      { name: "プロテーゼ", desc: "鼻腔内切開でシリコンプロテーゼを挿入し鼻筋を高くする。", risks: "腫れ・内出血・鼻閉・感染・湾曲・露出・移動" },
      { name: "鼻尖形成", desc: "余分な軟骨・脂肪を除去し鼻翼軟骨処理で鼻先を細く整える。", risks: "腫れ・内出血・鼻閉・感染・湾曲・露出・変形・傷跡・移動・後戻り" },
      { name: "耳介軟骨移植", desc: "耳後面から軟骨を採取し必要箇所に移植。自家組織のため拒絶反応リスクが低い。", risks: "腫れ・内出血・感染・湾曲・露出・変形・傷跡・移動" },
      { name: "ストラット法オプション", desc: "耳介軟骨を鼻柱に固定し土台を安定させ鼻先の沈み込みを防止。", risks: "腫れ・内出血・鼻閉・感染・湾曲・露出・変形・傷跡・移動" },
      { name: "鼻中隔軟骨移植", desc: "鼻中隔から軟骨を採取し必要箇所に移植。", risks: "腫れ・内出血・感染・湾曲・露出・変形・鼻閉・傷跡" },
      { name: "肋軟骨移植", desc: "バスト下付け根から肋軟骨を採取し必要箇所に移植。", risks: "腫れ・内出血・感染・湾曲・露出・変形・鼻閉・気胸・傷跡" },
      { name: "鼻中隔延長", desc: "鼻中隔に軟骨を移植・固定し鼻先・鼻柱を下方向に伸ばす。", risks: "腫れ・内出血・鼻閉・感染・湾曲・露出・変形・傷跡・移動・後戻り" },
      { name: "鼻翼縮小", desc: "鼻翼の皮膚切除で小鼻を小さくする（外側・内側・両方の方法あり）。", risks: "腫れ・内出血・変形・傷跡" },
      { name: "鼻孔縁下降", desc: "耳軟骨を鼻孔縁に移植し鼻の穴のアーチを下げ目立たなくする。", risks: "腫れ・内出血・左右差・鼻閉・感染・湾曲・露出・変形・傷跡・移動" },
      { name: "鼻翼挙上", desc: "垂れた鼻翼を切開して上に移動しバランスを整える。", risks: "腫れ・内出血・血管閉塞・感染・硬結" },
      { name: "鼻孔縁挙上", desc: "垂れた鼻孔縁を切除しアーチを上に持ち上げ厚みのある小鼻をすっきり整える。", risks: "腫れ・内出血・左右差・変形・傷跡" },
      { name: "鼻骨骨切り", desc: "鼻骨を切って中央に寄せ鼻筋を細くまっすぐに整える。", risks: "腫れ・内出血・鼻閉・感染・湾曲・傷跡" },
      { name: "ハンプ切除", desc: "鼻骨の出っ張り（ハンプ）部分を切除し隆起を平らにする。必要に応じ骨切りと組み合わせ。", risks: "腫れ・内出血・鼻閉・感染・湾曲・後戻り" },
      { name: "鼻翼基部形成（貴族）", desc: "小鼻の付け根に肋軟骨・プロテーゼを入れ立体感を出しほうれい線も改善。", risks: "腫れ・内出血・左右差・感染・露出・変形・移動・異物感" },
      { name: "鼻柱基部形成（猫）", desc: "耳介軟骨・肋軟骨を鼻柱基部に移植し口元の突出感を改善。", risks: "腫れ・内出血・感染・露出・変形・移動・異物感" },
      { name: "側頭筋膜移植", desc: "側頭部を切開し側頭筋膜を採取して必要箇所に移植。", risks: "腫れ・内出血・血腫" },
      { name: "プロテーゼ抜去", desc: "鼻腔内切開でプロテーゼを抜去する。", risks: "腫れ・内出血・拘縮・抜けない可能性" },
    ],
  },
  {
    label: "口",
    rows: [
      { name: "口角挙上", desc: "口角の皮膚・粘膜切開と筋肉処理で口角を上外側に移動。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "M字リップ", desc: "上唇の一部を切除しM字型の立体感ある唇に。筋弁作成オプションあり。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "ピーナッツリップ", desc: "下唇の一部を切除しピーナッツ型の立体感ある唇に。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "口唇縮小", desc: "厚ぼったい唇（たらこ唇）を切除しすっきり薄く整える。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "人中短縮", desc: "鼻の下を切開し余分な皮膚切除で鼻の下を短く。筋肉引き上げ処理で後戻り防止。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "外側人中短縮", desc: "上唇外側の余分な皮膚切除で上唇外側を引き上げ顔の余白を減らす。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害・水漏れ" },
      { name: "口唇拡大", desc: "口の裏側粘膜をW字切開し表側に移動させ唇を厚く見せる。", risks: "腫れ・内出血・左右差・傷跡・後戻り・感覚障害" },
      { name: "ガミースマイル手術", desc: "上唇の裏から粘膜切除で笑った時の歯茎の見える面積を減らす。", risks: "腫れ・内出血・左右差・後戻り・感覚障害" },
    ],
  },
  {
    label: "糸",
    rows: [
      { name: "糸リフト", desc: "吸収される特殊な糸でたるみを改善。コラーゲン・ヒアルロン酸増生による美肌効果も。メンテナンス / スタンダード / プレミアムの3プランあり。", risks: "腫れ・内出血・感染・露出" },
      { name: "ショートスレッド", desc: "極細の医療用糸を皮下に挿入。引き締め・コラーゲン生成・ハリ感アップ。", risks: "腫れ・内出血・感染・露出" },
      { name: "アイスレッド", desc: "目元専用ショートスレッド。目元のたるみ・小じわ・クマ改善。", risks: "腫れ・内出血・感染・露出" },
    ],
  },
  {
    label: "輪郭",
    rows: [
      { name: "脂肪吸引", desc: "カニューレで脂肪を吸引しフェイスラインをすっきり小顔に仕上げる。頬・あご下に対応。", risks: "腫れ・内出血・傷跡・色素沈着・たるみ・瘢痕拘縮・神経麻痺・皮膚壊死・血腫・脂肪塞栓" },
      { name: "バッカルファット除去", desc: "口横の深い脂肪（バッカルファット）を除去。将来のたるみ予防にも効果が期待できる。", risks: "腫れ・内出血・傷跡・色素沈着・たるみ・瘢痕拘縮・神経麻痺・皮膚壊死・血腫・脂肪塞栓" },
      { name: "脂肪採取", desc: "大腿部・腹部から脂肪注入用の脂肪を吸引採取。", risks: "腫れ・内出血・傷跡・色素沈着・たるみ・瘢痕拘縮・神経麻痺・皮膚壊死・血腫・脂肪塞栓" },
      { name: "ナノリッチ作成", desc: "採取脂肪をナノ化し幹細胞・不純物の少ない極小脂肪を作成。より高い生着率を目指す。", risks: "腫れ・内出血・色素沈着・たるみ・瘢痕拘縮・神経麻痺・皮膚壊死・血腫・脂肪塞栓" },
      { name: "脂肪注入", desc: "自身から採取した脂肪を顔の凹んだ部分に注入。肌のハリ・血流改善効果もある。", risks: "腫れ・内出血・色素沈着・たるみ・瘢痕拘縮・神経麻痺・皮膚壊死・血腫・脂肪塞栓" },
      { name: "MACSフェイスリフト", desc: "耳周囲切開でSMASの裏面を剥離せず引き上げる。SMASフェイスリフトより比較的ダウンタイムが少ない。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
      { name: "SMASフェイスリフト", desc: "SMAS（顔面表在筋膜）を含む皮下組織を持ち上げ最大限のリフトアップを実現。効果の持続期間が長い。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
      { name: "ネックリフト", desc: "耳後ろの余分な皮膚除去と皮膚・筋膜引き上げで首〜あごのたるみを改善。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
      { name: "ペリカンリフト", desc: "あご下切開で深い脂肪切除・筋肉引き締めであご下たるみを改善。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
      { name: "こめかみリフト", desc: "こめかみ付近の余分な皮膚切除で目元・目尻のたるみを解消。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
      { name: "前額リフト", desc: "生え際に沿って切開し額のシワ・眉や目元のたるみを解消。", risks: "腫れ・内出血・瘢痕拘縮・神経麻痺・皮膚壊死・血腫" },
    ],
  },
  {
    label: "ほくろ・いぼ",
    rows: [
      { name: "ほくろ・いぼ除去（CO2レーザー）", desc: "炭酸ガスレーザーでほくろ・いぼを蒸散除去。周囲組織へのダメージが最小。", risks: "傷跡・再発・凹み" },
      { name: "ほくろ・いぼ除去（切除）", desc: "皮膚切開で切除・縫合。再発しにくいが抜糸が必要。", risks: "傷跡・再発・凹み" },
    ],
  },
  {
    label: "その他",
    rows: [
      { name: "他院修正", desc: "同部位手術で修正のための手技を追加。手術歴の申告が必須。", risks: "各施術に準じる" },
    ],
  },
];

// ===== 点滴 =====
const TENTEKI_ROWS: TreatmentRow[] = [
  {
    name: "高濃度ビタミンC点滴",
    desc: "通常の何十倍ものビタミンCを点滴。抗酸化・免疫力向上・美白・コラーゲン生成効果。防腐剤不使用。",
    risks: "アレルギー・内出血・神経障害",
  },
  {
    name: "エクソソーム点滴",
    desc: "健康な日本人女性ドナー由来のエクソソームを点滴。抗炎症・抗酸化・細胞修復促進。",
    risks: "アレルギー・内出血・神経障害・低血糖症状",
  },
  {
    name: "高濃度ビタミンC採血",
    desc: "G6PD酵素の有無を確認する検査。初回高濃度ビタミンC点滴前に必須。",
    risks: "—",
  },
];

// ===== 内服薬 =====
const NAIFUKU_ROWS: TreatmentRow[] = [
  {
    name: "トラネキサム酸 / シナール / ユベラ / ハイチオール",
    desc: "メラニン生成抑制・コラーゲン生成促進。しみ・肝斑・色素沈着改善。（3錠/日・1日3回）",
    risks: "悪心・アレルギー・肝機能低下",
  },
  {
    name: "フィナステリド / デュタステリド",
    desc: "AGA（男性型脱毛症）改善。5αリダクターゼを阻害しDHT生成を抑制。（1錠/日）",
    risks: "リビドー減退・アレルギー・肝機能低下",
  },
  {
    name: "ミノキシジル",
    desc: "血流改善・毛周期延長による発毛効果。（1錠/日）",
    risks: "アレルギー・めまい・頭痛・動悸・血圧低下",
  },
  {
    name: "リザベン",
    desc: "抗アレルギー・抗炎症・コラーゲン過剰生成抑制。瘢痕形成防止。（3錠/日・1日3回）",
    risks: "悪心・アレルギー・肝機能低下",
  },
  {
    name: "イソトレチノイン",
    desc: "重度ニキビ。毛穴詰まり抑制・皮脂分泌抑制・アクネ菌抗菌・抗炎症。（1〜2錠/日）",
    risks: "乾燥・光線過敏・肝機能低下・鬱・胎児の先天異常",
  },
  {
    name: "アルダクトン",
    desc: "男性ホルモン受容体阻害でニキビ抑制（女性向け）。（1〜4錠/日）",
    risks: "低血圧・頻尿・生理不順",
  },
  {
    name: "柴苓湯",
    desc: "抗炎症・腫れ軽減・瘢痕形成防止・むくみ改善の漢方薬。（3包/日・1日3回）",
    risks: "アレルギー・口渇・頻尿",
  },
  {
    name: "ルミガン",
    desc: "ビマトプロストでまつ毛の成長期を伸ばし太く長くする。（1日1回寝る前に外用）",
    risks: "アレルギー・結膜炎・色素沈着",
  },
];

// ============================================================
// SEARCH DATA（全データをフラット化して TreatmentNav に渡す）
// ============================================================
function flattenSubTabs(section: string, tabs: TreatmentSubTab[]): TreatmentSearchRow[] {
  return tabs.flatMap((tab) =>
    tab.rows.map((row) => ({ section, subTab: tab.label, name: row.name, desc: row.desc }))
  );
}

function flattenRows(section: string, rows: TreatmentRow[]): TreatmentSearchRow[] {
  return rows.map((row) => ({ section, name: row.name, desc: row.desc }));
}

const ALL_ROWS: TreatmentSearchRow[] = [
  ...flattenRows("皮膚科", HIFUKA_ROWS),
  ...flattenSubTabs("外科", GEKA_TABS),
  ...flattenRows("点滴", TENTEKI_ROWS),
  ...flattenRows("内服薬", NAIFUKU_ROWS),
];

// ============================================================
// SIMPLE TABLE（皮膚科・点滴・内服薬用）
// ============================================================
function TreatmentTable({ rows }: { rows: TreatmentRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-[var(--color-brand-brown)] text-[var(--color-brand-cream)]">
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-44">施術名</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider">概要</th>
            <th className="text-left py-3 px-4 font-medium text-xs tracking-wider w-52">リスク・副作用</th>
            <th className="text-right py-3 px-4 font-medium text-xs tracking-wider w-20">料金</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-[var(--color-brand-brown)]/10 ${
                i % 2 === 1 ? "bg-[var(--color-brand-cream)]/40" : ""
              }`}
            >
              <td className="py-3 px-4 font-medium text-[var(--color-brand-dark)] align-top">
                {row.name.split(" / ").map((part, j) => (
                  <span key={j} className="block">{part}</span>
                ))}
              </td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] leading-relaxed align-top">{row.desc}</td>
              <td className="py-3 px-4 text-[var(--color-text-secondary)] text-xs leading-relaxed align-top">{row.risks}</td>
              <td className="py-3 px-4 text-right align-top">
                <Link
                  href={`/price?q=${encodeURIComponent(row.name.split(" / ")[0])}`}
                  className="text-xs text-[var(--color-brand-gold)] hover:underline whitespace-nowrap"
                >
                  料金 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// PAGE
// ============================================================
export default function TreatmentPage() {
  return (
    <>
      {/* ===== Hero ===== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(150deg, #fdfcfa 0%, #f0e8d8 60%, #e8dcc8 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 90% 10%, rgba(201,169,110,0.12) 0%, transparent 55%)" }}
        />
        <div className="relative section-container py-12 md:py-16">
          <nav className="flex items-center gap-2 text-xs mb-8 tracking-wider text-[var(--color-text-secondary)]/60">
            <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--color-text-secondary)]">施術一覧</span>
          </nav>
          <p className="font-en text-xs tracking-[0.35em] text-[var(--color-brand-gold)] mb-4">
            TREATMENT MENU
          </p>
          <h1 className="font-en text-5xl md:text-6xl tracking-widest text-[var(--color-brand-dark)] mb-4 leading-none">
            施術一覧
          </h1>
          <p className="text-xs tracking-widest text-[var(--color-text-secondary)]">
            当院で提供する全施術のご案内
          </p>
        </div>
      </section>

      {/* ===== スティッキーナビ + 検索 ===== */}
      <Suspense fallback={null}>
        <TreatmentNav allRows={ALL_ROWS} />
      </Suspense>

      {/* ===== 皮膚科 ===== */}
      <section
        id="hifuka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="01" en="Dermatology" ja="皮膚科" />
          <div className="mt-10">
            <TreatmentTable rows={HIFUKA_ROWS} />
          </div>
        </div>
      </section>

      {/* ===== 外科 ===== */}
      <section
        id="geka"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="02" en="Surgery" ja="外科" />
          <div className="mt-10">
            <TreatmentSubTabs tabs={GEKA_TABS} />
          </div>
        </div>
      </section>

      {/* ===== 点滴 ===== */}
      <section
        id="tenteki"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #fdfcfa 0%, #f5ede0 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="03" en="IV Drip" ja="点滴" />
          <div className="mt-10">
            <TreatmentTable rows={TENTEKI_ROWS} />
          </div>
        </div>
      </section>

      {/* ===== 内服薬 ===== */}
      <section
        id="naifuku"
        className="py-16 md:py-24"
        style={{ background: "linear-gradient(160deg, #f7f0e6 0%, #fdfcfa 100%)" }}
      >
        <div className="section-container">
          <SectionHeading number="04" en="Oral Medication" ja="内服薬" />
          <div className="mt-10">
            <TreatmentTable rows={NAIFUKU_ROWS} />
          </div>
        </div>
      </section>

      {/* ===== 注意事項 ===== */}
      <section className="py-12 md:py-16 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-6">NOTES</p>
          <ul className="space-y-3 text-sm text-[var(--color-text-secondary)] leading-relaxed">
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              当院の施術はすべて自由診療です。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              診察の結果、施術の適応がない場合も診察料を頂戴いたします。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              記載のリスク・副作用はすべての方に起こるわけではありません。詳細はカウンセリングにてご確認ください。
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--color-brand-gold)] shrink-0">—</span>
              未承認医療機器・医薬品については、個人輸入にて提供しております。
            </li>
          </ul>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-20 border-t border-[var(--color-brand-gold)]/20 bg-white">
        <div className="section-container">
          <p className="font-en text-xs tracking-[0.3em] text-[var(--color-brand-gold)] mb-4">CONSULTATION</p>
          <h2 className="font-serif text-2xl md:text-3xl text-[var(--color-brand-dark)] mb-3 leading-relaxed">
            ご予約・ご相談はこちら
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-10 leading-relaxed">
            施術内容・ダウンタイムなど、<br className="md:hidden" />
            ご不明な点はカウンセリングにてご確認ください。
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
            <a
              href="https://reservation.medical-force.com/c/0600773fd2b74afaba1282effeb9644d"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[var(--color-brand-gold)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest font-medium hover:opacity-90 transition-opacity"
            >
              Web予約
            </a>
            <a
              href="https://lin.ee/maisonpureju"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-[var(--color-brand-dark)] text-[var(--color-brand-dark)] px-10 py-4 text-sm tracking-widest hover:bg-[var(--color-brand-dark)] hover:text-white transition-colors"
            >
              LINE予約
            </a>
          </div>
          <Link
            href="/contact"
            className="text-xs tracking-wider text-[var(--color-text-secondary)] underline underline-offset-4 hover:text-[var(--color-brand-gold)] transition-colors"
          >
            メールでのお問い合わせはこちら
          </Link>
        </div>
      </section>
    </>
  );
}
