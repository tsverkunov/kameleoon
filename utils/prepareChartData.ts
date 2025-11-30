import type { DailyMetrics } from "../types/types";

export type PreparedPoint = {
  date: Date;
  [variationId: string]: Date | number | null;
};

export function prepareChartData(raw: DailyMetrics[]): PreparedPoint[] {
  return raw.map((d) => {
    const p: PreparedPoint = { date: new Date(d.date) };

    const keys = new Set<string>([
      ...Object.keys(d.visits || {}),
      ...Object.keys(d.conversions || {}),
    ]);

    keys.forEach((id) => {
      const visits = (d.visits && d.visits[id]) ?? 0;
      const conv = (d.conversions && d.conversions[id]) ?? 0;
      p[id] = visits > 0 ? (conv / visits) * 100 : null;
    });

    return p;
  });
}
