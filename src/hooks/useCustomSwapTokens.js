import { useState, useEffect, useMemo } from 'react';
import { useGetBridgeTokens, useGetAccountTokens } from './useBridge';
import { useERC20Token } from './useERC20';
import { useActiveAccount } from 'thirdweb/react';

/**
 * Custom hook for swap tokens - includes only EURX, POL, and USDT
 */
export const useCustomSwapTokens = () => {
  const activeAccount = useActiveAccount();
  const { balance: eurxBalance, tokenInfo: eurxInfo, loading: eurxLoading } = useERC20Token();
  
  // Get bridge tokens for filtering POL and USDT
  const { tokens: bridgeTokens, isLoading: bridgeLoading } = useGetBridgeTokens({
    limit: 50,
    metadata: true,
  });

  // Get user's account tokens
  const { tokens: userTokens, isLoading: userLoading } = useGetAccountTokens(activeAccount?.address);

  // Create EURX token object
  const eurxToken = useMemo(() => {
    if (!eurxInfo || !activeAccount) return null;
    
    return {
      address: '0x520c59c9CbD971431347f26B1Fe3657a73736110',
      token_address: '0x520c59c9CbD971431347f26B1Fe3657a73736110',
      chainId: 11155111, // Sepolia
      chain_id: 11155111,
      symbol: eurxInfo.symbol || 'EURX',
      name: eurxInfo.name || 'EURX Stablecoin',
      decimals: eurxInfo.decimals || 18,
      balance: parseFloat(eurxBalance || '0'),
      iconUri: null, // You can add a logo URL here
      priceUsd: '1.00', // Assuming it's a stablecoin pegged to 1 USD
      price_data: { price_usd: '1.00' },
      value: (parseFloat(eurxBalance || '0') * 1.0).toFixed(2)
    };
  }, [eurxInfo, eurxBalance, activeAccount]);

  // Filter for only POL and USDT from bridge tokens
  const filteredBridgeTokens = useMemo(() => {
    if (!bridgeTokens) return [];
    
    return bridgeTokens.filter(token => {
      const symbol = token.symbol?.toLowerCase();
      return symbol === 'pol' || symbol === 'usdt' || symbol === 'matic';
    });
  }, [bridgeTokens]);

  // Filter user tokens for POL, USDT, and EURX
  const filteredUserTokens = useMemo(() => {
    if (!userTokens) return [];
    
    const filtered = userTokens.filter(token => {
      const symbol = token.symbol?.toLowerCase();
      const address = token.token_address?.toLowerCase();
      
      return (
        symbol === 'pol' || 
        symbol === 'usdt' || 
        symbol === 'matic' ||
        address === '0x520c59c9cbd971431347f26b1fe3657a73736110'
      );
    });

    // Add EURX token if user has balance and it's not already included
    if (eurxToken && parseFloat(eurxBalance || '0') > 0) {
      const hasEurx = filtered.some(token => 
        token.token_address?.toLowerCase() === eurxToken.address.toLowerCase()
      );
      
      if (!hasEurx) {
        filtered.push(eurxToken);
      }
    }

    return filtered;
  }, [userTokens, eurxToken, eurxBalance]);

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