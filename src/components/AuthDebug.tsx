import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import config from '../config';

export const AuthDebug: React.FC = () => {
  const { isAuthenticated, user, loading, checkAuth } = useAuth();
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});

  useEffect(() => {
    // Collect debug information
    const token = localStorage.getItem('github_token');
    const redirectPath = localStorage.getItem('auth_redirect_path');
    const loginTime = localStorage.getItem('login_time');
    const loginFrom = localStorage.getItem('login_initiated_from');
    
    const urlParams = new URLSearchParams(window.location.search);
    
    setDebugInfo({
      auth: {
        isAuthenticated,
        loading,
        hasUser: !!user,
        userInfo: user ? {
          login: user.login,
          name: user.name,
          id: user.id
        } : null
      },
      localStorage: {
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : null,
        redirectPath,
        loginTime,
        loginFrom
      },
      environment: {
        nodeEnv: import.meta.env.MODE,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl,
        configApiBaseUrl: config.apiBaseUrl,
        redirectUri: config.github.redirectUri,
        authorizationUrl: config.github.authorizationUrl,
        fullAuthUrl: `${import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl}${config.github.authorizationUrl}`
      },
      location: {
        href: window.location.href,
        pathname: window.location.pathname,
        search: window.location.search,
        hasCode: urlParams.has('code'),
        hasState: urlParams.has('state'),
        hasError: urlParams.has('error')
      },
      timestamp: new Date().toISOString()
    });
  }, [isAuthenticated, user, loading]);

  const handleForceCheckAuth = () => {
    checkAuth();
  };

  const handleClearStorage = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('auth_redirect_path');
    localStorage.removeItem('login_time');
    localStorage.removeItem('login_initiated_from');
    window.location.reload();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto my-8">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Authentication Debug</span>
          <div className="flex gap-2">
            <button 
              onClick={handleForceCheckAuth}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
            >
              Force Check Auth
            </button>
            <button 
              onClick={handleClearStorage}
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Clear Storage
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}; 