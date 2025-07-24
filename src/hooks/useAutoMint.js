import { useCallback, useState } from 'react';
// Temporarily disable thirdweb hooks to fix React instance issue
// import { useActiveAccount } from 'thirdweb/react';
import { mintTokens, hasTokenBalance } from '../utils/erc20Helpers';

/**
 * Hook for automatic token minting on login
 */
export const useAutoMint = () => {
  // Temporarily disable thirdweb hook to fix React instance issue
  // const account = useActiveAccount();
  const [account, setAccount] = useState(null);

  /**
   * Mint tokens to user on login if they don't have any
   * @param {string} mintAmount - Amount to mint (default: "100")
   */
  const mintOnLogin = useCallback(async (mintAmount = "100") => {
    if (!account?.address) {
      console.log("⚠️ No wallet connected, skipping auto-mint");
      return false;
    }

    try {
      console.log("🔍 Checking if user needs tokens...");
      
      // Check if user already has tokens
      const hasBalance = await hasTokenBalance(account.address);
      
      if (hasBalance) {
        console.log("✅ User already has tokens, skipping mint");
        return false;
      }

      console.log("🪙 User has no tokens, starting auto-mint...");
      
      // Mint tokens to the user
      const txHash = await mintTokens(account.address, mintAmount, account);
      
      console.log(`✅ Auto-mint successful! Minted ${mintAmount} EURX tokens`);
      console.log(`📋 Transaction hash: ${txHash}`);
      
      return { success: true, txHash, amount: mintAmount };
      
    } catch (error) {
      console.error("❌ Auto-mint failed:", error);
      
      // Don't throw the error to avoid breaking the login flow
      // Just log it and continue
      return { success: false, error: error.message };
    }
  }, [account]);

  /**
   * Force mint tokens regardless of current balance
   * @param {string} mintAmount - Amount to mint (default: "100")
   */
  const forceMint = useCallback(async (mintAmount = "100") => {
    if (!account?.address) {
      throw new Error("No wallet connected");
    }

    try {
      console.log(`🪙 Force minting ${mintAmount} EURX tokens...`);
      
      const txHash = await mintTokens(account.address, mintAmount, account);
      
      console.log(`✅ Force mint successful! Minted ${mintAmount} EURX tokens`);
      console.log(`📋 Transaction hash: ${txHash}`);
      
      return { success: true, txHash, amount: mintAmount };
      
    } catch (error) {
      console.error("❌ Force mint failed:", error);
      throw error;
    }
  }, [account]);

  return {
    mintOnLogin,
    forceMint,
    setAccount, // Allow manual account setting
    isWalletConnected: !!account?.address,
    walletAddress: account?.address
  };
};