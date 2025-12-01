import { Line } from "@visx/shape";
import type { ScaleTime } from "d3-scale";

interface VerticalGridProps {
  xScale: ScaleTime<number, number>;
  margin: { top: number; bottom: number };
  height: number;
  tickCount?: number;
}

export function VerticalGrid({
                               xScale,
                               margin,
                               height,
                               tickCount = 10,
                             }: VerticalGridProps) {
  const xTicks = xScale.ticks(tickCount ?? 10);

  return (
    <>
      {xTicks.map((t) => {
        const x = xScale(t);
        if (x == null) return null;
        return (
          <Line
            key={+t}
            from={{ x: x + 4, y: margin.top }}
            to={{ x: x + 4, y: height - margin.bottom }}
            stroke="#E2E8F0"
            strokeDasharray="10 10"
            strokeWidth={1}
          />
        );
      })}
    </>
  );
}