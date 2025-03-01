import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import { checkEyeTrackingSupport } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import "./EyeTracker.css";

interface EyeTrackerProps {
  sessionId: string;
  isEnabled: boolean;
  onTrackingChange: (enabled: boolean) => void;
}

export function EyeTracker({ sessionId, isEnabled, onTrackingChange }: EyeTrackerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [fallbackAvailable, setFallbackAvailable] = useState<boolean>(false);

  // Check device support on mount
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const support = await checkEyeTrackingSupport();
        setIsSupported(support.supported);
        setSupportError(support.error || null);
        setFallbackAvailable(support.fallbackAvailable || false);

        if (!support.supported) {
          onTrackingChange(false);
          toast({
            variant: "destructive",
            title: "Device Compatibility Issue",
            description: support.error || "Your device doesn't support eye tracking",
          });
        }
      } catch (error) {
        setIsSupported(false);
        setSupportError("Failed to check device compatibility");
        onTrackingChange(false);
      }
    };
    checkSupport();
  }, []);

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

    const setupTracking = async () => {
      if (!isSupported) {
        onTrackingChange(false);
        return;
      }

      if (isEnabled) {
        setIsInitializing(true);
        try {
          // @ts-ignore - WebGazer is loaded via CDN
          if (!window.webgazer) {
            throw new Error("WebGazer not initialized");
          }

          // Initialize WebGazer if needed
          // @ts-ignore
          if (!window.webgazer.isReady()) {
            // @ts-ignore
            await window.webgazer
              .setRegression('ridge')
              .setTracker('TFFacemesh')
              .begin();

            // Wait for initialization
            // @ts-ignore
            await new Promise((resolve) => window.webgazer.showVideoPreview(false).showPredictionPoints(false).ready(resolve));
          }

          // Set up gaze listener
          gazeListener = (data: any, timestamp: number) => {
            if (data == null) return;
            const { x, y } = data;
            drawGaze(x, y);
            saveGazeData({ x, y });
          };

          // @ts-ignore
          await window.webgazer.setGazeListener(gazeListener);

          toast({
            title: "Eye tracking enabled",
            description: "Now tracking eye movements",
          });
        } catch (error) {
          console.error("Error managing eye tracker:", error);
          onTrackingChange(false);
          setIsSupported(false);
          setSupportError(error instanceof Error ? error.message : "Failed to initialize eye tracking");

          toast({
            variant: "destructive",
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to manage eye tracking",
          });
        } finally {
          setIsInitializing(false);
        }
      } else {
        try {
          // Clean up tracking
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // @ts-ignore
          if (window.webgazer && typeof window.webgazer.clearGazeListener === 'function') {
            // @ts-ignore
            window.webgazer.clearGazeListener();
          }

          toast({
            title: "Eye tracking disabled",
            description: "Eye tracking has been paused",
          });
        } catch (error) {
          console.error("Error cleaning up eye tracker:", error);
        }
      }
    };

    setupTracking();

    return () => {
      if (gazeListener) {
        try {
          // @ts-ignore
          if (window.webgazer && typeof window.webgazer.clearGazeListener === 'function') {
            // @ts-ignore
            window.webgazer.clearGazeListener();
          }
        } catch (error) {
          console.error("Error cleaning up eye tracker:", error);
        }
      }
    };
  }, [isEnabled, isSupported]);

  if (isSupported === null) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-center h-[300px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Live Eye Tracking</h3>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isEnabled}
            onCheckedChange={onTrackingChange}
            id="tracking-toggle"
            disabled={!isSupported || isInitializing}
          />
          <Label htmlFor="tracking-toggle">
            {isInitializing ? (
              <div className="flex items-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Initializing...
              </div>
            ) : (
              `Tracking ${isEnabled ? 'On' : 'Off'}`
            )}
          </Label>
        </div>
      </div>

      {!isSupported && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {supportError || "Your device doesn't support eye tracking"}
            {fallbackAvailable && (
              <div className="mt-2">
                Note: Mouse tracking is available as a fallback option.
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      <canvas
        ref={canvasRef}
        className="eye-tracker-canvas"
      />
    </div>
  );
}