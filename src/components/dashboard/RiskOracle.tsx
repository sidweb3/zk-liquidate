import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface RiskOracleProps {
  marketData: any[] | undefined;
}

export function RiskOracle({ marketData }: RiskOracleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Cross-Chain Risk Oracle</h2>
        <p className="text-sm text-muted-foreground">Aggregated price feeds and risk metrics from AggLayer chains</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Feeds", value: marketData?.length ?? 0, color: "text-primary" },
          { label: "Avg Confidence", value: marketData && marketData.length > 0 ? `${(marketData.reduce((a, b) => a + b.confidence, 0) / marketData.length * 100).toFixed(1)}%` : "—", color: "text-green-500" },
          { label: "Chains Monitored", value: new Set(marketData?.map(d => d.chainId) ?? []).size, color: "text-blue-400" },
        ].map((stat, i) => (
          <Card key={i} className="p-4 border-border/60">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-primary" />
            Price Feed Data
          </CardTitle>
          <CardDescription>Real-time oracle data from deployed Chainlink feeds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Chain</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Confidence</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody>
                {marketData?.map((data, i) => (
                  <motion.tr
                    key={data._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {data.asset[0]}
                        </div>
                        <span className="font-medium">{data.asset}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold">${data.price.toFixed(2)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{data.chainId}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                        {(data.confidence * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(data.timestamp).toLocaleTimeString()}</td>
                  </motion.tr>
                ))}
                {(!marketData || marketData.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground text-sm">
                      No market data available. Click "Seed Demo Data" in the sidebar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}