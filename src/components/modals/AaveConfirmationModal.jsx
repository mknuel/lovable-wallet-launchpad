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
                <h3 className="text-xl font-bold text-black mb-6">
                  Enter The Amount You Wish To {getActionText()}.
                </h3>

                {/* Amount Input */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="number"
                      step="0.000001"
                      min="0"
                      max={actionType === 'borrow' ? maxBorrowAmount : undefined}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:border-gray-400 text-lg"
                      placeholder="Enter amount"
                      disabled={isLoading || actionType === 'stake'}
                    />
                    <div className="absolute left-4 top-2 text-gray-400 text-sm">
                      Enter here
                    </div>
                  </div>
                </div>

                {/* Stake Coming Soon Message */}
                {actionType === 'stake' && (
                  <div className="text-center text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg mb-4">
                    Staking functionality coming soon!
                  </div>
                )}

                {/* Action Button */}
                <CommonButton
                  onClick={handleSubmit}
                  disabled={isLoading || !amount || actionType === 'stake'}
                  className="w-full py-4 font-semibold rounded-lg text-white text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #DC2366, #4F5CAA)'
                  }}
                >
                  {isLoading ? 'Processing...' : 'Confirm'}
                </CommonButton>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
