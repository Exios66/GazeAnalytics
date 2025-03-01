import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Settings {
  trackingFrequency: number;
  heatmapIntensity: number;
  enableDataExport: boolean;
  enableAutoCalibration: boolean;
  dataRetentionDays: number;
}

export default function Settings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<Settings>({
    trackingFrequency: 30,
    heatmapIntensity: 50,
    enableDataExport: true,
    enableAutoCalibration: false,
    dataRetentionDays: 30,
  });

  const { mutate: saveSettings, isPending } = useMutation({
    mutationFn: async (data: Settings) => {
      return apiRequest("POST", "/api/settings", data);
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings",
      });
    },
  });

  const handleSave = () => {
    saveSettings(settings);
  };

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Configure your eye tracking and visualization preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tracking">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tracking">Tracking</TabsTrigger>
                <TabsTrigger value="visualization">Visualization</TabsTrigger>
                <TabsTrigger value="data">Data Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tracking" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="trackingFrequency">Tracking Frequency (Hz)</Label>
                    <span className="text-sm text-muted-foreground">{settings.trackingFrequency} Hz</span>
                  </div>
                  <Slider
                    id="trackingFrequency"
                    min={10}
                    max={60}
                    step={5}
                    value={[settings.trackingFrequency]}
                    onValueChange={(value) => setSettings({...settings, trackingFrequency: value[0]})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher frequency provides more accurate data but may impact performance
                  </p>
                </div>
                
                <div className="flex items-center justify-between space-y-0 pt-2">
                  <Label htmlFor="autoCalibration">Auto-Calibration</Label>
                  <Switch
                    id="autoCalibration"
                    checked={settings.enableAutoCalibration}
                    onCheckedChange={(checked) => setSettings({...settings, enableAutoCalibration: checked})}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Automatically recalibrate when tracking accuracy decreases
                </p>
              </TabsContent>
              
              <TabsContent value="visualization" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="heatmapIntensity">Heatmap Intensity</Label>
                    <span className="text-sm text-muted-foreground">{settings.heatmapIntensity}%</span>
                  </div>
                  <Slider
                    id="heatmapIntensity"
                    min={10}
                    max={100}
                    step={5}
                    value={[settings.heatmapIntensity]}
                    onValueChange={(value) => setSettings({...settings, heatmapIntensity: value[0]})}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="data" className="space-y-4 pt-4">
                <div className="flex items-center justify-between space-y-0">
                  <Label htmlFor="dataExport">Enable Data Export</Label>
                  <Switch
                    id="dataExport"
                    checked={settings.enableDataExport}
                    onCheckedChange={(checked) => setSettings({...settings, enableDataExport: checked})}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Allow exporting session data in JSON format
                </p>
                
                <div className="space-y-2 pt-2">
                  <Label htmlFor="dataRetention">Data Retention Period (days)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    min={1}
                    max={365}
                    value={settings.dataRetentionDays}
                    onChange={(e) => setSettings({...settings, dataRetentionDays: parseInt(e.target.value) || 30})}
                  />
                  <p className="text-xs text-muted-foreground">
                    Sessions older than this will be automatically deleted
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 