
import React, { useState } from 'react';
import { CurrencyDropdown } from './CurrencyDropdown';
import { SearchableCurrencyDropdown } from './SearchableCurrencyDropdown';

export const CurrencyCard = ({
  type,
  selectedCurrency,
  amount,
  onAmountChange,
  onCurrencySelect,
  availableBalance = 1200.97,
  placeholder = "0.0000"
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCurrencyClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencySelection = (currency) => {
    onCurrencySelect(currency);
    setIsDropdownOpen(false);
    setSearchTerm('');
  };

  const calculateUsdValue = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * 1.1).toFixed(2);
  };

  return (
    <div className="flex flex-col w-full p-4 rounded-lg mt-6 relative"
         style={{
           background: 'white',
           border: '1px solid transparent',
           backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
           backgroundOrigin: 'border-box',
           backgroundClip: 'padding-box, border-box'
         }}>
      <label className="text-[#3c3c43] text-sm font-['Sansation'] mb-2">
        {type === 'from' ? 'From' : 'To'}
      </label>
      
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 relative flex-1">
            {selectedCurrency ? (
              <>
                <div className="w-12 h-12 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-full flex items-center justify-center text-white font-bold">
                  {selectedCurrency.symbol.substring(0, 2)}
                </div>
                <button
                  className="flex items-center gap-2 font-['Sansation'] flex-1"
                  onClick={handleCurrencyClick}
                  aria-expanded={isDropdownOpen}
                >
                  <span>{selectedCurrency.symbol}</span>
                  <svg 
                    className={`w-3 h-3 transition-transform ml-auto ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 font-['Sansation'] flex-1"
                onClick={handleCurrencyClick}
                aria-expanded={isDropdownOpen}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
                <span>Select</span>
                <svg 
                  className={`w-3 h-3 transition-transform ml-auto ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            )}

            {type === 'from' ? (
              <CurrencyDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onSelect={handleCurrencySelection}
              />
            ) : (
              <SearchableCurrencyDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                onSelect={handleCurrencySelection}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            )}
          </div>
          
          <div className="flex flex-col items-end ml-4">
            {type === 'from' ? (
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(e.target.value)}
                placeholder={placeholder}
                className="text-right bg-transparent border-none outline-none w-20 font-['Sansation']"
                step="0.0001"
                min="0"
              />
            ) : (
              <span className="text-right font-bold font-['Sansation']">
                {amount || placeholder}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs font-['Sansation']">
          {type === 'from' ? (
            <>
              <span className="text-gray-500">
                Available: ${availableBalance.toFixed(2)}
              </span>
              <span className="text-gray-700">
                ≈ ${calculateUsdValue(amount)}
              </span>
            </>
          ) : (
            <span className="text-gray-500 mx-auto">
              {selectedCurrency ? `≈ $${calculateUsdValue(amount)}` : 'Select currency'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
