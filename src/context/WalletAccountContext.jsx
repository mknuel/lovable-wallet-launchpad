/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";

const WalletAccountContext = createContext();

export const WalletAccountProvider = ({ children }) => {
  const [currentWalletAccount, setCurrentWalletAccount] = useState(
    localStorage.getItem("walletAccount")
  );

  useEffect(() => {
    localStorage.setItem("walletAccount", currentWalletAccount);
  }, [currentWalletAccount]);

  const changeWalletAccount = (walletAccount) => {
    setCurrentWalletAccount(walletAccount);
  };

  return (
    <WalletAccountContext.Provider
      value={{ currentWalletAccount, changeWalletAccount }}
    >
      {children}
    </WalletAccountContext.Provider>
  );
};

export const useWalletAccount = () => useContext(WalletAccountContext);