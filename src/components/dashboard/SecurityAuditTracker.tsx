import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, Clock, Info, XCircle } from "lucide-react";

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

const SEVERITY_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  critical: { label: "Critical", color: "bg-red-500/10 text-red-500 border-red-500/20", dot: "bg-red-500" },
  high: { label: "High", color: "bg-orange-500/10 text-orange-500 border-orange-500/20", dot: "bg-orange-500" },
  medium: { label: "Medium", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", dot: "bg-yellow-500" },
  low: { label: "Low", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", dot: "bg-blue-500" },
  info: { label: "Info", color: "bg-muted/50 text-muted-foreground border-border", dot: "bg-muted-foreground" },
};

const STATUS_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  open: { label: "Open", icon: XCircle, color: "text-red-500" },
  "in-progress": { label: "In Progress", icon: Clock, color: "text-yellow-500" },
  resolved: { label: "Resolved", icon: CheckCircle2, color: "text-green-500" },
  acknowledged: { label: "Acknowledged", icon: Info, color: "text-blue-500" },
};

const DEFAULT_SEVERITY = { label: "Unknown", color: "bg-muted/50 text-muted-foreground border-border", dot: "bg-muted-foreground" };
const DEFAULT_STATUS = { label: "Unknown", icon: Info, color: "text-muted-foreground" };

export function SecurityAuditTracker() {
  const findings = useQuery(api.protocol.getAuditFindings);

  const resolved = findings?.filter(f => f.status === "resolved").length ?? 0;
  const total = findings?.length ?? 0;
  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const criticalOpen = findings?.filter(f => f.severity === "critical" && f.status === "open").length ?? 0;
  const highOpen = findings?.filter(f => f.severity === "high" && (f.status === "open" || f.status === "in-progress")).length ?? 0;

  const securityScore = Math.max(0, 100 - (criticalOpen * 30) - (highOpen * 15) - ((total - resolved) * 3));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Audit Tracker</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time tracking of security findings and remediation progress
          </p>
        </div>
        <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
          Wave 6 Feature
        </Badge>
      </div>

      {/* Security Score Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1 border-border bg-gradient-to-br from-card to-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${securityScore >= 80 ? "text-green-500" : securityScore >= 60 ? "text-yellow-500" : "text-red-500"}`}>
                {securityScore}
              </div>
              <div className="text-muted-foreground text-sm mb-4">/ 100</div>
              <InlineProgress value={securityScore} className="h-3 mb-4" />
              <Badge variant="outline" className={securityScore >= 80 ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}>
                {securityScore >= 80 ? "Good Standing" : "Needs Attention"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-border">
          <CardHeader>
            <CardTitle>Findings Summary</CardTitle>
            <CardDescription>Breakdown by severity and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="text-3xl font-bold text-green-500">{resolved}</div>
                <div className="text-sm text-muted-foreground">Resolved</div>
                <InlineProgress value={resolvedPercent} className="h-1.5 mt-2" />
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <div className="text-3xl font-bold text-yellow-500">{total - resolved}</div>
                <div className="text-sm text-muted-foreground">Open / In Progress</div>
                <InlineProgress value={100 - resolvedPercent} className="h-1.5 mt-2" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(["critical", "high", "medium", "low", "info"] as const).map(sev => {
                const count = findings?.filter(f => f.severity === sev).length ?? 0;
                if (count === 0) return null;
                const cfg = SEVERITY_CONFIG[sev] ?? DEFAULT_SEVERITY;
                return (
                  <Badge key={sev} variant="outline" className={cfg.color}>
                    <span className={`w-2 h-2 rounded-full ${cfg.dot} mr-1.5`} />
                    {cfg.label}: {count}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Findings List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Audit Findings</CardTitle>
          <CardDescription>All identified security issues and their current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {findings?.map((finding, i) => {
              const sevCfg = SEVERITY_CONFIG[finding.severity] ?? DEFAULT_SEVERITY;
              const statusCfg = STATUS_CONFIG[finding.status] ?? DEFAULT_STATUS;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={finding._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <Badge variant="outline" className={`${sevCfg.color} text-xs`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sevCfg.dot} mr-1`} />
                          {sevCfg.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {finding.contract}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {finding.category}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{finding.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{finding.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <div className={`flex items-center gap-1 text-xs ${statusCfg.color}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusCfg.label}
                      </div>
                      {finding.resolvedAt && (
                        <span className="text-xs text-muted-foreground">
                          {new Date(finding.resolvedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {(!findings || findings.length === 0) && (
              <div className="text-center py-12 text-muted-foreground">
                No audit findings. Click "Seed Data" to populate.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Audit Partners */}
      <Card className="border-border bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Planned Audit Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { name: "OpenZeppelin", status: "Scoping", desc: "Smart contract security audit" },
              { name: "Trail of Bits", status: "Planned", desc: "ZK circuit verification" },
              { name: "Certora", status: "Planned", desc: "Formal verification" },
            ].map((partner, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{partner.name}</span>
                  <Badge variant="outline" className={partner.status === "Scoping" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-muted/50 text-muted-foreground border-border"}>
                    {partner.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{partner.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}