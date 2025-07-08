import React, { useState, useRef } from "react";
import { CurrencyDropdown } from "./CurrencyDropdown";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export const FromCurrencyCard = ({
	selectedCurrency,
	amount,
	onAmountChange,
	onCurrencySelect,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef(null);
	useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

	const handleCurrencySelection = (currency) => {
		onCurrencySelect(currency);
		setIsDropdownOpen(false);
	};

	// Placeholder for real-time price conversion
	const calculateUsdValue = (numAmount) => {
		if (!selectedCurrency?.price_data?.price_usd || !numAmount) {
			return "0.00";
		}
		return (
			parseFloat(numAmount) * selectedCurrency.price_data.price_usd
		).toFixed(2);
	};

	return (
		<div ref={dropdownRef} className="relative">
			<div className="relative p-[1px] mt-3 rounded-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
				<div className="bg-white rounded-lg p-4 w-full flex flex-col">
					<label className="text-[rgba(60, 60, 67, 0.60)] text-sm font-['Sansation'] mb-2">
						From
					</label>

					<div className="flex items-center justify-between w-full">
						{/* --- Currency Selector --- */}
						<div className="flex items-center gap-2 w-full">
							<button
								className="flex items-center gap-2 font-['Sansation']"
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								aria-expanded={isDropdownOpen}>
								<div className="w-10 h-10 bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-full flex items-center justify-center text-white font-bold">
									{selectedCurrency
										? selectedCurrency.symbol.substring(0, 2)
										: "?"}
								</div>
								<span>
									{selectedCurrency ? selectedCurrency.symbol : "Select"}
								</span>
								<svg
									className={`w-3 h-3 transition-transform ${
										isDropdownOpen ? "rotate-180" : ""
									}`}
									fill="currentColor"
									viewBox="0 0 20 20">
									<path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
								</svg>
							</button>
							<CurrencyDropdown
								isOpen={isDropdownOpen}
								onClose={() => setIsDropdownOpen(false)}
								onSelect={handleCurrencySelection}
							/>
						</div>

						{/* --- Amount Input --- */}
						<div className="flex flex-col items-end ml-4">
							<input
								type="number"
								value={amount}
								onChange={(e) => onAmountChange(e.target.value)}
								placeholder="0.00"
								className="text-right bg-transparent border-none outline-none w-28 font-['Sansation'] text-lg placeholder:text-gray-400"
								step="0.0001"
								min="0"
							/>
						</div>
					</div>

					{/* --- Balance and USD Value --- */}
					<div className="flex justify-between items-center mt-2 text-xs font-['Sansation']">
						<span className="text-gray-500">
							Available: {selectedCurrency?.balance?.toFixed(4) ?? "0.0000"}
						</span>
						<span className="text-gray-400">
							≈ ${calculateUsdValue(amount)}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
