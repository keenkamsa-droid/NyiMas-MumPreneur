import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortionOption, AddonOption } from '../types';

export const FoodDetailsScreen: React.FC = () => {
  const {
    selectedDish,
    addToCart,
    navigateTo,
    favoriteDishIds,
    toggleFavorite,
    cartCount,
    goBack,
  } = useApp();

  const dish = selectedDish;

  // Selected portion state
  const [selectedPortion, setSelectedPortion] = useState<PortionOption>(() => {
    return dish?.portionOptions?.[0] || {
      id: 'portion-default',
      name: '1 Pax Regular Bento',
      price: 18.00,
      description: 'Standard portion',
    };
  });

  // Selected addons
  const [selectedAddons, setSelectedAddons] = useState<AddonOption[]>([]);

  // Infaq sponsorship checkbox
  const [infaqPledged, setInfaqPledged] = useState(false);

  // Instructions
  const [instructions, setInstructions] = useState('');

  // Quantity
  const [quantity, setQuantity] = useState(1);

  if (!dish) {
    return (
      <div className="pt-20 text-center">
        <p>No dish selected.</p>
        <button
          onClick={() => navigateTo('menu')}
          className="mt-3 px-4 py-2 bg-[#013623] text-white rounded-xl text-xs"
        >
          Back to Menu
        </button>
      </div>
    );
  }

  const isFavorite = favoriteDishIds.includes(dish.id);

  // Calculate pricing
  const addonsCost = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const singleMealCost = selectedPortion.price + addonsCost;
  const mealSubtotal = singleMealCost * quantity;
  const infaqCost = infaqPledged && dish.infaqSponsorshipOption ? dish.infaqSponsorshipOption.price : 0;
  const grandTotal = mealSubtotal + infaqCost;

  const handleAddonToggle = (addon: AddonOption) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart(
      dish,
      selectedPortion,
      selectedAddons,
      quantity,
      instructions.trim() || undefined,
      infaqPledged,
      infaqCost
    );
    navigateTo('cart');
  };

  return (
    <div className="flex flex-col w-full pb-36 pt-16 bg-[#faf9f5]">
      {/* Top Bar Navigation */}
      <div className="px-5 py-2 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          aria-label="Back"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#efeeea] text-[#1b1c1a] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="font-serif-display text-base text-[#013623] tracking-tight font-bold">
            Food Details
          </span>
          <span className="text-[10px] text-[#7d5800] uppercase tracking-widest font-bold">
            Artisanal Special
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => toggleFavorite(dish.id)}
            aria-label="Favorite"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#efeeea] text-[#1b1c1a] active:scale-95 transition-transform"
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                isFavorite ? 'text-[#ba1a1a]' : 'text-[#717973]'
              }`}
              style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              favorite
            </span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('cart')}
            aria-label="Cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-[#efeeea] text-[#013623] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#7d5800] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Hero Food Imagery */}
      <div className="px-5 pt-1 max-w-md mx-auto w-full">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md bg-[#efeeea] border border-[#efeeea]">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#013623]/70 via-transparent to-black/20 pointer-events-none" />

          {/* Floating Badges */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5 items-center">
              {dish.badge && (
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#013623] text-xs font-bold shadow-sm">
                  <span
                    className="material-symbols-outlined text-[13px] text-[#7d5800]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>{dish.badge}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1e4d38]/90 backdrop-blur-md text-white text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-[13px]">local_fire_department</span>
                <span>Fresh Daily</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-full bg-white/90 text-[#1b1c1a] text-xs font-bold backdrop-blur-md shadow-sm">
              Prep {dish.prepTimeMinutes || 25} mins
            </div>
          </div>

          {/* 100% Muslim-Owned Kitchen Badge */}
          <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm">
              <span
                className="material-symbols-outlined text-[16px] text-[#7d5800]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              <span className="text-xs text-[#013623] font-bold">100% Muslim-Owned Kitchen</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Food Information */}
      <div className="px-5 pt-4 flex flex-col gap-1.5 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between">
          <span className="px-3 py-0.5 rounded-full bg-[#ffdea9] text-[#271900] text-[10px] font-bold uppercase tracking-wider">
            {dish.categories[1] ? dish.categories[1].replace('-', ' ') : 'Signature'}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#013623] animate-pulse" />
            <span className="text-xs text-[#013623] font-semibold">In Stock (Available Today)</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#414943] mt-1 font-semibold">
          <span className="text-[#013623] font-bold">NyiMas MumPreneur</span>
          <span>•</span>
          <span>Home Kitchen SG</span>
          <span
            className="material-symbols-outlined text-[14px] text-[#7d5800]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            workspace_premium
          </span>
        </div>

        <h1 className="font-serif-display text-2xl text-[#013623] font-bold tracking-tight">
          {dish.name}
        </h1>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="font-serif-display text-2xl text-[#013623] font-extrabold tracking-tight">
              S${singleMealCost.toFixed(2)}
            </span>
            <span className="text-[11px] text-[#717973]">Incl. 9% GST</span>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#efeeea] text-[#414943] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[13px]">lunch_dining</span>
            <span>{selectedPortion.name.split('(')[0]}</span>
          </div>
        </div>

        {/* Kenduri Advance Pre-order Banner */}
        <div className="mt-2 p-3 rounded-xl bg-[#f4f4f0] border border-[#efeeea] flex items-center gap-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[#7d5800] text-[20px] shrink-0">
            event_seat
          </span>
          <p className="text-xs text-[#414943] leading-snug">
            <strong className="text-[#1b1c1a] font-bold">Pre-order Kenduri / Weekend Slot:</strong> Family catering trays available with 48h advance notice.
          </p>
        </div>
      </div>

      {/* About This Dish Story */}
      <div className="px-5 pt-5 flex flex-col gap-2 max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#013623]">auto_stories</span>
          <h3 className="font-serif-display text-base text-[#013623] font-bold">About This Dish</h3>
        </div>
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#efeeea] flex flex-col gap-2.5">
          <p className="text-xs text-[#414943] leading-relaxed">
            {dish.story || dish.description}
          </p>
          <div className="pt-2 flex items-center justify-between bg-[#f4f4f0] px-3 py-2 rounded-xl">
            <p className="font-serif-display italic text-[#013623] text-xs font-semibold">
              “Cooked with Love. Delicious. Halal Certified.”
            </p>
            <div className="flex items-center gap-1 text-[#7d5800] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              <span>Mum&apos;s Touch</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Included */}
      {dish.includedComponents && dish.includedComponents.length > 0 && (
        <div className="px-5 pt-5 flex flex-col gap-2 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#013623]">
                restaurant_menu
              </span>
              <h3 className="font-serif-display text-base text-[#013623] font-bold">
                What&apos;s Included
              </h3>
            </div>
            <span className="text-[10px] text-[#013623] font-semibold bg-[#efeeea] px-2.5 py-0.5 rounded-full">
              {dish.includedComponents.length} Components
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#efeeea] flex flex-col gap-3">
            {dish.includedComponents.map((comp, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#ffdea9]/50 flex items-center justify-center text-[#7d5800] shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[17px]">{comp.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1b1c1a]">{comp.title}</p>
                  <p className="text-[11px] text-[#717973] leading-normal">{comp.description}</p>
                </div>
              </div>
            ))}

            {/* Dietary & Allergen Notice */}
            {dish.allergensNotice && (
              <div className="p-2.5 rounded-xl bg-[#f4f4f0] flex items-start gap-2 mt-1 border border-[#efeeea]">
                <span className="material-symbols-outlined text-[16px] text-[#7d5800] mt-0.5 shrink-0">
                  info
                </span>
                <p className="text-[11px] text-[#414943] leading-snug">
                  <strong className="text-[#1b1c1a] font-semibold">Dietary &amp; Allergens:</strong>{' '}
                  {dish.allergensNotice}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Select Serving Size */}
      <div className="px-5 pt-5 flex flex-col gap-2.5 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-display text-base text-[#013623] font-bold">
            Select Serving Size
          </h3>
          <span className="text-[10px] text-[#7d5800] uppercase tracking-wider font-bold">
            Required • 1 Option
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {dish.portionOptions.map((portion) => {
            const isSelected = selectedPortion.id === portion.id;
            return (
              <label
                key={portion.id}
                onClick={() => setSelectedPortion(portion)}
                className={`relative flex items-start gap-3 p-3.5 rounded-2xl bg-white shadow-xs cursor-pointer transition-all border ${
                  isSelected ? 'border-[#013623] ring-1 ring-[#013623]' : 'border-[#efeeea]'
                }`}
              >
                <input
                  type="radio"
                  name="portion"
                  checked={isSelected}
                  onChange={() => setSelectedPortion(portion)}
                  className="mt-1 w-4 h-4 text-[#013623] accent-[#013623] cursor-pointer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#013623]' : 'text-[#1b1c1a]'}`}>
                        {portion.name}
                      </span>
                      {portion.badge && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#ffdea9] text-[#271900] text-[9px] font-bold uppercase">
                          {portion.badge}
                        </span>
                      )}
                    </div>
                    <span className="font-serif-display text-sm text-[#013623] font-bold">
                      S${portion.price.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717973] mt-0.5">{portion.description}</p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Add-on Delights */}
      {dish.addonOptions && dish.addonOptions.length > 0 && (
        <div className="px-5 pt-5 flex flex-col gap-2.5 max-w-md mx-auto w-full">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-display text-base text-[#013623] font-bold">
              Add-on Delights
            </h3>
            <span className="text-[10px] text-[#717973]">Optional Extras</span>
          </div>
          <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#efeeea] flex flex-col gap-3">
            {dish.addonOptions.map((addon) => {
              const isChecked = selectedAddons.some((a) => a.id === addon.id);
              return (
                <label
                  key={addon.id}
                  className="flex items-center justify-between gap-3 cursor-pointer select-none group"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleAddonToggle(addon)}
                      className="w-4 h-4 rounded text-[#013623] accent-[#013623] cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-[#1b1c1a] group-hover:text-[#013623] font-semibold">
                          {addon.name}
                        </span>
                        {addon.badge && (
                          <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] text-[9px] font-bold">
                            {addon.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#717973]">{addon.description}</span>
                    </div>
                  </div>
                  <span className="text-xs text-[#013623] font-bold">
                    +S${addon.price.toFixed(2)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Cooking Instructions */}
      <div className="px-5 pt-5 flex flex-col gap-2 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between">
          <label htmlFor="notes" className="font-serif-display text-base text-[#013623] font-bold">
            Special Instructions
          </label>
          <span className="text-[10px] text-[#717973]">Optional</span>
        </div>
        <div className="relative">
          <textarea
            id="notes"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value.slice(0, 120))}
            placeholder="e.g., Less spicy, separate sauce in small container, gate code..."
            rows={2}
            className="w-full p-3.5 rounded-2xl bg-white text-xs text-[#1b1c1a] placeholder:text-[#717973]/70 shadow-sm border border-[#efeeea] outline-none focus:ring-1 focus:ring-[#013623] resize-none"
          />
          <div className="absolute bottom-2 right-3 text-[10px] text-[#717973]">
            {instructions.length} / 120 chars
          </div>
        </div>
      </div>

      {/* Infaq Jumaat Food Sharing Option */}
      {dish.infaqSponsorshipOption && (
        <div className="px-5 pt-5 max-w-md mx-auto w-full">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e4d38] via-[#013623] to-[#1e4d38] text-white p-4 shadow-lg border border-[#efeeea]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffc969]/20 flex items-center justify-center text-[#ffdea9] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[24px]">volunteer_activism</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#ffdea9] uppercase tracking-widest font-extrabold">
                    Barakah Giving
                  </span>
                  <span className="material-symbols-outlined text-[13px] text-[#ffdea9]">
                    arrow_forward_ios
                  </span>
                </div>
                <h4 className="font-serif-display text-sm text-white font-bold mt-0.5">
                  Sponsor This Meal for Friday Infaq
                </h4>
                <p className="text-xs text-[#8cbda2] mt-1 leading-snug">
                  Sponsor this warm nourishing bento for Friday congregants and low-income families supported by Masjid Darul Makmur.
                </p>
              </div>
            </div>

            <label className="mt-3 flex items-start gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm cursor-pointer select-none border border-white/10 hover:bg-white/15 transition-all">
              <input
                type="checkbox"
                checked={infaqPledged}
                onChange={(e) => setInfaqPledged(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#ffc969] accent-[#ffc969] cursor-pointer"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white font-bold">Pledge 1 Infaq Bento Set</span>
                  <span className="font-serif-display text-xs text-[#ffdea9] font-bold">
                    S${dish.infaqSponsorshipOption.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-[#8cbda2] mt-0.5 leading-snug">
                  {dish.infaqSponsorshipOption.description}
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Live Serving Quantity Stepper */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between max-w-md mx-auto w-full">
        <div className="flex flex-col">
          <span className="text-[10px] text-[#717973] uppercase font-bold tracking-wider">
            Serving Quantity
          </span>
          <span className="font-serif-display text-sm text-[#013623] font-bold">
            Item Subtotal: S${mealSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center bg-[#efeeea] rounded-full p-1 shadow-xs border border-[#efeeea]">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#013623] font-bold shadow-xs active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">remove</span>
          </button>
          <span className="w-9 text-center font-bold text-sm text-[#013623]">{quantity}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="w-8 h-8 rounded-full bg-[#013623] flex items-center justify-center text-white font-bold shadow-xs active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </div>

      {/* Sticky Mobile Bottom Checkout Bar (z-50 to ensure maximum visibility) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#faf9f5]/95 backdrop-blur-xl border-t border-[#efeeea] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-5 py-3 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-[#717973] font-medium">Grand Total</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#efeeea] text-[#414943] text-[9px] font-bold">
                {quantity + (infaqPledged ? 1 : 0)} items
              </span>
            </div>
            <span className="font-serif-display text-xl font-extrabold text-[#013623] tracking-tight">
              S${grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="flex-1 flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 h-12 px-2.5 rounded-2xl bg-white border border-[#013623] text-[#013623] hover:bg-[#f4f4f0] font-bold text-xs flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
              <span>Add to Cart</span>
            </button>
            <button
              type="button"
              onClick={() => {
                addToCart(
                  dish,
                  selectedPortion,
                  selectedAddons,
                  quantity,
                  instructions.trim() || undefined,
                  infaqPledged,
                  infaqCost
                );
                navigateTo('checkout');
              }}
              className="flex-1 h-12 px-2.5 rounded-2xl bg-[#013623] hover:bg-[#1e4d38] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined text-[17px]">lock</span>
              <span>Checkout Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
