
import React from 'react';

export const MenuSection = ({ menuItems, className }) => {
  return (
    <div className={`flex flex-col gap-3 px-4 ${className || ''}`}>
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={item.onClick}
          className="w-full py-4 px-6 border border-pink-300 rounded-xl text-pink-600 font-semibold bg-white hover:bg-gray-50 transition-colors"
          role="menuitem"
        >
          {item.label.toUpperCase()}
        </button>
      ))}
    </div>
  );
};
