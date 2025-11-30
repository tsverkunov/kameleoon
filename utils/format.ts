import { timeFormat } from "d3-time-format";
import type { TickFormatter } from "@visx/axis";
import type { NumberValue } from "d3-scale";

const formatMonth = timeFormat('%d');
export const tickFormatter: TickFormatter<Date | NumberValue> = (value) => {
  if (value instanceof Date) return formatMonth(value);
  const numeric = typeof value === 'number' ? value : value.valueOf();
  return formatMonth(new Date(numeric));
};