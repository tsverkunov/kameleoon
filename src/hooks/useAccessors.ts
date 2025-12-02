import type { ScaleLinear, ScaleTime } from "d3-scale";
import type { PreparedPoint } from "../../utils/prepareChartData.ts";

interface Props {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
}
export const useAccessors = ({xScale, yScale}: Props) => {
  const getX = (d: PreparedPoint) => xScale(d.date) ?? 0;

  const getY = (d: PreparedPoint, id: string) => {
    const v = d[id];
    return typeof v === "number" ? yScale(v) : null;
  };

  return { getX, getY };
};
