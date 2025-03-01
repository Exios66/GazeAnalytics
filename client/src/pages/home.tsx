import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeTracker } from "@/components/EyeTracker";
import { Calibration } from "@/components/Calibration";
import { Heatmap } from "@/components/Heatmap";
import { Analytics } from "@/components/Analytics";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [sessionId] = useState(nanoid());
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const { toast } = useToast();

  const { mutate: createSession } = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/sessions", {
        sessionId,
        calibrationData: null,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create tracking session",
      });
    },
  });

  const { mutate: endSession } = useMutation({
    mutationFn: async () => {
      return apiRequest("PATCH", `/api/sessions/${sessionId}`);
    },
  });

  useEffect(() => {
    createSession();
    return () => {
      if (isTracking) {
        endSession();
      }
    };
  }, []);

  const handleTrackingToggle = (enabled: boolean) => {
    setIsTracking(enabled);
    if (!enabled) {
      endSession();
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-[#2C3E50] mb-4">
            Eye Tracking Visualization
          </h1>

          {!isCalibrated ? (
            <Calibration
              onCalibrationComplete={() => {
                setIsCalibrated(true);
                setIsTracking(true);
                toast({
                  title: "Calibration complete",
                  description: "Starting eye tracking visualization",
                });
              }}
              sessionId={sessionId}
            />
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => handleTrackingToggle(!isTracking)}
                  className={isTracking ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                >
                  {isTracking ? "Stop Tracking" : "Start Tracking"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EyeTracker 
                  sessionId={sessionId} 
                  isEnabled={isTracking}
                  onTrackingChange={handleTrackingToggle}
                />
                <Heatmap sessionId={sessionId} />
              </div>

              <Analytics sessionId={sessionId} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}