import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Clock, Bug, Lightbulb, HelpCircle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function IssuesNotifications() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchIssues();
    }
  }, [isAuthenticated]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getUserIssues();
      setIssues(data);
    } catch (error) {
      setError('Failed to load issues');
      // Fallback to mock data for demonstration
      setIssues([
        {
          id: 1,
          title: 'Bug: Login form validation not working properly',
          body: 'The login form allows empty submissions and doesn\'t show proper error messages.',
          state: 'open',
          user: {
            login: 'bugreporter',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-15T09:00:00Z',
          updated_at: '2024-01-15T09:00:00Z',
          html_url: 'https://github.com/user/repo/issues/1'
        },
        {
          id: 2,
          title: 'Feature: Add two-factor authentication support',
          body: 'Implement 2FA support for enhanced security using authenticator apps.',
          state: 'open',
          user: {
            login: 'securityexpert',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-14T14:30:00Z',
          updated_at: '2024-01-14T14:30:00Z',
          html_url: 'https://github.com/user/repo/issues/2'
        },
        {
          id: 3,
          title: 'Question: How to configure custom themes?',
          body: 'I need help understanding how to create and apply custom themes to the application.',
          state: 'open',
          user: {
            login: 'newuser',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-13T16:45:00Z',
          updated_at: '2024-01-13T16:45:00Z',
          html_url: 'https://github.com/user/repo/issues/3'
        },
        {
          id: 4,
          title: 'Enhancement: Improve API response times',
          body: 'API responses are slower than expected. Consider implementing caching strategies.',
          state: 'closed',
          user: {
            login: 'performance',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-12T11:20:00Z',
          updated_at: '2024-01-12T11:20:00Z',
          html_url: 'https://github.com/user/repo/issues/4'
        },
        {
          id: 5,
          title: 'Bug: Dark mode toggle not persisting',
          body: 'Theme preference is not saved when refreshing the page.',
          state: 'open',
          user: {
            login: 'themeuser',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-11T13:15:00Z',
          updated_at: '2024-01-11T13:15:00Z',
          html_url: 'https://github.com/user/repo/issues/5'
        },
        {
          id: 6,
          title: 'Documentation: Update installation guide',
          body: 'The current installation guide is outdated and missing some dependencies.',
          state: 'closed',
          user: {
            login: 'docwriter',
            avatar_url: 'https://github.com/github.png'
          },
          created_at: '2024-01-10T10:30:00Z',
          updated_at: '2024-01-10T10:30:00Z',
          html_url: 'https://github.com/user/repo/issues/6'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getIssueIcon = (title: string, state: string) => {
    if (state === 'closed') {
      return { icon: CheckCircle, color: 'text-green-500' };
    }
    
    if (title.toLowerCase().includes('bug')) {
      return { icon: Bug, color: 'text-red-500' };
    }
    if (title.toLowerCase().includes('feature') || title.toLowerCase().includes('enhancement')) {
      return { icon: Lightbulb, color: 'text-blue-500' };
    }
    if (title.toLowerCase().includes('question') || title.toLowerCase().includes('help')) {
      return { icon: HelpCircle, color: 'text-purple-500' };
    }
    
    return { icon: AlertCircle, color: 'text-yellow-500' };
  };

  const getPriorityLevel = (title: string, body: string) => {
    const criticalKeywords = ['crash', 'security', 'data loss', 'critical'];
    const highKeywords = ['bug', 'error', 'broken', 'not working'];
    const mediumKeywords = ['feature', 'enhancement', 'improvement'];
    
    const text = `${title} ${body}`.toLowerCase();
    
    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return { level: 'Critical', color: 'bg-red-500/10 text-red-500' };
    }
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return { level: 'High', color: 'bg-orange-500/10 text-orange-500' };
    }
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return { level: 'Medium', color: 'bg-blue-500/10 text-blue-500' };
    }
    
    return { level: 'Low', color: 'bg-green-500/10 text-green-500' };
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
      <section className="w-full px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Issues & Notifications</h2>
          <p className="text-muted-foreground">Please log in to view your issues and notifications</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className={`w-full px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Issues & Notifications</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
              <div className="flex items-start justify-between mb-3">
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
            onClick={fetchIssues}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="glass-card p-8 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No issues found</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any issues or notifications at the moment. Great job keeping everything up to date!
                  </p>
                  <a
                    href="https://github.com/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Browse Issues
                  </a>
                </div>
              </div>
            </div>
          ) : (
            issues.map((issue, index) => {
              const iconInfo = getIssueIcon(issue.title, issue.state);
              const priority = getPriorityLevel(issue.title, issue.body || '');
              const IconComponent = iconInfo.icon;
              
              return (
                <div
                  key={issue.id}
                  className={`glass-card p-6 rounded-lg hover:scale-105 transition-transform duration-300 ${
                    isIntersecting ? 'scroll-float' : ''
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-4 h-4 ${iconInfo.color}`} />
                      <span className={`text-xs px-2 py-1 rounded-full ${priority.color}`}>
                        {priority.level}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        issue.state === 'open' ? 'bg-primary/10 text-primary' : 'bg-green-500/10 text-green-500'
                      }`}>
                        {issue.state}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(issue.created_at)}</span>
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 break-words">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {issue.body || 'No description available'}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-muted-foreground">
                        by <span className="text-foreground font-medium">{issue.user.login}</span>
                      </span>
                    </div>
                    <a
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-xs flex-shrink-0"
                    >
                      View Issue
                    </a>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 pt-4 border-t border-border">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span>#{issue.id}</span>
                      <span>Updated {formatDate(issue.updated_at)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}