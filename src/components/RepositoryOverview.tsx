import { GitBranch, Star, GitFork, Eye } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function RepositoryOverview() {
  const { ref, isIntersecting } = useIntersectionObserver();

  const repositories = [
    {
      name: 'react-dashboard',
      description: 'A modern React dashboard with TypeScript and Tailwind CSS',
      language: 'TypeScript',
      stars: 234,
      forks: 45,
      watchers: 12,
      updatedAt: '2 hours ago',
      isPrivate: false
    },
    {
      name: 'github-analytics',
      description: 'GitHub repository analytics and insights tool',
      language: 'JavaScript',
      stars: 189,
      forks: 31,
      watchers: 8,
      updatedAt: '1 day ago',
      isPrivate: false
    },
    {
      name: 'api-gateway',
      description: 'Microservices API gateway with authentication',
      language: 'Python',
      stars: 156,
      forks: 28,
      watchers: 15,
      updatedAt: '3 days ago',
      isPrivate: true
    },
    {
      name: 'mobile-app',
      description: 'Cross-platform mobile application using React Native',
      language: 'TypeScript',
      stars: 298,
      forks: 67,
      watchers: 22,
      updatedAt: '5 days ago',
      isPrivate: false
    }
  ];

  const getLanguageColor = (language: string) => {
    const colors = {
      TypeScript: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      Go: 'bg-cyan-500'
    };
    return colors[language as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Repository Overview</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repositories.map((repo, index) => (
          <div
            key={repo.name}
            className={`glass-card p-6 rounded-lg hover:scale-105 transition-transform duration-300 ${
              isIntersecting ? 'scroll-float' : ''
            }`}
            style={{ animationDelay: `${(index + 2) * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-lg">{repo.name}</h3>
                {repo.isPrivate && (
                  <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                    Private
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                <span className="text-sm text-muted-foreground">{repo.language}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {repo.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{repo.stars}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitFork className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{repo.forks}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{repo.watchers}</span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                Updated {repo.updatedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}