
import React, { useState } from 'react';

const defaultCurrencies = [
  { 
    symbol: 'EURX', 
    name: 'Euro X', 
    icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/119a9054d51c65e9828b64eabde205cbf2466758?placeholderIfAbsent=true' 
  },
  { 
    symbol: 'BTC', 
    name: 'Bitcoin', 
    icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e22501b45966a9039103126ba509ad16472873e3?placeholderIfAbsent=true' 
  },
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e22501b45966a9039103126ba509ad16472873e3?placeholderIfAbsent=true' 
  },
  { 
    symbol: 'USDT', 
    name: 'Tether', 
    icon: 'https://cdn.builder.io/api/v1/image/assets/cef62af9e6194c2a8a099d6136b96a5a/e22501b45966a9039103126ba509ad16472873e3?placeholderIfAbsent=true' 
  },
];

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

  const handleCurrencyClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCurrencySelection = (currency) => {
    onCurrencySelect(currency);
    setIsDropdownOpen(false);
  };

  const calculateUsdValue = (amount) => {
    const numAmount = parseFloat(amount) || 0;
    return (numAmount * 1.1).toFixed(2);
  };

  return (
    <div className="border border-[#DC2366] flex flex-col w-full max-w-xs mx-auto p-4 rounded-lg mt-6">
      <label className="text-[#3c3c43] text-sm font-['Sansation'] mb-2">
        {type === 'from' ? 'From' : 'To'}
      </label>
      
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 relative">
            {selectedCurrency ? (
              <>
                <img
                  src={selectedCurrency.icon}
                  alt={`${selectedCurrency.name} icon`}
                  className="w-12 h-12 object-contain"
                />
                <button
                  className="flex items-center gap-2 font-['Sansation']"
                  onClick={handleCurrencyClick}
                  aria-expanded={isDropdownOpen}
                >
                  <span>{selectedCurrency.symbol}</span>
                  <svg 
                    className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                className="flex items-center gap-2 font-['Sansation']"
                onClick={handleCurrencyClick}
                aria-expanded={isDropdownOpen}
              >
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xs">?</span>
                </div>
                <span>Select</span>
                <svg 
                  className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            )}

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                <ul className="py-2">
                  {defaultCurrencies.map((currency) => (
                    <li key={currency.symbol}>
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 font-['Sansation']"
                        onClick={() => handleCurrencySelection(currency)}
                      >
                        <img
                          src={currency.icon}
                          alt={`${currency.name} icon`}
                          className="w-6 h-6"
                        />
                        <span>{currency.symbol}</span>
                        <span className="text-sm text-gray-500">{currency.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-end">
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
