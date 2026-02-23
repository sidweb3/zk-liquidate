import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wallet, RefreshCw, ExternalLink, Copy, CheckCircle2 } from "lucide-react";
import { BrowserProvider, formatEther } from "ethers";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface WalletPanelProps {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  onConnect: () => void;
}

export function WalletPanel({ address, chainId, isConnected, onConnect }: WalletPanelProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchBalance = async () => {
    if (!address || !window.ethereum) return;
    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const bal = await provider.getBalance(address);
      setBalance(parseFloat(formatEther(bal)).toFixed(4));
    } catch (e) {
      console.error("Failed to fetch balance:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchBalance();
    }
  }, [isConnected, address]);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown";
    if (id === 80002) return "Polygon Amoy";
    if (id === 1442) return "Polygon zkEVM";
    if (id === 137) return "Polygon PoS";
    return `Chain ${id}`;
  };

  const getNetworkColor = (id: number | null) => {
    if (id === 80002 || id === 1442) return "text-green-500 bg-green-500/10 border-green-500/20";
    return "text-orange-500 bg-orange-500/10 border-orange-500/20";
  };

  if (!isConnected) {
    return (
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <Wallet className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mb-3">Connect your wallet to interact with the protocol</p>
            <Button onClick={onConnect} className="bg-primary text-black hover:bg-primary/90 gap-2">
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Wallet className="w-4 h-4 text-primary" />
            Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Address */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/40">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Connected Address</p>
              <p className="font-mono text-sm font-medium">
                {address?.substring(0, 10)}...{address?.substring(34)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={copyAddress}
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="Copy address"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>
              <a
                href={`https://amoy.polygonscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-md hover:bg-muted transition-colors"
                title="View on explorer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Balance & Network */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-xs text-muted-foreground mb-1">MATIC Balance</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-sm">
                  {isLoading ? "..." : balance ?? "—"}
                </span>
                <button
                  onClick={fetchBalance}
                  disabled={isLoading}
                  className="p-0.5 rounded hover:bg-muted transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 text-muted-foreground ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
              <p className="text-xs text-muted-foreground mb-1">Network</p>
              <Badge variant="outline" className={`text-xs ${getNetworkColor(chainId)}`}>
                {getNetworkName(chainId)}
              </Badge>
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Connected and ready to transact</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
