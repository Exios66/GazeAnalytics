import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CalibrationProps {
  onCalibrationComplete: () => void;
  sessionId: string;
}

export function Calibration({ onCalibrationComplete, sessionId }: CalibrationProps) {
  const { toast } = useToast();
  const [currentPoint, setCurrentPoint] = useState(0);
  const [isWebgazerReady, setIsWebgazerReady] = useState(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const calibrationPoints = [
    { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
    { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
    { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 }
  ];

  useEffect(() => {
    // Check for webcam support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Your browser doesn't support webcam access",
      });
      return;
    }

    return () => {
      cleanupWebGazer();
    };
  }, []);

  const initWebGazer = async () => {
    try {
      // @ts-ignore - WebGazer is loaded via CDN
      if (!window.webgazer) {
        throw new Error("WebGazer.js not loaded");
      }

      // @ts-ignore
      await window.webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .begin();

      // Wait for webcam initialization
      // @ts-ignore
      await new Promise((resolve) => window.webgazer.showVideoPreview(false).showPredictionPoints(false).ready(resolve));

      setIsWebgazerReady(true);
      setIsWebcamEnabled(true);
      toast({
        title: "Webcam initialized",
        description: "Click 'Start Calibration' when ready",
      });
    } catch (error) {
      console.error('WebGazer initialization error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not initialize webcam. Please ensure camera permissions are granted.",
      });
      setIsWebcamEnabled(false);
    }
  };

  const cleanupWebGazer = () => {
    try {
      // @ts-ignore
      if (window.webgazer && typeof window.webgazer.end === 'function') {
        // @ts-ignore
        window.webgazer.end();
        setIsWebgazerReady(false);
        setIsWebcamEnabled(false);
        setIsCalibrating(false);
        setCurrentPoint(0);
      }
    } catch (error) {
      console.error('Error cleaning up WebGazer:', error);
    }
  };

  const handleWebcamToggle = async (enabled: boolean) => {
    if (enabled) {
      await initWebGazer();
    } else {
      cleanupWebGazer();
    }
    setIsWebcamEnabled(enabled);
  };

  const startCalibration = () => {
    setIsCalibrating(true);
    toast({
      title: "Starting calibration",
      description: "Please look at each calibration point and click it",
    });
  };

  const handlePointClick = () => {
    if (currentPoint < calibrationPoints.length - 1) {
      setCurrentPoint(current => current + 1);
    } else {
      setIsCalibrating(false);
      onCalibrationComplete();
    }
  };

  if (!isWebgazerReady && isWebcamEnabled) {
    return (
      <Card className="relative h-[600px] bg-white flex items-center justify-center">
        <p>Initializing webcam...</p>
      </Card>
    );
  }

  return (
    <Card className="relative h-[600px] bg-white">
      <div className="absolute top-4 left-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isWebcamEnabled}
            onCheckedChange={handleWebcamToggle}
            id="webcam-toggle"
          />
          <Label htmlFor="webcam-toggle">Webcam {isWebcamEnabled ? 'On' : 'Off'}</Label>
        </div>
        {isWebgazerReady && !isCalibrating && (
          <Button onClick={startCalibration}>
            Start Calibration
          </Button>
        )}
      </div>

      {isCalibrating && (
        <>
          <div className="absolute inset-0">
            {calibrationPoints.map((point, index) => (
              <div
                key={index}
                className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentPoint
                    ? "bg-[#E74C3C] scale-125"
                    : index < currentPoint
                    ? "bg-[#3498DB]"
                    : "bg-gray-300"
                }`}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={index === currentPoint ? handlePointClick : undefined}
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-center">
            <p className="text-[#2C3E50]">
              Look at the red dot and click it ({currentPoint + 1}/9)
            </p>
          </div>
        </>
      )}

      {!isCalibrating && !isWebcamEnabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Enable webcam to start eye tracking</p>
        </div>
      )}

      {!isCalibrating && isWebcamEnabled && !isWebgazerReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Initializing eye tracking...</p>
        </div>
      )}

      {!isCalibrating && isWebgazerReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">Click 'Start Calibration' when ready</p>
        </div>
      )}
    </Card>
  );
}