import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import config from '../config';

export const BackendConfigTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testBackendConfig = async () => {
    setTesting(true);
    setTestResult('Testing backend configuration...\n');
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    
    try {
      // Test 1: Check if backend is accessible
      setTestResult(prev => prev + `\n1. Testing backend connectivity to: ${API_BASE_URL}\n`);
      
      const healthResponse = await fetch(`${API_BASE_URL}/actuator/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setTestResult(prev => prev + `✅ Backend is accessible - Status: ${healthData.status}\n`);
      } else {
        setTestResult(prev => prev + `❌ Backend health check failed - Status: ${healthResponse.status}\n`);
      }

      // Test 2: Check OAuth endpoint
      setTestResult(prev => prev + `\n2. Testing OAuth endpoint: ${API_BASE_URL}${config.github.authorizationUrl}\n`);
      
      const oauthResponse = await fetch(`${API_BASE_URL}${config.github.authorizationUrl}`, {
        method: 'GET',
        redirect: 'manual'
      });
      
      if (oauthResponse.status === 302 || oauthResponse.status === 301) {
        const location = oauthResponse.headers.get('location');
        setTestResult(prev => prev + `✅ OAuth endpoint redirects correctly to: ${location}\n`);
        
        if (location?.includes('github.com')) {
          setTestResult(prev => prev + `✅ Redirects to GitHub OAuth\n`);
        } else {
          setTestResult(prev => prev + `❌ Does not redirect to GitHub\n`);
        }
      } else {
        setTestResult(prev => prev + `❌ OAuth endpoint failed - Status: ${oauthResponse.status}\n`);
      }

      // Test 3: Check CORS configuration
      setTestResult(prev => prev + `\n3. Testing CORS configuration\n`);
      
      const corsResponse = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Authorization, Content-Type'
        }
      });
      
      const allowOrigin = corsResponse.headers.get('access-control-allow-origin');
      const allowCredentials = corsResponse.headers.get('access-control-allow-credentials');
      
      setTestResult(prev => prev + `CORS Allow-Origin: ${allowOrigin}\n`);
      setTestResult(prev => prev + `CORS Allow-Credentials: ${allowCredentials}\n`);
      
      if (allowOrigin === window.location.origin || allowOrigin === '*') {
        setTestResult(prev => prev + `✅ CORS origin configured correctly\n`);
      } else {
        setTestResult(prev => prev + `❌ CORS origin not configured for ${window.location.origin}\n`);
      }

      // Test 4: Check token endpoint
      setTestResult(prev => prev + `\n4. Testing token endpoint (should fail without code)\n`);
      
      const tokenResponse = await fetch(`${API_BASE_URL}/api/token`, {
        method: 'GET',
        credentials: 'include'
      });
      
      setTestResult(prev => prev + `Token endpoint status: ${tokenResponse.status}\n`);
      
      if (tokenResponse.status === 400 || tokenResponse.status === 401) {
        setTestResult(prev => prev + `✅ Token endpoint exists and requires authentication\n`);
      } else {
        setTestResult(prev => prev + `❌ Token endpoint unexpected response\n`);
      }

      // Test 5: Configuration summary
      setTestResult(prev => prev + `\n5. Configuration Summary:\n`);
      setTestResult(prev => prev + `Frontend URL: ${window.location.origin}\n`);
      setTestResult(prev => prev + `Backend URL: ${API_BASE_URL}\n`);
      setTestResult(prev => prev + `OAuth Redirect URI: ${config.github.redirectUri}\n`);
      setTestResult(prev => prev + `OAuth Authorization URL: ${API_BASE_URL}${config.github.authorizationUrl}\n`);
      
      setTestResult(prev => prev + `\n✅ Backend configuration test completed\n`);
      
    } catch (error) {
      setTestResult(prev => prev + `\n❌ Test failed with error: ${error.message}\n`);
    } finally {
      setTesting(false);
    }
  };

  const generateBackendConfig = () => {
    const frontendUrl = window.location.origin;
    const backendUrl = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    
    const springConfig = `
# Spring Boot Application Properties for GitHub OAuth

# Server configuration
server.port=8080

# GitHub OAuth2 Configuration
spring.security.oauth2.client.registration.github.client-id=\${GITHUB_CLIENT_ID}
spring.security.oauth2.client.registration.github.client-secret=\${GITHUB_CLIENT_SECRET}
spring.security.oauth2.client.registration.github.scope=user:email,read:user,repo,read:org
spring.security.oauth2.client.registration.github.redirect-uri=${config.github.redirectUri}
spring.security.oauth2.client.registration.github.authorization-grant-type=authorization_code

# GitHub OAuth2 Provider
spring.security.oauth2.client.provider.github.authorization-uri=https://github.com/login/oauth/authorize
spring.security.oauth2.client.provider.github.token-uri=https://github.com/login/oauth/access_token
spring.security.oauth2.client.provider.github.user-info-uri=https://api.github.com/user
spring.security.oauth2.client.provider.github.user-name-attribute=login

# CORS Configuration
cors.allowed-origins=${frontendUrl}
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true

# Session configuration
server.servlet.session.cookie.same-site=none
server.servlet.session.cookie.secure=true
`;

    setTestResult(springConfig);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Backend Configuration Test</span>
          <div className="flex gap-2">
            <button 
              onClick={testBackendConfig}
              disabled={testing}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {testing ? 'Testing...' : 'Test Backend'}
            </button>
            <button 
              onClick={generateBackendConfig}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              Generate Config
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto text-xs whitespace-pre-wrap">
          {testResult || 'Click "Test Backend" to run configuration tests or "Generate Config" to see required Spring Boot configuration.'}
        </pre>
      </CardContent>
    </Card>
  );
}; 