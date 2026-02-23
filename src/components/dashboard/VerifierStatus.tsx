import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Activity, Cpu } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function VerifierStatus() {
  const [logs, setLogs] = useState<Array<{ type: string; message: string; time: string }>>([
    { type: "success", message: "[SUCCESS] Proof verified for intent #0x8a2f... in 4.2s. Gas: 142000", time: new Date().toLocaleTimeString() },
    { type: "info", message: "[INFO] Verifying proof for intent #0x3d1b...", time: new Date().toLocaleTimeString() },
    { type: "debug", message: "[DEBUG] Checking oracle signatures... OK", time: new Date().toLocaleTimeString() },
    { type: "debug", message: "[DEBUG] Validating health factor < 1.0... OK", time: new Date().toLocaleTimeString() },
  ]);

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

  const metrics = [
    { label: "Avg Verification Time", value: "4.2s", sub: "-0.3s from last week", subColor: "text-green-500" },
    { label: "Proof Cost", value: "$0.03", sub: "Per verification", subColor: "text-muted-foreground" },
    { label: "Success Rate", value: "99.8%", sub: "Last 1000 proofs", subColor: "text-muted-foreground" },
    { label: "Total Verified", value: "14,287", sub: "All time", subColor: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">ZK Proof Verifier</h2>
        <p className="text-sm text-muted-foreground">Real-time status of Plonky2 proof generation and verification</p>
      </div>

      {/* Verifier node status */}
      <Card className="border-border/60 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-sm">zkEVM-Verifier-01</p>
              <p className="text-xs text-muted-foreground">Polygon zkEVM Testnet</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Online
            </Badge>
            <span className="text-xs text-muted-foreground">99.9% Uptime</span>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 border-border/60">
              <div className="text-2xl font-bold mb-1">{m.value}</div>
              <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
              <div className={`text-xs ${m.subColor}`}>{m.sub}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Live log */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Verification Log
          </CardTitle>
          <CardDescription>Live feed of proof verification events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-black/60 border border-border/40 p-4 font-mono text-xs space-y-2 h-[220px] overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-2 ${
                log.type === "success" ? "text-green-400" :
                log.type === "info" ? "text-blue-400" :
                "text-muted-foreground"
              }`}>
                <span className="text-muted-foreground/40 flex-shrink-0">[{log.time}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}