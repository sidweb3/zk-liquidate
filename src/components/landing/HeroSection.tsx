import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wallet, BookOpen } from "lucide-react";

interface HeroSectionProps {
  onConnectWallet: () => void;
}

export function HeroSection({ onConnectWallet }: HeroSectionProps) {
  return (
    <section className="container mx-auto px-6 py-20 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
          Now Live on Polygon AggLayer
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
          Institutional Grade <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Cross-Chain Liquidations</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Unlock $50B+ in cross-chain lending with ZK-verified liquidation intents. 
          Eliminate oracle desync, front-running, and execution failures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
            onClick={onConnectWallet}
          >
            <Wallet className="mr-2 w-5 h-5" />
            Connect Wallet
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary/20 hover:bg-primary/10 text-lg px-8"
            onClick={() => window.open("https://github.com/yourusername/zk-cross-liquidate", "_blank")}
          >
            <BookOpen className="mr-2 w-5 h-5" />
            Read Whitepaper
          </Button>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 max-w-md mx-auto"
        >
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-left">
            <p className="text-sm font-medium mb-2">🚀 Quick Start:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Connect your MetaMask wallet</li>
              <li>Switch to Polygon Amoy testnet</li>
              <li>Get free testnet tokens from faucet</li>
              <li>Start liquidating with ZK proofs!</li>
            </ol>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}