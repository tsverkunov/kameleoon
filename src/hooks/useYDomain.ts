import { useMemo } from "react";
import type { PreparedPoint } from "../../utils/prepareChartData";

type Args = {
  displayData: PreparedPoint[];
  selected: string[];
};

export function useYDomain({ displayData, selected }: Args) {
  return useMemo<[number, number]>(() => {
    const values: number[] = [];

    displayData.forEach((d) => {
      selected.forEach((id) => {
        const v = d[id] as number | null | undefined;
        if (typeof v === "number" && !isNaN(v)) {
          values.push(v);
        }
      });
    });

    const max = values.length ? Math.max(...values) : 1;
    const min = 0;

    return [min, Math.ceil(max * 1.1)];
  }, [displayData, selected]);
}