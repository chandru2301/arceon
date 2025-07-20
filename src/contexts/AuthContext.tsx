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
      const token = localStorage.getItem('jwt_token');
      console.log('🔑 Token in localStorage:', !!token);
      
      if (token) {
        console.log('✅ Token found, verifying with backend...');
        // If we have a token, verify it's still valid by getting user info
        const result = await authApi.checkAuth();
        console.log('🔍 Token verification result:', result);
        setIsAuthenticated(result.isAuthenticated);
        setUser(result.user);
      } else {
        console.log('❌ No token found');
        // No token, user is not authenticated
        // Note: We don't handle OAuth codes here anymore since OAuthCallback component handles that
          setIsAuthenticated(false);
          setUser(null);
      }
    } catch (error) {
      console.error('💥 Auth check failed:', error);
      // Clear potentially invalid tokens
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('github_access_token');
      localStorage.removeItem('user_info');
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
    
    // Store the redirect path in localStorage
    localStorage.setItem('auth_redirect_path', redirectPath);
    
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
      // Remove tokens from localStorage
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('github_access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_redirect_path');
      
      // Call backend logout endpoint
      await authApi.logout();
      
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if backend logout fails, clear local state
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('github_access_token');
      localStorage.removeItem('user_info');
      localStorage.removeItem('auth_redirect_path');
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    // Don't check auth if we're on the OAuth callback page
    if (window.location.pathname === '/oauth/callback') {
      setLoading(false);
      return;
    }
    
    checkAuth();
  }, []);

  // Check auth on page focus (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      // Don't check auth if we're on the OAuth callback page
      if (window.location.pathname === '/oauth/callback') {
        return;
      }
      
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