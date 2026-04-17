"use client";

import { Button } from "@/components/ui/button";
import { Zap, Shield, Activity } from "lucide-react";

interface HeroSectionProps {
  onStartSimulation: () => void;
  isSimulating: boolean;
}

export function HeroSection({ onStartSimulation, isSimulating }: HeroSectionProps) {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-4xl mx-auto">
        {/* Status indicators */}
        <div className="flex items-center justify-center gap-4 mb-8 animate-fade-in">
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">System Online</span>
          </div>
          <div className="glass px-4 py-2 rounded-full flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Real-time Monitoring</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-balance">
          <span className="bg-gradient-to-r from-primary via-info to-accent bg-clip-text text-transparent animate-gradient">
            AI Emergency
          </span>
          <br />
          <span className="text-foreground">Command Center</span>
        </h1>

        {/* Subtext */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          Real-time intelligent resource allocation powered by advanced data structures and AI optimization
        </p>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="w-5 h-5 text-primary" />
            <span>Graph Algorithms</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-5 h-5 text-accent" />
            <span>Priority Queues</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="w-5 h-5 text-info" />
            <span>Hash Maps</span>
          </div>
        </div>

        {/* CTA Button */}
        {!isSimulating && (
          <Button
            onClick={onStartSimulation}
            size="lg"
            className="relative group px-8 py-6 text-lg font-semibold rounded-2xl bg-gradient-to-r from-primary to-info text-primary-foreground hover:opacity-90 transition-all duration-300 glow-primary"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Start Simulation
            </span>
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-info opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
          </Button>
        )}

        {isSimulating && (
          <div className="glass-strong px-6 py-3 rounded-2xl inline-flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="font-medium text-foreground">Simulation Active</span>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" aria-hidden="true" />
    </section>
  );
}
