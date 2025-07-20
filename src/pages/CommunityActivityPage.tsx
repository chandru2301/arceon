import { Users, UserPlus, Star, GitFork, Eye, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { githubApi } from '@/services/api';

interface Follower {
  username: string;
  name: string;
  avatar: string;
  action: string;
  time: string;
}

interface StarredActivity {
  repo: string;
  activity: string;
  time: string;
  type: string;
}

interface CommunityStats {
  followers: number;
  following: number;
  public_repos: number;
  public_gists: number;
}

export default function CommunityActivityPage() {
  const navigate = useNavigate();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [starredActivity, setStarredActivity] = useState<StarredActivity[]>([]);
  const [communityStats, setCommunityStats] = useState<CommunityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchCommunityData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [followersData, starredData, statsData] = await Promise.all([
        githubApi.getRecentFollowers(),
        githubApi.getStarredActivity(),
        githubApi.getCommunityStats()
      ]);

      setFollowers(followersData || []);
      setStarredActivity(starredData || []);
      setCommunityStats(statsData || null);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Error fetching community data:', err);
      setError(err.message || 'Failed to load community data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const handleRefresh = () => {
    fetchCommunityData(true);
  };

  const handleViewProfile = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "follow": return UserPlus;
      case "star": return Star;
      case "fork": return GitFork;
      default: return Eye;
    }
  };

  const formatTimeAgo = (time: string) => {
    if (time === 'recently') return 'Recently';
    return time;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-lg">Loading community activity...</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-lg text-red-500 mb-4">{error}</p>
              <Button onClick={handleRefresh}>
                Try Again
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
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Community Activity
            </h1>
            <p className="text-muted-foreground">
              Activity from your followers and starred repositories
              {communityStats && (
                <span className="ml-2 text-sm">
                  • {followers.length} recent followers • {starredActivity.length} starred repos
                </span>
              )}
            </p>
            {lastUpdated && (
              <p className="text-xs text-muted-foreground mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Follower Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Recent Followers & Interactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {followers.length > 0 ? (
                <div className="space-y-4">
                  {followers.map((follower, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/20 transition-colors">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={follower.avatar} alt={follower.name} />
                        <AvatarFallback>{follower.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{follower.name}</p>
                        <p className="text-sm text-muted-foreground">@{follower.username}</p>
                        <p className="text-sm">{follower.action}</p>
                        <p className="text-xs text-muted-foreground">{formatTimeAgo(follower.time)}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewProfile(follower.username)}
                      >
                        View Profile
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent followers found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Starred Repo Activity */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                Starred Repository Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {starredActivity.length > 0 ? (
                <div className="space-y-4">
                  {starredActivity.map((activity, index) => (
                    <div key={index} className="p-3 rounded-lg hover:bg-background/20 transition-colors">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-medium">{activity.repo}</span>
                      </div>
                      <p className="text-sm">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.time)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No starred repositories found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        {communityStats && (
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>Community Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">{communityStats.followers?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Total followers</p>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{communityStats.public_repos?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Public repositories</p>
                </div>
                <div className="text-center">
                  <GitFork className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{communityStats.following?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{communityStats.public_gists?.toLocaleString() || 0}</p>
                  <p className="text-sm text-muted-foreground">Public gists</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}