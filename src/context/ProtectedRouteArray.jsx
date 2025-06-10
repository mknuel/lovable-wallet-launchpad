
import {
  PATH_EDIT_PROFILE,
  PATH_LANGUAGE,
  PATH_SETTING,
  PATH_MAIN,
  PATH_WALLET,
  PATH_WALLET_ACTIONS,
  PATH_SEND_TOKENS,
} from "./paths";
import EditProfile from "../screens/profile/EditProfile";
import SettingScreen from "../screens/profile/SettingScreen";
import LanguageScreen from "../screens/profile/Language";
import MainScreen from "../screens/main/main";
import WalletScreen from "../screens/main/WalletScreen";
import WalletActionsScreen from "../screens/main/WalletActionsScreen";
import SendTokensScreen from "../screens/main/SendTokensScreen";

export const ProtectedRouteArray = [
  {
    path: PATH_MAIN,
    element: <MainScreen />,
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
    path: PATH_EDIT_PROFILE,
    element: <EditProfile />,
  },
  {
    path: PATH_SETTING,
    element: <SettingScreen />,
  },
  {
    path: PATH_LANGUAGE,
    element: <LanguageScreen />,
  },
];
