import { Button } from "@/components/ui/button";
import { Zap, Database, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onSeed: () => void;
  onSignOut: () => void;
}

export function DashboardHeader({ onSeed, onSignOut }: DashboardHeaderProps) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-xl blur-md opacity-50 -z-10" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">zkLiquidate</h1>
            <p className="text-xs text-muted-foreground">Protocol Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
            </div>
            <span className="font-medium">AggLayer Connected</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSeed}
            className="border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-all"
          >
            <Database className="mr-2 h-4 w-4" />
            Seed Data
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onSignOut}
            className="hover:bg-destructive/10 hover:text-destructive transition-all"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.header>
  );
}