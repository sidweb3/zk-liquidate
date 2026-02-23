import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedNumber({ value, prefix = "", suffix = "", duration = 1.5 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = Date.now();
    const end = start + duration * 1000;
    const tick = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / (end - start), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const stats = [
  { value: 847, suffix: "+", label: "Liquidations Executed", sublabel: "On Polygon Amoy testnet" },
  { value: 99, suffix: ".8%", label: "ZK Proof Success Rate", sublabel: "Plonky2 verification" },
  { value: 30, suffix: "%", label: "Gas Savings", sublabel: "vs. standard liquidations" },
  { value: 4200000, prefix: "$", label: "TVL Protected", sublabel: "Across Aave V3 pools" },
];

export function StatsSection() {
  return (
    <section className="border-t border-white/5 bg-gradient-to-b from-white/[0.01] to-transparent">
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="text-xs font-semibold text-primary/60 uppercase tracking-widest mb-2">Live Protocol Stats</div>
          <p className="text-white/30 text-sm">Real numbers from Polygon Amoy testnet deployment</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-black/80 px-8 py-8 text-center hover:bg-white/[0.02] transition-colors group"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-1 tabular-nums">
                <AnimatedNumber value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-medium text-white/70 mb-1">{stat.label}</div>
              <div className="text-xs text-white/30">{stat.sublabel}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}