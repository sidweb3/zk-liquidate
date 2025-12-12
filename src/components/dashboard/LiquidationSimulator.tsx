import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LiquidationSimulatorProps {
  onRunSimulation: (args: { targetAddress: string; targetHealthFactor: number }) => Promise<any>;
}

export function LiquidationSimulator({ onRunSimulation }: LiquidationSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      const simulationResult = await onRunSimulation({
        targetAddress: formData.get("address") as string,
        targetHealthFactor: parseFloat(formData.get("hf") as string),
      });
      
      setResult(simulationResult);
      
      if (simulationResult.success) {
        toast.success("Simulation successful! Liquidation is profitable.");
      } else {
        toast.warning("Simulation failed. Review parameters.");
      }
    } catch (error: any) {
      toast.error(error.message || "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Liquidation Simulator
        </CardTitle>
        <CardDescription>
          Test liquidation scenarios before executing on-chain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="grid gap-3">
            <Label htmlFor="sim-address">Target User Address</Label>
            <Input 
              id="sim-address" 
              name="address" 
              placeholder="0x..." 
              required 
              className="bg-background border-input" 
            />
          </div>
          
          <div className="grid gap-3">
            <Label htmlFor="sim-hf">Target Health Factor</Label>
            <Input 
              id="sim-hf" 
              name="hf" 
              type="number" 
              step="0.01" 
              placeholder="0.95" 
              required 
              className="bg-background border-input" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSimulating} 
            className="w-full bg-gradient-to-r from-primary to-accent text-black"
          >
            {isSimulating ? "Simulating..." : "Run Simulation"}
          </Button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-3"
          >
            <div className="p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Simulation Result</span>
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? "Success" : "Failed"}
                </Badge>
              </div>
              
              {result.success ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Est. Profit
                    </span>
                    <span className="font-bold text-green-500">
                      ${result.estimatedProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Est. Gas
                    </span>
                    <span className="font-mono text-sm">
                      {result.estimatedGas.toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span>Insufficient collateral or invalid parameters</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
