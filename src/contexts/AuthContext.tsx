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
          await handleOAuthCallback();
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

  const handleOAuthCallback = async () => {
    try {
      console.log('🔍 Starting OAuth callback handling...');
      console.log('📍 Current URL:', window.location.href);
      console.log('🔍 URL parameters:', new URLSearchParams(window.location.search));
      
      // Get code and state from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      
      // Extract redirect path from state if available
      let redirectPath = '/dashboard';
      if (state) {
        try {
          const stateData = JSON.parse(decodeURIComponent(state));
          if (stateData?.redirect) {
            redirectPath = stateData.redirect;
            console.log('📍 Found redirect path in state:', redirectPath);
          }
        } catch (e) {
          console.error('Failed to parse state parameter:', e);
        }
      }
      
      // After OAuth2 redirect with code, exchange it for a token
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
      console.log('🌐 API Base URL:', API_BASE_URL);
      
      try {
        console.log('🔑 Step 1: Attempting to get GitHub token...');
        // First, get the GitHub token
        const tokenResponse = await fetch(`${API_BASE_URL}/api/token?code=${code}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });

        console.log('📡 Token response status:', tokenResponse.status);
        console.log('📡 Token response headers:', Object.fromEntries(tokenResponse.headers.entries()));

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          console.log('✅ Token response data:', tokenData);
          
          if (tokenData.token) {
            // Store the token for direct GitHub API calls
            localStorage.setItem('github_token', tokenData.token);
            console.log('💾 Token stored successfully in localStorage');
            
            console.log('👤 Step 2: Getting user info...');
            // Now get user info
            const userResponse = await fetch(`${API_BASE_URL}/api/user`, {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            console.log('📡 User response status:', userResponse.status);
            console.log('📡 User response headers:', Object.fromEntries(userResponse.headers.entries()));

            if (userResponse.ok) {
              const userData = await userResponse.json();
              console.log('✅ User data received:', userData);
              
              // Set authentication state
              setIsAuthenticated(true);
              setUser(userData);
              
              console.log('🎉 OAuth2 login successful!');
              
              // Clean up the URL and use the redirect path from state
              window.history.replaceState({}, document.title, window.location.pathname);
              console.log('🧹 URL cleaned up, redirect target:', redirectPath);
              
              // Redirect to dashboard or intended path
              console.log('🚀 Redirecting to:', redirectPath);
              window.location.href = redirectPath;
            } else {
              const errorText = await userResponse.text();
              console.error('❌ Failed to get user info:', userResponse.status, errorText);
              throw new Error(`Failed to get user info: ${userResponse.status} ${errorText}`);
            }
          } else {
            console.error('❌ Token missing in response:', tokenData);
            throw new Error('Token missing in response');
          }
        } else {
          const errorText = await tokenResponse.text();
          console.error('❌ Failed to get token:', tokenResponse.status, errorText);
          throw new Error(`Failed to get token: ${tokenResponse.status} ${errorText}`);
        }
      } catch (error) {
        console.error('⚠️ OAuth callback error:', error);
        console.log('🔄 Attempting fallback to session-based auth...');
        
        // Fallback: just check if user is authenticated via session
        try {
          const result = await authApi.checkAuth();
          console.log('🔄 Fallback auth result:', result);
          
          if (result.isAuthenticated && result.user) {
            setIsAuthenticated(true);
            setUser(result.user);
            console.log('✅ Fallback auth successful');
            
            // Clean up the URL and use the redirect path from state
            window.history.replaceState({}, document.title, window.location.pathname);
            console.log('🧹 URL cleaned up, redirect target:', redirectPath);
            
            // Redirect to dashboard or intended path
            console.log('🚀 Redirecting to:', redirectPath);
            window.location.href = redirectPath;
          } else {
            console.error('❌ Fallback auth failed - user not authenticated');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (fallbackError) {
          console.error('❌ Fallback auth also failed:', fallbackError);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('💥 OAuth callback completely failed:', error);
      setIsAuthenticated(false);
      setUser(null);
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