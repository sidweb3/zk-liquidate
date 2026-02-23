import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Search, TrendingDown, Shield, Zap, ExternalLink } from "lucide-react";
import { BrowserProvider, Contract, formatUnits } from "ethers";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { AAVE_V3_AMOY } from "@/lib/contracts";

const AAVE_POOL_ABI = [
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
] as const;

interface PositionData {
  address: string;
  totalCollateral: string;
  totalDebt: string;
  healthFactor: string;
  ltv: string;
  liquidationThreshold: string;
  isLiquidatable: boolean;
}

interface PositionCheckerProps {
  onCreateIntent?: (address: string, healthFactor: number) => void;
}

export function PositionChecker({ onCreateIntent }: PositionCheckerProps) {
  const [targetAddress, setTargetAddress] = useState("");
  const [position, setPosition] = useState<PositionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPosition = async () => {
    if (!targetAddress || !targetAddress.startsWith("0x") || targetAddress.length !== 42) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPosition(null);

    try {
      if (!window.ethereum) throw new Error("No Web3 wallet detected");
      const provider = new BrowserProvider(window.ethereum);
      const pool = new Contract(AAVE_V3_AMOY.POOL, AAVE_POOL_ABI, provider);

      const data = await pool.getUserAccountData(targetAddress);
      const hf = parseFloat(formatUnits(data.healthFactor, 18));
      const collateral = parseFloat(formatUnits(data.totalCollateralBase, 8));
      const debt = parseFloat(formatUnits(data.totalDebtBase, 8));
      const ltv = parseFloat(data.ltv.toString()) / 100;
      const liqThreshold = parseFloat(data.currentLiquidationThreshold.toString()) / 100;

      setPosition({
        address: targetAddress,
        totalCollateral: collateral.toFixed(4),
        totalDebt: debt.toFixed(4),
        healthFactor: hf > 1000 ? "∞" : hf.toFixed(4),
        ltv: ltv.toFixed(2),
        liquidationThreshold: liqThreshold.toFixed(2),
        isLiquidatable: hf < 1.0 && debt > 0,
      });

      if (hf < 1.0 && debt > 0) {
        toast.warning(`⚠️ Position is liquidatable! HF: ${hf.toFixed(4)}`);
      } else if (hf < 1.2) {
        toast.info(`Position is at risk. HF: ${hf.toFixed(4)}`);
      } else {
        toast.success(`Position is healthy. HF: ${hf.toFixed(4)}`);
      }
    } catch (e: any) {
      console.error("Failed to check position:", e);
      const msg = e.message?.includes("call revert") 
        ? "No Aave position found for this address on Amoy testnet"
        : e.message || "Failed to check position";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const getHFColor = (hf: string) => {
    if (hf === "∞") return "text-green-500";
    const val = parseFloat(hf);
    if (val < 1.0) return "text-red-500";
    if (val < 1.2) return "text-orange-500";
    if (val < 1.5) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Search className="w-4 h-4 text-primary" />
          Live Position Checker
        </CardTitle>
        <CardDescription className="text-xs">Check any address's Aave V3 position on Polygon Amoy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="0x... target address"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              className="font-mono text-sm h-9 bg-background border-border/60"
            />
          </div>
          <Button
            onClick={checkPosition}
            disabled={isLoading}
            className="bg-primary text-black hover:bg-primary/90 h-9 px-4 gap-1.5"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Check
          </Button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-sm text-red-400"
            >
              {error}
            </motion.div>
          )}

          {position && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {/* Health Factor Banner */}
              <div className={`p-4 rounded-xl border ${position.isLiquidatable ? "border-red-500/30 bg-red-500/5" : "border-border/40 bg-muted/20"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {position.isLiquidatable ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Shield className="w-5 h-5 text-green-500" />
                    )}
                    <span className="font-semibold text-sm">
                      {position.isLiquidatable ? "LIQUIDATABLE" : "Healthy Position"}
                    </span>
                  </div>
                  <a
                    href={`https://amoy.polygonscan.com/address/${position.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Explorer
                  </a>
                </div>
                <div className="text-3xl font-bold font-mono">
                  <span className={getHFColor(position.healthFactor)}>{position.healthFactor}</span>
                  <span className="text-sm text-muted-foreground ml-2">Health Factor</span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Total Collateral</p>
                  <p className="font-mono font-semibold text-sm">${position.totalCollateral}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Total Debt</p>
                  <p className="font-mono font-semibold text-sm">${position.totalDebt}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">LTV</p>
                  <p className="font-mono font-semibold text-sm">{position.ltv}%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Liq. Threshold</p>
                  <p className="font-mono font-semibold text-sm">{position.liquidationThreshold}%</p>
                </div>
              </div>

              {/* Action */}
              {position.isLiquidatable && onCreateIntent && (
                <Button
                  onClick={() => onCreateIntent(position.address, parseFloat(position.healthFactor))}
                  className="w-full bg-red-500 hover:bg-red-600 text-white gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Create Liquidation Intent
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
