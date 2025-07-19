import { useEffect, useState } from 'react';
import { GitBranch, Star, GitFork, Eye } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export function RepositoryOverview() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRepositories();
    }
  }, [isAuthenticated]);

  const fetchRepositories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getUserRepositories();
      setRepositories(data);
    } catch (error) {
      setError('Failed to load repositories');
      // Fallback to mock data for demonstration
      setRepositories([
        {
          id: 1,
          name: 'react-dashboard',
          description: 'A modern React dashboard with TypeScript and Tailwind CSS',
          language: 'TypeScript',
          stargazers_count: 234,
          forks_count: 45,
          watchers_count: 12,
          updated_at: '2024-01-15T10:30:00Z',
          private: false
        },
        {
          id: 2,
          name: 'github-analytics',
          description: 'GitHub repository analytics and insights tool',
          language: 'JavaScript',
          stargazers_count: 189,
          forks_count: 31,
          watchers_count: 8,
          updated_at: '2024-01-14T15:45:00Z',
          private: false
        },
        {
          id: 3,
          name: 'api-gateway',
          description: 'Microservices API gateway with authentication',
          language: 'Python',
          stargazers_count: 156,
          forks_count: 28,
          watchers_count: 15,
          updated_at: '2024-01-12T08:20:00Z',
          private: true
        },
        {
          id: 4,
          name: 'mobile-app',
          description: 'Cross-platform mobile application using React Native',
          language: 'TypeScript',
          stargazers_count: 298,
          forks_count: 67,
          watchers_count: 22,
          updated_at: '2024-01-10T12:15:00Z',
          private: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language: string) => {
    const colors = {
      TypeScript: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-500',
      Java: 'bg-orange-500',
      Go: 'bg-cyan-500',
      C: 'bg-gray-500',
      'C++': 'bg-red-500',
      'C#': 'bg-purple-500',
      PHP: 'bg-indigo-500',
      Ruby: 'bg-red-600',
      Swift: 'bg-orange-600',
      Kotlin: 'bg-purple-600',
      Rust: 'bg-orange-800',
      Dart: 'bg-blue-600',
      HTML: 'bg-orange-400',
      CSS: 'bg-blue-400',
      Shell: 'bg-gray-600',
      Dockerfile: 'bg-blue-800',
    };
    return colors[language as keyof typeof colors] || 'bg-gray-500';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Repository Overview</h2>
          <p className="text-muted-foreground">Please log in to view your repositories</p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Repository Overview</h2>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 rounded-lg animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3 mb-4"></div>
              <div className="flex justify-between">
                <div className="flex space-x-4">
                  <div className="h-3 bg-muted rounded w-12"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                  <div className="h-3 bg-muted rounded w-12"></div>
                </div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchRepositories}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repositories.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="glass-card p-8 rounded-lg">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No repositories found</h3>
                  <p className="text-muted-foreground max-w-md">
                    You don't have any repositories yet. Create your first repository on GitHub to see it here.
                  </p>
                  <a
                    href="https://github.com/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    Create Repository
                  </a>
                </div>
              </div>
            </div>
          ) : (
            repositories.map((repo, index) => (
              <div
                key={repo.id}
                className={`glass-card p-6 rounded-lg hover:scale-105 transition-transform duration-300 ${
                  isIntersecting ? 'scroll-float' : ''
                }`}
                style={{ animationDelay: `${(index + 2) * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{repo.name}</h3>
                    {repo.private && (
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
                  {repo.description || 'No description available'}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{repo.watchers_count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDate(repo.updated_at)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}