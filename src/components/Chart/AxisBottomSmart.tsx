import { AxisBottom } from "@visx/axis";
import { timeFormat } from "d3-time-format";
import type { ScaleTime } from "d3-scale";

const formatDate = timeFormat("%-d %b"); // 1 Jan

interface Props {
  xScale: ScaleTime<number, number>;
  height: number;
  margin: { left: number; right: number; bottom: number };
}

export function AxisBottomSmart({ xScale, height, margin }: Props) {
  const domain = xScale.domain();
  const [start, end] = domain;

  // генерируем 5 равномерно распределённых тиков + обязательные начало/конец
  const tickCount = 10;

  const ticks = [
    start,
    ...xScale.ticks(tickCount).filter(
      (t) => t.getTime() !== start.getTime() && t.getTime() !== end.getTime(),
    ),
  ];

  return (
    <AxisBottom
      top={height - margin.bottom}
      scale={xScale}
      tickValues={ticks}
      tickStroke="none"
      stroke="#E2E8F0"
      tickFormat={(d) => formatDate(d as Date)}
      tickLabelProps={() => ({
        fill: "#94A3B8",
        fontSize: 11,
        fontFamily: "Roboto, sans-serif",
        fontWeight: 500,
        textAnchor: "middle",
        dy: 12,
      })}
    />
  );
}