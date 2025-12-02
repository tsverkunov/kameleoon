interface Props {
  tooltipLeft?: number;
  margin: { top: number; bottom: number };
  h: number;
}
export const BackingForTooltip = (
  {
    tooltipLeft,
    margin,
    h,
  }: Props
) => {
  return (
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
  );
};
