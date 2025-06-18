
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import Navigation from "../../components/layout/Navigation";
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

      {/* Navigation - Fixed positioning with swap steps */}
      <div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav="Swap" />
      </div>
    </div>
  );
};

export default SwapCurrencyScreen;
