import { ArrowDown, Sparkles, Move3d, Zap } from 'lucide-react';
import { FLAVORS, FLAVOR_KEYS, type Flavor } from '../../utils/flavors';

interface HeroSectionProps {
  currentFlavor: Flavor;
  onSelectFlavor: (flavor: Flavor) => void;
  onCrackCan: () => void;
}

export function HeroSection({
  currentFlavor,
  onSelectFlavor,
  onCrackCan,
}: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-12 px-4 sm:px-8 max-w-7xl mx-auto pointer-events-none"
    >
      {/* Top Tagline & Flavor Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel text-xs font-bold uppercase tracking-wider text-zinc-300">
          <span
            className="w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: currentFlavor.accentColor }}
          />
          <span>{currentFlavor.badge}</span>
          <span className="text-zinc-500">•</span>
          <span style={{ color: currentFlavor.accentColor }}>{currentFlavor.nutrition.realJuice}</span>
        </div>

        {/* Quick Flavor Switcher Pills */}
        <div className="flex items-center gap-2 glass-panel p-1.5 rounded-full">
          {FLAVOR_KEYS.map((key) => {
            const f = FLAVORS[key];
            const isSelected = f.id === currentFlavor.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFlavor(f)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  isSelected
                    ? 'text-black shadow-md scale-105'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? f.accentColor : 'transparent',
                }}
              >
                {f.id === 'lemon'
                  ? '🍋 Lemon Lime'
                  : f.id === 'blood-orange'
                  ? '🍊 Blood Orange'
                  : f.id === 'wild-berry'
                  ? '🫐 Wild Berry'
                  : '🌿 Black Yuzu'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Center-Left Typography (The Can sits center/right in 3D) */}
      <div className="my-auto max-w-2xl pointer-events-auto py-8">
        <div className="inline-flex items-center gap-2 mb-3 text-xs font-extrabold uppercase tracking-widest text-zinc-400">
          <Zap className="w-4 h-4" style={{ color: currentFlavor.accentColor }} />
          <span>Next-Generation Craft Refreshment</span>
        </div>

        <h1 className="font-syne font-black text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92] uppercase mb-6 text-white drop-shadow-2xl">
          BLENDER
          <br />
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${currentFlavor.accentColor}, #ffffff)`,
            }}
          >
            JUICE.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-zinc-300 font-medium leading-relaxed mb-8 max-w-lg">
          {currentFlavor.tagline}. Naturally carbonated alpine spring water infused with sun-ripened fruit cold-pressed at peak harvest.
        </p>

        {/* Action Button Strip */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onCrackCan}
            className="group relative px-7 py-4 rounded-full font-syne font-black text-sm uppercase tracking-wider text-black shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-3 overflow-hidden"
            style={{ backgroundColor: currentFlavor.accentColor }}
          >
            <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Sparkles className="w-5 h-5 transition-transform duration-500 group-hover:rotate-45" />
            <span>Crack To Sip</span>
          </button>

          <a
            href="#flavors"
            className="glass-button px-6 py-4 rounded-full font-syne font-bold text-xs uppercase tracking-wider text-zinc-200 hover:text-white flex items-center gap-2"
          >
            <span>Explore Notes</span>
          </a>
        </div>

        {/* 3D Inspection Hint */}
        <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-zinc-400">
          <div className="p-2 rounded-full bg-white/5 border border-white/10 animate-pulse">
            <Move3d className="w-4 h-4" style={{ color: currentFlavor.accentColor }} />
          </div>
          <span>Click & drag can to freely inspect in 360°</span>
        </div>
      </div>

      {/* Bottom Scroll Indicator & Badges */}
      <div className="flex items-center justify-between pointer-events-auto border-t border-white/10 pt-6">
        <div className="flex items-center gap-6 sm:gap-10 text-xs text-zinc-400">
          <div>
            <div className="font-syne font-black text-lg text-white">0g</div>
            <div>Added Sugar</div>
          </div>
          <div className="h-6 w-[1px] bg-white/15" />
          <div>
            <div className="font-syne font-black text-lg text-white">100%</div>
            <div>Real Citrus</div>
          </div>
          <div className="h-6 w-[1px] bg-white/15" />
          <div>
            <div className="font-syne font-black text-lg text-white">500ml</div>
            <div>Recycled Can</div>
          </div>
        </div>

        <a
          href="#flavors"
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
        >
          <span>Scroll down</span>
          <ArrowDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}
