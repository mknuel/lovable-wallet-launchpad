
import React from "react";
import MainMenu from "../screens/main/MainMenu";
import WalletScreen from "../screens/main/WalletScreen";
import WalletActionsScreen from "../screens/main/WalletActionsScreen";
import SendTokensScreen from "../screens/main/SendTokensScreen";
import SwapCurrencyScreen from "../screens/main/SwapCurrencyScreen";
import SettingScreen from "../screens/profile/SettingScreen";
import EditProfile from "../screens/profile/EditProfile";
import Language from "../screens/profile/Language";
import {
  PATH_MAIN,
  PATH_WALLET,
  PATH_WALLET_ACTIONS,
  PATH_SEND_TOKENS,
  PATH_SWAP_CURRENCY,
  PATH_SETTING,
  PATH_EDIT_PROFILE,
  PATH_LANGUAGE,
  PATH_BLOCKLOANS,
} from "./paths";
import BlockLoansScreen from "../screens/main/BlockLoansScreen";

export const ProtectedRouteArray = [
  {
    path: PATH_MAIN,
    element: <MainMenu />,
  },
  {
    path: PATH_WALLET,
    element: <WalletScreen />,
  },
  {
    path: PATH_WALLET_ACTIONS,
    element: <WalletActionsScreen />,
  },
  {
    path: PATH_SEND_TOKENS,
    element: <SendTokensScreen />,
  },
  {
    path: PATH_SWAP_CURRENCY,
    element: <SwapCurrencyScreen />,
  },
  {
    path: PATH_SETTING,
    element: <SettingScreen />,
  },
  {
    path: PATH_EDIT_PROFILE,
    element: <EditProfile />,
  },
  {
    path: PATH_LANGUAGE,
    element: <Language />,
  },
  {
    path: PATH_BLOCKLOANS,
    element: <BlockLoansScreen />,
  },
];
