import React, { useState } from "react";
import { SlippagePopup } from "./SlippagePopup";
import SwapIcon from "../../assets/icons/round-arrow.svg";

// The component now accepts a 'details' prop to dynamically display data.
export const TransactionDetails = ({ details, slippage, setSlippage, gasEstimate }) => {
	const [isSlippagePopupOpen, setIsSlippagePopupOpen] = useState(false);

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
	const fromToken = step.originToken;
	const toToken = step.destinationToken;

	// Convert amounts from string to number and adjust for token decimals.
	const fromAmount = Number(details.originAmount) / 10 ** fromToken.decimals;
	const toAmount = Number(details.destinationAmount) / 10 ** toToken.decimals;

	// Calculate the exchange rate.
	const exchangeRate =
		fromAmount > 0 ? (toAmount / fromAmount).toFixed(4) : "0.0000";

	// Calculate the total value in USD.
	const usdValue = (fromAmount * fromToken.priceUsd).toFixed(2);

	// Calculate the minimum amount the user will receive after applying slippage.
	const minimumReceived = (toAmount * (1 - slippage / 100)).toFixed(4);

	// Calculate gas fee in ETH/native token and USD
	const gasInNative = gasEstimate ? Number(gasEstimate) / 10**18 : 0;
	const nativeTokenPrice = fromToken?.priceUsd || toToken?.priceUsd || 3500; // Use either token's USD price as reference
	const gasInUsd = gasInNative * nativeTokenPrice;

	return (
		<>
			<div className="mt-6">
				{/* Transaction Cost Section */}
				<div
					className="relative bg-white p-1 mb-4"
					style={{
						background: "linear-gradient(to right, #DC2366, #4F5CAA)",
						borderRadius: "8px",
						padding: "1px",
					}}>
					<div className="bg-white p-4" style={{ borderRadius: "7px" }}>
						<div className="flex justify-between items-center">
							<span className="text-gray-600 text-sm font-['Sansation']">
								Gas Fee:
							</span>

							<div className="flex flex-col items-end">
								<span className="text-gray-900 text-sm font-['Sansation'] font-semibold">
									{gasEstimate ? `${gasInNative.toFixed(6)} ${fromToken.symbol}` : 'Estimating...'}
								</span>
								{gasEstimate && (
									<span className="text-gray-500 text-xs font-['Sansation']">
										≈ ${gasInUsd.toFixed(2)}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Transaction Details */}
				<div className="space-y-2 mt-10">
					<div className="flex justify-between items-center py-2">
						<span className="text-gray-600 text-sm font-['Sansation']">
							Minimum received
						</span>
						<span className="text-gray-900 text-sm font-['Sansation'] font-semibold">
							{minimumReceived} {toToken.symbol}
						</span>
					</div>

					<div className="flex justify-between items-center py-2">
						<span className="text-gray-600 text-sm font-['Sansation']">
							Total fee
						</span>
						<span className="text-gray-900 text-sm font-['Sansation'] font-semibold">
							{/* Calculate bridge fee from the quote */}
							{((fromAmount - (Number(details.destinationAmount) / 10 ** toToken.decimals * fromToken.priceUsd / toToken.priceUsd))).toFixed(6)} {fromToken.symbol}
						</span>
					</div>

					<div className="flex justify-between items-center py-2">
						<span className="text-gray-600 text-sm font-['Sansation']">
							Slippage
						</span>
						<button
							onClick={() => setIsSlippagePopupOpen(true)}
							className="text-sm font-['Sansation'] font-semibold transition-colors flex items-center">
							<span className="text-[#04BA6E]">{`< ${slippage}% `}</span>
							<span> max(20%)</span>
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
