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
  LogIn,
  Eye,
  Mail,
  TrendingUp,
  GitFork,
  Calendar,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
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
  const { isAuthenticated, user, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    login();
  };

  const handleLogout = async () => {
    await logout();
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
                src={user?.avatar_url || 'https://github.com/github.png'}
                alt={user?.name || 'GitHub User'}
                className="w-10 h-10 rounded-full ring-2 ring-primary/20"
              />
              {isAuthenticated && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
              )}
            </div>
            <div className="hidden sm:block">
              <h2 className="text-lg font-semibold">{user?.name || 'GitHub Flow'}</h2>
              <p className="text-sm text-muted-foreground">
                {user?.login || 'Welcome'} 
                {user?.created_at && (
                  <span className="text-xs text-muted-foreground">
                    {' '}({new Date(user.created_at).toLocaleDateString()} - {new Date(user.updated_at).toLocaleDateString()})
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Stats Section */}
          {/* {isAuthenticated && user && (
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm">
                <GitBranch className="w-4 h-4 text-primary" />
                <span className="font-medium">{user.public_repos || 0}</span>
                <span className="text-muted-foreground">repos</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">{user.followers || 0}</span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Star className="w-4 h-4 text-primary" />
                <span className="font-medium">{user.following || 0}</span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>
          )} */}

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <Link to="/">
                    <Button variant="glass" className="text-sm font-medium">
                      Dashboard
                    </Button>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                    <Folder className="w-4 h-4 mr-2" />
                    Projects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="glass-card w-80 p-4">
                      <div className="space-y-3 relative">
                        <div className="relative z-10">
                          <h4 className="font-medium text-sm mb-2 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                            <Link to="/projects/featured" className="hover:text-primary transition-colors">Trending Featured</Link>
                          </h4>
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-medium text-sm mb-2">
                            <Link to="/projects/starred" className="hover:text-primary transition-colors">Starred Projects</Link>
                          </h4>
                        </div>
                        <div className="relative z-10">
                          <h4 className="font-medium text-sm mb-2">
                            <Link to="/projects/my-projects" className="hover:text-primary transition-colors">My Projects</Link>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Insights
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="glass-card w-72 p-4">
                      <div className="space-y-2 relative">
                        <Link to="/insights/contributions" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
                          <BarChart3 className="w-4 h-4 mr-3 text-primary" />
                          <div>
                            <div className="font-medium text-sm">Contribution Insights</div>
                            <div className="text-xs text-muted-foreground">View your activity graph</div>
                          </div>
                        </Link>
                        <Link to="/insights/health" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
                          <Activity className="w-4 h-4 mr-3 text-primary" />
                          <div>
                            <div className="font-medium text-sm">Repository Health</div>
                            <div className="text-xs text-muted-foreground">Issues, PRs, forks & stars</div>
                          </div>
                        </Link>
                        <Link to="/insights/activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
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

                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className="bg-background/30 backdrop-blur-md border border-white/10 hover:bg-background/40">
                    <Activity className="w-4 h-4 mr-2" />
                    Activity
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="glass-card w-72 p-4">
                      <div className="space-y-2 relative">
                        <Link to="/activity/contribution-activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
                          <Calendar className="w-4 h-4 mr-3 text-primary" />
                          <div>
                            <div className="font-medium text-sm">Contribution Timeline</div>
                            <div className="text-xs text-muted-foreground">Your daily activity</div>
                          </div>
                        </Link>
                        <Link to="/insights/activity" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
                          <GitBranch className="w-4 h-4 mr-3 text-primary" />
                          <div>
                            <div className="font-medium text-sm">Recent Commits</div>
                            <div className="text-xs text-muted-foreground">Latest code changes</div>
                          </div>
                        </Link>
                        <Link to="/activity/achievements" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
                          <Award className="w-4 h-4 mr-3 text-primary" />
                          <div>
                            <div className="font-medium text-sm">Achievements</div>
                            <div className="text-xs text-muted-foreground">Badges and milestones</div>
                          </div>
                        </Link>
                        <Link to="/activity/community" className="flex items-center hover:bg-background/20 p-2 rounded transition-colors relative z-10 hover:z-20">
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
          )}

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Auth Actions */}
            {isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="glass-button"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogin}
                className="glass-button"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}

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

            {/* Profile Dropdown - Only show when authenticated */}
            {isAuthenticated && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="glass" className="hidden lg:flex items-center space-x-2 px-3">
                    <img
                      src={user.avatar_url}
                      alt={user.name || 'User'}
                      className="w-6 h-6 rounded-full"
                    />
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-card w-64" align="end">
                  <DropdownMenuLabel className="px-3 py-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatar_url}
                        alt={user.name || 'User'}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-medium">{user.name || user.login}</div>
                        <div className="text-sm text-muted-foreground">@{user.login}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
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
                  <DropdownMenuItem className="cursor-pointer hover:bg-background/20 text-red-400" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Trigger - Only show when authenticated */}
            {isAuthenticated && (
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
                          src={user?.avatar_url}
                          alt={user?.name || 'User'}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{user?.name || user?.login}</div>
                          <div className="text-sm text-muted-foreground">@{user?.login}</div>
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
                      <Button variant="glass" className="w-full justify-start" asChild>
                        <Link to="/dashboard">
                          Dashboard
                        </Link>
                      </Button>
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground px-3 py-1">Projects</div>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/projects/featured">
                            <TrendingUp className="w-4 h-4 mr-3" />
                            Trending Featured
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/projects/starred">
                            <Star className="w-4 h-4 mr-3" />
                            Starred Projects
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/projects/my-projects">
                            <Folder className="w-4 h-4 mr-3" />
                            My Projects
                          </Link>
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground px-3 py-1">Insights</div>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/insights/contributions">
                            <BarChart3 className="w-4 h-4 mr-3" />
                            Contribution Insights
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/insights/health">
                            <Activity className="w-4 h-4 mr-3" />
                            Repository Health
                          </Link>
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium text-muted-foreground px-3 py-1">Activity</div>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/activity/contribution-activity">
                            <Calendar className="w-4 h-4 mr-3" />
                            Timeline
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/insights/activity">
                            <GitBranch className="w-4 h-4 mr-3" />
                            Recent Commits
                          </Link>
                        </Button>
                        <Button variant="ghost" className="w-full justify-start pl-6" asChild>
                          <Link to="/activity/achievements">
                            <Award className="w-4 h-4 mr-3" />
                            Achievements
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Profile Actions */}
                    <div className="border-t border-white/10 pt-4 space-y-2">
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/profile">
                          <Eye className="w-4 h-4 mr-3" />
                          View Profile
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/settings">
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-red-400" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {/* {isAuthenticated && user?.bio && (
          <div className="mt-3 text-sm text-muted-foreground">
            {user.bio}
          </div>
        )} */}

        {/* Mobile Stats - Only show when authenticated */}
        {isAuthenticated && user && (
          <div className="flex sm:hidden items-center justify-center space-x-6 mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center space-x-1 text-xs">
              <GitBranch className="w-3 h-3 text-primary" />
              <span className="font-medium">{user.public_repos || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Users className="w-3 h-3 text-primary" />
              <span className="font-medium">{user.followers || 0}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Star className="w-3 h-3 text-primary" />
              <span className="font-medium">{user.following || 0}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}