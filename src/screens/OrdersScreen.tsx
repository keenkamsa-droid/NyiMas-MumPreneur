import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, Booking } from '../types';

export const OrdersScreen: React.FC = () => {
  const {
    orders,
    ordersLoading,
    ordersError,
    refreshOrders,
    bookings,
    bookingsLoading,
    navigateTo,
    addToCart,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'bookings'>('upcoming');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);

  const upcomingOrders = orders.filter(
    (o) => o.status !== 'Completed' && o.status !== 'Cancelled'
  );

  const pastOrders = orders.filter(
    (o) => o.status === 'Completed' || o.status === 'Cancelled'
  );

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addToCart(
        {
          id: item.dishId,
          name: item.dishName,
          slug: item.dishId,
          subtitle: item.selectedPortion.name,
          description: '',
          price: item.selectedPortion.price,
          image: item.dishImage,
          categories: ['all'],
          rating: 5.0,
          reviewCount: 1,
          availabilityTag: 'In Stock',
          inStock: true,
          portionOptions: [item.selectedPortion],
          addonOptions: item.selectedAddons,
          includedComponents: [],
        },
        item.selectedPortion,
        item.selectedAddons,
        item.quantity,
        item.specialInstructions
      );
    });
    showToast(`Items from Order #${order.orderNumber} added to basket!`);
    navigateTo('cart');
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'preparing in kitchen':
      case 'preparing':
        return 'bg-[#ffc969] text-[#775300] border-[#f2be5f]';
      case 'pending confirmation':
      case 'pending':
        return 'bg-[#efeeea] text-[#414943] border-[#efeeea]';
      case 'confirmed':
        return 'bg-[#bbeed1] text-[#002113] border-[#bbeed1]';
      case 'ready for collection':
      case 'ready':
        return 'bg-[#bbeed1] text-[#002113] border-[#bbeed1]';
      case 'out for delivery':
        return 'bg-[#ffdea9] text-[#271900] border-[#ffdea9]';
      case 'completed':
        return 'bg-[#f4f4f0] text-[#717973] border-[#efeeea]';
      case 'cancelled':
        return 'bg-[#ffdad6] text-[#93000a] border-[#ffdad6]';
      default:
        return 'bg-[#bbeed1] text-[#002113] border-[#bbeed1]';
    }
  };

  return (
    <div className="flex flex-col w-full pb-32 pt-16 bg-[#faf9f5]">
      {/* Header */}
      <div className="px-5 pt-3 pb-2 max-w-md mx-auto w-full flex items-center justify-between">
        <div>
          <h1 className="font-serif-display text-2xl font-bold text-[#013623] tracking-tight">
            My Orders
          </h1>
          <p className="text-xs text-[#414943]">Track real-time orders &amp; Cloud Firestore history</p>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('menu')}
          className="text-xs font-bold text-[#7d5800] hover:underline"
        >
          Explore Menu
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-4 max-w-md mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="bg-[#efeeea] rounded-xl p-1.5 flex gap-1 border border-[#efeeea]">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upcoming'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'text-[#414943] hover:bg-white/60'
            }`}
          >
            <span>Upcoming</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'upcoming' ? 'bg-[#ffc969] text-[#775300]' : 'bg-[#e9e8e4]'
              }`}
            >
              {upcomingOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'past'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'text-[#414943] hover:bg-white/60'
            }`}
          >
            <span>Past Orders</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'past' ? 'bg-[#ffc969] text-[#775300]' : 'bg-[#e9e8e4]'
              }`}
            >
              {pastOrders.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'bookings'
                ? 'bg-[#013623] text-white shadow-sm'
                : 'text-[#414943] hover:bg-white/60'
            }`}
          >
            <span>Bookings</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'bookings' ? 'bg-[#ffc969] text-[#775300]' : 'bg-[#e9e8e4]'
              }`}
            >
              {bookings.length}
            </span>
          </button>
        </div>

        {/* Loading State */}
        {ordersLoading && (
          <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeea] shadow-xs flex flex-col items-center">
            <span className="material-symbols-outlined text-[32px] text-[#013623] animate-spin mb-2">
              progress_activity
            </span>
            <h3 className="font-serif-display text-sm font-bold text-[#1b1c1a]">
              Loading Orders...
            </h3>
            <p className="text-xs text-[#717973] mt-1">
              Retrieving your customer orders from Cloud Firestore.
            </p>
          </div>
        )}

        {/* Error State with Retry */}
        {!ordersLoading && ordersError && (
          <div className="p-5 text-center bg-[#ffdad6] text-[#93000a] rounded-2xl border border-[#ffdad6] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[28px]">error</span>
            <p className="text-xs font-semibold">{ordersError}</p>
            <button
              type="button"
              onClick={refreshOrders}
              className="px-4 py-2 bg-[#93000a] text-white rounded-xl text-xs font-bold active:scale-95 transition-transform"
            >
              Retry Loading Orders
            </button>
          </div>
        )}

        {/* Orders List when ready */}
        {!ordersLoading && !ordersError && (
          <>
            {activeTab === 'upcoming' && (
              upcomingOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeea] shadow-xs flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973] mb-3">
                    <span className="material-symbols-outlined text-[30px]">receipt_long</span>
                  </div>
                  <h3 className="font-serif-display text-base font-bold text-[#1b1c1a]">
                    You haven&apos;t placed any orders yet.
                  </h3>
                  <p className="text-xs text-[#717973] mt-1 max-w-xs leading-relaxed">
                    Explore our authentic Singapore spiced rice, catering platters, and Friday Infaq packages.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo('menu')}
                    className="mt-4 px-5 py-2.5 bg-[#013623] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-transform"
                  >
                    Browse Food Menu
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#efeeea]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#bbeed1] text-[#002113] flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">rice_bowl</span>
                          </div>
                          <div>
                            <span className="font-serif-display text-sm font-bold text-[#1b1c1a] block">
                              #{order.orderNumber}
                            </span>
                            <span className="text-[10px] text-[#717973]">
                              {order.dispatchDate} • {order.dispatchTimeSlot.split('(')[0]}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* Items Summary */}
                      <div className="flex flex-col gap-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={item.dishImage}
                                alt={item.dishName}
                                className="w-8 h-8 rounded-lg object-cover shrink-0 bg-[#efeeea]"
                              />
                              <div className="truncate">
                                <span className="text-[#1b1c1a] block font-medium truncate">
                                  {item.quantity}x {item.dishName}
                                </span>
                                <span className="text-[10px] text-[#717973]">
                                  {item.selectedPortion.name}
                                </span>
                              </div>
                            </div>
                            <span className="font-semibold text-[#013623] shrink-0">
                              S${item.itemSubtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 bg-[#f4f4f0] rounded-xl flex items-center justify-between text-xs border border-[#efeeea]">
                        <span className="text-[#717973]">
                          {order.fulfillmentType === 'delivery'
                            ? 'Islandwide Delivery'
                            : 'Pasir Ris Self-Collection'}
                        </span>
                        <span className="font-serif-display text-sm font-extrabold text-[#013623]">
                          Total: S${order.totalPayable.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setViewingOrder(order)}
                          className="flex-1 py-2 bg-[#f4f4f0] hover:bg-[#efeeea] text-[#013623] text-xs font-semibold rounded-xl text-center transition-colors"
                        >
                          View Details &amp; Receipt
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-[#013623] text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform"
                        >
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'past' && (
              pastOrders.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeea] shadow-xs flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973] mb-3">
                    <span className="material-symbols-outlined text-[30px]">history</span>
                  </div>
                  <h3 className="font-serif-display text-base font-bold text-[#1b1c1a]">
                    No past orders recorded
                  </h3>
                  <p className="text-xs text-[#717973] mt-1">
                    Your completed order history will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo('menu')}
                    className="mt-4 px-5 py-2.5 bg-[#013623] text-white rounded-xl text-xs font-bold"
                  >
                    Browse Food Menu
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {pastOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#efeeea]">
                        <div>
                          <span className="font-serif-display text-sm font-bold text-[#1b1c1a] block">
                            #{order.orderNumber}
                          </span>
                          <span className="text-[10px] text-[#717973]">{order.orderDate}</span>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5 text-xs text-[#414943]">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center">
                            <span className="truncate pr-2">
                              {item.quantity}x {item.dishName}
                            </span>
                            <span className="font-semibold text-[#1b1c1a]">
                              S${item.itemSubtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#efeeea]">
                        <span className="font-serif-display text-sm font-bold text-[#013623]">
                          S${order.totalPayable.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingOrder(order)}
                            className="px-3 py-1.5 bg-[#f4f4f0] text-[#013623] text-xs font-semibold rounded-xl hover:bg-[#efeeea]"
                          >
                            Receipt
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(order)}
                            className="px-3.5 py-1.5 bg-[#013623] text-white text-xs font-semibold rounded-xl active:scale-95 transition-transform"
                          >
                            Reorder
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {activeTab === 'bookings' && (
              bookingsLoading ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeea]">
                  <span className="material-symbols-outlined text-[30px] text-[#013623] animate-spin mb-2">
                    progress_activity
                  </span>
                  <p className="text-xs text-[#717973]">Loading catering bookings from Firestore...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-2xl border border-[#efeeea] shadow-xs flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973] mb-3">
                    <span className="material-symbols-outlined text-[30px]">event</span>
                  </div>
                  <h3 className="font-serif-display text-base font-bold text-[#1b1c1a]">
                    No catering bookings yet
                  </h3>
                  <p className="text-xs text-[#717973] mt-1 max-w-xs">
                    Need communal dulang trays or kenduri buffet catering? Explore our catering menu!
                  </p>
                  <button
                    type="button"
                    onClick={() => navigateTo('menu')}
                    className="mt-4 px-5 py-2.5 bg-[#013623] text-white rounded-xl text-xs font-bold"
                  >
                    Explore Catering Trays
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {bookings.map((b) => (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-[#efeeea] flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between pb-2 border-b border-[#efeeea]">
                        <div>
                          <span className="font-serif-display text-sm font-bold text-[#1b1c1a]">
                            {b.serviceName}
                          </span>
                          <span className="text-[10px] text-[#717973] block mt-0.5">
                            {b.bookingDate} • {b.bookingTime}
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#bbeed1] text-[#002113]">
                          {b.status}
                        </span>
                      </div>
                      <div className="text-xs text-[#414943] flex flex-col gap-1">
                        <p><strong>Provider:</strong> {b.providerName}</p>
                        <p><strong>Address:</strong> {b.serviceAddress}</p>
                        {b.specialInstructions && <p><strong>Notes:</strong> {b.specialInstructions}</p>}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#efeeea]">
                        <span className="font-serif-display text-sm font-bold text-[#013623]">
                          Total: S${b.totalAmount.toFixed(2)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewingBooking(b)}
                          className="px-3.5 py-1.5 bg-[#f4f4f0] text-[#013623] text-xs font-semibold rounded-xl hover:bg-[#efeeea]"
                        >
                          Booking Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingOrder(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-bold">Official Receipt</span>
                <h3 className="font-serif-display text-base font-bold text-[#013623]">
                  Order #{viewingOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-3 py-3 text-xs">
              <div className="flex justify-between items-center bg-[#f4f4f0] p-2.5 rounded-xl">
                <span>Status:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${getStatusBadge(viewingOrder.status)}`}>
                  {viewingOrder.status}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-[#717973] block mb-1">
                  Items Summary
                </span>
                <div className="flex flex-col gap-2">
                  {viewingOrder.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between">
                      <div>
                        <p className="font-bold text-[#1b1c1a]">
                          {item.quantity}x {item.dishName}
                        </p>
                        <p className="text-[10px] text-[#717973]">{item.selectedPortion.name}</p>
                      </div>
                      <span className="font-bold text-[#013623]">
                        S${item.itemSubtotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-[#efeeea] pt-2 flex flex-col gap-1 text-[11px] text-[#414943]">
                <div className="flex justify-between">
                  <span>Food Subtotal</span>
                  <span>S${viewingOrder.foodSubtotal.toFixed(2)}</span>
                </div>
                {viewingOrder.infaqSubtotal > 0 && (
                  <div className="flex justify-between text-[#7d5800]">
                    <span>Friday Infaq Contribution</span>
                    <span>S${viewingOrder.infaqSubtotal.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>S${viewingOrder.deliveryFee.toFixed(2)}</span>
                </div>
                {viewingOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#013623]">
                    <span>Discount</span>
                    <span>-S${viewingOrder.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-[#013623] pt-1 border-t border-[#efeeea]">
                  <span>Total Amount</span>
                  <span>S${viewingOrder.totalPayable.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-[#f4f4f0] p-3 rounded-xl border border-[#efeeea] text-[11px]">
                <p className="font-bold text-[#1b1c1a]">{viewingOrder.customerName}</p>
                <p className="text-[#414943]">{viewingOrder.customerPhone}</p>
                <p className="text-[#717973] mt-0.5">{viewingOrder.deliveryAddress}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('Tax receipt downloaded as PDF');
                setViewingOrder(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#013623] text-white text-xs font-bold active:scale-98"
            >
              Download PDF Receipt
            </button>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {viewingBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingBooking(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#efeeea]">
              <div>
                <span className="text-[10px] text-[#717973] uppercase font-bold">Booking Details</span>
                <h3 className="font-serif-display text-base font-bold text-[#013623]">
                  {viewingBooking.serviceName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingBooking(null)}
                className="w-8 h-8 rounded-full bg-[#f4f4f0] flex items-center justify-center text-[#717973]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="py-3 flex flex-col gap-2 text-xs text-[#414943]">
              <p><strong>Provider:</strong> {viewingBooking.providerName}</p>
              <p><strong>Scheduled:</strong> {viewingBooking.bookingDate} at {viewingBooking.bookingTime}</p>
              <p><strong>Address:</strong> {viewingBooking.serviceAddress}</p>
              {viewingBooking.specialInstructions && <p><strong>Instructions:</strong> {viewingBooking.specialInstructions}</p>}
              <div className="mt-2 pt-2 border-t border-[#efeeea] flex justify-between font-bold text-sm text-[#013623]">
                <span>Total Amount:</span>
                <span>S${viewingBooking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setViewingBooking(null)}
              className="w-full py-2 bg-[#013623] text-white text-xs font-bold rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
