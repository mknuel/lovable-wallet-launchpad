
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/MainHeader";
import { StatsCard } from "../../components/layout/StatsCard";
import Navigation from "../../components/layout/Navigation";
import { useTranslation } from "../../hooks/useTranslation";
import { useSelector, useDispatch } from "react-redux";
import { fetchWallet } from '../../store/reducers/walletSlice';
import { PATH_WALLET_ACTIONS } from "../../context/paths";
import api from "../../utils/api";

const SendTokensScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { walletData } = useSelector((state) => state.wallet);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch wallet data and users on component mount
  useEffect(() => {
    dispatch(fetchWallet());
    fetchUsers();
  }, [dispatch]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      console.log('Users fetched:', response);
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for development
      setUsers([
        { id: 1, name: 'Sam Mathew', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 2, name: 'Francine Bianca', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 3, name: 'Bianca Sullivan', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 4, name: 'Bianca Bradley', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Use real wallet data for stats
  const statsData = walletData?.data ? [
    { id: 'tokens', value: walletData.data.token || '0', label: 'Tokens' },
    { id: 'crypto', value: walletData.data.balance || '0', label: 'Crypto' },
    { id: 'loans', value: '0', label: 'Loans' }
  ] : [
    { id: 'tokens', value: '234', label: 'Tokens' },
    { id: 'crypto', value: '190', label: 'Crypto' },
    { id: 'loans', value: '715', label: 'Loans' }
  ];

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowAmountInput(true);
  };

  const handleSendTokens = () => {
    if (selectedUser && amount) {
      console.log('Sending', amount, 'tokens to', selectedUser.name);
      // Here you would implement the actual send logic
      alert(`Sending ${amount} tokens to ${selectedUser.name}`);
    }
  };

  const handleBackClick = () => {
    if (showAmountInput) {
      setShowAmountInput(false);
      setSelectedUser(null);
      setAmount('');
    } else {
      navigate(PATH_WALLET_ACTIONS);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full max-w-full bg-white overflow-hidden">
      {/* Header - Fixed positioning */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
        <Header
          title="My Wallet"
          action={true}
          onBack={handleBackClick}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-[66px] mb-[80px]">
        {/* Stats Card */}
        <div className="w-full mb-6">
          <StatsCard stats={statsData} />
        </div>

        {!showAmountInput ? (
          <>
            {/* Search Bar */}
            <div className="w-full mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Users List */}
            <div className="w-full flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={user.avatar || '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png'}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-500">Contact</p>
                      </div>
                      <div className="text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Selected User Display */}
            <div className="w-full mb-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <img
                  src={selectedUser.avatar || '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png'}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-sm text-gray-500">Selected recipient</p>
                </div>
              </div>
            </div>

            {/* Amount Input */}
            <div className="w-full mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to send
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Send Button */}
            <div className="w-full mb-5">
              <button
                onClick={handleSendTokens}
                disabled={!amount}
                className={`
                  w-full h-[48px] rounded-lg text-[16px] font-['Sansation'] font-bold uppercase tracking-wide
                  transition-all duration-200 flex items-center justify-center
                  ${
                    amount
                      ? "bg-gradient-to-r from-[#DC2366] to-[#4F5CAA] text-white cursor-pointer hover:opacity-90"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                SEND TOKENS
              </button>
            </div>
          </>
        )}
      </div>

      {/* Navigation - Fixed positioning */}
      <div className="w-full fixed bottom-0 left-0 right-0 z-50 bg-white">
        <Navigation nav={"My Wallet"} />
      </div>
    </div>
  );
};

export default SendTokensScreen;
