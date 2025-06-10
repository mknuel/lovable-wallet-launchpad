
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { MenuSection } from '../../components/layout/MenuSection';
import { ActionButton } from '../../components/layout/ActionButton';
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector } from "react-redux";
import CreatePinScreen from './CreatePinScreen';
import PinEntryScreen from './PinEntryScreen';

const Main = () => {
    const {t} = useTranslation();
    const userData = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [showCreatePinScreen, setShowCreatePinScreen] = useState(false);
    const [showPinEntryScreen, setShowPinEntryScreen] = useState(false);
    const [showPinConfirmation, setShowPinConfirmation] = useState(false);
    
    // US-2.4 & US-2.6: Check PIN status and redirect accordingly
    useEffect(() => {
        const hasCreatedPin = localStorage.getItem('userHasPin');
        const isFirstTimeSignIn = localStorage.getItem('isFirstTimeSignIn');
        
        if (isFirstTimeSignIn === 'true' && !hasCreatedPin) {
            // US-2.4: First-time PIN creation prompt
            setShowCreatePinScreen(true);
        } else if (hasCreatedPin && isFirstTimeSignIn !== 'true') {
            // US-2.6: Mandatory PIN entry (except first time)
            setShowPinEntryScreen(true);
        }
    }, []);
    
    const statsData = [
        { id: 'tokens', value: '234', label: 'Tokens' },
        { id: 'crypto', value: '190', label: 'Crypto' },
        { id: 'loans', value: '715', label: 'Loans' }
    ];

    const handleWalletClick = () => {
        const hasCreatedPin = localStorage.getItem('userHasPin');
        
        if (!hasCreatedPin) {
            setShowCreatePinScreen(true);
        } else {
            setShowPinEntryScreen(true);
        }
    };

    const menuItems = [
        { 
            id: 'wallet', 
            label: 'My Wallet',
            onClick: handleWalletClick
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
        setShowCreatePinScreen(false);
        setShowPinConfirmation(true);
        
        // Hide confirmation after 3 seconds and return to main menu
        setTimeout(() => {
            setShowPinConfirmation(false);
        }, 3000);
    };

    const handlePinVerified = () => {
        // US-2.6: After successful PIN entry, direct to main menu
        setShowPinEntryScreen(false);
    };

    const handleBackFromPinScreen = () => {
        setShowCreatePinScreen(false);
        setShowPinEntryScreen(false);
    };

    // Show CreatePinScreen for first-time users or wallet access without PIN
    if (showCreatePinScreen) {
        return (
            <>
                <CreatePinScreen 
                    onPinCreated={handlePinCreated}
                    onBack={handleBackFromPinScreen}
                />
                
                {/* US-2.5: PIN Creation Confirmation Message */}
                {showPinConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                        <div className="bg-white rounded-lg p-8 mx-4 max-w-sm w-full text-center">
                            {/* Success Icon */}
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-full flex items-center justify-center">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
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

    // Show PinEntryScreen for returning users
    if (showPinEntryScreen) {
        return (
            <PinEntryScreen 
                onPinVerified={handlePinVerified}
                onBack={handleBackFromPinScreen}
            />
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen w-full max-w-full overflow-x-hidden">
            {/* Header - Fixed positioning */}
            <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
                <Header 
                    onMenuClick={handleMenuClick}
                    onNotificationClick={handleNotificationClick}
                    onSettingsClick={handleSettingsClick}
                />
            </div>

            {/* Main Content - Scrollable with top margin to account for fixed header */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden px-4 py-6 mt-[66px] mb-[80px]">
                {/* Stats Card */}
                <div className="w-full mb-6">
                    <StatsCard stats={statsData} />
                </div>

                {/* Menu Section */}
                <div className="w-full mb-8">
                    <MenuSection menuItems={menuItems} />
                </div>

                {/* Action Button */}
                <div className="w-full">
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
