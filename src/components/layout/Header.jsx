
import React from 'react';
import { Bell } from 'lucide-react';
import LogoHorizontal from "../../assets/images/Logo_Bloackloans_Horizontal.png";

export const Header = ({
  onMenuClick,
  onNotificationClick,
  onSettingsClick,
  className
}) => {
  return (
    <nav 
      className={`w-full items-center border-b-[color:var(--Gray-200,#EEE)] flex justify-between bg-white pl-5 pr-4 py-4 border-b border-solid ${className || ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-[5px]">
        {/* BlockLoans Logo - Reduced size */}
        <img
          src={LogoHorizontal}
          alt="BlockLoans Logo"
          className="h-6"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* Notifications Icon */}
        <button
          onClick={onNotificationClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="View notifications"
        >
          <Bell size={20} className="text-gray-600" />
        </button>
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/Avatar.png"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
};
