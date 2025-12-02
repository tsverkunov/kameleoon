import { useChartDimensions } from "../../hooks/useChartDimensions.ts";
import { useScales } from "../../hooks/useScale.ts";
import { useAccessors } from "../../hooks/useAccessors.ts";
import type { PreparedPoint } from "../../../utils/prepareChartData.ts";
import type { Ref } from "react";
import type { Period, StyleMode } from "../../../types/types.ts";
import { Axes } from "./Axes/Axes.tsx";
import { ChartSvg } from "./ChartSvg.tsx";
import { Lines } from "./Lines.tsx";
import { MouseOverlay } from "./MouseOverlay.tsx";
import { chartStyles } from "../../assets/chartStyles.ts";
import { makeHandleMouse } from "../../../utils/handleMouse.ts";

interface Props {
  width: number;
  parentH: number;
  displayData: PreparedPoint[];
  yDomain: number[];
  margin: { top: number; right: number; bottom: number; left: number };
  selected: string[];
  svgRef?: Ref<SVGSVGElement>;
  period: Period;
  styleMode: StyleMode;
  colorMap: Record<string, string>;
  showTooltip: (args: { tooltipLeft?: number; tooltipTop?: number; tooltipData: { point: PreparedPoint }}) => void;
  hideTooltip: () => void;
  tooltipData?: { point: PreparedPoint } | null;
  tooltipLeft?: number;
}

export function ResponsiveChart({
                                  width,
                                  parentH,
                                  displayData,
                                  yDomain,
                                  margin,
                                  selected,
                                  svgRef,
                                  period,
                                  styleMode,
                                  colorMap,
                                  showTooltip,
                                  hideTooltip,
                                  tooltipData,
                                  tooltipLeft,
                                }: Props) {
  const { w, h } = useChartDimensions({ width, height: parentH });
  const { xScale, yScale } = useScales({ displayData, yDomain, margin, w, h });
  const { getX, getY } = useAccessors({ xScale, yScale });
  const handleMouse = makeHandleMouse({
    xScale,
    displayData,
    showTooltip,
  });

  return (
      <ChartSvg w={w} h={h} svgRef={svgRef}>
        <Axes
          xScale={xScale}
          yScale={yScale}
          margin={margin}
          w={w}
          h={h}
          period={period}
          chartStyles={chartStyles}
        />
        {selected.map((id) => {
          const stroke = colorMap[id];
          return (
            <Lines
              key={id}
              margin={margin}
              h={h}
              yScale={yScale}
              selected={selected}
              id={id}
              stroke={stroke}
              displayData={displayData}
              getX={getX}
              getY={getY}
              styleMode={styleMode}
            />
          );
        })}
        <MouseOverlay
          margin={margin}
          w={w}
          h={h}
          handleMouse={handleMouse}
          handleLeave={() => hideTooltip()}
          tooltipData={tooltipData}
          tooltipLeft={tooltipLeft}
        />
      </ChartSvg>
  );
}