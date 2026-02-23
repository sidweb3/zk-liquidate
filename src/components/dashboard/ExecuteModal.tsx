import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Zap, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { getLiquidationExecutorV2Contract, switchToNetwork, CONTRACTS_V2, TESTNET_TOKENS } from "@/lib/contracts";
import { parseUnits } from "ethers";

interface ExecuteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intentId: string;
  intentHash: string;
  targetAddress: string;
  onSuccess: (intentId: string) => void;
  walletAddress?: string | null;
}

const ASSET_OPTIONS = [
  { label: "USDC", value: TESTNET_TOKENS.USDC, decimals: 6 },
  { label: "WETH", value: TESTNET_TOKENS.WETH, decimals: 18 },
  { label: "WMATIC", value: TESTNET_TOKENS.WMATIC, decimals: 18 },
  { label: "DAI", value: TESTNET_TOKENS.DAI, decimals: 18 },
];

export function ExecuteModal({ open, onOpenChange, intentId, intentHash, targetAddress, onSuccess, walletAddress }: ExecuteModalProps) {
  const [collateralAsset, setCollateralAsset] = useState<string>(TESTNET_TOKENS.USDC);
  const [debtAsset, setDebtAsset] = useState<string>(TESTNET_TOKENS.WETH);
  const [debtAmount, setDebtAmount] = useState("1000");
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const selectedDebtAsset = ASSET_OPTIONS.find(a => a.value === debtAsset);

  const handleExecute = async () => {
    if (!intentHash || !intentHash.startsWith("0x") || intentHash.length !== 66) {
      toast.error("Invalid intent hash. Please submit a new intent.");
      return;
    }

    setIsExecuting(true);
    setTxHash(null);

    try {
      await switchToNetwork(CONTRACTS_V2.INTENT_REGISTRY_V2.chainId);

      const executorContract = await getLiquidationExecutorV2Contract();
      const decimals = selectedDebtAsset?.decimals ?? 6;
      const debtToCover = parseUnits(debtAmount, decimals);

      toast.info("Sending liquidation transaction...");
      const tx = await executorContract.executeLiquidation(
        intentHash,
        collateralAsset,
        debtAsset,
        debtToCover,
        {
          gasPrice: 50000000000n, // legacy tx — Polygon Amoy does not support EIP-1559
        }
      );

      toast.info("Waiting for confirmation...");
      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      toast.success(`✅ Liquidation executed! Tx: ${receipt.hash.substring(0, 10)}...`, {
        description: "View on Polygonscan",
        action: {
          label: "View",
          onClick: () => window.open(`https://amoy.polygonscan.com/tx/${receipt.hash}`, "_blank"),
        },
      });

      onSuccess(intentId);
    } catch (e: any) {
      console.error("Execute failed:", e);
      if (e.code === "ACTION_REJECTED" || e.message?.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else if (e.message?.includes("Invalid proof") || e.message?.includes("Not verified")) {
        toast.error("ZK proof required. Submit a valid proof to the zkEVM verifier first.", {
          description: `ZKVerifier: ${CONTRACTS_V2.ZK_VERIFIER.address.slice(0, 10)}... on Polygon zkEVM`,
        });
      } else if (e.message?.includes("Verification expired")) {
        toast.error("ZK proof has expired (>1 hour). Re-submit proof to the zkEVM verifier.");
      } else if (e.message?.includes("Intent not found")) {
        toast.error("Intent not found on-chain. The intent hash may not match the registered intent.");
      } else if (e.message?.includes("User not liquidatable")) {
        toast.error("Target user's health factor is above 1.0 — not currently liquidatable.");
      } else if (e.reason) {
        toast.error(`Contract error: ${e.reason}`);
      } else {
        toast.error(e.message || "Execution failed");
      }
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Execute Liquidation
          </DialogTitle>
          <DialogDescription>
            Configure and execute the on-chain liquidation for this intent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Target info */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
            <p className="text-xs text-muted-foreground mb-1">Target Address</p>
            <p className="font-mono text-sm">{targetAddress?.substring(0, 10)}...{targetAddress?.substring(34)}</p>
          </div>

          {/* ZK Proof requirement */}
          <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground space-y-1">
                <p className="font-medium text-blue-400">ZK Proof Required</p>
                <p>A valid proof must be submitted to the ZKVerifier on Polygon zkEVM before execution. Proofs expire after 1 hour.</p>
                <a
                  href={`https://testnet-zkevm.polygonscan.com/address/${CONTRACTS_V2.ZK_VERIFIER.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline mt-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  View ZKVerifier on zkEVM
                </a>
              </div>
            </div>
          </div>

          {/* Asset selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-sm">Collateral Asset</Label>
              <select
                value={collateralAsset}
                onChange={(e) => setCollateralAsset(e.target.value)}
                className="w-full h-9 rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ASSET_OPTIONS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Debt Asset</Label>
              <select
                value={debtAsset}
                onChange={(e) => setDebtAsset(e.target.value)}
                className="w-full h-9 rounded-md border border-border/60 bg-background px-3 py-1 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {ASSET_OPTIONS.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Debt to Cover ({selectedDebtAsset?.label ?? "tokens"})</Label>
            <Input
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
              min="0.000001"
              step="0.01"
              className="h-9 bg-background border-border/60 font-mono"
            />
          </div>

          <div className="p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                This will call <strong>executeLiquidation</strong> on LiquidationExecutorV2 on Polygon Amoy. Ensure you have sufficient MATIC for gas and the ZK proof is valid.
              </p>
            </div>
          </div>

          {txHash && (
            <div className="p-3 rounded-lg border border-green-500/20 bg-green-500/5">
              <p className="text-xs text-green-500 font-medium mb-1">Transaction Confirmed!</p>
              <a
                href={`https://amoy.polygonscan.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-primary flex items-center gap-1 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                {txHash.substring(0, 20)}...
              </a>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExecuting} className="h-9">
            Cancel
          </Button>
          <Button
            onClick={handleExecute}
            disabled={isExecuting}
            className="bg-primary text-black hover:bg-primary/90 h-9 gap-2"
          >
            {isExecuting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Execute On-Chain
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}