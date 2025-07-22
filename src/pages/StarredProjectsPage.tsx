import { Star, GitFork, ExternalLink, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';
import { Badge } from '@/components/ui/badge';

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
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Star className="w-8 h-8 text-primary" />
            Starred Projects
          </h1>
          <p className="text-muted-foreground">Repositories you've starred</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : starredProjects.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold">No starred projects</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-sm px-4">
                  You haven't starred any repositories yet. Start exploring GitHub to find projects to star.
                </p>
                <a
                  href="https://github.com/explore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-xs sm:text-sm"
                >
                  Explore GitHub
                </a>
              </div>
            </div>
          ) : (
            starredProjects.map((project) => (
              <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        {project.name}
                        {project.private && (
                          <Badge variant="secondary" className="text-xs">Private</Badge>
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground mt-2">{project.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
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
                      <div className="flex items-center space-x-1">
                        <span>by {project.owner.login}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}