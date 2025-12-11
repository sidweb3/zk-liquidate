import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function VerifierStatus() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-card border-border col-span-2">
        <CardHeader>
          <CardTitle>ZK Proof Verification Status</CardTitle>
          <CardDescription>Real-time status of Plonky2 proof generation and verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">zkEVM-Verifier-01</p>
                <p className="text-sm text-muted-foreground">Online • 99.9% Uptime</p>
              </div>
              <div className="ml-auto font-medium text-green-500">Active</div>
            </div>
            {/* Simulated log */}
            <div className="rounded-md bg-muted p-4 font-mono text-xs space-y-2 h-[200px] overflow-y-auto">
              <div className="text-green-400">[INFO] Verifying proof for intent #0x8a...</div>
              <div className="text-blue-400">[DEBUG] Checking oracle signatures... OK</div>
              <div className="text-blue-400">[DEBUG] Validating health factor &lt; 1.0... OK</div>
              <div className="text-green-400">[SUCCESS] Proof verified in 4.2s. Gas used: 142000</div>
              <div className="text-muted-foreground">--- Waiting for next batch ---</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Verifier Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Avg Verification Time</div>
            <div className="text-2xl font-bold">4.2s</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Proof Cost</div>
            <div className="text-2xl font-bold">$0.03</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-green-500">99.8%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
