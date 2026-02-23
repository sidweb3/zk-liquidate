import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, ExternalLink, Shield, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getIntentRegistryV2Contract, switchToNetwork, CONTRACTS_V2, AAVE_V3_AMOY } from "@/lib/contracts";
import { motion } from "framer-motion";

interface OwnerToolsProps {
  walletAddress?: string | null;
}

const KNOWN_PROTOCOLS = [
  {
    name: "Aave V3 Amoy Pool",
    address: AAVE_V3_AMOY.POOL,
    description: "Polygon Amoy testnet Aave V3 lending pool",
    recommended: true,
  },
  {
    name: "Aave V3 Polygon Mainnet",
    address: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
    description: "Polygon mainnet Aave V3 (already whitelisted in constructor)",
    recommended: false,
  },
];

export function OwnerTools({ walletAddress }: OwnerToolsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [customProtocol, setCustomProtocol] = useState("");
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState<boolean | null>(null);
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);

  const handleAddProtocol = async (protocolAddress: string) => {
    if (!protocolAddress.startsWith("0x") || protocolAddress.length !== 42) {
      toast.error("Invalid protocol address format");
      return;
    }

    setIsAdding(true);
    try {
      await switchToNetwork(CONTRACTS_V2.INTENT_REGISTRY_V2.chainId);
      const contract = await getIntentRegistryV2Contract();

      // Check if caller is owner
      const owner = await (contract as any).owner();
      setOwnerAddress(owner);

      const signer = contract.runner;
      if (!signer || typeof (signer as any).getAddress !== "function") {
        throw new Error("Wallet not connected");
      }
      const callerAddress = await (signer as any).getAddress();

      if (owner.toLowerCase() !== callerAddress.toLowerCase()) {
        toast.error(`Only the contract owner can add protocols. Owner: ${owner.slice(0, 10)}...`);
        return;
      }

      toast.info("Sending addProtocol transaction...");
      const tx = await (contract as any).addProtocol(protocolAddress, {
        maxFeePerGas: 50000000000n,
        maxPriorityFeePerGas: 30000000000n,
      });

      toast.info("Waiting for confirmation...");
      const receipt = await tx.wait();

      toast.success(`✅ Protocol whitelisted! Tx: ${receipt.hash.slice(0, 10)}...`, {
        description: "You can now submit intents using this protocol.",
        action: {
          label: "View",
          onClick: () => window.open(`https://amoy.polygonscan.com/tx/${receipt.hash}`, "_blank"),
        },
      });

      setCustomProtocol("");
    } catch (e: any) {
      console.error("addProtocol failed:", e);
      if (e.code === "ACTION_REJECTED" || e.message?.includes("user rejected")) {
        toast.error("Transaction rejected by user");
      } else if (e.message?.includes("Ownable")) {
        toast.error("Only the contract owner can call addProtocol");
      } else {
        toast.error(e.message || "Failed to add protocol");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleCheckProtocol = async () => {
    const addr = checkAddress.trim();
    if (!addr.startsWith("0x") || addr.length !== 42) {
      toast.error("Invalid address format");
      return;
    }

    setIsChecking(true);
    setCheckResult(null);
    try {
      await switchToNetwork(CONTRACTS_V2.INTENT_REGISTRY_V2.chainId);
      const contract = await getIntentRegistryV2Contract();
      const isSupported = await (contract as any).supportedProtocols(addr);
      setCheckResult(isSupported);
    } catch (e: any) {
      toast.error(e.message || "Failed to check protocol");
    } finally {
      setIsChecking(false);
    }
  };

  const handleFetchOwner = async () => {
    try {
      await switchToNetwork(CONTRACTS_V2.INTENT_REGISTRY_V2.chainId);
      const contract = await getIntentRegistryV2Contract();
      const owner = await (contract as any).owner();
      setOwnerAddress(owner);
      toast.info(`Contract owner: ${owner}`);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch owner");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Owner Tools</h2>
        <p className="text-sm text-muted-foreground">
          Admin functions for managing the IntentRegistryV2 contract
        </p>
      </div>

      {/* Contract info */}
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 text-xs text-muted-foreground">
        <Shield className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="font-mono">{CONTRACTS_V2.INTENT_REGISTRY_V2.address}</span>
        <a
          href={`https://amoy.polygonscan.com/address/${CONTRACTS_V2.INTENT_REGISTRY_V2.address}#writeContract`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-1 text-primary hover:underline"
        >
          <ExternalLink className="w-3 h-3" />
          Write Contract
        </a>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground space-y-1">
          <p className="font-medium text-yellow-500">Owner-only functions</p>
          <p>
            These functions require the connected wallet to be the contract owner (deployer).
            The current owner is{" "}
            <span className="font-mono text-xs">0xA41...B7b89</span>.
          </p>
          <button
            onClick={handleFetchOwner}
            className="text-primary hover:underline text-xs"
          >
            Verify owner on-chain →
          </button>
          {ownerAddress && (
            <p className="font-mono text-xs text-green-400 mt-1">Owner: {ownerAddress}</p>
          )}
        </div>
      </div>

      {/* Quick whitelist known protocols */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Whitelist Protocol</CardTitle>
          <CardDescription>
            Add a DeFi protocol address to the supported protocols list
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Known protocols */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Quick Add Known Protocols</Label>
            {KNOWN_PROTOCOLS.map((protocol) => (
              <motion.div
                key={protocol.address}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium">{protocol.name}</span>
                    {protocol.recommended && (
                      <Badge variant="outline" className="text-[10px] h-4 px-1.5 bg-green-500/10 text-green-500 border-green-500/30">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{protocol.address.slice(0, 20)}...</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{protocol.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddProtocol(protocol.address)}
                  disabled={isAdding}
                  className="ml-3 h-8 text-xs gap-1 flex-shrink-0"
                >
                  <Plus className="w-3 h-3" />
                  {isAdding ? "Adding..." : "Add"}
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Custom protocol */}
          <div className="space-y-2 pt-2 border-t border-border/40">
            <Label className="text-sm">Custom Protocol Address</Label>
            <div className="flex gap-2">
              <Input
                value={customProtocol}
                onChange={(e) => setCustomProtocol(e.target.value)}
                placeholder="0x..."
                className="font-mono text-sm h-9 bg-background border-border/60"
              />
              <Button
                onClick={() => handleAddProtocol(customProtocol)}
                disabled={isAdding || !customProtocol}
                className="h-9 bg-primary text-black hover:bg-primary/90 gap-1 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                {isAdding ? "Adding..." : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check protocol status */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Check Protocol Status</CardTitle>
          <CardDescription>
            Verify if a protocol address is whitelisted on the contract
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="0x..."
              className="font-mono text-sm h-9 bg-background border-border/60"
            />
            <Button
              variant="outline"
              onClick={handleCheckProtocol}
              disabled={isChecking || !checkAddress}
              className="h-9 flex-shrink-0"
            >
              {isChecking ? "Checking..." : "Check"}
            </Button>
          </div>

          {checkResult !== null && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm ${
                checkResult
                  ? "border-green-500/20 bg-green-500/5 text-green-400"
                  : "border-red-500/20 bg-red-500/5 text-red-400"
              }`}
            >
              {checkResult ? (
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              )}
              <span>
                {checkResult
                  ? "✅ Protocol is whitelisted — intents can be submitted"
                  : "❌ Protocol is NOT whitelisted — call addProtocol() first"}
              </span>
            </motion.div>
          )}

          {/* Quick check buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {KNOWN_PROTOCOLS.map((p) => (
              <button
                key={p.address}
                onClick={() => setCheckAddress(p.address)}
                className="text-xs text-primary hover:underline"
              >
                Use {p.name} →
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manual Instructions</CardTitle>
          <CardDescription>Alternative: call directly on Polygonscan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Go to{" "}
              <a
                href={`https://amoy.polygonscan.com/address/${CONTRACTS_V2.INTENT_REGISTRY_V2.address}#writeContract`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                IntentRegistryV2 on Polygonscan ↗
              </a>
            </li>
            <li>Click <strong>Connect to Web3</strong> with your deployer wallet</li>
            <li>
              Find <strong>addProtocol</strong> and enter:{" "}
              <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                {AAVE_V3_AMOY.POOL}
              </span>
            </li>
            <li>Click <strong>Write</strong> and confirm the transaction</li>
            <li>Once confirmed, intent submission will work with the Amoy Aave pool</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
