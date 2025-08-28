import { useSelector } from "react-redux";
import { useAuthContext } from "../context/AuthContext";

export const useAuth = () => {
	const authContext = useAuthContext();
	const userData = useSelector((state) => state.user);
	const { isAuthenticated } = useSelector((state) => state.auth);

	return {
		...authContext,
		isAuthenticated,
		userData,
	};
};
