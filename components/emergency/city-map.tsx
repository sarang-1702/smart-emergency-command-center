"use client";

import { useEffect, useRef, useState } from "react";
import type { Location } from "@/app/page";

interface CityMapProps {
  locations: Location[];
  selectedLocation: number | null;
  animatingPath: number[] | null;
  onLocationSelect: (id: number) => void;
}

const connections = [
  [1, 5], [1, 8], [1, 5],
  [2, 6], [2, 8], [2, 4],
  [3, 8], [3, 7], [3, 5],
  [4, 8], [4, 7], [4, 2],
  [5, 1], [5, 3], [5, 8],
  [6, 2], [6, 1],
  [7, 3], [7, 4],
  [8, 1], [8, 2], [8, 3], [8, 4], [8, 5],
];

export function CityMap({ locations, selectedLocation, animatingPath, onLocationSelect }: CityMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dotPosition, setDotPosition] = useState<{ x: number; y: number } | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    if (!animatingPath || animatingPath.length < 2) {
      setDotPosition(null);
      setAnimationProgress(0);
      return;
    }

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimationProgress(progress);

      // Calculate position along path
      const totalSegments = animatingPath.length - 1;
      const currentSegment = Math.floor(progress * totalSegments);
      const segmentProgress = (progress * totalSegments) - currentSegment;

      if (currentSegment < totalSegments) {
        const start = locations.find(l => l.id === animatingPath[currentSegment]);
        const end = locations.find(l => l.id === animatingPath[currentSegment + 1]);

        if (start && end) {
          setDotPosition({
            x: start.x + (end.x - start.x) * segmentProgress,
            y: start.y + (end.y - start.y) * segmentProgress,
          });
        }
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setDotPosition(null);
          setAnimationProgress(0);
        }, 500);
      }
    };

    requestAnimationFrame(animate);
  }, [animatingPath, locations]);

  const getPathColor = (fromId: number, toId: number) => {
    if (!animatingPath) return "rgba(139, 92, 246, 0.15)";
    
    for (let i = 0; i < animatingPath.length - 1; i++) {
      if (
        (animatingPath[i] === fromId && animatingPath[i + 1] === toId) ||
        (animatingPath[i] === toId && animatingPath[i + 1] === fromId)
      ) {
        return "rgba(139, 92, 246, 0.8)";
      }
    }
    return "rgba(139, 92, 246, 0.15)";
  };

  return (
    <div 
      className="glass-strong rounded-3xl p-6 animate-slide-up h-full min-h-[400px]" 
      style={{ animationDelay: "0.2s" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold text-foreground">Interactive City Map</h2>
          <p className="text-sm text-muted-foreground">Click nodes to select locations</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span>Nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-8 h-0.5 bg-primary/30" />
            <span>Routes</span>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[350px] bg-gradient-to-br from-secondary/30 to-muted/30 rounded-2xl overflow-hidden">
        <svg
          ref={svgRef}
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="rgba(139, 92, 246, 0.05)"
                strokeWidth="0.5"
              />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.8)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
            </linearGradient>
          </defs>

          <rect width="100" height="100" fill="url(#grid)" />

          {/* Connections */}
          {connections.map(([from, to], index) => {
            const fromLoc = locations.find(l => l.id === from);
            const toLoc = locations.find(l => l.id === to);
            if (!fromLoc || !toLoc) return null;

            const isActivePath = animatingPath?.includes(from) && animatingPath?.includes(to);

            return (
              <line
                key={`${from}-${to}-${index}`}
                x1={fromLoc.x}
                y1={fromLoc.y}
                x2={toLoc.x}
                y2={toLoc.y}
                stroke={getPathColor(from, to)}
                strokeWidth={isActivePath ? "0.8" : "0.4"}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            );
          })}

          {/* Nodes */}
          {locations.map((location) => {
            const isSelected = selectedLocation === location.id;
            const isInPath = animatingPath?.includes(location.id);

            return (
              <g key={location.id}>
                {/* Outer glow ring */}
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={isSelected ? 5 : 3}
                  fill="none"
                  stroke={isSelected ? "rgba(139, 92, 246, 0.3)" : "transparent"}
                  strokeWidth="2"
                  className="transition-all duration-300"
                />
                
                {/* Pulse animation for path nodes */}
                {isInPath && (
                  <circle
                    cx={location.x}
                    cy={location.y}
                    r="4"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.5)"
                    strokeWidth="1"
                    className="animate-ping"
                  />
                )}

                {/* Main node */}
                <circle
                  cx={location.x}
                  cy={location.y}
                  r={isSelected ? 3 : 2}
                  fill={isSelected ? "#8b5cf6" : isInPath ? "#8b5cf6" : "#a78bfa"}
                  filter={isSelected ? "url(#glow)" : undefined}
                  className="cursor-pointer transition-all duration-300 hover:r-3"
                  onClick={() => onLocationSelect(location.id)}
                />

                {/* Inner dot */}
                <circle
                  cx={location.x}
                  cy={location.y}
                  r="0.8"
                  fill="white"
                  className="pointer-events-none"
                />

                {/* Label */}
                <text
                  x={location.x}
                  y={location.y - 5}
                  fontSize="2.5"
                  fill="rgba(139, 92, 246, 0.8)"
                  textAnchor="middle"
                  className="pointer-events-none font-medium"
                >
                  {location.name}
                </text>
              </g>
            );
          })}

          {/* Traveling dot */}
          {dotPosition && (
            <g>
              <circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r="3"
                fill="none"
                stroke="rgba(239, 68, 68, 0.3)"
                strokeWidth="2"
                className="animate-ping"
              />
              <circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r="2"
                fill="#ef4444"
                filter="url(#glow)"
              />
              <circle
                cx={dotPosition.x}
                cy={dotPosition.y}
                r="0.5"
                fill="white"
              />
            </g>
          )}
        </svg>

        {/* Animation progress indicator */}
        {animatingPath && animationProgress > 0 && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-emergency rounded-full transition-all duration-100"
                style={{ width: `${animationProgress * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
