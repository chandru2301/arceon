import { Calendar, GitCommit, GitPullRequest, AlertCircle } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ContributionActivityPage() {
  const timeline = [
    {
      date: "Today",
      activities: [
        { type: "commit", message: "Fix mobile responsive issues", repo: "github-dashboard", time: "2:30 PM" },
        { type: "pr", message: "Add loading states", repo: "portfolio-site", time: "11:15 AM" }
      ]
    },
    {
      date: "Yesterday", 
      activities: [
        { type: "commit", message: "Update API endpoints", repo: "api-wrapper", time: "6:45 PM" },
        { type: "issue", message: "Button styling inconsistent", repo: "github-dashboard", time: "3:20 PM" },
        { type: "commit", message: "Add error handling", repo: "portfolio-site", time: "10:30 AM" }
      ]
    },
    {
      date: "2 days ago",
      activities: [
        { type: "pr", message: "Implement dark mode", repo: "github-dashboard", time: "4:15 PM" },
        { type: "commit", message: "Security updates", repo: "api-wrapper", time: "1:45 PM" }
      ]
    }
  ];

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

        <div className="space-y-6">
          {timeline.map((day, dayIndex) => (
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
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}