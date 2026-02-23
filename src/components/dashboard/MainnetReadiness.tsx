import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, Rocket, Shield, Zap, Globe, Code, TrendingUp } from "lucide-react";

function InlineProgress({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-muted/40 rounded-full overflow-hidden ${className}`} style={{ minHeight: "6px" }}>
      <div
        className="h-full bg-primary rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, minHeight: "6px" }}
      />
    </div>
  );
}

const CHECKLIST_ITEMS = [
  {
    category: "Security",
    icon: Shield,
    color: "text-red-400",
    items: [
      { label: "Reentrancy guards on all state-changing functions", done: true },
      { label: "Oracle staleness checks (60s window)", done: true },
      { label: "Bond slashing edge case fix", done: false },
      { label: "Multi-sig admin controls", done: false },
      { label: "Formal security audit (OpenZeppelin)", done: false },
    ],
  },
  {
    category: "Protocol Integrations",
    icon: Globe,
    color: "text-blue-400",
    items: [
      { label: "Aave V3 adapter live on testnet", done: true },
      { label: "Compound V3 adapter integration", done: false },
      { label: "Morpho Blue adapter", done: false },
      { label: "Cross-chain adapter registry", done: false },
    ],
  },
  {
    category: "Performance",
    icon: Zap,
    color: "text-yellow-400",
    items: [
      { label: "Batch liquidation execution (~30% gas saving)", done: true },
      { label: "Recursive ZK proof aggregation", done: false },
      { label: "Gas benchmarking vs competitors", done: true },
      { label: "Sub-5s proof generation consistently", done: true },
    ],
  },
  {
    category: "Smart Contracts",
    icon: Code,
    color: "text-green-400",
    items: [
      { label: "Intent Registry finalized", done: true },
      { label: "ZK Verifier with Plonky2", done: true },
      { label: "Liquidation Executor with insurance pool", done: true },
      { label: "Batch Executor contract", done: false },
      { label: "Emergency pause mechanism", done: false },
    ],
  },
  {
    category: "Economics",
    icon: TrendingUp,
    color: "text-purple-400",
    items: [
      { label: "Fee distribution model (90/5/5)", done: true },
      { label: "Insurance pool staking mechanism", done: true },
      { label: "Governance token design (zkLIQ)", done: false },
      { label: "DAO voting mechanism", done: false },
    ],
  },
];

export function MainnetReadiness() {
  const auditFindings = useQuery(api.protocol.getAuditFindings);
  const adapters = useQuery(api.protocol.getProtocolAdapters);

  const totalItems = CHECKLIST_ITEMS.reduce((acc, cat) => acc + cat.items.length, 0);
  const doneItems = CHECKLIST_ITEMS.reduce((acc, cat) => acc + cat.items.filter(i => i.done).length, 0);
  const readinessPercent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const resolvedFindings = auditFindings?.filter(f => f.status === "resolved").length ?? 0;
  const totalFindings = auditFindings?.length ?? 0;
  const liveAdapters = adapters?.filter(a => a.status === "live").length ?? 0;

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = isNaN(readinessPercent) ? circumference : circumference * (1 - readinessPercent / 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Mainnet Readiness</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Production deployment checklist and progress tracker
          </p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
          Wave 6 Feature
        </Badge>
      </div>

      {/* Overall Score */}
      <Card className="border-primary/20 bg-gradient-to-r from-card via-card to-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
                  <circle
                    cx="60" cy="60" r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={`${strokeDashoffset}`}
                    className="text-primary transition-all duration-1000"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{readinessPercent}%</span>
                  <span className="text-xs text-muted-foreground">Ready</span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Tasks Complete", value: `${doneItems}/${totalItems}`, color: "text-primary" },
                { label: "Findings Resolved", value: `${resolvedFindings}/${totalFindings}`, color: "text-green-500" },
                { label: "Live Adapters", value: `${liveAdapters}/3`, color: "text-blue-500" },
                { label: "Est. Mainnet", value: "Q1 2026", color: "text-accent" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border text-center">
                  <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist by Category */}
      <div className="grid md:grid-cols-2 gap-6">
        {CHECKLIST_ITEMS.map((category, catIdx) => {
          const catDone = category.items.filter(i => i.done).length;
          const catTotal = category.items.length;
          const catPercent = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;
          const CategoryIcon = category.icon;

          return (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <Card className="border-border h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <CategoryIcon className={`w-5 h-5 ${category.color}`} />
                      {category.category}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">{catDone}/{catTotal}</span>
                  </div>
                  <InlineProgress value={catPercent} className="h-1.5" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2.5">
                        {item.done ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Deployment Timeline */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-primary" />
            Deployment Timeline
          </CardTitle>
          <CardDescription>Planned milestones toward mainnet launch</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { phase: "Wave 6 Complete", date: "Feb 2026", status: "current", desc: "Security hardening, multi-protocol adapters, batch liquidations" },
              { phase: "Security Audit", date: "Mar 2026", status: "upcoming", desc: "OpenZeppelin + Trail of Bits formal audit" },
              { phase: "Controlled Mainnet", date: "Apr 2026", status: "upcoming", desc: "Limited mainnet with whitelist, TVL cap of $1M" },
              { phase: "Full Mainnet", date: "Q2 2026", status: "future", desc: "Open mainnet with governance token launch" },
            ].map((milestone, i) => (
              <div key={i} className={`flex items-start gap-4 p-4 rounded-lg border ${
                milestone.status === "current" ? "border-primary/30 bg-primary/5" :
                milestone.status === "upcoming" ? "border-border bg-muted/20" :
                "border-border/50 bg-muted/10"
              }`}>
                <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                  milestone.status === "current" ? "bg-primary animate-pulse" :
                  milestone.status === "upcoming" ? "bg-muted-foreground" :
                  "bg-muted-foreground/40"
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{milestone.phase}</span>
                    <Badge variant="outline" className={`text-xs ${
                      milestone.status === "current" ? "bg-primary/10 text-primary border-primary/20" :
                      "bg-muted/50 text-muted-foreground border-border"
                    }`}>
                      {milestone.date}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}