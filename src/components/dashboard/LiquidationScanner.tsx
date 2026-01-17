import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Shield, Info } from "lucide-react";
import { ethers } from "ethers";
import { toast } from "sonner";

// Your deployed Intent Registry contract
const INTENT_REGISTRY_ADDRESS = "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a";

const INTENT_REGISTRY_ABI = [
  "function intents(bytes32) view returns (address liquidator, bytes32 intentHash, address targetUser, uint256 targetHealthFactor, uint256 minPrice, uint256 deadline, uint256 stakeAmount, bool isExecuted, bool isCancelled, uint256 createdAt)",
  "function liquidatorIntents(address, uint256) view returns (bytes32)",
];

export function LiquidationScanner() {
  const [targetAddress, setTargetAddress] = useState("");
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const scanAddress = async () => {
    if (!targetAddress || !ethers.isAddress(targetAddress)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setScanning(true);
    setResult(null);

    try {
      // Connect to Polygon Amoy where your contract is deployed
      const provider = new ethers.JsonRpcProvider(
        "https://rpc-amoy.polygon.technology"
      );

      const contract = new ethers.Contract(
        INTENT_REGISTRY_ADDRESS,
        INTENT_REGISTRY_ABI,
        provider
      );

      // Check if this address has any intents
      try {
        const intentHash = await contract.liquidatorIntents(targetAddress, 0);

        if (intentHash && intentHash !== ethers.ZeroHash) {
          const intent = await contract.intents(intentHash);

          setResult({
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
          setResult({
            hasIntents: false,
            address: targetAddress,
          });
          toast.info("No active liquidation intents found for this address");
        }
      } catch (err: any) {
        setResult({
          hasIntents: false,
          address: targetAddress,
        });
        toast.info("No liquidation intents found");
      }
    } catch (err: any) {
      console.error("Error scanning address:", err);
      toast.error("Failed to scan address. Please try again.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Intent Scanner</h3>
        <p className="text-sm text-muted-foreground">
          Check if an address has submitted any liquidation intents on your deployed contracts
        </p>
      </div>

      {/* Search Input */}
      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter Ethereum address (0x...)"
          value={targetAddress}
          onChange={(e) => setTargetAddress(e.target.value)}
          className="font-mono text-sm"
        />
        <Button
          onClick={scanAddress}
          disabled={scanning}
          className="gap-2 whitespace-nowrap"
        >
          <Search className="w-4 h-4" />
          {scanning ? "Scanning..." : "Scan"}
        </Button>
      </div>

      {/* Info Card */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-500">About This Scanner</p>
            <p className="text-xs text-muted-foreground mt-1">
              This scanner checks your deployed Intent Registry contract on Polygon Amoy to see if an
              address has submitted any liquidation intents. It queries real on-chain data from your
              smart contracts.
            </p>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4">
          {result.hasIntents ? (
            <>
              {/* Intent Found Card */}
              <Card className="p-4 border-2 border-primary bg-primary/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="font-semibold">Active Intent Found</span>
                  </div>
                  <Badge variant="default">
                    {result.isExecuted ? "EXECUTED" : result.isCancelled ? "CANCELLED" : "ACTIVE"}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Liquidator</p>
                      <p className="font-mono text-xs">{result.liquidator.slice(0, 10)}...</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Target User</p>
                      <p className="font-mono text-xs">{result.targetUser.slice(0, 10)}...</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Health Factor Target</p>
                      <p className="font-semibold">{result.targetHealthFactor.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stake Amount</p>
                      <p className="font-semibold">{result.stakeAmount} POL</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Created At</p>
                    <p className="text-xs">{result.createdAt.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Real Data:</strong> This intent is stored on your
                  Intent Registry contract at {INTENT_REGISTRY_ADDRESS.slice(0, 10)}... on Polygon Amoy.
                </p>
              </div>
            </>
          ) : (
            <Card className="p-4 border-muted">
              <div className="text-center py-4">
                <Shield className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="font-semibold mb-2">No Intents Found</p>
                <p className="text-sm text-muted-foreground">
                  This address hasn't submitted any liquidation intents yet.
                </p>
                <p className="text-xs text-muted-foreground mt-2 font-mono">
                  {result.address}
                </p>
              </div>

              <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Try it yourself:</strong> Submit an intent through
                  the "Intent Registry" tab, then come back and scan your own wallet address!
                </p>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Contract Info */}
      <div className="mt-6 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs font-semibold mb-1">Contract Information</p>
        <p className="text-xs text-muted-foreground">
          Intent Registry: <span className="font-mono">{INTENT_REGISTRY_ADDRESS}</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Network: Polygon Amoy (Chain ID: 80002)
        </p>
        <a
          href={`https://amoy.polygonscan.com/address/${INTENT_REGISTRY_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View on Explorer →
        </a>
      </div>
    </Card>
  );
}
