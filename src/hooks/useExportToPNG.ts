import { useCallback, useRef } from "react";


export const useExportToPNG = () => {

  const svgRef = useRef<SVGSVGElement | null>(null);

  const exportToPNG = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    // create canvas
    const canvas = document.createElement("canvas");
    const bbox = svg.getBBox();
    canvas.width = Math.max(800, Math.ceil(bbox.width));
    canvas.height = Math.max(400, Math.ceil(bbox.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([ source ], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const a = document.createElement("a");
      a.download = "chart.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }, []);

  return {exportToPNG , svgRef};
}