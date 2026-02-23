import { motion } from "framer-motion";

const comparisons = [
  { feature: "Cross-chain liquidations", us: true, others: false },
  { feature: "ZK proof verification", us: true, others: false },
  { feature: "MEV / front-run protection", us: true, others: false },
  { feature: "AI risk scoring", us: true, others: false },
  { feature: "AggLayer native integration", us: true, others: false },
  { feature: "Automated liquidation bot", us: true, others: true },
  { feature: "Aave V3 integration", us: true, others: true },
  { feature: "Insurance pool", us: true, others: false },
];

const advantages = [
  {
    number: "01",
    title: "First-Mover Advantage",
    desc: "Only ZK-verified cross-chain liquidation protocol on Polygon AggLayer with institutional-grade security and compliance-ready architecture.",
  },
  {
    number: "02",
    title: "Clear Revenue Streams",
    desc: "Earn from liquidation bonuses (5–10%), verification fees ($0.03/proof), and protocol integration fees with transparent fee distribution.",
  },
  {
    number: "03",
    title: "Battle-Tested Security",
    desc: "Plonky2 ZK proofs, time-locked intents, reentrancy guards, and oracle staleness checks ensure maximum protocol security.",
  },
];

export function WhyUsSection() {
  return (
    <section className="container mx-auto px-6 py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">Why zkLiquidate</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-2xl leading-tight">
          The only protocol combining ZK proofs with cross-chain liquidations
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border border-white/8 overflow-hidden"
        >
          <div className="grid grid-cols-3 bg-white/[0.03] border-b border-white/5 px-4 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
            <div className="col-span-1">Feature</div>
            <div className="text-center text-primary">zkLiquidate</div>
            <div className="text-center">Others</div>
          </div>
          {comparisons.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-3 px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <div className="col-span-1 text-xs text-white/60">{row.feature}</div>
              <div className="text-center">
                {row.us ? (
                  <span className="text-primary text-sm">✓</span>
                ) : (
                  <span className="text-white/20 text-sm">✗</span>
                )}
              </div>
              <div className="text-center">
                {row.others ? (
                  <span className="text-white/40 text-sm">✓</span>
                ) : (
                  <span className="text-white/20 text-sm">✗</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Advantages */}
        <div className="space-y-6">
          {advantages.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-5"
            >
              <div className="text-2xl font-bold text-white/10 font-mono flex-shrink-0 w-8">{item.number}</div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}