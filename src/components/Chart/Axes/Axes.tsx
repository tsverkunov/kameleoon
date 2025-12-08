import { VerticalGrid } from "../VerticalGrid.tsx";
import { AxisLeft, AxisRight, AxisTop } from "@visx/axis";
import { AxisBottomSmart } from "./AxisBottomSmart.tsx";
import type { ScaleLinear, ScaleTime } from "d3-scale";
import type { Margin, Period } from "../../../../types/types.ts";
import type { ChartStyles } from "../../../assets/chartStyles.ts";


interface Props {
  xScale: ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  margin: Margin;
  w: number;
  h: number;
  period: Period;
  chartStyles: ChartStyles;
}

export const Axes = ({ xScale, yScale, margin, w, h, period, chartStyles }: Props) => (
  <>
    <VerticalGrid
      xScale={xScale}
      margin={margin}
      height={h}
      tickCount={period === "week" ? 6 : 12}
    />

    <AxisLeft
      left={margin.left}
      scale={yScale}
      stroke="#E1DFE7"
      tickStroke="none"
      tickFormat={(v) => (v === 0 ? `${v}` : `${v}%`)}
      tickLabelProps={(value) => ({
        fill: chartStyles.fill,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.fontFamily,
        fontWeight: chartStyles.fontWeight,
        textAnchor: chartStyles.textAnchor,
        dx: -8,
        dy: value === 0 ? 15 : 3
      })}
    />

    <AxisRight
      left={w - margin.right}
      scale={yScale}
      numTicks={0}
      tickLength={0}
      tickLabelProps={() => ({ display: "none" })}
      stroke="#E1DFE7"
    />

    <AxisTop
      top={margin.top}
      scale={xScale}
      tickLabelProps={() => ({ display: "none" })}
      tickLength={0}
      stroke="#E1DFE7"
    />

    <AxisBottomSmart
      xScale={xScale}
      height={h}
      margin={margin}
      tickCount={period === "week" ? 6 : 12}
    />
  </>
);
