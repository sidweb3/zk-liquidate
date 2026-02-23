import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

const phases = [
  {
    wave: "Wave 5",
    status: "complete",
    date: "December 2025",
    title: "Real Aave V3 Integration & Testnet",
    items: [
      "Real Aave V3 integration with actual liquidation calls, oracle feeds, and token transfers",
      "Lowered MIN_STAKE to 0.1 MATIC for community accessibility",
      "~30% gas savings from ZK cross-chain verification",
      "ZK Verifier with Plonky2 on Polygon zkEVM testnet — 99.8% success rate",
    ],
    quote: "\"Love seeing real Aave V3 integration live on testnet... Solid, production-minded step forward.\" — Judge",
  },
  {
    wave: "Wave 6",
    status: "active",
    date: "Jan–Feb 2026",
    title: "Security Hardening & Multi-Protocol Expansion",
    items: [
      "Multi-protocol liquidation adapters: Compound V3 + Morpho Blue integration",
      "Security audit tracker with real findings — reentrancy guards, oracle staleness fixes",
      "Batch liquidation execution — liquidate multiple positions in one ZK-verified tx",
      "Mainnet readiness checklist with deployment timeline",
    ],
  },
  {
    wave: "Phase 3",
    status: "upcoming",
    date: "Q1 2026",
    title: "Controlled Mainnet Launch",
    items: [
      "Deploy full protocol on Polygon mainnet with $1M TVL cap",
      "OpenZeppelin + Trail of Bits formal security audits",
      "zkLIQ governance token launch and liquidator incentive program",
    ],
  },
  {
    wave: "Phase 4",
    status: "future",
    date: "Q2–Q3 2026",
    title: "Expansion & Governance",
    items: [
      "Expand to additional AggLayer chains and L2s",
      "DAO governance with on-chain voting for protocol parameters",
      "Recursive ZK proof aggregation for 50%+ additional gas reduction",
    ],
  },
];

const statusConfig = {
  complete: { dot: "bg-primary", line: "bg-primary/40", badge: "bg-primary/15 text-primary border-primary/25", label: "✓ Complete" },
  active: { dot: "bg-primary animate-pulse", line: "bg-primary/20", badge: "bg-primary/15 text-primary border-primary/25", label: "● In Progress" },
  upcoming: { dot: "bg-white/20", line: "bg-white/5", badge: "bg-white/5 text-white/40 border-white/10", label: "Upcoming" },
  future: { dot: "bg-white/10", line: "bg-white/5", badge: "bg-white/5 text-white/30 border-white/8", label: "Future" },
};

export function RoadmapSection() {
  return (
    <section className="container mx-auto px-6 py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">Roadmap</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-lg leading-tight">
          Building toward mainnet
        </h2>
      </motion.div>

      <div className="relative max-w-3xl">
        {/* Vertical line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/8" />

        <div className="space-y-10">
          {phases.map((phase, i) => {
            const cfg = statusConfig[phase.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-6"
              >
                {/* Dot */}
                <div className="flex-shrink-0 mt-1.5">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 border-black ${cfg.dot}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-white/30">{phase.date}</span>
                    <span className="text-xs font-medium text-white/50">{phase.wave}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-3">{phase.title}</h3>

                  <ul className="space-y-1.5">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-white/40">
                        {phase.status === "complete" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 text-white/20 mt-0.5 flex-shrink-0" />
                        )}
                        {item}
                      </li>
                    ))}
                  </ul>

                  {phase.quote && (
                    <div className="mt-4 px-4 py-3 rounded-lg bg-primary/5 border border-primary/15">
                      <p className="text-xs text-primary/70 italic">{phase.quote}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}