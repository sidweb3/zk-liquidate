import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, DollarSign, Zap, TrendingUp } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalValueSecured: number;
    totalIntents: number;
    totalExecutions: number;
    totalProfit: number;
  } | undefined;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  // Calculate success rate
  const successRate = stats?.totalIntents 
    ? ((stats.totalExecutions / stats.totalIntents) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card border-border hover:border-primary/50 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value Secured</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalValueSecured.toLocaleString() ?? "0"}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <p className="text-xs text-green-500">+20.1% from last month</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border hover:border-secondary/50 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Intents</CardTitle>
          <Activity className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalIntents ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all chains</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border hover:border-accent/50 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful Executions</CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalExecutions ?? 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {successRate}% success rate
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border hover:border-green-500/50 transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">
            ${stats?.totalProfit.toFixed(2) ?? "0.00"}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Distributed to liquidators</p>
        </CardContent>
      </Card>
    </div>
  );
}