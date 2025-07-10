import React from 'react';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { ActionGrid } from '../../components/layout/ActionGrid';
import { SwapBottomNavigation } from '../../components/swap/SwapBottomNavigation';
import { useTranslation } from '../../hooks/useTranslation';

const BlockLoansScreen = () => {
  const { t } = useTranslation();

  // Mock stats data - replace with actual data
  const statsData = [
    { id: 1, value: '234', label: 'Tokens' },
    { id: 2, value: '190', label: 'Crypto' },
    { id: 3, value: '715', label: 'Loans' },
  ];

  const handleDepositClick = () => {
    console.log('Deposit clicked');
    // Add navigation or action logic
  };

  const handleBorrowClick = () => {
    console.log('Borrow clicked');
    // Add navigation or action logic
  };

  const handleStakeClick = () => {
    console.log('Stake clicked');
    // Add navigation or action logic
  };

  const handleRepayClick = () => {
    console.log('Repay clicked');
    // Add navigation or action logic
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        onNotificationClick={handleNotificationClick}
        onSettingsClick={handleSettingsClick}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 gap-6">
        {/* Stats Card */}
        <div className="w-full max-w-sm">
          <StatsCard stats={statsData} />
        </div>

        {/* Action Grid */}
        <ActionGrid
          onDepositClick={handleDepositClick}
          onBorrowClick={handleBorrowClick}
          onStakeClick={handleStakeClick}
          onRepayClick={handleRepayClick}
        />

        {/* Active Tokens Section */}
        <div className="w-full max-w-sm mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ACTIVE TOKENS</h2>
          {/* Add token list here */}
          <div className="text-gray-500 text-center py-8">
            No active tokens to display
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <SwapBottomNavigation />
    </div>
  );
};

export default BlockLoansScreen;