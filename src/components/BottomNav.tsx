import React from 'react';
import { useApp } from '../context/AppContext';
import { ScreenView } from '../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, activeOrder, cartCount } = useApp();

  // Show bottom navigation on primary screens
  const primaryTabScreens: ScreenView[] = [
    'home',
    'menu',
    'cart',
    'infaq',
    'orders',
    'profile',
  ];

  if (!primaryTabScreens.includes(currentScreen)) {
    return null;
  }

  interface TabItem {
    id: ScreenView;
    label: string;
    icon: string;
    badgeCount?: number;
    hasBarakahBadge?: boolean;
    hasIndicatorDot?: boolean;
  }

  const tabs: TabItem[] = [
    { id: 'home', label: 'Home', icon: 'storefront' },
    { id: 'menu', label: 'Menu', icon: 'restaurant_menu' },
    { id: 'cart', label: 'Cart', icon: 'shopping_bag', badgeCount: cartCount },
    { id: 'infaq', label: 'Infaq', icon: 'volunteer_activism', hasBarakahBadge: true },
    { id: 'orders', label: 'Orders', icon: 'receipt_long', hasIndicatorDot: !!activeOrder },
    { id: 'profile', label: 'Profile', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe pointer-events-none">
      <div className="mx-auto max-w-md px-3 pb-3 pointer-events-auto">
        <div className="bg-[#faf9f5]/95 backdrop-blur-2xl rounded-full px-1.5 py-1.5 shadow-[0_8px_30px_rgba(30,77,56,0.12)] border border-[#efeeea] flex items-center justify-around">
          {tabs.map((tab) => {
            const isActive =
              currentScreen === tab.id ||
              (tab.id === 'menu' && currentScreen === 'food-details') ||
              (tab.id === 'cart' && currentScreen === 'checkout') ||
              (tab.id === 'orders' && currentScreen === 'order-confirmation') ||
              (tab.id === 'infaq' && currentScreen === 'infaq-confirmation');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => navigateTo(tab.id)}
                className={`relative flex flex-col items-center justify-center py-1 px-1.5 min-w-[50px] transition-all group ${
                  isActive
                    ? 'text-[#013623] font-bold scale-105'
                    : 'text-[#414943] hover:text-[#013623]'
                }`}
              >
                {/* Barakah Floating Badge for Infaq */}
                {tab.hasBarakahBadge && (
                  <span className="absolute -top-2 bg-[#ffc969] text-[#775300] text-[8px] px-1.5 py-0.2 rounded-full font-bold shadow-[0_0_8px_rgba(212,163,71,0.4)] animate-bounce">
                    Blessing
                  </span>
                )}

                {/* Cart Quantity Badge */}
                {tab.badgeCount !== undefined && tab.badgeCount > 0 && (
                  <span className="absolute -top-1.5 right-2 min-w-[17px] h-4 px-1 rounded-full bg-[#013623] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                    {tab.badgeCount}
                  </span>
                )}

                {/* Active Order Ping Dot */}
                {tab.hasIndicatorDot && !isActive && (
                  <span className="absolute top-0.5 right-3 w-2 h-2 rounded-full bg-[#7d5800] ring-1 ring-white animate-pulse" />
                )}

                <span
                  className={`material-symbols-outlined text-[21px] transition-transform group-hover:scale-110 ${
                    tab.id === 'infaq' && !isActive ? 'text-[#7d5800]' : ''
                  }`}
                  style={
                    isActive && (tab.id === 'infaq' || tab.id === 'cart')
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {tab.icon}
                </span>

                <span
                  className={`text-[10px] tracking-tight mt-0.5 font-medium ${
                    isActive ? 'text-[#013623] font-bold' : tab.id === 'infaq' ? 'text-[#7d5800]' : ''
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
