import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Intent Submission",
    description:
      "A liquidator identifies an undercollateralized position and submits a signed liquidation intent to the IntentRegistry contract on Polygon Amoy. The intent encodes the target address, collateral asset, debt asset, minimum health factor threshold, execution deadline, and a 0.1 POL bond.",
    detail: "IntentRegistry.submitIntent()",
    color: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/5",
  },
  {
    number: "02",
    title: "ZK Proof Generation",
    description:
      "Off-chain, a Plonky2 prover circuit reads the current Aave V3 oracle prices and account data, then generates a succinct zero-knowledge proof attesting that the position's health factor is below 1.0 at the time of proof generation. Proof generation completes in ~4.2 seconds.",
    detail: "Plonky2 STARK → SNARK recursion",
    color: "text-purple-400",
    borderColor: "border-purple-400/20",
    bgColor: "bg-purple-400/5",
  },
  {
    number: "03",
    title: "On-Chain Verification",
    description:
      "The ZK proof is submitted to the ZKVerifier contract deployed on Polygon zkEVM. The verifier checks the proof against the public inputs (position hash, price commitment, timestamp) using a Groth16 verification key. Verification costs ~$0.03 and completes in a single transaction.",
    detail: "ZKVerifier.verifyProof(proof, publicInputs)",
    color: "text-blue-400",
    borderColor: "border-blue-400/20",
    bgColor: "bg-blue-400/5",
  },
  {
    number: "04",
    title: "Cross-Chain Settlement",
    description:
      "Upon successful verification, the LiquidationExecutor contract calls Aave V3's liquidationCall() with the verified collateral and debt parameters. Polygon AggLayer bridges the proof attestation cross-chain atomically, ensuring the liquidation either fully executes or reverts — no partial states.",
    detail: "LiquidationExecutor.execute() → Aave.liquidationCall()",
    color: "text-emerald-400",
    borderColor: "border-emerald-400/20",
    bgColor: "bg-emerald-400/5",
  },
  {
    number: "05",
    title: "Reward Distribution",
    description:
      "Liquidation proceeds are split atomically: 90% to the liquidator, 5% to the protocol treasury, and 5% to the insurance pool. The liquidator's bond is returned. If the proof is invalid or the position was already liquidated, the bond is slashed and redistributed to the insurance pool.",
    detail: "Liquidator 90% · Protocol 5% · Insurance 5%",
    color: "text-yellow-400",
    borderColor: "border-yellow-400/20",
    bgColor: "bg-yellow-400/5",
  },
];

export function HowItWorksSection() {
  return (
    <section className="container mx-auto px-6 py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">
          Protocol Flow
        </div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-lg leading-tight">
            How zkLiquidate works
          </h2>
          <p className="text-white/40 max-w-sm text-sm leading-relaxed">
            End-to-end ZK-verified liquidation in five deterministic steps — from intent to settlement.
          </p>
        </div>
      </motion.div>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[27px] top-8 bottom-8 w-px bg-white/6 hidden md:block" />

        <div className="space-y-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex gap-6 rounded-xl border ${step.borderColor} ${step.bgColor} p-6 hover:bg-white/[0.03] transition-colors`}
            >
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className={`w-14 h-14 rounded-xl border ${step.borderColor} bg-black/40 flex items-center justify-center`}>
                  <span className={`text-lg font-bold font-mono ${step.color}`}>{step.number}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <code className={`text-[10px] font-mono px-2 py-0.5 rounded border ${step.borderColor} ${step.color} bg-black/30`}>
                    {step.detail}
                  </code>
                </div>
                <p className="text-sm text-white/45 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
