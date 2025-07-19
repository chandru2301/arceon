import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import config from '../config';

export const DashboardRedirect: React.FC = () => {
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing GitHub authentication...');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        //console.log('🔍 DashboardRedirect - Analyzing URL parameters...');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        //console.log('🔑 GitHub OAuth code present:', !!code);
        //console.log('🔗 GitHub OAuth state present:', !!state);
        //console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl);
        
        if (code) {
          setMessage('GitHub code detected! Authenticating...');
          
          try {
            // Use the authApi service to handle OAuth callback
            const result = await authApi.handleOAuthCallback(code);
            
            if (result.success && result.token) {
              //console.log('✅ Token exchange successful');
              
              // Now call checkAuth to complete login
              await checkAuth();
              
              // Clean up URL parameters
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
              
              // Redirect after a short delay
              setMessage('Authentication successful! Redirecting to dashboard...');
              setTimeout(() => {
                // Check for redirect in state
                let redirectTo = '/dashboard';
                if (state) {
                  try {
                    const stateData = JSON.parse(decodeURIComponent(state));
                    if (stateData?.redirect) {
                      redirectTo = stateData.redirect;
                    }
                  } catch (e) {
                    console.error('Failed to parse state parameter:', e);
                  }
                }
                
                // Also check localStorage for redirect path
                const storedRedirect = localStorage.getItem('auth_redirect_path');
                if (storedRedirect) {
                  redirectTo = storedRedirect;
                  localStorage.removeItem('auth_redirect_path');
                }
                
                //  console.log('🚀 Redirecting to:', redirectTo);
                window.location.href = redirectTo;
              }, 1500);
            } else {
              throw new Error(result.error || 'No token received from server');
            }
          } catch (error) {
            console.error('💥 API call error:', error);
            setMessage(`Authentication failed: ${error.message}. Redirecting to login...`);
            setTimeout(() => {
              window.location.href = '/login';
            }, 3000);
          }
        } else {
          setMessage('No authentication code found. Redirecting to login...');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1500);
        }
      } catch (error) {
        console.error('💥 Error handling GitHub redirect:', error);
        setMessage(`Authentication error: ${error.message}. Redirecting to login...`);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [checkAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>GitHub Authentication</CardTitle>
          <CardDescription>
            Processing your GitHub login...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="my-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 animate-spin" />
                <p>{message}</p>
              </div>
            ) : (
              <p>{message}</p>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-4">
            If you're not redirected automatically, <a href="/dashboard" className="text-blue-500 hover:underline">click here</a>.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 