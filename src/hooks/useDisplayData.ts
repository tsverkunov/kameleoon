import { useMemo } from "react";
import type { PreparedPoint } from "../../utils/prepareChartData.ts";
import type { Period } from "../../types/types.ts";

type Sums = Record<string, number>;
type Counts = Record<string, number>;

type WeeklyEntry = {
  monday: Date;    // дата понедельника недели (UTC)
  sums: Sums;      // сумма по каждому ключу
  counts: Counts;  // количество валидных значений по каждому ключу
};

/**
 * Хук: возвращает данные либо по дням, либо агрегированные по неделям (среднее).
 *
 * - data: массив PreparedPoint (должен содержать поле date: Date и прочие numeric поля)
 * - period: "day" | "week" (или другие — всё, что !== "day", будет агрегироваться по неделям)
 */
export const useDisplayData = (data: PreparedPoint[], period: Period): PreparedPoint[] =>
  useMemo<PreparedPoint[]>(() => {
    // 1) Быстрая ветка: если нам нужны дневные данные — возвращаем как есть.
    if (period === "day") return data;

    // 2) Map: key = "YYYY-MM-DD" понедельника (UTC) -> агрегирующая запись
    const byWeek = new Map<string, WeeklyEntry>();

    // Вспомогательная функция: вычисляет понедельник (UTC) для переданной даты
    const getMondayUTCKey = (dt: Date) => {
      // getUTCDay: 0 = Sunday, 1 = Monday, ...
      const day = (dt.getUTCDay() + 6) % 7; // смещение, чтобы Monday = 0
      const monday = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() - day));

      return monday.toISOString().slice(0, 10); // YYYY-MM-DD
    };

    // 3) Проходим по каждой точке данных и аккумулируем суммы и счётчики
    for (const point of data) {
      const key = getMondayUTCKey(point.date);
      let entry = byWeek.get(key);
      if (!entry) {
        // создаём новую запись недели
        const monday = new Date(Date.UTC(
          point.date.getUTCFullYear(),
          point.date.getUTCMonth(),
          point.date.getUTCDate())
        );
        const day = (point.date.getUTCDay() + 6) % 7;
        monday.setUTCDate(monday.getUTCDate() - day);
        entry = { monday, sums: {}, counts: {} };
        byWeek.set(key, entry);
      }

      // Перебираем поля точки и аккумулируем только числовые значения (игнорируем date и null/NaN)
      // Object.keys — безопасно, мы предполагаем что PreparedPoint — индексируемый тип
      for (const k of Object.keys(point)) {
        if (k === "date") continue;
        const v = point[k as keyof PreparedPoint] as unknown;
        if (typeof v === "number" && !Number.isNaN(v)) {
          entry.sums[k] = (entry.sums[k] ?? 0) + (v as number);
          entry.counts[k] = (entry.counts[k] ?? 0) + 1;
        }
      }
    }

    // 4) Преобразуем Map -> отсортированный массив PreparedPoint, вычисляя средние (sum / count)
    const result: PreparedPoint[] = Array.from(byWeek.values())
      .sort((a, b) => a.monday.getTime() - b.monday.getTime())
      .map((e) => {
        const row: Partial<PreparedPoint> = { date: e.monday };

        // Собираем все ключи, которые встречались в суммах/счётчиках
        const keys = new Set<string>([...Object.keys(e.sums), ...Object.keys(e.counts)]);
        for (const k of keys) {
          const sum = e.sums[k] ?? 0;
          const cnt = e.counts[k] ?? 0;
          row[k as keyof PreparedPoint] = cnt > 0 ? (sum / cnt) : null;
        }

        return row as PreparedPoint;
      });

    return result;
  }, [data, period]);
