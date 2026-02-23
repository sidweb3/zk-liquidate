import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface LandingNavbarProps {
  onConnectWallet: () => void;
}

export function LandingNavbar({ onConnectWallet }: LandingNavbarProps) {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 border-b border-white/5 bg-black/85 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src="/zklogo.png" alt="zkLiquidate" className="w-7 h-7 rounded-md" />
            <span className="text-base font-semibold tracking-tight text-white">zkLiquidate</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/15 text-primary border border-primary/20 ml-1">
              TESTNET
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <button onClick={() => navigate("/whitepaper")} className="hover:text-white transition-colors">Whitepaper</button>
            <button onClick={() => navigate("/documentation")} className="hover:text-white transition-colors">Docs</button>
            <button onClick={() => navigate("/community")} className="hover:text-white transition-colors">Community</button>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex border-white/10 text-white/60 hover:text-white hover:bg-white/5 text-xs"
              onClick={() => navigate("/whitepaper")}
            >
              Read Whitepaper
            </Button>
            <Button
              size="sm"
              className="bg-primary text-black hover:bg-primary/90 font-semibold text-xs px-4 shadow-md shadow-primary/20"
              onClick={onConnectWallet}
            >
              Launch App
            </Button>
            <button
              className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 left-0 right-0 z-40 bg-black/95 border-b border-white/5 backdrop-blur-xl md:hidden"
        >
          <div className="container mx-auto px-6 py-4 flex flex-col gap-3">
            <button onClick={() => { navigate("/whitepaper"); setMobileOpen(false); }} className="text-sm text-white/60 hover:text-white text-left py-2 transition-colors">Whitepaper</button>
            <button onClick={() => { navigate("/documentation"); setMobileOpen(false); }} className="text-sm text-white/60 hover:text-white text-left py-2 transition-colors">Docs</button>
            <button onClick={() => { navigate("/community"); setMobileOpen(false); }} className="text-sm text-white/60 hover:text-white text-left py-2 transition-colors">Community</button>
            <Button size="sm" className="bg-primary text-black font-semibold text-xs mt-2" onClick={() => { onConnectWallet(); setMobileOpen(false); }}>
              Launch App
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
}