import { Star, GitFork, ExternalLink, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';
interface StarredProjectOwner {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
}

interface StarredProject {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  private: boolean;
  owner: StarredProjectOwner;
  html_url: string;
}

export default function StarredProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [starredProjects, setStarredProjects] = useState<StarredProject[]>([]);

  useEffect(() => {
    const fetchStarredProjects = async () => {
      const data = await githubApi.getUserStarredRepositories();
      setStarredProjects(data);
      setIsLoading(false);
    };
    fetchStarredProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Starred Projects</h1>
          <p className="text-muted-foreground">Repositories you've starred</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            starredProjects.map((project) => (
            <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary fill-primary" />
                    {project.name}
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </CardTitle>
                <p className="text-muted-foreground">{project.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>{project.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{project.stargazers_count}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks_count}</span>
                  </div>
                  <span className="text-xs">by {project.owner.login}</span>
                </div>
              </CardContent>
            </Card>
          )))}
        </div>
      </main>

      <Footer />
    </div>
  );
}