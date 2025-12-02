import { AreaClosed, LinePath } from "@visx/shape";
import { curveBasis } from "@visx/curve";
import type { PreparedPoint } from "../../../utils/prepareChartData.ts";
import type { ScaleLinear } from "d3-scale";


interface Props {
  styleMode: "line" | "area" | "smooth";
  displayData: PreparedPoint[];
  getX: (d: PreparedPoint) => number;
  getY: (d: PreparedPoint, id: string) => number | null;
  id: string;
  stroke: string;
  selected: string[];
  h: number;
  margin: { top: number; bottom: number };
  yScale: ScaleLinear<number, number>;
}

export const Lines = ({
                        styleMode,
                        displayData,
                        getX,
                        getY,
                        id,
                        stroke,
                        selected,
                        h,
                        margin,
                        yScale,
                      }: Props) => {
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
};
