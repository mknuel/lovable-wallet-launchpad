import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CommonButton from '../Buttons/CommonButton';

export const AaveConfirmationModal = ({ 
  isOpen, 
  onClose, 
  title, 
  onConfirm, 
  isLoading = false,
  actionType = 'deposit',
  maxBorrowAmount = 0,
  accountData = null
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Animation variants for the modal backdrop
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Animation variants for the modal panel
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 15, stiffness: 200 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      await onConfirm(amount);
      setSuccess('Transaction completed successfully!');
      setTimeout(() => {
        setAmount('');
        setSuccess('');
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Transaction failed');
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    setSuccess('');
    onClose();
  };

  const getActionText = () => {
    switch (actionType) {
      case 'deposit': return 'Supply';
      case 'borrow': return 'Borrow';
      case 'repay': return 'Repay';
      case 'stake': return 'Stake';
      default: return 'Confirm';
    }
  };

  const getTokenInfo = () => {
    switch (actionType) {
      case 'deposit': return { symbol: 'ETH', description: 'Supply Sepolia ETH to earn interest' };
      case 'borrow': return { symbol: 'WETH', description: 'Borrow WETH with variable rate' };
      case 'repay': return { symbol: 'WETH', description: 'Repay your WETH debt' };
      case 'stake': return { symbol: 'AAVE', description: 'Stake AAVE tokens (coming soon)' };
      default: return { symbol: 'TOKEN', description: '' };
    }
  };

  const { symbol, description } = getTokenInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/20 bg-opacity-60"
            variants={backdropVariants}
            onClick={handleClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white w-full max-w-sm p-6 rounded-2xl shadow-xl"
            variants={modalVariants}
          >
            {/* Success State */}
            {success && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  Success!
                </h3>
                <p className="text-center text-gray-600 mb-6">
                  {success}
                </p>
              </div>
            )}

            {/* Error State */}
            {error && !success && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  Transaction Failed
                </h3>
                <p className="text-center text-red-600 mb-6 text-sm">
                  {error}
                </p>
                <div className="mt-6">
                  <CommonButton
                    onClick={handleClose}
                    className="w-full py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
                  >
                    <span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
                      Try Again
                    </span>
                  </CommonButton>
                </div>
              </div>
            )}

            {/* Normal State */}
            {!success && !error && (
              <>
                {/* Title */}
                <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-center text-gray-600 mb-4 text-sm">
                  {description}
                </p>

                {/* Account Info for Borrowing */}
                {actionType === 'borrow' && accountData && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4 space-y-2">
                    <div className="text-sm font-medium text-blue-900 mb-2">Account Summary:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-blue-700">Collateral:</span>
                        <div className="font-medium">{(Number(accountData.totalCollateralETH) / 1e18).toFixed(4)} ETH</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Current Debt:</span>
                        <div className="font-medium">{(Number(accountData.totalDebtETH) / 1e18).toFixed(4)} ETH</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-blue-700">Available to Borrow:</span>
                        <div className="font-medium text-blue-800">{maxBorrowAmount.toFixed(4)} ETH</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ({symbol})
                    {actionType === 'borrow' && maxBorrowAmount > 0 && (
                      <span className="text-blue-600 font-normal ml-1">(Max: {maxBorrowAmount.toFixed(4)})</span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.000001"
                      min="0"
                      max={actionType === 'borrow' ? maxBorrowAmount : undefined}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center font-medium"
                      placeholder={`Enter ${symbol} amount`}
                      disabled={isLoading || actionType === 'stake'}
                    />
                    {actionType === 'borrow' && maxBorrowAmount > 0 && (
                      <button
                        type="button"
                        onClick={() => setAmount(maxBorrowAmount.toString())}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                      >
                        Max
                      </button>
                    )}
                  </div>
                </div>

                {/* Stake Coming Soon Message */}
                {actionType === 'stake' && (
                  <div className="text-center text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg mb-4">
                    Staking functionality coming soon!
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-gray-200 -mx-6 mb-6"></div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <CommonButton
                    onClick={handleSubmit}
                    disabled={isLoading || !amount || actionType === 'stake'}
                    className="w-full py-3 font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all"
                  >
                    <span className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
                      {isLoading ? 'Processing...' : getActionText()}
                    </span>
                  </CommonButton>
                  
                  <button
                    onClick={handleClose}
                    disabled={isLoading}
                    className="w-full py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
