
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export const SlippagePopup = ({ isOpen, onClose, currentSlippage, onSlippageChange }) => {
  const [selectedSlippage, setSelectedSlippage] = useState(currentSlippage);
  const [customSlippage, setCustomSlippage] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const presetSlippages = [0.1, 0.5, 1.0];

  useEffect(() => {
    if (isOpen) {
      const isPreset = presetSlippages.includes(currentSlippage);
      setIsCustom(!isPreset);
      if (!isPreset) {
        setCustomSlippage(currentSlippage.toString());
      }
      setSelectedSlippage(currentSlippage);
    }
  }, [isOpen, currentSlippage]);

  const handlePresetClick = (value) => {
    setSelectedSlippage(value);
    setIsCustom(false);
    setCustomSlippage('');
  };

  const handleCustomChange = (value) => {
    setCustomSlippage(value);
    setIsCustom(true);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      setSelectedSlippage(numValue);
    }
  };

  const handleSave = () => {
    onSlippageChange(selectedSlippage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-[15px] p-1 w-full max-w-sm"
           style={{
             background: 'linear-gradient(to right, #DC2366, #4F5CAA)',
           }}>
        <div className="bg-white rounded-[14px] p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold font-['Sansation']">Slippage tolerance</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 font-['Sansation']">
              Your transaction will revert if the price changes unfavorably by more than this percentage.
            </p>

            {/* Preset Options */}
            <div className="grid grid-cols-3 gap-3">
              {presetSlippages.map((value) => (
                <button
                  key={value}
                  onClick={() => handlePresetClick(value)}
                  className={`p-3 rounded-lg border-2 text-sm font-['Sansation'] font-semibold transition-colors ${
                    selectedSlippage === value && !isCustom
                      ? 'border-[#DC2366] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>

            {/* Custom Input */}
            <div className="space-y-2">
              <label className="text-sm font-['Sansation'] text-gray-600">Custom</label>
              <div className="relative">
                <input
                  type="number"
                  value={customSlippage}
                  onChange={(e) => handleCustomChange(e.target.value)}
                  placeholder="0.50"
                  min="0"
                  max="50"
                  step="0.1"
                  className={`w-full p-3 pr-8 border-2 rounded-lg text-sm font-['Sansation'] outline-none transition-colors ${
                    isCustom
                      ? 'border-[#DC2366] bg-white'
                      : 'border-gray-300 bg-white focus:border-gray-400'
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-['Sansation']">
                  %
                </span>
              </div>
            </div>

            {/* Warning for high slippage */}
            {selectedSlippage > 5 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-['Sansation']">
                  ⚠️ High slippage tolerance. You may receive less tokens.
                </p>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white rounded-lg font-['Sansation'] font-semibold hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
