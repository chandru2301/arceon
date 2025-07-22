import { User, MapPin, Link as LinkIcon, Calendar, GitBranch, Users, Star, Loader2   } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { githubApi } from '@/services/api';
import LanguageCharts from '@/components/LanguageCharts';

interface LanguageData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export default function ProfilePage() {
  const { username } = useParams<{ username?: string }>();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>({
    name: '',
    login: '',
    html_url: '',
    email: '',
    blog: '',
    avatar_url: '',
    location: '',
    created_at: '',
    followers: '',
    following: '',
    repositories: '',
    contributions: '',
    public_repos: '',
    public_gists: '',
    updated_at: '',
    type: '',
    totalStars: '', 
  });
  const [pinnedRepos, setPinnedRepos] = useState<any[]>([]);
  const [languageData, setLanguageData] = useState<LanguageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getPinnedRepos = async (targetUsername: string) => {
    setIsLoading(true);
    try {
      const pinnedReposData = await githubApi.getPinnedRepos(targetUsername);
      const nodes = pinnedReposData?.data?.user?.pinnedItems?.nodes || [];
      console.log(nodes);
      setPinnedRepos(nodes);
    } catch (error) {
      console.error('Error fetching pinned repos:', error);
      setPinnedRepos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getLanguageData = async (targetUsername: string) => {
    try {
      setIsLoadingLanguages(true);
      const data = await githubApi.getUserLanguages(targetUsername);
      setLanguageData(data || []);
    } catch (error) {
      console.error('Error fetching language data:', error);
      setLanguageData([]);
    } finally {
      setIsLoadingLanguages(false);
    }
  };
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) {
        setError('No username provided');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const data = await githubApi.getUserProfile(username);
        setProfileData(data);
        getPinnedRepos(username);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        setError(error.message || 'Failed to load profile data');
        setIsLoading(false);
      }
    };

    const fetchStars = async () => {
      if (!username) return;
      
      try {
        const { totalStars } = await githubApi.getTotalStars(username);
        setProfileData(prev => ({ ...prev, totalStars }));
      } catch (error) {
        console.error('Error fetching stars:', error);
      }
    };
    
    fetchProfileData();
    fetchStars();
    if (username) {
      getLanguageData(username);
    }
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="w-full px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px] w-full">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <Button onClick={() => navigate('/dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
      <main className="w-full px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={profileData.avatar_url || 'https://github.com/github.png'}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-primary/20"
                  />
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-muted-foreground"><a href={profileData.html_url} className="text-primary hover:underline">@{profileData.login}</a></p>
                  <p className="text-sm text-muted-foreground mt-2">{profileData.email}</p>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm">{profileData.bio}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {profileData.location}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LinkIcon className="w-4 h-4" />
                    <a href={profileData.blog} className="text-primary hover:underline">
                      {profileData.blog}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profileData.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-bold text-lg" onClick={() => {
                      window.open(`https://github.com/${profileData.followers_url}`, '_blank');
                    }}>{profileData.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg" onClick={() => {
                      window.open(`https://github.com/${profileData.following_url}`, '_blank');
                    }}>{profileData.following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

               
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <GitBranch className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profileData.public_repos}</p>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profileData.totalStars}</p>
                  <p className="text-sm text-muted-foreground">Stars Earned</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profileData.followers}</p>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                </CardContent>
              </Card>
            </div>

            {/* Language Charts */}
            <LanguageCharts 
              languageData={languageData} 
              isLoading={isLoadingLanguages} 
            />

            {/* Pinned Repositories */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pinned Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pinnedRepos.map((repo: any, index: number) => (
                    <div key={index} className="p-4 rounded-lg border border-white/10 hover:bg-background/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2">
                            <GitBranch className="w-4 h-4 text-primary" />
                            {repo.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">{repo.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                              <span>
  {repo.languages.nodes.map((lang: any, index: number) => (
    <span key={index} style={{ marginRight: '6px' }}>
      {lang.name}
    </span>
  ))}
</span>

                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stargazerCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      )}
      <Footer />
    </div>
    
  );
}