
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from '../../store/reducers/walletSlice';
import { PATH_MAIN, PATH_WALLET_ACTIONS } from "../../context/paths";

const WalletScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletData, isLoading: walletLoading, error: walletError } = useSelector((state) => state.wallet);

  // Fetch wallet data on component mount
  useEffect(() => {
    console.log("WalletScreen component mounted, dispatching fetchWallet...");
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
    navigate(PATH_WALLET_ACTIONS);
  };

  const handleBackClick = () => {
    navigate(PATH_MAIN);
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

        {/* Menu Section */}
        <div className="w-full mb-8">
          <MenuSection menuItems={menuItems} />
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Action Button */}
        <div className="w-full mb-5">
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
