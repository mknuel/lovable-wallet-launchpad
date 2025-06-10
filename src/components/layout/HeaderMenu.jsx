
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PATH_SETTING } from '../../context/paths';

const HeaderMenu = ({ isOpen, onClose, className }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleMyProfile = () => {
    navigate(PATH_SETTING);
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const menuItems = [
    { id: 'blockm', label: 'BLOCK M', icon: '🏠', disabled: true },
    { id: 'blockmud', label: 'BLOCK MUD', icon: '🏪', disabled: true },
    { id: 'blockmed', label: 'BLOCK MED', icon: '🏥', disabled: true },
    { id: 'blocked', label: 'BLOCK ED', icon: '🎓', disabled: true },
    { id: 'blockride', label: 'BLOCK RIDE', icon: '🚗', disabled: true },
    { id: 'artistnft', label: 'ARTIST NFT', icon: '🎨', disabled: true },
    { id: 'blockloans', label: 'BLOCKLOANS', icon: '💰', disabled: true },
    { id: 'blockfarm', label: 'BLOCK FARM', icon: '🌾', disabled: true },
    { id: 'messages', label: 'MESSAGES', icon: '💬', disabled: true },
    { id: 'myprofile', label: 'MY PROFILE', icon: '👤', onClick: handleMyProfile },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sliding Menu */}
      <div className={`fixed top-0 right-0 h-full w-[80%] bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${className || ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">M</span>
            </div>
            <span className="text-[16px] font-['Sansation'] font-bold text-[#1D2126]">Menu - Tree Map</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="#666666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full">
          {/* Menu Items */}
          <div className="flex-1 px-4 py-6">
            <p className="text-[14px] font-['Sansation'] text-[#6B7280] mb-6">
              You are currently signed in.
            </p>
            
            <div className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  className={`w-full flex items-center gap-4 px-4 py-4 text-left rounded-lg transition-colors ${
                    item.disabled 
                      ? 'text-[#6B7280] cursor-not-allowed' 
                      : 'text-[#1D2126] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[18px]">{item.icon}</span>
                  <span className="text-[14px] font-['Sansation'] font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 text-left rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-[18px]">🚪</span>
              <span className="text-[14px] font-['Sansation'] font-medium text-[#E2502A]">LOGOUT</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
