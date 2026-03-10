import { addDays, format } from "date-fns";
import { ja } from "date-fns/locale";
import type { TreatmentDowntime, Milestone } from "./data";

export type MilestoneWithDate = Milestone & {
  date: Date;
  dateLabel: string;
};

export type SimulatorResult = {
  operationDate: Date;
  downtimeMaxDays: number;
  recoveryDate: Date;
  milestones: MilestoneWithDate[];
};

/**
 * 複数施術のダウンタイムを合算し、マイルストーンを計算する
 * - ダウンタイム日数は各施術の max_days の最大値を採用
 * - マイルストーンは全施術のものをマージし、同ラベルは最大 days_after を採用
 */
export function calcSimulation(
  treatments: TreatmentDowntime[],
  operationDate: Date
): SimulatorResult {
  if (treatments.length === 0) {
    return {
      operationDate,
      downtimeMaxDays: 0,
      recoveryDate: operationDate,
      milestones: [],
    };
  }

  // ダウンタイム最大値
  const downtimeMaxDays = Math.max(...treatments.map((t) => t.downtime_max_days));

  // マイルストーンのマージ: 同ラベルは最も遅い日数を採用
  const milestoneMap = new Map<string, Milestone>();
  for (const treatment of treatments) {
    for (const ms of treatment.milestones) {
      const existing = milestoneMap.get(ms.label);
      if (!existing || ms.days_after > existing.days_after) {
        milestoneMap.set(ms.label, ms);
      }
    }
  }

  // 日付付きマイルストーンに変換し、days_after で昇順ソート
  const milestones: MilestoneWithDate[] = Array.from(milestoneMap.values())
    .sort((a, b) => a.days_after - b.days_after)
    .map((ms) => {
      const date = addDays(operationDate, ms.days_after);
      return {
        ...ms,
        date,
        dateLabel: format(date, "M月d日(E)", { locale: ja }),
      };
    });

  const recoveryDate = addDays(operationDate, downtimeMaxDays);

  return { operationDate, downtimeMaxDays, recoveryDate, milestones };
}

/** URLパラメータ用: slugのカンマ区切り文字列 → slug配列 */
export function parseSlugsParam(param: string | null): string[] {
  if (!param) return [];
  return param.split(",").filter(Boolean);
}

/** URLパラメータ用: slug配列 → カンマ区切り文字列 */
export function stringifySlugs(slugs: string[]): string {
  return slugs.join(",");
}
