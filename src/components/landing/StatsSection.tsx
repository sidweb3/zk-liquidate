const stats = [
  { label: "Total Value Secured", value: "$124M+" },
  { label: "Liquidations Executed", value: "14.2K" },
  { label: "Avg Verification Time", value: "4.2s" },
  { label: "Proof Cost", value: "$0.03" }
];

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
