import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface LandingNavbarProps {
  onConnectWallet: () => void;
}

export function LandingNavbar({ onConnectWallet }: LandingNavbarProps) {
  return (
    <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img 
          src="/zklogo.png" 
          alt="zkLiquidate Logo" 
          className="w-8 h-8 rounded-lg"
        />
        <span className="text-xl font-bold tracking-tighter">zkLiquidate</span>
      </div>
      <div className="flex gap-4">
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onConnectWallet}
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
      </div>
    </nav>
  );
}
