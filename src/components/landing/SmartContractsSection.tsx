import { motion } from "framer-motion";
import { Code, Link2, Shield, Activity, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SmartContractsSection() {
  const contracts = [
    {
      name: "Intent Registry",
      network: "Polygon Amoy",
      icon: Link2,
      color: "primary",
      description: "Manages liquidation intent submission, staking, and registry",
      address: "0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a",
      explorerUrl: "https://amoy.polygonscan.com/address/0x831F6F30cc0Aa68a9541B79c2289BF748DEC4a2a"
    },
    {
      name: "ZK Verifier",
      network: "Polygon zkEVM",
      icon: Shield,
      color: "secondary",
      description: "Validates ZK proofs using Plonky2 for secure verification",
      address: "0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2",
      explorerUrl: "https://testnet-zkevm.polygonscan.com/address/0x8C935B982416673cF9633DdCC4E9Dc4ec2846Ab2"
    },
    {
      name: "Liquidation Executor",
      network: "Polygon Amoy",
      icon: Activity,
      color: "accent",
      description: "Executes liquidations with insurance pool and reward distribution",
      address: "0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B",
      explorerUrl: "https://amoy.polygonscan.com/address/0x6cFe23FA3ed2D3df4ae2a4A2686514Fa8E634A9B"
    }
  ];

  return (
    <section className="container mx-auto px-6 py-20 border-t border-border">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Code className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Deployed & Verified</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Smart Contracts</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Production-ready contracts deployed on Polygon testnets
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {contracts.map((contract, index) => (
          <motion.div
            key={contract.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Card className={`p-6 bg-card border-${contract.color}/30 hover:border-${contract.color}/50 transition-all group`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${contract.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <contract.icon className={`w-6 h-6 text-${contract.color}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{contract.name}</h3>
                  <Badge variant="outline" className={`text-xs bg-${contract.color}/10 text-${contract.color} border-${contract.color}/20`}>
                    {contract.network}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {contract.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Address:</span>
                </div>
                <code className="block text-xs font-mono bg-muted/50 p-2 rounded border border-border break-all">
                  {contract.address}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  className={`w-full mt-2 border-${contract.color}/30 hover:border-${contract.color}/50`}
                  onClick={() => window.open(contract.explorerUrl, "_blank")}
                >
                  <ExternalLink className="w-3 h-3 mr-2" />
                  View on Explorer
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
