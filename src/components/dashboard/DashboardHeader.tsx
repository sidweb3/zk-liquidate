import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface DashboardHeaderProps {
  onSeed: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({ onSeed, onSignOut }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">zkLiquidate Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            AggLayer Connected
          </div>
          <Button variant="outline" size="sm" onClick={onSeed}>Seed Data</Button>
          <Button variant="ghost" size="sm" onClick={onSignOut}>Sign Out</Button>
        </div>
      </div>
    </header>
  );
}
