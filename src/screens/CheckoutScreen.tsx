import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

export const CheckoutScreen: React.FC = () => {
  const {
    cart,
    cartFoodSubtotal,
    cartInfaqSubtotal,
    deliveryType,
    setDeliveryType,
    deliveryFee,
    appliedPromo,
    discountAmount,
    packagingFee,
    cartGstAmount,
    cartGrandTotal,
    currentUser,
    placeOrder,
    navigateTo,
    goBack,
    showToast,
  } = useApp();

  // Fulfilment date slots
  const [selectedDate, setSelectedDate] = useState('Fri, 28 Feb 2025');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:30 AM – 1:00 PM (Lunch Dispatch)');
  const [paymentMethod, setPaymentMethod] = useState<'paynow' | 'card'>('paynow');

  // Contact & Address
  const [customerName, setCustomerName] = useState(currentUser.name);
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone);
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser.address);
  const [driverNotes, setDriverNotes] = useState('Please leave on doorstep handle and ring doorbell. Thank you!');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dates = [
    { label: 'Infaq Day', date: 'Fri, 28', month: 'Feb 2025', full: 'Fri, 28 Feb 2025', isFeatured: true },
    { label: 'Weekend', date: 'Sat, 1', month: 'Mar 2025', full: 'Sat, 1 Mar 2025' },
    { label: 'Family Feast', date: 'Sun, 2', month: 'Mar 2025', full: 'Sun, 2 Mar 2025' },
  ];

  const [orderError, setOrderError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    setOrderError(null);
    setIsSubmitting(true);

    try {
      const createdOrder = await placeOrder({
        fulfillmentType: deliveryType,
        dispatchDate: selectedDate,
        dispatchTimeSlot: selectedTimeSlot,
        customerName: customerName.trim() || currentUser.name,
        customerPhone: customerPhone.trim() || currentUser.phone,
        deliveryAddress:
          deliveryType === 'delivery'
            ? deliveryAddress.trim()
            : 'Pasir Ris Kitchen Studio (Self-Collection)',
        driverNotes: driverNotes.trim(),
        paymentMethod,
      });

      // Confetti celebration only on confirmed save
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#013623', '#d4a347', '#ffc969', '#ffffff'],
        });
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      showToast('Your order has been confirmed and saved!');
      navigateTo('order-confirmation', { orderId: createdOrder.id });
    } catch (err: any) {
      setIsSubmitting(false);
      const message = err?.message || 'Failed to place order to Firestore. Please try again.';
      setOrderError(message);
      showToast('Could not save order. Please try again.', 'error');
    }
  };

  return (
    <div className="flex flex-col w-full pb-36 pt-16 bg-[#faf9f5]">
      {/* Top Header */}
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
          <h1 className="font-serif-display text-base text-[#013623] font-bold">
            Place Your Order
          </h1>
          <div className="flex items-center gap-1 text-[#7d5800]">
            <span className="material-symbols-outlined text-[13px]">lock</span>
            <span className="text-[10px] uppercase tracking-wider font-bold">
              256-Bit SSL Secure
            </span>
          </div>
        </div>

        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#013623] text-white">
          <span className="material-symbols-outlined text-[18px]">person</span>
        </div>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Progress Stepper */}
        <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-[#efeeea] flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1e4d38] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[15px]">check</span>
            </div>
            <span className="text-xs text-[#013623] font-bold">Menu</span>
          </div>
          <div className="h-0.5 w-8 bg-[#1e4d38] rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#7d5800] text-white flex items-center justify-center shadow-md ring-4 ring-[#ffdea9]">
              <span className="text-xs font-bold">2</span>
            </div>
            <span className="text-xs text-[#7d5800] font-bold">Checkout</span>
          </div>
          <div className="h-0.5 w-8 bg-[#e9e8e4] rounded-full" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#efeeea] text-[#717973] flex items-center justify-center">
              <span className="text-xs font-bold">3</span>
            </div>
            <span className="text-xs text-[#717973]">Confirm</span>
          </div>
        </div>

        {/* Infaq Alert Pill if present */}
        {cartInfaqSubtotal > 0 && (
          <div className="bg-[#ffdea9]/40 rounded-2xl p-3.5 flex items-center gap-3 shadow-xs border border-[#ffdea9]">
            <div className="w-9 h-9 rounded-full bg-[#7d5800] flex items-center justify-center text-white shrink-0">
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                volunteer_activism
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#271900] font-bold">Barakah Friday Blessing</p>
              <p className="text-[11px] text-[#414943] truncate">
                Your order includes dedicated Infaq Meal Box support for mosque congregants.
              </p>
            </div>
          </div>
        )}

        {/* Section 1: Fulfillment Toggle */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#013623] text-[20px]">
              local_shipping
            </span>
            <h2 className="font-serif-display text-sm font-bold text-[#013623]">
              Fulfilment Method
            </h2>
          </div>
          <div className="bg-[#efeeea] rounded-2xl p-1.5 flex gap-1.5 border border-[#efeeea]">
            <button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`flex-1 py-3 px-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                deliveryType === 'delivery'
                  ? 'bg-[#1e4d38] text-white shadow-sm'
                  : 'text-[#414943] hover:bg-white/60'
              }`}
            >
              <span className="flex items-center gap-1 text-xs font-bold">
                <span className="material-symbols-outlined text-[17px]">local_shipping</span>
                <span>Islandwide Delivery</span>
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">S$18 Flat Rate (Excl. Sentosa)</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`flex-1 py-3 px-3 rounded-xl flex flex-col items-center justify-center text-center transition-all ${
                deliveryType === 'pickup'
                  ? 'bg-[#1e4d38] text-white shadow-sm'
                  : 'text-[#414943] hover:bg-white/60'
              }`}
            >
              <span className="flex items-center gap-1 text-xs font-bold">
                <span className="material-symbols-outlined text-[17px]">storefront</span>
                <span>Self-Collection</span>
              </span>
              <span className="text-[10px] opacity-80 mt-0.5">Free pickup at Pasir Ris Studio</span>
            </button>
          </div>
        </section>

        {/* Section 2: Slot Dispatch Schedule */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                calendar_clock
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#013623]">
                Slot Dispatch Schedule
              </h2>
            </div>
            <span className="text-[10px] uppercase font-bold text-[#7d5800] bg-[#ffdea9] px-2 py-0.5 rounded-full">
              Fresh Batch
            </span>
          </div>

          {/* Date Chips */}
          <div className="grid grid-cols-3 gap-2">
            {dates.map((d) => {
              const isSelected = selectedDate === d.full;
              return (
                <button
                  key={d.full}
                  type="button"
                  onClick={() => setSelectedDate(d.full)}
                  className={`p-2.5 rounded-2xl text-center shadow-xs transition-all ${
                    isSelected
                      ? 'bg-[#013623] text-white shadow-md'
                      : 'bg-white text-[#1b1c1a] border border-[#efeeea] hover:bg-[#f4f4f0]'
                  }`}
                >
                  <p className={`text-[10px] uppercase font-semibold ${isSelected ? 'opacity-90' : 'text-[#717973]'}`}>
                    {d.label}
                  </p>
                  <p className="font-serif-display text-sm font-bold mt-0.5">{d.date}</p>
                  <p className={`text-[10px] ${isSelected ? 'opacity-80' : 'text-[#717973]'}`}>
                    {d.month}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div className="grid grid-cols-2 gap-2 mt-1">
            {[
              { id: '11:30 AM – 1:00 PM (Lunch Dispatch)', label: '11:30 AM – 1:00 PM', desc: 'Lunch Dispatch' },
              { id: '5:30 PM – 7:00 PM (Dinner Dispatch)', label: '5:30 PM – 7:00 PM', desc: 'Dinner Dispatch' },
            ].map((slot) => {
              const isSelected = selectedTimeSlot === slot.id;
              return (
                <label
                  key={slot.id}
                  onClick={() => setSelectedTimeSlot(slot.id)}
                  className={`p-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#1e4d38] text-white border-[#1e4d38] shadow-sm'
                      : 'bg-white text-[#1b1c1a] border-[#efeeea] hover:bg-[#f4f4f0]'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeSlot"
                    checked={isSelected}
                    onChange={() => setSelectedTimeSlot(slot.id)}
                    className="w-4 h-4 text-[#013623] accent-[#013623]"
                  />
                  <div className="min-w-0">
                    <span className="block text-xs font-bold">{slot.label}</span>
                    <span className={`block text-[10px] ${isSelected ? 'opacity-80' : 'text-[#717973]'}`}>
                      {slot.desc}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Section 3: Delivery Recipient & Address */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                person_pin_circle
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#013623]">
                Delivery &amp; Recipient
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs text-[#7d5800] font-bold hover:underline"
            >
              {isEditingAddress ? 'Done' : 'Change'}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2 pb-1">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#bbeed1] text-[#002113] flex items-center justify-center font-bold text-xs shrink-0">
                  {customerName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1b1c1a]">{customerName}</p>
                  <p className="text-[11px] text-[#414943] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] text-[#013623]">chat</span>
                    <span>{customerPhone} (WhatsApp Confirmed)</span>
                  </p>
                </div>
              </div>
              <span
                className="material-symbols-outlined text-[#1e4d38] text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>

            {/* Address Info or Edit Field */}
            {deliveryType === 'delivery' ? (
              isEditingAddress ? (
                <div className="flex flex-col gap-2 pt-1 border-t border-[#efeeea]">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Recipient Name"
                    className="w-full bg-[#f4f4f0] p-2.5 rounded-xl text-xs outline-none"
                  />
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Mobile Number"
                    className="w-full bg-[#f4f4f0] p-2.5 rounded-xl text-xs outline-none"
                  />
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Singapore Delivery Address"
                    rows={2}
                    className="w-full bg-[#f4f4f0] p-2.5 rounded-xl text-xs outline-none resize-none"
                  />
                </div>
              ) : (
                <div className="bg-[#f4f4f0] rounded-xl p-3 border border-[#efeeea]">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-[#414943] text-[18px] shrink-0 mt-0.5">
                      home
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#1b1c1a]">{deliveryAddress}</p>
                      <p className="text-[10px] text-[#717973]">Singapore 529653</p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-[#f4f4f0] rounded-xl p-3 border border-[#efeeea] flex items-start gap-2">
                <span className="material-symbols-outlined text-[#7d5800] text-[18px] shrink-0 mt-0.5">
                  store
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#1b1c1a]">Pasir Ris Kitchen Studio (Self-Pickup)</p>
                  <p className="text-[11px] text-[#414943]">Kitchen Unit #02-14, Pasir Ris Central, SG 519634</p>
                </div>
              </div>
            )}

            {/* Driver Instructions */}
            <div className="bg-[#efeeea]/80 rounded-xl p-3 flex items-start gap-2">
              <span className="material-symbols-outlined text-[#7d5800] text-[18px] shrink-0 mt-0.5">
                sticky_note_2
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase font-bold text-[#414943] tracking-wider">
                  Driver Instructions
                </p>
                <input
                  type="text"
                  value={driverNotes}
                  onChange={(e) => setDriverNotes(e.target.value)}
                  className="w-full bg-transparent text-xs text-[#1b1c1a] italic outline-none mt-0.5"
                  placeholder="Notes for driver..."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Order Items Review */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                restaurant_menu
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#013623]">
                Order Items Review
              </h2>
            </div>
            <span className="text-xs text-[#414943] bg-[#efeeea] px-2 py-0.5 rounded-full font-semibold">
              {cart.length} dishes
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3.5 shadow-sm border border-[#efeeea] flex gap-3 items-center"
              >
                <img
                  src={item.dishImage}
                  alt={item.dishName}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#efeeea]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-serif-display text-xs font-bold text-[#1b1c1a] leading-snug">
                      {item.dishName}
                    </h3>
                    <span className="font-serif-display text-xs text-[#013623] font-bold shrink-0">
                      S${item.itemSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#717973] mt-0.5">
                    Qty: {item.quantity} ({item.selectedPortion.name})
                  </p>
                  {item.specialInstructions && (
                    <div className="mt-1 bg-[#f4f4f0] px-2 py-0.5 rounded-md text-[10px] text-[#414943] truncate">
                      Notes: {item.specialInstructions}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Transparent Price Breakdown */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-2">
          <div className="flex items-center justify-between pb-1 border-b border-[#efeeea]">
            <h2 className="font-serif-display text-sm font-bold text-[#1b1c1a]">Summary of Charges</h2>
            <span className="text-[10px] text-[#717973]">SGD Currency</span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Culinary Items Subtotal</span>
            <span className="font-semibold text-[#1b1c1a]">S${cartFoodSubtotal.toFixed(2)}</span>
          </div>

          {cartInfaqSubtotal > 0 && (
            <div className="flex justify-between items-center text-xs text-[#7d5800]">
              <span className="flex items-center gap-1">
                <span>Friday Infaq Contribution</span>
                <span className="material-symbols-outlined text-[14px]">favorite</span>
              </span>
              <span className="font-bold">S${cartInfaqSubtotal.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>{deliveryType === 'delivery' ? 'Islandwide Thermal Delivery' : 'Self-Collection'}</span>
            <span className="font-semibold text-[#1b1c1a]">
              {deliveryType === 'delivery' ? `S$${deliveryFee.toFixed(2)}` : 'Free (S$0.00)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Thermal Bag &amp; Packaging</span>
            <span className="font-semibold text-[#1b1c1a]">S${packagingFee.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-xs text-[#013623] font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">local_offer</span>
                <span>Promo ({appliedPromo})</span>
              </span>
              <span>-S${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="h-px bg-[#efeeea] my-1" />

          <div className="flex justify-between items-baseline pt-1">
            <div>
              <span className="font-serif-display text-base font-bold text-[#1b1c1a] block">
                Total Payment
              </span>
              <span className="text-[10px] text-[#717973]">
                Inclusive of 9% GST (S${cartGstAmount.toFixed(2)})
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif-display text-xl font-extrabold text-[#013623]">
                S${cartGrandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Section 6: Singapore Local Payment Method */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#013623] text-[20px]">
                account_balance_wallet
              </span>
              <h2 className="font-serif-display text-sm font-bold text-[#013623]">
                Payment Method
              </h2>
            </div>
            <span className="text-[10px] text-[#013623] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Zero Merchant Markups
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {/* PayNow Option */}
            <label
              onClick={() => setPaymentMethod('paynow')}
              className={`p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer transition-all border ${
                paymentMethod === 'paynow'
                  ? 'bg-white border-[#013623] ring-1 ring-[#013623]'
                  : 'bg-white border-[#efeeea]'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'paynow'}
                onChange={() => setPaymentMethod('paynow')}
                className="mt-1 w-4 h-4 text-[#013623] accent-[#013623]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#1b1c1a]">PayNow / DBS PayLah!</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#ffdea9] text-[#271900] text-[9px] font-bold">
                      Recommended
                    </span>
                  </div>
                  <span className="px-1.5 py-0.5 bg-[#efeeea] rounded text-[9px] font-bold text-[#414943]">
                    Instant QR
                  </span>
                </div>
                <p className="text-[11px] text-[#717973] mt-1 leading-snug">
                  Direct to MumPreneur UEN. 0% processing deductions ensure full support for mother cooks.
                </p>
              </div>
            </label>

            {/* Credit Card Option */}
            <label
              onClick={() => setPaymentMethod('card')}
              className={`p-3.5 rounded-2xl flex items-start gap-3 cursor-pointer transition-all border ${
                paymentMethod === 'card'
                  ? 'bg-white border-[#013623] ring-1 ring-[#013623]'
                  : 'bg-white border-[#efeeea]'
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mt-1 w-4 h-4 text-[#013623] accent-[#013623]"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#1b1c1a]">Credit / Debit Card</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-[#717973]">
                    <span className="bg-[#efeeea] px-1 py-0.5 rounded">VISA</span>
                    <span className="bg-[#efeeea] px-1 py-0.5 rounded">Mastercard</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#717973] mt-1 leading-snug">
                  Processed securely with tokenized Singapore banking compliance.
                </p>
              </div>
            </label>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f4f4f0] border border-[#efeeea] flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#013623] shrink-0 mt-0.5">
              info
            </span>
            <p className="text-[11px] text-[#414943] leading-relaxed">
              Orders are verified and confirmed once the transaction is acknowledged. An official digital receipt will be sent via WhatsApp to{' '}
              <strong className="text-[#1b1c1a]">{customerPhone}</strong>.
            </p>
          </div>
        </section>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#7d5800] text-[18px] mb-0.5">
              verified_user
            </span>
            <span className="text-[10px] font-bold text-[#1b1c1a]">100% Halal</span>
            <span className="text-[9px] text-[#717973]">Muslim-Owned</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#013623] text-[18px] mb-0.5">
              skillet
            </span>
            <span className="text-[10px] font-bold text-[#1b1c1a]">Cooked Fresh</span>
            <span className="text-[9px] text-[#717973]">On Dispatch Day</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-[#efeeea]">
            <span className="material-symbols-outlined text-[#717973] text-[18px] mb-0.5">
              security
            </span>
            <span className="text-[10px] font-bold text-[#1b1c1a]">SSL 256-Bit</span>
            <span className="text-[9px] text-[#717973]">Singapore Gate</span>
          </div>
        </div>

        {orderError && (
          <div className="p-3 bg-[#ffdad6] text-[#93000a] text-xs rounded-xl flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">error</span>
            <div className="flex-1">
              <p className="font-bold">Order Submission Failed</p>
              <p className="mt-0.5">{orderError}</p>
            </div>
          </div>
        )}

        {/* In-Page Place Order Action */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handlePlaceOrder}
            className="w-full h-14 py-3.5 px-4 rounded-2xl bg-[#013623] hover:bg-[#1e4d38] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Saving Order to Firestore...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Place Order &amp; Pay S${cartGrandTotal.toFixed(2)}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sticky Bottom Place Order CTA (z-50 to ensure full visibility) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#faf9f5]/95 backdrop-blur-xl border-t border-[#efeeea] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-5 py-3 pb-safe">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handlePlaceOrder}
            className="w-full h-13 py-3.5 px-4 rounded-2xl bg-[#013623] hover:bg-[#1e4d38] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Processing Barakah Order...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>Place Order &amp; Pay S${cartGrandTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
