import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

export const DashboardRedirect: React.FC = () => {
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Processing GitHub authentication...');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        console.log('🔍 DashboardRedirect - Analyzing URL parameters...');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        
        console.log('🔑 GitHub OAuth code present:', !!code);
        console.log('🔗 GitHub OAuth state present:', !!state);
        
        if (code) {
          setMessage('GitHub code detected! Authenticating...');
          
          // Call checkAuth to handle the OAuth code
          await checkAuth();
          
          // If still on this page after checkAuth, redirect to dashboard
          setMessage('Authentication successful! Redirecting to dashboard...');
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
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