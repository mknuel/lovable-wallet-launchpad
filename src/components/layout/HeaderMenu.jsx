
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className={`fixed top-16 right-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[160px] ${className || ''}`}>
        <div className="py-2">
          <button
            onClick={handleMyProfile}
            className="w-full px-4 py-3 text-left text-[14px] font-['Sansation'] text-[#1D2126] hover:bg-gray-50 transition-colors"
          >
            My Profile
          </button>
          <button
            className="w-full px-4 py-3 text-left text-[14px] font-['Sansation'] text-[#6B7280] hover:bg-gray-50 transition-colors cursor-not-allowed"
            disabled
          >
            Settings
          </button>
          <button
            className="w-full px-4 py-3 text-left text-[14px] font-['Sansation'] text-[#6B7280] hover:bg-gray-50 transition-colors cursor-not-allowed"
            disabled
          >
            Help & Support
          </button>
          <div className="border-t border-gray-100 my-1"></div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-left text-[14px] font-['Sansation'] text-[#E2502A] hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default HeaderMenu;
