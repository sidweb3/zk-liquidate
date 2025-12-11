import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface IntentRegistryProps {
  intents: any[] | undefined;
  onSubmitIntent: (data: any) => Promise<any>;
  onVerifyIntent: (args: { intentId: any }) => Promise<any>;
  onExecuteIntent: (args: { intentId: any }) => Promise<any>;
}

export function IntentRegistry({ intents, onSubmitIntent, onVerifyIntent, onExecuteIntent }: IntentRegistryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      await onSubmitIntent({
        targetUserAddress: formData.get("address") as string,
        targetHealthFactor: parseFloat(formData.get("hf") as string),
        minPrice: parseFloat(formData.get("price") as string),
        bondAmount: parseFloat(formData.get("bond") as string),
      });
      
      toast.success("Liquidation intent submitted to registry");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to submit intent");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (id: any) => {
    try {
      await onVerifyIntent({ intentId: id });
      toast.success("Intent verification initiated");
    } catch (e) {
      toast.error("Verification failed");
    }
  };

  const handleExecute = async (id: any) => {
    try {
      await onExecuteIntent({ intentId: id });
      toast.success("Liquidation executed successfully");
    } catch (e) {
      toast.error("Execution failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Liquidation Intent Registry</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Zap className="mr-2 h-4 w-4" /> New Liquidation Intent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-card border-border">
            <DialogHeader>
              <DialogTitle>Submit Liquidation Intent</DialogTitle>
              <DialogDescription>
                Create a new liquidation intent. Requires 10 POL bond.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmitIntent} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Target User Address</Label>
                <Input id="address" name="address" placeholder="0x..." required className="bg-background border-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="hf">Target HF</Label>
                  <Input id="hf" name="hf" type="number" step="0.01" placeholder="0.95" required className="bg-background border-input" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Min Price</Label>
                  <Input id="price" name="price" type="number" placeholder="2500" required className="bg-background border-input" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bond">Bond Amount (POL)</Label>
                <Input id="bond" name="bond" type="number" defaultValue="10" readOnly className="bg-muted border-input" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground">
                  {isSubmitting ? "Submitting..." : "Submit Intent"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Recent Intents</CardTitle>
          <CardDescription>Live feed of liquidation intents across AggLayer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {intents?.map((intent) => (
              <div key={intent._id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-background/50 hover:bg-background transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    intent.status === 'verified' ? 'bg-green-500/20 text-green-500' :
                    intent.status === 'executed' ? 'bg-blue-500/20 text-blue-500' :
                    intent.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                    'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {intent.status === 'verified' ? <CheckCircle2 className="h-5 w-5" /> :
                     intent.status === 'executed' ? <Zap className="h-5 w-5" /> :
                     intent.status === 'failed' ? <AlertTriangle className="h-5 w-5" /> :
                     <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {intent.targetUserAddress.substring(0, 6)}...{intent.targetUserAddress.substring(38)}
                      <Badge variant="outline" className="text-xs font-normal">HF: {intent.targetHealthFactor}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Min Price: ${intent.minPrice} • Bond: {intent.bondAmount} POL
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Badge variant="secondary" className="text-[10px] h-5 bg-purple-500/10 text-purple-400 border-purple-500/20">
                        AI Score: {(Math.random() * 100).toFixed(0)}/100
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {intent.status === 'pending' && (
                    <Button size="sm" variant="outline" onClick={() => handleVerify(intent._id)}>
                      Verify Proof
                    </Button>
                  )}
                  {intent.status === 'verified' && (
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleExecute(intent._id)}>
                      Execute
                    </Button>
                  )}
                  <div className="text-right text-sm text-muted-foreground min-w-[100px]">
                    <div className="font-mono text-xs opacity-50">{new Date(intent._creationTime).toLocaleTimeString()}</div>
                    <div className="capitalize">{intent.status}</div>
                  </div>
                </div>
              </div>
            ))}
            {(!intents || intents.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                No active intents found. Submit one to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
