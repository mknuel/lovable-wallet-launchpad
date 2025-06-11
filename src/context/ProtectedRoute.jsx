import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PATH_AUTH } from "./paths";
import { useAuth } from "./AuthContext";

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
		return <Navigate to={PATH_AUTH} replace />;
	}

	return children;
};

export default ProtectedRoute;
