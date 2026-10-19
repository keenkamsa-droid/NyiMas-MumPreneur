import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MOSQUE_CAMPAIGNS, INFAQ_PACKAGES } from '../data/mockData';
import confetti from 'canvas-confetti';

export const InfaqScreen: React.FC = () => {
  const { currentUser, submitInfaqPledge, navigateTo, showToast } = useApp();

  const [selectedMosque, setSelectedMosque] = useState(MOSQUE_CAMPAIGNS[0]);
  const [selectedPackage, setSelectedPackage] = useState(INFAQ_PACKAGES[1]); // 5 meals S$50 default
  const [isCustom, setIsCustom] = useState(false);
  const [customMeals, setCustomMeals] = useState(10);

  const [donorName, setDonorName] = useState(currentUser.name);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorPhone, setDonorPhone] = useState(currentUser.phone.replace('+65 ', ''));
  const [doaDedication, setDoaDedication] = useState(
    'Dedicated in loving memory of parents, and for the health and blessings of our family.'
  );
  const [sendWhatsAppProof, setSendWhatsAppProof] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMeals = isCustom ? customMeals : selectedPackage.mealsCount;
  const currentCost = isCustom ? customMeals * 10 : selectedPackage.price;

  const handleSelectPackage = (pkg: typeof INFAQ_PACKAGES[0]) => {
    setIsCustom(false);
    setSelectedPackage(pkg);
  };

  const toggleAnonymous = () => {
    setIsAnonymous(!isAnonymous);
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#013623', '#d4a347', '#ffc969', '#bbeed1'],
        });
      } catch (err) {
        console.error(err);
      }

      const pledge = submitInfaqPledge({
        mosqueName: selectedMosque.name,
        mealsCount: currentMeals,
        totalAmount: currentCost,
        donorName: isAnonymous ? 'Anonymous Donor' : donorName,
        isAnonymous,
        donorPhone: `+65 ${donorPhone}`,
        doaDedication: doaDedication.trim() || undefined,
        sendWhatsAppProof,
      });

      setIsSubmitting(false);
      showToast('Barakah Pledged! Alhamdulillah. May Allah accept your infaq.');
      navigateTo('infaq-confirmation');
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full pb-36 pt-16 bg-[#faf9f5]">
      {/* Visual Header Hero Banner */}
      <section className="relative overflow-hidden bg-[#013623] px-5 py-6 shadow-md text-white">
        <div className="relative z-10 flex flex-col gap-2 max-w-md mx-auto">
          {/* Sacred Tag / Barakah Seal */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-[#1e4d38]/80 px-2.5 py-1 rounded-full shadow-sm">
              <span
                className="material-symbols-outlined text-[15px] text-[#ffdea9]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
              <span className="text-[10px] text-[#bbeed1] uppercase tracking-wider font-bold">
                Perpetual Reward (Amal Jariah)
              </span>
            </div>
            <div className="flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
              <span className="material-symbols-outlined text-[13px] text-[#ffdea9]">verified</span>
              <span className="text-[10px] text-[#bbeed1]">Mosque Welfare Partner</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mt-1">
            <h1 className="font-serif-display text-2xl text-white font-bold leading-tight">
              Infaq Jumaat <span className="text-[#ffdea9] font-normal italic">&amp; Barakah</span>
            </h1>
            <p className="text-xs text-[#bbeed1] mt-1 leading-snug">
              Sponsor freshly cooked artisanal halal lunch boxes delivered directly to Singapore mosques before Friday prayers.
            </p>
          </div>

          {/* Prophetic Hadith Quote Box */}
          <div className="mt-2 bg-gradient-to-r from-[#1e4d38]/90 to-[#1e4d38]/60 p-3 rounded-xl border border-white/10">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#ffdea9] text-[20px] shrink-0 mt-0.5">
                format_quote
              </span>
              <div>
                <p className="font-serif-display text-xs italic text-[#ffdea9] leading-snug">
                  “The best charity is that given on Friday.”
                </p>
                <p className="text-[10px] text-[#bbeed1] mt-1">— Sunan Ibn Abi Shaybah</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-[#bbeed1]">
            <span className="material-symbols-outlined text-[16px] text-[#ffc969]">soup_kitchen</span>
            <span>
              Prepared with maternal care by <strong className="text-white">NyiMas MumPreneur</strong> • Distributed with mosque committees
            </span>
          </div>
        </div>
      </section>

      {/* Form & Steps Container */}
      <div className="px-5 py-4 flex flex-col gap-5 max-w-md mx-auto w-full">
        {/* Step 1: Mosque Selector */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7d5800] font-bold">
                Step 1 • Select Mosque
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#1b1c1a]">
                Mosque Recipients This Week
              </h2>
            </div>
            <span className="bg-[#e9e8e4] text-[#414943] text-[10px] font-bold px-2 py-0.5 rounded-full">
              3 Mosques
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {MOSQUE_CAMPAIGNS.map((mosque) => {
              const isSelected = selectedMosque.id === mosque.id;
              if (mosque.isLocked) {
                return (
                  <div
                    key={mosque.id}
                    className="p-3.5 rounded-2xl bg-[#f4f4f0] border border-[#efeeea] opacity-75 flex items-start justify-between gap-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#e3e2df] flex items-center justify-center text-[#717973] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">domain</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif-display text-xs font-bold text-[#1b1c1a]">
                            {mosque.name}
                          </h3>
                          <span className="bg-[#e9e8e4] text-[9px] px-1.5 py-0.2 rounded font-medium text-[#414943]">
                            {mosque.statusText}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#717973] mt-0.5">{mosque.address}</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#717973] text-[18px]">lock</span>
                  </div>
                );
              }

              const percent = Math.round(
                (mosque.currentSponsoredMeals / mosque.targetMeals) * 100
              );

              return (
                <div
                  key={mosque.id}
                  onClick={() => setSelectedMosque(mosque)}
                  className={`cursor-pointer p-4 rounded-2xl bg-white shadow-xs transition-all border ${
                    isSelected
                      ? 'border-[#013623] ring-1 ring-[#013623]'
                      : 'border-[#efeeea] hover:bg-[#f4f4f0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#bbeed1] text-[#002113]' : 'bg-[#f4f4f0] text-[#414943]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[22px]">mosque</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a]">
                            {mosque.name}
                          </h3>
                          {mosque.activeThisWeek && (
                            <span className="bg-[#ffc969] text-[#775300] px-2 py-0.2 rounded-full text-[9px] font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#717973]">{mosque.address}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#013623] text-white' : 'border border-[#efeeea]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[13px]">check</span>
                      )}
                    </div>
                  </div>

                  {/* Menu Pill */}
                  <div className="mt-3 bg-[#f4f4f0] p-2.5 rounded-xl flex items-center gap-2.5 border border-[#efeeea]">
                    <img
                      src={mosque.imageUrl}
                      alt={mosque.menuName}
                      className="w-11 h-11 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] text-[#7d5800] font-bold uppercase tracking-wide">
                        Friday Menu
                      </span>
                      <p className="text-xs font-semibold text-[#1b1c1a] truncate">
                        {mosque.menuName}
                      </p>
                      <p className="text-[10px] text-[#717973] truncate">{mosque.menuDetails}</p>
                    </div>
                  </div>

                  {/* Progress Metrics */}
                  <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#414943]">
                        <strong className="text-[#013623]">{mosque.currentSponsoredMeals}</strong> of{' '}
                        {mosque.targetMeals} meals sponsored
                      </span>
                      <span className="font-bold text-[#7d5800]">{percent}% Goal</span>
                    </div>
                    <div className="w-full h-2 bg-[#efeeea] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#013623] to-[#1e4d38] rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#717973]">
                      <span>Distributing Friday 12:00 PM Jumaat</span>
                      <span className="font-bold text-[#ba1a1a]">
                        {mosque.targetMeals - mosque.currentSponsoredMeals} meals needed
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Step 2: Choose Contribution Package */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#7d5800] font-bold">
                Step 2 • Select Package
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#1b1c1a]">
                Infaq Barakah Packages
              </h2>
            </div>
            <span className="text-xs text-[#013623] font-bold">S$10.00 / Meal Box</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {INFAQ_PACKAGES.map((pkg) => {
              const isSelected = !isCustom && selectedPackage.id === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => handleSelectPackage(pkg)}
                  className={`cursor-pointer bg-white p-3.5 rounded-2xl shadow-xs transition-all flex items-center justify-between border relative ${
                    isSelected
                      ? 'border-[#013623] ring-1 ring-[#013623]'
                      : 'border-[#efeeea] hover:bg-[#f4f4f0]'
                  }`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2.5 left-5 bg-[#7d5800] text-white px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <span
                        className="material-symbols-outlined text-[10px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      Most Loved Package
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-serif-display font-bold text-sm ${
                        isSelected ? 'bg-[#ffdea9] text-[#271900]' : 'bg-[#f4f4f0] text-[#013623]'
                      }`}
                    >
                      {pkg.mealsCount}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1b1c1a]">{pkg.title}</h4>
                      <p className="text-[11px] text-[#717973]">{pkg.description}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-serif-display text-sm font-bold text-[#013623]">
                      S${pkg.price.toFixed(2)}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full ml-auto mt-1 flex items-center justify-center ${
                        isSelected ? 'bg-[#013623] text-white' : 'border border-[#efeeea]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-[11px]">check</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Custom Quantity Option */}
            <div
              className={`p-3.5 rounded-2xl bg-[#f4f4f0] border flex flex-col gap-2 transition-all ${
                isCustom ? 'border-[#013623] ring-1 ring-[#013623]' : 'border-[#efeeea]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#7d5800]">tune</span>
                  <span className="text-xs font-bold text-[#1b1c1a]">
                    Custom Quantity / Special Dedication
                  </span>
                </div>
                <span className="text-[10px] text-[#717973]">S$10 each</span>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center bg-white rounded-xl shadow-xs p-1 border border-[#efeeea]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustom(true);
                      setCustomMeals((m) => Math.max(1, m - 1));
                    }}
                    className="w-8 h-8 rounded-lg bg-[#f4f4f0] hover:bg-[#efeeea] flex items-center justify-center text-[#1b1c1a]"
                  >
                    <span className="material-symbols-outlined text-[16px]">remove</span>
                  </button>
                  <input
                    type="number"
                    value={customMeals}
                    onChange={(e) => {
                      setIsCustom(true);
                      setCustomMeals(Math.max(1, parseInt(e.target.value) || 1));
                    }}
                    className="w-12 text-center font-serif-display font-bold text-sm text-[#013623] bg-transparent outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustom(true);
                      setCustomMeals((m) => Math.min(200, m + 1));
                    }}
                    className="w-8 h-8 rounded-lg bg-[#f4f4f0] hover:bg-[#efeeea] flex items-center justify-center text-[#1b1c1a]"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsCustom(true)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold text-center transition-colors ${
                    isCustom ? 'bg-[#013623] text-white' : 'bg-white text-[#1b1c1a] border border-[#efeeea]'
                  }`}
                >
                  Set {customMeals} Meals (S${(customMeals * 10).toFixed(2)})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Step 3: Donor Details & Dua Dedication */}
        <section className="flex flex-col gap-2.5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#7d5800] font-bold">
              Step 3 • Dedication &amp; Details
            </span>
            <h2 className="font-serif-display text-sm font-bold text-[#1b1c1a]">
              Dedication &amp; WhatsApp Proof
            </h2>
          </div>

          <form onSubmit={handlePledgeSubmit} className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3.5">
            {/* Donor Name */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="donor-name" className="text-xs font-bold text-[#1b1c1a]">
                  Donor Name
                </label>
                <button
                  type="button"
                  onClick={toggleAnonymous}
                  className="text-[10px] text-[#7d5800] font-bold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[13px]">visibility_off</span>
                  <span>{isAnonymous ? 'Use My Name' : 'Make Anonymous'}</span>
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#717973] text-[18px] pointer-events-none">
                  person
                </span>
                <input
                  id="donor-name"
                  type="text"
                  value={isAnonymous ? 'Anonymous Donor' : donorName}
                  disabled={isAnonymous}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Ahmad bin Abdullah"
                  className={`w-full bg-[#f4f4f0] text-xs pl-10 pr-3 py-2.5 rounded-xl outline-none border border-[#efeeea] ${
                    isAnonymous ? 'opacity-60' : 'focus:bg-white focus:ring-1 focus:ring-[#013623]'
                  }`}
                  required={!isAnonymous}
                />
              </div>
            </div>

            {/* WhatsApp Mobile */}
            <div className="flex flex-col gap-1">
              <label htmlFor="donor-phone" className="text-xs font-bold text-[#1b1c1a]">
                Singapore WhatsApp Mobile
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 bg-[#f4f4f0] rounded-xl text-xs font-bold text-[#1b1c1a] shrink-0 border border-[#efeeea]">
                  <span>🇸🇬 +65</span>
                </div>
                <input
                  id="donor-phone"
                  type="tel"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  placeholder="9123 4567"
                  className="w-full bg-[#f4f4f0] text-xs px-3 py-2.5 rounded-xl outline-none border border-[#efeeea] focus:bg-white focus:ring-1 focus:ring-[#013623]"
                  required
                />
              </div>
              <p className="text-[10px] text-[#717973]">
                We send high-res photo and video confirmation once meals are received at the mosque.
              </p>
            </div>

            {/* Niat / Doa Dedication */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label htmlFor="donor-dua" className="text-xs font-bold text-[#1b1c1a]">
                  Prayer / Dedication (Optional)
                </label>
                <span className="text-[10px] text-[#717973]">Shared with prayer reciter</span>
              </div>
              <textarea
                id="donor-dua"
                value={doaDedication}
                onChange={(e) => setDoaDedication(e.target.value)}
                placeholder="Dedicated in loving memory of parents, and for the blessings of our children..."
                rows={2}
                className="w-full bg-[#f4f4f0] text-xs p-3 rounded-xl outline-none border border-[#efeeea] focus:bg-white focus:ring-1 focus:ring-[#013623] resize-none"
              />
            </div>

            {/* WhatsApp Proof Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
              <input
                type="checkbox"
                checked={sendWhatsAppProof}
                onChange={(e) => setSendWhatsAppProof(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-[#013623] accent-[#013623]"
              />
              <span className="text-xs text-[#414943] leading-snug">
                Send me photo &amp; video proof of distribution at {selectedMosque.name} directly on WhatsApp this Friday afternoon.
              </span>
            </label>

            {/* Warm Dua Micro Card */}
            <div className="bg-gradient-to-br from-[#ffdea9]/40 via-[#f4f4f0] to-[#bbeed1]/20 p-3 rounded-xl text-center border border-[#efeeea]">
              <span
                className="material-symbols-outlined text-[18px] text-[#7d5800] mb-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
              <p className="font-serif-display text-xs text-[#1b1c1a] font-semibold italic leading-relaxed">
                “May Allah accept your infaq, purify your wealth, and place immense barakah in your home and family.”
              </p>
              <p className="text-[9px] text-[#717973] uppercase font-bold tracking-wider mt-1">
                Aamiin Ya Rabbal Alamin
              </p>
            </div>

            {/* Prototype notice */}
            <div className="p-2 bg-[#f4f4f0] rounded-lg text-center text-[10px] text-[#717973]">
              *Sample contribution prototype. A tax-deductible welfare receipt &amp; PayNow reference is generated for demonstration.
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#013623] hover:bg-[#1e4d38] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Generating PayNow Barakah QR...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>
                    Proceed to Sponsor Infaq (S${currentCost.toFixed(2)})
                  </span>
                </>
              )}
            </button>
          </form>
        </section>

        {/* Live Community Feed */}
        <section className="flex flex-col gap-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#1b1c1a] uppercase tracking-wider">
              Recent Community Contributions
            </h3>
            <span className="text-[10px] text-[#7d5800] font-bold">Live Friday Feed</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="bg-white p-2.5 rounded-xl shadow-xs border border-[#efeeea] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#ffdea9] text-[#271900] flex items-center justify-center font-bold text-[10px]">
                  A
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1a]">Anonymous Donor • Tampines</p>
                  <p className="text-[10px] text-[#717973]">“In loving memory of beloved mother”</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#013623]">5 Meals</span>
                <p className="text-[9px] text-[#717973]">8 mins ago</p>
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-xl shadow-xs border border-[#efeeea] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#bbeed1] text-[#002113] flex items-center justify-center font-bold text-[10px]">
                  F
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1a]">Farhan &amp; Syafiqah • Jurong</p>
                  <p className="text-[10px] text-[#717973]">“May our family be blessed with abundance”</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#013623]">10 Meals</span>
                <p className="text-[9px] text-[#717973]">19 mins ago</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
