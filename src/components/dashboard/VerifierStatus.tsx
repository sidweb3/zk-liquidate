import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export function VerifierStatus() {
  const [logs, setLogs] = useState<Array<{ type: string; message: string; time: string }>>([
    { type: "success", message: "[SUCCESS] Proof verified for intent #0x8a2f... in 4.2s. Gas: 142000", time: new Date().toLocaleTimeString() },
    { type: "info", message: "[INFO] Verifying proof for intent #0x3d1b...", time: new Date().toLocaleTimeString() },
    { type: "debug", message: "[DEBUG] Checking oracle signatures... OK", time: new Date().toLocaleTimeString() },
    { type: "debug", message: "[DEBUG] Validating health factor < 1.0... OK", time: new Date().toLocaleTimeString() },
  ]);

  // Simulate real-time log updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        type: Math.random() > 0.7 ? "success" : Math.random() > 0.5 ? "info" : "debug",
        message: Math.random() > 0.5 
          ? `[SUCCESS] Proof verified for intent #0x${Math.random().toString(16).substring(2, 6)}... in ${(3 + Math.random() * 2).toFixed(1)}s`
          : `[INFO] Processing batch verification for ${Math.floor(Math.random() * 5) + 1} intents`,
        time: new Date().toLocaleTimeString(),
      };
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-card border-border col-span-2">
        <CardHeader>
          <CardTitle>ZK Proof Verification Status</CardTitle>
          <CardDescription>Real-time status of Plonky2 proof generation and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">zkEVM-Verifier-01</p>
                  <p className="text-xs text-muted-foreground">Polygon zkEVM Testnet</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  <Activity className="w-3 h-3 mr-1 animate-pulse" />
                  Online
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">99.9% Uptime</p>
              </div>
            </div>

            <div className="rounded-md bg-black/50 p-4 font-mono text-xs space-y-2 h-[240px] overflow-y-auto border border-border">
              {logs.map((log, i) => (
                <div key={i} className={`flex gap-2 ${
                  log.type === "success" ? "text-green-400" :
                  log.type === "info" ? "text-blue-400" :
                  "text-muted-foreground"
                }`}>
                  <span className="text-muted-foreground opacity-50">[{log.time}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Verifier Metrics</CardTitle>
          <CardDescription>Performance statistics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Avg Verification Time</div>
            <div className="text-3xl font-bold">4.2s</div>
            <div className="text-xs text-green-500 mt-1">-0.3s from last week</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Proof Cost</div>
            <div className="text-3xl font-bold">$0.03</div>
            <div className="text-xs text-muted-foreground mt-1">Per verification</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Success Rate</div>
            <div className="text-3xl font-bold text-green-500">99.8%</div>
            <div className="text-xs text-muted-foreground mt-1">Last 1000 proofs</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Total Verified</div>
            <div className="text-3xl font-bold">14,287</div>
            <div className="text-xs text-muted-foreground mt-1">All time</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}