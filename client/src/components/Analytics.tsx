import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { GazeData } from "@shared/schema";

interface AnalyticsProps {
  sessionId: string;
}

export function Analytics({ sessionId }: AnalyticsProps) {
  const { data: gazeData } = useQuery<GazeData[]>({
    queryKey: ["/api/gaze", sessionId],
    refetchInterval: 1000,
  });

  const processedData = gazeData?.map((data) => ({
    timestamp: new Date(data.timestamp).getTime(),
    x: data.x,
    y: data.y,
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-4">Gaze Analytics</h3>
      
      <div className="h-[300px]">
        {processedData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processedData}>
              <XAxis
                dataKey="timestamp"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Line
                type="monotone"
                dataKey="x"
                stroke="#2C3E50"
                dot={false}
                name="X Position"
              />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#E74C3C"
                dot={false}
                name="Y Position"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
