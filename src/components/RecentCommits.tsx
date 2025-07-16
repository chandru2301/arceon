import { GitCommit, Calendar, User, GitBranch } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function RecentCommits() {
  const { ref, isIntersecting } = useIntersectionObserver();

  const commits = [
    {
      id: 'a1b2c3d',
      message: 'feat: add glassmorphism styling to dashboard components',
      author: 'John Developer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      timestamp: '2 hours ago',
      repository: 'react-dashboard',
      branch: 'main',
      additions: 45,
      deletions: 12
    },
    {
      id: 'e4f5g6h',
      message: 'fix: resolve authentication token validation issue',
      author: 'Sarah Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9c7ad2e?w=40&h=40&fit=crop&crop=face',
      timestamp: '4 hours ago',
      repository: 'api-gateway',
      branch: 'bugfix/auth-token',
      additions: 23,
      deletions: 8
    },
    {
      id: 'i7j8k9l',
      message: 'docs: update README with installation instructions',
      author: 'Mike Coder',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      timestamp: '1 day ago',
      repository: 'github-analytics',
      branch: 'docs/readme-update',
      additions: 67,
      deletions: 3
    },
    {
      id: 'm0n1o2p',
      message: 'refactor: optimize database queries for better performance',
      author: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      timestamp: '2 days ago',
      repository: 'mobile-app',
      branch: 'performance/db-optimization',
      additions: 156,
      deletions: 89
    },
    {
      id: 'q3r4s5t',
      message: 'test: add unit tests for user authentication module',
      author: 'Test Master',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      timestamp: '3 days ago',
      repository: 'api-gateway',
      branch: 'test/auth-module',
      additions: 234,
      deletions: 15
    }
  ];

  const getCommitTypeColor = (message: string) => {
    if (message.startsWith('feat:')) return 'text-primary';
    if (message.startsWith('fix:')) return 'text-red-500';
    if (message.startsWith('docs:')) return 'text-blue-500';
    if (message.startsWith('refactor:')) return 'text-purple-500';
    if (message.startsWith('test:')) return 'text-orange-500';
    return 'text-foreground';
  };

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Recent Commits</h2>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="space-y-4">
          {commits.map((commit, index) => (
            <div
              key={commit.id}
              className={`flex items-center space-x-4 p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 ${
                isIntersecting ? 'scroll-reveal' : ''
              }`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="flex-shrink-0">
                <img
                  src={commit.avatar}
                  alt={commit.author}
                  className="w-10 h-10 rounded-full ring-2 ring-border"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <GitCommit className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-muted-foreground">
                    {commit.id}
                  </span>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {commit.branch}
                    </span>
                  </div>
                </div>
                
                <p className={`font-medium ${getCommitTypeColor(commit.message)}`}>
                  {commit.message}
                </p>
                
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{commit.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{commit.timestamp}</span>
                  </div>
                  <span className="text-primary font-medium">
                    {commit.repository}
                  </span>
                </div>
              </div>
              
              <div className="flex-shrink-0 text-sm">
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">+{commit.additions}</span>
                    <span className="text-red-500">-{commit.deletions}</span>
                  </div>
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500"
                      style={{ 
                        width: `${(commit.additions / (commit.additions + commit.deletions)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}