import {
  PATH_AUTH,
  PATH_LANDING,
  PATH_REGISTER,
  PATH_SPLASH,
  PATH_LOGIN,
  PATH_WALLETCONNECT,
  PATH_CREATE_PIN,
} from "./paths";
import SplashScreen from "../screens/SplashScreen";
import LandingScreen from "../screens/LandingScreen";
import Auth from "../screens/auth";
import LoginScreen from "../screens/auth/Login";
import Register from "../screens/auth/Register";
import WalletConnect from "../screens/auth/ConnectWallet";
import CreatePin from "../screens/auth/CreatePin";

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
  {
    path: PATH_REGISTER,
    element: <Register />,
  },
  {
    path: PATH_LOGIN,
    element: <LoginScreen />,
  },
  {
    path: PATH_WALLETCONNECT,
    element: <WalletConnect />,
  },
  {
    path: PATH_CREATE_PIN,
    element: <CreatePin />,
  },
];
