import React, { useState, useRef } from "react";
import { SearchableCurrencyDropdown } from "./SearchableCurrencyDropdown";
import { useOutsideClick } from "../../hooks/useOutsideClick";

export const ToCurrencyCard = ({
	selectedCurrency,
	amount,
	onCurrencySelect,
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const dropdownRef = useRef(null);
	useOutsideClick(dropdownRef, () => setIsDropdownOpen(false));

	const handleCurrencySelection = (currency) => {
		onCurrencySelect(currency);
		setIsDropdownOpen(false);
		setSearchTerm("");
	};

	// This would be calculated based on the fromAmount and the exchange rate
	const displayedAmount = amount || "0.00";

	return (
		<div ref={dropdownRef} className="relative">
			<div className="relative p-[1px] mt-3 rounded-lg bg-gradient-to-r from-[#DC2366] to-[#4F5CAA]">
				<div className="bg-white rounded-lg p-4 w-full flex flex-col">
					<label className="text-[rgba(60, 60, 67, 0.60)] text-sm font-['Sansation'] mb-2">
						To
					</label>

					<div className="flex items-center justify-between w-full">
						{/* --- Currency Selector --- */}
						<div className="flex items-center gap-2">
							<button
								className="flex items-center gap-2 font-['Sansation']"
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								aria-expanded={isDropdownOpen}>
								<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
									{selectedCurrency ? (
										<img src={selectedCurrency?.iconUri} />
									) : (
										"?"
									)}
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
							<SearchableCurrencyDropdown
								isOpen={isDropdownOpen}
								onClose={() => setIsDropdownOpen(false)}
								onSelect={handleCurrencySelection}
								searchTerm={searchTerm}
								onSearchChange={setSearchTerm}
							/>
						</div>

						{/* --- Output Amount Display --- */}
						<div className="flex flex-col items-end ml-4">
							<span className="text-right font-bold font-['Sansation'] text-lg">
								{displayedAmount}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
