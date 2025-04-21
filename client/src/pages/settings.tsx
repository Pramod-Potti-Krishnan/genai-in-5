import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Bell, Moon, Volume2, Clock } from "lucide-react";

export default function Settings() {
  return (
    <div className="container max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminders">Daily learning reminders</Label>
              <Switch id="daily-reminders" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="progress-updates">Progress updates</Label>
              <Switch id="progress-updates" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="new-content">New content alerts</Label>
              <Switch id="new-content" defaultChecked />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Volume2 className="h-5 w-5 mr-2" />
              Audio Settings
            </CardTitle>
            <CardDescription>
              Customize your listening experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-play">Auto-play next episode</Label>
              <Switch id="auto-play" defaultChecked />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="playback-speed">Default playback speed</Label>
              <Select defaultValue="1.0">
                <SelectTrigger id="playback-speed" className="w-full">
                  <SelectValue placeholder="Select speed" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2.0">2.0x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Moon className="h-5 w-5 mr-2" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the app's appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark mode</Label>
              <Switch id="dark-mode" />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="text-size">Larger text</Label>
              <Switch id="text-size" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full text-destructive">
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}