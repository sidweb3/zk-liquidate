import { motion } from "framer-motion";
import { ExternalLink, Copy, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const contracts = [
  {
    name: "Intent Registry V2",
    network: "Polygon Amoy",
    networkColor: "text-purple-400",
    networkBg: "bg-purple-400/10 border-purple-400/20",
    description: "Manages liquidation intent submission, staking, and on-chain registry. Fully configured with Aave V3 Amoy pool. MIN_STAKE: 0.1 MATIC.",
    address: "0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1",
    explorerUrl: "https://amoy.polygonscan.com/address/0xb9Fc157d8025892Ac3382F7a70c58DcB8D7de2A1",
    status: "Verified",
  },
  {
    name: "ZK Verifier",
    network: "Polygon zkEVM",
    networkColor: "text-primary",
    networkBg: "bg-primary/10 border-primary/20",
    description: "Validates ZK proofs using Plonky2 for cryptographic liquidation security.",
    address: "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2",
    explorerUrl: "https://testnet-zkevm.polygonscan.com/address/0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2",
    status: "Verified",
  },
  {
    name: "Liquidation Executor V2",
    network: "Polygon Amoy",
    networkColor: "text-blue-400",
    networkBg: "bg-blue-400/10 border-blue-400/20",
    description: "Executes liquidations with insurance pool and reward distribution logic. Linked to IntentRegistry V2 via setLiquidationExecutor.",
    address: "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B",
    explorerUrl: "https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B",
    status: "Verified",
  },
];

const previousContracts = [
  {
    name: "Intent Registry V1",
    network: "Polygon Amoy",
    networkColor: "text-purple-400/60",
    networkBg: "bg-purple-400/5 border-purple-400/10",
    address: "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
    explorerUrl: "https://amoy.polygonscan.com/address/0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
  },
  {
    name: "Intent Registry (Alt Deploy)",
    network: "Polygon Amoy",
    networkColor: "text-purple-400/60",
    networkBg: "bg-purple-400/5 border-purple-400/10",
    address: "0x177C8dDB569Bdd556C2090992e1f84df0Da5248C",
    explorerUrl: "https://amoy.polygonscan.com/address/0x177C8dDB569Bdd556C2090992e1f84df0Da5248C",
  },
  {
    name: "Liquidation Executor (Alt Deploy)",
    network: "Polygon Amoy",
    networkColor: "text-blue-400/60",
    networkBg: "bg-blue-400/5 border-blue-400/10",
    address: "0x0160B3d6434A6823C2b35d81c74a8eb6426C0916",
    explorerUrl: "https://amoy.polygonscan.com/address/0x0160B3d6434A6823C2b35d81c74a8eb6426C0916",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/30 hover:text-white/70"
    >
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function SmartContractsSection() {
  const [showPrevious, setShowPrevious] = useState(false);

  return (
    <section className="container mx-auto px-6 py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="text-xs font-semibold text-primary/70 uppercase tracking-widest mb-3">Smart Contracts</div>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white max-w-lg leading-tight">
            Deployed & verified on-chain
          </h2>
          <p className="text-white/40 max-w-sm text-sm leading-relaxed">
            All V2 contracts are deployed on Polygon testnets and verified on Polygonscan.
          </p>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {contracts.map((contract, i) => (
          <motion.div
            key={contract.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-xl border border-white/8 bg-white/[0.02] p-6 hover:border-white/15 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-sm mb-1.5">{contract.name}</h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${contract.networkBg} ${contract.networkColor}`}>
                  {contract.network}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] text-primary/70 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                {contract.status}
              </span>
            </div>

            <p className="text-xs text-white/40 leading-relaxed mb-4">{contract.description}</p>

            <div className="rounded-lg bg-black/40 border border-white/5 p-3 flex items-center justify-between gap-2">
              <code className="text-[10px] font-mono text-white/50 truncate">
                {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
              </code>
              <div className="flex items-center gap-1 flex-shrink-0">
                <CopyButton text={contract.address} />
                <button
                  onClick={() => window.open(contract.explorerUrl, "_blank")}
                  className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/30 hover:text-white/70"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Previous Contracts Toggle */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <button
          onClick={() => setShowPrevious(!showPrevious)}
          className="flex items-center gap-2 text-xs text-white/30 hover:text-white/50 transition-colors mx-auto"
        >
          {showPrevious ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showPrevious ? "Hide" : "View"} previous V1 contracts
        </button>

        {showPrevious && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid md:grid-cols-2 gap-3 max-w-2xl mx-auto"
          >
            {previousContracts.map((contract) => (
              <div
                key={contract.name}
                className="rounded-lg border border-white/5 bg-white/[0.01] p-4 opacity-60"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs text-white/40 font-medium">{contract.name}</span>
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium border ${contract.networkBg} ${contract.networkColor}`}>
                      {contract.network}
                    </span>
                  </div>
                  <span className="text-[9px] text-white/20 font-medium">Legacy</span>
                </div>
                <div className="rounded bg-black/30 border border-white/5 p-2 flex items-center justify-between gap-2">
                  <code className="text-[9px] font-mono text-white/30 truncate">
                    {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                  </code>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <CopyButton text={contract.address} />
                    <button
                      onClick={() => window.open(contract.explorerUrl, "_blank")}
                      className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/20 hover:text-white/50"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}