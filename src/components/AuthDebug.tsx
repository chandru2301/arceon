import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { authApi } from '@/services/api';
import config from '../config';

interface TestResult {
  name: string;
  success: boolean;
  data: any;
  error?: string;
}

export const AuthDebug: React.FC = () => {
  const { isAuthenticated, user, loading, checkAuth } = useAuth();
  const [debugInfo, setDebugInfo] = useState<Record<string, any>>({});
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    // Collect debug information
    const token = localStorage.getItem('github_token');
    const redirectPath = localStorage.getItem('auth_redirect_path');
    const loginTime = localStorage.getItem('login_time');
    const loginFrom = localStorage.getItem('login_initiated_from');
    const loginApiBaseUrl = localStorage.getItem('login_api_base_url');
    const loginRedirectUri = localStorage.getItem('login_redirect_uri');
    
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
        loginFrom,
        loginApiBaseUrl,
        loginRedirectUri
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

  const runBackendTests = async () => {
    setTesting(true);
    setTestResults([]);
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    const results: TestResult[] = [];

    // Test 1: Backend connectivity
    try {
      const response = await fetch(`${API_BASE_URL}/actuator/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          name: 'Backend Health Check',
          success: true,
          data: { status: data.status, timestamp: new Date().toISOString() }
        });
      } else {
        results.push({
          name: 'Backend Health Check',
          success: false,
          data: { status: response.status, statusText: response.statusText },
          error: `HTTP ${response.status}: ${response.statusText}`
        });
      }
    } catch (error) {
      results.push({
        name: 'Backend Health Check',
        success: false,
        data: { error: error.message },
        error: `Connection failed: ${error.message}`
      });
    }

    // Test 2: OAuth endpoint accessibility
    try {
      const oauthUrl = `${API_BASE_URL}${config.github.authorizationUrl}`;
      const response = await fetch(oauthUrl, {
        method: 'GET',
        redirect: 'manual', // Don't follow redirects
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      });
      
      results.push({
        name: 'OAuth Endpoint Test',
        success: response.status === 302 || response.status === 301, // Should redirect to GitHub
        data: { 
          status: response.status, 
          location: response.headers.get('location'),
          redirectsToGitHub: response.headers.get('location')?.includes('github.com')
        }
      });
    } catch (error) {
      results.push({
        name: 'OAuth Endpoint Test',
        success: false,
        data: { error: error.message },
        error: `OAuth endpoint failed: ${error.message}`
      });
    }

    // Test 3: User endpoint (should fail if not authenticated)
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        results.push({
          name: 'User Endpoint Test',
          success: true,
          data: { user: data }
        });
      } else {
        results.push({
          name: 'User Endpoint Test',
          success: false,
          data: { status: response.status, statusText: response.statusText },
          error: `Expected failure - user not authenticated: HTTP ${response.status}`
        });
      }
    } catch (error) {
      results.push({
        name: 'User Endpoint Test',
        success: false,
        data: { error: error.message },
        error: `User endpoint failed: ${error.message}`
      });
    }

    // Test 4: CORS headers
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        }
      });
      
      const corsHeaders = {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'access-control-allow-credentials': response.headers.get('access-control-allow-credentials'),
        'access-control-allow-methods': response.headers.get('access-control-allow-methods'),
        'access-control-allow-headers': response.headers.get('access-control-allow-headers'),
      };
      
      results.push({
        name: 'CORS Configuration Test',
        success: response.ok,
        data: { corsHeaders, status: response.status }
      });
    } catch (error) {
      results.push({
        name: 'CORS Configuration Test',
        success: false,
        data: { error: error.message },
        error: `CORS test failed: ${error.message}`
      });
    }

    setTestResults(results);
    setTesting(false);
  };

  const handleForceCheckAuth = () => {
    checkAuth();
  };

  const handleClearStorage = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('auth_redirect_path');
    localStorage.removeItem('login_time');
    localStorage.removeItem('login_initiated_from');
    localStorage.removeItem('login_api_base_url');
    localStorage.removeItem('login_redirect_uri');
    window.location.reload();
  };

  const handleTestLogin = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    const redirectUri = config.github.redirectUri;
    const state = encodeURIComponent(JSON.stringify({ redirect: '/dashboard' }));
    const loginUrl = `${API_BASE_URL}${config.github.authorizationUrl}?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
    
    //  console.log('🚀 Testing login with URL:', loginUrl);
    window.location.href = loginUrl;
  };

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-4xl mx-auto">
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
                onClick={runBackendTests}
                disabled={testing}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
              >
                {testing ? 'Testing...' : 'Test Backend'}
              </button>
              <button 
                onClick={handleTestLogin}
                className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600"
              >
                Test Login
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

      {testResults.length > 0 && (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Backend Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className={`p-4 rounded-md border ${result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                    <span className="font-medium">{result.name}</span>
                  </div>
                  {result.error && (
                    <div className="text-red-600 text-sm mb-2">{result.error}</div>
                  )}
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}; 