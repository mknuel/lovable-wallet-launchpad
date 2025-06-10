
import React from 'react';

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
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/Avatar.png"
            alt="User avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="flex items-center gap-2" role="group" aria-label="Action buttons">
        <button
          onClick={onNotificationClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="View notifications"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e3975f79483bc82c73eaf993f32260081d3511e6?placeholderIfAbsent=true"
            alt=""
            className="aspect-[1] object-contain w-6"
          />
        </button>
        <button
          onClick={onSettingsClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open settings"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z" fill="#666666"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};
