import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useWalletConnection } from "@/hooks/useContract";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Wallet, AlertTriangle, Database, LogOut, Search, DollarSign, ClipboardList, Shield, Rocket, Bot, BarChart3, Cpu, Menu, ChevronRight, Zap, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { IntentRegistry } from "@/components/dashboard/IntentRegistry";
import { WalletPanel } from "@/components/dashboard/WalletPanel";
import { TransactionHistory } from "@/components/dashboard/TransactionHistory";

const VerifierStatus = lazy(() => import("@/components/dashboard/VerifierStatus").then(m => ({ default: m.VerifierStatus })));
const AutomatedBot = lazy(() => import("@/components/dashboard/AutomatedBot").then(m => ({ default: m.AutomatedBot })));
const AnalyticsChart = lazy(() => import("@/components/dashboard/AnalyticsChart").then(m => ({ default: m.AnalyticsChart })));
const RealTimePrices = lazy(() => import("@/components/dashboard/RealTimePrices").then(m => ({ default: m.RealTimePrices })));
const LiquidationScanner = lazy(() => import("@/components/dashboard/LiquidationScanner").then(m => ({ default: m.LiquidationScanner })));
const SecurityAuditTracker = lazy(() => import("@/components/dashboard/SecurityAuditTracker").then(m => ({ default: m.SecurityAuditTracker })));
const MainnetReadiness = lazy(() => import("@/components/dashboard/MainnetReadiness").then(m => ({ default: m.MainnetReadiness })));
const RiskOracle = lazy(() => import("@/components/dashboard/RiskOracle").then(m => ({ default: m.RiskOracle })));
const MultiProtocolAdapters = lazy(() => import("@/components/dashboard/MultiProtocolAdapters").then(m => ({ default: m.MultiProtocolAdapters })));
const LiquidationSimulator = lazy(() => import("@/components/dashboard/LiquidationSimulator").then(m => ({ default: m.LiquidationSimulator })));

function TabFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading module...</p>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: BarChart3, group: "main" },
  { id: "scanner", label: "Scanner", icon: Search, group: "main" },
  { id: "registry", label: "Intent Registry", icon: ClipboardList, group: "main" },
  { id: "prices", label: "Live Prices", icon: DollarSign, group: "main" },
  { id: "simulator", label: "Simulator", icon: FlaskConical, group: "main" },
  { id: "verifier", label: "ZK Verifier", icon: Cpu, group: "protocol" },
  { id: "oracle", label: "Risk Oracle", icon: Activity, group: "protocol" },
  { id: "adapters", label: "Adapters", icon: ChevronRight, group: "protocol" },
  { id: "bot", label: "Auto Bot", icon: Bot, group: "automation" },
  { id: "analytics", label: "Analytics", icon: BarChart3, group: "automation" },
  { id: "security", label: "Security Audit", icon: Shield, group: "readiness" },
  { id: "mainnet", label: "Mainnet Ready", icon: Rocket, group: "readiness" },
];

const GROUP_LABELS: Record<string, string> = {
  main: "Core",
  protocol: "Protocol",
  automation: "Automation",
  readiness: "Readiness",
};

export default function Dashboard() {
  const { signOut } = useAuth();
  const { isConnected, address, chainId, isConnecting, connectWallet, switchToAmoy } = useWalletConnection();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = useQuery(api.protocol.getStats);
  const intents = useQuery(api.protocol.getIntents, {});
  const marketData = useQuery(api.protocol.getMarketData);

  const submitIntent = useMutation(api.protocol.submitIntent);
  const verifyIntent = useMutation(api.protocol.verifyIntent);
  const executeIntent = useMutation(api.protocol.executeIntent);
  const seedData = useMutation(api.protocol.seedData);

  const handleSeed = async () => {
    try {
      await seedData({});
      toast.success("Demo data seeded!");
    } catch (error: any) {
      if (error.message?.includes("already seeded")) {
        toast.info("Data already seeded.");
      } else {
        toast.error(error.message || "Failed to seed data");
      }
    }
  };

  const getNetworkName = (id: number | null) => {
    if (!id) return "Unknown";
    if (id === 80002) return "Polygon Amoy";
    if (id === 1442) return "Polygon zkEVM";
    if (id === 137) return "Polygon PoS";
    return `Chain ${id}`;
  };

  const activeItem = NAV_ITEMS.find(n => n.id === activeTab);
  const groups = Array.from(new Set(NAV_ITEMS.map(n => n.group)));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="/zklogo.png" alt="zkLiquidate" className="w-8 h-8 rounded-lg" />
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur-sm -z-10" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight">zkLiquidate</div>
            <div className="text-[10px] text-muted-foreground">Protocol Dashboard</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {groups.map(group => (
          <div key={group}>
            <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-2 mb-2">
              {GROUP_LABELS[group]}
            </div>
            <div className="space-y-0.5">
              {NAV_ITEMS.filter(n => n.group === group).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-primary text-black font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-border/50 space-y-1">
        <button
          onClick={handleSeed}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <Database className="w-4 h-4" />
          Seed Demo Data
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-56 border-r border-border/50 bg-card/30 backdrop-blur-xl fixed inset-y-0 left-0 z-40">
        <SidebarContent />
      </aside>

      {/* Sidebar — mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-56 bg-card border-r border-border/50 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold text-sm">{activeTab ? NAV_ITEMS.find(n => n.id === activeTab)?.label ?? "Dashboard" : "Dashboard"}</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isConnected ? (
                <Button
                  size="sm"
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="bg-primary text-black hover:bg-primary/90 h-8 text-xs gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              ) : (
                <>
                  {chainId !== 80002 && chainId !== 1442 ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={switchToAmoy}
                      className="h-8 text-xs gap-1.5 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Switch to Amoy
                    </Button>
                  ) : (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-medium text-green-500">{getNetworkName(chainId)}</span>
                    </div>
                  )}
                  <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border/50">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {address?.substring(0, 6)}...{address?.substring(38)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 lg:px-6 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-1">Protocol Overview</h2>
                    <p className="text-sm text-muted-foreground">Real-time metrics from the zkLiquidate protocol</p>
                  </div>
                  <StatsOverview stats={stats} />

                  {/* Wallet + Tx History side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <WalletPanel
                      address={address ?? null}
                      chainId={chainId}
                      isConnected={isConnected}
                      onConnect={connectWallet}
                    />
                    <TransactionHistory
                      address={address ?? null}
                      isConnected={isConnected}
                    />
                  </div>

                  {!isConnected && (
                    <div className="p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                      <div className="flex items-start gap-3">
                        <Wallet className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-2">Connect your wallet to interact with the protocol</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mb-3">
                            <li>Install MetaMask or another Web3 wallet</li>
                            <li>Add Polygon Amoy testnet (Chain ID: 80002)</li>
                            <li>Get testnet tokens from <a href="https://faucet.polygon.technology/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Polygon Faucet</a></li>
                          </ol>
                          <Button size="sm" onClick={connectWallet} disabled={isConnecting} className="bg-primary text-black hover:bg-primary/90 gap-2">
                            <Wallet className="w-4 h-4" />
                            {isConnecting ? "Connecting..." : "Connect Wallet"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {isConnected && chainId !== 80002 && chainId !== 1442 && (
                    <div className="p-5 rounded-xl border border-orange-500/20 bg-orange-500/5">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium text-sm mb-1">Wrong Network Detected</p>
                          <p className="text-sm text-muted-foreground mb-3">You're connected to chain {chainId}. Switch to Polygon Amoy (80002) to use the protocol.</p>
                          <Button size="sm" onClick={switchToAmoy} variant="outline" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 gap-2">
                            <Zap className="w-4 h-4" />
                            Switch to Polygon Amoy
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  <Suspense fallback={<TabFallback />}>
                    <AnalyticsChart />
                  </Suspense>
                </div>
              )}

              {activeTab === "scanner" && (
                <Suspense fallback={<TabFallback />}>
                  <LiquidationScanner />
                </Suspense>
              )}

              {activeTab === "registry" && (
                <IntentRegistry
                  intents={intents}
                  onVerifyIntent={verifyIntent}
                  onExecuteIntent={executeIntent}
                  onSubmitIntent={submitIntent}
                  walletAddress={address}
                />
              )}

              {activeTab === "prices" && (
                <Suspense fallback={<TabFallback />}>
                  <RealTimePrices />
                </Suspense>
              )}

              {activeTab === "simulator" && (
                <Suspense fallback={<TabFallback />}>
                  <LiquidationSimulator />
                </Suspense>
              )}

              {activeTab === "verifier" && (
                <Suspense fallback={<TabFallback />}>
                  <VerifierStatus />
                </Suspense>
              )}

              {activeTab === "oracle" && (
                <Suspense fallback={<TabFallback />}>
                  <RiskOracle marketData={marketData} />
                </Suspense>
              )}

              {activeTab === "adapters" && (
                <Suspense fallback={<TabFallback />}>
                  <MultiProtocolAdapters />
                </Suspense>
              )}

              {activeTab === "bot" && (
                <Suspense fallback={<TabFallback />}>
                  <AutomatedBot />
                </Suspense>
              )}

              {activeTab === "analytics" && (
                <Suspense fallback={<TabFallback />}>
                  <AnalyticsChart />
                </Suspense>
              )}

              {activeTab === "security" && (
                <Suspense fallback={<TabFallback />}>
                  <SecurityAuditTracker />
                </Suspense>
              )}

              {activeTab === "mainnet" && (
                <Suspense fallback={<TabFallback />}>
                  <MainnetReadiness />
                </Suspense>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}