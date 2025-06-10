import { clearAuth } from '../reducers/authSlice';
import { clearUser } from '../reducers/userSlice';

const authMiddleware = (store) => (next) => (action) => {
  // Handle API errors related to authentication
  if (
    action.type.endsWith('/rejected') && 
    action.payload?.status === 401
  ) {
    // Clear auth state
    store.dispatch(clearAuth());
    store.dispatch(clearUser());
    
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Dispatch custom event
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
  
  return next(action);
};

export default authMiddleware;
