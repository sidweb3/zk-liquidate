import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { IntentRegistry } from "@/components/dashboard/IntentRegistry";
import { VerifierStatus } from "@/components/dashboard/VerifierStatus";
import { RiskOracle } from "@/components/dashboard/RiskOracle";
import { useWalletConnection } from "@/hooks/useContract";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { signOut } = useAuth();
  const { isConnected, address, chainId } = useWalletConnection();
  
  const stats = useQuery(api.protocol.getStats);
  const intents = useQuery(api.protocol.getIntents, {});
  const marketData = useQuery(api.protocol.getMarketData);
  
  const submitIntent = useMutation(api.protocol.submitIntent);
  const verifyIntent = useMutation(api.protocol.verifyIntent);
  const executeIntent = useMutation(api.protocol.executeIntent);
  const seedData = useMutation(api.protocol.seedData);

  const handleSeed = async () => {
    await seedData({});
    toast.success("Demo data seeded!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <DashboardHeader onSeed={handleSeed} onSignOut={signOut} />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Wallet Status Banner */}
        {isConnected && (
          <div className="mb-6 p-4 rounded-lg bg-card border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <div className="text-sm font-medium">Wallet Connected</div>
                <div className="text-xs text-muted-foreground font-mono">
                  {address?.substring(0, 6)}...{address?.substring(38)}
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Chain ID: {chainId}
            </Badge>
          </div>
        )}

        <StatsOverview stats={stats} />

        <Tabs defaultValue="registry" className="space-y-4">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger value="registry">Intent Registry</TabsTrigger>
            <TabsTrigger value="verifier">ZK Verifier</TabsTrigger>
            <TabsTrigger value="oracle">Risk Oracle</TabsTrigger>
          </TabsList>

          <TabsContent value="registry">
            <IntentRegistry 
              intents={intents} 
              onSubmitIntent={submitIntent}
              onVerifyIntent={verifyIntent}
              onExecuteIntent={executeIntent}
            />
          </TabsContent>

          <TabsContent value="verifier">
            <VerifierStatus />
          </TabsContent>

          <TabsContent value="oracle">
            <RiskOracle marketData={marketData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}