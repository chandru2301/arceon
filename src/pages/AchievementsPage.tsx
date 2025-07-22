import { Award, Star, GitBranch, Users, Zap, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { githubApi } from '@/services/api';

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  date?: string;
  progress?: number;
}

interface Milestone {
  label: string;
  current: number;
  target: number;
  unit: string;
}

const iconMap: Record<string, any> = {
  GitBranch,
  Star,
  Users,
  Zap
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAchievementsData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch achievements and milestones in parallel
      const [achievementsData, milestonesData] = await Promise.all([
        githubApi.getUserAchievements(),
        githubApi.getUserMilestones()
      ]);

      setAchievements(achievementsData || []);
      setMilestones(milestonesData || []);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching achievements data:', err);
      setError(err.message || 'Failed to load achievements data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAchievementsData();
  }, []);

  const handleRefresh = () => {
    fetchAchievementsData(true);
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Award;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg">Loading achievements...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <Button onClick={handleRefresh}>
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="w-full px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Award className="w-8 h-8 text-primary" />
              Achievements & Milestones
            </h1>
            <p className="text-muted-foreground">
              Track your GitHub journey and unlock new badges
              {achievements.length > 0 && (
                <span className="ml-2 text-sm">
                  • {achievements.filter(a => a.earned).length} earned • {achievements.length} total
                  {milestones.length > 0 && (
                    <span> • {milestones.length} milestones</span>
                  )}
                </span>
              )}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Achievements Grid */}
        {achievements.length > 0 ? (
          <>
            {/* Achievement Progress Summary */}
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Achievement Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {achievements.filter(a => a.earned).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Achievements Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-500">
                      {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {achievements.filter(a => !a.earned).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {achievements.map((achievement) => {
                const IconComponent = getIconComponent(achievement.icon);
                return (
                  <Card key={achievement.id} className={`glass-card ${achievement.earned ? 'ring-2 ring-primary/20' : 'opacity-60'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${achievement.earned ? 'bg-primary/20 text-primary' : 'bg-muted'}`}>
                            <IconComponent className="w-6 h-6" />
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
                        <p className="text-sm text-muted-foreground">
                          Earned {achievement.date ? `on ${achievement.date}` : 'recently'}
                        </p>
                      ) : (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progress</span>
                            <span>{achievement.progress || 0}%</span>
                          </div>
                          <Progress value={achievement.progress || 0} className="h-2" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="glass-card mb-8">
            <CardContent className="text-center py-8">
              <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No achievements found</p>
            </CardContent>
          </Card>
        )}

        {/* Milestones */}
        {milestones.length > 0 ? (
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
                          {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()} {milestone.unit}
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
        ) : (
          <Card className="glass-card">
            <CardContent className="text-center py-8">
              <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No milestones found</p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}