import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { selectWalletData } from '../store/reducers/walletSlice';

/**
 * Custom hook for getting token balance from wallet data
 */
export const useTokenBalance = () => {
  const walletData = useSelector(selectWalletData);
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Update balance when wallet data changes
   */
  useEffect(() => {
    if (walletData) {
      const tokenBalance = walletData.balance || 0.0;
      setBalance(tokenBalance.toString());
    } else {
      setBalance('0.0');
    }
  }, [walletData]);

  /**
   * Manual refresh function (for compatibility)
   */
  const refresh = useCallback(() => {
    // This will trigger through wallet data updates
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  }, []);

  return {
    balance,
    loading,
    error,
    refresh,
    formattedBalance: parseFloat(balance).toFixed(1)
  };
};