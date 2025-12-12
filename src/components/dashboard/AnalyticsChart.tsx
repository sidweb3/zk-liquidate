import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrendingUp, DollarSign, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function AnalyticsChart() {
  const analytics = useQuery(api.protocol.getAnalytics, { days: 7 });

  if (!analytics || analytics.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>7-day performance overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No analytics data available. Seed data to view.
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestDay = analytics[0];
  const previousDay = analytics[1] || latestDay;

  const volumeChange = ((latestDay.totalVolume - previousDay.totalVolume) / previousDay.totalVolume * 100).toFixed(1);
  const profitChange = ((latestDay.totalProfit - previousDay.totalProfit) / previousDay.totalProfit * 100).toFixed(1);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Analytics
          </CardTitle>
          <CardDescription>Last 7 days overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Total Volume
              </span>
              <span className={`text-xs ${parseFloat(volumeChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(volumeChange) >= 0 ? '+' : ''}{volumeChange}%
              </span>
            </div>
            <div className="text-2xl font-bold">
              ${latestDay.totalVolume.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Profit
              </span>
              <span className={`text-xs ${parseFloat(profitChange) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {parseFloat(profitChange) >= 0 ? '+' : ''}{profitChange}%
              </span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${latestDay.totalProfit.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Success Rate
              </span>
            </div>
            <div className="text-2xl font-bold">
              {(latestDay.successRate * 100).toFixed(1)}%
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-muted/30 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Avg Gas Cost
              </span>
            </div>
            <div className="text-2xl font-bold">
              ${latestDay.avgGasCost.toFixed(2)}
            </div>
          </motion.div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Weekly Trend</CardTitle>
          <CardDescription>Execution volume over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.slice(0, 7).reverse().map((day, index) => (
              <motion.div
                key={day._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-3"
              >
                <div className="text-xs text-muted-foreground w-20">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="h-8 rounded-lg bg-muted/30 border border-border overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{
                        width: `${(day.totalExecutions / Math.max(...analytics.map(a => a.totalExecutions))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium w-12 text-right">
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
