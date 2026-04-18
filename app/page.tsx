"use client";

import { useState, useCallback } from "react";
import { HeroSection } from "@/components/emergency/hero-section";
import { ControlPanel } from "@/components/emergency/control-panel";
import { CityMap } from "@/components/emergency/city-map";
import { ResultCards } from "@/components/emergency/result-cards";
import { AIInsightPanel } from "@/components/emergency/ai-insight-panel";
import { SystemIntelligence } from "@/components/emergency/system-intelligence";
import { AnimatedBackground } from "@/components/emergency/animated-background";

// --- Types & Constants ---
export interface DispatchResult {
  resourceType: string;
  eta: string;
  efficiency: number;
  path: number[];
  icon: string;
}

export interface Location {
  id: number;
  name: string;
  x: number;
  y: number;
}

const locations: Location[] = [
  { id: 1, name: "Downtown Hospital", x: 50, y: 30 },
  { id: 2, name: "Central Fire Station", x: 25, y: 50 },
  { id: 3, name: "Police HQ", x: 75, y: 45 },
  { id: 4, name: "Emergency Shelter", x: 40, y: 70 },
  { id: 5, name: "Tech District", x: 60, y: 20 },
  { id: 6, name: "Residential Zone A", x: 20, y: 25 },
  { id: 7, name: "Industrial Park", x: 80, y: 70 },
  { id: 8, name: "City Hall", x: 50, y: 50 },
];

const emergencyTypes = [
  { id: "fire", name: "Fire Emergency", icon: "🔥" },
  { id: "medical", name: "Medical Emergency", icon: "🏥" },
  { id: "crime", name: "Crime Report", icon: "🚨" },
  { id: "accident", name: "Traffic Accident", icon: "🚗" },
  { id: "natural", name: "Natural Disaster", icon: "🌊" },
];

// --- Main Component ---
export default function EmergencyCommandCenter() {
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [animatingPath, setAnimatingPath] = useState<number[] | null>(null);

  const handleStartSimulation = useCallback(() => {
    setIsSimulating(true);
    setDispatchResult(null);
    setAiInsight(null);
  }, []);

  /**
   * Fixed handleDeploy
   * 1. Merged the orphaned code back into the function
   * 2. Added validation to ensure a location is selected before fetching
   */
  const handleDeploy = useCallback(async () => {
  if (!selectedLocation || !selectedEmergency) return;

  try {
    console.log("Sending request...");

    const response = await fetch("http://127.0.0.1:5000/deploy", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    location: selectedLocation,
    emergency: selectedEmergency
  })
});

    console.log("Response received");

    const data = await response.json();
    console.log("Backend response:", data);

    let result;

if (Array.isArray(data) && data.length > 0) {
  result = data[0];
} else if (data && data.type) {
  result = data;
} else {
  console.error("Invalid backend response:", data);
  return;
}

setDispatchResult({
  resourceType: result.type,
  eta: `${result.eta} min`,
  efficiency: result.efficiency || 90,
  path: [1, selectedLocation],
  icon: "🚑"
});

setAiInsight(
  `Selected ${result.type} ${result.id || ""} using Graph + Priority Queue.`
);
  } catch (error) {
    console.error("ERROR:", error);
  }
}, [selectedLocation, selectedEmergency]);
  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <HeroSection onStartSimulation={handleStartSimulation} isSimulating={isSimulating} />
        
        {isSimulating && (
          <div className="container mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="lg:col-span-1">
                <ControlPanel
                  locations={locations}
                  emergencyTypes={emergencyTypes}
                  selectedLocation={selectedLocation}
                  selectedEmergency={selectedEmergency}
                  onLocationChange={setSelectedLocation}
                  onEmergencyChange={setSelectedEmergency}
                  onDeploy={handleDeploy}
                />
              </div>
              
              <div className="lg:col-span-2">
                <CityMap
                  locations={locations}
                  selectedLocation={selectedLocation}
                  animatingPath={animatingPath}
                  onLocationSelect={setSelectedLocation}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ResultCards result={dispatchResult} />
              <AIInsightPanel insight={aiInsight} />
            </div>
            
            <SystemIntelligence result={dispatchResult} />
          </div>
        )}
      </div>
    </main>
  );
}