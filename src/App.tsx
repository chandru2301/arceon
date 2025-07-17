import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Projects Routes */}
            <Route path="/projects/my-projects" element={<MyProjectsPage />} />
            <Route path="/projects/starred" element={<StarredProjectsPage />} />
            <Route path="/projects/featured" element={<FeaturedProjectsPage />} />
            
            {/* Insights Routes */}
            <Route path="/insights/contributions" element={<ContributionInsightsPage />} />
            <Route path="/insights/health" element={<RepoHealthPage />} />
            <Route path="/insights/activity" element={<RecentActivityPage />} />
            
            {/* Activity Routes */}
            <Route path="/activity/contribution-activity" element={<ContributionActivityPage />} />
            <Route path="/activity/achievements" element={<AchievementsPage />} />
            <Route path="/activity/community" element={<CommunityActivityPage />} />
            
            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
