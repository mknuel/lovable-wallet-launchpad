import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveWallet } from 'thirdweb/react';
import MainHeader from '../../components/layout/MainHeader';
import { StatsCard } from '../../components/layout/StatsCard';
import { ActionGrid } from '../../components/layout/ActionGrid';
import Navigation from '../../components/layout/Navigation';
import BlockLoanModal from '../../components/modals/BlockLoanModal';
import { useTranslation } from '../../hooks/useTranslation';
import { useSelector } from 'react-redux';
import {
  selectWalletData,
  selectWalletLoading,
  selectWalletError,
} from '../../store/reducers/walletSlice';
import { 
  depositMatic, 
  createLoanApplication, 
  repayLoan, 
  getUserBalance, 
  getNumApplications, 
  getNumLoans, 
  createBorrower,
  isBorrower 
} from '../../utils/blockLoanHelpers';

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
  const [selectedAction, setSelectedAction] = useState('deposit');
  const [blockLoanData, setBlockLoanData] = useState({
    userBalance: 0,
    numApplications: 0,
    numLoans: 0
  });

  // Load BlockLoan data when wallet connects
  useEffect(() => {
    const loadBlockLoanData = async () => {
      if (activeWallet) {
        try {
          const account = activeWallet.getAccount();
          console.log('Loading BlockLoan data for:', account?.address);
          
          const [userBalance, numApplications, numLoans] = await Promise.all([
            getUserBalance(account?.address),
            getNumApplications(),
            getNumLoans()
          ]);
          
          setBlockLoanData({
            userBalance,
            numApplications,
            numLoans
          });
          
          console.log('BlockLoan data loaded:', { userBalance, numApplications, numLoans });
        } catch (error) {
          console.error('Error loading BlockLoan data:', error);
          showNotification(`Error loading BlockLoan data: ${error.message}`, 'error');
        }
      }
    };
    
    loadBlockLoanData();
  }, [activeWallet]);

  // Use BlockLoan data for stats
  const statsData = useMemo(() => {
    const baseStats = walletData?.data
      ? [
          {
            id: "tokens",
            value: walletData.data.token || "0",
            label: t("wallet.tokens"),
          },
          {
            id: "crypto", 
            value: Math.round(blockLoanData.userBalance * 2000).toString(), // Convert MATIC to USD
            label: t("wallet.crypto"),
          }
        ]
      : [
          { id: "tokens", value: "0", label: t("wallet.tokens") },
          { id: "crypto", value: Math.round(blockLoanData.userBalance * 2000).toString(), label: t("wallet.crypto") }
        ];

    // Add BlockLoan data
    const loansValue = blockLoanData.numLoans.toString();
    baseStats.push({ id: "loans", value: loansValue, label: t("wallet.loans") });

    return baseStats;
  }, [walletData, blockLoanData, t]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: '', type: '' }), 5000);
  };

  const handleDepositClick = () => {
    setSelectedAction('deposit');
    setModalConfig({
      isOpen: true,
      type: 'deposit',
      title: 'Deposit MATIC'
    });
  };

  const handleBorrowClick = () => {
    setSelectedAction('borrow');
    setModalConfig({
      isOpen: true,
      type: 'borrow',
      title: 'Apply for Loan'
    });
  };

  const handleStakeClick = () => {
    setSelectedAction('stake');
    showNotification('Staking allows you to grant loans to borrowers and earn interest!', 'info');
  };

  const handleRepayClick = () => {
    setSelectedAction('repay');
    setModalConfig({
      isOpen: true,
      type: 'repay',
      title: 'Repay Loan'
    });
  };

  const handleModalClose = () => {
    setModalConfig({ isOpen: false, type: '', title: '' });
  };

  const handleConfirmAction = async (...args) => {
    if (!activeWallet) {
      return Promise.reject(new Error('Please connect your wallet first'));
    }

    setIsTransactionLoading(true);
    
    try {
      const account = activeWallet.getAccount();
      let result;

      switch (modalConfig.type) {
        case 'deposit':
          const [amount] = args;
          result = await depositMatic(account, amount);
          break;
        case 'borrow':
          const [loanAmount] = args;
          
          // Check if user is registered as borrower first
          const isBorrowerRegistered = await isBorrower(account.address);
          if (!isBorrowerRegistered) {
            throw new Error('You must register as a borrower first. Please contact support.');
          }
          
          // Use default values for duration (30 days) and interest rate (5%)
          const duration = 30;
          const interestRate = 5;
          console.log('Creating loan application with:', { loanAmount, duration, interestRate });
          result = await createLoanApplication(account, duration, interestRate, loanAmount);
          break;
        case 'repay':
          const [repayAmount] = args;
          console.log('Attempting to repay loan with amount:', repayAmount);
          
          // Check if user has any loans to repay
          const userBalance = await getUserBalance(account.address);
          if (userBalance <= 0) {
            throw new Error('No active loans found to repay.');
          }
          
          // For now, use simple repayment - in real app you'd calculate interest and time
          result = await repayLoan(account, repayAmount, repayAmount * 0.05, 30);
          break;
        case 'register':
          const [borrowerName] = args;
          result = await createBorrower(account, borrowerName);
          break;
        default:
          throw new Error('Unknown action type');
      }

      if (result.success) {
        // Reload BlockLoan data after successful transaction
        const [userBalance, numApplications, numLoans] = await Promise.all([
          getUserBalance(account?.address),
          getNumApplications(),
          getNumLoans()
        ]);
        
        setBlockLoanData({
          userBalance,
          numApplications,
          numLoans
        });
        
        showNotification(result.message, 'success');
        return Promise.resolve(result.message);
      } else {
        return Promise.reject(new Error(result.message));
      }
    } catch (error) {
      console.error('Transaction failed:', error);
      let errorMessage = error.message || 'Transaction failed';
      
      // Show helpful message for insufficient balance
      if (errorMessage.includes('Insufficient')) {
        errorMessage += '\n\nMake sure you have enough MATIC in your wallet for the transaction and gas fees.';
      }
      
      showNotification(errorMessage, 'error');
      return Promise.reject(new Error(errorMessage));
    } finally {
      setIsTransactionLoading(false);
    }
  };

  const handleBackClick = () => {
    navigate('/main');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <MainHeader title="BlockLoans" action={true} onBack={handleBackClick} />

      {/* Notification */}
      {notification.message && (
        <div
          className={`mx-4 mt-4 p-3 rounded-lg text-sm ${
            notification.type === "success"
              ? "bg-green-100 text-green-800"
              : notification.type === "error"
              ? "bg-red-100 text-red-800"
              : "bg-blue-100 text-blue-800"
          }`}>
          {notification.message}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-6 gap-6">
        {/* Stats Card */}
        <div className="w-full">
          <StatsCard stats={statsData} />
        </div>

        {/* Action Grid */}
        <ActionGrid
          onDepositClick={handleDepositClick}
          onBorrowClick={handleBorrowClick}
          onStakeClick={handleStakeClick}
          onRepayClick={handleRepayClick}
          selectedAction={selectedAction}
        />

        {/* Active Tokens Section */}
        <div className="w-full max-w-sm mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            ACTIVE TOKENS
          </h2>
          <div className="text-gray-500 text-center py-8">
            Connect wallet to view your BlockLoan positions
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Fixed to bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Navigation nav="BlockLoans" />
      </div>

      {/* BlockLoan Modal */}
      <BlockLoanModal
        isOpen={modalConfig.isOpen}
        onClose={handleModalClose}
        title={modalConfig.title}
        actionType={modalConfig.type}
        onConfirm={handleConfirmAction}
        isLoading={isTransactionLoading}
        userBalance={blockLoanData.userBalance}
      />
    </div>
  );
};

export default BlockLoansScreen;