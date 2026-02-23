import { Card } from "@/components/ui/card";
import { Activity, ArrowUpRight, DollarSign, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  stats: {
    totalValueSecured: number;
    totalIntents: number;
    totalExecutions: number;
    totalProfit: number;
  } | undefined;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const successRate = stats?.totalIntents
    ? ((stats.totalExecutions / stats.totalIntents) * 100).toFixed(1)
    : "0.0";

  const statCards = [
    {
      label: "Total Value Secured",
      value: `$${stats?.totalValueSecured.toLocaleString() ?? "0"}`,
      icon: DollarSign,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      sub: "+20.1% this week",
      subColor: "text-green-500",
    },
    {
      label: "Active Intents",
      value: stats?.totalIntents ?? 0,
      icon: Activity,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
      sub: "Across all chains",
      subColor: "text-muted-foreground",
    },
    {
      label: "Executions",
      value: stats?.totalExecutions ?? 0,
      icon: Zap,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
      sub: `${successRate}% success rate`,
      subColor: "text-muted-foreground",
    },
    {
      label: "Total Profit",
      value: `$${stats?.totalProfit.toFixed(2) ?? "0.00"}`,
      icon: TrendingUp,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10",
      sub: "Distributed to liquidators",
      subColor: "text-muted-foreground",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
        >
          <Card className="p-5 border-border/60 bg-card hover:border-border transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className={`${stat.iconBg} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight mb-1">{stat.value}</div>
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-xs ${stat.subColor} flex items-center gap-1`}>
              {stat.subColor === "text-green-500" && <ArrowUpRight className="w-3 h-3" />}
              {stat.sub}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}