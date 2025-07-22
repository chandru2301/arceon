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
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header Section - Mobile Responsive */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-primary flex-shrink-0" />
            <span className="text-lg sm:text-xl lg:text-3xl">Featured Projects</span>
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
            Trending and curated GitHub projects
          </p>
        </div>

        {/* Projects Grid - Mobile Responsive */}
        <div className="grid gap-3 sm:gap-4 lg:gap-6">
          {loading ? (
            <div className="flex justify-center items-center min-h-[150px] sm:min-h-[200px] lg:min-h-[300px]">
              <div className="flex items-center gap-2 sm:gap-3">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 animate-spin text-primary" />
                <span className="text-xs sm:text-sm lg:text-base">Loading featured projects...</span>
              </div>
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold">No featured projects</h3>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-sm px-4">
                  Unable to load trending projects at the moment. Please try again later.
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  className="px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm"
                >
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            featuredProjects.map((project) => (
            <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-xs sm:text-sm lg:text-base truncate">{project.name}</span>
                      {project.score && (
                        <Badge className="bg-primary/20 text-primary border-primary/30 text-xs flex-shrink-0">
                          <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                          <span className="text-xs">Trending</span>
                        </Badge>
                      )}
                    </CardTitle>
                    {project.description && (
                      <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    )}
                    <Badge variant="secondary" className="text-xs">{project.full_name}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="flex-shrink-0 p-1 sm:p-2"
                  >
                    <a href={project.html_url || project.svn_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm lg:text-base text-muted-foreground">
                  {project.language && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full flex-shrink-0"></div>
                      <span className="truncate text-xs sm:text-sm">{project.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{project.stargazers_count?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{project.forks_count?.toLocaleString() || '0'}</span>
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