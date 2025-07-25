import { useState, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import api from '../utils/api';

/**
 * Custom hook for fetching token balance from the API
 */
export const useTokenBalance = () => {
  const account = useActiveAccount();
  const [balance, setBalance] = useState('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch token balance from API
   */
  const fetchTokenBalance = useCallback(async () => {
    if (!account?.address) {
      setBalance('0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/infura/blockloans/viewbalance', {
        address: account.address
      });

      if (response.success) {
        setBalance(response.data || '0');
      } else {
        throw new Error(response.error || 'Failed to fetch token balance');
      }
    } catch (err) {
      console.error('Error fetching token balance:', err);
      setError(err.message);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  // Fetch balance when account changes
  useEffect(() => {
    fetchTokenBalance();
  }, [fetchTokenBalance]);

  return {
    balance,
    loading,
    error,
    refresh: fetchTokenBalance,
    formattedBalance: parseFloat(balance).toFixed(1)
  };
};