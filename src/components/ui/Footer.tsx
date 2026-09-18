import { ArrowUp, Globe, Share2, Sparkles } from 'lucide-react';
import type { Flavor } from '../../utils/flavors';

interface FooterProps {
  currentFlavor: Flavor;
  onOpenOrder: () => void;
}

export function Footer({ currentFlavor, onOpenOrder }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/10 bg-black/40 backdrop-blur-xl z-20 pointer-events-auto py-16 px-4 sm:px-8 text-zinc-400">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Call to Action Banner */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border-white/10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-syne font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
              READY TO CRACK OPEN <br />
              <span style={{ color: currentFlavor.accentColor }}>PURE REFRESHMENT?</span>
            </h3>
            <p className="text-zinc-300 text-sm max-w-md">
              Order your sample case today. Cold-shipped with dry ice anywhere in the nation.
            </p>
          </div>
          <button
            onClick={onOpenOrder}
            className="px-8 py-4 rounded-full font-syne font-black text-sm uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl shrink-0"
            style={{ backgroundColor: currentFlavor.accentColor }}
          >
            Explore Flavors & Order
          </button>
        </div>

        {/* Links & Brand Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-xs">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🍋</span>
              <span className="font-syne font-black text-xl text-white tracking-tight">
                BLENDER JUICE
              </span>
            </div>
            <p className="text-zinc-400 leading-relaxed max-w-sm">
              Cold-pressed real fruit soda crafted with alpine spring water and zero compromises. Hand-canned in infinitely recyclable aluminum.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#social"
                className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-zinc-300 hover:text-white"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-zinc-300 hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#social"
                className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-zinc-300 hover:text-white"
              >
                <Sparkles className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav 1 */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white">Flavors</div>
            <ul className="space-y-2">
              <li><a href="#flavors" className="hover:text-white transition-colors">Lemon Lime Mint</a></li>
              <li><a href="#flavors" className="hover:text-white transition-colors">Blood Orange Spark</a></li>
              <li><a href="#flavors" className="hover:text-white transition-colors">Wild Berry Eclipse</a></li>
              <li><a href="#flavors" className="hover:text-white transition-colors">Black Yuzu Cola</a></li>
            </ul>
          </div>

          {/* Nav 2 */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white">Engineering</div>
            <ul className="space-y-2">
              <li><a href="#anatomy" className="hover:text-white transition-colors">Can Architecture</a></li>
              <li><a href="#anatomy" className="hover:text-white transition-colors">Condensation Matrix</a></li>
              <li><a href="#ingredients" className="hover:text-white transition-colors">Cold-Chain Logistics</a></li>
              <li><a href="#ingredients" className="hover:text-white transition-colors">Recycling Initiative</a></li>
            </ul>
          </div>

          {/* Nav 3 */}
          <div className="space-y-3">
            <div className="font-bold uppercase tracking-wider text-white">Company</div>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Press & Media</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Wholesale Supply</a></li>
              <li><a href="#hero" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Blender Juice Co. All rights reserved. 3D Web Experience built with Three.js & React.
          </div>
          <button
            onClick={scrollToTop}
            className="glass-button px-4 py-2 rounded-full text-zinc-300 hover:text-white flex items-center gap-2"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
