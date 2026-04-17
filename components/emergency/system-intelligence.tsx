"use client";

import { useEffect, useRef, useState } from "react";
import { Network, Database, ListOrdered, Zap } from "lucide-react";
import type { DispatchResult } from "@/app/page";

interface Props {
  result: DispatchResult | null;
}

export function SystemIntelligence({ result }: Props) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: "0.5s" }}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">System Intelligence</h2>
        <p className="text-muted-foreground">Powered by advanced data structures</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GraphVisualization path={result?.path || []} />
        <HashMapVisualization selected={result?.resourceType} />
        <PriorityQueueVisualization />
      </div>
    </div>
  );
}






// ================= GRAPH =================

function GraphVisualization({ path }: { path: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes = [
      { x: 60, y: 40 },
      { x: 140, y: 40 },
      { x: 40, y: 100 },
      { x: 100, y: 100 },
      { x: 160, y: 100 },
    ];

    const edges = [
      [0, 1], [0, 2], [0, 3], [1, 3], [1, 4], [2, 3], [3, 4],
    ];

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, 200, 140);

      // edges
      edges.forEach(([from, to]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[from].x, nodes[from].y);
        ctx.lineTo(nodes[to].x, nodes[to].y);
        ctx.strokeStyle = "rgba(139,92,246,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // highlight path
      path.forEach((nodeIndex) => {
        const node = nodes[nodeIndex % nodes.length];

        ctx.beginPath();
        ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
      });

      // normal nodes
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5cf6";
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [JSON.stringify(path)]);

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Network className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Graph Network</h3>
      </div>

      <canvas ref={canvasRef} width={200} height={140} />

      <p className="text-xs text-center mt-3 text-muted-foreground">
        Path: {path.length ? path.join(" → ") : "Not calculated"}
      </p>
    </div>
  );
}






// ================= HASH MAP =================

function HashMapVisualization({ selected }: { selected?: string }) {
  const resources = [
    { id: "Ambulance", status: "Available" },
    { id: "Fire Truck", status: "Busy" },
    { id: "Police Unit", status: "Available" },
  ];

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <Database className="w-5 h-5 text-accent" />
        <h3 className="font-semibold">Hash Map</h3>
      </div>

      <div className="space-y-2">
        {resources.map((r, i) => (
          <div
            key={i}
            className={`flex justify-between p-2 rounded-lg ${
              selected === r.id ? "bg-green-100" : "bg-muted/30"
            }`}
          >
            <span>{r.id}</span>
            <span className="text-sm">{r.status}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center mt-3 text-muted-foreground">
        O(1) lookup using HashMap
      </p>
    </div>
  );
}






// ================= PRIORITY QUEUE =================

function PriorityQueueVisualization() {
  const priorities = [
    { level: "Critical", value: 1 },
    { level: "High", value: 2 },
    { level: "Medium", value: 3 },
    { level: "Low", value: 4 },
  ];

  const sorted = [...priorities].sort((a, b) => a.value - b.value);

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <ListOrdered className="w-5 h-5 text-info" />
        <h3 className="font-semibold">Priority Queue</h3>
      </div>

      <div className="space-y-2">
        {sorted.map((p, i) => (
          <div
            key={i}
            className={`flex justify-between p-2 rounded-lg ${
              i === 0 ? "bg-red-100" : "bg-muted/30"
            }`}
          >
            <span>{p.level}</span>
            <span>{p.value}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-center mt-3 text-muted-foreground">
        Min-Heap scheduling
      </p>
    </div>
  );
}