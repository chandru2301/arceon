import { Clock, GitCommit, GitPullRequest, AlertCircle, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  type: "commit" | "pr" | "issue";
  title: string;
  repo: string;
  time: string;
  icon: any;
  color: string;
  url?: string;
}

export default function RecentActivityPage() {
  const { isAuthenticated } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    commits: 0,
    pullRequests: 0,
    issues: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecentActivity();
    }
  }, [isAuthenticated]);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch different types of activity data
      const [commitsData, pullRequestsData, issuesData] = await Promise.allSettled([
        githubApi.getUserCommits(),
        githubApi.getUserPullRequests(),
        githubApi.getUserIssues()
      ]);

      const allActivities: Activity[] = [];

      // Process commits
      if (commitsData.status === 'fulfilled' && commitsData.value) {
        const commits = Array.isArray(commitsData.value) ? commitsData.value : [];
        commits.slice(0, 5).forEach((commit: any) => {
          allActivities.push({
            type: "commit",
            title: commit.commit?.message || commit.message || "Commit",
            repo: commit.repository?.name || "Unknown",
            time: formatTimeAgo(new Date(commit.commit?.author?.date || commit.created_at)),
            icon: GitCommit,
            color: "text-green-500",
            url: commit.html_url
          });
        });
      }

      // Process pull requests
      if (pullRequestsData.status === 'fulfilled' && pullRequestsData.value) {
        const prs = Array.isArray(pullRequestsData.value) ? pullRequestsData.value : [];
        prs.slice(0, 5).forEach((pr: any) => {
          allActivities.push({
            type: "pr",
            title: pr.title || "Pull Request",
            repo: pr.repository?.name || pr.base?.repo?.name || "Unknown",
            time: formatTimeAgo(new Date(pr.created_at)),
            icon: GitPullRequest,
            color: "text-blue-500",
            url: pr.html_url
          });
        });
      }

      // Process issues
      if (issuesData.status === 'fulfilled' && issuesData.value) {
        const issues = Array.isArray(issuesData.value) ? issuesData.value : [];
        issues.slice(0, 5).forEach((issue: any) => {
          allActivities.push({
            type: "issue",
            title: issue.title || "Issue",
            repo: issue.repository?.name || issue.repository?.full_name?.split('/')[1] || "Unknown",
            time: formatTimeAgo(new Date(issue.created_at)),
            icon: AlertCircle,
            color: "text-yellow-500",
            url: issue.html_url
          });
        });
      }

      // Sort by time (most recent first) and take top 10
      allActivities.sort((a, b) => {
        const timeA = parseTimeAgo(a.time);
        const timeB = parseTimeAgo(b.time);
        return timeA - timeB;
      });

      setActivities(allActivities.slice(0, 10));

      // Calculate stats
      const commitsCount = commitsData.status === 'fulfilled' && commitsData.value ? 
        (Array.isArray(commitsData.value) ? commitsData.value.length : 0) : 0;
      const prsCount = pullRequestsData.status === 'fulfilled' && pullRequestsData.value ? 
        (Array.isArray(pullRequestsData.value) ? pullRequestsData.value.length : 0) : 0;
      const issuesCount = issuesData.status === 'fulfilled' && issuesData.value ? 
        (Array.isArray(issuesData.value) ? issuesData.value.length : 0) : 0;

      setStats({
        commits: commitsCount,
        pullRequests: prsCount,
        issues: issuesCount
      });

    } catch (error) {
      setError('Failed to load recent activity');
      // Fallback to mock data
      setActivities([
        {
          type: "commit",
          title: "Fixed responsive design issues",
          repo: "github-dashboard",
          time: "2 hours ago",
          icon: GitCommit,
          color: "text-green-500"
        },
        {
          type: "pr",
          title: "Add dark mode toggle functionality",
          repo: "portfolio-site",
          time: "5 hours ago",
          icon: GitPullRequest,
          color: "text-blue-500"
        },
        {
          type: "issue",
          title: "Button hover effects not working",
          repo: "api-wrapper",
          time: "1 day ago",
          icon: AlertCircle,
          color: "text-yellow-500"
        }
      ]);
      setStats({ commits: 23, pullRequests: 5, issues: 3 });
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const parseTimeAgo = (timeString: string): number => {
    const now = new Date();
    if (timeString.includes('minute')) {
      const minutes = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return now.getTime() - (minutes * 60 * 1000);
    } else if (timeString.includes('hour')) {
      const hours = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return now.getTime() - (hours * 60 * 60 * 1000);
    } else if (timeString.includes('day')) {
      const days = parseInt(timeString.match(/(\d+)/)?.[1] || '0');
      return now.getTime() - (days * 24 * 60 * 60 * 1000);
    }
    return now.getTime();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "commit": return "Commit";
      case "pr": return "Pull Request";
      case "issue": return "Issue";
      default: return type;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Recent Activity</h1>
            <p className="text-muted-foreground">Please log in to view your recent activity</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Clock className="w-8 h-8 text-primary" />
            Recent Activity
          </h1>
          <p className="text-muted-foreground">Your latest commits, pull requests, and issues</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i} className="glass-card animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-5 h-5 bg-muted rounded mt-1"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchRecentActivity}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="p-8 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                    <p className="text-muted-foreground">No recent commits, pull requests, or issues found.</p>
                  </CardContent>
                </Card>
              ) : (
                activities.map((activity, index) => (
                  <Card key={index} className="glass-card hover:glass-card-hover transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {getTypeLabel(activity.type)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{activity.repo}</span>
                          </div>
                          <h3 className="font-semibold mb-1">{activity.title}</h3>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                        {activity.url && (
                          <a
                            href={activity.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 text-sm"
                          >
                            View →
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Summary Stats */}
            <Card className="glass-card mt-8">
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <GitCommit className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.commits}</p>
                    <p className="text-sm text-muted-foreground">Commits this week</p>
                  </div>
                  <div className="text-center">
                    <GitPullRequest className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.pullRequests}</p>
                    <p className="text-sm text-muted-foreground">Pull requests this week</p>
                  </div>
                  <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{stats.issues}</p>
                    <p className="text-sm text-muted-foreground">Issues opened this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}