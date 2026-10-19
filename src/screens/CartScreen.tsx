import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CartScreen: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartCount,
    cartFoodSubtotal,
    cartInfaqSubtotal,
    deliveryType,
    setDeliveryType,
    deliveryFee,
    appliedPromo,
    applyPromo,
    removePromo,
    discountAmount,
    packagingFee,
    cartGstAmount,
    cartGrandTotal,
    navigateTo,
    goBack,
  } = useApp();

  const [promoInput, setPromoInput] = useState(appliedPromo || '');

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim()) {
      applyPromo(promoInput);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-5 text-center pt-20 pb-24">
        <div className="w-20 h-20 rounded-full bg-[#f4f4f0] border border-[#efeeea] flex items-center justify-center text-[#717973] mb-4">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h2 className="font-serif-display text-xl text-[#013623] font-bold">Your Kitchen Basket is Empty</h2>
        <p className="text-xs text-[#414943] mt-1.5 max-w-xs leading-relaxed">
          Looks like you haven&apos;t added any delicious home-cooked meals yet. Explore our signature rice and specials!
        </p>
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="mt-6 px-6 py-3 rounded-2xl bg-[#013623] text-white text-xs font-bold shadow-md active:scale-95 transition-transform"
        >
          Explore Culinary Menu
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-36 pt-16 bg-[#faf9f5]">
      {/* Top Bar */}
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
          <span className="font-serif-display text-base text-[#013623] font-bold">
            Shopping Cart
          </span>
          <span className="text-[10px] text-[#7d5800] uppercase font-bold tracking-widest">
            {cartCount} Items Selected
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-[#ba1a1a] hover:underline font-semibold"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            className="px-3 py-1.5 rounded-xl bg-[#013623] text-white text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>Checkout</span>
            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
          </button>
        </div>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Fulfilment Toggle in Cart */}
        <div className="bg-[#efeeea] rounded-xl p-1.5 flex gap-1.5 shadow-xs border border-[#efeeea]">
          <button
            type="button"
            onClick={() => setDeliveryType('delivery')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
              deliveryType === 'delivery'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'text-[#414943] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Islandwide Delivery (S$18)</span>
          </button>
          <button
            type="button"
            onClick={() => setDeliveryType('pickup')}
            className={`flex-1 py-2.5 px-3 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
              deliveryType === 'pickup'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'text-[#414943] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>Self-Pickup (Free)</span>
          </button>
        </div>

        {/* Selected Dishes List */}
        <div className="flex flex-col gap-3">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-3"
            >
              <div className="flex gap-3 items-start">
                <img
                  src={item.dishImage}
                  alt={item.dishName}
                  className="w-18 h-18 rounded-xl object-cover shrink-0 bg-[#efeeea]"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a] leading-snug">
                      {item.dishName}
                    </h3>
                    <span className="font-serif-display text-sm text-[#013623] font-bold shrink-0">
                      S${item.itemSubtotal.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7d5800] mt-0.5">
                    {item.selectedPortion.name}
                  </p>
                  {item.selectedAddons.length > 0 && (
                    <p className="text-[10px] text-[#717973] mt-0.5">
                      Add-ons: {item.selectedAddons.map((a) => a.name).join(', ')}
                    </p>
                  )}
                  {item.specialInstructions && (
                    <p className="text-[10px] text-[#414943] italic mt-0.5">
                      Note: &quot;{item.specialInstructions}&quot;
                    </p>
                  )}
                  {item.infaqPledgeSponsorship && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#ffdea9] text-[#271900] text-[9px] font-bold">
                      +1 Infaq Jumaat Bento (S${(item.infaqPrice || 13).toFixed(2)})
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex items-center justify-between pt-2 border-t border-[#efeeea]">
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1 text-[11px] text-[#ba1a1a] hover:opacity-80 transition-opacity font-semibold"
                >
                  <span className="material-symbols-outlined text-[15px]">delete</span>
                  <span>Remove</span>
                </button>

                <div className="flex items-center gap-3 bg-[#f4f4f0] px-2 py-1 rounded-full border border-[#efeeea]">
                  <button
                    type="button"
                    aria-label="Decrease"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#013623] shadow-xs active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <span className="font-bold text-xs text-[#013623] min-w-[14px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full bg-[#013623] flex items-center justify-center text-white shadow-xs active:scale-90"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add More Items Button */}
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="w-full py-2.5 rounded-xl bg-white border border-[#efeeea] text-[#013623] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#f4f4f0] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Add more dishes from NyiMas Kitchen</span>
        </button>

        {/* Promo Voucher Field */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#1b1c1a]">Promo Voucher / Discount Code</span>
            <span className="text-[10px] text-[#7d5800] font-bold">Try: BARAKAHFIRST</span>
          </div>
          <form onSubmit={handleApplyPromo} className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder="e.g. BARAKAHFIRST"
              className="flex-1 bg-[#f4f4f0] text-xs font-bold px-3 py-2.5 rounded-xl outline-none uppercase tracking-wider"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#013623] text-white text-xs font-bold rounded-xl active:scale-95 transition-transform"
            >
              Apply
            </button>
          </form>
          {appliedPromo && (
            <div className="mt-2 flex items-center justify-between text-xs text-[#013623] bg-[#bbeed1]/30 p-2 rounded-lg">
              <span className="flex items-center gap-1 font-semibold">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                Promo {appliedPromo} active (-S${discountAmount.toFixed(2)})
              </span>
              <button
                type="button"
                onClick={removePromo}
                className="text-xs text-[#ba1a1a] underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* Summary of Charges */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#efeeea]">
            <h3 className="font-serif-display text-sm font-bold text-[#013623]">Summary of Charges</h3>
            <span className="text-[10px] text-[#717973] font-semibold">SGD Currency</span>
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
            <span>{deliveryType === 'delivery' ? 'Islandwide Van Delivery (Flat Rate)' : 'Self-Collection (Pasir Ris)'}</span>
            <span className="font-semibold text-[#1b1c1a]">
              {deliveryType === 'delivery' ? `S$${deliveryFee.toFixed(2)}` : 'Free (S$0.00)'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs text-[#414943]">
            <span>Thermal Bag &amp; Bio Packaging</span>
            <span className="font-semibold text-[#1b1c1a]">S${packagingFee.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-xs text-[#013623] font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">local_offer</span>
                <span>Welcome Promo Discount</span>
              </span>
              <span>-S${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-[#717973] pt-1">
            <span>Applicable 9% GST (Inclusive)</span>
            <span>S${cartGstAmount.toFixed(2)} (Included)</span>
          </div>

          <div className="h-px bg-[#efeeea] my-1" />

          <div className="flex justify-between items-baseline pt-1">
            <div>
              <span className="font-serif-display text-base font-bold text-[#1b1c1a] block">
                Total Payment
              </span>
              <span className="text-[10px] text-[#717973]">
                Inclusive of bio-degradable thermal packaging
              </span>
            </div>
            <div className="text-right">
              <span className="font-serif-display text-xl font-extrabold text-[#013623]">
                S${cartGrandTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* In-Page Prominent Primary Checkout Action */}
        <div className="flex flex-col gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            className="w-full h-14 bg-[#013623] hover:bg-[#1e4d38] active:scale-[0.98] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            <span>Proceed to Checkout • S${cartGrandTotal.toFixed(2)}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTo('menu')}
            className="w-full h-11 bg-white border border-[#efeeea] text-[#013623] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#f4f4f0] transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">restaurant_menu</span>
            <span>Continue Shopping Menu</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Checkout Dock (High z-index to guarantee visibility) */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-[#faf9f5]/95 backdrop-blur-xl border-t border-[#efeeea] shadow-[0_-4px_24px_rgba(0,0,0,0.1)] px-5 py-3 pb-safe">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#717973] uppercase font-semibold">
              Total ({cartCount} items)
            </span>
            <span className="font-serif-display text-lg font-extrabold text-[#013623]">
              S${cartGrandTotal.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateTo('checkout')}
            className="flex-1 h-12 rounded-2xl bg-[#013623] hover:bg-[#1e4d38] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Proceed to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
