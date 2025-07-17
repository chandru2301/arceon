import { Award, Star, GitBranch, Users, Zap } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function AchievementsPage() {
  const achievements = [
    {
      id: 1,
      title: "First Repository",
      description: "Created your first GitHub repository",
      icon: GitBranch,
      earned: true,
      date: "Jan 15, 2023"
    },
    {
      id: 2,
      title: "100 Stars",
      description: "Received 100 stars across all repositories",
      icon: Star,
      earned: true,
      date: "Mar 22, 2023"
    },
    {
      id: 3,
      title: "Community Builder", 
      description: "Gained 50 followers",
      icon: Users,
      earned: true,
      date: "Jun 8, 2023"
    },
    {
      id: 4,
      title: "Contributor",
      description: "Made 365 contributions in a year",
      icon: Zap,
      earned: false,
      progress: 78
    }
  ];

  const milestones = [
    { label: "Total Contributions", current: 1247, target: 1500, unit: "contributions" },
    { label: "Repositories", current: 56, target: 100, unit: "repos" },
    { label: "Stars Received", current: 287, target: 500, unit: "stars" },
    { label: "Followers", current: 143, target: 200, unit: "followers" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Award className="w-8 h-8 text-primary" />
            Achievements & Milestones
          </h1>
          <p className="text-muted-foreground">Track your GitHub journey and unlock new badges</p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`glass-card ${achievement.earned ? 'ring-2 ring-primary/20' : 'opacity-60'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                      <achievement.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Earned
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {achievement.earned ? (
                  <p className="text-sm text-muted-foreground">Earned on {achievement.date}</p>
                ) : (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <Progress value={achievement.progress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Milestones */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {milestones.map((milestone, index) => {
                const progress = (milestone.current / milestone.target) * 100;
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{milestone.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {milestone.current} / {milestone.target} {milestone.unit}
                      </span>
                    </div>
                    <Progress value={progress} className="h-3" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {milestone.target - milestone.current} more {milestone.unit} to go
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}