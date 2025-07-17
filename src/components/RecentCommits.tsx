import { useEffect, useState } from 'react';
import { GitCommit, Calendar, User } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { githubApi, type Commit } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function RecentCommits() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCommits();
    }
  }, [isAuthenticated]);

  const fetchCommits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getCommits();
      setCommits(data);
    } catch (error) {
      console.error('Failed to fetch commits:', error);
      setError('Failed to load commits');
      // Fallback to mock data for demonstration
      setCommits([
        {
          sha: 'abc123',
          commit: {
            message: 'feat: Add dark mode toggle to settings panel',
            author: {
              name: 'John Developer',
              date: '2024-01-15T10:30:00Z'
            }
          },
          author: {
            login: 'johndeveloper',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/user/repo/commit/abc123'
        },
        {
          sha: 'def456',
          commit: {
            message: 'fix: Resolve authentication middleware bug in API gateway',
            author: {
              name: 'Sara Developer',
              date: '2024-01-14T15:45:00Z'
            }
          },
          author: {
            login: 'saradev',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/user/repo/commit/def456'
        },
        {
          sha: 'ghi789',
          commit: {
            message: 'chore: Update dependencies to latest versions',
            author: {
              name: 'Mike Coder',
              date: '2024-01-12T08:20:00Z'
            }
          },
          author: {
            login: 'mikecoder',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/user/repo/commit/ghi789'
        },
        {
          sha: 'jkl012',
          commit: {
            message: 'docs: Add comprehensive API documentation',
            author: {
              name: 'Test Master',
              date: '2024-01-10T12:15:00Z'
            }
          },
          author: {
            login: 'testmaster',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/user/repo/commit/jkl012'
        },
        {
          sha: 'mno345',
          commit: {
            message: 'refactor: Improve code structure and performance',
            author: {
              name: 'Code Reviewer',
              date: '2024-01-09T16:00:00Z'
            }
          },
          author: {
            login: 'reviewer',
            avatar_url: 'https://github.com/github.png'
          },
          html_url: 'https://github.com/user/repo/commit/mno345'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getCommitTypeIcon = (message: string) => {
    if (message.startsWith('feat:')) return { icon: '✨', color: 'text-green-500' };
    if (message.startsWith('fix:')) return { icon: '🐛', color: 'text-red-500' };
    if (message.startsWith('docs:')) return { icon: '📝', color: 'text-blue-500' };
    if (message.startsWith('chore:')) return { icon: '⚙️', color: 'text-gray-500' };
    if (message.startsWith('refactor:')) return { icon: '♻️', color: 'text-purple-500' };
    if (message.startsWith('test:')) return { icon: '🧪', color: 'text-yellow-500' };
    return { icon: '💫', color: 'text-primary' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recent Commits</h2>
          <p className="text-muted-foreground">Please log in to view your recent commits</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Recent Commits</h2>
      </div>
      
      {loading ? (
        <div className="glass-card p-6 rounded-lg">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchCommits}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className={`glass-card p-6 rounded-lg ${isIntersecting ? 'scroll-float' : ''}`}>
          <div className="space-y-4">
            {commits.map((commit, index) => {
              const typeInfo = getCommitTypeIcon(commit.commit.message);
              return (
                <div
                  key={commit.sha}
                  className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200 ${
                    isIntersecting ? 'scroll-reveal' : ''
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-sm">{typeInfo.icon}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm leading-5 mb-1">
                          {commit.commit.message}
                        </p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{commit.author?.login || commit.commit.author.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(commit.commit.author.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitCommit className="w-3 h-3" />
                            <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                          </div>
                        </div>
                      </div>
                      <a
                        href={commit.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs ml-4"
                      >
                        View
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}