import { CheckCircle2, Leaf, Heart, Recycle } from 'lucide-react';
import type { Flavor } from '../../utils/flavors';

interface IngredientsSectionProps {
  currentFlavor: Flavor;
  onOpenOrder: () => void;
}

export function IngredientsSection({ currentFlavor, onOpenOrder }: IngredientsSectionProps) {
  return (
    <section
      id="ingredients"
      className="relative min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Ingredients & Benefits */}
        <div className="lg:col-span-7 pointer-events-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 bg-white/5">
              <Leaf className="w-3.5 h-3.5" style={{ color: currentFlavor.accentColor }} />
              <span>Clean Nutrition</span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-6xl uppercase tracking-tight text-white mb-4">
              PURE BOTANICALS. <br />
              <span style={{ color: currentFlavor.accentColor }}>ZERO COMPROMISE.</span>
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Most sodas pack 39g of high-fructose corn syrup or bitter synthetic sweeteners. Blender Juice is crafted purely from real cold-pressed fruit extracts and crisp sparkling water.
            </p>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl flex items-start gap-3.5">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ backgroundColor: `${currentFlavor.accentColor}25` }}
              >
                <CheckCircle2 className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-white mb-1">
                  100% Real Cold-Pressed
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  Fresh whole citrus pressed within 24 hours of orchard harvest.
                </p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex items-start gap-3.5">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ backgroundColor: `${currentFlavor.accentColor}25` }}
              >
                <Heart className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-white mb-1">
                  0g Added Sugars
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  No stevia aftertaste, no erythritol, and zero artificial coloring.
                </p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex items-start gap-3.5">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ backgroundColor: `${currentFlavor.accentColor}25` }}
              >
                <Leaf className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-white mb-1">
                  Wild Botanical Infusions
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  Mountain spearmint, botanical zests, and antioxidant-rich extracts.
                </p>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl flex items-start gap-3.5">
              <div
                className="p-2.5 rounded-xl shrink-0"
                style={{ backgroundColor: `${currentFlavor.accentColor}25` }}
              >
                <Recycle className="w-5 h-5" style={{ color: currentFlavor.accentColor }} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-white mb-1">
                  Infinitely Recyclable
                </h4>
                <p className="text-xs text-zinc-400 leading-normal">
                  100% aluminum can recycled back onto store shelves in 60 days.
                </p>
              </div>
            </div>
          </div>

          {/* Full Ingredients List */}
          <div className="glass-panel p-6 rounded-3xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Ingredients Formula:
            </div>
            <div className="flex flex-wrap gap-2">
              {currentFlavor.ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-zinc-200"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={onOpenOrder}
              className="px-8 py-4 rounded-full font-syne font-black text-xs uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
              style={{ backgroundColor: currentFlavor.accentColor }}
            >
              Order 12-Pack Sampler ($29.99)
            </button>
          </div>
        </div>

        {/* Right Column: 3D Can positioned here visually */}
        <div className="hidden lg:block lg:col-span-5 pointer-events-none" />
      </div>
    </section>
  );
}
