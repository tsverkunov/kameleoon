import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { useTooltip } from "@visx/tooltip";
import { Tooltip } from "../Tooltip/Tooltip.tsx";
import { useExportToPNG } from "../../hooks/useExportToPNG.ts";
import { useColorMap } from "../../hooks/useColorMap.ts";
import styles from "./Chart.module.scss";
import type { PreparedPoint } from "../../../utils/prepareChartData";
import { ControlPanel } from "../ControrlPanel/ControlPanel.tsx";
import type { Period, StyleMode } from "../../../types/types.ts";
import { useDisplayData } from "../../hooks/useDisplayData.ts";
import { ResponsiveChart } from "./ResponsiveChart.tsx";

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
  const displayData = useDisplayData(data, period);

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
  } = useTooltip<{ point: PreparedPoint }>();

  const margin = { top: 18, right: 18, bottom: 36, left: 64 };

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
        onFit={() => {
        }}
        onZoomOut={() => {
        }}
        onZoomIn={() => {
        }}
        onReset={() => {
        }}
        period={period}
        setPeriod={setPeriod}
        theme={theme}
        setTheme={setTheme}
      />
      <div className={`${styles.svgWrap} ${theme === "dark" ? styles.svgWrapDark : ""}`}>
        <ParentSize>
          {({ width, height: parentH  }) => (
            <ResponsiveChart
              width={width}
              parentH={height ?? parentH}
              selected={selected}
              margin={margin}
              displayData={displayData}
              svgRef={svgRef}
              period={period}
              styleMode={styleMode}
              colorMap={colorMap}
              yDomain={yDomain}
              showTooltip={showTooltip}
              hideTooltip={hideTooltip}
              tooltipData={tooltipData}
              tooltipLeft={tooltipLeft}
            />
          )}
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
