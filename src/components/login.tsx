import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import config from '../config';

export function Login() {
  const { login } = useAuth();

  const handleLogin = () => {
    // Store current URL and time in localStorage for reference
    localStorage.setItem('login_initiated_from', window.location.href);
    localStorage.setItem('login_time', new Date().toISOString());
    
    // Store API base URL for debugging
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;
    localStorage.setItem('login_api_base_url', apiBaseUrl);
    
    // Store redirect URI for debugging
    localStorage.setItem('login_redirect_uri', config.github.redirectUri);
    
    console.log('🚀 Starting login process...');
    console.log('🔗 Current URL:', window.location.href);
    console.log('🌐 API Base URL:', apiBaseUrl);
    console.log('🔄 Redirect URI:', config.github.redirectUri);
    
    // Redirect to the OAuth login page
    login();
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="w-full max-w-md p-4">
        <Card className="w-full border-opacity-50 shadow-lg backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 98 98" className="text-primary">
                <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Welcome to GitHub Flow</CardTitle>
            <CardDescription className="text-lg">
              Your personalized GitHub dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground px-4">
              <p>Sign in with your GitHub account to access your repositories, pull requests, issues, and more.</p>
            </div>
            
            <Button 
              className="w-full h-12 text-base font-medium flex items-center bg-primary text-white hover:bg-primary/90 border-none shadow-none justify-center gap-2" 
              onClick={handleLogin}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 98 98">
                <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor" />
              </svg>

              Continue with GitHub
            </Button>
          </CardContent>
          
         
        </Card>
      </div>
    </div>
  );
}
