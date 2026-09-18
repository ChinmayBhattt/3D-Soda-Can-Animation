import { Layers, ShieldCheck, Droplet, Sparkles } from 'lucide-react';
import type { Flavor } from '../../utils/flavors';
import { soundManager } from '../../utils/audio';

interface ExplodedSectionProps {
  currentFlavor: Flavor;
  isExplodedManual: boolean;
  onToggleExploded: () => void;
}

export function ExplodedSection({
  currentFlavor,
  isExplodedManual,
  onToggleExploded,
}: ExplodedSectionProps) {
  return (
    <section
      id="anatomy"
      className="relative min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-center pointer-events-none"
    >
      {/* Top Header with Manual Explode Toggle */}
      <div className="text-center max-w-2xl mx-auto mb-16 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 bg-white/5">
          <Layers className="w-3.5 h-3.5" style={{ color: currentFlavor.accentColor }} />
          <span>Structural Deconstruction</span>
        </div>
        <h2 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tight text-white mb-4">
          ENGINEERED FOR <br />
          <span style={{ color: currentFlavor.accentColor }}>MAXIMUM CHILL</span>
        </h2>
        <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6">
          Scroll through or toggle to deconstruct the can layers — from aerospace-grade recycled aluminum to micro-effervescent bubbles.
        </p>

        {/* Toggle Exploded View Button */}
        <button
          onClick={() => {
            onToggleExploded();
            soundManager.playBubblePop();
          }}
          className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-xl border flex items-center gap-2 mx-auto ${
            isExplodedManual
              ? 'bg-white text-black border-white scale-105'
              : 'glass-button text-white border-white/20 hover:border-white/40'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isExplodedManual ? 'Assemble Can' : 'Explode 3D Layers'}</span>
        </button>
      </div>

      {/* Anatomy Feature Callouts Grid (Floats around the center 3D can) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
        {/* Hotspot 1: Pull Tab */}
        <div className="glass-panel p-6 rounded-3xl hover:border-white/30 transition-all duration-300 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${currentFlavor.accentColor}20` }}
          >
            <Sparkles className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
            01 / APERTURE
          </div>
          <h3 className="font-syne font-bold text-lg text-white mb-2">
            Laser-Etched Stay Tab
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Calibrated burst foil engineered to release precisely 4.2 bars of micro-carbonation with a crisp acoustic snap.
          </p>
        </div>

        {/* Hotspot 2: Double-Seamed Rim */}
        <div className="glass-panel p-6 rounded-3xl hover:border-white/30 transition-all duration-300 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${currentFlavor.accentColor}20` }}
          >
            <ShieldCheck className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
            02 / SEAL
          </div>
          <h3 className="font-syne font-bold text-lg text-white mb-2">
            Double-Seamed Rim
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Hermetic pressure-rolled aluminum barrier locks out UV rays and oxygen to keep cold-pressed fruit flavors fresh for 365 days.
          </p>
        </div>

        {/* Hotspot 3: Condensation Coating */}
        <div className="glass-panel p-6 rounded-3xl hover:border-white/30 transition-all duration-300 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${currentFlavor.accentColor}20` }}
          >
            <Droplet className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
            03 / SURFACE
          </div>
          <h3 className="font-syne font-bold text-lg text-white mb-2">
            Condensation Grip
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Tactile matte-touch finish creates a cold-trapping surface with physical bead condensation for a crisp tactile grip.
          </p>
        </div>

        {/* Hotspot 4: Liquid Core */}
        <div className="glass-panel p-6 rounded-3xl hover:border-white/30 transition-all duration-300 group">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `${currentFlavor.accentColor}20` }}
          >
            <Layers className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
            04 / INTERIOR
          </div>
          <h3 className="font-syne font-bold text-lg text-white mb-2">
            Alpine Liquid Core
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Pure snowmelt water carbonated under cryogenic temperatures to generate micro-bubbles that won&apos;t bloat your stomach.
          </p>
        </div>
      </div>
    </section>
  );
}
