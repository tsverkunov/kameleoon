import { useMemo } from "react";

interface Props  {
  width: number,
  height: number,
}

export const useChartDimensions = ({width, height}:Props) => {
  return useMemo(() => {
    const w = Math.max(320, width);
    const h = Math.max(240, Math.min(height || 400, 420));

    return { w, h };
  }, [width, height]);
};
