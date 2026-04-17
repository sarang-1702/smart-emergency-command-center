"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, AlertTriangle, Send, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Location } from "@/app/page";

interface ControlPanelProps {
  locations: Location[];
  emergencyTypes: Array<{ id: string; name: string; icon: string }>;
  selectedLocation: number | null;
  selectedEmergency: string | null;
  onLocationChange: (id: number | null) => void;
  onEmergencyChange: (id: string | null) => void;
  onDeploy: () => void;
}

export function ControlPanel({
  locations,
  emergencyTypes,
  selectedLocation,
  selectedEmergency,
  onLocationChange,
  onEmergencyChange,
  onDeploy,
}: ControlPanelProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing Network...");

  // Dynamic AI thinking messages
  useEffect(() => {
    if (isDeploying) {
      const steps = [
        "Analyzing Network...",
        "Mapping Graph Nodes...",
        "Running Dijkstra Algorithm...",
        "Optimizing Route...",
        "Dispatching Resource...",
      ];

      let index = 0;

      const interval = setInterval(() => {
        setLoadingText(steps[index % steps.length]);
        index++;
      }, 700);

      return () => clearInterval(interval);
    }
  }, [isDeploying]);

  const handleDeploy = () => {
    setIsDeploying(true);
    onDeploy();

    setTimeout(() => {
      setIsDeploying(false);
      setLoadingText("Analyzing Network...");
    }, 2500);
  };

  const canDeploy = selectedLocation && selectedEmergency && !isDeploying;

  return (
    <div className="glass-strong shadow-xl backdrop-blur rounded-3xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Live Control Panel</h2>
          <p className="text-sm text-muted-foreground">
            Configure emergency response
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Select Location
          </label>

          <Select
            value={selectedLocation?.toString() || ""}
            onValueChange={(value) =>
              onLocationChange(value ? parseInt(value) : null)
            }
          >
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Choose location..." />
            </SelectTrigger>

            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id.toString()}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Emergency */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Type
          </label>

          <Select
            value={selectedEmergency || ""}
            onValueChange={(value) => onEmergencyChange(value || null)}
          >
            <SelectTrigger className="rounded-xl h-12">
              <SelectValue placeholder="Select emergency..." />
            </SelectTrigger>

            <SelectContent>
              {emergencyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.icon} {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleDeploy}
          disabled={!canDeploy}
          className={`w-full h-14 rounded-xl font-semibold transition-all ${
            canDeploy
              ? "bg-gradient-to-r from-primary to-info text-white"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {isDeploying ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {loadingText}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Deploy Resources
            </>
          )}
        </Button>

        {/* STATUS */}
        <div className="flex items-center justify-center gap-2 pt-2 text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              canDeploy ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          <span>
            {canDeploy
              ? "System Ready"
              : "Select location and emergency"}
          </span>
        </div>
      </div>
    </div>
  );
}