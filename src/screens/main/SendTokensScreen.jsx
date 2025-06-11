import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "../../hooks/useTranslation";
import { PATH_WALLET_ACTIONS } from "../../context/paths";
import api from "../../utils/api";
import Header from "../../components/layout/MainHeader";
import SearchIcon from "../../assets/icons/Search.svg";

const SendTokensScreen = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [amount, setAmount] = useState("");
	const [showAmountInput, setShowAmountInput] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);

	// Refs to prevent duplicate requests
	const activeRequest = useRef(null);
	const lastSearchQuery = useRef("");

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

	// Debounced search function
	const debounceSearch = useCallback(
		debounce((query) => {
			handleUserSearch(query);
		}, 500),
		[]
	);

	// Auto-load users on component mount
	useEffect(() => {
		console.log("Component mounted, loading initial users...");
		handleUserSearch("");
	}, []);

	// Search users when search query changes
	useEffect(() => {
		if (searchQuery !== "") {
			debounceSearch(searchQuery);
		}
	}, [searchQuery, debounceSearch]);

	const handleUserSearch = async (query) => {
		// Reset last search query tracking for fresh searches
		if (query !== lastSearchQuery.current) {
			lastSearchQuery.current = query;
		} else if (activeRequest.current) {
			console.log("Same query already in progress, skipping...");
			return;
		}

		try {
			if (query.trim()) {
				setIsSearching(true);
			} else {
				setIsLoading(true);
			}

			const endpoint = query.trim() 
				? `/users/by/name?name=${encodeURIComponent(query)}`
				: "/users";

			console.log(`Fetching users from: ${endpoint}`);

			activeRequest.current = api.get(endpoint);
			const response = await activeRequest.current;

			console.log("Users response:", response);

			if (response.data && Array.isArray(response.data)) {
				// Filter for active users only and format the data
				const activeUsers = response.data
					.filter((user) => user.status === "active")
					.map((user) => ({
						id: user._id,
						name: user.userName || user.phone || "Unknown User",
						firstName: user.userName || "",
						lastName: "",
						email: user.email || "",
						phone: user.phone || "",
						avatar: "/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png",
					}))
					.filter((user) => user.id && user.name); // Filter out invalid users

				setUsers(activeUsers);
			} else if (response.success && response.data && Array.isArray(response.data)) {
				// Handle search response format
				const activeUsers = response.data
					.filter((user) => user.status === "active")
					.map((user) => ({
						id: user._id,
						name: user.userName || user.phone || "Unknown User",
						firstName: user.userName || "",
						lastName: "",
						email: user.email || "",
						phone: user.phone || "",
						avatar: "/lovable-uploads/20928411-0a60-4d37-bedf-65edc245de4e.png",
					}))
					.filter((user) => user.id && user.name);

				setUsers(activeUsers);
			} else {
				setUsers([]);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
			// No mock data fallback - just set empty array
			setUsers([]);
		} finally {
			activeRequest.current = null;
			setIsLoading(false);
			setIsSearching(false);
		}
	};

	const handleUserSelect = (user) => {
		setSelectedUser(user);
		setShowAmountInput(true);
	};

	const handleSendTokens = () => {
		if (selectedUser && amount) {
			console.log("Sending", amount, "tokens to", selectedUser.name);
			// Here you would implement the actual send logic
			alert(`Sending ${amount} tokens to ${selectedUser.name}`);
		}
	};

	const handleBackClick = () => {
		if (showAmountInput) {
			setShowAmountInput(false);
			setSelectedUser(null);
			setAmount("");
		} else {
			navigate(PATH_WALLET_ACTIONS);
		}
	};

	return (
		<div className="flex flex-col min-h-screen w-full max-w-full bg-white">
			{/* Header - Same style as wallet screens */}
			<div className="w-full sticky top-0 left-0 right-0 z-50 bg-white">
				<Header title={t("wallet.title") || "My Wallet"} action={true} />
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col px-6 py-8 overflow-hidden mt-3">
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
									className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
								/>
								<div className="absolute left-4 top-1/2 transform -translate-y-1/2">
									<img src={SearchIcon} />
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
									{searchQuery
										? "No active users found matching your search"
										: "No active users available"}
								</div>
							) : (
								<div className="space-y-4">
									{users?.map((user) => (
										<button
											key={user.id}
											onClick={() => handleUserSelect(user)}
											className="w-full flex items-center py-2 px-1 bg-white hover:bg-gray-50 transition-colors text-left border-b border-gray-100">
											<img
												src={user.avatar}
												alt={user.name}
												className="w-12 h-12 rounded-full object-cover mr-4"
											/>
											<div className="flex-1">
												<h3 className="text-lg capitalize font-semibold text-gray-900">
													{user.name}
												</h3>
												<p className="text-sm text-gray-500">Contact</p>
											</div>
											<div className="text-gray-400">
												<svg
													className="w-6 h-6"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
													/>
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
									<h3 className="text-lg font-semibold text-gray-900">
										{selectedUser.name}
									</h3>
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
                `}>
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
