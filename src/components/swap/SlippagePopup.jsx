
import React, { useState } from 'react';
import { X } from 'lucide-react';

export const SlippagePopup = ({ isOpen, onClose, currentSlippage, onSlippageChange }) => {
  const [customSlippage, setCustomSlippage] = useState('');
  const [selectedSlippage, setSelectedSlippage] = useState(currentSlippage);

  const presetSlippages = ['0.1%', '0.5%', '1%', '5%'];

  const handlePresetSelect = (preset) => {
    setSelectedSlippage(preset);
    setCustomSlippage('');
  };

  const handleCustomChange = (value) => {
    setCustomSlippage(value);
    setSelectedSlippage(`${value}%`);
  };

  const handleDone = () => {
    onSlippageChange(selectedSlippage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
           style={{
             border: '2px solid transparent',
             backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
             backgroundOrigin: 'border-box',
             backgroundClip: 'padding-box, border-box'
           }}>
        
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2 font-['Sansation']">Slippage Settings</div>
          <div className="text-sm text-gray-600 font-['Sansation']">
            Slippage refers to the difference between the expected price of a trade and the price at which the trade is executed. Slippage can occur at any time but is most prevalent during periods of higher volatility when market orders are used.
          </div>
        </div>

        <div className="mb-6">
          <div className="grid grid-cols-4 gap-2 mb-4">
            {presetSlippages.map((preset) => (
              <button
                key={preset}
                onClick={() => handlePresetSelect(preset)}
                className={`py-3 px-4 rounded-lg font-['Sansation'] transition-all ${
                  selectedSlippage === preset && !customSlippage
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={
                  selectedSlippage === preset && !customSlippage
                    ? {
                        background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
                      }
                    : {}
                }
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="mb-2">
            <div className="text-sm text-gray-600 font-['Sansation'] mb-2">Custom</div>
            <div className="relative">
              <input
                type="number"
                value={customSlippage}
                onChange={(e) => handleCustomChange(e.target.value)}
                placeholder="0.01"
                step="0.01"
                min="0"
                max="20"
                className="w-full py-3 px-4 rounded-lg border-2 text-lg font-['Sansation'] outline-none"
                style={{
                  border: '2px solid transparent',
                  backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #DC2366, #4F5CAA)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box'
                }}
              />
              <button
                onClick={() => {
                  setCustomSlippage('');
                  setSelectedSlippage(presetSlippages[0]);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleDone}
            className="flex-1 py-3 px-6 rounded-full text-white font-semibold font-['Sansation']"
            style={{
              background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
            }}
          >
            Done
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-full bg-gray-200 text-gray-700 font-semibold font-['Sansation'] hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
