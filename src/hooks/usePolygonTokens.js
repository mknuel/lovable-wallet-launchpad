import { useState, useEffect, useMemo } from 'react';
import { useGetBridgeTokens, useGetAccountTokens } from './useBridge';
import { useERC20Token } from './useERC20';
import { useActiveAccount } from 'thirdweb/react';

/**
 * Custom hook for polygon tokens from both mainnet and amoy
 */
export const usePolygonTokens = () => {
  const activeAccount = useActiveAccount();
  const { balance: eurxBalance, tokenInfo: eurxInfo, loading: eurxLoading, error: eurxError } = useERC20Token();
  
  // Get bridge tokens for both networks
  const { tokens: bridgeTokens, isLoading: bridgeLoading } = useGetBridgeTokens({
    limit: 100,
    metadata: true,
  });

  // Get user's account tokens
  const { tokens: userTokens, isLoading: userLoading } = useGetAccountTokens(activeAccount?.address);

  // Create EURX token object
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
      iconUri: null,
      priceUsd: '1.00',
      price_data: { price_usd: '1.00' },
      value: eurxError ? '0.00' : (parseFloat(eurxBalance || '0') * 1.0).toFixed(2)
    };
  }, [eurxBalance, eurxInfo, activeAccount, eurxError]);

  // Filter for polygon tokens from both mainnet (137) and amoy (80002)
  const polygonBridgeTokens = useMemo(() => {
    if (!bridgeTokens) return [];
    
    return bridgeTokens.filter(token => {
      const chainId = token.chainId || token.chain_id;
      return chainId === 137 || chainId === 80002; // Polygon mainnet and amoy
    });
  }, [bridgeTokens]);

  // User's polygon tokens
  const polygonUserTokens = useMemo(() => {
    const filtered = [];
    
    // Add user tokens from polygon networks
    if (userTokens) {
      const userFiltered = userTokens.filter(token => {
        const chainId = token.chainId || token.chain_id;
        return chainId === 137 || chainId === 80002;
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

  // Available tokens for "TO" selection (polygon tokens + EURX)
  const availableTokens = useMemo(() => {
    const tokens = [];
    
    // Always include EURX token
    if (eurxToken) {
      tokens.push(eurxToken);
    }
    
    // Add polygon bridge tokens
    tokens.push(...polygonBridgeTokens);
    
    return tokens;
  }, [eurxToken, polygonBridgeTokens]);

  const isLoading = eurxLoading || bridgeLoading || userLoading;

  return {
    // For "FROM" dropdown - polygon tokens user owns
    ownedTokens: polygonUserTokens,
    // For "TO" dropdown - polygon tokens + EURX
    availableTokens,
    // All polygon tokens from bridge
    polygonTokens: polygonBridgeTokens,
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