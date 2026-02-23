import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp, Zap, AlertCircle, CheckCircle2, ExternalLink, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import {
  getUserAccountData,
  calculateHealthFactor,
  isLiquidatable,
  estimateLiquidationProfit,
  calculateRiskScore,
  formatHealthFactor,
  getHealthFactorColor,
  AAVE_V3_POOL_ADDRESS,
} from "@/lib/aave-integration";

const SEPOLIA_RPC = "https://ethereum-sepolia-rpc.publicnode.com";

function getSepoliaProvider() {
  return new ethers.JsonRpcProvider(SEPOLIA_RPC, { name: "sepolia", chainId: 11155111 });
}

interface SimulationResult {
  healthFactor: number;
  totalCollateral: number;
  totalDebt: number;
  estimatedProfit: number;
  estimatedGas: number;
  riskScore: number;
  isLiquidatable: boolean;
  liquidationBonus: number;
  maxLiquidatableDebt: number;
}

export function LiquidationSimulator() {
  const [targetAddress, setTargetAddress] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setIsSimulating(true);
    setResult(null);
    setError(null);

    try {
      const provider = getSepoliaProvider();
      toast.info("Fetching on-chain data from Aave V3 Sepolia...");

      const accountData = await getUserAccountData(provider, targetAddress);
      const hf = calculateHealthFactor(accountData);
      const liquidatable = isLiquidatable(accountData);
      const profit = estimateLiquidationProfit(accountData);
      const riskScore = calculateRiskScore(accountData);

      const totalCollateral = Number(accountData.totalCollateralBase) / 1e8;
      const totalDebt = Number(accountData.totalDebtBase) / 1e8;
      const maxLiquidatableDebt = totalDebt * 0.5;
      const estimatedGas = 180000;

      if (totalCollateral === 0 && totalDebt === 0) {
        throw new Error("This address has no active Aave V3 position on Sepolia. Please use an address with an open position.");
      }

      setResult({
        healthFactor: hf,
        totalCollateral,
        totalDebt,
        estimatedProfit: profit,
        estimatedGas,
        riskScore,
        isLiquidatable: liquidatable,
        liquidationBonus: 0.05,
        maxLiquidatableDebt,
      });

      if (liquidatable) {
        toast.success(`Position is liquidatable! HF: ${formatHealthFactor(hf)}`);
      } else {
        toast.info(`Position is healthy. HF: ${formatHealthFactor(hf)}`);
      }
    } catch (err: any) {
      const msg = err.message || "Failed to fetch on-chain data";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsSimulating(false);
    }
  };

  const hfColor = result ? getHealthFactorColor(result.healthFactor) : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Liquidation Simulator</h2>
        <p className="text-sm text-muted-foreground">
          Fetch real Aave V3 position data from Sepolia testnet and simulate liquidation profitability
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p>Queries <strong className="text-foreground">Aave V3 on Ethereum Sepolia</strong> for real position data. Enter any address that has an Aave V3 position.</p>
          <p className="mt-1">Pool: <span className="font-mono text-xs">{AAVE_V3_POOL_ADDRESS}</span></p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="w-4 h-4 text-primary" />
              Simulation Parameters
            </CardTitle>
            <CardDescription>Enter an address with an Aave V3 position on Sepolia</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSimulate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sim-address" className="text-sm">Target User Address</Label>
                <Input
                  id="sim-address"
                  value={targetAddress}
                  onChange={(e) => setTargetAddress(e.target.value)}
                  placeholder="0x..."
                  required
                  className="bg-background border-border/60 font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Address must have an active Aave V3 position on Sepolia</p>
              </div>

              <Button
                type="submit"
                disabled={isSimulating}
                className="w-full bg-primary text-black hover:bg-primary/90"
              >
                {isSimulating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Fetching on-chain data...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Simulate Liquidation
                  </span>
                )}
              </Button>

              <div className="pt-2 border-t border-border/40">
                <p className="text-xs text-muted-foreground mb-2">Known addresses with Aave positions on Sepolia:</p>
                <div className="space-y-1">
                  {[
                    "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0",
                    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
                  ].map((addr) => (
                    <button
                      key={addr}
                      type="button"
                      onClick={() => setTargetAddress(addr)}
                      className="w-full text-left text-xs font-mono text-primary hover:underline truncate"
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Simulation Result</CardTitle>
            <CardDescription>Live on-chain data from Aave V3 Sepolia</CardDescription>
          </CardHeader>
          <CardContent>
            {error && !result && (
              <div className="flex items-start gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {result ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className={`flex items-center gap-2 p-3 rounded-lg ${result.isLiquidatable ? "bg-red-500/10 border border-red-500/20" : "bg-green-500/10 border border-green-500/20"}`}>
                  {result.isLiquidatable ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  )}
                  <div className="flex-1">
                    <span className={`font-medium text-sm ${result.isLiquidatable ? "text-red-500" : "text-green-500"}`}>
                      {result.isLiquidatable ? "Position is Liquidatable!" : "Position is Healthy"}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="outline" className="text-xs">🔴 Live On-Chain</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Health Factor</p>
                    <p className={`font-bold text-lg ${hfColor}`}>{formatHealthFactor(result.healthFactor)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Risk Score</p>
                    <p className="font-bold text-lg">{result.riskScore.toFixed(0)}/100</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Total Collateral</p>
                    <p className="font-semibold text-sm">${result.totalCollateral.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                    <p className="text-xs text-muted-foreground mb-1">Total Debt</p>
                    <p className="font-semibold text-sm">${result.totalDebt.toFixed(2)}</p>
                  </div>
                </div>

                {result.isLiquidatable && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Est. Profit (5% bonus)
                      </span>
                      <span className="font-bold text-green-500">${result.estimatedProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Max Liquidatable Debt
                      </span>
                      <span className="font-mono text-sm">${result.maxLiquidatableDebt.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
                      <span className="text-sm text-muted-foreground flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Estimated Gas
                      </span>
                      <span className="font-mono text-sm">{result.estimatedGas.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <a
                  href={`https://sepolia.etherscan.io/address/${AAVE_V3_POOL_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View Aave V3 Pool on Etherscan
                </a>
              </motion.div>
            ) : !error && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Play className="w-10 h-10 mb-3 opacity-20" />
                <p className="text-sm">Enter an address and run simulation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}