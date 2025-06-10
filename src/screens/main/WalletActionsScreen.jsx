
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
      title: 'Send your tokens to another DAO member',
      subtitle: 'or invite someone by phone to receive them'
    },
    {
      id: 'exchange',
      title: 'Exchange your tokens to EURX (€ Euro)',
      subtitle: 'or other Cryptocurrency'
    },
    {
      id: 'loan',
      title: 'Request Loan with your tokens',
      subtitle: ''
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
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header */}
      <Header
        title="My Wallet"
        action={true}
      />

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8">
        {/* Stats Card */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {/* Action Options */}
        <div className="w-full mb-8 space-y-4">
          {actionOptions.map((option) => (
            <div
              key={option.id}
              onClick={() => handleActionSelect(option.id)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${selectedAction === option.id 
                  ? 'border-[#DC2366] bg-gradient-to-r from-[#DC2366]/10 to-[#4F5CAA]/10' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <h3 className="text-[16px] font-['Sansation'] font-bold text-[#1D2126] mb-1">
                    {option.title}
                  </h3>
                  {option.subtitle && (
                    <p className="text-[14px] font-['Sansation'] text-[#6B7280]">
                      {option.subtitle}
                    </p>
                  )}
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${selectedAction === option.id 
                    ? 'border-[#DC2366] bg-[#DC2366]' 
                    : 'border-gray-300'
                  }
                `}>
                  {selectedAction === option.id && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Next Button */}
        <div className="px-4 pb-8">
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
