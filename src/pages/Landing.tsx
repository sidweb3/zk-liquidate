import { useNavigate } from "react-router";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { StatsSection } from "@/components/landing/StatsSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { SmartContractsSection } from "@/components/landing/SmartContractsSection";
import { WhyUsSection } from "@/components/landing/WhyUsSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Landing() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    navigate("/wallet-connect");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <LandingNavbar onConnectWallet={handleConnectWallet} />
      <HeroSection onConnectWallet={handleConnectWallet} />
      <StatsSection />
      <FeaturesGrid />
      <HowItWorksSection />
      <SmartContractsSection />
      <WhyUsSection />
      <RoadmapSection />
      <LandingFooter />
    </div>
  );
}