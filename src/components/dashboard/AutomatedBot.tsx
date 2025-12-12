import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, Zap, Activity } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AutomatedBot() {
  const config = useQuery(api.protocol.getBotConfig);
  const updateConfig = useMutation(api.protocol.updateBotConfig);
  
  const [isActive, setIsActive] = useState(false);
  const [minHF, setMinHF] = useState("0.8");
  const [maxHF, setMaxHF] = useState("1.0");
  const [minProfit, setMinProfit] = useState("100");
  const [autoExecute, setAutoExecute] = useState(false);

  useEffect(() => {
    if (config) {
      setIsActive(config.isActive);
      setMinHF(config.minHealthFactor.toString());
      setMaxHF(config.maxHealthFactor.toString());
      setMinProfit(config.minProfitThreshold.toString());
      setAutoExecute(config.autoExecute);
    }
  }, [config]);

  const handleSave = async () => {
    try {
      await updateConfig({
        isActive,
        minHealthFactor: parseFloat(minHF),
        maxHealthFactor: parseFloat(maxHF),
        minProfitThreshold: parseFloat(minProfit),
        targetChains: ["80002", "1442"],
        autoExecute,
      });
      toast.success("Bot configuration updated!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update configuration");
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <CardTitle>Automated Liquidation Bot</CardTitle>
          </div>
          <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
            <Activity className={`w-3 h-3 ${isActive ? "animate-pulse" : ""}`} />
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardDescription>
          Set parameters and let the bot execute liquidations automatically
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Bot Status</p>
              <p className="text-sm text-muted-foreground">
                {isActive ? "Monitoring for opportunities" : "Paused"}
              </p>
            </div>
          </div>
          <Switch checked={isActive} onCheckedChange={setIsActive} />
        </div>

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-hf">Min Health Factor</Label>
              <Input
                id="min-hf"
                type="number"
                step="0.01"
                value={minHF}
                onChange={(e) => setMinHF(e.target.value)}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-hf">Max Health Factor</Label>
              <Input
                id="max-hf"
                type="number"
                step="0.01"
                value={maxHF}
                onChange={(e) => setMaxHF(e.target.value)}
                className="bg-background"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-profit">Min Profit Threshold ($)</Label>
            <Input
              id="min-profit"
              type="number"
              value={minProfit}
              onChange={(e) => setMinProfit(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-accent" />
              <div>
                <p className="font-medium">Auto-Execute</p>
                <p className="text-sm text-muted-foreground">
                  Execute liquidations without manual approval
                </p>
              </div>
            </div>
            <Switch checked={autoExecute} onCheckedChange={setAutoExecute} />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          className="w-full bg-gradient-to-r from-primary to-accent text-black"
        >
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
