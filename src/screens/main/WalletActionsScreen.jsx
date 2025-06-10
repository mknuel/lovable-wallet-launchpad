
import React, { useState } from "react";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";

const WalletActionsScreen = ({ onBack, walletData }) => {
  const { t } = useTranslation();
  const [selectedAction, setSelectedAction] = useState(null);

  // Use the same default stats data
  const statsData = [
    { id: 'tokens', value: '234', label: 'Tokens' },
    { id: 'crypto', value: '190', label: 'Crypto' },
    { id: 'loans', value: '715', label: 'Loans' }
  ];

  const actionOptions = [
    {
      id: 'send',
      label: 'Send your tokens to another DAO member or invite someone by phone to receive them'
    },
    {
      id: 'exchange',
      label: 'Exchange your tokens to EURX (€ Euro) or other Cryptocurrency'
    },
    {
      id: 'loan',
      label: 'Request Loan with your tokens'
    }
  ];

  const handleActionSelect = (actionId) => {
    setSelectedAction(actionId);
  };

  const handleNextClick = () => {
    if (selectedAction) {
      console.log('Next action for:', selectedAction);
      // This is where you'll add the next action logic
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white overflow-hidden">
      {/* Header */}
      <Header
        title="My Wallet"
        action={true}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden">
        {/* Stats Card */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {/* Action Options */}
        <div className="w-full mb-8 space-y-4">
          {actionOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleActionSelect(option.id)}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold bg-white transition-colors text-left
                ${selectedAction === option.id 
                  ? 'border border-pink-300 text-pink-600 bg-gradient-to-r from-pink-50 to-purple-50' 
                  : 'border border-pink-300 text-pink-600 hover:bg-gray-50'
                }
              `}
            >
              {option.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Next Button */}
        <div className="w-full">
          <button
            onClick={handleNextClick}
            disabled={!selectedAction}
            className={`
              w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
              transition-all duration-200 flex items-center justify-center
              ${
                selectedAction
                  ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }
            `}
          >
            NEXT
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default WalletActionsScreen;
