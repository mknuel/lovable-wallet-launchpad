
import React from "react";
import { Header } from "../../components/layout/Header";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import { ActionButton } from "../../components/layout/ActionButton";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";

const WalletScreen = ({ onBack, walletData }) => {
  const { t } = useTranslation();

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

  const handleMenuClick = () => {
    console.log('Menu clicked');
  };

  const handleNotificationClick = () => {
    console.log('Notifications clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  const handleNextClick = () => {
    console.log('Next button clicked');
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
      {/* Header - Fixed positioning - Same as main menu */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
        <Header 
          onMenuClick={handleMenuClick}
          onNotificationClick={handleNotificationClick}
          onSettingsClick={handleSettingsClick}
        />
      </div>

      {/* Main Content - Scrollable with top margin to account for fixed header - Same as main menu */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 py-6 mt-[66px] mb-[80px]">
        {/* Stats Card - Same as main menu */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {/* Menu Section - Same layout as main menu but with wallet options */}
        <div className="w-full mb-8">
          <MenuSection menuItems={menuItems} />
        </div>

        {/* Action Button - Same as main menu */}
        <div className="w-full">
          <ActionButton 
            onClick={handleNextClick}
            ariaLabel="Proceed to next step"
          >
            next
          </ActionButton>
        </div>
      </div>

      {/* Navigation - Fixed positioning - Same as main menu */}
      <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default WalletScreen;
