import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MyProjectsPage from "./pages/MyProjectsPage";
import StarredProjectsPage from "./pages/StarredProjectsPage";
import FeaturedProjectsPage from "./pages/FeaturedProjectsPage";
import ContributionInsightsPage from "./pages/ContributionInsightsPage";
import RepoHealthPage from "./pages/RepoHealthPage";
import RecentActivityPage from "./pages/RecentActivityPage";
import ContributionActivityPage from "./pages/ContributionActivityPage";
import AchievementsPage from "./pages/AchievementsPage";
import CommunityActivityPage from "./pages/CommunityActivityPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { Login } from "./components/login";
import { DashboardRedirect } from "./components/DashboardRedirect";
import { OAuthCallback } from "./components/OAuthCallback";
import { AuthDebug } from "./components/AuthDebug";

const queryClient = new QueryClient();

// App Routes Component that uses auth context
const AppRoutes: React.FC = () => {
  // Protected Route Component
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  // Public Route Component (redirect to dashboard if authenticated)
  const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
  };

  // Dashboard Route Component (handles OAuth2 success callback)
  const DashboardRoute: React.FC = () => {
    const { isAuthenticated, loading, checkAuth } = useAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    // If we have a GitHub OAuth code, show the OAuth callback component
    if (code) {
      console.log('🔄 OAuth code detected in URL, showing OAuth callback component...');
      return <OAuthCallback />;
    }

    // If loading, show loading indicator
    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading authentication state...</p>
          </div>
        </div>
      );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    // Otherwise, show the protected dashboard
    return <Index />;
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={<DashboardRoute />} 
      />
      <Route 
        path="/auth-debug" 
        element={<AuthDebug />} 
      />
      <Route 
        path="/oauth/callback" 
        element={<OAuthCallback />} 
      />

      {/* Projects Routes */}
      <Route 
        path="/projects/my-projects" 
        element={
          <ProtectedRoute>
            <MyProjectsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/starred" 
        element={
          <ProtectedRoute>
            <StarredProjectsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/featured" 
        element={
          <ProtectedRoute>
            <FeaturedProjectsPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Insights Routes */}
      <Route 
        path="/insights/contributions" 
        element={
          <ProtectedRoute>
            <ContributionInsightsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/insights/health" 
        element={
          <ProtectedRoute>
            <RepoHealthPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/insights/activity" 
        element={
          <ProtectedRoute>
            <RecentActivityPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Activity Routes */}
      <Route 
        path="/activity/contribution-activity" 
        element={
          <ProtectedRoute>
            <ContributionActivityPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activity/achievements" 
        element={
          <ProtectedRoute>
            <AchievementsPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/activity/community" 
        element={
          <ProtectedRoute>
            <CommunityActivityPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Profile Routes */}
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />
      
      <Route path="/not-found" element={<NotFound />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
