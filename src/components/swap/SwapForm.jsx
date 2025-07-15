import React, { useState, useEffect } from "react";
import { FromCurrencyCard } from "./FromCurrencyCard";
import { ToCurrencyCard } from "./ToCurrencyCard";
import { TransactionDetails } from "./TransactionDetails";
import CommonButton from "../Buttons/CommonButton";
// import { SwapIcon } from "../Icons/SwapIcon"; // Assuming you have a swap icon component

export const SwapForm = ({
	fromAmount,
	fromCurrency,
	toCurrency,
	setFromAmount,
	toAmount,
	setToAmount,
	setToCurrency,
	setFromCurrency,
}) => {
	const handleFromAmountChange = (amount) => {
		setFromAmount(amount);

		// Don't calculate here - let the quote from Bridge API provide the exact amount
		// This will be updated when we get the actual quote from thirdweb Bridge
		setToAmount("");
	};
	// Swap the "from" and "to" currencies
	const handleSwapCurrencies = () => {
		setFromCurrency(toCurrency);
		setToCurrency(fromCurrency);
	};

	// Handle form submission
	/* 	const handleFormSubmit = (e) => {
		e.preventDefault();
		if (isFormValid) {
			onSubmit({
				fromAmount,
				fromCurrency,
				toCurrency,
				toAmount,
			});
		}
	}; */

	// Check if the form is valid for submission
	const isFormValid =
		fromCurrency && toCurrency && fromAmount && parseFloat(fromAmount) > 0;

	return (
		<div className="flex flex-col w-full flex-1">
			<div className="relative">
				{/* "From" Currency Input */}
				<FromCurrencyCard
					selectedCurrency={fromCurrency}
					amount={fromAmount}
					onAmountChange={handleFromAmountChange}
					onCurrencySelect={setFromCurrency}
				/>

				{/* "To" Currency Input */}
				<ToCurrencyCard
					selectedCurrency={toCurrency}
					amount={toAmount}
					onCurrencySelect={setToCurrency}
				/>
			</div>
		</div>
	);
};
