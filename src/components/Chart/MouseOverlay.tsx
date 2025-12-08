import React from "react";
import { BackingForTooltip } from "../Tooltip/BackingForTooltip.tsx";
import type { PreparedPoint } from "../../../utils/prepareChartData.ts";
import type { Margin } from "../../../types/types.ts";


interface Props {
  w: number;
  h: number;
  margin: Margin;
  handleMouse: React.MouseEventHandler<SVGRectElement>;
  handleLeave: React.MouseEventHandler<SVGRectElement>;
  tooltipData?: { point: PreparedPoint } | null;
  tooltipLeft?: number;
}

export const MouseOverlay = ({
                               w,
                               h,
                               margin,
                               handleMouse,
                               handleLeave,
                               tooltipData,
                               tooltipLeft
                             }: Props) => (
  <>
    <rect
      x={margin.left}
      y={margin.top}
      width={w - margin.left - margin.right}
      height={h - margin.top - margin.bottom}
      fill="transparent"
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
    />

    {tooltipData?.point && (
      <BackingForTooltip tooltipLeft={tooltipLeft} margin={margin} h={h}/>
    )}
  </>
);
