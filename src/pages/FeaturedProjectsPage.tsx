import { TrendingUp, Star, GitFork, ExternalLink } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function FeaturedProjectsPage() {
  const featuredProjects = [
    {
      id: 1,
      name: "shadcn/ui",
      description: "Beautifully designed components built with Radix UI and Tailwind CSS",
      stars: "58k",
      forks: "3.2k",
      language: "TypeScript",
      trending: true,
      category: "UI Library"
    },
    {
      id: 2,
      name: "vercel/next.js",
      description: "The React Framework for the Web",
      stars: "120k",
      forks: "26k",
      language: "JavaScript",
      trending: true,
      category: "Framework"
    },
    {
      id: 3,
      name: "openai/gpt-4",
      description: "GPT-4 with vision capabilities",
      stars: "89k",
      forks: "12k",
      language: "Python",
      trending: false,
      category: "AI/ML"
    }
  ];

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
          {featuredProjects.map((project) => (
            <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      {project.name}
                      {project.trending && (
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </CardTitle>
                    <p className="text-muted-foreground mb-2">{project.description}</p>
                    <Badge variant="secondary" className="text-xs">{project.category}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
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
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks}</span>
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