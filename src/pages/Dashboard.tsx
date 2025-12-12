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
import { LiquidationSimulator } from "@/components/dashboard/LiquidationSimulator";
import { AutomatedBot } from "@/components/dashboard/AutomatedBot";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { useWalletConnection } from "@/hooks/useContract";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Activity, Wallet, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { signOut } = useAuth();
  const { isConnected, address, chainId } = useWalletConnection();
  
  const stats = useQuery(api.protocol.getStats);
  const intents = useQuery(api.protocol.getIntents, {});
  const marketData = useQuery(api.protocol.getMarketData);
  
  const submitIntent = useMutation(api.protocol.submitIntent);
  const verifyIntent = useMutation(api.protocol.verifyIntent);
  const executeIntent = useMutation(api.protocol.executeIntent);
  const runSimulation = useMutation(api.protocol.runSimulation);
  const seedData = useMutation(api.protocol.seedData);

  const handleSeed = async () => {
    await seedData({});
    toast.success("Demo data seeded!");
  };

  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown";
    if (id === 80002) return "Polygon Amoy";
    if (id === 1442) return "Polygon zkEVM";
    if (id === 137) return "Polygon PoS";
    return `Chain ${id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <DashboardHeader onSeed={handleSeed} onSignOut={signOut} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Enhanced Wallet Status Banner */}
        {isConnected ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)]" />
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-black" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-pulse" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-muted-foreground">Connected Wallet</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          <Activity className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <div className="text-lg font-mono font-bold">
                        {address?.substring(0, 8)}...{address?.substring(38)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Network</div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
                        {getNetworkName(chainId)}
                      </Badge>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-yellow-500/20 bg-gradient-to-r from-card to-yellow-500/5">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium">No Wallet Connected</div>
                    <div className="text-sm text-muted-foreground">Connect your wallet to interact with the protocol</div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <StatsOverview stats={stats} />

        <Tabs defaultValue="registry" className="space-y-6">
          <TabsList className="bg-card/50 backdrop-blur-sm border border-border p-1 h-auto">
            <TabsTrigger 
              value="registry" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              Intent Registry
            </TabsTrigger>
            <TabsTrigger 
              value="verifier"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              ZK Verifier
            </TabsTrigger>
            <TabsTrigger 
              value="oracle"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              Risk Oracle
            </TabsTrigger>
            <TabsTrigger 
              value="simulator"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              Simulator
            </TabsTrigger>
            <TabsTrigger 
              value="bot"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              Auto Bot
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-3 rounded-lg transition-all"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registry" className="space-y-4">
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

          <TabsContent value="simulator">
            <LiquidationSimulator onRunSimulation={runSimulation} />
          </TabsContent>

          <TabsContent value="bot">
            <AutomatedBot />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsChart />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}