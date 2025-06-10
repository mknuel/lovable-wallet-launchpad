
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from '../store/reducers/userSlice';
import { setAuth, clearAuth } from '../store/reducers/authSlice';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUserData = JSON.parse(userData);
          dispatch(setUser(parsedUserData));
          dispatch(setAuth({ token }));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          logout();
        }
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [dispatch]);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Check if this is a first-time sign-in
    const hasSignedInBefore = localStorage.getItem('hasSignedInBefore');
    if (!hasSignedInBefore) {
      localStorage.setItem('isFirstTimeSignIn', 'true');
      localStorage.setItem('hasSignedInBefore', 'true');
    }
    
    dispatch(setUser(userData));
    dispatch(setAuth({ token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    dispatch(clearUser());
    dispatch(clearAuth());
    
    // Dispatch custom event for unauthorized access
    window.dispatchEvent(new Event('auth:unauthorized'));
  };

  const updateUserData = (newUserData) => {
    const oldUserData = JSON.parse(localStorage.getItem('userData') || '{}');
    const updatedUserData = { ...oldUserData, ...newUserData };
    
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    dispatch(setUser(updatedUserData));
  };

  return (
    <AuthContext.Provider value={{ login, logout, updateUserData, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
