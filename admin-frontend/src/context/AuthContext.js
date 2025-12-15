import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      console.log('🔵 Attempting login...');
      
      const res = await api.login({ email, password });
      console.log('🔵 Response status:', res.status);
      
      // Parse response
      const data = await res.json();
      console.log('🔵 Response data:', data);
      
      // Check if response is OK (status 200-299)
      if (!res.ok) {
        console.log('❌ Login failed - Status not OK');
        return { 
          success: false, 
          error: data.message || 'Invalid email or password' 
        };
      }
      
      // Check if we got token
      if (!data.token) {
        console.log('❌ Login failed - Missing token in response');
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
      
      // Handle backend response structure (token, role, name at root level)
      const userRole = data.role || data.user?.role;
      const userName = data.name || data.user?.name;
      const userEmail = email; // Use the email from login form
      
      console.log('🔵 User role:', userRole);
      console.log('🔵 User name:', userName);
      
      // Check if user is admin
      if (userRole !== 'ADMIN') {
        console.log('❌ Access denied - User is not admin');
        return { 
          success: false, 
          error: 'Access denied. Admin privileges required.' 
        };
      }

      // Create user object to store
      const userObject = {
        name: userName,
        email: userEmail,
        role: userRole
      };

      // Success! Store everything
      console.log('✅ Login successful!');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(userObject));
      setToken(data.token);
      setUser(userObject);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        error: 'Connection failed. Is backend running on http://localhost:4000?' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};