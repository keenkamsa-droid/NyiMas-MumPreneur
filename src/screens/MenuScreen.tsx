import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { DishCategory, Dish } from '../types';

export const MenuScreen: React.FC = () => {
  const { dishes, navigateTo, addToCart, cartCount, cartFoodSubtotal, cartInfaqSubtotal } = useApp();

  const [activeCategory, setActiveCategory] = useState<DishCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under20' | 'preorder' | 'catering'>('all');

  const categories: { id: DishCategory; label: string; icon?: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'signature-rice', label: 'Signature Rice' },
    { id: 'premium-specials', label: 'Premium Specials' },
    { id: 'chicken', label: 'Chicken' },
    { id: 'lamb', label: 'Lamb' },
    { id: 'catering', label: 'Catering' },
    { id: 'infaq', label: 'Infaq Jumaat', icon: 'volunteer_activism' },
  ];

  const filteredDishes = useMemo(() => {
    return dishes.filter((dish) => {
      // Category match
      if (activeCategory === 'infaq') {
        // Only dishes with infaq sponsorship or catering infaq
        if (!dish.infaqSponsorshipOption && dish.id !== 'dish-infaq-meal') {
          return false;
        }
      } else if (activeCategory !== 'all') {
        if (!dish.categories.includes(activeCategory)) {
          return false;
        }
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesSubtitle = dish.subtitle.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesSubtitle) {
          return false;
        }
      }

      // Quick price filter
      if (priceFilter === 'under20' && dish.price > 20) return false;
      if (priceFilter === 'preorder' && !dish.availabilityTag.toLowerCase().includes('pre-order')) return false;
      if (priceFilter === 'catering' && !dish.categories.includes('catering')) return false;

      return true;
    });
  }, [dishes, activeCategory, searchQuery, priceFilter]);

  const totalKitchenBasket = cartFoodSubtotal + cartInfaqSubtotal;

  return (
    <div className="flex flex-col w-full pb-32 pt-16 bg-[#faf9f5]">
      {/* Page Header */}
      <section className="px-5 pt-3 pb-2 max-w-md mx-auto w-full">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea9] text-[#271900] text-[10px] font-bold uppercase tracking-wider mb-2 shadow-xs">
          <span className="material-symbols-outlined text-[13px] text-[#7d5800]">favorite</span>
          <span>Cooked with Love • Delicious • Halal Certified</span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h1 className="font-serif-display text-2xl font-bold text-[#013623] tracking-tight">
            Explore Our Menu
          </h1>
          <span className="text-xs text-[#7d5800] bg-[#e9e8e4] px-2.5 py-0.5 rounded-full font-bold">
            {dishes.length} Dishes
          </span>
        </div>
        <p className="text-xs text-[#414943] mt-1 leading-snug">
          Discover delicious meals, prepared with motherly love and served with authentic Singapore barakah.
        </p>
      </section>

      {/* Sticky Search & Quick Filter Bar */}
      <section className="px-5 py-2 sticky top-16 z-30 bg-[#faf9f5]/95 backdrop-blur-md max-w-md mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center bg-[#f4f4f0] rounded-full px-3.5 py-2.5 shadow-sm border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#717973] text-[20px] shrink-0">
              search
            </span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes or menu items..."
              className="w-full bg-transparent pl-2.5 text-xs text-[#1b1c1a] placeholder:text-[#717973] outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#717973] hover:text-[#1b1c1a] text-xs"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
          <button
            type="button"
            aria-label="Filter"
            onClick={() => {
              setPriceFilter((prev) => (prev === 'all' ? 'under20' : 'all'));
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              priceFilter !== 'all'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'bg-[#efeeea] text-[#013623]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mt-1">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (cat.id === 'infaq') {
                    navigateTo('infaq');
                  } else {
                    setActiveCategory(cat.id);
                  }
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                  isSelected
                    ? 'bg-[#013623] text-white shadow-sm'
                    : cat.id === 'infaq'
                    ? 'bg-[#ffdea9] text-[#7d5800] hover:bg-[#ffc969]'
                    : 'bg-[#f4f4f0] text-[#414943] hover:bg-[#e9e8e4] border border-[#efeeea]'
                }`}
              >
                {cat.icon && (
                  <span className="material-symbols-outlined text-[15px]">{cat.icon}</span>
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] text-[#717973] uppercase font-bold tracking-wider shrink-0 mr-1">
            Filter:
          </span>
          <button
            type="button"
            onClick={() => setPriceFilter('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              priceFilter === 'all'
                ? 'bg-white text-[#013623] shadow-xs border border-[#efeeea]'
                : 'bg-[#e9e8e4] text-[#414943]'
            }`}
          >
            All Prices
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter('under20')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              priceFilter === 'under20'
                ? 'bg-white text-[#013623] shadow-xs border border-[#efeeea]'
                : 'bg-[#e9e8e4] text-[#414943]'
            }`}
          >
            S$10 – S$20
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter('preorder')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              priceFilter === 'preorder'
                ? 'bg-white text-[#013623] shadow-xs border border-[#efeeea]'
                : 'bg-[#e9e8e4] text-[#414943]'
            }`}
          >
            Pre-order Today
          </button>
          <button
            type="button"
            onClick={() => setPriceFilter('catering')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-colors ${
              priceFilter === 'catering'
                ? 'bg-white text-[#013623] shadow-xs border border-[#efeeea]'
                : 'bg-[#e9e8e4] text-[#414943]'
            }`}
          >
            Catering Feast
          </button>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="px-5 py-2 max-w-md mx-auto w-full">
        <div className="bg-gradient-to-r from-[#1e4d38] to-[#013623] text-white rounded-2xl p-3 shadow-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[#ffdea9] text-[18px]">verified</span>
            </div>
            <div className="min-w-0">
              <p className="font-serif-display text-xs text-[#ffdea9] font-bold leading-tight truncate">
                100% Muslim-Owned Kitchen
              </p>
              <p className="text-[10px] text-white/80 truncate">
                Freshly cooked daily by Singapore MumPreneurs with love
              </p>
            </div>
          </div>
          <span className="shrink-0 text-base">🌿</span>
        </div>
      </section>

      {/* Dish List Container */}
      <section className="px-5 py-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {filteredDishes.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973] mb-3">
              <span className="material-symbols-outlined text-[28px]">soup_kitchen</span>
            </div>
            <h3 className="font-serif-display text-base font-bold text-[#1b1c1a]">No dishes found</h3>
            <p className="text-xs text-[#717973] mt-1 max-w-xs">
              Try searching for another dish like &quot;Pilaf&quot;, &quot;Chicken&quot;, or clear your filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
                setPriceFilter('all');
              }}
              className="mt-3 px-4 py-2 rounded-full bg-[#013623] text-white text-xs font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <article
              key={dish.id}
              onClick={() => navigateTo('food-details', { dishId: dish.id })}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#efeeea] flex flex-col cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Media Container */}
              <div className="relative w-full h-44 overflow-hidden bg-[#efeeea]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {dish.badge && (
                  <div className="absolute top-3 left-3 bg-[#1e4d38]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-[12px] text-[#ffc969]">
                      hotel_class
                    </span>
                    <span>{dish.badge}</span>
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-[#013623] text-[10px] px-2 py-0.5 rounded-full font-bold shadow-xs">
                  {dish.prepTimeMinutes ? `Prep ${dish.prepTimeMinutes} mins` : 'Fresh Daily'}
                </div>
              </div>

              {/* Information */}
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h2 className="font-serif-display text-base text-[#1b1c1a] font-bold leading-snug">
                      {dish.name}
                    </h2>
                    <p className="text-[11px] text-[#7d5800] font-semibold mt-0.5">
                      {dish.subtitle}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-serif-display text-lg text-[#013623] font-extrabold block">
                      S${dish.price.toFixed(2)}
                    </span>
                    {dish.infaqSponsorshipOption && (
                      <span className="text-[10px] text-[#7d5800] font-semibold block">
                        Infaq Opt: S${dish.infaqSponsorshipOption.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-[#414943] line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-[#efeeea]">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#013623] bg-[#bbeed1]/40 px-2.5 py-0.5 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e4d38]" />
                    {dish.availabilityTag}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('food-details', { dishId: dish.id });
                      }}
                      className="px-3 py-1.5 rounded-xl text-[#013623] font-semibold text-xs bg-[#f4f4f0] hover:bg-[#e9e8e4] transition-colors"
                    >
                      Explore Dish
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(dish, dish.portionOptions[0], [], 1);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#013623] hover:bg-[#1e4d38] text-white text-xs font-semibold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}

        {/* Friday Infaq Meal Packages Highlight Card in Menu */}
        <article className="bg-[#1e4d38] text-white rounded-2xl p-4 shadow-md border border-[#efeeea] flex flex-col gap-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ffc969] text-[#775300] text-[10px] font-bold">
              <span className="material-symbols-outlined text-[13px]">volunteer_activism</span>
              Infaq Jumaat Packages
            </span>
            <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold">
              Direct Mosque Delivery
            </span>
          </div>

          <div>
            <h3 className="font-serif-display text-lg font-bold text-white">
              Friday Mosque Food-Sharing Packages
            </h3>
            <p className="text-xs text-[#8cbda2] mt-1 leading-relaxed">
              Sponsor freshly packed hot lunch bentos delivered to Masjid Darul Makmur &amp; Masjid Haji Muhammad Salleh.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div>
              <span className="text-[10px] text-[#8cbda2] block">Packages from</span>
              <span className="font-serif-display text-lg text-[#ffc969] font-bold">
                S$30.00 (3 Boxes)
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('infaq')}
              className="px-4 py-2 rounded-xl bg-[#ffc969] hover:bg-[#ffdea9] text-[#271900] text-xs font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[16px]">favorite</span>
              <span>Pledge Infaq</span>
            </button>
          </div>
        </article>
      </section>

      {/* Persistent Floating Kitchen Basket Bar */}
      {cartCount > 0 && (
        <aside className="fixed bottom-20 inset-x-0 z-30 px-5 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <div
              onClick={() => navigateTo('cart')}
              className="w-full bg-[#013623] hover:bg-[#1e4d38] text-white rounded-2xl p-3 shadow-[0_12px_32px_rgba(1,54,35,0.28)] flex items-center justify-between cursor-pointer active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#ffdea9] text-[22px]">
                    shopping_bag
                  </span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ffc969] text-[#775300] text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-tight flex items-center gap-1.5">
                    <span>{cartCount} Items Selected</span>
                    <span className="text-[#ffdea9]">• Pasir Ris Kitchen Studio</span>
                  </span>
                  <span className="text-[11px] text-white/80">Islandwide Dispatch Ready</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[9px] text-white/70 uppercase font-semibold">Subtotal</span>
                  <span className="font-serif-display text-sm font-bold text-[#ffdea9]">
                    S${totalKitchenBasket.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateTo('checkout');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#ffc969] text-[#775300] font-bold text-xs flex items-center gap-1 shadow-md hover:bg-[#ffdea9] active:scale-95 transition-all ml-1"
                >
                  <span className="material-symbols-outlined text-[15px]">lock</span>
                  <span>Checkout</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
