
import {
  PATH_EDIT_PROFILE,
  PATH_LANGUAGE,
  PATH_SETTING,
  PATH_MAIN,
} from "./paths";
import EditProfile from "../screens/profile/EditProfile";
import SettingScreen from "../screens/profile/SettingScreen";
import LanguageScreen from "../screens/profile/Language";
import MainScreen from "../screens/main/main";

export const ProtectedRouteArray = [
  {
    path: PATH_MAIN,
    element: <MainScreen />,
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
