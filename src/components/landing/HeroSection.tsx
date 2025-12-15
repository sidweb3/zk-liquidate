import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Wallet, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroSectionProps {
  onConnectWallet: () => void;
}

export function HeroSection({ onConnectWallet }: HeroSectionProps) {
  const phrases = [
    "Cross-Chain Liquidations",
    "ZK-Verified Security",
    "AI-Powered Risk Scoring",
    "Automated Execution",
    "Institutional Grade DeFi"
  ];
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          setTypingSpeed(100);
        } else {
          // Pause at end before deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          setTypingSpeed(50);
        } else {
          // Move to next phrase
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex, typingSpeed, phrases]);

  return (
    <section className="container mx-auto px-6 py-20 text-center relative">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div 
          className="inline-block px-4 py-1.5 mb-6 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Now Live on Polygon AggLayer
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
            Institutional Grade
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent inline-flex items-center min-h-[1.2em]">
            {displayedText}
            <span className="inline-block w-0.5 h-[0.8em] bg-primary ml-1 animate-pulse" />
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Unlock $50B+ in cross-chain lending with ZK-verified liquidation intents. 
          Eliminate oracle desync, front-running, and execution failures.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8"
              onClick={onConnectWallet}
            >
              <Wallet className="mr-2 w-5 h-5" />
              Connect Wallet
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-primary/20 hover:bg-primary/10 text-lg px-8"
              onClick={() => window.open("https://github.com/yourusername/zk-cross-liquidate", "_blank")}
            >
              <BookOpen className="mr-2 w-5 h-5" />
              Read Whitepaper
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-12 max-w-md mx-auto"
        >
          <motion.div 
            className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 text-left"
            whileHover={{ borderColor: "rgba(0, 255, 136, 0.3)" }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm font-medium mb-2">🚀 Quick Start:</p>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Connect your MetaMask wallet</li>
              <li>Switch to Polygon Amoy testnet</li>
              <li>Get free testnet tokens from faucet</li>
              <li>Start liquidating with ZK proofs!</li>
            </ol>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}