import { Clock, GitCommit, GitPullRequest, AlertCircle } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RecentActivityPage() {
  const activities = [
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
    },
    {
      type: "commit",
      title: "Update dependencies and security patches",
      repo: "github-dashboard",
      time: "2 days ago",
      icon: GitCommit,
      color: "text-green-500"
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "commit": return "Commit";
      case "pr": return "Pull Request";
      case "issue": return "Issue";
      default: return type;
    }
  };

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

        <div className="space-y-4">
          {activities.map((activity, index) => (
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
                </div>
              </CardContent>
            </Card>
          ))}
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
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-muted-foreground">Commits this week</p>
              </div>
              <div className="text-center">
                <GitPullRequest className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-muted-foreground">Pull requests this week</p>
              </div>
              <div className="text-center">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Issues opened this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}