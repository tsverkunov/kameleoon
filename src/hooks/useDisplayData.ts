import { useMemo } from "react";
import type { PreparedPoint } from "../../utils/prepareChartData.ts";
import type { Period } from "../../types/types.ts";

export const useDisplayData = (data: PreparedPoint[], period: Period) => useMemo(() => {
  if (period === "day") return data;
  const byWeek = new Map<string, { date: Date; sums: Record<string, number>; counts: Record<string, number> }>();
  data.forEach((d) => {
    const dt = d.date;
    const day = (dt.getUTCDay() + 6) % 7; // Monday-based week (UTC)
    const monday = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() - day));
    const key = monday.toISOString().slice(0, 10);
    let entry = byWeek.get(key);
    if (!entry) {
      entry = { date: monday, sums: {}, counts: {} };
      byWeek.set(key, entry);
    }
    Object.keys(d).forEach((k) => {
      if (k === "date") return;
      const v = d[k] as number | null | undefined;
      if (typeof v === "number" && !isNaN(v)) {
        entry!.sums[k] = (entry!.sums[k] || 0) + v;
        entry!.counts[k] = (entry!.counts[k] || 0) + 1;
      }
    });
  });
  return Array.from(byWeek.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((e) => {
      const row: PreparedPoint = { date: e.date };
      const keys = new Set([ ...Object.keys(e.sums), ...Object.keys(e.counts) ]);
      keys.forEach((k) => {
        const sum = e.sums[k] || 0;
        const cnt = e.counts[k] || 0;
        row[k] = cnt > 0 ? sum / cnt : null;
      });
      return row as PreparedPoint;
    });
}, [ data, period ]);
