import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const InfaqConfirmationScreen: React.FC = () => {
  const { latestInfaqPledge, infaqPledges, navigateTo, showToast } = useApp();
  const [copied, setCopied] = useState(false);

  const pledge = latestInfaqPledge || infaqPledges[0];

  const handleCopyRef = () => {
    if (pledge) {
      navigator.clipboard.writeText(pledge.refCode);
      setCopied(true);
      showToast('Infaq reference code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!pledge) {
    return (
      <div className="pt-24 text-center px-5">
        <p>No infaq pledge found.</p>
        <button
          type="button"
          onClick={() => navigateTo('infaq')}
          className="mt-3 px-4 py-2 bg-[#013623] text-white rounded-xl text-xs"
        >
          View Infaq Campaigns
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-32 pt-16 bg-[#faf9f5]">
      {/* Top Header */}
      <div className="px-5 py-2 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          aria-label="Home"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#efeeea] flex items-center justify-center text-[#013623]"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea9] text-[#271900]">
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            volunteer_activism
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider">
            Infaq Barakah Pledged
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyRef}
          aria-label="Share"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#efeeea] flex items-center justify-center text-[#013623]"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Barakah Hero */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-[#efeeea] text-center flex flex-col items-center">
          <div className="absolute -top-16 inset-x-0 mx-auto w-44 h-44 rounded-full bg-[#ffdea9]/30 blur-2xl pointer-events-none" />

          {/* Medallion */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#1e4d38] to-[#013623] flex items-center justify-center shadow-lg shadow-[#013623]/20 mb-3">
            <span
              className="material-symbols-outlined text-[#ffdea9] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#bbeed1] text-[#002113] text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            Barakah Contribution Recorded
          </span>

          <h2 className="font-serif-display text-2xl text-[#013623] font-bold">
            Jazakallahu Khairan Kathira!
          </h2>
          <p className="text-xs text-[#414943] max-w-xs mt-1 leading-relaxed">
            Your generous Friday Infaq contribution has been successfully recorded in the weekly mosque dispatch list.
          </p>

          {/* Dua Note */}
          <div className="w-full mt-4 p-3 rounded-xl bg-[#f4f4f0] text-[#013623] text-left border border-[#efeeea]">
            <p className="text-xs italic text-[#414943] leading-relaxed">
              “May Allah SWT multiply your sustenance, bless your family, and accept this charity as an enduring source of good deeds. Amen.”
            </p>
          </div>
        </div>

        {/* Infaq Reference Card */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#717973] uppercase font-bold tracking-wider">
              Infaq Reference
            </span>
            <span className="text-[10px] text-[#7d5800] bg-[#ffdea9] px-2 py-0.5 rounded-full font-bold">
              PayNow Acknowledged
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 bg-[#f4f4f0] rounded-xl border border-[#efeeea]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                receipt_long
              </span>
              <span className="font-serif-display text-base text-[#013623] font-bold tracking-wider truncate">
                {pledge.refCode}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#013623] text-white text-xs font-semibold flex items-center gap-1 active:scale-95"
            >
              <span className="material-symbols-outlined text-[13px]">content_copy</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-1 border-t border-[#efeeea] text-xs">
            <div className="flex justify-between">
              <span className="text-[#717973]">Recipient Mosque</span>
              <span className="font-bold text-[#1b1c1a]">{pledge.mosqueName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#717973]">Contribution Package</span>
              <span className="font-bold text-[#013623]">{pledge.mealsCount} Warm Bentos (S${pledge.totalAmount.toFixed(2)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#717973]">Donor Name</span>
              <span className="font-bold text-[#1b1c1a]">{pledge.donorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#717973]">WhatsApp Confirmation</span>
              <span className="font-semibold text-[#013623]">{pledge.donorPhone}</span>
            </div>
            {pledge.doaDedication && (
              <div className="mt-1 bg-[#f4f4f0] p-2.5 rounded-xl text-[11px] text-[#414943]">
                <span className="text-[10px] font-bold text-[#7d5800] block">Prayer / Dedication:</span>
                <span className="italic">“{pledge.doaDedication}”</span>
              </div>
            )}
          </div>
        </div>

        {/* Prototype Demonstration Disclaimer */}
        <div className="p-3 bg-[#f4f4f0] rounded-xl text-center text-[10px] text-[#717973] border border-[#efeeea]">
          *This contribution is recorded in your local profile as a demonstration prototype record. Real donations require payment integration.
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('profile')}
            className="w-full h-12 rounded-xl bg-[#013623] hover:bg-[#1e4d38] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span>View Infaq History in My Profile</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full h-11 rounded-xl bg-white border border-[#efeeea] text-[#013623] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#f4f4f0]"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
