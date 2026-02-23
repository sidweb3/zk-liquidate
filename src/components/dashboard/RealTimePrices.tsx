import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, RefreshCw, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllChainlinkPrices, getSepoliaProvider, PriceData } from "@/lib/chainlink-prices";
import { motion } from "framer-motion";

export function RealTimePrices() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrices = async () => {
    try {
      setError(null);
      const provider = getSepoliaProvider();
      const priceData = await getAllChainlinkPrices(provider);
      setPrices(priceData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to fetch prices";
      setError(msg);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Live Price Oracle</h2>
          <p className="text-sm text-muted-foreground">Real-time Chainlink price feeds</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-5 border-border/60 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/2 mb-3" />
              <div className="h-8 bg-muted rounded w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold mb-1">Live Price Oracle</h2>
          <p className="text-sm text-muted-foreground">Real-time price feeds</p>
        </div>
        <Card className="p-5 border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-yellow-500">Connection Issue</p>
              <p className="text-sm text-muted-foreground mt-1">
                Unable to fetch live prices. Retrying automatically.
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-sm">{error}</p>
            </div>
          </div>
          <Button onClick={fetchPrices} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const source = prices[0]?.source ?? "chainlink";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-1">Live Price Oracle</h2>
          <p className="text-sm text-muted-foreground">
            {source === "coingecko" ? "CoinGecko API (Chainlink fallback)" : "Chainlink oracles on Ethereum Sepolia"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-border/60">
            {source === "coingecko" ? "CoinGecko" : "Chainlink Sepolia"}
          </Badge>
          <Button onClick={fetchPrices} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {prices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {prices.map((priceData, i) => {
            const ageMinutes = Math.floor((Date.now() / 1000 - priceData.updatedAt) / 60);
            const isStale = ageMinutes > 60;

            return (
              <motion.div key={priceData.asset} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card className={`p-5 border-border/60 hover:border-border transition-colors ${isStale ? "border-yellow-500/20" : ""}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                        {priceData.asset[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{priceData.asset}/USD</p>
                        <p className="text-xs text-muted-foreground">
                          {ageMinutes < 1 ? "Just updated" : `${ageMinutes}m ago`}
                          {isStale && " · stale"}
                        </p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-muted-foreground/40" />
                  </div>
                  <div className="text-2xl font-bold">
                    ${priceData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Confidence: {(priceData.confidence * 100).toFixed(0)}% · {priceData.source}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Live Data:</strong>{" "}
          {source === "coingecko"
            ? "Prices from CoinGecko API (Chainlink RPC unavailable on free tier)."
            : "Prices from Chainlink oracles on Ethereum Sepolia testnet."}
          {" "}Updates every 60 seconds. Last updated: <span className="font-mono">{lastUpdate.toLocaleTimeString()}</span>
        </p>
      </div>
    </div>
  );
}