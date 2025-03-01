import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import * as d3 from "d3";
import { hexbin as d3Hexbin } from "d3-hexbin";
import type { GazeData } from "@shared/schema";
import type { HexbinBin } from "d3-hexbin";

interface HeatmapProps {
  sessionId: string;
}

type Point = [number, number];

export function Heatmap({ sessionId }: HeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const { data: gazeData } = useQuery<GazeData[]>({
    queryKey: ["/api/gaze", sessionId],
    refetchInterval: 1000,
  });

  useEffect(() => {
    if (!gazeData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;

    const colorScale = d3.scaleSequential()
      .domain([0, 10])
      .interpolator(d3.interpolateRgb("#FEF0D9", "#B30000"));

    const hexbinGenerator = d3Hexbin<Point>()
      .radius(20)
      .extent([[0, 0], [width, height]]);

    const points = gazeData.map(d => [d.x, d.y] as Point);
    const bins = hexbinGenerator(points);

    svg.selectAll("path")
      .data(bins)
      .enter()
      .append("path")
      .attr("d", hexbinGenerator.hexagon())
      .attr("transform", (d: HexbinBin<Point>) => `translate(${d.x},${d.y})`)
      .attr("fill", (d: HexbinBin<Point>) => colorScale(d.length))
      .attr("opacity", 0.7);

  }, [gazeData]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-2">Gaze Heatmap</h3>
      <svg
        ref={svgRef}
        className="w-full h-[300px]"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
