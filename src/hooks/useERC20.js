import { useState, useEffect, useCallback } from 'react';
import { getTokenBalance, getTokenInfo, hasTokenBalance } from '../utils/erc20Helpers';
import { useActiveAccount } from 'thirdweb/react';

/**
 * Custom hook for ERC20 token operations
 */
export const useERC20Token = () => {
  const account = useActiveAccount();
  const [balance, setBalance] = useState('0');
  const [tokenInfo, setTokenInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Load token balance for the connected wallet
   */
  const loadBalance = useCallback(async () => {
    if (!account?.address) {
      setBalance('0');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tokenBalance = await getTokenBalance(account.address);
      setBalance(tokenBalance);
    } catch (err) {
      console.error('Error loading token balance:', err);
      setError(err.message);
      setBalance('0');
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  /**
   * Load token information
   */
  const loadTokenInfo = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const info = await getTokenInfo();
      setTokenInfo(info);
    } catch (err) {
      console.error('Error loading token info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Check if wallet has any token balance
   */
  const checkHasBalance = useCallback(async () => {
    if (!account?.address) return false;
    
    try {
      return await hasTokenBalance(account.address);
    } catch (err) {
      console.error('Error checking token balance:', err);
      return false;
    }
  }, [account?.address]);

  /**
   * Refresh both balance and token info
   */
  const refresh = useCallback(async () => {
    await Promise.all([loadBalance(), loadTokenInfo()]);
  }, [loadBalance, loadTokenInfo]);

  // Load balance when account changes
  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  // Load token info on mount
  useEffect(() => {
    loadTokenInfo();
  }, [loadTokenInfo]);

  return {
    // State
    balance,
    tokenInfo,
    loading,
    error,
    account: account?.address,
    
    // Actions
    loadBalance,
    loadTokenInfo,
    checkHasBalance,
    refresh,
    
    // Computed values
    hasBalance: parseFloat(balance) > 0,
    formattedBalance: parseFloat(balance).toFixed(1)
  };
};