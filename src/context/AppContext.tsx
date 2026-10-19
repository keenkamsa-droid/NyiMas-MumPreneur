import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType, testConnection } from '../firebase';
import {
  ScreenView,
  Dish,
  PortionOption,
  AddonOption,
  CartItem,
  Order,
  InfaqPledge,
  UserProfile,
  Booking,
} from '../types';
import {
  DISHES,
  INITIAL_USER,
  INITIAL_INFAQ_PLEDGES,
  BRAND,
} from '../data/mockData';

interface AppContextType {
  currentScreen: ScreenView;
  screenHistory: ScreenView[];
  navigateTo: (screen: ScreenView, options?: { dishId?: string; orderId?: string }) => void;
  goBack: () => void;
  currentUser: UserProfile;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  redirectAfterAuth: ScreenView | null;
  setRedirectAfterAuth: (screen: ScreenView | null) => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  createAccount: (data: { name: string; email: string; phone: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: Partial<UserProfile>) => void;

  // Dishes & Selection
  dishes: Dish[];
  selectedDishId: string;
  selectedDish: Dish | undefined;
  setSelectedDishId: (id: string) => void;
  favoriteDishIds: string[];
  toggleFavorite: (dishId: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    dish: Dish,
    portion: PortionOption,
    addons: AddonOption[],
    quantity: number,
    instructions?: string,
    infaqPledge?: boolean,
    infaqPrice?: number
  ) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartFoodSubtotal: number;
  cartInfaqSubtotal: number;
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  deliveryFee: number;
  appliedPromo: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  discountAmount: number;
  packagingFee: number;
  cartGstAmount: number;
  cartGrandTotal: number;

  // Orders
  orders: Order[];
  ordersLoading: boolean;
  ordersError: string | null;
  refreshOrders: () => void;
  activeOrder: Order | undefined;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
  latestOrder: Order | null;
  isSubmittingOrder: boolean;
  placeOrder: (details: {
    fulfillmentType: 'delivery' | 'pickup';
    dispatchDate: string;
    dispatchTimeSlot: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    driverNotes?: string;
    paymentMethod: 'paynow' | 'card';
  }) => Promise<Order>;

  // Bookings
  bookings: Booking[];
  bookingsLoading: boolean;
  createBooking: (bookingData: Omit<Booking, 'id' | 'userId' | 'status' | 'createdAt'>) => Promise<string>;

  // Infaq
  infaqPledges: InfaqPledge[];
  latestInfaqPledge: InfaqPledge | null;
  submitInfaqPledge: (pledge: {
    mosqueName: string;
    mealsCount: number;
    totalAmount: number;
    donorName: string;
    isAnonymous: boolean;
    donorPhone: string;
    doaDedication?: string;
    sendWhatsAppProof: boolean;
  }) => InfaqPledge;

  // Toast
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & Screen Management
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [screenHistory, setScreenHistory] = useState<ScreenView[]>(['home']);
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<ScreenView | null>(null);

  // Firebase Auth State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('nyimas_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  // Selected Dish
  const [selectedDishId, setSelectedDishId] = useState<string>('dish-lebanese-lamb');
  const selectedDish = DISHES.find((d) => d.id === selectedDishId) || DISHES[0];

  // Favorites
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nyimas_favs');
    return saved ? JSON.parse(saved) : ['dish-lebanese-lamb', 'dish-yemeni-chick'];
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nyimas_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // empty fallback
      }
    }
    return [
      {
        id: 'cart-init-1',
        dishId: 'dish-lebanese-lamb',
        dishName: 'Lebanese Pilaf with Lamb Chops',
        dishImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYKHZFoZIlFUKBKoAQARyNtPqn_RqtPGY51iMx4bdiL9F744tE02LcymOI_FawOT3v9BF0ChzF-EVRw-rEpScQYK1sp0aOBoiGUyzDUXKAlBlgAqkA5aTgdv9jesfKuVHR7nnhefWxbNL_IDEyiBL81hxpa0FysSeT3oAYBkJDandaSTG8ppSlH--ibZ-SocKenO31HFG8Nd8bDsaLXDTUjWko8T7kS9RAFLo-G5latnO7HaRgJME',
        selectedPortion: {
          id: 'portion-reg',
          name: '1 Pax Regular Bento',
          price: 18.0,
          description: 'Includes 2 lamb chops, basmati pilaf & full side fixings.',
        },
        selectedAddons: [],
        specialInstructions: 'Extra mint gremolata, spicy sambal on side',
        quantity: 1,
        unitPrice: 18.0,
        itemSubtotal: 18.0,
      },
      {
        id: 'cart-init-2',
        dishId: 'dish-ny-cart',
        dishName: 'NY Halal-Cart Boneless Chicken',
        dishImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCncdfxrg_jAU2miJtepwXUZ3dGVRgDMEZPkVqmAaPC9rlch2gw88KjpJahfpn_xZ7n6b5oyKWXUfhW7gQIiPYdiQ-UIYE48Nj9pmBjMvfuCNZQngndFNl_494_2k37nfl16obXEi9NUwIdoR75MimP6euiOqpyHewT2v86DYDj6BUQL1_BRz6UMplVtRlDjpuYtKjQSqQiJ7f5HlCFVuFYNNO_3DicI2RdBJGGitpzUpuZRqNIkV8',
        selectedPortion: {
          id: 'portion-box',
          name: '1 Hearty Box (Chicken over Rice)',
          price: 18.0,
          description: 'Loaded with seared chicken thigh, rice, salad, pita & sauces.',
        },
        selectedAddons: [],
        specialInstructions: 'Extra famous white garlic sauce',
        quantity: 1,
        unitPrice: 18.0,
        itemSubtotal: 18.0,
      },
    ];
  });

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [appliedPromo, setAppliedPromo] = useState<string | null>('BARAKAHFIRST');

  // Real Firestore Orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Real Firestore Bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);

  // Infaq Pledges (stored locally per session)
  const [infaqPledges, setInfaqPledges] = useState<InfaqPledge[]>(() => {
    const saved = localStorage.getItem('nyimas_infaq');
    return saved ? JSON.parse(saved) : INITIAL_INFAQ_PLEDGES;
  });
  const [latestInfaqPledge, setLatestInfaqPledge] = useState<InfaqPledge | null>(null);

  // Toast Notifications
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Test Firebase Firestore Connection on Mount
  useEffect(() => {
    testConnection();
  }, []);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('nyimas_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nyimas_favs', JSON.stringify(favoriteDishIds));
  }, [favoriteDishIds]);

  useEffect(() => {
    localStorage.setItem('nyimas_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nyimas_infaq', JSON.stringify(infaqPledges));
  }, [infaqPledges]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsAuthLoading(false);

      if (user) {
        setCurrentUser((prev) => ({
          ...prev,
          name: user.displayName || prev.name || user.email?.split('@')[0] || 'Customer',
          email: user.email || prev.email,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Orders Listener
  useEffect(() => {
    if (!firebaseUser) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersError(null);
      return;
    }

    setOrdersLoading(true);
    setOrdersError(null);

    const ordersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', firebaseUser.uid)
    );

    const unsubscribe = onSnapshot(
      ordersQuery,
      (snapshot) => {
        const loadedOrders: Order[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const timestamp = data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now();
          const formattedDate = data.orderDate || new Date(timestamp).toLocaleDateString('en-SG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return {
            id: docSnap.id,
            orderNumber: data.orderId || docSnap.id.slice(0, 8).toUpperCase(),
            orderDate: formattedDate,
            timestamp,
            status: (data.status === 'confirmed' ? 'Confirmed' : data.status || 'Confirmed') as any,
            paymentStatus: 'Paid',
            paymentMethod: 'paynow',
            fulfillmentType: data.fulfilmentMethod === 'pickup' ? 'pickup' : 'delivery',
            dispatchDate: formattedDate,
            dispatchTimeSlot: data.orderTime || 'Standard Delivery Window',
            customerName: data.customerName || '',
            customerPhone: data.customerPhone || '',
            deliveryAddress: data.deliveryAddress || '',
            driverNotes: data.specialInstructions || '',
            items: (data.items || []).map((it: any, idx: number) => ({
              id: `${docSnap.id}-item-${idx}`,
              dishId: it.foodId || 'dish',
              dishName: it.foodName || 'Artisanal Meal',
              dishImage: DISHES.find((d) => d.id === it.foodId)?.image || DISHES[0].image,
              selectedPortion: {
                id: 'portion-std',
                name: it.portionName || '1 Pax Regular',
                price: it.unitPrice || 0,
                description: '',
              },
              selectedAddons: [],
              quantity: it.quantity || 1,
              unitPrice: it.unitPrice || 0,
              itemSubtotal: it.subtotal || (it.unitPrice || 0) * (it.quantity || 1),
            })),
            foodSubtotal: data.subtotal || 0,
            infaqSubtotal: 0,
            deliveryFee: data.deliveryFee || 0,
            packagingFee: 1.5,
            discountAmount: 0,
            gstAmount: data.gst || 0,
            totalPayable: data.totalAmount || 0,
          };
        });

        // Sort newest first
        loadedOrders.sort((a, b) => b.timestamp - a.timestamp);
        setOrders(loadedOrders);
        setOrdersLoading(false);
      },
      (error) => {
        console.error('Firestore Orders error: ', error);
        setOrdersError('Could not load orders from Firestore. Please try again.');
        setOrdersLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  // Real-time Firestore Bookings Listener
  useEffect(() => {
    if (!firebaseUser) {
      setBookings([]);
      setBookingsLoading(false);
      return;
    }

    setBookingsLoading(true);
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', firebaseUser.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const loadedBookings: Booking[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            userId: data.userId,
            serviceId: data.serviceId || '',
            serviceName: data.serviceName || '',
            providerName: data.providerName || 'NyiMas Kitchen Team',
            bookingDate: data.bookingDate || '',
            bookingTime: data.bookingTime || '',
            serviceAddress: data.serviceAddress || '',
            specialInstructions: data.specialInstructions || '',
            serviceFee: data.serviceFee || 0,
            platformFee: data.platformFee || 0,
            gst: data.gst || 0,
            totalAmount: data.totalAmount || 0,
            status: data.status || 'confirmed',
            createdAt: data.createdAt,
          };
        });
        setBookings(loadedBookings);
        setBookingsLoading(false);
      },
      (error) => {
        console.error('Firestore Bookings error: ', error);
        setBookingsLoading(false);
        handleFirestoreError(error, OperationType.LIST, 'bookings');
      }
    );

    return () => unsubscribe();
  }, [firebaseUser]);

  const refreshOrders = () => {
    setOrdersLoading(true);
    setOrdersError(null);
  };

  const navigateTo = (screen: ScreenView, options?: { dishId?: string; orderId?: string }) => {
    // Preserve Guest Browsing:
    // Home, Menu, Food Details, Infaq are open.
    // Checkout, Orders, Profile require authentication.
    const protectedScreens: ScreenView[] = ['checkout', 'orders', 'profile'];
    if (protectedScreens.includes(screen) && !auth.currentUser) {
      setRedirectAfterAuth(screen);
      showToast('Please sign in or create an account to proceed.', 'info');
      setCurrentScreen('welcome');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (options?.dishId) {
      setSelectedDishId(options.dishId);
    }
    if (options?.orderId) {
      const found = orders.find((o) => o.id === options.orderId);
      if (found) setSelectedOrder(found);
    }

    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('home');
      setScreenHistory(['home']);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real Firebase Authentication Functions
  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      showToast(`Welcome back, ${user.displayName || user.email?.split('@')[0] || 'Friend'}! Signed in successfully.`);

      // Return customer to destination or default to home
      const destination = redirectAfterAuth || 'home';
      setRedirectAfterAuth(null);
      setCurrentScreen(destination);
      return { success: true };
    } catch (err: any) {
      console.error('Firebase SignIn error: ', err);
      let errorMsg = 'Failed to sign in. Please verify your email and password.';
      if (
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/user-not-found'
      ) {
        errorMsg = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Access temporarily disabled due to many failed attempts. Try again later.';
      }
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const createAccount = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password || 'Password123!'
      );
      const user = userCredential.user;

      // Update Firebase Profile with Full Name
      if (data.name.trim()) {
        try {
          await updateFirebaseProfile(user, {
            displayName: data.name.trim(),
          });
        } catch (e) {
          console.warn('Could not update Firebase displayName: ', e);
        }
      }

      const updatedProfile: UserProfile = {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        address: 'Blk 42 Tampines Ave 5, #08-112, Singapore 529653',
        memberTier: 'Community Member',
        memberLevel: 1,
        totalOrders: 0,
        totalInfaqMeals: 0,
        avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          data.name
        )}&backgroundColor=013623&textColor=ffffff`,
        isDemoUser: false,
      };

      setCurrentUser(updatedProfile);
      showToast(`Account created! Welcome to NyiMas MumPreneur, ${data.name}.`);

      // Apply initial welcome perk
      setAppliedPromo('BARAKAHFIRST');

      const destination = redirectAfterAuth || 'home';
      setRedirectAfterAuth(null);
      setCurrentScreen(destination);
      return { success: true };
    } catch (err: any) {
      console.error('Firebase CreateAccount error: ', err);
      let errorMsg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use at least 6 characters.';
      }
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      showToast('You have signed out successfully.', 'info');
      setCurrentScreen('welcome');
    } catch (err) {
      console.error('Firebase SignOut error: ', err);
      showToast('Error signing out. Please try again.', 'error');
    }
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({ ...prev, ...data }));
    showToast('Profile updated successfully!');
  };

  const toggleFavorite = (dishId: string) => {
    setFavoriteDishIds((prev) => {
      const exists = prev.includes(dishId);
      if (exists) {
        showToast('Removed from favorites', 'info');
        return prev.filter((id) => id !== dishId);
      } else {
        showToast('Added to your favorite dishes!');
        return [...prev, dishId];
      }
    });
  };

  // Cart Operations
  const addToCart = (
    dish: Dish,
    portion: PortionOption,
    addons: AddonOption[],
    quantity: number,
    instructions?: string,
    infaqPledge?: boolean,
    infaqPrice?: number
  ) => {
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = portion.price + addonsTotal;
    const itemSubtotal = unitPrice * quantity;

    const newItem: CartItem = {
      id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      dishId: dish.id,
      dishName: dish.name,
      dishImage: dish.image,
      selectedPortion: portion,
      selectedAddons: addons,
      specialInstructions: instructions,
      infaqPledgeSponsorship: infaqPledge,
      infaqPrice: infaqPledge ? infaqPrice || 13.0 : undefined,
      quantity,
      unitPrice,
      itemSubtotal,
    };

    setCart((prev) => [...prev, newItem]);
    showToast(`Added ${quantity}x ${dish.name} to your basket!`);
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: newQty,
            itemSubtotal: item.unitPrice * newQty,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from basket', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartFoodSubtotal = cart.reduce((sum, i) => sum + i.itemSubtotal, 0);
  const cartInfaqSubtotal = cart.reduce(
    (sum, i) => sum + (i.infaqPledgeSponsorship ? (i.infaqPrice || 13.0) * i.quantity : 0),
    0
  );

  const deliveryFee = deliveryType === 'delivery' ? BRAND.deliveryFeeFlat : 0.0;
  const packagingFee = cart.length > 0 ? 1.5 : 0.0;

  const applyPromo = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'BARAKAHFIRST' || normalized === 'MUMPRENEUR') {
      setAppliedPromo(normalized);
      showToast(`Promo ${normalized} applied! S$3.50 OFF`);
      return { success: true, message: 'Promo applied successfully' };
    }
    showToast('Invalid promo code. Try BARAKAHFIRST', 'error');
    return { success: false, message: 'Invalid code' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    showToast('Promo code removed', 'info');
  };

  const discountAmount = appliedPromo ? BRAND.defaultDiscount : 0.0;
  const rawTotal = cartFoodSubtotal + cartInfaqSubtotal + deliveryFee + packagingFee - discountAmount;
  const cartGrandTotal = Math.max(0, rawTotal);
  const cartGstAmount = (cartGrandTotal * 9) / 109;

  // Real Cloud Firestore Order Placement
  const placeOrder = async (details: {
    fulfillmentType: 'delivery' | 'pickup';
    dispatchDate: string;
    dispatchTimeSlot: string;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    driverNotes?: string;
    paymentMethod: 'paynow' | 'card';
  }): Promise<Order> => {
    if (!auth.currentUser) {
      setRedirectAfterAuth('checkout');
      showToast('Please sign in or create an account to complete your order.', 'error');
      navigateTo('welcome');
      throw new Error('Customer must be authenticated to place an order.');
    }

    if (cart.length === 0) {
      showToast('Your basket is empty. Please add delicious meals before checking out.', 'error');
      throw new Error('Cart is empty.');
    }

    setIsSubmittingOrder(true);
    const orderNumber = `NYM-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderDocData = {
      userId: auth.currentUser.uid,
      orderId: orderNumber,
      items: cart.map((item) => ({
        foodId: item.dishId,
        foodName: item.dishName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.itemSubtotal,
        portionName: item.selectedPortion.name,
      })),
      customerName: details.customerName.trim() || currentUser.name,
      customerPhone: details.customerPhone.trim() || currentUser.phone,
      fulfilmentMethod: details.fulfillmentType,
      deliveryAddress:
        details.fulfillmentType === 'delivery'
          ? details.deliveryAddress.trim()
          : 'Pasir Ris Kitchen Studio (Self-Collection)',
      orderDate: details.dispatchDate,
      orderTime: details.dispatchTimeSlot,
      specialInstructions: details.driverNotes ? details.driverNotes.trim() : '',
      subtotal: Number(cartFoodSubtotal.toFixed(2)),
      deliveryFee: Number(deliveryFee.toFixed(2)),
      gst: Number(cartGstAmount.toFixed(2)),
      totalAmount: Number(cartGrandTotal.toFixed(2)),
      status: 'confirmed',
      createdAt: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), orderDocData);

      const createdOrder: Order = {
        id: docRef.id,
        orderNumber,
        orderDate: details.dispatchDate,
        timestamp: Date.now(),
        status: 'Confirmed',
        paymentStatus: 'Paid',
        paymentMethod: details.paymentMethod,
        fulfillmentType: details.fulfillmentType,
        dispatchDate: details.dispatchDate,
        dispatchTimeSlot: details.dispatchTimeSlot,
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        deliveryAddress: details.deliveryAddress,
        driverNotes: details.driverNotes,
        items: [...cart],
        foodSubtotal: cartFoodSubtotal,
        infaqSubtotal: cartInfaqSubtotal,
        deliveryFee,
        packagingFee,
        discountAmount,
        promoCode: appliedPromo || undefined,
        gstAmount: cartGstAmount,
        totalPayable: cartGrandTotal,
      };

      setLatestOrder(createdOrder);
      clearCart();
      setIsSubmittingOrder(false);
      return createdOrder;
    } catch (error) {
      setIsSubmittingOrder(false);
      console.error('Error adding order to Cloud Firestore: ', error);
      handleFirestoreError(error, OperationType.CREATE, 'orders');
    }
  };

  // Real Cloud Firestore Booking Placement
  const createBooking = async (
    bookingData: Omit<Booking, 'id' | 'userId' | 'status' | 'createdAt'>
  ): Promise<string> => {
    if (!auth.currentUser) {
      setRedirectAfterAuth('orders');
      showToast('Please sign in to place a booking.', 'error');
      navigateTo('welcome');
      throw new Error('Authentication required');
    }

    try {
      const docRef = await addDoc(collection(db, 'bookings'), {
        ...bookingData,
        userId: auth.currentUser.uid,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      showToast('Booking confirmed successfully!');
      return docRef.id;
    } catch (error) {
      console.error('Error adding booking to Cloud Firestore: ', error);
      handleFirestoreError(error, OperationType.CREATE, 'bookings');
    }
  };

  // Infaq Pledge Submission
  const submitInfaqPledge = (pledge: {
    mosqueName: string;
    mealsCount: number;
    totalAmount: number;
    donorName: string;
    isAnonymous: boolean;
    donorPhone: string;
    doaDedication?: string;
    sendWhatsAppProof: boolean;
  }): InfaqPledge => {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const newPledge: InfaqPledge = {
      id: 'infaq-plg-' + Date.now(),
      refCode: `INF-2025-${randomCode}`,
      date:
        'Friday, ' +
        new Date().toLocaleDateString('en-SG', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: Date.now(),
      mosqueName: pledge.mosqueName,
      mealsCount: pledge.mealsCount,
      totalAmount: pledge.totalAmount,
      donorName: pledge.isAnonymous ? 'Anonymous Donor' : pledge.donorName,
      isAnonymous: pledge.isAnonymous,
      donorPhone: pledge.donorPhone,
      doaDedication: pledge.doaDedication,
      sendWhatsAppProof: pledge.sendWhatsAppProof,
      status: 'Pledged (Verified)',
    };

    setInfaqPledges((prev) => [newPledge, ...prev]);
    setLatestInfaqPledge(newPledge);
    setCurrentUser((prev) => ({
      ...prev,
      totalInfaqMeals: prev.totalInfaqMeals + pledge.mealsCount,
    }));
    return newPledge;
  };

  const activeOrder = orders.find(
    (o) =>
      o.status === 'Preparing in Kitchen' ||
      o.status === 'Pending Confirmation' ||
      o.status === 'Confirmed' ||
      o.status === 'Out for Delivery' ||
      o.status === 'Ready for Collection'
  );

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        screenHistory,
        navigateTo,
        goBack,
        currentUser,
        firebaseUser,
        isAuthenticated: !!firebaseUser,
        isAuthLoading,
        redirectAfterAuth,
        setRedirectAfterAuth,
        signIn,
        signOut,
        createAccount,
        updateProfile,
        dishes: DISHES,
        selectedDishId,
        selectedDish,
        setSelectedDishId,
        favoriteDishIds,
        toggleFavorite,
        cart,
        addToCart,
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
        orders,
        ordersLoading,
        ordersError,
        refreshOrders,
        activeOrder,
        selectedOrder,
        setSelectedOrder,
        latestOrder,
        isSubmittingOrder,
        placeOrder,
        bookings,
        bookingsLoading,
        createBooking,
        infaqPledges,
        latestInfaqPledge,
        submitInfaqPledge,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
