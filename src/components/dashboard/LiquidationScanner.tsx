import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Info, ExternalLink, Activity, AlertTriangle } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  getUserAccountData,
  calculateHealthFactor,
  isLiquidatable,
  estimateLiquidationProfit,
  formatHealthFactor,
  getHealthFactorColor,
  AAVE_V3_POOL_ADDRESS,
} from "@/lib/aave-integration";

const INTENT_REGISTRY_ADDRESS = "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a";

const INTENT_REGISTRY_ABI = [
  "function intents(bytes32) view returns (address liquidator, bytes32 intentHash, address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 stakeAmount, bool isExecuted, bool isCancelled, uint256 createdAt)",
  "function liquidatorIntents(address, uint256) view returns (bytes32)",
];

function getAmoyProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider("https://polygon-amoy.drpc.org", { name: "amoy", chainId: 80002 });
}

function getSepoliaProvider(): ethers.JsonRpcProvider {
  return new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com", { name: "sepolia", chainId: 11155111 });
}

type ScanMode = "intent" | "aave";

export function LiquidationScanner() {
  const [targetAddress, setTargetAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [scanMode, setScanMode] = useState<ScanMode>("aave");

  const scanAavePosition = async () => {
    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    setScanning(true);
    setResult(null);
    try {
      const provider = getSepoliaProvider();
      toast.info("Querying Aave V3 on Sepolia...");
      const accountData = await getUserAccountData(provider, targetAddress);
      const hf = calculateHealthFactor(accountData);
      const liquidatable = isLiquidatable(accountData);
      const profit = estimateLiquidationProfit(accountData);
      const totalCollateral = Number(accountData.totalCollateralBase) / 1e8;
      const totalDebt = Number(accountData.totalDebtBase) / 1e8;

      setResult({
        mode: "aave",
        address: targetAddress,
        healthFactor: hf,
        isLiquidatable: liquidatable,
        totalCollateral,
        totalDebt,
        estimatedProfit: profit,
        hasPosition: totalDebt > 0 || totalCollateral > 0,
      });

      if (liquidatable) {
        toast.error(`⚠️ Position is LIQUIDATABLE! HF: ${formatHealthFactor(hf)}`);
      } else if (totalDebt > 0 || totalCollateral > 0) {
        toast.success(`Position found. HF: ${formatHealthFactor(hf)} — Healthy`);
      } else {
        toast.info("No Aave V3 position found for this address on Sepolia");
      }
    } catch (err: any) {
      console.error("Error scanning Aave position:", err);
      toast.error("Failed to fetch Aave position. Try again.");
    } finally {
      setScanning(false);
    }
  };

  const scanIntentRegistry = async () => {
    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }
    setScanning(true);
    setResult(null);
    try {
      const provider = getAmoyProvider();
      const contract = new ethers.Contract(INTENT_REGISTRY_ADDRESS, INTENT_REGISTRY_ABI, provider);
      try {
        const intentHash = await contract.liquidatorIntents(targetAddress, 0);
        if (intentHash && intentHash !== ethers.ZeroHash) {
          const intent = await contract.intents(intentHash);
          setResult({
            mode: "intent",
            hasIntents: true,
            liquidator: intent.liquidator,
            targetUser: intent.targetUser,
            targetHealthFactor: Number(intent.targetHealthFactor) / 1e18,
            minPrice: Number(intent.minPrice),
            stakeAmount: ethers.formatEther(intent.stakeAmount),
            isExecuted: intent.isExecuted,
            isCancelled: intent.isCancelled,
            createdAt: new Date(Number(intent.createdAt) * 1000),
          });
          toast.success("Found liquidation intent!");
        } else {
          setResult({ mode: "intent", hasIntents: false, address: targetAddress });
          toast.info("No active liquidation intents found for this address");
        }
      } catch {
        setResult({ mode: "intent", hasIntents: false, address: targetAddress });
        toast.info("No liquidation intents found");
      }
    } catch (err: any) {
      console.error("Error scanning address:", err);
      toast.error("Failed to scan address. RPC may be rate limited — please try again.");
    } finally {
      setScanning(false);
    }
  };

  const handleScan = () => {
    if (scanMode === "aave") {
      scanAavePosition();
    } else {
      scanIntentRegistry();
    }
  };

  const hfColor = result?.mode === "aave" ? getHealthFactorColor(result.healthFactor) : "";
  const intentStatusLabel = result?.isExecuted ? "EXECUTED" : result?.isCancelled ? "CANCELLED" : "ACTIVE";
  const intentStatusColor = result?.isExecuted
    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
    : result?.isCancelled
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : "bg-green-500/10 text-green-500 border-green-500/20";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Liquidation Scanner</h2>
        <p className="text-sm text-muted-foreground">
          Scan real Aave V3 positions on Sepolia or check Intent Registry on Polygon Amoy
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={scanMode === "aave" ? "default" : "outline"}
          onClick={() => { setScanMode("aave"); setResult(null); }}
          className={scanMode === "aave" ? "bg-primary text-black" : ""}
        >
          <Activity className="w-3.5 h-3.5 mr-1.5" />
          Aave V3 Position
        </Button>
        <Button
          size="sm"
          variant={scanMode === "intent" ? "default" : "outline"}
          onClick={() => { setScanMode("intent"); setResult(null); }}
          className={scanMode === "intent" ? "bg-primary text-black" : ""}
        >
          <Shield className="w-3.5 h-3.5 mr-1.5" />
          Intent Registry
        </Button>
      </div>

      {/* Search */}
      <Card className="p-5 border-border/60">
        <div className="flex gap-3">
          <Input
            placeholder="Enter Ethereum address (0x...)"
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            className="font-mono text-sm bg-background"
          />
          <Button onClick={handleScan} disabled={scanning} className="gap-2 whitespace-nowrap bg-primary text-black hover:bg-primary/90">
            <Search className="w-4 h-4" />
            {scanning ? "Scanning..." : "Scan"}
          </Button>
        </div>
      </Card>

      {/* Info */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-muted-foreground">
          {scanMode === "aave"
            ? <>Queries <strong className="text-foreground">Aave V3 Pool on Ethereum Sepolia</strong> for real position data. Pool: <span className="font-mono text-xs">{AAVE_V3_POOL_ADDRESS.slice(0, 14)}...</span></>
            : <>Queries your deployed <strong className="text-foreground">Intent Registry on Polygon Amoy</strong>. Contract: <span className="font-mono text-xs">{INTENT_REGISTRY_ADDRESS.slice(0, 14)}...</span></>
          }
        </p>
      </div>

      {/* Results */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {result.mode === "aave" ? (
            result.hasPosition ? (
              <Card className={`border-${result.isLiquidatable ? "red" : "primary"}/20 bg-${result.isLiquidatable ? "red" : "primary"}/5 p-5`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {result.isLiquidatable ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : (
                      <Shield className="w-5 h-5 text-green-500" />
                    )}
                    <span className="font-semibold">
                      {result.isLiquidatable ? "Liquidatable Position!" : "Healthy Position"}
                    </span>
                  </div>
                  <Badge variant="outline" className={result.isLiquidatable ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-green-500/10 text-green-500 border-green-500/20"}>
                    {result.isLiquidatable ? "AT RISK" : "SAFE"}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Health Factor</p>
                    <p className={`font-bold text-lg ${hfColor}`}>{formatHealthFactor(result.healthFactor)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Est. Profit</p>
                    <p className="font-semibold text-green-500">${result.estimatedProfit.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Collateral</p>
                    <p className="font-semibold">${result.totalCollateral.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total Debt</p>
                    <p className="font-semibold">${result.totalDebt.toFixed(2)}</p>
                  </div>
                </div>
                <a
                  href={`https://sepolia.etherscan.io/address/${result.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Etherscan
                </a>
              </Card>
            ) : (
              <Card className="p-8 border-border/60 text-center">
                <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium mb-1">No Aave V3 Position Found</p>
                <p className="text-sm text-muted-foreground mb-2">
                  This address has no active position on Aave V3 Sepolia.
                </p>
                <p className="text-xs font-mono text-muted-foreground/60">{result.address}</p>
              </Card>
            )
          ) : (
            result.hasIntents ? (
              <Card className="border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Active Intent Found</span>
                  </div>
                  <Badge variant="outline" className={intentStatusColor}>{intentStatusLabel}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Liquidator</p>
                    <p className="font-mono text-xs">{result.liquidator.slice(0, 14)}...</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Target User</p>
                    <p className="font-mono text-xs">{result.targetUser.slice(0, 14)}...</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Health Factor Target</p>
                    <p className="font-semibold">{result.targetHealthFactor.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Stake Amount</p>
                    <p className="font-semibold">{result.stakeAmount} POL</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-xs text-muted-foreground">Created At</p>
                    <p className="text-xs">{result.createdAt.toLocaleString()}</p>
                  </div>
                </div>
                <a
                  href={`https://amoy.polygonscan.com/address/${INTENT_REGISTRY_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Polygonscan
                </a>
              </Card>
            ) : (
              <Card className="p-8 border-border/60 text-center">
                <Shield className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
                <p className="font-medium mb-1">No Intents Found</p>
                <p className="text-sm text-muted-foreground mb-2">
                  This address hasn't submitted any liquidation intents yet.
                </p>
                <p className="text-xs font-mono text-muted-foreground/60">{result.address}</p>
              </Card>
            )
          )}
        </motion.div>
      )}

      {/* Contract info */}
      <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
        <p className="text-xs font-medium mb-2">Contract Information</p>
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>Aave V3 Pool (Sepolia): <span className="font-mono">{AAVE_V3_POOL_ADDRESS}</span></p>
          <p>Intent Registry (Amoy): <span className="font-mono">{INTENT_REGISTRY_ADDRESS}</span></p>
          <div className="flex gap-3 mt-1">
            <a href={`https://sepolia.etherscan.io/address/${AAVE_V3_POOL_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Aave on Etherscan
            </a>
            <a href={`https://amoy.polygonscan.com/address/${INTENT_REGISTRY_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              Registry on Polygonscan
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}