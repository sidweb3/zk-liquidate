import { useState, useEffect } from "react";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

export function useWalletConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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

  async function connectWallet() {
    if (typeof window.ethereum === "undefined") {
      toast.error("Please install MetaMask or another Web3 wallet");
      return;
    }
    setIsConnecting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      const network = await provider.getNetwork();
      setAddress(addr);
      setChainId(Number(network.chainId));
      setIsConnected(true);
      toast.success(`Connected: ${addr.substring(0, 6)}...${addr.substring(38)}`);
    } catch (error: any) {
      if (error.code === 4001 || error.message?.includes("user rejected")) {
        toast.error("Connection rejected");
      } else {
        toast.error("Failed to connect wallet");
      }
    } finally {
      setIsConnecting(false);
    }
  }

  async function switchToAmoy() {
    if (typeof window.ethereum === "undefined") return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x13882" }], // 80002
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0x13882",
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: ["https://rpc-amoy.polygon.technology/"],
              blockExplorerUrls: ["https://amoy.polygonscan.com/"],
            }],
          });
          toast.success("Polygon Amoy added to wallet!");
        } catch {
          toast.error("Failed to add Polygon Amoy network");
        }
      } else {
        toast.error("Failed to switch network");
      }
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

  return { isConnected, address, chainId, isConnecting, connectWallet, switchToAmoy };
}