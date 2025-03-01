import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ArrowLeft, Download, Clock, Calendar, Database } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import { Analytics } from "@/components/Analytics";

interface Session {
  id: string;
  createdAt: string;
  endedAt: string | null;
  duration: number | null;
  dataPoints: number;
  calibrationData: any;
}

export default function SessionDetail() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/sessions/:id");
  const sessionId = params?.id || "";

  const { data: session, isLoading } = useQuery<Session>({
    queryKey: [`/api/sessions/${sessionId}`],
    enabled: !!sessionId,
  });

  const handleExportData = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${sessionId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] p-4 flex items-center justify-center">
        <p>Loading session data...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#ECF0F1] p-4">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="outline" 
            className="mb-4"
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[300px]">
              <h2 className="text-xl font-semibold mb-2">Session Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The session you're looking for doesn't exist or has been deleted.
              </p>
              <Button onClick={() => setLocation("/dashboard")}>
                Return to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="outline"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {format(new Date(session.createdAt), "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {session.duration ? `${session.duration} seconds` : "In progress"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Database className="h-5 w-5 mr-3 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Data Points</p>
                  <p className="font-medium">{session.dataPoints}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="heatmap">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="heatmap" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <Heatmap sessionId={sessionId} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <Analytics sessionId={sessionId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 