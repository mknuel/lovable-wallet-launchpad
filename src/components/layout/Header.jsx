
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({
  onMenuClick,
  onNotificationClick,
  onSettingsClick,
  className
}) => {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleNotificationClick = () => {
    if (onNotificationClick) {
      onNotificationClick();
    }
  };

  const handleSettingsClick = () => {
    if (onSettingsClick) {
      onSettingsClick();
    } else {
      navigate('/setting');
    }
  };

  return (
    <nav 
      className={`sticky top-0 items-center border-b-[color:var(--Gray-200,#EEE)] self-stretch flex w-full gap-[40px_172px] bg-white mt-3.5 pl-5 pr-4 py-4 border-b border-solid ${className || ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="self-stretch flex items-center gap-[5px] my-auto">
        <button
          onClick={handleMenuClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/81d1bc0fbdeb3f3b94c116951e548f83b232bbca?placeholderIfAbsent=true"
            alt=""
            className="aspect-[0.92] object-contain w-[22px] self-stretch my-auto"
          />
        </button>
      </div>
      <div className="self-stretch flex items-center gap-2 my-auto" role="group" aria-label="Action buttons">
        <button
          onClick={handleNotificationClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="View notifications"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e3975f79483bc82c73eaf993f32260081d3511e6?placeholderIfAbsent=true"
            alt=""
            className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          />
        </button>
        <button
          onClick={handleSettingsClick}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open settings"
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ad487cab465b08eec6b51dff3014f32abba28313?placeholderIfAbsent=true"
            alt=""
            className="aspect-[1] object-contain w-6 self-stretch shrink-0 my-auto"
          />
        </button>
      </div>
    </nav>
  );
};

export default Header;
