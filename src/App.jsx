/* eslint-disable no-unused-vars */
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTelegram } from "./hooks/useTelegram";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";

import MainScreen from "./screens/SplashScreen";
import { PublicRouteArray } from "./context/PublicRouteArray";
import { ProtectedRouteArray } from "./context/ProtectedRouteArray";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// import LandingScreen from "./screens/LandingScreen";
// import AuthScreen from "./screens/auth";
// import LoginScreen from "./screens/auth/Login";
// import ConnectWallet from "./screens/auth/ConnectWallet";
// import RegisterScreen from "./screens/auth/Register";
// import PhoneScreen from "./screens/auth/Phone";
// import PhoneVerificationScreen from "./screens/auth/PhoneVerification";
// import VerificationSuccessScreen from "./screens/auth/VerificationSuccess";
// import SettingScreen from "./screens/SettingScreen";
// import EditProfileScreen from "./screens/EditProfile";

import "./App.css";

function App() {
  // const { webApp } = useTelegram();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const onBackClick = useCallback(() => {
  //   navigate(-1);
  // }, [navigate]);

  // const onMainClick = useCallback(() => {
  //   webApp.showAlert("Main button click");
  // }, [webApp]);

  // useEffect(() => {
  //   if (webApp) {
  //     webApp.ready();
  //     webApp.BackButton.onClick(onBackClick);
  //     webApp.MainButton.onClick(onMainClick);
  //     return () => {
  //       webApp.BackButton.offClick(onBackClick);
  //       webApp.MainButton.offClick(onMainClick);
  //     };
  //   }
  // }, [webApp, onBackClick, onMainClick]);

  // Listen for auth errors
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log("Unauthorized function called");
      navigate("/login"); // Redirect to login page
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [dispatch, navigate]);
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route index element={<MainScreen />} />
          {PublicRouteArray.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
          {ProtectedRouteArray.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ProtectedRoute>{route.element}</ProtectedRoute>}
            />
          ))}
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
