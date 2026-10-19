import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DISHES, MOSQUE_CAMPAIGNS } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const { navigateTo, addToCart, activeOrder, cartCount, cartGrandTotal } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const featuredCampaign = MOSQUE_CAMPAIGNS[0]; // Masjid Darul Makmur

  // Popular Dishes for horizontal reel
  const popularDishes = [
    DISHES.find((d) => d.id === 'dish-lebanese-lamb') || DISHES[0],
    DISHES.find((d) => d.id === 'dish-yemeni-chick') || DISHES[1],
    DISHES.find((d) => d.id === 'dish-lamb-shank') || DISHES[2],
  ];

  // Everyday Delights list
  const everydayDishes = [
    DISHES.find((d) => d.id === 'dish-khao-mok') || DISHES[3],
    DISHES.find((d) => d.id === 'dish-ny-cart') || DISHES[4],
    DISHES.find((d) => d.id === 'dish-hujan-panas') || DISHES[5],
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('menu');
  };

  return (
    <div className="flex flex-col w-full pb-28 pt-16 bg-[#faf9f5]">
      {/* Warm Welcoming Header & Brand Greeting */}
      <section className="px-5 pt-4 pb-2 max-w-md mx-auto w-full">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-[#ffdea9] text-[#271900] shadow-sm">
            <span className="material-symbols-outlined text-[15px] text-[#7d5800]">favorite</span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              Cooked with Love • Fresh Daily • Halal Certified
            </span>
          </div>

          <div className="flex flex-col mt-0.5">
            <h1 className="font-serif-display text-2xl text-[#013623] font-bold tracking-tight leading-tight">
              Assalamualaikum, Welcome to NyiMas MumPreneur!
            </h1>
            <p className="text-xs text-[#414943] mt-1 leading-relaxed">
              Homemade with love, prepared with care, and shared with barakah.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1 px-3 py-2 rounded-xl bg-[#f4f4f0] text-[#414943] border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#013623] text-[18px]">local_shipping</span>
            <span className="text-xs font-semibold truncate">
              🇸🇬 Singapore Islandwide Delivery (S$18) &amp; Self-Collection
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Search Bar & Quick Filters */}
      <section className="px-5 pt-2 pb-2 max-w-md mx-auto w-full">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 p-1.5 bg-[#efeeea] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-white rounded-xl">
            <span className="material-symbols-outlined text-[#717973] text-[20px]">search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you craving today?"
              className="w-full bg-transparent text-sm text-[#1b1c1a] placeholder:text-[#717973] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            aria-label="Filter dishes"
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#013623] text-white active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </form>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => navigateTo('menu')}
            className="px-3.5 py-1.5 rounded-full bg-[#013623] text-white text-xs font-semibold whitespace-nowrap shadow-sm active:scale-95 transition-transform"
          >
            Signature Rice
          </button>
          <button
            type="button"
            onClick={() => navigateTo('food-details', { dishId: 'dish-lamb-shank' })}
            className="px-3.5 py-1.5 rounded-full bg-[#e9e8e4] text-[#414943] text-xs font-semibold whitespace-nowrap hover:bg-[#e3e2df] active:scale-95 transition-colors"
          >
            Lamb Shank
          </button>
          <button
            type="button"
            onClick={() => navigateTo('infaq')}
            className="px-3.5 py-1.5 rounded-full bg-[#ffdea9] text-[#7d5800] text-xs font-bold whitespace-nowrap active:scale-95 transition-transform flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">volunteer_activism</span>
            <span>Infaq Mosque</span>
          </button>
          <button
            type="button"
            onClick={() => navigateTo('menu')}
            className="px-3.5 py-1.5 rounded-full bg-[#e9e8e4] text-[#414943] text-xs font-semibold whitespace-nowrap hover:bg-[#e3e2df] active:scale-95 transition-colors"
          >
            Platters
          </button>
        </div>
      </section>

      {/* Active Upcoming Orders Widget */}
      {activeOrder && (
        <section className="px-5 py-2 max-w-md mx-auto w-full">
          <div
            onClick={() => navigateTo('orders', { orderId: activeOrder.id })}
            className="p-4 rounded-2xl bg-white shadow-md border border-[#efeeea] cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#bbeed1] flex items-center justify-center text-[#002113]">
                  <span className="material-symbols-outlined text-[18px]">rice_bowl</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-[#1b1c1a]">Order #{activeOrder.orderNumber}</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-[#ffdea9] text-[#271900] text-[9px] font-bold uppercase">
                      Sample Demo
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717973]">{activeOrder.dispatchDate} • {activeOrder.dispatchTimeSlot.split('(')[0]}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffc969] text-[#775300] text-[11px] font-bold animate-pulse">
                <span className="material-symbols-outlined text-[13px]">skillet</span>
                {activeOrder.status}
              </span>
            </div>

            <div className="mt-3 pt-2.5 bg-[#f4f4f0] p-2.5 rounded-xl flex flex-col gap-1 border border-[#efeeea]">
              <div className="flex items-center justify-between text-xs text-[#1b1c1a]">
                <span className="font-medium truncate pr-2">
                  {activeOrder.items.map((i) => `${i.quantity}x ${i.dishName}`).join(' + ')}
                </span>
                <span className="font-bold text-[#013623] shrink-0">
                  S${activeOrder.totalPayable.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[#717973] text-[11px] truncate">
                <span className="material-symbols-outlined text-[15px] text-[#013623] shrink-0">pin_drop</span>
                <span className="truncate">{activeOrder.deliveryAddress}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Kitchen Specialties Grid */}
      <section className="px-5 py-3 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif-display text-lg text-[#013623] font-bold">Kitchen Specialties</h2>
          <span className="text-[10px] text-[#7d5800] font-bold uppercase tracking-wider">
            Curated Menu
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {/* Category 1: Signature Rice Dishes */}
          <div
            onClick={() => navigateTo('menu')}
            className="p-3.5 rounded-2xl bg-[#f4f4f0] flex flex-col justify-between shadow-xs border border-[#efeeea] active:scale-[0.98] transition-transform cursor-pointer hover:bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#bbeed1] flex items-center justify-center text-[#002113]">
                <span className="material-symbols-outlined text-[22px]">ramen_dining</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#e3e2df] text-[#414943] text-[10px] font-bold">
                4 Mains
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-tight">
                Signature Rice Dishes
              </h3>
              <p className="text-[11px] text-[#717973] mt-0.5 line-clamp-1">
                Yemeni, Bukhari, Hujan Panas, Khao Mok
              </p>
            </div>
          </div>

          {/* Category 2: Premium Specials */}
          <div
            onClick={() => navigateTo('menu')}
            className="p-3.5 rounded-2xl bg-[#f4f4f0] flex flex-col justify-between shadow-xs border border-[#efeeea] active:scale-[0.98] transition-transform cursor-pointer hover:bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#ffdea9] flex items-center justify-center text-[#271900]">
                <span className="material-symbols-outlined text-[22px]">stars</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#f2be5f]/40 text-[#5e4100] text-[10px] font-bold">
                Chef&apos;s Best
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-tight">
                Premium Specials
              </h3>
              <p className="text-[11px] text-[#717973] mt-0.5 line-clamp-1">
                Lamb Chops Pilaf &amp; NY Halal-Cart
              </p>
            </div>
          </div>

          {/* Category 3: Catering & Platters */}
          <div
            onClick={() => navigateTo('menu')}
            className="p-3.5 rounded-2xl bg-[#f4f4f0] flex flex-col justify-between shadow-xs border border-[#efeeea] active:scale-[0.98] transition-transform cursor-pointer hover:bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#e3e2df] flex items-center justify-center text-[#013623]">
                <span className="material-symbols-outlined text-[22px]">dinner_dining</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#e3e2df] text-[#414943] text-[10px] font-bold">
                Party Sets
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-tight">
                Catering &amp; Platters
              </h3>
              <p className="text-[11px] text-[#717973] mt-0.5 line-clamp-1">
                Family trays, kenduri &amp; celebrations
              </p>
            </div>
          </div>

          {/* Category 4: Infaq Jumaat */}
          <div
            onClick={() => navigateTo('infaq')}
            className="p-3.5 rounded-2xl bg-[#f4f4f0] flex flex-col justify-between shadow-xs border border-[#efeeea] active:scale-[0.98] transition-transform cursor-pointer hover:bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#ffc969] flex items-center justify-center text-[#775300]">
                <span className="material-symbols-outlined text-[22px]">volunteer_activism</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#ffdea9] text-[#271900] text-[10px] font-bold">
                Jumaat
              </span>
            </div>
            <div className="mt-3">
              <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-tight">
                Infaq Jumaat
              </h3>
              <p className="text-[11px] text-[#717973] mt-0.5 line-clamp-1">
                Blessing mosque congregations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Dishes (Horizontal Scroll Showcase) */}
      <section className="py-3">
        <div className="px-5 max-w-md mx-auto flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif-display text-lg text-[#013623] font-bold">Popular Dishes</h2>
            <p className="text-[11px] text-[#717973]">Signature long-grain rice &amp; succulent meats</p>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('menu')}
            className="text-xs text-[#7d5800] font-bold flex items-center gap-0.5 hover:underline"
          >
            View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Horizontal Scroll Reel */}
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar px-5 max-w-md mx-auto pb-2">
          {popularDishes.map((dish) => (
            <div
              key={dish.id}
              className="min-w-[260px] w-[260px] bg-white rounded-2xl p-3 shadow-md border border-[#efeeea] flex flex-col shrink-0 cursor-pointer"
              onClick={() => navigateTo('food-details', { dishId: dish.id })}
            >
              <div className="relative w-full h-36 rounded-xl overflow-hidden bg-[#efeeea]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {dish.badge && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#013623] text-white text-[10px] font-bold shadow-sm">
                    {dish.badge}
                  </span>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[13px] text-[#7d5800]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span className="text-[11px] text-[#1b1c1a] font-bold">{dish.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-2.5 flex-1 flex flex-col">
                <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-snug">
                  {dish.name}
                </h3>
                <p className="text-[11px] text-[#717973] mt-1 line-clamp-2">
                  {dish.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-[#efeeea] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#717973] block">
                    {dish.portionOptions[0]?.name.split('(')[0] || '1 Pax'}
                  </span>
                  <span className="font-serif-display text-base text-[#013623] font-bold">
                    S${dish.price.toFixed(2)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(dish, dish.portionOptions[0], [], 1);
                  }}
                  className="h-9 px-3.5 rounded-xl bg-[#013623] hover:bg-[#1e4d38] text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Everyday Delights List */}
      <section className="px-5 py-3 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif-display text-lg text-[#013623] font-bold">Everyday Delights</h2>
            <p className="text-[11px] text-[#717973]">Freshly prepared everyday</p>
          </div>
          <span className="text-xs text-[#717973]">Fresh Today</span>
        </div>

        <div className="flex flex-col gap-3">
          {everydayDishes.map((dish) => (
            <div
              key={dish.id}
              onClick={() => navigateTo('food-details', { dishId: dish.id })}
              className="p-3 bg-white rounded-2xl shadow-sm border border-[#efeeea] flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#efeeea]">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-display text-sm font-bold text-[#1b1c1a] truncate">
                    {dish.name}
                  </h4>
                  <span className="font-serif-display text-sm text-[#013623] font-bold shrink-0 ml-1">
                    S${dish.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-[#717973] mt-0.5 line-clamp-1">
                  {dish.description}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-[#7d5800] font-semibold">
                    {dish.portionOptions[0]?.name.split('(')[0] || '1 Set'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(dish, dish.portionOptions[0], [], 1);
                    }}
                    className="px-3 py-1 rounded-lg bg-[#f4f4f0] text-[#013623] hover:bg-[#013623] hover:text-white text-xs font-bold transition-colors"
                  >
                    + Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Friday Infaq Highlight Section */}
      <section className="px-5 py-3 max-w-md mx-auto w-full">
        <div className="p-5 rounded-3xl bg-[#1e4d38] text-white shadow-xl relative overflow-hidden">
          {/* Ambient Decorative Moon Glow */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-[#ffc969]/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7d5800] text-white text-xs font-bold shadow-sm">
                <span className="material-symbols-outlined text-[15px]">volunteer_activism</span>
                Infaq Jumaat
              </span>
              <span className="material-symbols-outlined text-[#ffc969] text-[24px]">nightlight</span>
            </div>

            <div>
              <h3 className="font-serif-display text-xl font-bold text-white leading-tight">
                Share the Blessings this Friday
              </h3>
              <p className="text-xs text-[#8cbda2] mt-1 leading-snug">
                Care, Share &amp; Earn Saham Akhirat with heartfelt hot meals delivered directly to mosque congregants.
              </p>
            </div>

            {/* Mosque Spotlight Progress Box */}
            <div className="p-3 rounded-2xl bg-[#013623]/70 backdrop-blur-md flex flex-col gap-2 border border-white/10">
              <div className="flex items-start justify-between text-xs">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="material-symbols-outlined text-[#ffc969] text-[18px]">mosque</span>
                  <span className="text-xs font-bold text-white truncate">
                    {featuredCampaign.name} (Yishun)
                  </span>
                </div>
                <span className="text-xs text-[#ffc969] font-bold shrink-0">
                  {featuredCampaign.currentSponsoredMeals}/{featuredCampaign.targetMeals} Meals
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-[#ffc969] rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round(
                      (featuredCampaign.currentSponsoredMeals / featuredCampaign.targetMeals) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-[#8cbda2] text-right">
                {Math.round((featuredCampaign.currentSponsoredMeals / featuredCampaign.targetMeals) * 100)}%
                Goal reached for this Friday prayers
              </p>
            </div>

            {/* Quick Package Selection Chips */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-[#8cbda2] uppercase font-semibold tracking-wider">
                Select Infaq Package
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('infaq')}
                  className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:bg-[#ffc969] text-center transition-colors"
                >
                  <div className="font-bold text-xs text-white">3 Boxes</div>
                  <div className="text-[10px] text-[#ffc969] font-semibold">S$30</div>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('infaq')}
                  className="py-2 px-1 rounded-xl bg-[#ffc969] text-[#775300] text-center shadow-md"
                >
                  <div className="font-bold text-xs">5 Boxes</div>
                  <div className="text-[10px] font-bold">S$50</div>
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('infaq')}
                  className="py-2 px-1 rounded-xl bg-white/10 hover:bg-white/20 active:bg-[#ffc969] text-center transition-colors"
                >
                  <div className="font-bold text-xs text-white">7 Boxes</div>
                  <div className="text-[10px] text-[#ffc969] font-semibold">S$70</div>
                </button>
              </div>
            </div>

            {/* Dua Text */}
            <p className="text-xs italic text-center text-[#8cbda2] pt-1">
              “May Allah accept your barakah and multiply your rizq.”
            </p>

            {/* Primary Infaq CTA */}
            <button
              type="button"
              onClick={() => navigateTo('infaq')}
              className="w-full h-12 rounded-2xl bg-[#ffc969] hover:bg-[#ffdea9] text-[#271900] font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-lg"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
              <span>Pledge Meals Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-5 py-3 max-w-md mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-serif-display text-lg text-[#013623] font-bold">
              Made with Love, Loved by You
            </h2>
            <p className="text-[11px] text-[#717973]">Heartfelt community experiences</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#f4f4f0] text-[#414943] text-[10px] font-bold border border-[#efeeea]">
            Sample Feedback
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#ffdea9] flex items-center justify-center font-bold text-[#271900] text-sm">
                SN
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1b1c1a]">Siti Nurhaliza M.</h4>
                <p className="text-[10px] text-[#717973]">Verified Tampines Buyer</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-[#7d5800]">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              ))}
            </div>
          </div>
          <p className="text-xs text-[#414943] leading-relaxed italic">
            “The Yemeni Lamb Shank was so tender it melted in our mouths, and the basmati rice was packed with authentic spice fragrance. Pledging Friday Infaq through the app brought so much ease and barakah to our family kenduri!”
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-[#013623] font-semibold">
            <span className="material-symbols-outlined text-[15px] text-[#7d5800]">verified</span>
            <span>Ordered: Yemeni Lamb Shank + 5x Infaq Jumaat</span>
          </div>
        </div>
      </section>

      {/* Islamic Micro Blessing Footer Note */}
      <section className="px-5 pt-3 text-center max-w-md mx-auto w-full">
        <p className="text-[10px] text-[#717973] uppercase tracking-wider font-semibold">
          HALAL CERTIFIED HOME-COOK KITCHEN • BISMILLAH &amp; PREPARED FRESH DAILY
        </p>
      </section>

      {/* Floating Checkout Bar if cart has items */}
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
                    <span className="text-[#ffdea9]">• Pasir Ris Kitchen</span>
                  </span>
                  <span className="text-[11px] text-white/80">
                    S${cartGrandTotal.toFixed(2)} Total
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('checkout');
                }}
                className="px-3.5 py-2 rounded-xl bg-[#ffc969] text-[#775300] font-bold text-xs flex items-center gap-1 shadow-md hover:bg-[#ffdea9] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]">lock</span>
                <span>Checkout</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
