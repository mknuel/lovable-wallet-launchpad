
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
import { SwapBottomNavigation } from "../../components/swap/SwapBottomNavigation";
import { useTranslation } from "../../hooks/useTranslation";
import { SwapForm } from "../../components/swap/SwapForm";
import { SecurityMessage } from "../../components/swap/SecurityMessage";
import { PATH_WALLET_ACTIONS } from "../../context/paths";

const SwapCurrencyScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSwapSubmit = (data) => {
    console.log('Swap data:', data);
    // Handle swap logic here
    alert(`Swapping ${data.fromAmount} ${data.fromCurrency} to ${data.toAmount} ${data.toCurrency}`);
  };

  const handleBackClick = () => {
    navigate(PATH_WALLET_ACTIONS);
  };

  const handleNavigation = (item) => {
    console.log('Navigate to:', item);
    // Handle navigation logic here
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header - Fixed positioning */}
      <div className="w-full sticky top-0 left-0 right-0 z-50 bg-white">
        <Header
          title="Swap"
          action={true}
          onBack={handleBackClick}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-4 overflow-hidden">
        <SwapForm onSubmit={handleSwapSubmit} />
        
        <div className="mt-6">
          <SecurityMessage />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white">
        <SwapBottomNavigation 
          items={[
            { id: 'messages', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ce980df59d2e45dfb2487bd1a267aa68c36d3c53?placeholderIfAbsent=true', label: 'Messages', onClick: () => handleNavigation('messages') },
            { id: 'dial1', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/03214bd6d68edcb29752f62522e6e5d597d50a77?placeholderIfAbsent=true', label: 'Dial', onClick: () => handleNavigation('dial1') },
            { id: 'dial2', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/44f4a511f05e8c6b1ae70f88f11a8032039468d4?placeholderIfAbsent=true', label: 'Dial', onClick: () => handleNavigation('dial2') },
            { id: 'dial3', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/9ef795a7e666f34dfeea6d31613d944f0b087e8c?placeholderIfAbsent=true', label: 'Dial', onClick: () => handleNavigation('dial3') },
            { id: 'dial4', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/34f0183867c6f73a05b1fb8d01546f290af7320b?placeholderIfAbsent=true', label: 'Dial', onClick: () => handleNavigation('dial4') },
            { id: 'contact', icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/1feb2a6cba270cf15db25be6dab70b3c838d28fe?placeholderIfAbsent=true', label: 'Contact', onClick: () => handleNavigation('contact') },
          ]}
        />
      </div>

      {/* Navigation - Swap steps navigation */}
      <div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav="Swap" />
      </div>
    </div>
  );
};

export default SwapCurrencyScreen;
