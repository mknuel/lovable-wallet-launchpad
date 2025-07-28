
/* eslint-disable no-unused-vars */
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTelegram } from "./hooks/useTelegram";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";

import MainScreen from "./screens/SplashScreen";
import { PublicRouteArray } from "./context/PublicRouteArray";
import { ProtectedRouteArray } from "./context/ProtectedRouteArray";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { PATH_AUTH } from "./context/paths";
import ScrollToTop from "./components/layout/ScrollToTop";

import "./App.css";

function App() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Listen for auth errors
	useEffect(() => {
		const handleUnauthorized = () => {
			console.log("Unauthorized function called");
			navigate(PATH_AUTH); // Redirect to auth page, not login
		};
		window.addEventListener("auth:unauthorized", handleUnauthorized);
		return () => {
			window.removeEventListener("auth:unauthorized", handleUnauthorized);
		};
	}, [dispatch, navigate]);

	return (
	<div className="app-container">
		<AuthProvider>
			<ScrollToTop />
			<Routes>
				<Route index element={<MainScreen />} />
				{PublicRouteArray.map((route) => (
					<Route key={route.path} path={route.path} element={route.element} />
				))}
				{ProtectedRouteArray.map((route) => (
					<Route
						key={route.path}
						path={route.path}
						element={<ProtectedRoute>{route.element}</ProtectedRoute>}
					/>
				))}
			</Routes>
		</AuthProvider>
	</div>
	);
}

export default App;
