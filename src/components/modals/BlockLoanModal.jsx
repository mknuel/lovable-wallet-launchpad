import React, { useState, useEffect } from 'react';
import { useActiveWallet } from 'thirdweb/react';
import CommonButton from '../Buttons/CommonButton';
import { isBorrower, getBorrowerDetails } from '../../utils/blockLoanHelpers';

const BlockLoanModal = ({ 
  isOpen, 
  onClose, 
  title, 
  actionType, 
  onConfirm, 
  isLoading,
  userBalance = 0
}) => {
  const activeWallet = useActiveWallet();
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('30'); // days
  const [interestRate, setInterestRate] = useState('5'); // percentage
  const [borrowerName, setBorrowerName] = useState('');
  const [isUserBorrower, setIsUserBorrower] = useState(false);
  const [borrowerData, setBorrowerData] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    const checkBorrowerStatus = async () => {
      if (activeWallet) {
        const account = activeWallet.getAccount();
        const borrowerStatus = await isBorrower(account?.address);
        setIsUserBorrower(borrowerStatus);
        
        if (borrowerStatus) {
          const details = await getBorrowerDetails(account?.address);
          setBorrowerData(details);
        }
      }
    };

    if (isOpen) {
      checkBorrowerStatus();
    }
  }, [activeWallet, isOpen]);

  const handleConfirm = async () => {
    if (!amount && actionType !== 'register') return;

    try {
      let result;
      
      switch (actionType) {
        case 'deposit':
          result = await onConfirm(amount);
          break;
        case 'borrow':
          if (!isUserBorrower) {
            setShowRegistration(true);
            return;
          }
          result = await onConfirm(amount, duration, interestRate);
          break;
        case 'register':
          result = await onConfirm(borrowerName);
          break;
        case 'repay':
          result = await onConfirm(amount);
          break;
        default:
          return;
      }
      
      if (result) {
        onClose();
        setAmount('');
        setDuration('30');
        setInterestRate('5');
        setBorrowerName('');
        setShowRegistration(false);
      }
    } catch (error) {
      console.error('Modal action failed:', error);
    }
  };

  const handleRegisterFirst = () => {
    setShowRegistration(true);
  };

  const handleRegistrationComplete = async () => {
    try {
      await onConfirm(borrowerName, 'register');
      setShowRegistration(false);
      setIsUserBorrower(true);
      // Continue with original borrow action after registration
      setTimeout(() => {
        handleConfirm();
      }, 1000);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Registration Form */}
        {(actionType === 'register' || showRegistration) && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            <CommonButton
              onClick={showRegistration ? handleRegistrationComplete : handleConfirm}
              disabled={!borrowerName.trim() || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Registering...' : 'Register as Borrower'}
            </CommonButton>
          </div>
        )}

        {/* Borrow - Check Registration */}
        {actionType === 'borrow' && !isUserBorrower && !showRegistration && (
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              You need to register as a borrower before applying for loans.
            </p>
            <CommonButton
              onClick={handleRegisterFirst}
              className="w-full"
            >
              Register as Borrower
            </CommonButton>
          </div>
        )}

        {/* Borrow Form */}
        {actionType === 'borrow' && isUserBorrower && !showRegistration && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount in USD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Loan duration in days"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Annual interest rate"
              />
            </div>
            <CommonButton
              onClick={handleConfirm}
              disabled={!amount || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Application...' : 'Apply for Loan'}
            </CommonButton>
          </div>
        )}

        {/* Deposit Form */}
        {actionType === 'deposit' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount in USD"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum deposit: $20 USD (≈0.01 MATIC)
              </p>
            </div>
            <CommonButton
              onClick={handleConfirm}
              disabled={!amount || parseFloat(amount) < 20 || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Depositing...' : 'Deposit MATIC'}
            </CommonButton>
          </div>
        )}

        {/* Repay Form */}
        {actionType === 'repay' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repayment Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter repayment amount"
              />
              <p className="text-sm text-gray-500 mt-1">
                Available balance: ${(userBalance * 2000).toFixed(2)} USD
              </p>
            </div>
            <CommonButton
              onClick={handleConfirm}
              disabled={!amount || isLoading}
              isLoading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Processing Repayment...' : 'Repay Loan'}
            </CommonButton>
          </div>
        )}

        {/* Borrower Info */}
        {borrowerData && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800">
              Registered as: {borrowerData.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockLoanModal;