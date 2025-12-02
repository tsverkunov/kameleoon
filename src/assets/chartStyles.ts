export interface ChartStyles {
  fill: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  textAnchor: "start" | "end" | "middle" | "inherit";
  stroke: string;
}

export const chartStyles: ChartStyles = {
  fill: "#94A3B8",
  fontSize: 11,
  fontFamily: "Roboto, sans-serif",
  fontWeight: 500,
  textAnchor: "middle",
  stroke: "#E2E8F0",
}