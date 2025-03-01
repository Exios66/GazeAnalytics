import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CalibrationProps {
  onCalibrationComplete: () => void;
  sessionId: string;
}

export function Calibration({ onCalibrationComplete, sessionId }: CalibrationProps) {
  const { toast } = useToast();
  const [currentPoint, setCurrentPoint] = useState(0);
  const calibrationPoints = [
    { x: 10, y: 10 }, { x: 50, y: 10 }, { x: 90, y: 10 },
    { x: 10, y: 50 }, { x: 50, y: 50 }, { x: 90, y: 50 },
    { x: 10, y: 90 }, { x: 50, y: 90 }, { x: 90, y: 90 }
  ];

  useEffect(() => {
    const initWebGazer = async () => {
      try {
        // @ts-ignore - WebGazer is loaded via CDN
        await window.webgazer.setRegression('ridge')
          .setTracker('TFFacemesh')
          .begin();
        
        toast({
          title: "Webcam initialized",
          description: "Please look at each calibration point and click it",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not initialize webcam",
        });
      }
    };

    initWebGazer();

    return () => {
      // @ts-ignore
      window.webgazer.end();
    };
  }, []);

  const handlePointClick = () => {
    if (currentPoint < calibrationPoints.length - 1) {
      setCurrentPoint(current => current + 1);
    } else {
      onCalibrationComplete();
    }
  };

  return (
    <Card className="relative h-[600px] bg-white">
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
    </Card>
  );
}
