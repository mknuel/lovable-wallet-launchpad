
import React from 'react';
import { RefreshCw } from 'lucide-react';
import CommonButton from '../Buttons/CommonButton';

export const TransactionDetails = ({ 
  price, 
  minimumReceive, 
  totalFee, 
  slippage,
  onNext,
  onRefresh 
}) => {
  return (
    <div className="flex flex-col w-full mt-6 space-y-4">
      {/* Price */}
      <div className="flex items-center justify-between p-4 rounded-lg"
           style={{
             background: 'white',
             border: '1px solid transparent',
             backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
             backgroundOrigin: 'border-box',
             backgroundClip: 'padding-box, border-box'
           }}>
        <span className="text-gray-600 font-['Sansation']">Price:</span>
        <div className="flex items-center gap-2">
          <span className="font-bold font-['Sansation']">{price}</span>
          <button onClick={onRefresh} className="p-1">
            <RefreshCw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="space-y-3 text-sm font-['Sansation']">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Minimum receive:</span>
          <span className="text-gray-800 font-medium">{minimumReceive}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Total fee (Transaction, New wallet):</span>
          <span className="text-gray-800 font-medium">{totalFee}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Slippage:</span>
          <span className="text-green-600 font-medium">{slippage} (max. 20%)</span>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-8">
        <CommonButton
          onClick={onNext}
          className="w-full h-[48px]"
        >
          NEXT
        </CommonButton>
      </div>
    </div>
  );
};
