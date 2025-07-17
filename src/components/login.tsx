import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export function Login() {
  const { login } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  const handleLogin = () => {
    // Store current URL in localStorage for reference
    localStorage.setItem('login_initiated_from', window.location.href);
    localStorage.setItem('login_time', new Date().toISOString());
    login();
  };
  
  // Get environment info for debugging
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to GitHub Flow</CardTitle>
          <CardDescription>
            Log in with your GitHub account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 98 98">
            <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292f" />
          </svg>
          <Button className="w-full" onClick={handleLogin}>
            Continue with GitHub
          </Button>
        </CardContent>
        
        <CardFooter className="flex-col items-start">
          <div className="w-full flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setShowDebug(!showDebug)}>
              {showDebug ? 'Hide' : 'Show'} Debug Info
            </Button>
          </div>
          
          {showDebug && (
            <div className="w-full mt-4 p-4 bg-slate-100 rounded-md text-xs">
              <h4 className="font-medium mb-2">Environment Information:</h4>
              <ul className="space-y-1">
                <li><Badge variant="outline">API URL</Badge> {apiBaseUrl}</li>
                <li><Badge variant="outline">Current URL</Badge> {window.location.href}</li>
                <li><Badge variant="outline">Local Storage Token</Badge> {localStorage.getItem('github_token') ? 'Present' : 'None'}</li>
                <li><Badge variant="outline">Login Time</Badge> {localStorage.getItem('login_time') || 'N/A'}</li>
                <li><Badge variant="outline">Login Origin</Badge> {localStorage.getItem('login_initiated_from') || 'N/A'}</li>
              </ul>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">OAuth Configuration:</h4>
                <p>OAuth Flow: GitHub → {apiBaseUrl}/oauth2/authorization/github → Callback → {window.location.origin}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
