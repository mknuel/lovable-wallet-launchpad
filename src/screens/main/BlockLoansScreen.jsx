import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveWallet } from 'thirdweb/react';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { ActionGrid } from '../../components/layout/ActionGrid';
import { SwapBottomNavigation } from '../../components/swap/SwapBottomNavigation';
import { AaveActionModal } from '../../components/modals/AaveActionModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSelector } from 'react-redux';
import {
  selectWalletData,
  selectWalletLoading,
  selectWalletError,
} from '../../store/reducers/walletSlice';
import { supplyDAI, borrowWETH, repayWETH, getTokenBalance, CONTRACTS } from '../../utils/aaveHelpers';

const BlockLoansScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activeWallet = useActiveWallet();
  
  // Use the same wallet data as MainMenu
  const walletData = useSelector(selectWalletData);
  const walletLoading = useSelector(selectWalletLoading);
  const walletError = useSelector(selectWalletError);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    title: ''
  });
  const [isTransactionLoading, setIsTransactionLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  // Use the same stats calculation as MainMenu
  const statsData = useMemo(() => {
    return walletData?.data
      ? [
          {
            id: "tokens",
            value: walletData.data.token || "0",
            label: t("wallet.tokens"),
          },
          {
            id: "crypto", 
            value: walletData.data.balance || "0",
            label: t("wallet.crypto"),
          },
          { id: "loans", value: "0", label: t("wallet.loans") },
        ]
      : [
          { id: "tokens", value: "0", label: t("wallet.tokens") },
          { id: "crypto", value: "0", label: t("wallet.crypto") },
          { id: "loans", value: "0", label: t("wallet.loans") },
        ];
  }, [walletData, t]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleDepositClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'deposit',
      title: 'Supply DAI to Aave'
    });
  };

  const handleBorrowClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'borrow',
      title: 'Borrow WETH from Aave'
    });
  };

  const handleStakeClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'stake',
      title: 'Stake AAVE Tokens'
    });
  };

  const handleRepayClick = () => {
    setModalConfig({
      isOpen: true,
      type: 'repay',
      title: 'Repay WETH to Aave'
    });
  };

  const handleModalClose = () => {
    setModalConfig({ isOpen: false, type: '', title: '' });
  };

  const handleConfirmAction = async (amount) => {
    if (!activeWallet) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }

    setIsTransactionLoading(true);
    
    try {
      const signer = await activeWallet.getSigner();
      let result;

      switch (modalConfig.type) {
        case 'deposit':
          result = await supplyDAI(signer, amount);
          break;
        case 'borrow':
          result = await borrowWETH(signer, amount);
          break;
        case 'repay':
          result = await repayWETH(signer, amount);
          break;
        case 'stake':
          showNotification('Staking functionality coming soon!', 'info');
          return;
        default:
          throw new Error('Unknown action type');
      }

      if (result.success) {
        showNotification(result.message, 'success');
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      showNotification(error.message || 'Transaction failed', 'error');
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleNotificationClick = () => {
    console.log('Notification clicked');
  };

  const handleSettingsClick = () => {
    navigate('/setting');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        onNotificationClick={handleNotificationClick}
        onSettingsClick={handleSettingsClick}
      />
      
      {/* Notification */}
      {notification.message && (
        <div className={`mx-4 mt-4 p-3 rounded-lg text-sm ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' :
          notification.type === 'error' ? 'bg-red-100 text-red-800' :
          'bg-blue-100 text-blue-800'
        }`}>
          {notification.message}
        </div>
      )}
      
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
            Connect wallet to view your Aave positions
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <SwapBottomNavigation />

      {/* Aave Action Modal */}
      <AaveActionModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        title={modalConfig.title}
        actionType={modalConfig.type}
        onConfirm={handleConfirmAction}
        isLoading={isTransactionLoading}
      />
    </div>
  );
};

export default BlockLoansScreen;