import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '@/services/api';
import type { GitHubUser } from '@/services/api';
import config from '../config';

interface AuthContextType {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  loading: boolean;
  login: (redirectPath?: string) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('🔍 Starting auth check...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔍 URL parameters:', new URLSearchParams(window.location.search).toString());
      
      // First check if we have a token in localStorage
      const token = localStorage.getItem('github_token');
      console.log('🔑 Token in localStorage:', !!token);
      
      if (token) {
        console.log('✅ Token found, verifying with GitHub API...');
        // If we have a token, verify it's still valid by getting user info
        const result = await authApi.checkAuth();
        console.log('🔍 Token verification result:', result);
        setIsAuthenticated(result.isAuthenticated);
        setUser(result.user);
      } else {
        console.log('❌ No token found, checking for OAuth success...');
        // No token, check if we just came back from OAuth2 login
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        console.log('🔍 URL code parameter:', code);
        
        if (code) {
          console.log('✅ OAuth code detected, handling callback...');
          // We have a code from OAuth2, handle the callback
          const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
          
          try {
            // Get token using the code
            const tokenResponse = await fetch(`${API_BASE_URL}/api/token?code=${code}`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            });
            
            if (tokenResponse.ok) {
              const tokenData = await tokenResponse.json();
              
              if (tokenData.token) {
                // Store the token
                localStorage.setItem('github_token', tokenData.token);
                
                // Get user info
                const userResponse = await fetch(`${API_BASE_URL}/api/user`, {
                  method: 'GET',
                  credentials: 'include',
                  headers: {
                    'Authorization': `Bearer ${tokenData.token}`,
                    'Content-Type': 'application/json',
                  },
                });
                
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  setIsAuthenticated(true);
                  setUser(userData);
                } else {
                  throw new Error('Failed to get user info');
                }
              } else {
                throw new Error('No token in response');
              }
            } else {
              throw new Error('Failed to get token');
            }
          } catch (error) {
            console.error('Error handling OAuth code:', error);
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('❌ No token and no OAuth code, user not authenticated');
          // No token and no code, user is not authenticated
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('💥 Auth check failed:', error);
      // Clear potentially invalid token
      localStorage.removeItem('github_token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      console.log('🏁 Auth check completed');
      setLoading(false);
    }
  };

  const login = (redirectPath = '/dashboard') => {
    // Redirect to Spring Boot OAuth2 endpoint with redirect parameter
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    
    // Use the redirect URI from config
    const redirectUri = config.github.redirectUri;
    
    // Add state parameter to track the redirect URL
    const state = encodeURIComponent(JSON.stringify({ redirect: redirectPath }));
    
    // Build the full OAuth URL with redirect_uri parameter
    const loginUrl = `${API_BASE_URL}${config.github.authorizationUrl}?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    
    console.log("🚀 Starting GitHub OAuth flow...");
    console.log("🔗 Login URL:", loginUrl);
    console.log("🧭 Current location:", window.location.href);
    console.log("🎯 Redirect target:", redirectPath);
    console.log("🔄 Callback URI:", redirectUri);
    
    window.location.href = loginUrl; 
  };

  const logout = async () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem('github_token');
      
      // Call backend logout endpoint
      await authApi.logout();
      
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend logout fails, clear local state
      localStorage.removeItem('github_token');
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Check auth on page focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading]);

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 