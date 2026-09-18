import { FLAVORS, FLAVOR_KEYS, type Flavor } from '../../utils/flavors';
import { soundManager } from '../../utils/audio';

interface FlavorSectionProps {
  currentFlavor: Flavor;
  onSelectFlavor: (flavor: Flavor) => void;
  onOpenOrder: () => void;
}

export function FlavorSection({
  currentFlavor,
  onSelectFlavor,
  onOpenOrder,
}: FlavorSectionProps) {
  return (
    <section
      id="flavors"
      className="relative min-h-screen py-24 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col justify-center pointer-events-none"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: 3D Can floats here naturally */}
        <div className="hidden lg:block lg:col-span-6 pointer-events-none" />

        {/* Right Column: Flavor Matrix & Sensory Radar */}
        <div className="lg:col-span-6 pointer-events-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-white/10 bg-white/5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: currentFlavor.accentColor }}
              />
              <span>Sensory Profiling</span>
            </div>
            <h2 className="font-syne font-black text-4xl sm:text-5xl uppercase tracking-tight text-white mb-3">
              Taste The <br />
              <span style={{ color: currentFlavor.accentColor }}>{currentFlavor.name}</span>
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {currentFlavor.description}
            </p>
          </div>

          {/* Flavor Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FLAVOR_KEYS.map((key) => {
              const f = FLAVORS[key];
              const isSelected = f.id === currentFlavor.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    onSelectFlavor(f);
                    soundManager.playBubblePop();
                  }}
                  className={`p-3 rounded-2xl text-left transition-all duration-300 border ${
                    isSelected
                      ? 'bg-white/10 shadow-xl scale-102'
                      : 'bg-black/20 border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                  style={{
                    borderColor: isSelected ? f.accentColor : undefined,
                  }}
                >
                  <div
                    className="w-3 h-3 rounded-full mb-2"
                    style={{ backgroundColor: f.accentColor }}
                  />
                  <div className="font-syne font-bold text-xs text-white leading-tight">
                    {f.name}
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5 truncate">
                    {f.subname}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Sensory Metrics Radar / Sliders */}
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
              <span>Palate Balance</span>
              <span style={{ color: currentFlavor.accentColor }}>Live Analysis</span>
            </div>

            {/* Tartness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Citrus Tartness</span>
                <span className="text-white">{currentFlavor.metrics.tartness}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${currentFlavor.metrics.tartness}%`,
                    backgroundColor: currentFlavor.accentColor,
                  }}
                />
              </div>
            </div>

            {/* Fizz */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Micro-Carbonation Fizz</span>
                <span className="text-white">{currentFlavor.metrics.fizz}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${currentFlavor.metrics.fizz}%`,
                    backgroundColor: currentFlavor.accentColor,
                  }}
                />
              </div>
            </div>

            {/* Refreshment */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Hydration & Crispness</span>
                <span className="text-white">{currentFlavor.metrics.refreshment}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${currentFlavor.metrics.refreshment}%`,
                    backgroundColor: currentFlavor.accentColor,
                  }}
                />
              </div>
            </div>

            {/* Natural Sweetness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-zinc-400">Natural Fruit Sweetness</span>
                <span className="text-white">{currentFlavor.metrics.sweetness}%</span>
              </div>
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${currentFlavor.metrics.sweetness}%`,
                    backgroundColor: currentFlavor.accentColor,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Nutrition Mini Badges & Order CTA */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-4 text-xs font-medium text-zinc-300">
              <div className="glass-panel px-3.5 py-2 rounded-xl">
                <span className="font-bold text-white mr-1">{currentFlavor.nutrition.calories}</span> kcal
              </div>
              <div className="glass-panel px-3.5 py-2 rounded-xl">
                <span className="font-bold text-white mr-1">{currentFlavor.nutrition.sugar}</span>
              </div>
              <div className="glass-panel px-3.5 py-2 rounded-xl">
                <span className="font-bold text-white mr-1">{currentFlavor.nutrition.vitaminC}</span>
              </div>
            </div>

            <button
              onClick={onOpenOrder}
              className="px-6 py-3 rounded-full text-xs font-black uppercase tracking-wider text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl"
              style={{ backgroundColor: currentFlavor.accentColor }}
            >
              Order {currentFlavor.name}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
