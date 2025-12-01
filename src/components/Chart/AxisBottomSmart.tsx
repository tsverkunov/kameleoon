import { AxisBottom } from "@visx/axis";
import { timeFormat } from "d3-time-format";
import type { ScaleTime } from "d3-scale";
import { chartStyles } from "../../assets/chartStyles.ts";

const formatDate = timeFormat("%-d %b"); // 1 Jan

interface Props {
  xScale: ScaleTime<number, number>;
  height: number;
  margin: { left: number; right: number; bottom: number };
  tickCount?: number;
}

export function AxisBottomSmart({ xScale, height, margin, tickCount = 10 }: Props) {
  const domain = xScale.domain();
  const [start, end] = domain;

  const count = tickCount ?? 10;

  const ticks = [
    start,
    ...xScale.ticks(count).filter(
      (t) => t.getTime() !== start.getTime() && t.getTime() !== end.getTime(),
    ),
  ];

  return (
    <AxisBottom
      top={height - margin.bottom}
      scale={xScale}
      tickValues={ticks}
      tickStroke="none"
      stroke={chartStyles.stroke}
      tickFormat={(d) => formatDate(d as Date)}
      tickLabelProps={() => ({
        fill: chartStyles.fill,
        fontSize: chartStyles.fontSize,
        fontFamily: chartStyles.fontFamily,
        fontWeight: chartStyles.fontWeight,
        textAnchor: chartStyles.textAnchor,
        dy: 12,
      })}
    />
  );
}
