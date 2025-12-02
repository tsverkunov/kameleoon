import { Group } from "@visx/group";
import { type ReactNode, type Ref } from "react";

interface Props {
  w: number,
  h: number,
  svgRef?: Ref<SVGSVGElement>,
  children: ReactNode
}
export const ChartSvg = ({ w, h, svgRef, children }: Props) => (
  <svg ref={svgRef} width={w} height={h}>
    <Group>{children}</Group>
  </svg>
);
