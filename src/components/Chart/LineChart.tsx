import React, { useCallback, useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { AreaClosed, LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisLeft, AxisRight, AxisTop } from "@visx/axis";
import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import { bisector } from "d3-array";
import { curveBasis } from '@visx/curve';
import { Tooltip } from "./Tooltip/Tooltip.tsx";
import { useExportToPNG } from "../../hooks/useExportToPNG.ts";
import { AxisBottomSmart } from "./AxisBottomSmart.tsx";
import { VerticalGrid } from "./VerticalGrid/VerticalGrid.tsx";
import { useColorMap } from "../../hooks/useColorMap.ts";
import styles from "./Chart.module.scss";
import type { PreparedPoint } from "../../../utils/prepareChartData";
import { ControlPanel } from "./ControrlPanel/ControlPanel.tsx";

type Props = {
  data: PreparedPoint[];
  variations: { id: string; name: string }[];
  height?: number;
  initialSelected?: string[];
};

type StyleMode = "line" | "smooth" | "area";


export default function LineChart({
                                    data,
                                    variations,
                                    height = 360,
                                    initialSelected,
                                  }: Props) {
  const [ selected, setSelected ] = useState<string[]>(
    initialSelected && initialSelected.length > 0
      ? initialSelected
      : variations.map((v) => v.id)
  );
  const [ styleMode, setStyleMode ] = useState<StyleMode>("line");
  const { exportToPNG, svgRef } = useExportToPNG();
  const colorMap = useColorMap({ variations });

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
  } = useTooltip<{ point: PreparedPoint }>();

  const bisectDate = bisector<PreparedPoint, Date>((d) => d.date).left;

  const margin = { top: 18, right: 18, bottom: 36, left: 64 };

  // convert selected values to compute y domain
  const yDomain = useMemo(() => {
    const values: number[] = [];
    data.forEach((d) => {
      selected.forEach((id) => {
        const v = d[id] as number | null | undefined;
        if (typeof v === "number" && !isNaN(v)) values.push(v);
      });
    });
    const max = values.length ? Math.max(...values) : 1;
    const min = 0;
    return [ min, Math.ceil(max * 1.1) ];
  }, [ data, selected ]);

  // helper to toggle variation
  const toggle = useCallback(
    (id: string) => {
      setSelected((prev) => {
        const next = prev.includes(id) ? prev.filter((p) => p !== id) : [ ...prev, id ];
        return next.length ? next : prev;
      });
    },
    [ setSelected ]
  );

  return (
    <div className={styles.chartRoot}>
      <ControlPanel
        selected={selected}
        variations={variations}
        toggle={toggle}
        styleMode={styleMode}
        setStyleMode={setStyleMode}
        exportToPNG={exportToPNG}
      />
      <div className={styles.svgWrap}>
        <ParentSize>
          {({ width, height: parentH }) => {
            const w = Math.max(320, width);
            const h = Math.max(240, Math.min(parentH || 400, 420, height));
            const xScale = scaleTime({
              domain: [ data[0]?.date ?? new Date(), data[data.length - 1]?.date ?? new Date() ],
              range: [ margin.left, w - margin.right ],
            });

            const yScale = scaleLinear({
              domain: yDomain,
              range: [ h - margin.bottom, margin.top ],
              nice: true,
            });

            const getX = (d: PreparedPoint) => xScale(d.date) ?? 0;
            const getY = (d: PreparedPoint, id: string) => {
              const v = d[id] as number | null | undefined;
              return typeof v === "number" ? yScale(v) : null;
            };

            // tooltip handlers
            const handleMouse = (event: React.MouseEvent<SVGRectElement, MouseEvent>) => {
              const point = localPoint(event) || { x: 0, y: 0 };
              const x0 = xScale.invert(point.x);
              const index = Math.min(data.length - 1, Math.max(0, bisectDate(data, x0) - 1));
              const d0 = data[index] ?? data[0];
              showTooltip({
                tooltipLeft: xScale(d0.date),
                tooltipTop: 10,
                tooltipData: { point: d0 },
              });
            };

            return (
              <svg ref={svgRef} width={w} height={h}>
                <VerticalGrid
                  xScale={xScale}
                  margin={margin}
                  height={h}
                />

                <rect x={0} y={0} width={w} height={h} fill="transparent" rx={6}/>
                <Group>
                  <AxisLeft
                    left={margin.left}
                    scale={yScale}
                    stroke="#E1DFE7"
                    tickStroke="none"
                    tickFormat={(v) =>
                      v === 0 ?
                        `${Number(v).toFixed(0)}` :
                        `${Number(v).toFixed(0)}%`
                    }
                    tickLabelProps={(value) => ({
                      fill: "#94A3B8",
                      fontSize: 11,
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 500,
                      textAnchor: "end",
                      dx: -8,
                      dy: value === 0 ? 15 : 3,
                      style: { paintOrder: "stroke" },
                    })}
                  />
                  <AxisRight
                    left={w - margin.right}
                    scale={yScale}
                    numTicks={0}
                    tickLength={0}
                    tickLabelProps={() => ({
                      display: "none"
                    })}
                    stroke="#E1DFE7"
                  />
                  <AxisTop
                    top={margin.top}
                    scale={xScale}
                    tickLabelProps={() => ({
                      display: "none"
                    })}
                    tickLength={0}
                    stroke="#E1DFE7"
                  />
                  <AxisBottomSmart xScale={xScale} height={h} margin={margin}/>

                  {selected.map((id) => {
                    const stroke = colorMap[id];
                    return (
                      <g key={id}>
                        {styleMode === "area" && (
                          <AreaClosed
                            data={data}
                            x={(d) => getX(d)}
                            y={(d) => {
                              const vy = getY(d, id);
                              return vy ?? h - margin.bottom;
                            }}
                            yScale={yScale}
                            stroke="transparent"
                            fill={stroke}
                            fillOpacity={0.12}
                          />
                        )}

                        <LinePath
                          data={data}
                          x={(d) => getX(d)}
                          y={(d) => {
                            const vy = getY(d, id);
                            return vy ?? h - margin.bottom;
                          }}
                          stroke={stroke}
                          strokeWidth={2}
                          strokeOpacity={selected.includes(id) ? 1 : 0.2}
                          {...(styleMode === "smooth" ? { curve: (curveBasis) } : {})}
                        />
                      </g>
                    );
                  })}

                  <rect
                    x={margin.left}
                    y={margin.top}
                    width={w - margin.left - margin.right}
                    height={h - margin.top - margin.bottom}
                    fill="transparent"
                    onMouseMove={handleMouse}
                    onMouseLeave={() => hideTooltip()}
                  />
                  {tooltipData?.point && (
                    <g>
                      <line
                        x1={tooltipLeft}
                        x2={tooltipLeft}
                        y1={margin.top}
                        y2={h - margin.bottom}
                        stroke="#94a3b8"
                        strokeDasharray="4 4"
                        strokeWidth={1}
                        pointerEvents="none"
                      />
                      <rect
                        x={tooltipLeft}
                        y={margin.top - 2}
                        width={230}
                        height={h - margin.top - margin.bottom + 4}
                        fill="#fff"
                        fillOpacity={1}
                        pointerEvents="none"
                      />
                    </g>
                  )}
                </Group>
              </svg>
            );
          }}
        </ParentSize>

        {
          tooltipData?.point && (
            <Tooltip
              tooltipData={tooltipData}
              tooltipLeft={tooltipLeft}
              selected={selected}
              colorMap={colorMap}
              variations={variations}
            />
          )
        }
      </div>
    </div>
  );
}
