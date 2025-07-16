import { AlertCircle, Bug, Lightbulb, MessageCircle, Bell, Clock } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function IssuesNotifications() {
  const { ref, isIntersecting } = useIntersectionObserver();

  const issues = [
    {
      id: 1,
      title: 'Dashboard loading performance issue',
      type: 'bug',
      priority: 'high',
      repository: 'react-dashboard',
      author: 'user_feedback',
      comments: 8,
      createdAt: '3 hours ago',
      labels: ['performance', 'bug', 'high-priority']
    },
    {
      id: 2,
      title: 'Add keyboard shortcuts for navigation',
      type: 'enhancement',
      priority: 'medium',
      repository: 'github-analytics',
      author: 'feature_request',
      comments: 3,
      createdAt: '1 day ago',
      labels: ['enhancement', 'accessibility']
    },
    {
      id: 3,
      title: 'API rate limit exceeded error handling',
      type: 'bug',
      priority: 'high',
      repository: 'api-gateway',
      author: 'error_reports',
      comments: 12,
      createdAt: '2 days ago',
      labels: ['bug', 'api', 'error-handling']
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'mention',
      message: 'You were mentioned in a pull request',
      repository: 'react-dashboard',
      author: 'saradev',
      timestamp: '1 hour ago',
      read: false
    },
    {
      id: 2,
      type: 'review',
      message: 'Your pull request received a review',
      repository: 'mobile-app',
      author: 'codereview_bot',
      timestamp: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'issue',
      message: 'New issue assigned to you',
      repository: 'api-gateway',
      author: 'project_manager',
      timestamp: '4 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'star',
      message: 'Your repository received a star',
      repository: 'github-analytics',
      author: 'opensource_lover',
      timestamp: '1 day ago',
      read: true
    }
  ];

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'bug':
        return <Bug className="w-4 h-4 text-red-500" />;
      case 'enhancement':
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'low':
        return 'bg-green-500/10 text-green-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mention':
        return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'review':
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case 'issue':
        return <Bug className="w-4 h-4 text-red-500" />;
      case 'star':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issues Section */}
        <div className={`${isIntersecting ? 'scroll-reveal delay-1' : ''}`}>
          <h2 className="text-2xl font-bold mb-6">Open Issues</h2>
          <div className="glass-card p-6 rounded-lg">
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 ${
                    isIntersecting ? 'scroll-reveal' : ''
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getIssueIcon(issue.type)}
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{issue.createdAt}</span>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2">{issue.title}</h3>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary font-medium">{issue.repository}</span>
                      <span className="text-muted-foreground">by {issue.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{issue.comments}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {issue.labels.map((label) => (
                      <span
                        key={label}
                        className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className={`${isIntersecting ? 'scroll-reveal delay-2' : ''}`}>
          <h2 className="text-2xl font-bold mb-6">Notifications</h2>
          <div className="glass-card p-6 rounded-lg">
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 ${
                    !notification.read ? 'bg-primary/5 border-primary/20' : ''
                  } ${isIntersecting ? 'scroll-reveal' : ''}`}
                  style={{ animationDelay: `${(index + 3) * 0.1}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{notification.message}</p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="text-primary font-medium">{notification.repository}</span>
                        <span className="mx-1">•</span>
                        <span>by {notification.author}</span>
                        <span className="mx-1">•</span>
                        <span>{notification.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}