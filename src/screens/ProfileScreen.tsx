import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND } from '../data/mockData';

export const ProfileScreen: React.FC = () => {
  const {
    currentUser,
    signOut,
    navigateTo,
    updateProfile,
    activeOrder,
    infaqPledges,
    favoriteDishIds,
    dishes,
    showToast,
  } = useApp();

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showInfaqHistoryModal, setShowInfaqHistoryModal] = useState(false);
  const [showFavModal, setShowFavModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState(currentUser.name);
  const [editEmail, setEditEmail] = useState(currentUser.email);
  const [editPhone, setEditPhone] = useState(currentUser.phone);
  const [editAddress, setEditAddress] = useState(currentUser.address);

  // Preference toggle
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
    });
    setShowEditModal(false);
  };

  const favoriteDishes = dishes.filter((d) => favoriteDishIds.includes(d.id));

  return (
    <div className="flex flex-col w-full pb-36 pt-16 bg-[#faf9f5]">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 max-w-md mx-auto w-full flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif-display text-2xl font-bold text-[#013623] tracking-tight">
              My Profile
            </h1>
            <span className="bg-[#ffdea9] text-[#271900] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
              <span
                className="material-symbols-outlined text-[12px] text-[#7d5800]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
              Community Member
            </span>
          </div>
          <p className="text-xs text-[#414943] mt-0.5">
            Welcome, {currentUser.name.split(' ')[0]}! Manage your preferences and orders.
          </p>
        </div>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Customer Profile Master Card */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#efeeea] relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#ffdea9]/30 blur-2xl pointer-events-none" />

          <div className="relative flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              {/* Avatar with Ring */}
              <div className="relative shrink-0">
                <div className="w-18 h-18 p-1 rounded-full bg-gradient-to-tr from-[#ffc969] via-[#7d5800] to-[#bbeed1] shadow-sm">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full object-cover bg-[#f4f4f0]"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#013623] text-[#ffdea9] w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                  <span
                    className="material-symbols-outlined text-[14px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    stars
                  </span>
                </div>
              </div>

              {/* Name & Contact */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h2 className="font-serif-display text-base font-bold text-[#013623] truncate">
                    {currentUser.name}
                  </h2>
                  <span className="bg-[#f4f4f0] text-[#717973] text-[9px] px-1.5 py-0.2 rounded font-medium">
                    Demo
                  </span>
                </div>
                <p className="text-xs text-[#717973] mt-0.5 truncate">{currentUser.email}</p>

                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center gap-1 bg-[#f4f4f0] px-2 py-0.5 rounded-full border border-[#efeeea]">
                    <span className="material-symbols-outlined text-[13px] text-[#013623]">chat</span>
                    <span className="text-[11px] font-semibold text-[#1b1c1a]">
                      {currentUser.phone}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#7d5800] uppercase font-bold bg-[#ffdea9] px-1.5 py-0.5 rounded">
                    WhatsApp
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="flex-1 py-2.5 px-3 bg-[#f4f4f0] hover:bg-[#efeeea] text-[#013623] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 active:scale-98 transition-all border border-[#efeeea]"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                <span>Edit Profile</span>
              </button>
              <button
                type="button"
                aria-label="Member QR"
                onClick={() => showToast(`Member QR code for ${currentUser.name} is active.`)}
                className="py-2.5 px-3 bg-[#f4f4f0] hover:bg-[#efeeea] text-[#414943] rounded-xl flex items-center justify-center active:scale-95 border border-[#efeeea]"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-2 bg-[#f4f4f0] rounded-2xl p-3 border border-[#efeeea]">
              <div
                className="flex flex-col items-center text-center cursor-pointer"
                onClick={() => navigateTo('orders')}
              >
                <span className="text-[10px] text-[#717973] uppercase font-semibold">Orders</span>
                <span className="font-serif-display text-base font-bold text-[#013623] mt-0.5">
                  {currentUser.totalOrders}
                </span>
                <span className="text-[9px] text-[#717973]">Completed</span>
              </div>

              <div
                className="flex flex-col items-center text-center relative cursor-pointer"
                onClick={() => setShowInfaqHistoryModal(true)}
              >
                <div className="absolute -top-1 right-2">
                  <span
                    className="material-symbols-outlined text-[12px] text-[#7d5800]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    favorite
                  </span>
                </div>
                <span className="text-[10px] text-[#7d5800] uppercase font-bold">Infaq</span>
                <span className="font-serif-display text-base font-bold text-[#7d5800] mt-0.5">
                  {currentUser.totalInfaqMeals}
                </span>
                <span className="text-[9px] text-[#775300] bg-[#ffc969] px-1.5 rounded-full font-bold">
                  Friday Meals
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] text-[#717973] uppercase font-semibold">Membership</span>
                <span className="text-xs font-bold text-[#013623] mt-0.5 truncate">
                  {currentUser.memberTier}
                </span>
                <span className="text-[9px] text-[#013623] font-semibold flex items-center gap-0.5">
                  <span
                    className="material-symbols-outlined text-[11px] text-[#7d5800]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    shield
                  </span>
                  Level {currentUser.memberLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Ongoing Batch Tracker Pill */}
        {activeOrder && (
          <div
            onClick={() => navigateTo('orders', { orderId: activeOrder.id })}
            className="bg-[#1e4d38] text-white rounded-2xl p-3.5 shadow-sm flex items-center justify-between gap-3 cursor-pointer hover:bg-[#013623] transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-[#013623] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[#ffdea9] text-[20px]">skillet</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-[#ffc969] text-[#775300] px-2 py-0.2 rounded-full font-bold">
                    Simmering in Kitchen
                  </span>
                  <span className="text-[10px] opacity-80">Batch #{activeOrder.orderNumber}</span>
                </div>
                <p className="text-xs font-semibold truncate text-white mt-0.5">
                  {activeOrder.items[0]?.dishName} • {activeOrder.dispatchDate}
                </p>
              </div>
            </div>
            <span className="shrink-0 bg-white text-[#013623] px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-0.5">
              Track <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            </span>
          </div>
        )}

        {/* Group 1: Account & Activity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#013623] tracking-tight uppercase">
              Account &amp; Activity
            </span>
            <span className="text-[10px] text-[#7d5800] uppercase font-bold">Core</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#efeeea]">
            {/* Personal Information */}
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Personal Information</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    {currentUser.name}, {currentUser.phone}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Saved Delivery Address */}
            <button
              type="button"
              onClick={() => setShowAddressModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Saved Delivery Addresses</p>
                  <p className="text-[11px] text-[#717973] truncate">{currentUser.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] bg-[#f4f4f0] px-2 py-0.5 rounded-full text-[#1b1c1a] font-medium">
                  Home
                </span>
                <span className="material-symbols-outlined text-[#717973] text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* My Orders & Receipts */}
            <button
              type="button"
              onClick={() => navigateTo('orders')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">My Orders &amp; Receipts</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    Check batch status &amp; reorder favorite dishes
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#7d5800]" />
                <span className="material-symbols-outlined text-[#717973] text-[18px]">
                  chevron_right
                </span>
              </div>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Friday Infaq Pledges */}
            <button
              type="button"
              onClick={() => setShowInfaqHistoryModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#ffdea9]/50 flex items-center justify-center text-[#7d5800] shrink-0">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    volunteer_activism
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#1b1c1a]">Friday Infaq Pledges</p>
                    <span className="text-[9px] bg-[#ffc969] text-[#775300] px-1.5 rounded font-bold">
                      Barakah
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717973] truncate">
                    {currentUser.totalInfaqMeals} meals distributed to Masjid Darul Makmur &amp; Salleh
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Payment Methods */}
            <button
              type="button"
              onClick={() => showToast('PayNow UEN is connected and verified.')}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    account_balance_wallet
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Payment Methods</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    PayNow Connected • DBS PayLah! (+65 •••• 4567)
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Group 2: Preferences & Tastes */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#013623] tracking-tight uppercase">
              Preferences &amp; Taste
            </span>
            <span className="text-[10px] text-[#717973]">Personalization</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#efeeea]">
            {/* Notifications Toggle */}
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">
                    notifications_active
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Push Notifications</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    Kitchen batch cooking updates &amp; Thursday Infaq reminders
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-2">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={(e) => {
                    setNotificationsEnabled(e.target.checked);
                    showToast(
                      e.target.checked ? 'Kitchen notifications enabled' : 'Notifications paused'
                    );
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#e3e2df] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#013623]" />
              </label>
            </div>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Favorite Dishes */}
            <button
              type="button"
              onClick={() => setShowFavModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Favorite Dishes</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    {favoriteDishes.map((d) => d.name).join(', ') || 'No saved dishes'}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Dietary Preferences */}
            <div className="px-4 py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">nutrition</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#1b1c1a]">Dietary &amp; Allergen Preferences</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[9px] bg-[#bbeed1] text-[#002113] px-2 py-0.5 rounded-full font-semibold">
                    100% Halal Certified
                  </span>
                  <span className="text-[9px] bg-[#f4f4f0] text-[#414943] px-2 py-0.5 rounded-full font-semibold border border-[#efeeea]">
                    Mild Spice
                  </span>
                  <span className="text-[9px] bg-[#f4f4f0] text-[#414943] px-2 py-0.5 rounded-full font-semibold border border-[#efeeea]">
                    No Coriander
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Group 3: Support & Kitchen Story */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#013623] tracking-tight uppercase">
              Support &amp; Kitchen Story
            </span>
            <span className="text-[10px] text-[#717973]">Help Desk</span>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#efeeea]">
            {/* WhatsApp Concierge */}
            <a
              href={`https://wa.me/${BRAND.whatsappRaw}?text=Salam%20NyiMas%20MumPreneur,%20I%20would%20like%20to%20inquire%20about%20ordering.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#ffdea9]/40 flex items-center justify-center text-[#7d5800] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">support_agent</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#1b1c1a]">WhatsApp Kitchen Support</p>
                    <span className="text-[9px] bg-[#013623] text-white px-1.5 rounded font-bold">
                      Fast Response
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717973] truncate">
                    {BRAND.whatsappNumber} • Catering inquiries &amp; special orders
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#7d5800] text-[18px] shrink-0">
                open_in_new
              </span>
            </a>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* FAQ */}
            <button
              type="button"
              onClick={() => setShowFaqModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">quiz</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Frequently Asked Questions (FAQ)</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    24-hour advance ordering &amp; thermal delivery
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* About NyiMas Story */}
            <button
              type="button"
              onClick={() => setShowStoryModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">menu_book</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">About NyiMas MumPreneur &amp; Story</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    From Pasir Ris maternal kitchen to Friday barakah
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>

            <div className="h-[1px] bg-[#efeeea] ml-15" />

            {/* Terms & Privacy */}
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#f4f4f0] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#f4f4f0] flex items-center justify-center text-[#013623] shrink-0">
                  <span className="material-symbols-outlined text-[18px]">gavel</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#1b1c1a]">Terms &amp; Privacy Policy</p>
                  <p className="text-[11px] text-[#717973] truncate">
                    PDPA personal data protection &amp; Halal assurance
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#717973] text-[18px]">
                chevron_right
              </span>
            </button>
          </div>
        </div>

        {/* Kitchen Operational Credentials */}
        <div className="bg-[#f4f4f0] rounded-2xl p-4 space-y-2.5 border border-[#efeeea]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#013623] text-[18px]">cottage</span>
            <h3 className="font-serif-display text-xs font-bold text-[#013623]">
              NyiMas MumPreneur Studio
            </h3>
          </div>
          <p className="text-[11px] text-[#414943] leading-relaxed">
            Maternal heritage recipes with 100% Halal Muslim-Owned status. Prepared with heartfelt care and premium traditional spices for Singapore families.
          </p>
          <div className="flex flex-col gap-1.5 pt-1 text-[11px] text-[#414943]">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#7d5800] text-[16px] shrink-0 mt-0.5">
                schedule
              </span>
              <span>Tuesday – Sunday: 9:00 AM – 7:30 PM (Closed on Mondays)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#7d5800] text-[16px] shrink-0 mt-0.5">
                local_shipping
              </span>
              <span>S$18 Flat Rate Islandwide • Thermal insulated bags delivered warm</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-[#7d5800] text-[16px] shrink-0 mt-0.5">
                pin_drop
              </span>
              <span>{BRAND.kitchenAddress}</span>
            </div>
          </div>
        </div>

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Are you sure you want to sign out of your account?')) {
              signOut();
            }
          }}
          className="w-full py-3.5 px-4 bg-[#ffdad6] hover:bg-[#ffdad6]/80 text-[#93000a] font-bold text-xs rounded-2xl flex items-center justify-center gap-2 active:scale-98 transition-transform shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out of Account</span>
        </button>

        {/* Footer */}
        <div className="text-center pt-2 space-y-1">
          <p className="text-[10px] text-[#717973]">
            NyiMas MumPreneur SG • Version 2.4.1 (Build 412)
          </p>
          <p className="text-[10px] text-[#7d5800] italic">
            &quot;Cooked with Maternal Love. Delicious. Halal Certified.&quot;
          </p>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowEditModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-3 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-[#717973] uppercase">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#f4f4f0] text-xs p-2.5 rounded-xl outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717973] uppercase">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#f4f4f0] text-xs p-2.5 rounded-xl outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717973] uppercase">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#f4f4f0] text-xs p-2.5 rounded-xl outline-none mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#717973] uppercase">Delivery Address</label>
                <textarea
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-[#f4f4f0] text-xs p-2.5 rounded-xl outline-none mt-1 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold active:scale-98"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Saved Addresses Modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                Saved Addresses
              </h3>
              <button
                type="button"
                onClick={() => setShowAddressModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 py-3">
              <div className="p-3 rounded-2xl bg-[#f4f4f0] border border-[#013623] flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[#013623] text-[20px] shrink-0 mt-0.5">
                  home
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1b1c1a]">Home (Default)</span>
                    <span className="text-[9px] bg-[#013623] text-white px-1.5 py-0.2 rounded font-bold">
                      Default
                    </span>
                  </div>
                  <p className="text-xs text-[#414943] mt-1">{currentUser.address}</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-[#efeeea] flex items-start gap-2.5 opacity-80">
                <span className="material-symbols-outlined text-[#717973] text-[20px] shrink-0 mt-0.5">
                  work
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold text-[#1b1c1a]">Office</span>
                  <p className="text-xs text-[#717973] mt-0.5">
                    1 Marina Boulevard #14-01, One Marina Boulevard, SG 018989
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAddressModal(false);
                setShowEditModal(true);
              }}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Change Default Address
            </button>
          </div>
        </div>
      )}

      {/* Infaq History Modal */}
      {showInfaqHistoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowInfaqHistoryModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <div>
                <span className="text-[10px] text-[#7d5800] uppercase font-bold">Perpetual Charity</span>
                <h3 className="font-serif-display text-base font-bold text-[#013623]">
                  Friday Infaq History
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowInfaqHistoryModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 py-3">
              {infaqPledges.map((p) => (
                <div key={p.id} className="p-3 bg-[#f4f4f0] rounded-2xl border border-[#efeeea] flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-[#1b1c1a]">{p.refCode}</span>
                    <span className="text-[10px] bg-[#bbeed1] text-[#002113] px-2 py-0.2 rounded-full font-bold">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-[#414943]">
                    <span>{p.mosqueName}</span>
                    <span className="font-bold text-[#013623]">
                      {p.mealsCount} Meals (S${p.totalAmount.toFixed(2)})
                    </span>
                  </div>
                  <p className="text-[10px] text-[#717973]">{p.date}</p>
                  {p.doaDedication && (
                    <p className="text-[11px] text-[#414943] italic bg-white p-2 rounded-xl mt-1">
                      “{p.doaDedication}”
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowInfaqHistoryModal(false);
                navigateTo('infaq');
              }}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Pledge New Friday Infaq
            </button>
          </div>
        </div>
      )}

      {/* Favorite Dishes Modal */}
      {showFavModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowFavModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                Favorite Dishes
              </h3>
              <button
                type="button"
                onClick={() => setShowFavModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5 py-3">
              {favoriteDishes.length === 0 ? (
                <p className="text-xs text-[#717973] text-center py-4">
                  No favorite dishes saved yet. Tap the heart icon on any dish!
                </p>
              ) : (
                favoriteDishes.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setShowFavModal(false);
                      navigateTo('food-details', { dishId: d.id });
                    }}
                    className="p-2.5 rounded-xl bg-[#f4f4f0] border border-[#efeeea] flex items-center gap-3 cursor-pointer hover:bg-white"
                  >
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#1b1c1a] truncate">{d.name}</p>
                      <p className="text-[10px] text-[#717973]">S${d.price.toFixed(2)}</p>
                    </div>
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">
                      favorite
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowFavModal(false);
                navigateTo('menu');
              }}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Explore Full Menu
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowFaqModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                Frequently Asked Questions (FAQ)
              </h3>
              <button
                type="button"
                onClick={() => setShowFaqModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#414943] space-y-3 py-3 leading-relaxed">
              <div>
                <p className="font-bold text-[#013623]">How are orders prepared?</p>
                <p className="mt-0.5 text-[#717973]">
                  All dishes are cooked fresh 45 minutes before dispatch using temperature-controlled delivery vans so basmati grains stay fluffy and fragrant.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#013623]">How much is islandwide delivery?</p>
                <p className="mt-0.5 text-[#717973]">
                  A flat rate of S$18 applies across Singapore (excluding Sentosa). Self-collection is free at Pasir Ris Kitchen Studio.
                </p>
              </div>

              <div>
                <p className="font-bold text-[#013623]">How is Friday Infaq distributed?</p>
                <p className="mt-0.5 text-[#717973]">
                  Infaq meals are delivered directly to the welfare bureaus of partner mosques before Friday prayers. Photo and video confirmation are sent to your WhatsApp.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowFaqModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* Story Modal */}
      {showStoryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowStoryModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                About NyiMas &amp; Mission
              </h3>
              <button
                type="button"
                onClick={() => setShowStoryModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#414943] space-y-3 py-3 leading-relaxed">
              <p>
                <strong>NyiMas MumPreneur</strong> was founded on a mother&apos;s passion in Pasir Ris to share handcrafted Middle Eastern and Nusantara spice heritage with families across Singapore.
              </p>
              <p>
                Starting from family kenduri celebrations, signature recipes like <em>Lebanese Lamb Chops</em> and <em>Yemeni Mandi</em> garnered widespread praise.
              </p>
              <p>
                Through the <strong>Infaq Jumaat</strong> initiative, a portion of every week&apos;s kitchen blessings is shared with mosque congregants and underprivileged families.
              </p>
              <div className="p-3 bg-[#f4f4f0] rounded-xl text-center italic text-[#013623]">
                “Every bite crafted with love and blessings.”
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowStoryModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <h3 className="font-serif-display text-base font-bold text-[#013623]">
                Terms &amp; Privacy Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="text-xs text-[#414943] space-y-2.5 py-3 leading-relaxed">
              <p>
                <strong>Halal Status:</strong> 100% Muslim-Owned home business. All ingredients are certified Halal by MUIS or reputable Halal agencies.
              </p>
              <p>
                <strong>Payment:</strong> Verified instantly via PayNow / PayLah! QR code transfer with zero hidden transaction fees.
              </p>
              <p>
                <strong>Data Privacy (PDPA):</strong> Customer information is kept confidential and never shared with third parties, except for fulfillment delivery.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
