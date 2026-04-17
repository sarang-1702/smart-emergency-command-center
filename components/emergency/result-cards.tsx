"use client";

import { Clock, Gauge, Truck, Route } from "lucide-react";
import type { DispatchResult } from "@/app/page";
import { useEffect, useState } from "react";

interface ResultCardsProps {
  result: DispatchResult | null;
}

export function ResultCards({ result }: ResultCardsProps) {
  const [animatedEfficiency, setAnimatedEfficiency] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setIsVisible(true);

      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setAnimatedEfficiency(progress * result.efficiency);

        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    } else {
      setIsVisible(false);
      setAnimatedEfficiency(0);
    }
  }, [result]);

  if (!isVisible && !result) {
    return (
      <div className="glass shadow-xl backdrop-blur rounded-3xl p-6 animate-slide-up">
        <h2 className="font-semibold text-foreground mb-4">Smart Result Cards</h2>
        <div className="text-center py-12 text-muted-foreground">
          <Truck className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Deploy resources to see intelligent dispatch results</p>
        </div>
      </div>
    );
  }

  const getEfficiencyColor = () => {
    if (!result) return "bg-gray-400";
    if (result.efficiency > 90) return "bg-green-500";
    if (result.efficiency > 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEfficiencyLabel = () => {
    if (!result) return "";
    if (result.efficiency > 90) return "High Efficiency";
    if (result.efficiency > 75) return "Moderate Efficiency";
    return "Low Efficiency";
  };

  return (
    <div className="glass-strong shadow-xl backdrop-blur rounded-3xl p-6 animate-slide-up">
      <h2 className="font-semibold text-foreground mb-6">Dispatch Results</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Resource */}
        <div className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all">
          <div className="flex justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              {result?.icon}
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-center leading-none">
                Dispatched
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Resource</p>
          <p className="text-lg font-semibold">{result?.resourceType}</p>
        </div>

        {/* ETA */}
        <div className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all">
          <div className="flex justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-center leading-none">
              Live
            </span>
          </div>
          <p className="text-sm text-muted-foreground">ETA</p>
          <p className="text-3xl font-bold">{result?.eta}</p>
        </div>

        {/* Efficiency */}
        <div className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all">
          <div className="flex justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Gauge className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-center leading-none">
              AI Optimized
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Efficiency</p>
          <p className="text-xs mb-2">{getEfficiencyLabel()}</p>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`${getEfficiencyColor()} h-2 rounded-full transition-all duration-1000`}
                style={{ width: `${animatedEfficiency}%` }}
              />
            </div>
            <span className="font-bold">{Math.round(animatedEfficiency)}%</span>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Computed using shortest path optimization (Graph + Priority Queue)
          </p>
        </div>

        {/* Route */}
        <div className="glass rounded-2xl p-5 hover:scale-[1.02] transition-all">
          <div className="flex justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Route className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-center leading-none">
              Calculated
            </span>
          </div>

          <p className="text-sm text-muted-foreground">Route</p>

          <div className="flex items-center gap-1 mt-2">
            {result?.path.map((node, index) => (
              <span key={index} className="flex items-center">
                <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                  {node}
                </span>
                {index < (result?.path.length || 0) - 1 && (
                  <span className="w-4 h-0.5 bg-primary/30 mx-0.5" />
                )}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}