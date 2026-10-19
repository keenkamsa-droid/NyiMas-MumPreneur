import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND } from '../data/mockData';

interface HeaderProps {
  showBack?: boolean;
  titleOverride?: string;
  subtitleOverride?: string;
}

export const Header: React.FC<HeaderProps> = ({
  showBack,
  titleOverride,
  subtitleOverride,
}) => {
  const {
    currentScreen,
    goBack,
    navigateTo,
    cartCount,
    currentUser,
    orders,
    showToast,
  } = useApp();

  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // If on dedicated screen with its own custom header, do not render global header
  const screensWithCustomHeader = [
    'welcome',
    'create-account',
    'food-details',
    'cart',
    'checkout',
    'order-confirmation',
    'infaq-confirmation',
  ];

  if (screensWithCustomHeader.includes(currentScreen)) {
    return null;
  }

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Preparing in Kitchen' || o.status === 'Pending Confirmation'
  ).length;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#faf9f5]/90 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(30,77,56,0.04)]">
        <div className="h-16 max-w-md mx-auto px-4 flex items-center justify-between gap-2">
          {/* Left: Brand Identity or Back Button */}
          <div className="flex items-center gap-2 min-w-0">
            {showBack ? (
              <button
                type="button"
                onClick={goBack}
                aria-label="Go back"
                className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center text-[#1b1c1a] hover:bg-[#efeeea] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
            ) : null}

            {titleOverride ? (
              <div className="flex flex-col min-w-0">
                <h1 className="font-serif-display text-lg font-bold text-[#013623] truncate leading-tight">
                  {titleOverride}
                </h1>
                {subtitleOverride && (
                  <span className="text-[11px] text-[#7d5800] uppercase tracking-wider font-semibold truncate">
                    {subtitleOverride}
                  </span>
                )}
              </div>
            ) : (
              <div
                className="flex items-center gap-2 cursor-pointer min-w-0"
                onClick={() => navigateTo('home')}
              >
                <img
                  src={BRAND.logoUrl}
                  alt="NyiMas MumPreneur Logo"
                  className="h-8 w-auto object-contain shrink-0"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#7d5800] tracking-wider uppercase font-bold truncate">
                    MumPreneur Halal
                  </span>
                  <div className="flex items-center gap-1 bg-[#f4f4f0] px-2 py-0.5 rounded-full">
                    <span className="text-[11px] leading-tight">🇸🇬</span>
                    <span className="text-[11px] text-[#414943] font-medium truncate">
                      SG • Delivery &amp; Pickup
                    </span>
                    <span className="material-symbols-outlined text-[13px] text-[#717973]">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Notifications, Cart Badge, Profile Avatar */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Notification Bell */}
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setShowNotificationModal(true)}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#414943] hover:text-[#013623] active:scale-95 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {activeOrdersCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#faf9f5]" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              type="button"
              aria-label="Shopping Cart"
              onClick={() => navigateTo('cart')}
              className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#414943] hover:text-[#013623] active:scale-95 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1 min-w-[17px] h-4 px-1 rounded-full bg-[#013623] text-white text-[10px] flex items-center justify-center font-bold shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <button
              type="button"
              aria-label="View Profile"
              onClick={() => navigateTo('profile')}
              className="p-0.5 rounded-full ring-1 ring-[#f2be5f]/50 hover:ring-[#7d5800] active:scale-95 transition-all ml-0.5"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer / Modal */}
      {showNotificationModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowNotificationModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#013623]">notifications</span>
                <h3 className="font-serif-display text-lg font-bold text-[#013623]">
                  Kitchen Notifications
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#414943]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 py-3 max-h-80 overflow-y-auto">
              {activeOrdersCount > 0 && (
                <div
                  className="p-3 bg-[#1e4d38]/10 rounded-xl cursor-pointer hover:bg-[#1e4d38]/15 transition-colors"
                  onClick={() => {
                    setShowNotificationModal(false);
                    navigateTo('orders');
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#013623]">
                    <span className="w-2 h-2 rounded-full bg-[#7d5800] animate-pulse"></span>
                    Order #NYM-8821 in Preparation
                  </div>
                  <p className="text-xs text-[#414943] mt-1 leading-snug">
                    Chef MumPreneur is freshly preparing your spiced basmati pilaf for Friday delivery.
                  </p>
                </div>
              )}

              <div
                className="p-3 bg-[#f4f4f0] rounded-xl cursor-pointer hover:bg-[#efeeea] transition-colors"
                onClick={() => {
                  setShowNotificationModal(false);
                  navigateTo('infaq');
                }}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-[#7d5800]">
                  <span className="material-symbols-outlined text-[16px]">volunteer_activism</span>
                  This Week&apos;s Friday Mosque Infaq Campaign
                </div>
                <p className="text-xs text-[#414943] mt-1 leading-snug">
                  Masjid Darul Makmur has reached 71% of its meal goal. Sponsor hot meals for congregants today!
                </p>
              </div>

              <div className="p-3 bg-[#f4f4f0] rounded-xl">
                <div className="text-xs font-bold text-[#013623]">
                  🎉 Welcome Discount Code: BARAKAHFIRST
                </div>
                <p className="text-xs text-[#414943] mt-1 leading-snug">
                  Enjoy S$3.50 OFF your artisanal meal order! Applied automatically at checkout.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowNotificationModal(false);
                showToast('All notifications marked as read.');
              }}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white font-semibold text-xs active:scale-98 transition-transform cursor-pointer"
            >
              Close &amp; Mark as Read
            </button>
          </div>
        </div>
      )}
    </>
  );
};
