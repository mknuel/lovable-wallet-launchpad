import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { MenuSection } from '../../components/layout/MenuSection';
import { ActionButton } from '../../components/layout/ActionButton';
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from '../../store/reducers/walletSlice';
import CreatePinScreen from './CreatePinScreen';
import PinEntryScreen from './PinEntryScreen';
import WalletScreen from './WalletScreen';
import { PATH_WALLET } from '../../context/paths';

const Main = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    const { walletData, isLoading: walletLoading, error: walletError } = useSelector((state) => state.wallet);
    const navigate = useNavigate();
    const [showCreatePinScreen, setShowCreatePinScreen] = useState(false);
    const [showPinEntryScreen, setShowPinEntryScreen] = useState(false);
    const [showPinConfirmation, setShowPinConfirmation] = useState(false);
    const [showWalletScreen, setShowWalletScreen] = useState(false);
    
    // Fetch wallet data on component mount
    useEffect(() => {
        console.log("Main component mounted, dispatching fetchWallet...");
        dispatch(fetchWallet());
    }, [dispatch]);

    // Log wallet data changes
    useEffect(() => {
        console.log("Wallet data updated:", walletData);
        console.log("Wallet loading:", walletLoading);
        console.log("Wallet error:", walletError);
    }, [walletData, walletLoading, walletError]);
    
    // US-2.4 & US-2.6: Check PIN status and redirect accordingly
    useEffect(() => {
        const hasCreatedPin = localStorage.getItem('userHasPin');
        const isFirstTimeSignIn = localStorage.getItem('isFirstTimeSignIn');
        const needsPinEntry = localStorage.getItem('needsPinEntry');
        
        if (isFirstTimeSignIn === 'true' && !hasCreatedPin) {
            // US-2.4: First-time PIN creation prompt
            setShowCreatePinScreen(true);
        } else if (hasCreatedPin && needsPinEntry === 'true') {
            // US-2.6: Mandatory PIN entry only when flagged (initial redirect after login)
            setShowPinEntryScreen(true);
        }
    }, []);
    
    // Use real wallet data for stats
    const statsData = walletData?.data ? [
        { id: 'tokens', value: walletData.data.token || '0', label: 'Tokens' },
        { id: 'crypto', value: walletData.data.balance || '0', label: 'Crypto' },
        { id: 'loans', value: '0', label: 'Loans' }
    ] : [
        { id: 'tokens', value: '234', label: 'Tokens' },
        { id: 'crypto', value: '190', label: 'Crypto' },
        { id: 'loans', value: '715', label: 'Loans' }
    ];

    const handleWalletClick = () => {
        if (!walletData?.data) {
            console.log("No wallet data available");
            return;
        }

        // Check if PIN is set based on isPinCodeSet flag
        if (!walletData.data.isPinCodeSet) {
            // No PIN set, show create PIN screen
            setShowCreatePinScreen(true);
        } else {
            // PIN is set, show PIN entry screen for verification
            setShowPinEntryScreen(true);
        }
    };

    const menuItems = [
        { 
            id: 'wallet', 
            label: 'My Wallet',
            onClick: () => navigate(PATH_WALLET)
        },
        { 
            id: 'settings', 
            label: 'Settings',
            onClick: () => navigate('/setting')
        },
        { 
            id: 'blockloans', 
            label: 'Blockloans',
            onClick: () => console.log('Navigate to blockloans')
        }
    ];

    const handleMenuClick = () => {
        console.log('Menu clicked');
    };

    const handleNotificationClick = () => {
        console.log('Notifications clicked');
    };

    const handleSettingsClick = () => {
        navigate('/setting');
    };

    const handleNextClick = () => {
        console.log('Next button clicked');
    };

    const handlePinCreated = () => {
        // US-2.5 & US-2.7: PIN creation confirmation
        localStorage.setItem('userHasPin', 'true');
        localStorage.removeItem('isFirstTimeSignIn');
        localStorage.removeItem('needsPinEntry'); // Clear the flag
        setShowCreatePinScreen(false);
        setShowPinConfirmation(true);
        
        // Hide confirmation after 3 seconds and show wallet screen
        setTimeout(() => {
            setShowPinConfirmation(false);
            setShowWalletScreen(true);
        }, 3000);
    };

    const handlePinVerified = () => {
        // After successful PIN entry, go to wallet screen
        localStorage.removeItem('needsPinEntry');
        setShowPinEntryScreen(false);
        setShowWalletScreen(true);
    };

    const handleBackFromPinScreen = () => {
        setShowCreatePinScreen(false);
        setShowPinEntryScreen(false);
        setShowWalletScreen(false);
        // Clear flags if user backs out
        localStorage.removeItem('needsPinEntry');
    };

    // Show WalletScreen after PIN verification/creation success
    if (showWalletScreen) {
        return (
            <>
                <WalletScreen 
                    onBack={handleBackFromPinScreen}
                    walletData={walletData}
                />
                
                {/* US-2.5: PIN Creation Confirmation Message - overlay on wallet screen */}
                {showPinConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                        <div className="bg-white rounded-lg p-8 mx-4 max-w-sm w-full text-center">
                            {/* Success Icon - Custom SVG */}
                            <div className="flex justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="52" viewBox="0 0 57 52" fill="none">
                                    <path d="M34.0318 35.0723C32.7112 36.4097 30.9518 37.1455 29.0827 37.1455C27.2139 37.1455 25.4546 36.4097 24.134 35.0723L14.2173 25.0491C12.8946 23.7139 12.1666 21.936 12.1666 20.0467C12.1666 18.1573 12.8946 16.3794 14.2173 15.0446C15.5379 13.7072 17.2973 12.9713 19.1665 12.9713C21.0352 12.9713 22.7946 13.7072 24.1152 15.0446L29.0827 20.0631L42.7957 6.20258C38.3157 2.34189 32.5151 0 26.1663 0C11.9914 0 0.5 11.6153 0.5 25.9426C0.5 40.2704 11.9914 51.8857 26.1663 51.8857C40.3408 51.8857 51.8322 40.2704 51.8322 25.9426C51.8322 23.2613 51.4289 20.6763 50.6821 18.2424L34.0318 35.0723Z" fill="url(#paint0_linear_32219_3944)"/>
                                    <path d="M29.0842 32.4282C28.4869 32.4282 27.8896 32.1971 27.4346 31.7372L17.5184 21.7137C16.6058 20.7917 16.6058 19.301 17.5184 18.379C18.4306 17.4565 19.905 17.4565 20.8176 18.379L29.0842 26.7347L52.5178 3.04891C53.4299 2.12692 54.9043 2.12692 55.8169 3.04891C56.7291 3.97133 56.7291 5.46163 55.8169 6.38405L30.7338 31.7372C30.2792 32.1971 29.6815 32.4282 29.0842 32.4282Z" fill="#1D2126"/>
                                    <defs>
                                        <linearGradient id="paint0_linear_32219_3944" x1="26.1661" y1="0" x2="26.1661" y2="51.8857" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3F5CC8"/>
                                            <stop offset="1" stopColor="#E12160"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            
                            {/* Success Title */}
                            <h2 className="text-[20px] font-['Sansation'] font-bold text-[#1D2126] mb-4">
                                Success
                            </h2>
                            
                            {/* US-2.5: Success Message */}
                            <p className="text-[16px] font-['Sansation'] text-[#6B7280] mb-8">
                                Your PIN has now been created successfully!
                            </p>
                            
                            {/* OK Button */}
                            <button
                                onClick={() => setShowPinConfirmation(false)}
                                className="w-full h-[48px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white text-[16px] font-['Sansation'] font-bold rounded-lg hover:opacity-90 transition-opacity"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    // Show CreatePinScreen for users without PIN
    if (showCreatePinScreen) {
        return (
            <CreatePinScreen 
                onPinCreated={handlePinCreated}
                onBack={handleBackFromPinScreen}
                walletData={walletData}
            />
        );
    }

    // Show PinEntryScreen for users with PIN set
    if (showPinEntryScreen) {
        return (
            <PinEntryScreen 
                onPinVerified={handlePinVerified}
                onBack={handleBackFromPinScreen}
                walletData={walletData}
                onShowCreatePin={() => {
                    setShowPinEntryScreen(false);
                    setShowCreatePinScreen(true);
                }}
            />
        );
    }
    
    return (
        <div className="flex items-center flex-col min-h-screen w-full max-w-full overflow-hidden">
            {/* Header - Fixed positioning */}
            <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
                <Header 
                    onMenuClick={handleMenuClick}
                    onNotificationClick={handleNotificationClick}
                    onSettingsClick={handleSettingsClick}
                />
            </div>

            {/* Main Content - Scrollable with top margin to account for fixed header */}
            <div className="relative w-full max-w-full overflow-y-auto overflow-x-hidden px-6 py-6 mt-[66px] mb-[80px]">
                {/* Stats Card */}
                <div className="w-full max-w-full mb-6">
                    <StatsCard stats={statsData} />
                </div>

                {/* Menu Section */}
                <div className="w-full max-w-full mb-8">
                    <MenuSection menuItems={menuItems} />
                </div>

                {/* Action Button */}
                <div className="w-full max-w-full">
                    <ActionButton 
                        onClick={handleNextClick}
                        ariaLabel="Proceed to next step"
                    >
                        next
                    </ActionButton>
                </div>
            </div>

            {/* Navigation - Fixed positioning */}
            <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
                <Navigation nav={"Main Menu"} />
            </div>
        </div>
    );
}

export default Main;
