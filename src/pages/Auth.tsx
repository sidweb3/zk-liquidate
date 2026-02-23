import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAuth } from "@/hooks/use-auth";
import { Loader2, Wallet } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BrowserProvider } from "ethers";

interface AuthProps {
  redirectAfterAuth?: string;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirectAfterAuth]);

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if MetaMask or any Web3 wallet is installed
      if (typeof window.ethereum === "undefined") {
        setError("No Web3 wallet detected. Please install MetaMask or Trust Wallet.");
        setIsLoading(false);
        return;
      }

      // Request account access
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      if (accounts.length === 0) {
        setError("No accounts found. Please unlock your wallet.");
        setIsLoading(false);
        return;
      }

      const address = accounts[0];
      setWalletAddress(address);

      // Sign in anonymously for now (wallet auth provider would need to be added to Convex)
      // This allows the user to access the app with their wallet connected
      await signIn("anonymous");
      
      const redirect = redirectAfterAuth || "/dashboard";
      navigate(redirect);
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      
      if (error.code === 4001) {
        setError("Connection request rejected. Please approve the connection in your wallet.");
      } else if (error.code === -32002) {
        setError("Connection request already pending. Please check your wallet.");
      } else {
        setError(`Failed to connect wallet: ${error.message || 'Unknown error'}`);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Auth Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center justify-center h-full flex-col">
          <Card className="min-w-[350px] pb-0 border shadow-md">
            <CardHeader className="text-center">
              <div className="flex justify-center">
                <img
                  src="./logo.svg"
                  alt="zkLiquidate Logo"
                  width={64}
                  height={64}
                  className="rounded-lg mb-4 mt-4 cursor-pointer"
                  onClick={() => navigate("/")}
                />
              </div>
              <CardTitle className="text-xl">Connect to zkLiquidate</CardTitle>
              <CardDescription>
                Connect your Web3 wallet to access the protocol
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                type="button"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleWalletConnect}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="mr-2 h-4 w-4" />
                )}
                Connect Wallet
              </Button>

              {walletAddress && (
                <p className="text-sm text-green-500 text-center">
                  Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}
                </p>
              )}

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Supports MetaMask, Trust Wallet, and other Web3 wallets
              </p>
            </CardContent>

            <div className="py-4 px-6 text-xs text-center text-muted-foreground bg-muted border-t rounded-b-lg">
              Secured by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary transition-colors"
              >
                vly.ai
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}