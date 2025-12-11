import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUpRight, DollarSign, Zap } from "lucide-react";

interface StatsOverviewProps {
  stats: {
    totalValueSecured: number;
    totalIntents: number;
    totalExecutions: number;
    totalProfit: number;
  } | undefined;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value Secured</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalValueSecured.toLocaleString() ?? "0"}</div>
          <p className="text-xs text-muted-foreground">+20.1% from last month</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Intents</CardTitle>
          <Activity className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalIntents ?? 0}</div>
          <p className="text-xs text-muted-foreground">Waiting for verification</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Executions</CardTitle>
          <Zap className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalExecutions ?? 0}</div>
          <p className="text-xs text-muted-foreground">Successful liquidations</p>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats?.totalProfit.toFixed(2) ?? "0.00"}</div>
          <p className="text-xs text-muted-foreground">Distributed to liquidators</p>
        </CardContent>
      </Card>
    </div>
  );
}
