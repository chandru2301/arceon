import { Github, ExternalLink, Heart, Code, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function Footer() {
  const { theme } = useTheme();

  return (
    <footer className="glass-header border-t border-border/50 mt-16">
      <div className="w-full px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Github className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">GitHub Flow</span>
            </div>
            <div className="hidden md:block text-sm text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS
            </div>
          </div>

          {/* Center Section */}
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <a 
              href="#" 
              className="hover:text-primary transition-colors duration-200"
            >
              Documentation
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors duration-200"
            >
              API
            </a>
            <a 
              href="#" 
              className="hover:text-primary transition-colors duration-200"
            >
              Support
            </a>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <Button
              variant="github"
              size="sm"
              onClick={() => window.open('https://github.com/chandru2301', '_blank')}
              className="flex items-center space-x-2"
            >
              <User className="w-4 h-4" />
              <span>Developer</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
            <Button
              variant="github"
              size="sm"
              onClick={() => window.open('https://github.com', '_blank')}
              className="flex items-center space-x-2"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>© 2024 GitHub Flow</span>
              <span>•</span>
              <span>Developed by <a href="https://github.com/chandru2301" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@chandru2301</a></span>
              <span>•</span>
              <span>MIT License</span>
              <span>•</span>
              <span>Version 1.0.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Current theme: {theme}</span>
              <span>•</span>
              <span>Status: All systems operational</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Heart className="w-3 h-3 text-red-500" />
                <span>Made with love</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}