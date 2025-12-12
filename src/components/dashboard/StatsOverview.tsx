import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      color: "from-primary to-primary/50",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: "+20.1%",
      trendIcon: TrendingUp,
    },
    {
      label: "Active Intents",
      value: stats?.totalIntents ?? 0,
      icon: Activity,
      color: "from-secondary to-secondary/50",
      iconBg: "bg-secondary/10",
      iconColor: "text-secondary",
      trend: "Across all chains",
      trendIcon: null,
    },
    {
      label: "Successful Executions",
      value: stats?.totalExecutions ?? 0,
      icon: Zap,
      color: "from-accent to-accent/50",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
      trend: `${successRate}% success rate`,
      trendIcon: null,
    },
    {
      label: "Total Profit",
      value: `$${stats?.totalProfit.toFixed(2) ?? "0.00"}`,
      icon: ArrowUpRight,
      color: "from-green-500 to-green-500/50",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      trend: "Distributed to liquidators",
      trendIcon: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <div className={`${stat.iconBg} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trendIcon && <stat.trendIcon className="h-3 w-3 text-green-500" />}
                <span className={stat.trendIcon ? "text-green-500" : ""}>{stat.trend}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}