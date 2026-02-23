import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap, ExternalLink, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { getLiquidationExecutorV2Contract, getIntentRegistryV2Contract, switchToNetwork, CONTRACTS_V2 } from "@/lib/contracts";

const PROTOCOL_LOGOS: Record<string, string> = {
  aave: "https://cryptologos.cc/logos/aave-aave-logo.png",
  compound: "https://cryptologos.cc/logos/compound-comp-logo.png",
  morpho: "https://avatars.githubusercontent.com/u/92315477?s=200&v=4",
};

const PROTOCOL_COLORS: Record<string, string> = {
  aave: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  compound: "text-green-400 bg-green-500/10 border-green-500/20",
  morpho: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

const STATUS_CONFIG = {
  live: { label: "Live", icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/20" },
  testing: { label: "Testing", icon: Clock, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  planned: { label: "Planned", icon: Zap, color: "bg-muted/50 text-muted-foreground border-border" },
};

export function MultiProtocolAdapters() {
  const adapters = useQuery(api.protocol.getProtocolAdapters);
  const intents = useQuery(api.protocol.getIntents, {});

  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState("polygon-amoy");
  const [isExecutingBatch, setIsExecutingBatch] = useState(false);

  const pendingIntents = intents?.filter(i => i.status === "verified") ?? [];

  const handleBatchExecute = async () => {
    if (pendingIntents.length === 0) {
      toast.error("No verified intents available for batch execution");
      return;
    }

    setIsExecutingBatch(true);
    try {
      // Switch to Polygon Amoy for on-chain execution
      await switchToNetwork(CONTRACTS_V2.LIQUIDATION_EXECUTOR_V2.chainId);

      const executorContract = await getLiquidationExecutorV2Contract();
      const registryContract = await getIntentRegistryV2Contract();

      const batch = pendingIntents.slice(0, 50);
      let successCount = 0;

      toast.info(`Executing ${batch.length} liquidations on-chain...`);

      for (const intent of batch) {
        if (!intent.intentHash) continue;
        try {
          const intentData = await registryContract.getIntent(intent.intentHash);
          const targetUser = intentData.targetUser;

          // Use USDC as collateral and WETH as debt asset for Amoy testnet
          const collateralAsset = "0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582"; // USDC
          const debtAsset = "0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa"; // WETH
          const debtToCover = 1000000000n; // 1000 USDC worth

          const tx = await executorContract.executeLiquidation(intent.intentHash, collateralAsset, debtAsset, debtToCover);
          await tx.wait();
          successCount++;
          toast.success(`Liquidated position for ${targetUser.slice(0, 8)}...`);
        } catch (err: any) {
          console.warn(`Failed to execute intent ${intent.intentHash}:`, err.message);
        }
      }

      if (successCount > 0) {
        toast.success(`Batch complete: ${successCount}/${batch.length} liquidations executed on-chain`);
      } else {
        toast.error("No liquidations could be executed. Check that positions are still liquidatable.");
      }
      setBatchDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Batch execution failed");
    } finally {
      setIsExecutingBatch(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Protocol Adapters</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Standardized ILiquidationAdapter interface across DeFi lending protocols
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
            Wave 6 Feature
          </Badge>
          <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-black hover:bg-primary/90 gap-2">
                <Layers className="w-4 h-4" />
                Batch Liquidate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] bg-card border-border">
              <DialogHeader>
                <DialogTitle>Batch Liquidation</DialogTitle>
                <DialogDescription>
                  Execute multiple verified intents on-chain via the LiquidationExecutor contract.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Verified intents available</span>
                    <span className="font-bold text-primary">{pendingIntents.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Max per batch</span>
                    <span className="font-medium">50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract</span>
                    <span className="font-mono text-xs text-muted-foreground">{CONTRACTS_V2.LIQUIDATION_EXECUTOR_V2.address.slice(0, 10)}...</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Target Chain</Label>
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full h-9 rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="polygon-amoy">Polygon Amoy (Testnet)</option>
                    <option value="polygon-zkevm">Polygon zkEVM</option>
                    <option value="polygon-pos">Polygon PoS</option>
                  </select>
                </div>

                {pendingIntents.length === 0 && (
                  <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-500">
                    No verified intents available. Verify intents in the Intent Registry first.
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  onClick={handleBatchExecute}
                  disabled={isExecutingBatch || pendingIntents.length === 0}
                  className="w-full bg-primary text-black hover:bg-primary/90 h-10"
                >
                  {isExecutingBatch ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Executing on-chain...
                    </span>
                  ) : (
                    `Execute ${Math.min(pendingIntents.length, 50)} Intents On-Chain`
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Adapter Interface Card */}
      <Card className="border-primary/20 bg-gradient-to-r from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            ILiquidationAdapter Interface
          </CardTitle>
          <CardDescription>Standardized interface enabling any lending protocol to integrate with zkLiquidate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-black/50 rounded-lg p-4 font-mono text-xs border border-border overflow-x-auto">
            <div className="text-green-400">{"// ILiquidationAdapter.sol"}</div>
            <div className="text-muted-foreground mt-2">{"interface ILiquidationAdapter {"}</div>
            <div className="text-blue-400 ml-4">{"function getHealthFactor(address user) external view returns (uint256);"}</div>
            <div className="text-blue-400 ml-4">{"function executeLiquidation(address user, address collateral, uint256 amount) external returns (uint256 profit);"}</div>
            <div className="text-blue-400 ml-4">{"function getCollateralAssets(address user) external view returns (address[] memory);"}</div>
            <div className="text-blue-400 ml-4">{"function getLiquidationBonus(address collateral) external view returns (uint256);"}</div>
            <div className="text-muted-foreground">{"}"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Protocol Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {adapters?.map((adapter, i) => {
          const statusCfg = STATUS_CONFIG[adapter.status];
          const StatusIcon = statusCfg.icon;
          const colorClass = PROTOCOL_COLORS[adapter.protocol] || "text-primary bg-primary/10 border-primary/20";

          return (
            <motion.div
              key={adapter._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`border-border hover:border-primary/30 transition-all h-full ${adapter.status === "live" ? "border-green-500/20" : ""}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}>
                        <span className="text-lg font-bold">{adapter.name[0]}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{adapter.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">{adapter.network}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={statusCfg.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {statusCfg.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adapter.status !== "planned" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Liquidations</div>
                        <div className="text-xl font-bold">{adapter.liquidationsExecuted?.toLocaleString() ?? 0}</div>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/30 border border-border">
                        <div className="text-xs text-muted-foreground mb-1">Gas Saving</div>
                        <div className="text-xl font-bold text-green-500">~{adapter.avgGasSaving}%</div>
                      </div>
                    </div>
                  )}

                  {adapter.status === "live" && adapter.tvl && adapter.tvl > 0 && (
                    <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-xs text-muted-foreground mb-1">TVL Protected</div>
                      <div className="text-lg font-bold text-green-500">
                        ${(adapter.tvl / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  )}

                  {adapter.status === "planned" && (
                    <div className="p-4 rounded-lg bg-muted/20 border border-border text-center">
                      <p className="text-sm text-muted-foreground">Integration in development</p>
                      <p className="text-xs text-muted-foreground mt-1">Expected Q1 2026</p>
                    </div>
                  )}

                  <div className="text-xs font-mono text-muted-foreground bg-muted/30 p-2 rounded border border-border break-all">
                    {adapter.contractAddress === "0x0000000000000000000000000000000000000000"
                      ? "Contract TBD"
                      : adapter.contractAddress}
                  </div>

                  {adapter.status !== "planned" && adapter.contractAddress !== "0x0000000000000000000000000000000000000000" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-border hover:border-primary/30"
                      onClick={() => window.open(`https://amoy.polygonscan.com/address/${adapter.contractAddress}`, "_blank")}
                    >
                      <ExternalLink className="w-3 h-3 mr-2" />
                      View on Explorer
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {(!adapters || adapters.length === 0) && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No adapters found. Click "Seed Data" to populate.
          </div>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Protocols", value: adapters?.filter(a => a.status === "live").length ?? 0, color: "text-green-500" },
          { label: "In Testing", value: adapters?.filter(a => a.status === "testing").length ?? 0, color: "text-yellow-500" },
          { label: "Total Liquidations", value: adapters?.reduce((a, b) => a + (b.liquidationsExecuted ?? 0), 0).toLocaleString() ?? "0", color: "text-primary" },
          { label: "Avg Gas Saving", value: `~${Math.round((adapters?.filter(a => a.avgGasSaving && a.avgGasSaving > 0).reduce((a, b) => a + (b.avgGasSaving ?? 0), 0) ?? 0) / Math.max(adapters?.filter(a => a.avgGasSaving && a.avgGasSaving > 0).length ?? 1, 1))}%`, color: "text-accent" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <Card className="p-4 text-center border-border bg-card/50">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}