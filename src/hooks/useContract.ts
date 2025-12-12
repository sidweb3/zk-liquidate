import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  useEffect(() => {
    checkConnection();
    
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (typeof window.ethereum !== "undefined") {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  async function checkConnection() {
    if (typeof window.ethereum === "undefined") return;
    
    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setIsConnected(true);
        setAddress(accounts[0].address);
        
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  }

  function handleAccountsChanged(accounts: string[]) {
    if (accounts.length === 0) {
      setIsConnected(false);
      setAddress(null);
      toast.info("Wallet disconnected");
    } else {
      setAddress(accounts[0]);
      setIsConnected(true);
      toast.success(`Connected: ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`);
    }
  }

  function handleChainChanged(chainIdHex: string) {
    const newChainId = parseInt(chainIdHex, 16);
    setChainId(newChainId);
    toast.info(`Network changed to chain ID: ${newChainId}`);
    window.location.reload();
  }

  return { isConnected, address, chainId };
}
