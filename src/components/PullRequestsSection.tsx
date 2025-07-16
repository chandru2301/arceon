import { GitPullRequest, GitMerge, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function PullRequestsSection() {
  const { ref, isIntersecting } = useIntersectionObserver();

  const pullRequests = [
    {
      id: 1,
      title: 'Add dark mode support to dashboard',
      description: 'Implement theme switching functionality with local storage persistence',
      status: 'open',
      author: 'johndeveloper',
      createdAt: '2 hours ago',
      repository: 'react-dashboard',
      commits: 5,
      comments: 3,
      reviews: 2
    },
    {
      id: 2,
      title: 'Fix authentication middleware bug',
      description: 'Resolve token validation issue in API gateway',
      status: 'merged',
      author: 'saradev',
      createdAt: '1 day ago',
      repository: 'api-gateway',
      commits: 3,
      comments: 8,
      reviews: 1
    },
    {
      id: 3,
      title: 'Update dependencies to latest versions',
      description: 'Bump React, TypeScript, and other dependencies',
      status: 'open',
      author: 'mikecoder',
      createdAt: '3 days ago',
      repository: 'mobile-app',
      commits: 12,
      comments: 5,
      reviews: 0
    },
    {
      id: 4,
      title: 'Add comprehensive test suite',
      description: 'Implement unit and integration tests for core functionality',
      status: 'closed',
      author: 'testmaster',
      createdAt: '5 days ago',
      repository: 'github-analytics',
      commits: 8,
      comments: 12,
      reviews: 3
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Pull Requests</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pullRequests.map((pr, index) => (
          <div
            key={pr.id}
            className={`glass-card p-6 rounded-lg hover:scale-105 transition-transform duration-300 ${
              isIntersecting ? 'scroll-float' : ''
            }`}
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(pr.status)}
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pr.status)}`}>
                  {pr.status}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{pr.createdAt}</span>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{pr.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{pr.description}</p>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">
                  by <span className="text-foreground font-medium">{pr.author}</span>
                </span>
                <span className="text-muted-foreground">
                  in <span className="text-primary font-medium">{pr.repository}</span>
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>{pr.commits} commits</span>
                <span>{pr.comments} comments</span>
                <span>{pr.reviews} reviews</span>
              </div>
              <div className="flex items-center space-x-2">
                {pr.reviews > 0 && (
                  <CheckCircle className="w-4 h-4 text-primary" />
                )}
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}