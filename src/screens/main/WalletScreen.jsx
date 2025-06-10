
import React, { useState } from "react";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import { ActionButton } from "../../components/layout/ActionButton";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import WalletActionsScreen from "./WalletActionsScreen";

const WalletScreen = ({ onBack, walletData }) => {
  const { t } = useTranslation();
  const [showActionsScreen, setShowActionsScreen] = useState(false);

  // Use the same default stats data as main menu
  const statsData = [
    { id: 'tokens', value: '234', label: 'Tokens' },
    { id: 'crypto', value: '190', label: 'Crypto' },
    { id: 'loans', value: '715', label: 'Loans' }
  ];

  // Wallet-specific menu items
  const menuItems = [
    { 
      id: 'send', 
      label: 'Send tokens',
      onClick: () => console.log('Send tokens clicked')
    },
    { 
      id: 'exchange', 
      label: 'Exchange tokens',
      onClick: () => console.log('Exchange tokens clicked')
    },
    { 
      id: 'loan', 
      label: 'Request Loan with your tokens',
      onClick: () => console.log('Request loan clicked')
    }
  ];

  const handleNextClick = () => {
    setShowActionsScreen(true);
  };

  const handleBackFromActions = () => {
    setShowActionsScreen(false);
  };

  if (showActionsScreen) {
    return (
      <WalletActionsScreen 
        onBack={handleBackFromActions}
        walletData={walletData}
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white overflow-hidden">
      {/* Header - Using MainHeader like profile screen */}
      <Header
        title="My Wallet"
        action={true}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden">
        {/* Stats Card */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {/* Menu Section */}
        <div className="w-full mb-8">
          <MenuSection menuItems={menuItems} />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Action Button */}
        <div className="w-full">
          <button
            onClick={handleNextClick}
            className="w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90
              transition-all duration-200 flex items-center justify-center"
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Navigation - Fixed positioning */}
      <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default WalletScreen;
