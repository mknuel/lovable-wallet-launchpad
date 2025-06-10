
import React from 'react';

export const ActionButton = ({ onClick, children, ariaLabel, className }) => {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className={`w-full max-w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-semibold hover:opacity-90 transition-opacity ${className || ''}`}
    >
      {children.toUpperCase()}
    </button>
  );
};
