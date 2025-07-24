
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setUser, clearUser } from '../store/reducers/userSlice';
import { setAuth, clearAuth } from '../store/reducers/authSlice';
import { PATH_AUTH, PATH_MAIN, PATH_LOGIN, PATH_SPLASH, PATH_LANDING } from "./paths";
import { useAutoMint } from "../hooks/useAutoMint";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const { mintOnLogin } = useAutoMint();

	useEffect(() => {
		// Check if user is logged in on mount
		const checkAuth = () => {
			const token = localStorage.getItem("token");
			const userData = localStorage.getItem("userData");

			if (token && userData) {
				try {
					const parsedUserData = JSON.parse(userData);
					dispatch(setUser(parsedUserData));
					dispatch(setAuth({ token }));

					// If user is on auth pages but is authenticated, redirect to main
					if (
						location.pathname === PATH_AUTH ||
						location.pathname === PATH_LOGIN ||
						location.pathname === "/"
					) {
						navigate(PATH_MAIN, { replace: true });
					}
				} catch (error) {
					console.error("Failed to parse user data:", error);
					logout();
				}
			} else {
				// If no auth data and not on auth pages, redirect to auth
				if (
					location.pathname !== PATH_AUTH &&
					location.pathname !== PATH_LOGIN &&
					location.pathname !== "/"
				) {
					navigate(PATH_LANDING, { replace: true });
				}
			}

			setIsLoading(false);
		};

		checkAuth();
	}, [dispatch, navigate, location.pathname]);

	const login = async (token, userData) => {
		localStorage.setItem("token", token);
		localStorage.setItem("userData", JSON.stringify(userData));

		// Check if this is a first-time sign-in
		const hasSignedInBefore = localStorage.getItem("hasSignedInBefore");
		const hasCreatedPin = localStorage.getItem("userHasPin");

		if (!hasSignedInBefore) {
			localStorage.setItem("isFirstTimeSignIn", "true");
			localStorage.setItem("hasSignedInBefore", "true");
		} else if (hasCreatedPin) {
			// For returning users with PIN, set flag for mandatory PIN entry
			localStorage.setItem("needsPinEntry", "true");
		}

		dispatch(setUser(userData));
		dispatch(setAuth({ token }));

		// Auto-mint tokens on login (non-blocking)
		try {
			console.log("🚀 Starting auto-mint process...");
			const mintResult = await mintOnLogin("100");
			
			if (mintResult && mintResult.success) {
				console.log(`🎉 Auto-mint completed: ${mintResult.amount} EURX tokens minted`);
			}
		} catch (error) {
			console.log("⚠️ Auto-mint failed, but login continues:", error.message);
		}

		// Navigate to main menu after successful login
		navigate(PATH_MAIN, { replace: true });
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userData");
		localStorage.removeItem("needsPinEntry");
		localStorage.removeItem("isFirstTimeSignIn");

		dispatch(clearUser());
		dispatch(clearAuth());

		// Navigate to auth page
		navigate(PATH_SPLASH, { replace: true });

		// Dispatch custom event for unauthorized access
		window.dispatchEvent(new Event("auth:unauthorized"));
	};

	const updateUserData = (newUserData) => {
		const oldUserData = JSON.parse(localStorage.getItem("userData") || "{}");
		const updatedUserData = { ...oldUserData, ...newUserData };

		localStorage.setItem("userData", JSON.stringify(updatedUserData));
		dispatch(setUser(updatedUserData));
	};

	return (
		<AuthContext.Provider value={{ login, logout, updateUserData, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
