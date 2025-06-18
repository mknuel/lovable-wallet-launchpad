
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
    <div className="absolute top-full left-0 right-0 mt-2 z-20 max-h-80 overflow-hidden transform transition-all duration-200 ease-out animate-in slide-in-from-top-2 fade-in">
      <div className="relative bg-white shadow-lg"
           style={{
             background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
             borderRadius: '8px',
             padding: '1px'
           }}>
        <div className="bg-white p-4" style={{ borderRadius: '7px' }}>
          <div className="text-gray-400 text-sm mb-3">Select currency</div>
          
          <div className="max-h-60 overflow-y-auto">
            {defaultCurrencies.map((currency) => (
              <button
                key={currency.symbol}
                onClick={() => onSelect(currency)}
                className="w-full p-3 mb-2 border border-gray-300 hover:bg-gray-50 transition-colors"
                style={{
                  borderImage: 'linear-gradient(to right, #DC2366, #4F5CAA) 1',
                  borderRadius: '8px'
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
    </div>
  );
};
