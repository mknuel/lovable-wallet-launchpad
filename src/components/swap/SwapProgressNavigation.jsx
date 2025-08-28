import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const SwapProgressNavigation = ({ currentStep, onStepClick }) => {
  const { isDarkMode } = useTheme();
  const steps = [
    { id: 1, label: 'From', description: 'Select sending currency' },
    { id: 2, label: 'To', description: 'Select receiving currency' },
    { id: 3, label: 'Quote', description: 'Get swap quote' },
    { id: 4, label: 'Swap', description: 'Execute swap' },
    { id: 5, label: 'Done', description: 'Transaction complete' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'upcoming';
  };

  const getIconUrl = (stepId) => {
    
    switch (stepId) {
      case 1: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/ce980df59d2e45dfb2487bd1a267aa68c36d3c53?placeholderIfAbsent=true";
      case 2: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/03214bd6d68edcb29752f62522e6e5d597d50a77?placeholderIfAbsent=true";
      case 3: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/44f4a511f05e8c6b1ae70f88f11a8032039468d4?placeholderIfAbsent=true";
      case 4: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/9ef795a7e666f34dfeea6d31613d944f0b087e8c?placeholderIfAbsent=true";
      case 5: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/34f0183867c6f73a05b1fb8d01546f290af7320b?placeholderIfAbsent=true";
      default: return "https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/1feb2a6cba270cf15db25be6dab70b3c838d28fe?placeholderIfAbsent=true";
    }
  };

  return (
    <nav
      className={`shadow-[0px_-4px_12px_rgba(0,0,0,0.05)] flex min-h- w-full flex-col items-center justify-center px-5 py-[23px] mt-0 ${
        isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'
      }`}
      aria-label="Swap progress navigation"
    >
      <ul className="flex max-w-full w-80 items-center justify-between">
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isActive = status === 'active';
          const isCompleted = status === 'completed';
          
          return (
            <li
              key={step.id}
              className="self-stretch flex flex-col items-center w-[65px] my-auto"
            >
              <button
                onClick={() => onStepClick && onStepClick(step.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
                  isCompleted 
                    ? isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label={`${step.label}: ${step.description}`}
                disabled={status === 'upcoming'}
              >
                <div className="relative w-5 h-5">
                  <img
                    src={getIconUrl(step.id)}
                    alt=""
                    className={`aspect-[1] object-contain transition-all duration-200 w-full h-full ${
                      isActive ? 'opacity-0' :
                      isCompleted ? 'filter grayscale opacity-50' : 
                      status === 'upcoming' ? 'filter grayscale opacity-50' : ''
                    }`}
                  />
                  {isActive && (
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]"
                      style={{
                        WebkitMask: `url(${getIconUrl(step.id)}) center/contain no-repeat`,
                        mask: `url(${getIconUrl(step.id)}) center/contain no-repeat`
                      }}
                    />
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default SwapProgressNavigation;