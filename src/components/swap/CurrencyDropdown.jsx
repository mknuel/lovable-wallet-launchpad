
import React from 'react';

const defaultCurrencies = [
  { symbol: 'EARN', name: 'Earn Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'LOAN', name: 'Loan Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'RIDE', name: 'Ride Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'EURX', name: 'Euro X', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'MUDI', name: 'Mudi Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
];

export const CurrencyDropdown = ({ isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className={`absolute inset-0 bg-white rounded-lg shadow-lg z-20 max-h-80 overflow-hidden transform transition-all duration-200 ease-out ${
      isOpen ? 'animate-in slide-in-from-top-2 fade-in scale-in' : 'animate-out slide-out-to-top-2 fade-out scale-out'
    }`}
    style={{
      background: 'white',
      border: '1px solid transparent',
      backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box'
    }}>
      <div className="p-4">
        <div className="text-gray-400 text-sm mb-3">Select currency</div>
        
        <div className="max-h-60 overflow-y-auto scrollbar-hide">
          {defaultCurrencies.map((currency) => (
            <button
              key={currency.symbol}
              onClick={() => onSelect(currency)}
              className="w-full p-3 mb-2 rounded-lg hover:bg-gray-50 transition-colors"
              style={{
                background: 'white',
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              <div className="flex justify-between items-center">
                <div className="text-left">
                  <div 
                    className="font-bold text-lg"
                    style={{
                      background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    {currency.symbol}
                  </div>
                  <div className="text-gray-400 text-sm">{currency.address}</div>
                </div>
                <div className="text-right">
                  <div 
                    className="font-bold text-lg"
                    style={{
                      background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent'
                    }}
                  >
                    {currency.value.toFixed(2)} $
                  </div>
                  <div className="text-gray-400 text-sm">{currency.balance.toFixed(4)}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
