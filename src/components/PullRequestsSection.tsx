import { useEffect, useState } from 'react';
import { GitPullRequest, GitMerge, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function PullRequestsSection() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [pullRequests, setPullRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPullRequests();
    }
  }, [isAuthenticated]);

  const fetchPullRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getUserPullRequests();
      setPullRequests(data);
    } catch (error) {
      setError('Failed to load pull requests');
      // Fallback to mock data for demonstration
      setPullRequests([
        {
          id: 1,
          title: 'Add dark mode support to dashboard',
          body: 'Implement theme switching functionality with local storage persistence',
          state: 'open',
          user: {
            login: 'johndeveloper',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          html_url: 'https://github.com/user/repo/pull/1'
        },
        {
          id: 2,
          title: 'Fix authentication middleware bug',
          body: 'Resolve token validation issue in API gateway',
          state: 'merged',
          user: {
            login: 'saradev',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-14T15:45:00Z',
          updated_at: '2024-01-14T15:45:00Z',
          html_url: 'https://github.com/user/repo/pull/2'
        },
        {
          id: 3,
          title: 'Update dependencies to latest versions',
          body: 'Bump React, TypeScript, and other dependencies',
          state: 'open',
          user: {
            login: 'mikecoder',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-12T08:20:00Z',
          updated_at: '2024-01-12T08:20:00Z',
          html_url: 'https://github.com/user/repo/pull/3'
        },
        {
          id: 4,
          title: 'Add comprehensive test suite',
          body: 'Implement unit and integration tests for core functionality',
          state: 'closed',
          user: {
            login: 'testmaster',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-10T12:15:00Z',
          updated_at: '2024-01-10T12:15:00Z',
          html_url: 'https://github.com/user/repo/pull/4'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'open':
        return <GitPullRequest className="w-4 h-4 text-primary" />;
      case 'merged':
        return <GitMerge className="w-4 h-4 text-purple-500" />;
      case 'closed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <GitPullRequest className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'open':
        return 'bg-primary/10 text-primary';
      case 'merged':
        return 'bg-purple-500/10 text-purple-500';
      case 'closed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
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
          <h2 className="text-2xl font-bold mb-4">Pull Requests</h2>
          <p className="text-muted-foreground">Please log in to view your pull requests</p>
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
        <h2 className="text-2xl font-bold mb-6">Pull Requests</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-16"></div>
                </div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-muted rounded w-32"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchPullRequests}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pullRequests.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="glass-card p-8 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <GitPullRequest className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No pull requests found</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any pull requests yet. Create your first pull request on GitHub to see it here.
                  </p>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Browse GitHub
                  </a>
                </div>
              </div>
            </div>
          ) : (
            pullRequests.map((pr, index) => (
              <div
                key={pr.id}
                className={`glass-card p-6 rounded-lg hover:scale-105 transition-transform duration-300 ${
                  isIntersecting ? 'scroll-float' : ''
                }`}
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(pr.state)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pr.state)}`}>
                      {pr.state}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(pr.created_at)}</span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 break-words">{pr.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {pr.body || 'No description available'}
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-muted-foreground">
                      by <span className="text-foreground font-medium">{pr.user.login}</span>
                    </span>
                  </div>
                  <a
                    href={pr.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex-shrink-0"
                  >
                    View on GitHub
                  </a>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>PR #{pr.id}</span>
                    <span>Updated {formatDate(pr.updated_at)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {pr.state === 'merged' && (
                      <CheckCircle className="w-4 h-4 text-primary" />
                    )}
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}