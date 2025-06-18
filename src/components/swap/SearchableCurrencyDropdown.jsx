
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#DC2366] rounded-[15px] shadow-lg z-20 max-h-80 overflow-hidden">
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search currency"
            className="w-full p-3 border-2 border-transparent bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-[10px] text-white placeholder-white/70 outline-none"
            style={{
              background: 'linear-gradient(white, white) padding-box, linear-gradient(to right, #DC2366, #4F5CAA) border-box'
            }}
          />
        </div>
        
        <div className="text-gray-400 text-sm mb-3">Select currency</div>
        
        <div className="max-h-60 overflow-y-auto">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => onSelect(token)}
                className="w-full p-3 mb-2 border-2 border-[#DC2366] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-[#DC2366] font-bold text-lg">{token.symbol}</div>
                    <div className="text-gray-400 text-sm">{token.address}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[#DC2366] font-bold text-lg">{token.value.toFixed(2)} $</div>
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
