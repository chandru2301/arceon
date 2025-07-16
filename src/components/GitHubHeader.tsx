import { useState } from 'react';
import { GitBranch, Star, Users, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function GitHubHeader() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const profileData = {
    name: 'John Developer',
    username: '@johndeveloper',
    bio: 'Full-stack developer passionate about open source',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    followers: 1247,
    following: 892,
    repositories: 56
  };

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt={profileData.name}
                className="w-12 h-12 rounded-full ring-2 ring-primary/20"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold">{profileData.name}</h2>
              <p className="text-sm text-muted-foreground">{profileData.username}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <GitBranch className="w-4 h-4 text-primary" />
              <span className="font-medium">{profileData.repositories}</span>
              <span className="text-muted-foreground">repos</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">{profileData.followers}</span>
              <span className="text-muted-foreground">followers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Star className="w-4 h-4 text-primary" />
              <span className="font-medium">{profileData.following}</span>
              <span className="text-muted-foreground">following</span>
            </div>
          </div>

          {/* Theme Toggle */}
          <Button
            variant="glass"
            size="icon"
            onClick={toggleTheme}
            className="ml-4"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Bio Section */}
        <div className="mt-3 text-sm text-muted-foreground">
          {profileData.bio}
        </div>
      </div>
    </header>
  );
}