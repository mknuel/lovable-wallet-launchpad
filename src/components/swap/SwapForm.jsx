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

		// Get the USD prices from the currency objects
		const fromPriceUsd = fromCurrency?.price_data?.price_usd;
		const toPriceUsd = toCurrency?.priceUsd;
		const fromAmountNum = parseFloat(amount);

		// Proceed only if we have valid prices and a valid input amount
		if (fromAmountNum > 0 && fromPriceUsd > 0 && toPriceUsd > 0) {
			// 1. Convert the "from" amount to its value in USD
			const valueInUsd = fromAmountNum * fromPriceUsd;

			// 2. Calculate how much of the "to" currency can be bought with that USD value
			const convertedAmount = valueInUsd / toPriceUsd;

			// 3. Update the "to" amount state, formatted to a reasonable precision
			setToAmount(convertedAmount.toFixed(4));
		} else {
			// If the input is invalid or prices are missing, clear the "to" amount
			setToAmount("");
		}
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
