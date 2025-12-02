import React from 'react';
import { localPoint } from '@visx/event';
import type { PreparedPoint } from "./prepareChartData.ts";
import type { ScaleTime } from "d3-scale";
import { bisector } from "d3-array";

type Deps = {
  xScale: ScaleTime<number, number>;
  displayData: PreparedPoint[];
  showTooltip: (args: { tooltipLeft?: number; tooltipTop?: number; tooltipData: { point: PreparedPoint }}) => void;
};

const bisectDate = bisector<PreparedPoint, Date>((d) => d.date).left;


export const makeHandleMouse = ({ xScale, displayData, showTooltip }: Deps): React.MouseEventHandler<SVGElement> =>
  (event) => {
    const point = localPoint(event) || { x: 0, y: 0 };
    const x0 = xScale.invert(point.x);
    const index = Math.min(displayData.length - 1, Math.max(0, bisectDate(displayData, x0) - 1));
    const d0 = displayData[index] ?? displayData[0];
    showTooltip({
      tooltipLeft: xScale(d0.date),
      tooltipTop: 10,
      tooltipData: { point: d0 },
    });
  };
