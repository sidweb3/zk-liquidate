import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Clock, Zap, Database, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { getIntentRegistryV2Contract, switchToNetwork, CONTRACTS_V2, AAVE_V3_AMOY } from "@/lib/contracts";
import { parseEther, parseUnits, solidityPackedKeccak256 } from "ethers";
import { motion } from "framer-motion";
import { ExecuteModal } from "./ExecuteModal";
import { PositionChecker } from "./PositionChecker";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface IntentRegistryProps {
  intents: any[] | undefined;
  onSubmitIntent: (data: any) => Promise<any>;
  onVerifyIntent: (args: { intentId: any; walletAddress?: string }) => Promise<any>;
  onExecuteIntent: (args: { intentId: any; walletAddress?: string }) => Promise<any>;
  walletAddress?: string | null;
}

function getStatusColor(status: string) {
  switch (status) {
    case "verified": return "bg-green-500/20 text-green-500 border-green-500/30";
    case "executed": return "bg-blue-500/20 text-blue-500 border-blue-500/30";
    case "failed": return "bg-red-500/20 text-red-500 border-red-500/30";
    default: return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "verified": return <CheckCircle2 className="h-4 w-4" />;
    case "executed": return <Zap className="h-4 w-4" />;
    case "failed": return <AlertTriangle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
}

export function IntentRegistry({ intents, onSubmitIntent, onVerifyIntent, onExecuteIntent, walletAddress }: IntentRegistryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [executeModalOpen, setExecuteModalOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<{ id: string; hash: string; address: string } | null>(null);
  const [prefillAddress, setPrefillAddress] = useState<string>("");
  const updateIntentHash = useMutation(api.protocol.updateIntentHash);

  // Track previous intent statuses to detect changes
  const prevStatusesRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!intents) return;
    const prevStatuses = prevStatusesRef.current;
    const newStatuses: Record<string, string> = {};

    intents.forEach((intent) => {
      const id = intent._id;
      const currentStatus = intent.status;
      newStatuses[id] = currentStatus;

      if (prevStatuses[id] && prevStatuses[id] !== currentStatus) {
        const shortAddr = `${intent.targetUserAddress.substring(0, 6)}...${intent.targetUserAddress.substring(38)}`;
        if (currentStatus === "verified") {
          toast.success(`✅ Intent verified for ${shortAddr}`, { description: "ZK proof confirmed. Ready to execute." });
        } else if (currentStatus === "executed") {
          toast.success(`⚡ Liquidation executed for ${shortAddr}`, { description: "Position successfully liquidated on-chain." });
        } else if (currentStatus === "failed") {
          toast.error(`❌ Intent failed for ${shortAddr}`, { description: "Liquidation could not be completed." });
        }
      }
    });

    prevStatusesRef.current = newStatuses;
  }, [intents]);

  const handleSubmitIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      if (!window.ethereum) {
        toast.error("Please install MetaMask or another Web3 wallet");
        return;
      }

      const targetUser = formData.get("address") as string;
      if (!targetUser.startsWith("0x") || targetUser.length !== 42) {
        toast.error("Invalid address format. Must be a 42-character hex address starting with 0x");
        return;
      }

      const hfValue = parseFloat(formData.get("hf") as string);
      if (hfValue <= 0 || hfValue >= 1.0) {
        toast.error("Target health factor must be between 0 and 1.0 for a liquidatable position");
        return;
      }

      await switchToNetwork(CONTRACTS_V2.INTENT_REGISTRY_V2.chainId);

      const contract = await getIntentRegistryV2Contract();
      const targetHealthFactor = parseEther(formData.get("hf") as string);
      const minPrice = parseUnits(formData.get("price") as string, 6);
      const currentBlock = await contract.runner?.provider?.getBlockNumber() || 0;
      const deadline = currentBlock + 100;
      // MIN_STAKE on IntentRegistryV2 is 0.1 MATIC
      const bondAmount = parseEther("0.1");

      const signer = contract.runner;
      if (!signer || typeof (signer as any).getAddress !== "function") {
        throw new Error("Contract signer not available");
      }
      const userAddress = await (signer as any).getAddress();
      const intentHash = solidityPackedKeccak256(
        ["address", "address", "uint256", "uint256"],
        [userAddress, targetUser, targetHealthFactor, deadline]
      );

      // Use the Aave V3 Amoy pool — whitelisted via addProtocol() on IntentRegistryV2
      const targetProtocol = AAVE_V3_AMOY.POOL;

      toast.info("⚠️ Make sure you have at least 0.1 MATIC in your wallet for the bond!");

      const tx = await contract.submitIntent(
        intentHash,
        targetUser,
        targetProtocol,
        targetHealthFactor,
        minPrice,
        deadline,
        {
          value: bondAmount,
          gasLimit: 300000n,
        }
      );

      toast.info("Transaction submitted. Waiting for confirmation...");
      const receipt = await tx.wait();

      let emittedHash = intentHash;
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === "IntentSubmitted";
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = contract.interface.parseLog(event);
        emittedHash = parsed?.args[0] ?? intentHash;
        toast.success(`Intent submitted on-chain! Hash: ${emittedHash.substring(0, 10)}...`);
      } else {
        toast.success("Liquidation intent submitted on-chain!");
      }

      try {
        const convexIntentId = await onSubmitIntent({
          targetUserAddress: targetUser,
          targetHealthFactor: hfValue,
          minPrice: parseFloat(formData.get("price") as string),
          bondAmount: 0.1,
          walletAddress: walletAddress || userAddress,
        });
        toast.success("Intent recorded in registry!");

        if (convexIntentId && emittedHash !== intentHash) {
          try {
            await updateIntentHash({
              intentId: convexIntentId,
              intentHash: emittedHash,
              walletAddress: walletAddress || userAddress,
            });
          } catch (hashErr) {
            console.warn("Could not update intent hash:", hashErr);
          }
        }
      } catch (convexError: any) {
        console.error("Convex record failed:", convexError);
        toast.warning(`On-chain tx succeeded but registry record failed: ${convexError.message || "Unknown error"}`);
      }
      form.reset();
      setDialogOpen(false);
    } catch (error: any) {
      console.error("Failed to submit intent:", error);
      if (error.code === "INSUFFICIENT_FUNDS") {
        toast.error("Insufficient funds! You need at least 0.1 MATIC + gas fees.");
      } else if (error.code === "ACTION_REJECTED" || error.message?.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else if (error.code === -32002 || error.message?.includes("too many errors") || error.message?.includes("RPC endpoint")) {
        toast.error("RPC rate limit hit. Please wait 30 seconds and try again, or switch to a different network connection.");
      } else if (error.message?.includes("Unsupported protocol")) {
        toast.error("Protocol not whitelisted on IntentRegistryV2. Only Polygon Amoy Aave V3 is supported.");
      } else if (error.message?.includes("Maximum 10 pending")) {
        toast.error(error.message);
      } else {
        toast.error(error.message || "Failed to submit intent. Check console for details.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: any) => {
    setIsVerifying(id);
    try {
      toast.info("Verifying ZK proof...");
      await onVerifyIntent({ intentId: id, walletAddress: walletAddress || undefined });
      toast.success("Intent verified successfully!");
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsVerifying(null);
    }
  };

  const openExecuteModal = (intent: any) => {
    setSelectedIntent({ id: intent._id, hash: intent.intentHash, address: intent.targetUserAddress });
    setExecuteModalOpen(true);
  };

  const handleExecuteSuccess = async (intentId: string) => {
    try {
      await onExecuteIntent({ intentId, walletAddress: walletAddress || undefined });
      toast.success("Execution recorded in registry!");
    } catch (e: any) {
      toast.warning(`On-chain tx succeeded but registry update failed: ${e.message}`);
    }
    setExecuteModalOpen(false);
    setSelectedIntent(null);
  };

  const handleCreateIntentFromChecker = (address: string, hf: number) => {
    setPrefillAddress(address);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold mb-1">Liquidation Intent Registry</h2>
          <p className="text-sm text-muted-foreground">On-chain liquidation intents via Polygon Amoy</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-black hover:bg-primary/90 gap-2">
              <Zap className="w-4 h-4" />
              New Intent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[480px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Submit Liquidation Intent</DialogTitle>
              <DialogDescription>
                Create a new on-chain liquidation intent. Requires 0.1 MATIC bond on Polygon Amoy.
              </DialogDescription>
            </DialogHeader>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-yellow-500">Before submitting:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground text-xs">
                    <li>Connect to <strong>Polygon Amoy</strong> network (Chain ID: 80002)</li>
                    <li>Have at least <strong>0.1 MATIC + gas fees</strong> in your wallet (MIN_STAKE)</li>
                    <li>Get testnet tokens from <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Polygon Faucet</a></li>
                    <li>ZK proof verification required before execution (via zkEVM verifier)</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmitIntent} className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm">Target User Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="0x..."
                  required
                  defaultValue={prefillAddress}
                  pattern="^0x[0-9a-fA-F]{40}$"
                  title="Must be a valid Ethereum address"
                  className="bg-background border-border/60 font-mono text-sm h-10"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hf" className="text-sm">Target Health Factor</Label>
                  <Input
                    id="hf"
                    name="hf"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="0.99"
                    placeholder="0.95"
                    required
                    className="bg-background border-border/60 h-10"
                  />
                  <p className="text-xs text-muted-foreground">Must be &lt; 1.0</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm">Min Price (MATIC)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    placeholder="2500"
                    required
                    className="bg-background border-border/60 h-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Bond Amount</Label>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border/60">
                  <span className="text-sm font-mono font-medium">0.1 MATIC</span>
                  <span className="text-xs text-muted-foreground ml-auto">MIN_STAKE — returned after execution</span>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-black hover:bg-primary/90 h-10"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Submitting on-chain...
                    </span>
                  ) : "Submit Intent"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Position Checker */}
      <PositionChecker onCreateIntent={handleCreateIntentFromChecker} />

      {/* Contract info bar */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 text-xs text-muted-foreground">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
        <span>Live on Polygon Amoy</span>
        <span className="font-mono">{CONTRACTS_V2.INTENT_REGISTRY_V2.address?.slice(0, 10)}...</span>
        <a
          href={`https://amoy.polygonscan.com/address/${CONTRACTS_V2.INTENT_REGISTRY_V2.address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Explorer
        </a>
      </div>

      {/* ZK Proof requirement notice */}
      <div className="flex items-start gap-3 p-3 rounded-lg border border-blue-500/20 bg-blue-500/5 text-xs">
        <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        </div>
        <div className="text-muted-foreground">
          <span className="text-blue-400 font-medium">ZK Proof Required: </span>
          Execution requires a valid ZK proof submitted to the verifier on Polygon zkEVM
          (<span className="font-mono">{CONTRACTS_V2.ZK_VERIFIER.address.slice(0, 10)}...</span>).
          Proofs expire after 1 hour.
        </div>
      </div>

      {/* Intents list */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Intents</CardTitle>
          <CardDescription>Liquidation intents tracked on-chain and in the protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {intents && intents.length > 0 ? (
              intents.map((intent, index) => (
                <motion.div
                  key={intent._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.04 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:border-border transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${getStatusColor(intent.status)}`}>
                      {getStatusIcon(intent.status)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-mono text-sm font-medium">
                          {intent.targetUserAddress.substring(0, 8)}...{intent.targetUserAddress.substring(38)}
                        </span>
                        <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-muted/50">
                          HF: {intent.targetHealthFactor}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Min ${intent.minPrice} · Bond {intent.bondAmount} MATIC
                        {intent.aiRiskScore && (
                          <span className="ml-2 text-purple-400">· AI Score: {intent.aiRiskScore}/100</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                    <Badge variant="outline" className={`text-[10px] h-5 capitalize ${getStatusColor(intent.status)}`}>
                      {intent.status}
                    </Badge>
                    {intent.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerify(intent._id)}
                        disabled={isVerifying === intent._id}
                        className="h-7 text-xs px-2"
                      >
                        {isVerifying === intent._id ? "Verifying..." : "Verify"}
                      </Button>
                    )}
                    {intent.status === "verified" && (
                      <Button
                        size="sm"
                        onClick={() => openExecuteModal(intent)}
                        className="h-7 text-xs px-2 bg-primary text-black hover:bg-primary/90"
                      >
                        Execute
                      </Button>
                    )}
                    <span className="text-[10px] font-mono text-muted-foreground/60 hidden sm:block">
                      {new Date(intent._creationTime).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <Database className="w-10 h-10 mx-auto mb-3 opacity-20" />
                <p className="font-medium mb-1">No intents yet</p>
                <p className="text-sm">Submit a new intent to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Execute Modal */}
      {selectedIntent && (
        <ExecuteModal
          open={executeModalOpen}
          onOpenChange={setExecuteModalOpen}
          intentId={selectedIntent.id}
          intentHash={selectedIntent.hash}
          targetAddress={selectedIntent.address}
          onSuccess={handleExecuteSuccess}
          walletAddress={walletAddress}
        />
      )}
    </div>
  );
}