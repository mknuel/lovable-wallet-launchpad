
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { MenuSection } from '../../components/layout/MenuSection';
import { ActionButton } from '../../components/layout/ActionButton';
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector } from "react-redux";
import CreatePinModal from '../../components/modals/CreatePinModal';
import CreatePinScreen from './CreatePinScreen';

const Main = () => {
    const {t} = useTranslation();
    const userData = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [showCreatePinModal, setShowCreatePinModal] = useState(false);
    const [showCreatePinScreen, setShowCreatePinScreen] = useState(false);
    const [showPinConfirmation, setShowPinConfirmation] = useState(false);
    
    // Check if user needs to create PIN on first sign-in (US-2.4)
    useEffect(() => {
        const hasCreatedPin = localStorage.getItem('userHasPin');
        const isFirstTimeSignIn = localStorage.getItem('isFirstTimeSignIn');
        
        if (isFirstTimeSignIn === 'true' && !hasCreatedPin) {
            setShowCreatePinModal(true);
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
            console.log('Navigate to wallet - PIN already exists');
        }
    };

    const menuItems = [
        { 
            id: 'wallet', 
            label: 'My Wallet',
            onClick: handleWalletClick
        },
        { 
            id: 'createPin', 
            label: 'Create PIN',
            onClick: () => setShowCreatePinModal(true)
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
        // US-2.5: Show confirmation message
        localStorage.setItem('userHasPin', 'true');
        localStorage.removeItem('isFirstTimeSignIn');
        setShowCreatePinModal(false);
        setShowCreatePinScreen(false);
        setShowPinConfirmation(true);
        
        // Hide confirmation after 3 seconds
        setTimeout(() => {
            setShowPinConfirmation(false);
        }, 3000);
    };

    const handleClosePinModal = () => {
        setShowCreatePinModal(false);
    };

    const handleBackFromPinScreen = () => {
        setShowCreatePinScreen(false);
    };

    // Show CreatePinScreen if user clicked wallet without PIN
    if (showCreatePinScreen) {
        return (
            <>
                <CreatePinScreen 
                    onPinCreated={handlePinCreated}
                    onBack={handleBackFromPinScreen}
                />
                
                {/* PIN Confirmation Message (US-2.5) */}
                {showPinConfirmation && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                        <div className="bg-white rounded-lg p-6 mx-4 text-center">
                            <div className="text-green-600 text-xl mb-4">✓</div>
                            <p className="text-[16px] font-['Sansation'] text-[#1D2126]">
                                Your PIN has now been created
                            </p>
                        </div>
                    </div>
                )}
            </>
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

            {/* Create PIN Modal */}
            {showCreatePinModal && (
                <CreatePinModal 
                    onPinCreated={handlePinCreated}
                    onClose={handleClosePinModal}
                />
            )}

            {/* PIN Confirmation Message (US-2.5) */}
            {showPinConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 mx-4 text-center">
                        <div className="text-green-600 text-xl mb-4">✓</div>
                        <p className="text-[16px] font-['Sansation'] text-[#1D2126]">
                            Your PIN has now been created
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Main;
