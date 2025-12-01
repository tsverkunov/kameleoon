import React, { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { AreaClosed, LinePath } from "@visx/shape";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisLeft, AxisRight, AxisTop } from "@visx/axis";
import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import { bisector } from "d3-array";
import { curveBasis } from '@visx/curve';
import { Tooltip } from "../Tooltip/Tooltip.tsx";
import { useExportToPNG } from "../../hooks/useExportToPNG.ts";
import { AxisBottomSmart } from "./AxisBottomSmart.tsx";
import { VerticalGrid } from "./VerticalGrid/VerticalGrid.tsx";
import { useColorMap } from "../../hooks/useColorMap.ts";
import styles from "./Chart.module.scss";
import type { PreparedPoint } from "../../../utils/prepareChartData";
import { ControlPanel } from "../ControrlPanel/ControlPanel.tsx";
import type { Period, StyleMode } from "../../../types/types.ts";
import { chartStyles } from "../../assets/chartStyles.ts";

type Props = {
  data: PreparedPoint[];
  variations: { id: string; name: string }[];
  height?: number;
};

export default function LineChart({
                                    data,
                                    variations,
                                    height = 360,
                                  }: Props) {
  const [ selected, setSelected ] = useState<string[]>(
    variations.map((v) => v.id)
  );
  const [ period, setPeriod ] = useState<Period>("day");
  const [ styleMode, setStyleMode ] = useState<StyleMode>("line");
  const [ theme, setTheme ] = useState<"light" | "dark">("light");
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

  const displayData = useMemo(() => {
    if (period === "day") return data;
    const byWeek = new Map<string, { date: Date; sums: Record<string, number>; counts: Record<string, number> }>();
    data.forEach((d) => {
      const dt = d.date;
      const day = (dt.getUTCDay() + 6) % 7; // Monday-based week (UTC)
      const monday = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate() - day));
      const key = monday.toISOString().slice(0, 10);
      let entry = byWeek.get(key);
      if (!entry) {
        entry = { date: monday, sums: {}, counts: {} };
        byWeek.set(key, entry);
      }
      Object.keys(d).forEach((k) => {
        if (k === "date") return;
        const v = d[k] as number | null | undefined;
        if (typeof v === "number" && !isNaN(v)) {
          entry!.sums[k] = (entry!.sums[k] || 0) + v;
          entry!.counts[k] = (entry!.counts[k] || 0) + 1;
        }
      });
    });
    return Array.from(byWeek.values())
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((e) => {
        const row: any = { date: e.date };
        const keys = new Set([ ...Object.keys(e.sums), ...Object.keys(e.counts) ]);
        keys.forEach((k) => {
          const sum = e.sums[k] || 0;
          const cnt = e.counts[k] || 0;
          row[k] = cnt > 0 ? sum / cnt : null; // weekly average of daily values
        });
        return row as PreparedPoint;
      });
  }, [ data, period ]);

  // convert selected values to compute y domain
  const yDomain = useMemo(() => {
    const values: number[] = [];
    displayData.forEach((d) => {
      selected.forEach((id) => {
        const v = d[id] as number | null | undefined;
        if (typeof v === "number" && !isNaN(v)) values.push(v);
      });
    });
    const max = values.length ? Math.max(...values) : 1;
    const min = 0;
    return [ min, Math.ceil(max * 1.1) ];
  }, [ displayData, selected ]);

  return (
    <div className={styles.chartRoot}>
      <ControlPanel
        setSelected={setSelected}
        variations={variations}
        styleMode={styleMode}
        setStyleMode={setStyleMode}
        exportToPNG={exportToPNG}
        onFit={() => {}}
        onZoomOut={() => {}}
        onZoomIn={() => {}}
        onReset={() => {}}
        period={period}
        setPeriod={setPeriod}
        theme={theme}
        setTheme={setTheme}
      />
      <div className={`${styles.svgWrap} ${theme === "dark" ? styles.svgWrapDark : ""}`}>
        <ParentSize>
          {({ width, height: parentH }) => {
            const w = Math.max(320, width);
            const h = Math.max(240, Math.min(parentH || 400, 420, height));
            const xScale = scaleTime({
              domain: [ displayData[0]?.date ?? new Date(), displayData[displayData.length - 1]?.date ?? new Date() ],
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
              const index = Math.min(displayData.length - 1, Math.max(0, bisectDate(displayData, x0) - 1));
              const d0 = displayData[index] ?? displayData[0];
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
                  tickCount={period === "week" ? 6 : 12}
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
                      fill: chartStyles.fill,
                      fontSize: chartStyles.fontSize,
                      fontFamily: chartStyles.fontFamily,
                      fontWeight: chartStyles.fontWeight,
                      textAnchor: chartStyles.textAnchor,
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
                  <AxisBottomSmart
                    xScale={xScale}
                    height={h}
                    margin={margin}
                    tickCount={period === "week" ? 6 : 12}
                  />

                  {selected.map((id) => {
                    const stroke = colorMap[id];
                    return (
                      <g key={id}>
                        {styleMode === "area" && (
                          <AreaClosed
                            data={displayData}
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
                          data={displayData}
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
