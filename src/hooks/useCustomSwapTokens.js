import { useState, useEffect, useMemo } from 'react';
import { useGetBridgeTokens, useGetAccountTokens } from './useBridge';
import { useERC20Token } from './useERC20';
import { useActiveAccount } from 'thirdweb/react';

/**
 * Custom hook for swap tokens - now includes all owned tokens from Polygon mainnet and Amoy
 */
export const useCustomSwapTokens = () => {
  const activeAccount = useActiveAccount();
  const { balance: eurxBalance, tokenInfo: eurxInfo, loading: eurxLoading, error: eurxError } = useERC20Token();
  
  // Get all bridge tokens (no filtering)
  const { tokens: bridgeTokens, isLoading: bridgeLoading } = useGetBridgeTokens({
    limit: 100, // Increased limit to show more tokens
    metadata: true,
  });

  // Get user's account tokens
  const { tokens: userTokens, isLoading: userLoading } = useGetAccountTokens(activeAccount?.address);

  // Debug logging
  useEffect(() => {
    console.log('🔍 Debug Custom Swap Tokens:');
    console.log('- Bridge tokens:', bridgeTokens?.length || 0, bridgeTokens);
    console.log('- User tokens:', userTokens?.length || 0, userTokens);
    console.log('- EURX balance:', eurxBalance);
    console.log('- EURX info:', eurxInfo);
    console.log('- EURX error:', eurxError);
  }, [bridgeTokens, userTokens, eurxBalance, eurxInfo, eurxError]);

  // Create EURX token object using contract data
  const eurxToken = useMemo(() => {
    if (!activeAccount || !eurxInfo || !eurxInfo.contractAddress) return null;
    
    return {
      address: eurxInfo.contractAddress,
      token_address: eurxInfo.contractAddress,
      chainId: 80002, // Polygon Amoy
      chain_id: 80002,
      symbol: eurxInfo.symbol,
      name: eurxInfo.name,
      decimals: eurxInfo.decimals,
      balance: eurxError ? 0 : parseFloat(eurxBalance || '0'),
      iconUri: null, // You can add a logo URL here
      priceUsd: '1.00', // Assuming it's a stablecoin pegged to 1 USD
      price_data: { price_usd: '1.00' },
      value: eurxError ? '0.00' : (parseFloat(eurxBalance || '0') * 1.0).toFixed(2)
    };
  }, [eurxBalance, eurxInfo, activeAccount, eurxError]);

  // Include all bridge tokens (no filtering)
  const allBridgeTokens = useMemo(() => {
    if (!bridgeTokens) return [];
    
    console.log('🔍 All bridge tokens:', bridgeTokens);
    return bridgeTokens;
  }, [bridgeTokens]);

  // Include all user tokens + ensure EURX is available
  const allUserTokens = useMemo(() => {
    const tokens = [];
    
    // Add ALL user tokens (no filtering)
    if (userTokens) {
      // Filter out spam tokens or tokens with 0 balance if desired
      const validTokens = userTokens.filter(token => {
        // Keep tokens with positive balance or important tokens
        return token.balance > 0 || 
               token.symbol?.toLowerCase() === 'eurx' ||
               token.token_address?.toLowerCase() === '0x520c59c9cbd971431347f26b1fe3657a73736110';
      });
      tokens.push(...validTokens);
    }

    // Always add EURX token for display (even with 0 balance)
    if (eurxToken && eurxToken.address) {
      const hasEurx = tokens.some(token => 
        token.token_address?.toLowerCase() === eurxToken.address.toLowerCase()
      );
      
      if (!hasEurx) {
        tokens.push(eurxToken);
      }
    }

    // Sort tokens by balance (highest first) and then by symbol
    const sortedTokens = tokens.sort((a, b) => {
      // First sort by balance (highest first)
      const balanceA = a.balance || 0;
      const balanceB = b.balance || 0;
      if (balanceB !== balanceA) {
        return balanceB - balanceA;
      }
      // Then sort alphabetically by symbol
      return (a.symbol || '').localeCompare(b.symbol || '');
    });

    console.log('🔍 All user tokens (sorted):', sortedTokens);
    return sortedTokens;
  }, [userTokens, eurxToken]);

  // Available tokens for "TO" selection (what you can swap to) - Only Polygon/Amoy + EURX
  const availableTokens = useMemo(() => {
    const tokens = [];
    
    // Always include EURX token
    if (eurxToken) {
      tokens.push(eurxToken);
      console.log('✅ EURX token added to availableTokens:', eurxToken);
    } else {
      console.log('❌ EURX token not available:', { eurxInfo, eurxError, activeAccount: !!activeAccount });
    }
    
    // Filter bridge tokens to only include Polygon mainnet (137) and Amoy (80002)
    const polygonTokens = allBridgeTokens.filter(token => {
      const chainId = token.chainId || token.chain_id;
      return chainId === 137 || chainId === 80002; // Polygon mainnet and Amoy
    });
    
    tokens.push(...polygonTokens);
    
    console.log('🔍 Final availableTokens for TO dropdown (Polygon/Amoy only):', tokens);
    return tokens;
  }, [eurxToken, allBridgeTokens]);

  // User's owned tokens for "FROM" selection  
  const ownedTokens = allUserTokens;

  const isLoading = eurxLoading || bridgeLoading || userLoading;

  return {
    // For "FROM" dropdown - tokens user owns
    ownedTokens,
    // For "TO" dropdown - tokens available to swap to
    availableTokens,
    // EURX specific data
    eurxToken,
    eurxBalance,
    eurxInfo,
    // Loading states
    isLoading,
    bridgeLoading,
    userLoading,
    eurxLoading
  };
};