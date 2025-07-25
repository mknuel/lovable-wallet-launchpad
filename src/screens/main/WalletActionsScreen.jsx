
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import { MenuSection } from "../../components/layout/MenuSection";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet, selectWalletData, selectWalletLoading } from '../../store/reducers/walletSlice';
import { PATH_WALLET, PATH_SEND_TOKENS, PATH_SWAP_CURRENCY, PATH_BLOCKLOANS } from "../../context/paths";
import { useERC20Token } from "../../hooks/useERC20";
import { useTokenBalance } from "../../hooks/useTokenBalance";

const WalletActionsScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use optimized selectors
  const walletData = useSelector(selectWalletData);
  const walletLoading = useSelector(selectWalletLoading);
  
  // Token balance from API and EURX (crypto) balance
  const { balance: tokenBalance, loading: tokenLoading, formattedBalance: formattedTokenBalance } = useTokenBalance();
  const { balance: erc20Balance, tokenInfo, loading: erc20Loading, formattedBalance } = useERC20Token();

  // Fetch wallet data on component mount - only if not already loading/loaded
  useEffect(() => {
    if (!walletData && !walletLoading) {
      dispatch(fetchWallet());
    }
  }, [dispatch, walletData, walletLoading]);

  // Memoize stats data to prevent unnecessary recalculations
  const statsData = useMemo(() => {
    // Token balance from API
    const tokenValue = tokenLoading ? "..." : formattedTokenBalance;
    // EURX balance as crypto
    const eurxValue = erc20Loading ? "..." : parseFloat(erc20Balance || '0').toFixed(1);
    
    return [
      { 
        id: "token", 
        value: tokenValue, 
        label: "Tokens" 
      },
      {
        id: "crypto",
        value: eurxValue,
        label: t("wallet.crypto"),
      },
      { id: "loans", value: "0", label: t("wallet.loans") },
    ];
  }, [tokenLoading, formattedTokenBalance, erc20Loading, erc20Balance, t]);

  // Memoize menu items to prevent unnecessary re-renders
  const menuItems = useMemo(() => [
    {
      id: "send",
      label:
        t("wallet.actions.send") ||
        "Send your tokens to another DAO member or invite someone by phone to receive them",
      onClick: () => navigate(PATH_SEND_TOKENS),
    },
    {
      id: "exchange",
      label:
        t("wallet.actions.exchange") ||
        "Exchange your tokens to EURX (€ Euro) or other Cryptocurrency",
      onClick: () => navigate(PATH_SWAP_CURRENCY),
    },
    {
      id: "loan",
      label: t("wallet.actions.loan") || "Request Loan with your tokens",
      onClick: () => navigate(PATH_BLOCKLOANS),
    },
  ], [t, navigate]);

  const handleBackClick = () => {
    navigate(PATH_WALLET);
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white ">
      {/* Header - Fixed positioning */}
      <div className="w-full sticky top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
        <Header
          title={t("wallet.title") || "My Wallet"}
          action={true}
          onBack={handleBackClick}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-3 mb-[80px]">
        {/* Loading State */}
        {walletLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          </div>
        )}

        {/* Stats Card */}
        {!walletLoading && (
          <div className="w-full mb-6">
            <StatsCard stats={statsData} />
          </div>
        )}

        {/* Menu Section */}
        {!walletLoading && (
          <div className="w-full mb-8">
            <MenuSection menuItems={menuItems} />
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1"></div>
      </div>

      {/* Navigation - Fixed positioning */}
      <div className="w-full sticky bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a]">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default WalletActionsScreen;
