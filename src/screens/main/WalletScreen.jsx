
import React from "react";
import { StatsCard } from "../../components/layout/StatsCard";
import Header from "../../components/layout/MainHeader";
import { useTranslation } from "../../hooks/useTranslation";

const WalletScreen = ({ onBack, walletData }) => {
  const { t } = useTranslation();

  // Create stats data from wallet data
  const statsData = walletData ? [
    { id: 'balance', value: `$${walletData.balance || 0}`, label: 'Balance' },
    { id: 'currency', value: walletData.balanceCurrency || 'USD', label: 'Currency' },
    { id: 'status', value: walletData.isPinCodeSet ? 'Secured' : 'Pending', label: 'Status' }
  ] : [
    { id: 'tokens', value: '234', label: 'Tokens' },
    { id: 'crypto', value: '190', label: 'Crypto' },
    { id: 'loans', value: '715', label: 'Loans' }
  ];

  const actionOptions = [
    {
      id: 'send',
      title: 'Send tokens',
      onClick: () => console.log('Send tokens clicked')
    },
    {
      id: 'exchange',
      title: 'Exchange tokens',
      onClick: () => console.log('Exchange tokens clicked')
    },
    {
      id: 'loan',
      title: 'Request Loan with your tokens',
      onClick: () => console.log('Request loan clicked')
    }
  ];

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white">
      {/* Header */}
      <Header
        title={t("wallet.title") || "My Wallet"}
        action={true}
      />

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {/* Stats Card */}
        <div className="w-full mb-8">
          <StatsCard stats={statsData} />
        </div>

        {/* Description Text */}
        <div className="text-center mb-8">
          <p className="text-[16px] font-['Sansation'] text-[#1D2126] leading-[1.4]">
            You can <span className="font-bold">Send</span>, <span className="font-bold">Exchange</span> and get a <span className="font-bold">Loan</span> with your tokens!
          </p>
        </div>

        {/* Action Options */}
        <div className="space-y-4 mb-8">
          {actionOptions.map((option) => (
            <button
              key={option.id}
              onClick={option.onClick}
              className="w-full h-[56px] bg-white border-2 border-transparent bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] rounded-lg p-[2px] hover:opacity-90 transition-opacity"
            >
              <div className="w-full h-full bg-white rounded-[6px] flex items-center justify-start px-6">
                <span className="text-[16px] font-['Sansation'] font-normal bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] bg-clip-text text-transparent">
                  {option.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Next Button */}
        <div className="px-4 pb-8">
          <button
            onClick={() => console.log('Next clicked')}
            className="w-full h-[48px] bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white text-[16px] font-['Sansation'] font-bold rounded-lg hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletScreen;
