import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Activity, CheckCircle2, XCircle, Clock } from "lucide-react";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CONTRACTS_V2 } from "@/lib/contracts";

interface TxRecord {
  hash: string;
  type: "submit" | "execute" | "verify";
  status: "confirmed" | "pending" | "failed";
  timestamp: number;
  description: string;
}

interface TransactionHistoryProps {
  address: string | null;
  isConnected: boolean;
}

export function TransactionHistory({ address, isConnected }: TransactionHistoryProps) {
  const [txHistory, setTxHistory] = useState<TxRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecentTxs = async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      // Fetch from Polygonscan API (public, no key needed for basic queries)
      const url = `https://api-amoy.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.status === "1" && Array.isArray(data.result)) {
        const records: TxRecord[] = data.result.slice(0, 8).map((tx: any) => {
          const isToRegistry = tx.to?.toLowerCase() === CONTRACTS_V2.INTENT_REGISTRY_V2.address.toLowerCase();
          const isToExecutor = tx.to?.toLowerCase() === CONTRACTS_V2.LIQUIDATION_EXECUTOR_V2.address.toLowerCase();
          let type: TxRecord["type"] = "submit";
          let description = "Contract interaction";

          if (isToRegistry) {
            type = "submit";
            description = "Intent submitted to registry";
          } else if (isToExecutor) {
            type = "execute";
            description = "Liquidation executed";
          }

          return {
            hash: tx.hash,
            type,
            status: tx.isError === "0" ? "confirmed" : "failed",
            timestamp: parseInt(tx.timeStamp) * 1000,
            description,
          };
        });
        setTxHistory(records);
        toast.success(`Loaded ${records.length} recent transactions`);
      } else {
        toast.info("No transactions found for this address on Amoy");
        setTxHistory([]);
      }
    } catch (e) {
      console.error("Failed to fetch tx history:", e);
      toast.error("Failed to fetch transaction history");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: TxRecord["status"]) => {
    switch (status) {
      case "confirmed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTypeColor = (type: TxRecord["type"]) => {
    switch (type) {
      case "execute": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "verify": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">Recent on-chain activity on Polygon Amoy</CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchRecentTxs}
            disabled={isLoading || !isConnected}
            className="h-7 text-xs gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {txHistory.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm mb-1">No transactions loaded</p>
            <p className="text-xs">Click Refresh to load your recent on-chain activity</p>
          </div>
        ) : (
          <div className="space-y-2">
            {txHistory.map((tx, i) => (
              <motion.div
                key={tx.hash}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 hover:bg-background transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getStatusIcon(tx.status)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tx.description}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {tx.hash.substring(0, 10)}...{tx.hash.substring(58)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                  <Badge variant="outline" className={`text-[10px] h-5 capitalize ${getTypeColor(tx.type)}`}>
                    {tx.type}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground hidden sm:block">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                  <a
                    href={`https://amoy.polygonscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-muted transition-colors"
                  >
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
