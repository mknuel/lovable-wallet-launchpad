import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAutoConnect } from "thirdweb/react";
import { setUser, clearUser } from "../store/reducers/userSlice";
import { setAuth, clearAuth } from "../store/reducers/authSlice";
import { fetchWallet } from "../store/reducers/walletSlice";
import { client } from "../components/thirdweb/thirdwebClient";
import { wallets } from "../components/thirdweb/ThirdwebConnectButton";

import LogoHorizontal from "../assets/images/Logo_Bloackloans_Horizontal.png";

const SplashScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [authChecked, setAuthChecked] = useState(false);
    const [walletChecked, setWalletChecked] = useState(false);

    // Auto-connect to previously connected wallet
    const {
        data: autoConnected,
        isLoading: walletLoading,
        error: walletError,
    } = useAutoConnect({
        client,
        wallets,
        onConnect: (wallet) => {
            console.log("Auto-connected to:", wallet?.getAccount()?.address);
            setWalletChecked(true);
        },
        onTimeout: () => {
            console.log("Auto-connect timed out.");
            setWalletChecked(true);
        },
    });

    // Check user authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem("token");
                const userData = localStorage.getItem("userData");
                
                if (token && userData) {
                    const parsedUserData = JSON.parse(userData);
                    dispatch(setUser(parsedUserData));
                    dispatch(setAuth({ token }));
                    
                    // Fetch wallet data if user is authenticated
                    await dispatch(fetchWallet());
                } else {
                    dispatch(clearUser());
                    dispatch(clearAuth());
                }
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem("token");
                localStorage.removeItem("userData");
                dispatch(clearUser());
                dispatch(clearAuth());
            }
            
            setAuthChecked(true);
        };

        checkAuth();
    }, [dispatch]);

    // Handle navigation once both auth and wallet checks are complete
    useEffect(() => {
        if (!authChecked) return;
        
        // If wallet is still loading, wait for it
        if (walletLoading && !walletChecked) return;
        
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("userData");
        
        // Small delay to ensure smooth transition
        setTimeout(() => {
            if (token && userData) {
                navigate("/main", { replace: true });
            } else {
                navigate("/landing", { replace: true });
            }
        }, 500);
        
    }, [authChecked, walletChecked, walletLoading, navigate]);

    return (
        <div className="w-full bg-white min-h-screen overflow-auto relative flex flex-col items-center justify-center">
            <img src={LogoHorizontal} alt="Logo" className="w-full px-8" />
            
            {/* Loading indicator */}
            <div className="mt-8 flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-[#DC2366] rounded-full animate-spin"></div>
                <p className="mt-4 text-sm text-gray-600 font-['Sansation']">
                    {!authChecked ? "Checking authentication..." : 
                     walletLoading ? "Connecting wallet..." : 
                     "Loading..."}
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;