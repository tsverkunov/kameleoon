export interface Variation {
  id?: number;
  name: string;
}

export interface DailyMetrics {
  date: string;
  visits: Partial<Record<string, number>>;
  conversions: Partial<Record<string, number>>;
}

export type Margin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type StyleMode = "line" | "smooth" | "area";
export type Period = "day" | "week";
