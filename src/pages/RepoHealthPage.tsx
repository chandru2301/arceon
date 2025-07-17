import { Activity, AlertCircle, GitPullRequest, Star, GitFork } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';

export default function RepoHealthPage() {
  const [repositories, setRepositories] = useState<any[]>([]);

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-500";
    if (health >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getStatusVariant = (status: string) => {
    if (status === "Excellent") return "default";
    if (status === "Good") return "secondary";
    return "destructive";
  };

  useEffect(() => {
    const fetchRepositories = async () => {
      const data = await githubApi.getUserRepositories();
      setRepositories(data);
    };
    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Repository Health
          </h1>
          <p className="text-muted-foreground">Monitor the health and activity of your repositories</p>
        </div>

        <div className="grid gap-6">
          {repositories.map((repo, index) => (
            <Card key={index} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                      {repo.name}
                    <Badge variant={getStatusVariant(repo.status)}>
                      {repo.status}
                    </Badge>
                  </CardTitle>
                  <div className={`text-2xl font-bold ${getHealthColor(repo.health)}`}>
                    {repo.health}%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Health Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Repository Health</span>
                      <span>{repo.health}%</span>
                    </div>
                    <Progress value={repo.health} className="h-2" />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Open Issues</p>
                        <p className="font-semibold">{repo.openIssues}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Open PRs</p>
                        <p className="font-semibold">{repo.openPRs}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Stars</p>
                        <p className="font-semibold">{repo.stars}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Forks</p>
                        <p className="font-semibold">{repo.forks}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Activity</p>
                        <p className="font-semibold">High</p>
                      </div>
                    </div>
                  </div>
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