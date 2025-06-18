
import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';

const mockTokens = [
  { symbol: 'EARN', name: 'Earn Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'LOAN', name: 'Loan Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'RIDE', name: 'Ride Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'EURX', name: 'Euro X', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
  { symbol: 'MUDI', name: 'Mudi Token', balance: 1500.0000, value: 2000.00, address: '0xG97...g7R4' },
];

export const SearchableCurrencyDropdown = ({
  isOpen,
  onClose,
  onSelect,
  searchTerm,
  onSearchChange
}) => {
  const [filteredTokens, setFilteredTokens] = useState(mockTokens);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredTokens(mockTokens);
      } else {
        const filtered = mockTokens.filter(token =>
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredTokens(filtered);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white rounded-lg shadow-lg z-50 max-h-80 overflow-hidden transition-all duration-300 ease-out transform"
         style={{
           background: 'white',
           border: '2px solid transparent',
           backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
           backgroundOrigin: 'border-box',
           backgroundClip: 'padding-box, border-box'
         }}>
      <div className="p-4">
        <div className="text-gray-400 text-sm mb-3">Select currency</div>
        
        <div className="relative mb-4">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <Search 
              className="w-5 h-5" 
              style={{
                background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search currency"
            className="w-full pl-10 pr-3 py-3 rounded-lg text-gray-700 placeholder-gray-400 outline-none focus:border-gray-400"
            style={{
              background: 'white',
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          />
        </div>
        
        <div className="text-gray-400 text-sm mb-3">Your tokens</div>
        
        <div className="max-h-40 overflow-y-auto scrollbar-hide">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => onSelect(token)}
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
                      {token.symbol}
                    </div>
                    <div className="text-gray-400 text-sm">{token.address}</div>
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
                      {token.value.toFixed(2)} $
                    </div>
                    <div className="text-gray-400 text-sm">{token.balance.toFixed(4)}</div>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <X className="w-8 h-8 text-gray-400 mb-2" />
              <div className="text-gray-400 text-sm">Nothing found</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
