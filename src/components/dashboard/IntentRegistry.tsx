import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Clock, Zap, Link2, Database } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getIntentRegistryContract, getZKVerifierContract, getLiquidationExecutorContract, switchToNetwork, CONTRACTS, fetchUserCollateralAssets } from "@/lib/contracts";
import { parseEther } from "ethers";
import { motion } from "framer-motion";

interface IntentRegistryProps {
  intents: any[] | undefined;
  onSubmitIntent: (data: any) => Promise<any>;
  onVerifyIntent: (args: { intentId: any }) => Promise<any>;
  onExecuteIntent: (args: { intentId: any }) => Promise<any>;
}

export function IntentRegistry({ intents, onSubmitIntent, onVerifyIntent, onExecuteIntent }: IntentRegistryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [useBlockchain, setUseBlockchain] = useState(true);

  const handleSubmitIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      if (useBlockchain) {
        await switchToNetwork(CONTRACTS.INTENT_REGISTRY.chainId);
        
        const contract = await getIntentRegistryContract();
        const targetUser = formData.get("address") as string;
        const targetHealthFactor = Math.floor(parseFloat(formData.get("hf") as string) * 100);
        const minPrice = parseEther(formData.get("price") as string);
        const deadline = Math.floor(Date.now() / 1000) + 3600;
        const bondAmount = parseEther("10");
        
        console.log("Submitting intent with params:", {
          targetUser,
          targetHealthFactor,
          minPrice: minPrice.toString(),
          deadline,
          bondAmount: bondAmount.toString()
        });
        
        const tx = await contract.submitIntent(
          targetUser,
          targetHealthFactor,
          minPrice,
          deadline,
          { value: bondAmount }
        );
        
        toast.info("Transaction submitted. Waiting for confirmation...");
        const receipt = await tx.wait();
        
        // Extract intentHash from event logs
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed?.name === "IntentSubmitted";
          } catch {
            return false;
          }
        });
        
        if (event) {
          const parsed = contract.interface.parseLog(event);
          const intentHash = parsed?.args[0];
          toast.success(`Intent submitted! Hash: ${intentHash.substring(0, 10)}...`);
        } else {
          toast.success("Liquidation intent submitted on-chain!");
        }
      } else {
        await onSubmitIntent({
          targetUserAddress: formData.get("address") as string,
          targetHealthFactor: parseFloat(formData.get("hf") as string),
          minPrice: parseFloat(formData.get("price") as string),
          bondAmount: parseFloat(formData.get("bond") as string),
        });
        toast.success("Liquidation intent submitted (simulated)");
      }
      
      form.reset();
    } catch (error: any) {
      console.error("Failed to submit intent:", error);
      toast.error(error.message || "Failed to submit intent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: any, intentHash?: string) => {
    setIsVerifying(true);
    try {
      if (useBlockchain && intentHash) {
        // Switch to zkEVM network for verification
        await switchToNetwork(CONTRACTS.ZK_VERIFIER.chainId);
        
        const verifierContract = await getZKVerifierContract();
        
        // Generate a mock proof (in production, this would come from a ZK proof generator)
        const mockProof = "0x" + "00".repeat(128); // 128 bytes of mock proof data
        
        toast.info("Submitting ZK proof for verification...");
        const tx = await verifierContract.verifyProof(intentHash, mockProof);
        
        toast.info("Waiting for verification confirmation...");
        await tx.wait();
        
        toast.success("ZK proof verified successfully!");
        
        // Switch back to Amoy network
        await switchToNetwork(CONTRACTS.INTENT_REGISTRY.chainId);
      } else {
        await onVerifyIntent({ intentId: id });
        toast.success("Intent verification initiated (simulated)");
      }
    } catch (error: any) {
      console.error("Verification failed:", error);
      toast.error(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleExecute = async (id: any, intentHash?: string) => {
    setIsExecuting(true);
    try {
      if (useBlockchain && intentHash) {
        await switchToNetwork(CONTRACTS.LIQUIDATION_EXECUTOR.chainId);
        
        const executorContract = await getLiquidationExecutorContract();
        
        // Fetch the intent details to get target user address
        const registryContract = await getIntentRegistryContract();
        const intentData = await registryContract.getIntent(intentHash);
        const targetUserAddress = intentData.targetUser;
        
        toast.info("Fetching collateral assets from target user...");
        
        // Fetch real collateral assets from the target user
        const { assets, amounts } = await fetchUserCollateralAssets(targetUserAddress);
        
        console.log("Liquidating assets:", {
          intentHash,
          targetUser: targetUserAddress,
          assets,
          amounts: amounts.map(a => a.toString()),
        });
        
        toast.info(`Executing liquidation for ${assets.length} asset(s)...`);
        const tx = await executorContract.executeLiquidation(
          intentHash,
          assets,
          amounts
        );
        
        toast.info("Waiting for execution confirmation...");
        const receipt = await tx.wait();
        
        toast.success(`Liquidation executed successfully! ${assets.length} asset(s) liquidated.`);
        
        // Switch back to Amoy network
        await switchToNetwork(CONTRACTS.INTENT_REGISTRY.chainId);
      } else {
        await onExecuteIntent({ intentId: id });
        toast.success("Liquidation executed successfully (simulated)");
      }
    } catch (error: any) {
      console.error("Execution failed:", error);
      toast.error(error.message || "Execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'executed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="h-5 w-5" />;
      case 'executed': return <Zap className="h-5 w-5" />;
      case 'failed': return <AlertTriangle className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Liquidation Intent Registry</h2>
          <p className="text-muted-foreground mt-1">Manage and track liquidation intents across chains</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant={useBlockchain ? "default" : "outline"}
            size="sm"
            onClick={() => setUseBlockchain(!useBlockchain)}
            className="transition-all"
          >
            {useBlockchain ? (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Blockchain
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Simulated
              </>
            )}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-primary to-accent text-black hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                <Zap className="mr-2 h-4 w-4" /> New Liquidation Intent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-2xl">Submit Liquidation Intent</DialogTitle>
                <DialogDescription>
                  {useBlockchain 
                    ? "Create a new liquidation intent on-chain. Requires 10 POL bond."
                    : "Create a simulated liquidation intent for testing."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitIntent} className="grid gap-6 py-4">
                <div className="grid gap-3">
                  <Label htmlFor="address" className="text-sm font-medium">Target User Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    placeholder="0x..." 
                    required 
                    className="bg-background border-input h-11" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="hf" className="text-sm font-medium">Target Health Factor</Label>
                    <Input 
                      id="hf" 
                      name="hf" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.95" 
                      required 
                      className="bg-background border-input h-11" 
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="price" className="text-sm font-medium">Min Price (POL)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      placeholder="2500" 
                      required 
                      className="bg-background border-input h-11" 
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="bond" className="text-sm font-medium">Bond Amount (POL)</Label>
                  <Input 
                    id="bond" 
                    name="bond" 
                    type="number" 
                    defaultValue="10" 
                    readOnly 
                    className="bg-muted border-input h-11" 
                  />
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="bg-gradient-to-r from-primary to-accent text-black hover:opacity-90 w-full h-11"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Intent"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Recent Intents</CardTitle>
          <CardDescription>
            {useBlockchain 
              ? "Live feed from deployed smart contracts"
              : "Simulated liquidation intents for testing"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {intents?.map((intent, index) => (
              <motion.div
                key={intent._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center justify-between p-5 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:border-primary/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${getStatusColor(intent.status)} group-hover:scale-110 transition-transform`}>
                    {getStatusIcon(intent.status)}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2 mb-1">
                      <span className="font-mono">{intent.targetUserAddress.substring(0, 6)}...{intent.targetUserAddress.substring(38)}</span>
                      <Badge variant="outline" className="text-xs font-normal bg-muted">
                        HF: {intent.targetHealthFactor}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Min Price: ${intent.minPrice} • Bond: {intent.bondAmount} POL
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-[10px] h-5 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        AI Score: {(Math.random() * 100).toFixed(0)}/100
                      </Badge>
                      <Badge className={`text-[10px] h-5 capitalize ${getStatusColor(intent.status)}`}>
                        {intent.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {intent.status === 'pending' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleVerify(intent._id, intent.intentHash)} 
                      disabled={isVerifying}
                      className="hover:border-primary/50"
                    >
                      {isVerifying ? "Verifying..." : "Verify Proof"}
                    </Button>
                  )}
                  {intent.status === 'verified' && (
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-accent text-black hover:opacity-90" 
                      onClick={() => handleExecute(intent._id, intent.intentHash)}
                      disabled={isExecuting}
                    >
                      {isExecuting ? "Executing..." : "Execute"}
                    </Button>
                  )}
                  <div className="text-right text-sm text-muted-foreground min-w-[100px]">
                    <div className="font-mono text-xs opacity-70">{new Date(intent._creationTime).toLocaleTimeString()}</div>
                  </div>
                </div>
              </motion.div>
            ))}
            {(!intents || intents.length === 0) && (
              <div className="text-center py-16 text-muted-foreground">
                <Database className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium mb-1">No active intents found</p>
                <p className="text-sm">Submit a new intent to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case 'verified': return 'bg-green-500/20 text-green-500 border-green-500/30';
    case 'executed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    case 'failed': return 'bg-red-500/20 text-red-500 border-red-500/30';
    default: return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'verified': return <CheckCircle2 className="h-5 w-5" />;
    case 'executed': return <Zap className="h-5 w-5" />;
    case 'failed': return <AlertTriangle className="h-5 w-5" />;
    default: return <Clock className="h-5 w-5" />;
  }
}