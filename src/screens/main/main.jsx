
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/layout/Header';
import { StatsCard } from '../../components/layout/StatsCard';
import { MenuSection } from '../../components/layout/MenuSection';
import { ActionButton } from '../../components/layout/ActionButton';
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector } from "react-redux";

const Main = () => {
    const {t} = useTranslation();
    const userData = useSelector((state) => state.user);
    const navigate = useNavigate();
    
    const statsData = [
        { id: 'tokens', value: '234', label: 'Tokens' },
        { id: 'crypto', value: '190', label: 'Crypto' },
        { id: 'loans', value: '715', label: 'Loans' }
    ];

    const menuItems = [
        { 
            id: 'wallet', 
            label: 'My Wallet',
            onClick: () => console.log('Navigate to wallet')
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
