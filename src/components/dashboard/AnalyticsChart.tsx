import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrendingUp, DollarSign, Activity, Zap, ArrowUpRight, ArrowDownRight, BarChart3, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function AnalyticsChart() {
  const analytics = useQuery(api.protocol.getAnalytics, { days: 7 });
  const stats = useQuery(api.protocol.getStats, {});

  if (!analytics || analytics.length === 0) {
    return (
      <div className="space-y-6">
        {/* Live today counters */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Intents", value: stats?.totalIntents ?? 0, icon: Activity, color: "text-primary", bg: "bg-primary/10" },
            { label: "Executions", value: stats?.totalExecutions ?? 0, icon: Zap, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Value Secured", value: stats ? `$${stats.totalValueSecured.toLocaleString()}` : "$0", icon: DollarSign, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "Total Profit", value: stats ? `$${stats.totalProfit.toFixed(2)}` : "$0", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-500/10" },
          ].map((kpi, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="p-4 border-border/60">
                <div className={`${kpi.bg} p-2 rounded-lg w-fit mb-3`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="text-xl font-bold mb-0.5">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty chart state */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Performance Analytics</CardTitle>
            <CardDescription>7-day performance overview</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-7 h-7 text-primary/60" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">No analytics data yet</h3>
              <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
                Analytics are tracked in real-time. Submit and execute liquidation intents to see your performance data appear here.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-primary/70 bg-primary/8 border border-primary/20 rounded-full px-3 py-1.5">
                <Sparkles className="w-3 h-3" />
                Start by submitting an intent in the Intent Registry
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestDay = analytics[0];
  const previousDay = analytics[1] || latestDay;

  const safeChange = (current: number, previous: number) => {
    if (previous === 0) return "0.0";
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const volumeChange = safeChange(latestDay.totalVolume, previousDay.totalVolume);
  const profitChange = safeChange(latestDay.totalProfit, previousDay.totalProfit);
  const maxExecutions = Math.max(...analytics.map(a => a.totalExecutions), 1);

  const kpis = [
    {
      label: "Total Volume",
      value: `$${latestDay.totalVolume.toLocaleString()}`,
      change: volumeChange,
      icon: DollarSign,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
    },
    {
      label: "Total Profit",
      value: `$${latestDay.totalProfit.toLocaleString()}`,
      change: profitChange,
      icon: TrendingUp,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10",
    },
    {
      label: "Success Rate",
      value: `${(latestDay.successRate * 100).toFixed(1)}%`,
      change: null,
      icon: Activity,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Avg Gas Cost",
      value: `$${latestDay.avgGasCost.toFixed(2)}`,
      change: null,
      icon: Zap,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 border-border/60">
              <div className="flex items-start justify-between mb-3">
                <div className={`${kpi.iconBg} p-2 rounded-lg`}>
                  <kpi.icon className={`w-4 h-4 ${kpi.iconColor}`} />
                </div>
                {kpi.change !== null && (
                  <div className={`flex items-center gap-0.5 text-xs ${parseFloat(kpi.change) >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {parseFloat(kpi.change) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {Math.abs(parseFloat(kpi.change))}%
                  </div>
                )}
              </div>
              <div className="text-xl font-bold mb-0.5">{kpi.value}</div>
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Weekly Execution Volume</CardTitle>
          <CardDescription>Liquidation executions over the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.slice(0, 7).reverse().map((day, index) => (
              <motion.div
                key={day._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="text-xs text-muted-foreground w-16 flex-shrink-0">
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
                <div className="flex-1 h-7 rounded-md bg-muted/30 border border-border/40 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.totalExecutions / maxExecutions) * 100}%` }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="h-full bg-primary/70 rounded-md"
                  />
                </div>
                <div className="text-sm font-medium w-8 text-right flex-shrink-0">
                  {day.totalExecutions}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}