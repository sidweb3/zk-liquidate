import { useNavigate } from "react-router";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { SmartContractsSection } from "@/components/landing/SmartContractsSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/wallet-connect");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Enhanced Background Gradients with Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.45, 0.2],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        <motion.div 
          className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-accent/10 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.35, 0.15],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5
          }}
        />
      </div>

      <LandingNavbar onConnectWallet={handleConnectWallet} />
      <HeroSection onConnectWallet={handleConnectWallet} />
      <FeaturesGrid />
      <StatsSection />
      <SmartContractsSection />
      <WhyUsSection />
      <RoadmapSection />
      <LandingFooter />
    </div>
  );
}