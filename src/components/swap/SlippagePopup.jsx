
import React, { useState, useEffect, useRef } from 'react';
import { Edit3 } from 'lucide-react';

export const SlippagePopup = ({ isOpen, onClose, currentSlippage, onSlippageChange }) => {
  const [selectedSlippage, setSelectedSlippage] = useState(currentSlippage);
  const [customSlippage, setCustomSlippage] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const modalRef = useRef(null);

  const presetSlippages = [0.1, 0.5, 1.0, 5.0];

  useEffect(() => {
    if (isOpen) {
      const isPreset = presetSlippages.includes(currentSlippage);
      setIsCustom(!isPreset);
      if (!isPreset) {
        setCustomSlippage(currentSlippage.toString());
        setShowCustomInput(true);
      }
      setSelectedSlippage(currentSlippage);
    }
  }, [isOpen, currentSlippage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handlePresetClick = (value) => {
    setSelectedSlippage(value);
    setIsCustom(false);
    setCustomSlippage('');
    setShowCustomInput(false);
  };

  const handleCustomChange = (value) => {
    setCustomSlippage(value);
    setIsCustom(true);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      setSelectedSlippage(numValue);
    }
  };

  const handlePenClick = () => {
    setShowCustomInput(!showCustomInput);
    if (!showCustomInput) {
      setIsCustom(true);
    }
  };

  const handleDone = () => {
    onSlippageChange(selectedSlippage);
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
		<div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 mt-20">
			<div
				ref={modalRef}
				className="bg-white shadow-lg"
				style={{
					display: "flex",
          width: "90dvw",
          maxWidth:"400px",
					padding: "16px 16px 36px 16px",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					gap: "16px",
					borderRadius: "8px",
					boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
				}}>
				{/* Description Text */}
				<p className="text-sm text-gray-600 font-['Sansation'] leading-relaxed">
					Slippage refers to the difference between the expected price or a
					trade and the price at which the trade is executed. Slippage can occur
					at any time but is most prevalent during periods of higher volatility
					when market orders are used.
				</p>

				{/* Slippage Options */}
				<div className="flex items-center gap-3 flex-wrap">
					{presetSlippages.map((value) => (
						<button
							key={value}
							onClick={() => handlePresetClick(value)}
							className={`text-sm font-['Sansation'] font-semibold transition-colors ${
								selectedSlippage === value && !isCustom
									? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white"
									: "border border-gray-300 bg-white text-gray-700 hover:border-gray-400"
							}`}
							style={{
								display: "flex",
								width: "43px",
								height: "30px",
								padding: "5px 10px",
								justifyContent: "center",
								alignItems: "center",
								gap: "10px",
								borderRadius: "8px",
							}}>
							{value}%
						</button>
					))}

					{/* Pen Icon Button */}
					<button
						onClick={handlePenClick}
						className={`border border-gray-300 bg-white text-gray-700 hover:border-gray-400 transition-colors ${
							showCustomInput
								? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white border-0"
								: ""
						}`}
						style={{
							display: "flex",
							width: "43px",
							height: "30px",
							padding: "5px 10px",
							justifyContent: "center",
							alignItems: "center",
							gap: "10px",
							borderRadius: "8px",
						}}>
						<Edit3 className="w-4 h-4" />
					</button>
				</div>

				{/* Custom Input (Hidden by default) */}
				{showCustomInput && (
					<div className="w-full">
						<div className="relative">
							<input
								type="number"
								value={customSlippage}
								onChange={(e) => handleCustomChange(e.target.value)}
								placeholder="0.50"
								min="0"
								max="50"
								step="0.1"
								className="w-full p-3 pr-8 border border-gray-300 rounded-lg text-sm font-['Sansation'] outline-none transition-colors focus:border-gray-400"
								style={{ borderRadius: "8px" }}
							/>
							<span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-['Sansation']">
								%
							</span>
						</div>
					</div>
				)}

				{/* Warning for high slippage */}
				{selectedSlippage > 5 && (
					<div
						className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg w-full"
						style={{ borderRadius: "8px" }}>
						<p className="text-sm text-yellow-800 font-['Sansation']">
							⚠️ High slippage tolerance. You may receive less tokens.
						</p>
					</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-3 w-full">
					<button
						onClick={handleDone}
						className="bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white font-['Sansation'] font-semibold hover:opacity-90 transition-opacity w-fit"
						style={{
							display: "inline-flex",
							padding: "10px 20px",
							justifyContent: "center",
							alignItems: "center",
							gap: "10px",
							borderRadius: "10px",
						}}>
						Done
					</button>
					<button
						onClick={handleCancel}
						className="border border-gray-300 bg-white text-gray-700 font-['Sansation'] font-semibold hover:bg-gray-50 transition-colors w-fit"
						style={{
							display: "inline-flex",
							padding: "10px 20px",
							justifyContent: "center",
							alignItems: "center",
							gap: "10px",
							borderRadius: "10px",
						}}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};
