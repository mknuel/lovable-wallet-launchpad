import React, { useState } from "react";
import { SlippagePopup } from "./SlippagePopup";
import SwapIcon from "../../assets/icons/round-arrow.svg";
import { useTheme } from "../../context/ThemeContext";

// The component now accepts a 'details' prop to dynamically display data.
export const TransactionDetails = ({
	details,
	slippage,
	setSlippage,
	gasEstimate,
}) => {
	const [isSlippagePopupOpen, setIsSlippagePopupOpen] = useState(false);
	const { isDarkMode } = useTheme();

	const handleSlippageChange = (newSlippage) => {
		setSlippage(newSlippage);
		setIsSlippagePopupOpen(false);
	};

	// Return null if there are no details or the necessary nested data is missing.
	if (!details || !details.steps || details.steps.length === 0) {
		return null;
	}

	// --- Dynamic Data Calculations ---
	const step = details.steps[0];
	const fromToken = step?.originToken;
	const toToken = step?.destinationToken;

	// Return null if token data is missing
	if (!fromToken || !toToken) {
		return null;
	}

	// Convert amounts from string to number and adjust for token decimals.
	const fromAmount = Number(details.originAmount) / 10 ** fromToken.decimals;
	const toAmount = Number(details.destinationAmount) / 10 ** toToken.decimals;

	// Calculate the minimum amount the user will receive after applying slippage.
	const minimumReceived = (toAmount * (1 - slippage / 100)).toFixed(4);
	return (
		<>
			<div className="mt-6">
				{/* Transaction Cost Section */}
				<div
					className="relative p-1 mb-4"
					style={{
						background: "linear-gradient(to right, #DC2366, #4F5CAA)",
						borderRadius: "8px",
						padding: "1px",
					}}>
					<div className={`p-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`} style={{ borderRadius: "7px" }}>
						<div className="flex justify-between items-center">
							<span className={`text-sm font-['Sansation'] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
								Price:
							</span>
							<div className="flex gap-2 items-center">
								<span className={`text-sm font-['Sansation'] font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
									{(() => {
										if (!gasEstimate) return "--";
										const gasInEther = parseFloat(gasEstimate) || 0;
										const ethPriceUSD = 3500;
										const gasInUSDT = (gasInEther * ethPriceUSD).toFixed(2);
										return `$${gasInUSDT} USDT`;
									})()}
								</span>
								<img src={SwapIcon} alt="Swap icon" />
							</div>
						</div>
					</div>
				</div>

				{/* Transaction Details */}
				<div className="space-y-2 mt-10">
					<div className="flex justify-between items-center py-2">
						<span className={`text-sm font-['Sansation'] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
							Minimum received
						</span>
						<span className={`text-sm font-['Sansation'] font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
							{minimumReceived} {toToken.symbol}
						</span>
					</div>

					<div className="flex justify-between items-center py-2">
						<span className={`text-sm font-['Sansation'] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
							Total fee
						</span>
						<span className={`text-sm font-['Sansation'] font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
							{(() => {
								if (!gasEstimate) return "--";
								const gasInEther = parseFloat(gasEstimate) || 0;
								const ethPriceUSD = 3500;
								const gasInUSDT = (gasInEther * ethPriceUSD).toFixed(2);
								return `$${gasInUSDT} USDT`;
							})()}
						</span>
					</div>

					<div className="flex justify-between items-center py-2">
						<span className={`text-sm font-['Sansation'] ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
							Slippage
						</span>
						<button
							onClick={() => setIsSlippagePopupOpen(true)}
							className="text-sm font-['Sansation'] font-semibold transition-colors flex items-center">
							<span className="text-[#04BA6E]">{`< ${slippage}% `}</span>
							<span className={isDarkMode ? 'text-white' : 'text-black'}> max(20%)</span>
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
