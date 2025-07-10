import React, { useState } from 'react';
import { X } from 'lucide-react';

export const AaveActionModal = ({ 
  isOpen, 
  onClose, 
  title, 
  onConfirm, 
  isLoading = false,
  tokenSymbol = '',
  actionType = 'deposit'
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    try {
      await onConfirm(amount);
      setAmount('');
      onClose();
    } catch (err) {
      setError(err.message || 'Transaction failed');
    }
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

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
      case 'deposit': return { symbol: 'DAI', description: 'Supply DAI to earn interest' };
      case 'borrow': return { symbol: 'WETH', description: 'Borrow WETH with variable rate' };
      case 'repay': return { symbol: 'WETH', description: 'Repay your WETH debt' };
      case 'stake': return { symbol: 'AAVE', description: 'Stake AAVE tokens (coming soon)' };
      default: return { symbol: tokenSymbol, description: '' };
    }
  };

  const { symbol, description } = getTokenInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Description */}
        {description && (
          <p className="text-gray-600 text-sm mb-4">{description}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount ({symbol})
            </label>
            <input
              type="number"
              step="0.000001"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${symbol} amount`}
              disabled={isLoading || actionType === 'stake'}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {actionType === 'stake' && (
            <div className="text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg">
              Staking functionality coming soon!
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isLoading || !amount || actionType === 'stake'}
            >
              {isLoading ? 'Processing...' : getActionText()}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};