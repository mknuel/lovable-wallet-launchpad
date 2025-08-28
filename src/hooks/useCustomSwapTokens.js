import { useState, useEffect, useMemo } from 'react';
import { useGetBridgeTokens, useGetAccountTokens } from './useBridge';
import { useERC20Token } from './useERC20';
import { useActiveAccount } from 'thirdweb/react';

/**
 * Custom hook for swap tokens - includes only EURX, POL, and USDT
 */
export const useCustomSwapTokens = () => {
  const activeAccount = useActiveAccount();
  const { balance: eurxBalance, tokenInfo: eurxInfo, loading: eurxLoading, error: eurxError } = useERC20Token();
  
  // Get bridge tokens for filtering POL and USDT
  const { tokens: bridgeTokens, isLoading: bridgeLoading } = useGetBridgeTokens({
    limit: 50,
    metadata: true,
  });

  // Get user's account tokens
  const { tokens: userTokens, isLoading: userLoading } = useGetAccountTokens(activeAccount?.address);

  // Debug logging removed for production

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

  // Filter for only POL and USDT from bridge tokens
  const filteredBridgeTokens = useMemo(() => {
    if (!bridgeTokens) return [];
    
    const filtered = bridgeTokens.filter(token => {
      const symbol = token.symbol?.toLowerCase();
      return symbol === 'pol' || symbol === 'usdt' || symbol === 'matic';
    });
    
    return filtered;
  }, [bridgeTokens]);

  // Filter user tokens for POL, USDT, and EURX
  const filteredUserTokens = useMemo(() => {
    const filtered = [];
    
    // Add user tokens (POL, USDT, MATIC etc.)
    if (userTokens) {
      const userFiltered = userTokens.filter(token => {
        const symbol = token.symbol?.toLowerCase();
        const address = token.token_address?.toLowerCase();
        
        return (
          symbol === 'pol' || 
          symbol === 'usdt' || 
          symbol === 'matic' ||
          address === '0x520c59c9cbd971431347f26b1fe3657a73736110'
        );
      });
      filtered.push(...userFiltered);
    }

    // Always add EURX token for display (even with 0 balance)
    if (eurxToken && eurxToken.address) {
      const hasEurx = filtered.some(token => 
        token.token_address?.toLowerCase() === eurxToken.address.toLowerCase()
      );
      
      if (!hasEurx) {
        filtered.push(eurxToken);
      }
    }

    return filtered;
  }, [userTokens, eurxToken]);

  // Available tokens for "TO" selection (what you can swap to)
  const availableTokens = useMemo(() => {
    const tokens = [];
    
    // Always include EURX token
    if (eurxToken) {
      tokens.push(eurxToken);
    }
    
    // Add filtered bridge tokens
    tokens.push(...filteredBridgeTokens);
    
    return tokens;
  }, [eurxToken, filteredBridgeTokens]);

  // User's owned tokens for "FROM" selection  
  const ownedTokens = filteredUserTokens;

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