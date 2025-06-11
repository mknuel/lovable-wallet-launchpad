import { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
	const authContext = useContext(AuthContext);
	const userData = useSelector((state) => state.user);
	const { isAuthenticated } = useSelector((state) => state.auth);

	return {
		...authContext,
		isAuthenticated,
		userData,
	};
};
