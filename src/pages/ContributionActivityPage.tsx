import { Calendar, GitCommit, GitPullRequest, AlertCircle, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Activity {
  type: "commit" | "pr" | "issue";
  message: string;
  repo: string;
  time: string;
  date: string;
  url?: string;
}

interface TimelineDay {
  date: string;
  activities: Activity[];
}

export default function ContributionActivityPage() {
  const { isAuthenticated } = useAuth();
  const [timeline, setTimeline] = useState<TimelineDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContributionTimeline();
    }
  }, [isAuthenticated]);

  const fetchContributionTimeline = async () => {
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
     // Helper to extract owner/repo from commit URL
const extractRepoFromUrl = (url: string): string => {
  try {
    const parts = url.split('/');
    const owner = parts[3];
    const repo = parts[4];
    return `${owner}/${repo}`;
  } catch (err) {
    return "Unknown";
  }
};

if (commitsData.status === 'fulfilled' && commitsData.value) {
  const commits = Array.isArray(commitsData.value) ? commitsData.value : [];
  commits.slice(0, 20).forEach((commit: any) => {
    const commitDate = new Date(commit.commit?.author?.date || commit.created_at);
    const repoName = commit.repository?.full_name || extractRepoFromUrl(commit.html_url);

    allActivities.push({
      type: "commit",
      message: commit.commit?.message || commit.message || "Commit",
      repo: repoName,
      time: formatTime(commitDate),
      date: formatDate(commitDate),
      url: commit.html_url
    });
  });
}


      // Process pull requests
    // Helper to extract repo name from URL
const extractRepoName = (repoUrl: string) => {
  if (!repoUrl) return "Unknown";
  const parts = repoUrl.split('/');
  return parts.slice(-2).join('/'); // owner/repo
};

// Process pull requests
if (pullRequestsData.status === 'fulfilled' && pullRequestsData.value) {
  const prs = Array.isArray(pullRequestsData.value) ? pullRequestsData.value : [];
  prs.slice(0, 20).forEach((pr: any) => {
    const prDate = new Date(pr.created_at);
    const repoName =
      pr.repository?.full_name ||
      pr.base?.repo?.full_name ||
      extractRepoName(pr.repository_url);

    allActivities.push({
      type: "pr",
      message: pr.title || "Pull Request",
      repo: repoName,
      time: formatTime(prDate),
      date: formatDate(prDate),
      url: pr.html_url
    });
  });
}

// Process issues
if (issuesData.status === 'fulfilled' && issuesData.value) {
  const issues = Array.isArray(issuesData.value) ? issuesData.value : [];
  issues.slice(0, 20).forEach((issue: any) => {
    const issueDate = new Date(issue.created_at);
    const repoName =
      issue.repository?.full_name ||
      extractRepoName(issue.repository_url);

    allActivities.push({
      type: "issue",
      message: issue.title || "Issue",
      repo: repoName,
      time: formatTime(issueDate),
      date: formatDate(issueDate),
      url: issue.html_url
    });
  });
}


      // Sort by date (most recent first)
      allActivities.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time);
        const dateB = new Date(b.date + ' ' + b.time);
        return dateB.getTime() - dateA.getTime();
      });

      // Group activities by date
      const timelineData = groupActivitiesByDate(allActivities);
      setTimeline(timelineData);

    } catch (error) {
      setError('Failed to load contribution timeline');
      // Fallback to mock data
      setTimeline([
        {
          date: "Today",
          activities: [
            { type: "commit", message: "Fix mobile responsive issues", repo: "github-dashboard", time: "2:30 PM", date: "Today" },
            { type: "pr", message: "Add loading states", repo: "portfolio-site", time: "11:15 AM", date: "Today" }
          ]
        },
        {
          date: "Yesterday", 
          activities: [
            { type: "commit", message: "Update API endpoints", repo: "api-wrapper", time: "6:45 PM", date: "Yesterday" },
            { type: "issue", message: "Button styling inconsistent", repo: "github-dashboard", time: "3:20 PM", date: "Yesterday" },
            { type: "commit", message: "Add error handling", repo: "portfolio-site", time: "10:30 AM", date: "Yesterday" }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const groupActivitiesByDate = (activities: Activity[]): TimelineDay[] => {
    const grouped: { [key: string]: Activity[] } = {};

    activities.forEach(activity => {
      if (!grouped[activity.date]) {
        grouped[activity.date] = [];
      }
      grouped[activity.date].push(activity);
    });

    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([date, activities]) => ({
        date,
        activities: activities.sort((a, b) => {
          const timeA = new Date(date + ' ' + a.time);
          const timeB = new Date(date + ' ' + b.time);
          return timeB.getTime() - timeA.getTime();
        })
      }))
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "commit": return GitCommit;
      case "pr": return GitPullRequest;
      case "issue": return AlertCircle;
      default: return GitCommit;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "commit": return "text-green-500";
      case "pr": return "text-blue-500";
      case "issue": return "text-yellow-500";
      default: return "text-muted-foreground";
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Contribution Timeline</h1>
            <p className="text-muted-foreground">Please log in to view your contribution timeline</p>
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
            <Calendar className="w-8 h-8 text-primary" />
            Contribution Timeline
          </h1>
          <p className="text-muted-foreground">A detailed timeline of your daily contributions</p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((dayIndex) => (
              <Card key={dayIndex} className="glass-card animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-24"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((activityIndex) => (
                      <div key={activityIndex} className="flex items-start gap-4 p-3">
                        <div className="w-4 h-4 bg-muted rounded mt-1"></div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-4 bg-muted rounded w-20"></div>
                            <div className="h-4 bg-muted rounded w-16"></div>
                            <div className="h-4 bg-muted rounded w-12"></div>
                          </div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchContributionTimeline}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {timeline.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Contributions Found</h3>
                  <p className="text-muted-foreground">No recent contributions found in your timeline.</p>
                </CardContent>
              </Card>
            ) : (
              timeline.map((day, dayIndex) => (
                <Card key={dayIndex} className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">{day.date}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {day.activities.map((activity, activityIndex) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={activityIndex} className="flex items-start gap-4 p-3 rounded-lg hover:bg-background/20 transition-colors">
                            <div className={`mt-1 ${getActivityColor(activity.type)}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {activity.type === "pr" ? "Pull Request" : activity.type}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{activity.repo}</span>
                                <span className="text-xs text-muted-foreground">{activity.time}</span>
                              </div>
                              <p className="text-sm">{activity.message}</p>
                            </div>
                            {activity.url && (
                              <a
                                href={activity.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80 text-xs"
                              >
                                View →
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}