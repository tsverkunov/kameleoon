import { useMemo } from "react";


const defaultColors = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#7C3AED",
  "#0EA5E9",
];

export const useColorMap = ({
  variations
}: {
  variations: { id: string; name: string }[];
}) => {
  return useMemo(() => {
    const map: Record<string, string> = {};
    variations.forEach((v, i) => {
      map[v.id] = defaultColors[i % defaultColors.length];
    });
    return map;
  }, [ variations ]);
};
