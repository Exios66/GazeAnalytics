import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface EyeTrackerProps {
  sessionId: string;
}

export function EyeTracker({ sessionId }: EyeTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { mutate: saveGazeData } = useMutation({
    mutationFn: async (data: { x: number; y: number }) => {
      return apiRequest("POST", "/api/gaze", {
        sessionId,
        x: Math.round(data.x),
        y: Math.round(data.y),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        accuracy: 1,
      });
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawGaze = (x: number, y: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#3498DB";
      ctx.fill();
    };

    // @ts-ignore - WebGazer is loaded via CDN
    window.webgazer.setGazeListener((data: any, timestamp: number) => {
      if (data == null) return;

      const { x, y } = data;
      drawGaze(x, y);
      saveGazeData({ x, y });
    });

    return () => {
      // @ts-ignore
      window.webgazer.clearGazeListener();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[300px] border border-gray-200 rounded-lg"
      width={800}
      height={600}
    />
  );
}
