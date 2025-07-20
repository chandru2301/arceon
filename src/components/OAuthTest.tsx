import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const OAuthTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testOAuthFlow = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('🚀 Starting OAuth2 flow test...');
    
    // Test 1: Check current URL
    addResult(`📍 Current URL: ${window.location.href}`);
    
    // Test 2: Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    addResult(`🔍 URL code parameter: ${code || 'none'}`);
    
    // Test 3: Check localStorage
    const token = localStorage.getItem('github_token');
    addResult(`🔑 Token in localStorage: ${token ? 'exists' : 'none'}`);
    
    // Test 4: Test backend connectivity
    try {
      // const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://arceon-backend.onrender.com';
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
      addResult(`🌐 Testing backend at: ${API_BASE_URL}`);
      
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      addResult(`📡 Backend response: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Backend user data: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        const errorText = await response.text();
        addResult(`❌ Backend error: ${errorText}`);
      }
    } catch (error) {
      addResult(`💥 Backend connection failed: ${error.message}`);
    }
    
    // Test 5: Check if we're in OAuth success state
    if (code === 'success') {
      addResult('✅ OAuth success detected!');
    } else {
      addResult('❌ No OAuth success code found');
    }
    
    setIsLoading(false);
    addResult('🏁 Test completed');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const simulateOAuthSuccess = () => {
    // Simulate the OAuth success URL with a mock GitHub code
    const mockCode = 'mock_github_oauth_code_' + Math.random().toString(36).substring(2, 15);
    window.history.pushState({}, '', `/dashboard?code=${mockCode}`);
    addResult(`🎭 Simulated OAuth success URL with code: ${mockCode}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>OAuth2 Flow Test</CardTitle>
        <CardDescription>
          Debug the OAuth2 authentication flow step by step
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testOAuthFlow} disabled={isLoading}>
            {isLoading ? 'Testing...' : 'Run OAuth Test'}
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
          <Button variant="outline" onClick={simulateOAuthSuccess}>
            Simulate Success
          </Button>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Test Results:</h4>
          <div className="bg-muted p-3 rounded-lg max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <p className="text-muted-foreground">No test results yet. Click "Run OAuth Test" to start.</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Debugging Steps:</h4>
          <ol className="text-sm text-blue-800 space-y-1">
            <li>1. Click "Run OAuth Test" to check current state</li>
            <li>2. Go to login page and click "Continue with GitHub"</li>
            <li>3. After GitHub login, check the test results again</li>
            <li>4. Look for any error messages in the browser console</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}; 