
import React, { useState } from 'react';
import { SlippagePopup } from './SlippagePopup';

export const TransactionDetails = () => {
  const [isSlippagePopupOpen, setIsSlippagePopupOpen] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  const handleSlippageChange = (newSlippage) => {
    setSlippage(newSlippage);
    setIsSlippagePopupOpen(false);
  };

  return (
    <>
      <div className="mt-6">
        {/* Transaction Cost Section */}
        <div className="relative bg-white p-1 mb-4"
             style={{
               background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
               borderRadius: '8px'
             }}>
          <div className="bg-white p-4" style={{ borderRadius: '7px' }}>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm font-['Sansation']">1 EARN = 0.9534 LOAN</span>
              <span className="text-gray-600 text-sm font-['Sansation']">≈ $2.08</span>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm font-['Sansation']">Minimum received</span>
            <span className="text-gray-900 text-sm font-['Sansation'] font-semibold">475.25 LOAN</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm font-['Sansation']">Total fee</span>
            <span className="text-gray-900 text-sm font-['Sansation'] font-semibold">0.3% (1.5 EARN)</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 text-sm font-['Sansation']">Slippage</span>
            <button
              onClick={() => setIsSlippagePopupOpen(true)}
              className="text-sm font-['Sansation'] font-semibold transition-colors"
              style={{ color: '#04BA6E' }}
            >
              {slippage}%
            </button>
          </div>
        </div>
      </div>

      <SlippagePopup
        isOpen={isSlippagePopupOpen}
        onClose={() => setIsSlippagePopupOpen(false)}
        currentSlippage={slippage}
        onSlippageChange={handleSlippageChange}
      />
    </>
  );
};
