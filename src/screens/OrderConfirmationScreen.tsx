import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND } from '../data/mockData';

export const OrderConfirmationScreen: React.FC = () => {
  const { latestOrder, orders, navigateTo, showToast } = useApp();

  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Fallback to the latest order in state or the first sample order
  const order = latestOrder || orders[0];

  const handleCopyRef = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      showToast('Order reference copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      showToast('Official PDF Tax Receipt downloaded.');
    }, 1200);
  };

  if (!order) {
    return (
      <div className="pt-24 text-center px-5">
        <p>No active order found.</p>
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="mt-3 px-4 py-2 bg-[#013623] text-white rounded-xl text-xs"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-28 pt-16 bg-[#faf9f5]">
      {/* Top Utility Header */}
      <div className="px-5 py-2 max-w-md mx-auto w-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          aria-label="Home"
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#efeeea] flex items-center justify-center text-[#013623] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">home</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f4f4f0] border border-[#efeeea] text-[#414943]">
          <span className="material-symbols-outlined text-[15px] text-[#7d5800]">
            verified_user
          </span>
          <span className="text-[11px] font-semibold">Official NyiMas Receipt</span>
        </div>

        <button
          type="button"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `NyiMas MumPreneur Order #${order.orderNumber}`,
                text: `Bismillah, my fresh handcrafted lunch batch order #${order.orderNumber} is confirmed with NyiMas Kitchen!`,
                url: window.location.href,
              }).catch(() => {});
            } else {
              handleCopyRef();
            }
          }}
          className="w-10 h-10 rounded-full bg-white shadow-sm border border-[#efeeea] flex items-center justify-center text-[#013623] active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Progress Stepper (Step 3 Active) */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#efeeea] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1e4d38] text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span className="text-xs text-[#717973] font-medium">1. Menu</span>
          </div>
          <div className="h-0.5 w-6 bg-[#1e4d38] rounded-full" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#1e4d38] text-white flex items-center justify-center text-[10px] font-bold">
              ✓
            </div>
            <span className="text-xs text-[#717973] font-medium">2. Payment</span>
          </div>
          <div className="h-0.5 w-6 bg-[#ffc969] rounded-full" />
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#ffc969] text-[#775300] flex items-center justify-center text-[10px] font-bold ring-2 ring-[#ffdea9]">
              ★
            </div>
            <span className="text-xs text-[#013623] font-bold">3. Confirm</span>
          </div>
        </div>

        {/* Barakah Success Hero Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 shadow-sm border border-[#efeeea] text-center flex flex-col items-center">
          <div className="absolute -top-16 inset-x-0 mx-auto w-44 h-44 rounded-full bg-[#ffdea9]/30 blur-2xl pointer-events-none" />

          {/* Animated Status Medallion */}
          <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-[#013623] to-[#1e4d38] flex items-center justify-center shadow-lg shadow-[#013623]/20 mb-3">
            <span
              className="material-symbols-outlined text-[#ffdea9] text-[36px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
            <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#ffc969] text-[#775300] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdea9] text-[#271900] text-[10px] uppercase font-bold tracking-wider mb-1.5">
            <span
              className="material-symbols-outlined text-[13px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              volunteer_activism
            </span>
            Barakah Secured
          </span>

          <h2 className="font-serif-display text-2xl text-[#013623] font-bold">
            Thank You for Your Order!
          </h2>
          <p className="text-xs text-[#414943] max-w-xs mt-1 leading-relaxed">
            Thank you for choosing NyiMas MumPreneur. Your order details are below. We deeply appreciate your maternal kitchen support!
          </p>

          {/* Kitchen Blessing & Gratitude */}
          <div className="w-full mt-4 p-3 rounded-xl bg-[#f4f4f0] text-[#013623] flex items-start gap-2.5 text-left border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#7d5800] text-[20px] shrink-0 mt-0.5">
              menu_book
            </span>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-[#7d5800] font-bold tracking-wider">
                Kitchen Blessing &amp; Gratitude
              </span>
              <p className="text-xs italic text-[#414943] leading-relaxed mt-0.5">
                “In the name of God — May this meal bring blessings, good health, and joyful delight to you and your family. Amen.”
              </p>
            </div>
          </div>

          {/* Pending Kitchen Confirmation Notice */}
          <div className="w-full mt-2.5 p-3 rounded-xl bg-[#013623]/5 border border-[#013623]/10 flex items-center gap-2.5 text-left">
            <div className="w-2.5 h-2.5 rounded-full bg-[#7d5800] animate-pulse shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[#013623] font-bold">
                {order.status}
              </div>
              <div className="text-[11px] text-[#414943] truncate">
                Mum chef reviews and locks batch preparation in ~30 mins
              </div>
            </div>
          </div>
        </div>

        {/* Unique Order Reference Pill */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#717973] uppercase tracking-wider font-semibold">
              Order Reference
            </span>
            <span className="text-[10px] text-[#7d5800] bg-[#ffdea9] px-2 py-0.5 rounded-full font-bold">
              PayNow Verified
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 bg-[#f4f4f0] rounded-xl border border-[#efeeea]">
            <div className="flex items-center gap-2 min-w-0">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                receipt_long
              </span>
              <span className="font-serif-display text-base text-[#013623] font-bold tracking-wider truncate">
                #{order.orderNumber}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-[#013623] text-white text-xs font-semibold flex items-center gap-1 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined text-[13px]">content_copy</span>
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#efeeea]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#717973]">Order Placed</span>
              <span className="text-xs font-semibold text-[#1b1c1a]">{order.orderDate}</span>
              <span className="text-[10px] text-[#717973]">4:45 PM SGT</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#717973]">Estimated Slot</span>
              <span className="text-xs font-semibold text-[#013623]">{order.dispatchDate}</span>
              <span className="text-[10px] text-[#7d5800] font-bold">
                {order.dispatchTimeSlot.split('(')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Ordered Items List */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#efeeea]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                restaurant_menu
              </span>
              <h3 className="font-serif-display text-sm font-bold text-[#013623]">
                Ordered Items
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#f4f4f0] text-[10px] text-[#414943] font-semibold">
              {order.items.length} items
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 p-2.5 bg-[#f4f4f0] rounded-xl border border-[#efeeea]"
              >
                <img
                  src={item.dishImage}
                  alt={item.dishName}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#efeeea]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-serif-display text-xs font-bold text-[#1b1c1a] leading-snug">
                      {item.dishName}
                    </h4>
                    <span className="font-serif-display text-xs text-[#013623] font-bold shrink-0">
                      S${item.itemSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#414943] mt-0.5">
                    Qty: {item.quantity} ({item.selectedPortion.name})
                  </p>
                  <p className="text-[10px] text-[#7d5800] font-semibold mt-0.5">
                    MumPreneur Handcrafted
                  </p>
                </div>
              </div>
            ))}
          </div>

          {order.driverNotes && (
            <div className="p-2.5 bg-[#efeeea] rounded-xl flex items-start gap-2">
              <span className="material-symbols-outlined text-[#7d5800] text-[16px] shrink-0 mt-0.5">
                edit_note
              </span>
              <div className="flex flex-col">
                <span className="text-[10px] text-[#717973] font-bold">Kitchen Request Note:</span>
                <p className="text-xs text-[#1b1c1a] italic">“{order.driverNotes}”</p>
              </div>
            </div>
          )}
        </div>

        {/* Fulfilment & Delivery Dispatch */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#efeeea]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                local_shipping
              </span>
              <h3 className="font-serif-display text-sm font-bold text-[#013623]">
                Fulfilment Dispatch
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#bbeed1] text-[#002113] text-[10px] font-semibold">
              Temperature Monitored
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#f4f4f0] rounded-xl border border-[#efeeea]">
            <div className="w-10 h-10 rounded-xl bg-[#013623] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">heat_pump</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#1b1c1a]">
                {order.fulfillmentType === 'delivery'
                  ? 'Chilled/Warm Thermal Van Delivery'
                  : 'Self-Pickup at Pasir Ris Studio'}
              </div>
              <div className="text-[11px] text-[#717973]">Packed fresh 45 mins prior to dispatch</div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-1 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#717973] text-[18px] shrink-0 mt-0.5">
                schedule
              </span>
              <div>
                <span className="text-[10px] text-[#717973] block">Delivery Window</span>
                <span className="font-bold text-[#1b1c1a]">
                  {order.dispatchDate} ({order.dispatchTimeSlot.split('(')[0]})
                </span>
                <span className="text-[10px] text-[#7d5800] font-semibold block">
                  Pre-Jumaat Lunch Warm Dispatch
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#717973] text-[18px] shrink-0 mt-0.5">
                person_pin
              </span>
              <div>
                <span className="text-[10px] text-[#717973] block">Recipient &amp; Contact</span>
                <span className="font-bold text-[#1b1c1a]">{order.customerName}</span>
                <span className="text-[11px] text-[#414943] block">
                  {order.customerPhone} (WhatsApp Confirmed)
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#717973] text-[18px] shrink-0 mt-0.5">
                location_on
              </span>
              <div>
                <span className="text-[10px] text-[#717973] block">Address</span>
                <span className="font-bold text-[#1b1c1a] leading-snug">
                  {order.deliveryAddress}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Itemised Payment Summary */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#efeeea]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">receipt</span>
              <h3 className="font-serif-display text-sm font-bold text-[#013623]">Payment Summary</h3>
            </div>
            <div className="flex items-center gap-1 text-[#013623] text-xs font-bold">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>Paid</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Food Subtotal</span>
            <span className="font-semibold text-[#1b1c1a]">S${order.foodSubtotal.toFixed(2)}</span>
          </div>

          {order.infaqSubtotal > 0 && (
            <div className="flex justify-between items-center text-xs text-[#7d5800]">
              <span>Infaq Friday Contribution</span>
              <span className="font-bold">S${order.infaqSubtotal.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Delivery Fee</span>
            <span className="font-semibold text-[#1b1c1a]">S${order.deliveryFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Thermal Bag &amp; Eco-Packaging</span>
            <span className="font-semibold text-[#1b1c1a]">S${order.packagingFee.toFixed(2)}</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between items-center text-xs text-[#013623] font-semibold">
              <span>Barakah Voucher Discount</span>
              <span>-S${order.discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-[#717973] pt-0.5">
            <span>Applicable 9% GST (Inclusive)</span>
            <span>S${order.gstAmount.toFixed(2)}</span>
          </div>

          <div className="h-px bg-[#efeeea] my-1" />

          <div className="flex justify-between items-baseline pt-1">
            <span className="font-serif-display text-sm font-bold text-[#013623]">
              Total Amount Paid
            </span>
            <span className="font-serif-display text-xl font-extrabold text-[#013623]">
              S${order.totalPayable.toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 bg-[#f4f4f0] rounded-xl flex items-center justify-between text-xs mt-1 border border-[#efeeea]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#013623] text-[18px]">
                account_balance_wallet
              </span>
              <div>
                <span className="font-bold text-[#1b1c1a] block">PayNow QR / DBS PayLah!</span>
                <span className="text-[10px] text-[#717973]">Ref: {order.paymentRef}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#013623] text-[20px]">verified</span>
          </div>
        </div>

        {/* Direct Mum Kitchen Line */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#efeeea] flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#1e4d38] text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[22px]">soup_kitchen</span>
            </div>
            <div className="flex flex-col">
              <h4 className="font-serif-display text-sm font-bold text-[#013623]">
                Direct Mum Kitchen Line
              </h4>
              <p className="text-[11px] text-[#414943]">
                Send prayer dedications or request live dispatch updates
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${BRAND.whatsappRaw}?text=Salam%20NyiMas%20Kitchen,%20inquiring%20about%20Order%20${order.orderNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#013623] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Chat via WhatsApp ({BRAND.whatsappNumber})</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => navigateTo('orders')}
            className="w-full h-12 rounded-xl bg-[#1e4d38] hover:bg-[#013623] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
            <span>View My Orders &amp; Track Batch</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('menu')}
            className="w-full h-12 rounded-xl bg-[#ffdea9] hover:bg-[#ffc969] text-[#271900] text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">restaurant_menu</span>
            <span>Continue Shopping</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="w-full h-11 rounded-xl bg-white border border-[#efeeea] text-[#013623] text-xs font-semibold flex items-center justify-center gap-2 hover:bg-[#f4f4f0] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1 py-1 text-xs text-[#414943] hover:text-[#013623] transition-colors underline"
          >
            <span className="material-symbols-outlined text-[15px]">file_download</span>
            <span>{downloading ? 'Generating PDF...' : 'Download Official PDF Tax Receipt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
