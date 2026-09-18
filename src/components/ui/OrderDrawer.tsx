import { useState } from 'react';
import { X, Check, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { FLAVORS, FLAVOR_KEYS, type Flavor } from '../../utils/flavors';
import { soundManager } from '../../utils/audio';

interface OrderDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentFlavor: Flavor;
  onSelectFlavor: (flavor: Flavor) => void;
  onAddToCartSuccess: () => void;
}

export function OrderDrawer({
  isOpen,
  onClose,
  currentFlavor,
  onSelectFlavor,
  onAddToCartSuccess,
}: OrderDrawerProps) {
  const [packSize, setPackSize] = useState<6 | 12 | 24>(12);
  const [quantity, setQuantity] = useState(1);
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const prices = {
    6: 17.99,
    12: 29.99,
    24: 52.99,
  };

  const unitPrices = {
    6: '$3.00 / can',
    12: '$2.50 / can',
    24: '$2.20 / can',
  };

  const total = (prices[packSize] * quantity).toFixed(2);

  const handleCompleteOrder = () => {
    soundManager.playCanCrack();
    setIsOrdered(true);
    onAddToCartSuccess();

    // Trigger celebratory confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a3e635', '#ffffff', '#4ade80', '#fb923c'],
    });

    setTimeout(() => {
      setIsOrdered(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-[#0e160a] border-l border-white/10 h-full p-6 sm:p-8 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 text-white">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div>
              <h3 className="font-syne font-black text-2xl uppercase tracking-tight">
                Order Blender Juice
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Freshly canned & shipped cold to your door
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full glass-button text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isOrdered ? (
            <div className="py-20 text-center space-y-4">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center animate-bounce shadow-xl"
                style={{ backgroundColor: currentFlavor.accentColor }}
              >
                <Check className="w-8 h-8 text-black" />
              </div>
              <h4 className="font-syne font-black text-2xl uppercase">Order Confirmed!</h4>
              <p className="text-sm text-zinc-300 max-w-xs mx-auto">
                Your cold-pressed {packSize}-pack is being prepared for immediate dispatch. Cheers to peak refreshment!
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              {/* 1. Select Flavor */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  1. Selected Flavor
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {FLAVOR_KEYS.map((k) => {
                    const f = FLAVORS[k];
                    const isSelected = f.id === currentFlavor.id;
                    return (
                      <button
                        key={f.id}
                        onClick={() => {
                          onSelectFlavor(f);
                          soundManager.playBubblePop();
                        }}
                        className={`p-3 rounded-2xl text-left border transition-all ${
                          isSelected
                            ? 'bg-white/10 shadow-lg scale-102'
                            : 'bg-black/30 border-white/5 hover:border-white/20'
                        }`}
                        style={{
                          borderColor: isSelected ? f.accentColor : undefined,
                        }}
                      >
                        <div
                          className="w-2.5 h-2.5 rounded-full mb-1.5"
                          style={{ backgroundColor: f.accentColor }}
                        />
                        <div className="font-bold text-xs">{f.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Select Pack Size */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  2. Pack Size
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {([6, 12, 24] as const).map((size) => {
                    const isSelected = packSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => {
                          setPackSize(size);
                          soundManager.playBubblePop();
                        }}
                        className={`p-3.5 rounded-2xl text-center border relative transition-all ${
                          isSelected
                            ? 'bg-white/10 shadow-xl'
                            : 'bg-black/30 border-white/5 hover:border-white/20'
                        }`}
                        style={{
                          borderColor: isSelected ? currentFlavor.accentColor : undefined,
                        }}
                      >
                        {size === 12 && (
                          <div
                            className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase text-black"
                            style={{ backgroundColor: currentFlavor.accentColor }}
                          >
                            Best Value
                          </div>
                        )}
                        <div className="font-syne font-black text-lg text-white">
                          {size}-Pack
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {unitPrices[size]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quantity & Pricing Details */}
              <div className="glass-panel p-5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400">Quantity</span>
                  <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-zinc-400 hover:text-white text-base font-bold px-1"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-zinc-400 hover:text-white text-base font-bold px-1"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-white/5">
                  <span>Free Cold-Chain Shipping</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> FREE
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="font-syne font-bold text-sm text-zinc-300">Total Price</span>
                  <span
                    className="font-syne font-black text-2xl"
                    style={{ color: currentFlavor.accentColor }}
                  >
                    ${total}
                  </span>
                </div>
              </div>

              {/* Quality Guarantee Badges */}
              <div className="flex items-center justify-around text-[11px] text-zinc-400 pt-1">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30-Day Taste Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Carbon-Neutral Delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Checkout Button */}
        {!isOrdered && (
          <button
            onClick={handleCompleteOrder}
            className="w-full py-4 rounded-full font-syne font-black text-sm uppercase tracking-wider text-black transition-all duration-300 hover:scale-102 active:scale-98 shadow-2xl flex items-center justify-center gap-2"
            style={{ backgroundColor: currentFlavor.accentColor }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Complete Order (${total})</span>
          </button>
        )}
      </div>
    </div>
  );
}
