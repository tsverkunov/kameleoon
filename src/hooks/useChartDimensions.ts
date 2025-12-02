import { useMemo } from "react";

interface Props  {
  width: number,
  height: number,
  // margin: { top: number; right: number; bottom: number; left: number }
}

export const useChartDimensions = ({width, height}:Props) => {
  return useMemo(() => {
    const w = Math.max(320, width);
    const h = Math.max(240, Math.min(height || 400, 420));

    // const innerWidth = w - margin.left - margin.right;
    // const innerHeight = h - margin.top - margin.bottom;

    return { w, h };
  }, [width, height]);
};
