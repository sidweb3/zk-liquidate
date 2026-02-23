import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, Zap, Activity, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";

export function AutomatedBot() {
  const config = useQuery(api.protocol.getBotConfig);
  const updateConfig = useMutation(api.protocol.updateBotConfig);

  const [isActive, setIsActive] = useState(false);
  const [minHF, setMinHF] = useState("0.8");
  const [maxHF, setMaxHF] = useState("1.0");
  const [minProfit, setMinProfit] = useState("100");
  const [autoExecute, setAutoExecute] = useState(false);

  useEffect(() => {
    if (config != null) {
      setIsActive(config.isActive ?? false);
      setMinHF(String(config.minHealthFactor ?? 0.8));
      setMaxHF(String(config.maxHealthFactor ?? 1.0));
      setMinProfit(String(config.minProfitThreshold ?? 100));
      setAutoExecute(config.autoExecute ?? false);
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
      toast.success("Bot configuration saved!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update configuration");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Automated Liquidation Bot</h2>
        <p className="text-sm text-muted-foreground">Configure and manage the automated liquidation bot</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Status card */}
        <Card className="border-border/60 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? "bg-green-500/10" : "bg-muted/50"}`}>
              <Bot className={`w-5 h-5 ${isActive ? "text-green-500" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className="font-medium text-sm">Bot Status</p>
              <Badge variant="outline" className={isActive ? "bg-green-500/10 text-green-500 border-green-500/20 text-xs" : "bg-muted/50 text-muted-foreground border-border text-xs"}>
                <Activity className={`w-3 h-3 mr-1 ${isActive ? "animate-pulse" : ""}`} />
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{isActive ? "Monitoring for opportunities" : "Bot is paused"}</span>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </Card>

        {/* Stats */}
        {[
          { label: "Opportunities Found", value: "—", icon: Activity },
          { label: "Auto-Execute", value: autoExecute ? "Enabled" : "Disabled", icon: Zap },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="border-border/60 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-xl font-bold">{stat.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Configuration */}
      <Card className="border-border/60">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4 text-primary" />
            Bot Configuration
          </CardTitle>
          <CardDescription>Set the parameters for automated liquidation detection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min-hf" className="text-sm">Min Health Factor</Label>
              <Input
                id="min-hf"
                type="number"
                step="0.01"
                value={minHF}
                onChange={(e) => setMinHF(e.target.value)}
                className="bg-background border-border/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-hf" className="text-sm">Max Health Factor</Label>
              <Input
                id="max-hf"
                type="number"
                step="0.01"
                value={maxHF}
                onChange={(e) => setMaxHF(e.target.value)}
                className="bg-background border-border/60"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="min-profit" className="text-sm">Min Profit Threshold ($)</Label>
            <Input
              id="min-profit"
              type="number"
              value={minProfit}
              onChange={(e) => setMinProfit(e.target.value)}
              className="bg-background border-border/60"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4 text-primary" />
              <div>
                <p className="font-medium text-sm">Auto-Execute</p>
                <p className="text-xs text-muted-foreground">Execute liquidations without manual approval</p>
              </div>
            </div>
            <Switch checked={autoExecute} onCheckedChange={setAutoExecute} />
          </div>

          <Button onClick={handleSave} className="w-full bg-primary text-black hover:bg-primary/90">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}