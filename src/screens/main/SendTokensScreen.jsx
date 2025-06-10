
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { PATH_WALLET_ACTIONS } from "../../context/paths";
import api from "../../utils/api";

const SendTokensScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Fetch initial users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Debounced search function
  const debounceSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        searchUsers(query);
      } else {
        fetchUsers();
      }
    }, 500),
    []
  );

  // Search users when search query changes
  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      console.log('Users fetched:', response);
      
      if (response.data && Array.isArray(response.data)) {
        // Filter for active users only and format the data
        const activeUsers = response.data
          .filter(user => user.status === 'active')
          .map(user => ({
            id: user._id,
            name: user.userName || user.phone || 'Unknown User',
            firstName: user.userName || '',
            lastName: '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png'
          }))
          .filter(user => user.id && user.name); // Filter out invalid users
        
        setUsers(activeUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Mock data for development - only active users
      setUsers([
        { id: 1, name: 'Sam Mathew', firstName: 'Sam', lastName: 'Mathew', email: 'sam@example.com', phone: '+1234567890', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 2, name: 'Francine Bianca', firstName: 'Francine', lastName: 'Bianca', email: 'francine@example.com', phone: '+1234567891', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 3, name: 'Bianca Sullivan', firstName: 'Bianca', lastName: 'Sullivan', email: 'bianca@example.com', phone: '+1234567892', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 4, name: 'Bianca Bradley', firstName: 'Bianca', lastName: 'Bradley', email: 'bianca2@example.com', phone: '+1234567893', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      setIsSearching(true);
      const response = await api.get(`/users/by/name?name=${encodeURIComponent(query)}`);
      console.log('Search results:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Filter for active users only and format the data
        const activeUsers = response.data
          .filter(user => user.status === 'active')
          .map(user => ({
            id: user._id,
            name: user.userName || user.phone || 'Unknown User',
            firstName: user.userName || '',
            lastName: '',
            email: user.email || '',
            phone: user.phone || '',
            avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png'
          }))
          .filter(user => user.id && user.name); // Filter out invalid users
        
        setUsers(activeUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      // If search fails, fallback to filtered mock data - only active users
      const filteredMockUsers = [
        { id: 1, name: 'Sam Mathew', firstName: 'Sam', lastName: 'Mathew', email: 'sam@example.com', phone: '+1234567890', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 2, name: 'Francine Bianca', firstName: 'Francine', lastName: 'Bianca', email: 'francine@example.com', phone: '+1234567891', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 3, name: 'Bianca Sullivan', firstName: 'Bianca', lastName: 'Sullivan', email: 'bianca@example.com', phone: '+1234567892', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' },
        { id: 4, name: 'Bianca Bradley', firstName: 'Bianca', lastName: 'Bradley', email: 'bianca2@example.com', phone: '+1234567893', avatar: '/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png' }
      ].filter(user => 
        user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        user.lastName.toLowerCase().includes(query.toLowerCase())
      );
      setUsers(filteredMockUsers);
    } finally {
      setIsSearching(false);
    }
  };

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
      {/* Header - Same style as wallet screens */}
      <div className="w-full fixed top-0 left-0 right-0 z-50 bg-white">
        <header className="w-full h-[66px] flex flex-row items-center justify-between gap-[9px] py-[18px] px-6 z-50">
          <button onClick={handleBackClick} className="p-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#837E7E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <h1 className="flex-1 text-center font-regular text-[16px]">Send Tokens</h1>
          <div className="w-5"></div> {/* Spacer for symmetry */}
        </header>
        <hr className="w-full text-[#EEEEEE] z-50"></hr>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-[66px]">
        {!showAmountInput ? (
          <>
            {/* Search Bar */}
            <div className="w-full mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Users List */}
            <div className="w-full flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchQuery ? 'No active users found matching your search' : 'No active users available'}
                </div>
              ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="w-full flex items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
                    >
                      <img
                        src={user.avatar}
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
                  src={selectedUser.avatar}
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
                className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
    </div>
  );
};

export default SendTokensScreen;
