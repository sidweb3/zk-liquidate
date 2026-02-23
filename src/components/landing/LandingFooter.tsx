import { useNavigate } from "react-router";

export function LandingFooter() {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src="/zklogo.png" alt="zkLiquidate" className="w-7 h-7 rounded-md" />
              <span className="text-base font-semibold text-white">zkLiquidate</span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed max-w-xs mb-6">
              Institutional-grade cross-chain liquidations powered by ZK proofs on Polygon AggLayer.
              Built for security, performance, and reliability.
            </p>
            <div className="flex gap-2">
              {[
                { label: "X", href: "#" },
                { label: "GH", href: "#" },
                { label: "DC", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="w-8 h-8 rounded-lg border border-white/8 flex items-center justify-center text-[10px] font-bold text-white/30 hover:text-white hover:border-white/20 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Protocol",
              links: [
                { label: "Documentation", action: () => navigate("/documentation") },
                { label: "Whitepaper", action: () => navigate("/whitepaper") },
                { label: "Security Audits", action: () => {} },
              ],
            },
            {
              title: "Developers",
              links: [
                { label: "GitHub", action: () => {} },
                { label: "API Reference", action: () => navigate("/documentation") },
                { label: "Integration Guide", action: () => navigate("/documentation") },
                { label: "Whitelist Tool", action: () => window.open("/whitelist-tool.html", "_blank") },
              ],
            },
            {
              title: "Community",
              links: [
                { label: "Discord", action: () => navigate("/community") },
                { label: "Twitter", action: () => navigate("/community") },
                { label: "Blog", action: () => navigate("/community") },
                { label: "Forum", action: () => {} },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={link.action}
                      className="text-xs text-white/35 hover:text-white/70 transition-colors"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-white/25">
            © 2025 zkLiquidate Protocol. Built on Polygon AggLayer.
          </div>
          <div className="flex gap-6 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/50 transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}