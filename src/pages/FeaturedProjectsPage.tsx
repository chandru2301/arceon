import { TrendingUp, Star, GitFork, ExternalLink, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';

export default function FeaturedProjectsPage() {

  const [loading, setLoading] = useState(true);
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([
    {
      id: '',
      name: '',
      description: '',
      stars: '',
      forks: '',
      updated_at: '',
      private: false,
      owner: {
        login: '',
        id: '',
      },
      html_url: '',
      full_name: '',
      language: '',
      score: '',
    }
  ]);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      const data = await githubApi.getTrendingRepositories();
      setFeaturedProjects(data);
      setLoading(false);
    };
    fetchFeaturedProjects();
  }, []);

    return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-primary" />
            Featured Projects
          </h1>
          <p className="text-muted-foreground">Trending and curated GitHub projects</p>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            featuredProjects.map((project) => (
            <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {project.name}
                      {project.score && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground mb-2">{project.description}</p>
                    <Badge variant="secondary" className="text-xs">{project.full_name}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={project.svn_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
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