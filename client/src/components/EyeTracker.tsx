import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EyeTrackerProps {
  sessionId: string;
}

export function EyeTracker({ sessionId }: EyeTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(true);

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
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save gaze data",
      });
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const drawGaze = (x: number, y: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "#3498DB";
      ctx.fill();
    };

    let gazeListener: ((data: any, timestamp: number) => void) | null = null;

    if (isTracking) {
      try {
        // @ts-ignore - WebGazer is loaded via CDN
        if (!window.webgazer) {
          throw new Error("WebGazer not initialized");
        }

        gazeListener = (data: any, timestamp: number) => {
          if (data == null) return;
          const { x, y } = data;
          drawGaze(x, y);
          saveGazeData({ x, y });
        };

        // @ts-ignore
        window.webgazer.setGazeListener(gazeListener);
      } catch (error) {
        console.error("Error initializing eye tracker:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize eye tracking",
        });
      }
    } else {
      // Clear canvas when tracking is disabled
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => {
      try {
        if (gazeListener) {
          // @ts-ignore
          if (window.webgazer && typeof window.webgazer.clearGazeListener === 'function') {
            // @ts-ignore
            window.webgazer.clearGazeListener();
          }
        }
      } catch (error) {
        console.error("Error cleaning up eye tracker:", error);
      }
    };
  }, [isTracking]);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Live Eye Tracking</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isTracking}
            onCheckedChange={setIsTracking}
            id="tracking-toggle"
          />
          <Label htmlFor="tracking-toggle">Tracking {isTracking ? 'On' : 'Off'}</Label>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="w-full h-[300px] bg-white"
        style={{ cursor: "crosshair" }}
      />
    </div>
  );
}