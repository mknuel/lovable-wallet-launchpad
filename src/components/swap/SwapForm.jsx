
import React, { useState } from 'react';
import { CurrencyCard } from './CurrencyCard';
import CommonButton from '../Buttons/CommonButton';

export const SwapForm = ({ onSubmit }) => {
  const [fromCurrency, setFromCurrency] = useState(undefined);
  const [toCurrency, setToCurrency] = useState(undefined);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const handleFromAmountChange = (amount) => {
    setFromAmount(amount);
    
    // Mock conversion calculation
    const numAmount = parseFloat(amount) || 0;
    const convertedAmount = (numAmount * 0.95).toFixed(4);
    setToAmount(convertedAmount);
  };

  const handleFromCurrencySelect = (currency) => {
    setFromCurrency(currency);
  };

  const handleToCurrencySelect = (currency) => {
    setToCurrency(currency);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (isFormValid) {
      onSubmit({
        fromAmount,
        fromCurrency: fromCurrency?.symbol,
        toCurrency: toCurrency?.symbol,
        toAmount
      });
    }
  };

  const isFormValid = fromCurrency && toCurrency && fromAmount && parseFloat(fromAmount) > 0;

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col w-full flex-1">
      <CurrencyCard
        type="from"
        selectedCurrency={fromCurrency}
        amount={fromAmount}
        onAmountChange={handleFromAmountChange}
        onCurrencySelect={handleFromCurrencySelect}
        availableBalance={1200.97}
      />

      <CurrencyCard
        type="to"
        selectedCurrency={toCurrency}
        amount={toAmount}
        onAmountChange={() => {}}
        onCurrencySelect={handleToCurrencySelect}
      />

      <div className="mt-auto pt-8 pb-4">
        <CommonButton
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[48px] ${
            isFormValid 
              ? '' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          NEXT
        </CommonButton>
      </div>
    </form>
  );
};
