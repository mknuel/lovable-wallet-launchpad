
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusBar } from '../../components/layout/StatusBar';
import Header from "../../components/layout/Header";
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
     <div className="container justify-around">
           

            {/* Fixed Header */}
            <div className="flex-shrink-0">
                <Header 
                    onMenuClick={handleMenuClick}
                    onNotificationClick={handleNotificationClick}
                    onSettingsClick={handleSettingsClick}
                />
            </div>

            {/* Scrollable Main Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                {/* Stats Card */}
                <StatsCard stats={statsData} className="mb-6" />

                {/* Menu Section */}
                <MenuSection menuItems={menuItems} className="mb-8" />

                {/* Action Button */}
                <ActionButton 
                    onClick={handleNextClick}
                    ariaLabel="Proceed to next step"
                >
                    next
                </ActionButton>
            </div>

            {/* Fixed Navigation */}
            <div className="flex-shrink-0">
                <Navigation nav={"Main Menu"} />
            </div>
        </div>
    );
}

export default Main;
