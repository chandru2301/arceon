import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const AuthDebug: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

  const addResult = (test: string, success: boolean, data: any) => {
    setResults(prev => [...prev, { test, success, data, timestamp: new Date().toISOString() }]);
  };

  const testEndpoint = async (endpoint: string, description: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const token = localStorage.getItem('github_token');
      console.log("token", token);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        responseData = { error: 'Failed to parse response as JSON' };
      }
      
      addResult(description, response.ok, {
        status: response.status,
        data: responseData,
        headers: Object.fromEntries([...response.headers.entries()].filter(h => 
          ['content-type', 'access-control-allow-origin', 'access-control-allow-credentials'].includes(h[0].toLowerCase())
        ))
      });
    } catch (error) {
      addResult(description, false, { error: error.message });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    // Test if backend is accessible
    try {
      const response = await fetch(`${API_BASE_URL}/api/user`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      addResult('Backend Connectivity', true, { status: response.status });
    } catch (error) {
      addResult('Backend Connectivity', false, { error: error.message });
    }

    // Test authentication endpoints
    await testEndpoint('/api/user', 'Get User Info');
    await testEndpoint('/api/token', 'Get GitHub Token');
    
    
    // Test GitHub API endpoints
    await testEndpoint('/api/github/profile', 'GitHub Profile');
    await testEndpoint('/api/github/repositories', 'GitHub Repositories');

    // Test localStorage
    const token = localStorage.getItem('github_token');
    addResult('LocalStorage Token', !!token, { hasToken: !!token, tokenLength: token?.length });

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  const clearToken = () => {
    localStorage.removeItem('github_token');
    addResult('Clear Token', true, { message: 'Token cleared from localStorage' });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>OAuth2 Authentication Debug</CardTitle>
        <CardDescription>
          Test backend endpoints and authentication flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runAllTests} disabled={loading}>
            {loading ? 'Running Tests...' : 'Run All Tests'}
          </Button>
          <Button variant="outline" onClick={clearResults}>
            Clear Results
          </Button>
          <Button variant="outline" onClick={clearToken}>
            Clear Token
          </Button>
        </div>

        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={result.success ? "default" : "destructive"}>
                  {result.success ? 'SUCCESS' : 'FAILED'}
                </Badge>
                <span className="font-medium">{result.test}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(result.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <pre className="bg-muted p-2 rounded text-sm overflow-x-auto">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          ))}
        </div>

        <div className="bg-muted p-3 rounded-lg">
          <h4 className="font-medium mb-2">Environment Info:</h4>
          <ul className="text-sm space-y-1">
            <li><strong>API Base URL:</strong> {API_BASE_URL}</li>
            <li><strong>Current URL:</strong> {window.location.href}</li>
            <li><strong>User Agent:</strong> {navigator.userAgent}</li>
            <li><strong>Cookies Enabled:</strong> {navigator.cookieEnabled ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 