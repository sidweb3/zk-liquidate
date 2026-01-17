import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllChainlinkPrices, getSepoliaProvider, PriceData } from "@/lib/chainlink-prices";

export function RealTimePrices() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchPrices = async () => {
    try {
      console.log("Starting price fetch...");
      setError(null);

      const provider = getSepoliaProvider();
      console.log("Provider created");

      // Test provider connection first
      const blockNumber = await provider.getBlockNumber();
      console.log("Connected to Sepolia, block:", blockNumber);

      const priceData = await getAllChainlinkPrices(provider);
      console.log("Fetched prices:", priceData);

      setPrices(priceData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching prices:", err);
      setError(err.message || "Failed to fetch prices from Chainlink");
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchPrices();

    // Update every 60 seconds (less aggressive than 30s)
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-muted rounded w-1/3" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-yellow-500/50 bg-yellow-500/5">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-500">Connection Issue</p>
            <p className="text-sm text-muted-foreground mt-1">
              Unable to fetch live prices from Chainlink. This may be due to RPC rate limits or network issues.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Error: {error}
            </p>
          </div>
        </div>
        <Button onClick={fetchPrices} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      </Card>
    );
  }

  if (prices.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">No price data available.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Live Price Oracle</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Chainlink Sepolia
          </Badge>
          <Button onClick={fetchPrices} variant="ghost" size="sm" className="h-8 w-8 p-0">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {prices.map((priceData) => {
          // Calculate how fresh the data is
          const ageMinutes = Math.floor((Date.now() / 1000 - priceData.updatedAt) / 60);
          const isStale = ageMinutes > 60;

          return (
            <div
              key={priceData.asset}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  {priceData.asset}
                </div>
                <div>
                  <p className="font-semibold">{priceData.asset}/USD</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {ageMinutes < 1 ? "now" : `${ageMinutes}m ago`}
                    {isStale && " (stale)"}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold">
                  ${priceData.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <div className="flex items-center justify-end gap-1 text-xs">
                  <span className="text-muted-foreground">
                    Confidence: {(priceData.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">Live Data:</strong> Prices are fetched from Chainlink
          oracles on Ethereum Sepolia testnet. Updates every 60 seconds.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </p>
      </div>
    </Card>
  );
}
