import { ShoppingBag, Sparkles } from 'lucide-react';
import type { Flavor } from '../../utils/flavors';

interface NavbarProps {
  currentFlavor: Flavor;
  isMuted?: boolean;
  onToggleSound?: () => void;
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onOpenCart: () => void;
  onCrackCan: () => void;
  cartCount: number;
}

export function Navbar({
  currentFlavor,
  isMusicPlaying,
  onToggleMusic,
  onOpenCart,
  onCrackCan,
  cartCount,
}: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 sm:py-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-black text-black transition-transform duration-500 group-hover:rotate-180"
            style={{ backgroundColor: currentFlavor.accentColor }}
          >
            <span className="text-xl">🍋</span>
          </div>
          <div className="flex flex-col">
            <span className="font-syne font-black text-xl sm:text-2xl tracking-tight leading-none text-white">
              BLENDER <span style={{ color: currentFlavor.accentColor }}>JUICE</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-zinc-400">
              Crafted Soda • 3D
            </span>
          </div>
        </div>

        {/* Quick Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-5 py-2 rounded-full pointer-events-auto text-xs font-semibold tracking-wider uppercase text-zinc-300">
          <a
            href="#hero"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Overview
          </a>
          <a
            href="#flavors"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Flavors
          </a>
          <a
            href="#anatomy"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Anatomy
          </a>
          <a
            href="#ingredients"
            className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
          >
            Pure Ingredients
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Background Music Toggle Button */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all duration-300 shadow-md ${
              isMusicPlaying
                ? 'bg-white/15 text-white border border-white/30'
                : 'glass-button text-zinc-300 hover:text-white'
            }`}
            title={isMusicPlaying ? 'Pause Chill Music' : 'Play Background Music'}
          >
            {/* Animated Equalizer Wave Bars */}
            <div className="flex items-end gap-0.5 h-3.5">
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isMusicPlaying ? 'h-3 animate-pulse' : 'h-1.5 bg-zinc-400'
                }`}
                style={{ backgroundColor: isMusicPlaying ? currentFlavor.accentColor : undefined }}
              />
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isMusicPlaying ? 'h-2 animate-bounce' : 'h-2 bg-zinc-400'
                }`}
                style={{ backgroundColor: isMusicPlaying ? currentFlavor.accentColor : undefined }}
              />
              <span
                className={`w-0.5 rounded-full transition-all ${
                  isMusicPlaying ? 'h-3.5 animate-pulse' : 'h-1 bg-zinc-400'
                }`}
                style={{ backgroundColor: isMusicPlaying ? currentFlavor.accentColor : undefined }}
              />
            </div>
            <span className="hidden sm:inline">
              {isMusicPlaying ? 'Music ON' : 'Play Music'}
            </span>
          </button>

          {/* Quick Crack Can Action */}
          <button
            onClick={onCrackCan}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            style={{
              backgroundColor: currentFlavor.accentColor,
              color: '#0a1109',
            }}
            title="Crack can open (Plays sound & bubbles)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Crack Can</span>
          </button>

          {/* Sound FX Toggle
          <button
            onClick={() => {
              onToggleSound();
              soundManager.playBubblePop();
            }}
            className="glass-button p-2.5 sm:p-3 rounded-full text-zinc-200 hover:text-white"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4" style={{ color: currentFlavor.accentColor }} />
            )}
          </button> */}

          {/* Cart Bag */}
          <button
            onClick={onOpenCart}
            className="glass-button relative p-2.5 sm:p-3 rounded-full text-zinc-200 hover:text-white"
            title="Open Order Bag"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-black flex items-center justify-center animate-bounce"
                style={{ backgroundColor: currentFlavor.accentColor }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
