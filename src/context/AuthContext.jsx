
 
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { setUser, clearUser } from '../store/reducers/userSlice';
import { setAuth, clearAuth } from '../store/reducers/authSlice';
import { PATH_AUTH, PATH_MAIN, PATH_LOGIN, PATH_SPLASH, PATH_LANDING } from "./paths";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
	const [isLoading, setIsLoading] = useState(false); // Changed to false since splash handles initial loading
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Simplified auth check - no longer handles initial loading
	useEffect(() => {
		// Only handle route protection, not initial auth loading
		const token = localStorage.getItem("token");
		const userData = localStorage.getItem("userData");

		if (!token || !userData) {
			// If no auth data and not on public routes, redirect to landing
			if (
				location.pathname !== PATH_AUTH &&
				location.pathname !== PATH_LOGIN &&
				location.pathname !== "/" &&
				location.pathname !== PATH_LANDING
			) {
				navigate(PATH_LANDING, { replace: true });
			}
		}
	}, [dispatch, navigate, location.pathname]);

	const login = (token, userData) => {
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
