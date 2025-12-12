import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowLeft, Wallet } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

export default function WalletConnect() {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = async (walletType: "metamask" | "trust") => {
    setIsConnecting(true);
    
    try {
      if (typeof window.ethereum === "undefined") {
        toast.error(`${walletType === "metamask" ? "MetaMask" : "Trust Wallet"} is not installed. Please install it first.`);
        setIsConnecting(false);
        return;
      }

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        toast.error("No accounts found. Please unlock your wallet.");
        setIsConnecting(false);
        return;
      }

      const address = accounts[0];
      toast.success(`Connected: ${address.substring(0, 6)}...${address.substring(38)}`);
      
      // Navigate to dashboard after successful connection
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      
      if (error.code === 4001) {
        toast.error("Connection request rejected.");
      } else if (error.code === -32002) {
        toast.error("Connection request already pending. Please check your wallet.");
      } else {
        toast.error(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[100px]" />
      </div>

      {/* Back Button */}
      <div className="container mx-auto px-6 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Wallet Selection */}
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-black" />
                </div>
              </div>
              <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
              <CardDescription>
                Choose your preferred wallet to connect to zkLiquidate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* MetaMask Option */}
              <Button
                className="w-full h-auto py-4 bg-background hover:bg-muted border-2 border-border hover:border-primary transition-all"
                variant="outline"
                onClick={() => handleWalletConnect("metamask")}
                disabled={isConnecting}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path fill="#fff" d="M32.5 5L20 14l2.3-5.5L32.5 5z"/>
                      <path fill="#fff" d="M7.5 5l12.3 9.2L17.7 8.5 7.5 5z"/>
                      <path fill="#fff" d="M27.8 28.5l-3.3 5 7 1.9 2-6.7-5.7-.2z"/>
                      <path fill="#fff" d="M6.5 28.7l2 6.7 7-1.9-3.3-5-5.7.2z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-foreground">MetaMask</div>
                    <div className="text-sm text-muted-foreground">Connect using MetaMask wallet</div>
                  </div>
                </div>
              </Button>

              {/* Trust Wallet Option */}
              <Button
                className="w-full h-auto py-4 bg-background hover:bg-muted border-2 border-border hover:border-primary transition-all"
                variant="outline"
                onClick={() => handleWalletConnect("trust")}
                disabled={isConnecting}
              >
                <div className="flex items-center gap-4 w-full">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <svg viewBox="0 0 40 40" className="w-8 h-8">
                      <path fill="#fff" d="M20 5L8 12v10c0 7.5 5.2 14.5 12 16 6.8-1.5 12-8.5 12-16V12L20 5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-foreground">Trust Wallet</div>
                    <div className="text-sm text-muted-foreground">Connect using Trust Wallet</div>
                  </div>
                </div>
              </Button>

              {isConnecting && (
                <div className="text-center text-sm text-muted-foreground">
                  Connecting to wallet...
                </div>
              )}

              <div className="pt-4 text-center text-xs text-muted-foreground">
                By connecting your wallet, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
