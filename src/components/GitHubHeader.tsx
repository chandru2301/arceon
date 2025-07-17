import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  GitBranch, 
  Star, 
  Users, 
  Moon, 
  Sun, 
  ChevronDown, 
  Menu, 
  X,
  BarChart3,
  Folder,
  Activity,
  User,
  Settings,
  LogOut,
  Eye,
  Mail,
  TrendingUp,
  GitFork,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from '@/components/ui/drawer';

export function GitHubHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileData = {
    name: 'John Developer',
    username: '@johndeveloper',
    email: 'john@developer.com',
    bio: 'Full-stack developer passionate about open source',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    followers: 1247,
    following: 892,
    repositories: 56
  };

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-10 h-10 rounded-full ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground">{profileData.username}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link to="/">
                  <Button variant="glass" className="text-sm font-medium">
                    Dashboard
                  </Button>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                  <Folder className="w-4 h-4 mr-2" />
                  Projects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="glass-card w-80 p-4">
                    <div className="space-y-3">
                      <div>
                         <h4 className="font-medium text-sm mb-2 flex items-center">
                           <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                           <Link to="/projects/featured" className="hover:text-primary">Trending Featured</Link>
                         </h4>
                       </div>
                       <div>
                         <h4 className="font-medium text-sm mb-2">
                           <Link to="/projects/starred" className="hover:text-primary">Starred Projects</Link>
                         </h4>
                       </div>
                       <div>
                         <h4 className="font-medium text-sm mb-2">
                           <Link to="/projects/my-projects" className="hover:text-primary">My Projects</Link>
                         </h4>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Insights
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="glass-card w-72 p-4">
                    <div className="space-y-2">
                       <Link to="/insights/contributions" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <BarChart3 className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Contribution Insights</div>
                           <div className="text-xs text-muted-foreground">View your activity graph</div>
                         </div>
                       </Link>
                       <Link to="/insights/health" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <Activity className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Repository Health</div>
                           <div className="text-xs text-muted-foreground">Issues, PRs, forks & stars</div>
                         </div>
                       </Link>
                       <Link to="/insights/activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <Calendar className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Activity Summary</div>
                           <div className="text-xs text-muted-foreground">Recent contributions</div>
                         </div>
                       </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="glass-card w-72 p-4">
                    <div className="space-y-2">
                       <Link to="/activity/contribution-activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <Calendar className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Contribution Timeline</div>
                           <div className="text-xs text-muted-foreground">Your daily activity</div>
                         </div>
                       </Link>
                       <Link to="/insights/activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <GitBranch className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Recent Commits</div>
                           <div className="text-xs text-muted-foreground">Latest code changes</div>
                         </div>
                       </Link>
                       <Link to="/activity/achievements" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <Award className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Achievements</div>
                           <div className="text-xs text-muted-foreground">Badges and milestones</div>
                         </div>
                       </Link>
                       <Link to="/activity/community" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors">
                         <Users className="w-4 h-4 mr-3 text-primary" />
                         <div>
                           <div className="font-medium text-sm">Community Activity</div>
                           <div className="text-xs text-muted-foreground">Followers and stars</div>
                         </div>
                       </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="glass"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="glass" className="hidden lg:flex items-center space-x-2 px-3">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-card w-64" align="end">
                <DropdownMenuLabel className="px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={profileData.avatar}
                      alt={profileData.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{profileData.name}</div>
                      <div className="text-sm text-muted-foreground">{profileData.username}</div>
                      <div className="text-xs text-muted-foreground">{profileData.email}</div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-background/20">
                  <Link to="/profile" className="flex items-center">
                    <Eye className="w-4 h-4 mr-3" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-background/20">
                  <Link to="/settings" className="flex items-center">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-background/20 text-red-400">
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Trigger */}
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="glass" size="icon" className="lg:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="glass-card">
                <DrawerHeader className="border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <DrawerTitle className="flex items-center space-x-3">
                      <img
                        src={profileData.avatar}
                        alt={profileData.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{profileData.name}</div>
                        <div className="text-sm text-muted-foreground">{profileData.username}</div>
                      </div>
                    </DrawerTitle>
                    <DrawerClose asChild>
                      <Button variant="glass" size="icon">
                        <X className="w-4 h-4" />
                      </Button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="p-4 space-y-4">
                  {/* Mobile Navigation Items */}
                  <div className="space-y-2">
                    <Button variant="glass" className="w-full justify-start">
                      Dashboard
                    </Button>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground px-3 py-1">Projects</div>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <TrendingUp className="w-4 h-4 mr-3" />
                        Trending Featured
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <Star className="w-4 h-4 mr-3" />
                        Starred Projects
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <Folder className="w-4 h-4 mr-3" />
                        My Projects
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground px-3 py-1">Insights</div>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <BarChart3 className="w-4 h-4 mr-3" />
                        Contribution Insights
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <Activity className="w-4 h-4 mr-3" />
                        Repository Health
                      </Button>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium text-muted-foreground px-3 py-1">Activity</div>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <Calendar className="w-4 h-4 mr-3" />
                        Timeline
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <GitBranch className="w-4 h-4 mr-3" />
                        Recent Commits
                      </Button>
                      <Button variant="ghost" className="w-full justify-start pl-6">
                        <Award className="w-4 h-4 mr-3" />
                        Achievements
                      </Button>
                    </div>
                  </div>

                  {/* Profile Actions */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-3" />
                      View Profile
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-400">
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-3 text-sm text-muted-foreground">
          {profileData.bio}
        </div>

        {/* Mobile Stats */}
        <div className="flex sm:hidden items-center justify-center space-x-6 mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center space-x-1 text-xs">
            <GitBranch className="w-3 h-3 text-primary" />
            <span className="font-medium">{profileData.repositories}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Users className="w-3 h-3 text-primary" />
            <span className="font-medium">{profileData.followers}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Star className="w-3 h-3 text-primary" />
            <span className="font-medium">{profileData.following}</span>
          </div>
        </div>
      </div>
    </header>
  );
}