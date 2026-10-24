import "./globals.css";

export const metadata = {
  title: "BEAST System 3.0 | Private Government Portal",
  description: "Sovereign Web3 administrative, judicial, property, and trade ecosystem.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500 flex items-center justify-center font-bold text-emerald-400">
                B
              </div>
              <span className="font-semibold text-lg tracking-wide">BEAST Governance Suite</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-400">
              <a href="#governance" className="hover:text-slate-100 transition-colors">Governance</a>
              <a href="#credentials" className="hover:text-slate-100 transition-colors">Identity</a>
              <a href="#arbitration" className="hover:text-slate-100 transition-colors">Arbitration</a>
              <a href="#trade" className="hover:text-slate-100 transition-colors">Trade</a>
              <a href="#insurance" className="hover:text-slate-100 transition-colors">Insurance</a>
            </nav>
          </div>
        </header>

        <div className="flex-1 max-w-7xl w-full mx-auto p-6">
          {children}
        </div>

        <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
          BEAST System 3.0 &bull; Decentralized Autonomous Sovereign Framework
        </footer>
      </body>
    </html>
  );
}
