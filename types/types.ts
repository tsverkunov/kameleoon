export interface Variation {
  id?: number;
  name: string;
}

export interface DailyMetrics {
  date: string;
  visits: Partial<Record<string, number>>;
  conversions: Partial<Record<string, number>>;
}

export interface RawExperimentData {
  variations: Variation[];
  data: DailyMetrics[];
}

export interface ChartRow {
  date: string;
  [key: string]: string | number;
}

export type StyleMode = "line" | "smooth" | "area";
export type Period = "day" | "week";
