/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

import { WelcomeScreen } from './screens/WelcomeScreen';
import { CreateAccountScreen } from './screens/CreateAccountScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MenuScreen } from './screens/MenuScreen';
import { FoodDetailsScreen } from './screens/FoodDetailsScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { OrderConfirmationScreen } from './screens/OrderConfirmationScreen';
import { OrdersScreen } from './screens/OrdersScreen';
import { InfaqScreen } from './screens/InfaqScreen';
import { InfaqConfirmationScreen } from './screens/InfaqConfirmationScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainAppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen />;
      case 'create-account':
        return <CreateAccountScreen />;
      case 'home':
        return <HomeScreen />;
      case 'menu':
        return <MenuScreen />;
      case 'food-details':
        return <FoodDetailsScreen />;
      case 'cart':
        return <CartScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'order-confirmation':
        return <OrderConfirmationScreen />;
      case 'orders':
        return <OrdersScreen />;
      case 'infaq':
        return <InfaqScreen />;
      case 'infaq-confirmation':
        return <InfaqConfirmationScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col items-center">
      <div className="w-full max-w-md bg-[#faf9f5] min-h-screen flex flex-col relative shadow-xl overflow-x-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Screen View */}
        <main className="flex-1 flex flex-col w-full">
          {renderScreen()}
        </main>

        {/* Global Floating Bottom Navigation */}
        <BottomNav />

        {/* Global Toast Alert */}
        <Toast />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
