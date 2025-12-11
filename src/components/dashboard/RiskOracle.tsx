import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskOracleProps {
  marketData: any[] | undefined;
}

export function RiskOracle({ marketData }: RiskOracleProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle>Cross-Chain Risk Oracle</CardTitle>
        <CardDescription>Aggregated price feeds and risk metrics from AggLayer chains</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-border">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Asset</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Chain ID</th>
                <th className="p-4 font-medium">Confidence</th>
                <th className="p-4 font-medium">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {marketData?.map((data) => (
                <tr key={data._id} className="border-t border-border hover:bg-muted/20">
                  <td className="p-4 font-medium">{data.asset}</td>
                  <td className="p-4">${data.price.toFixed(2)}</td>
                  <td className="p-4 font-mono text-xs">{data.chainId}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      {(data.confidence * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{new Date(data.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))}
              {(!marketData || marketData.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No market data available. Seed data to view.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
