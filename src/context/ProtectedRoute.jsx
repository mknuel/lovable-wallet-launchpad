import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATH_MAIN } from "./paths";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
	const { isLoading } = useAuth();
	const { isAuthenticated } = useSelector((state) => state.auth);

	// console.log('isAuthenticated:', isAuthenticated, 'isLoading:', isLoading);

	// Show loading indicator while checking auth status
	if (isLoading) {
		return <div>Loading...</div>; // Or a proper loading spinner component
	}

	// Only redirect after loading is complete and we know the user is not authenticated
	if (!isAuthenticated) {
		return <Navigate to={PATH_MAIN} replace />;
	}

	return children;
};

export default ProtectedRoute;
