import {
  PATH_AUTH,
  PATH_LANDING,
  PATH_REGISTER,
  PATH_SPLASH,
  PATH_LOGIN,
  PATH_EDIT_PROFILE,
  PATH_LANGUAGE,
  PATH_SETTING,
  PATH_MAIN,
  PATH_WALLETCONNECT,
} from "./paths";
import SplashScreen from "../screens/SplashScreen";
import LandingScreen from "../screens/LandingScreen";
import Auth from "../screens/auth";
import LoginScreen from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import EditProfile from "../screens/profile/EditProfile";
import SettingScreen from "../screens/profile/SettingScreen";
import LanguageScreen from "../screens/profile/Language";
import MainScreen from "../screens/main/main";
import WalletConnect from "../screens/auth/ConnectWallet";

export const PublicRouteArray = [
  {
    path: PATH_SPLASH,
    element: <SplashScreen />,
  },
  {
    path: PATH_LANDING,
    element: <LandingScreen />,
  },
  {
    path: PATH_AUTH,
    element: <Auth />,
  },
  // {
  //   path: PATH_REGISTER,
  //   element: <Register />,
  // },
  // {
  //   path: PATH_LOGIN,
  //   element: <LoginScreen />,
  // },
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
  {
    path: PATH_MAIN,
    element: <MainScreen />,
  },
  {
    path: PATH_WALLETCONNECT,
    element: <WalletConnect />,
  },
];
