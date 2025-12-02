import { useMemo } from "react";
import { scaleTime, scaleLinear } from "@visx/scale";
import type { PreparedPoint } from "../../utils/prepareChartData.ts";


interface Props {
  displayData: PreparedPoint[];
  yDomain: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  w: number;
  h: number;
}
export const useScales = ({displayData, yDomain, margin, w, h}: Props) => {
  return useMemo(() => {
    const xScale = scaleTime({
      domain: [
        displayData[0]?.date ?? new Date(),
        displayData[displayData.length - 1]?.date ?? new Date()
      ],
      range: [margin.left, w - margin.right]
    });

    const yScale = scaleLinear({
      domain: yDomain,
      range: [h - margin.bottom, margin.top],
      nice: true
    });

    return { xScale, yScale };
  }, [displayData, yDomain, margin, w, h]);
};
