import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveWallet } from 'thirdweb/react';
import { ActionCard } from '../../components/layout/ActionCard';
import { ActionGrid } from '../../components/layout/ActionGrid';
import MainHeader from '../../components/layout/MainHeader';
import { StatsCard } from '../../components/layout/StatsCard';
import Navigation from '../../components/layout/Navigation';
import { AaveConfirmationModal } from '../../components/modals/AaveConfirmationModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSelector } from 'react-redux';
import {
  selectWalletData,
  selectWalletLoading,
  selectWalletError,
} from '../../store/reducers/walletSlice';
import { selectUser } from '../../store/reducers/userSlice';
import { 
  supplySepoliaETH, 
  borrowETH, 
  repayETH, 
  getUserAccountData,
  getTokenBalance
} from '../../utils/aaveHelpers';

const BlockLoansScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const activeWallet = useActiveWallet();
  
  const walletData = useSelector(selectWalletData);
  const walletLoading = useSelector(selectWalletLoading);
  const walletError = useSelector(selectWalletError);
  const user = useSelector(selectUser);

  // Modal states
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: '',
    title: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    balance: 0,
    totalCollateral: 0,
    totalDebt: 0,
    availableBorrows: 0,
    healthFactor: 0
  });

  // Load user stats
  const loadStats = useCallback(async () => {
    if (!activeWallet) return;
    
    try {
      const account = activeWallet.getAccount();
      const accountData = await getUserAccountData(account.address);
      
      setStats({
        balance: 0, // ETH balance would need separate call
        totalCollateral: accountData.totalCollateralETH,
        totalDebt: accountData.totalDebtETH,
        availableBorrows: accountData.availableBorrowsETH,
        healthFactor: accountData.healthFactor
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, [activeWallet]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 18) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  const formatETH = (amount) => {
    return `${parseFloat(amount).toFixed(4)} ETH`;
  };

  const openModal = (type, title) => {
    setModalConfig({
      isOpen: true,
      type,
      title
    });
  };

  const closeModal = () => {
    setModalConfig({
      isOpen: false,
      type: '',
      title: ''
    });
  };

  const handleConfirmAction = async (...args) => {
    if (!activeWallet) {
      throw new Error('Please connect your wallet first');
    }

    setLoading(true);
    
    try {
      const account = activeWallet.getAccount();
      let result;

      switch (modalConfig.type) {
        case 'deposit':
          const [amount] = args;
          console.log('=== SUPPLYING ETH AS COLLATERAL ===');
          result = await supplySepoliaETH(account, amount);
          break;
        case 'borrow':
          const [borrowAmount] = args;
          
          console.log('=== STARTING AAVE BORROW PROCESS ===');
          
          // Check if user has collateral before borrowing
          const accountData = await getUserAccountData(account.address);
          console.log('User account data:', accountData);
          
          if (accountData.totalCollateralETH === 0) {
            throw new Error('You need to supply collateral (deposit ETH) before you can borrow.');
          }
          
          if (parseFloat(borrowAmount) > accountData.availableBorrowsETH) {
            throw new Error(`Cannot borrow ${borrowAmount} ETH. Maximum available: ${accountData.availableBorrowsETH.toFixed(4)} ETH`);
          }
          
          result = await borrowETH(account, borrowAmount);
          console.log('=== AAVE BORROW PROCESS COMPLETED ===');
          break;
        case 'repay':
          const [repayAmount] = args;
          console.log('=== REPAYING AAVE LOAN ===');
          result = await repayETH(account, repayAmount);
          break;
        default:
          throw new Error('Unknown action type');
      }

      // Reload stats after successful transaction
      await loadStats();
      closeModal();
      return result.message;

    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <MainHeader 
        title="Aave Lending" 
        action={true} 
        onBack={() => navigate('/main')} 
      />

      {/* Main Content */}
      <div className="px-4 pt-6 pb-24">
        {/* Greeting */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {getGreeting()}
          </h2>
          <p className="text-gray-600">
            Supply, borrow, and manage your assets with Aave v3 on Sepolia
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatsCard 
            title="Total Collateral" 
            value={formatETH(stats.totalCollateral)} 
            icon="💰"
          />
          <StatsCard 
            title="Total Debt" 
            value={formatETH(stats.totalDebt)} 
            icon="📄"
          />
          <StatsCard 
            title="Available Borrows" 
            value={formatETH(stats.availableBorrows)} 
            icon="🏦"
          />
          <StatsCard 
            title="Health Factor" 
            value={stats.healthFactor > 0 ? stats.healthFactor.toFixed(2) : "∞"} 
            icon="❤️"
          />
        </div>

        {/* Action Grid */}
        <ActionGrid>
          <ActionCard
            title="Supply ETH"
            description="Deposit ETH as collateral to earn interest"
            icon="💳"
            onClick={() => openModal('deposit', 'Supply ETH as Collateral')}
          />
          <ActionCard
            title="Borrow ETH"
            description="Borrow ETH against your collateral"
            icon="💰"
            onClick={() => openModal('borrow', 'Borrow ETH')}
          />
          <ActionCard
            title="Repay Loan"
            description="Repay your borrowed ETH"
            icon="💸"
            onClick={() => openModal('repay', 'Repay ETH Loan')}
          />
          <ActionCard
            title="Aave Protocol"
            description="Powered by Aave v3 on Sepolia"
            icon="🏛️"
            onClick={() => window.open('https://app.aave.com/', '_blank')}
          />
        </ActionGrid>
      </div>

      {/* Navigation */}
      <Navigation nav="BlockLoans" />

      {/* Modal */}
      <AaveConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        title={modalConfig.title}
        onConfirm={handleConfirmAction}
        isLoading={loading}
        actionType={modalConfig.type}
        maxBorrowAmount={stats.availableBorrows}
        accountData={stats}
      />
    </div>
  );
};

export default BlockLoansScreen;