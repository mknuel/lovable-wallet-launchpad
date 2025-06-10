
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from '../../store/reducers/walletSlice';
import { PATH_WALLET, PATH_SEND_TOKENS } from "../../context/paths";

const WalletActionsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletData } = useSelector((state) => state.wallet);

  // Fetch wallet data on component mount
  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  // Use real wallet data for stats
  const statsData = walletData?.data ? [
    { id: 'tokens', value: walletData.data.token || '0', label: 'Tokens' },
    { id: 'crypto', value: walletData.data.balance || '0', label: 'Crypto' },
    { id: 'loans', value: '0', label: 'Loans' }
  ] : [
    { id: 'tokens', value: '234', label: 'Tokens' },
    { id: 'crypto', value: '190', label: 'Crypto' },
    { id: 'loans', value: '715', label: 'Loans' }
  ];

  const actionOptions = [
    {
      id: 'send',
      label: 'Send your tokens to another DAO member or invite someone by phone to receive them',
      action: () => navigate(PATH_SEND_TOKENS)
    },
    {
      id: 'exchange',
      label: 'Exchange your tokens to EURX (€ Euro) or other Cryptocurrency',
      action: () => console.log('Exchange action triggered')
    },
    {
      id: 'loan',
      label: 'Request Loan with your tokens',
      action: () => console.log('Loan action triggered')
    }
  ];

  const handleActionSelect = (option) => {
    console.log('Action selected:', option.id);
    option.action();
  };

  const handleBackClick = () => {
    navigate(PATH_WALLET);
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white overflow-hidden">
      {/* Header - Fixed positioning */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
        <Header
          title="My Wallet"
          action={true}
          onBack={handleBackClick}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-[66px] mb-[80px]">
        {/* Stats Card */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {/* Action Options */}
        <div className="w-full mb-8 space-y-4">
          {actionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleActionSelect(option)}
              className="w-full max-w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-colors text-left"
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>
      </div>

      {/* Navigation - Fixed positioning */}
      <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default WalletActionsScreen;
