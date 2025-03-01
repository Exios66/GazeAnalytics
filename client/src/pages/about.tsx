import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Github, ExternalLink, Mail } from "lucide-react";

export default function About() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>About GazeAnalytics</CardTitle>
            <CardDescription>
              A powerful eye tracking visualization and analytics platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Overview</h3>
              <p className="text-muted-foreground">
                GazeAnalytics is a web-based platform for eye tracking visualization and analysis. 
                It uses WebGazer.js to track eye movements through a webcam, providing real-time 
                heatmaps and analytics to help understand user attention patterns.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Features</h3>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Real-time eye tracking using your webcam</li>
                <li>Interactive heatmap visualization</li>
                <li>Detailed analytics and metrics</li>
                <li>Session recording and playback</li>
                <li>Data export for further analysis</li>
                <li>Customizable tracking settings</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Technology</h3>
              <p className="text-muted-foreground">
                GazeAnalytics is built with modern web technologies:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>React for the user interface</li>
                <li>WebGazer.js for eye tracking</li>
                <li>D3.js and Recharts for data visualization</li>
                <li>TanStack Query for data fetching</li>
                <li>Tailwind CSS and shadcn/ui for styling</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Privacy</h3>
              <p className="text-muted-foreground">
                Your privacy is important to us. All eye tracking data is processed locally in your 
                browser and is only sent to our servers if you explicitly choose to save a session. 
                No video data is ever stored, only the calculated gaze coordinates.
              </p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://github.com/example/gazeanalytics" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHub Repository
                  </a>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="https://example.com/docs" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Documentation
                  </a>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="mailto:support@example.com">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
              </div>
              
              <p className="text-xs text-center text-muted-foreground mt-6">
                © {new Date().getFullYear()} GazeAnalytics. All rights reserved.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 