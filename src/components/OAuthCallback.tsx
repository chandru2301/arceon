import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import config from '../config';

export const OAuthCallback: React.FC = () => {
  const { checkAuth } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing GitHub authentication...');
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Log important information for debugging
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        // Check if this code has already been processed
        const processedCode = sessionStorage.getItem('processed_oauth_code');
        if (processedCode === code) {
          console.log('⚠️ OAuth code already processed, skipping...');
          setStatus('success');
          setMessage('Authentication already completed!');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1000);
          return;
        }

        // Store debug info
        setDebugInfo({
          currentUrl: window.location.href,
          code: code ? `${code.substring(0, 6)}...` : null,
          state: state ? `${state.substring(0, 10)}...` : null,
          error,
          errorDescription,
          hasJwtToken: !!localStorage.getItem('jwt_token'),
          hasGitHubToken: !!localStorage.getItem('github_access_token'),
          timestamp: new Date().toISOString(),
          apiBaseUrl: import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl
        });

        console.log('🔍 OAuth Callback Component - Processing callback...');
        console.log('📍 Current URL:', window.location.href);
        console.log('🔑 Code present:', !!code);
        console.log('🔗 State present:', !!state);
        console.log('🌐 API Base URL:', import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl);

        if (error) {
          console.error('❌ OAuth error:', error, errorDescription);
          setStatus('error');
          setMessage(`Authentication error: ${errorDescription || error}`);
          return;
        }

        if (!code) {
          console.error('❌ No code parameter in callback URL');
          setStatus('error');
          setMessage('No authentication code received from GitHub.');
          return;
        }

        // Mark this code as processed
        sessionStorage.setItem('processed_oauth_code', code);

        // Call the API to get token
        console.log('🔄 Exchanging code for token...');
        setMessage('Authenticating with GitHub...');
        
        try {
          // Use the authApi service to handle OAuth callback
          const result = await authApi.handleOAuthCallback(code);
          
          if (result.success && result.token) {
            console.log('✅ Token exchange successful');
            
            // Now call checkAuth to complete login
            await checkAuth();
            
            setStatus('success');
            setMessage('Successfully authenticated with GitHub!');
            
            // Redirect after a short delay
            setTimeout(() => {
              // Clean up the processed code
              sessionStorage.removeItem('processed_oauth_code');
              
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
              
              console.log('🚀 Redirecting to:', redirectTo);
              window.location.href = redirectTo;
            }, 1000);
          } else {
            throw new Error(result.error || 'No token received from server');
          }
        } catch (error) {
          console.error('💥 API call error:', error);
          setStatus('error');
          setMessage(`Authentication failed: ${error.message}`);
        }
      } catch (error) {
        console.error('💥 OAuth callback error:', error);
        setStatus('error');
        setMessage(`An unexpected error occurred: ${error.message}`);
      }
    };

    processCallback();
  }, [checkAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>GitHub Authentication</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 py-6">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 animate-spin" />
              <p className="text-center">{message}</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p>{message}</p>
              <p className="text-sm text-gray-500">Redirecting you to the dashboard...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-600">{message}</p>
              <button 
                className="text-sm text-blue-600 hover:underline"
                onClick={() => window.location.href = '/login'}
              >
                Return to login
              </button>
              
              {/* Debug info */}
              <details className="text-xs text-left w-full mt-6 p-3 bg-gray-50 rounded-md">
                <summary className="cursor-pointer font-medium">Debug Information</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}; 