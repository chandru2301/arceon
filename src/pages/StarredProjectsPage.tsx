import { Star, GitFork, ExternalLink } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StarredProjectsPage() {
  const starredProjects = [
    {
      id: 1,
      name: "facebook/react",
      description: "The library for web and native user interfaces",
      stars: "220k",
      forks: "45k",
      language: "JavaScript",
      owner: "facebook"
    },
    {
      id: 2,
      name: "microsoft/vscode",
      description: "Visual Studio Code",
      stars: "158k",
      forks: "28k",
      language: "TypeScript",
      owner: "microsoft"
    },
    {
      id: 3,
      name: "tailwindlabs/tailwindcss",
      description: "A utility-first CSS framework for rapid UI development",
      stars: "79k",
      forks: "4k",
      language: "CSS",
      owner: "tailwindlabs"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Starred Projects</h1>
          <p className="text-muted-foreground">Repositories you've starred</p>
        </div>

        <div className="grid gap-6">
          {starredProjects.map((project) => (
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
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks}</span>
                  </div>
                  <span className="text-xs">by {project.owner}</span>
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