import { GitBranch, Star, GitFork, Clock, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';

export default function MyProjectsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<any[]>([
    {
      id: '',
      name: '',
      description: '',
      stars: '',
      forks: '',
      language: '',
      updatedAt: '',
      isPrivate: false
    }
   
  ]);

  useEffect(() => {
    const fetchMyProjects = async () => {
      const data = await githubApi.getUserRepositories();
      setMyProjects(data);
      setIsLoading(false);
    };
    fetchMyProjects();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">Repositories owned by you</p>
        </div>

        <div className="grid gap-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            myProjects.map((project) => (
            <Card key={project.id} className="glass-card hover:glass-card-hover transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-primary" />
                      {project.name}
                      {project.isPrivate && (
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
                      <span>{project.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4" />
                      <span>{project.forks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {project.updatedAt}</span>
                    </div>
                  </div>
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