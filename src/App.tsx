import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Scene } from './components/3d/Scene';
import { Navbar } from './components/ui/Navbar';
import { HeroSection } from './components/ui/HeroSection';
import { FlavorSection } from './components/ui/FlavorSection';
import { ExplodedSection } from './components/ui/ExplodedSection';
import { IngredientsSection } from './components/ui/IngredientsSection';
import { OrderDrawer } from './components/ui/OrderDrawer';
import { Footer } from './components/ui/Footer';
import { FLAVORS, type Flavor } from './utils/flavors';
import { soundManager } from './utils/audio';
import { musicEngine } from './utils/music';

export default function App() {
  const [currentFlavor, setCurrentFlavor] = useState<Flavor>(FLAVORS.lemon);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isExplodedManual, setIsExplodedManual] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Scroll Progress Listener with RequestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const currentScroll = window.scrollY;
          const progress = Math.min(1, Math.max(0, currentScroll / (totalHeight || 1)));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Crack Can open action
  const handleCrackCan = () => {
    soundManager.playCanCrack();

    // Auto-start chill music on crack if not already playing
    if (!musicEngine.getIsPlaying()) {
      musicEngine.start();
      setIsMusicPlaying(true);
    }

    // Effervescent carbonation burst from top of screen/center
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x: 0.5, y: 0.35 },
      colors: [currentFlavor.accentColor, '#ffffff', '#ecfccb'],
      ticks: 200,
      gravity: 0.8,
      scalar: 0.9,
    });
  };

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleMusic = () => {
    const playing = musicEngine.toggle();
    setIsMusicPlaying(playing);
  };

  return (
    <div
      className="relative min-h-screen text-white transition-colors duration-1000 overflow-x-hidden selection:bg-lime-400 selection:text-black"
      style={{
        background: currentFlavor.bgGradient,
      }}
    >
      {/* Dynamic Ambient Background Glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000 opacity-60 z-0"
        style={{
          background: `radial-gradient(circle 800px at 50% 40%, ${currentFlavor.glowColor}, transparent 75%)`,
        }}
      />

      {/* Floating 3D WebGL Canvas (hero + scroll tracking) */}
      <Scene
        flavor={currentFlavor}
        scrollProgress={scrollProgress}
        isExplodedManual={isExplodedManual}
        onCanClick={handleCrackCan}
      />

      {/* Glassmorphic Navbar */}
      <Navbar
        currentFlavor={currentFlavor}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onOpenCart={() => setIsCartOpen(true)}
        onCrackCan={handleCrackCan}
        cartCount={cartCount}
      />

      {/* Main Scrollable Content */}
      <main className="relative z-20">
        <HeroSection
          currentFlavor={currentFlavor}
          onSelectFlavor={setCurrentFlavor}
          onCrackCan={handleCrackCan}
        />

        <FlavorSection
          currentFlavor={currentFlavor}
          onSelectFlavor={setCurrentFlavor}
          onOpenOrder={() => setIsCartOpen(true)}
        />

        <ExplodedSection
          currentFlavor={currentFlavor}
          isExplodedManual={isExplodedManual}
          onToggleExploded={() => setIsExplodedManual((prev) => !prev)}
        />

        <IngredientsSection
          currentFlavor={currentFlavor}
          onOpenOrder={() => setIsCartOpen(true)}
        />

        <Footer
          currentFlavor={currentFlavor}
          onOpenOrder={() => setIsCartOpen(true)}
        />
      </main>

      {/* Order / Cart Modal Drawer */}
      <OrderDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        currentFlavor={currentFlavor}
        onSelectFlavor={setCurrentFlavor}
        onAddToCartSuccess={() => setCartCount((prev) => prev + 1)}
      />
    </div>
  );
}
