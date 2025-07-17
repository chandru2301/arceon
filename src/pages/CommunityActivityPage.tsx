import { Users, UserPlus, Star, GitFork, Eye } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function CommunityActivityPage() {
  const followers = [
    {
      username: "sarah-dev",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612c4a5?w=150&h=150&fit=crop&crop=face",
      action: "started following you",
      time: "2 hours ago"
    },
    {
      username: "mike-codes",
      name: "Mike Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      action: "starred your repository",
      time: "5 hours ago"
    },
    {
      username: "alex-ui",
      name: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      action: "forked github-dashboard",
      time: "1 day ago"
    }
  ];

  const starredRepoActivity = [
    {
      repo: "facebook/react",
      activity: "New release v18.3.0",
      time: "3 hours ago",
      type: "release"
    },
    {
      repo: "microsoft/vscode",
      activity: "15 new commits",
      time: "6 hours ago",
      type: "commits"
    },
    {
      repo: "tailwindlabs/tailwindcss",
      activity: "New issue: Dark mode improvements",
      time: "1 day ago",
      type: "issue"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "follow": return UserPlus;
      case "star": return Star;
      case "fork": return GitFork;
      default: return Eye;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Community Activity
          </h1>
          <p className="text-muted-foreground">Activity from your followers and starred repositories</p>
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
                      <p className="text-xs text-muted-foreground">{follower.time}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {starredRepoActivity.map((activity, index) => (
                  <div key={index} className="p-3 rounded-lg hover:bg-background/20 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{activity.repo}</span>
                    </div>
                    <p className="text-sm">{activity.activity}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Stats */}
        <Card className="glass-card mt-8">
          <CardHeader>
            <CardTitle>Community Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-sm text-muted-foreground">Total followers</p>
              </div>
              <div className="text-center">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">287</p>
                <p className="text-sm text-muted-foreground">Stars received</p>
              </div>
              <div className="text-center">
                <GitFork className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Repositories forked</p>
              </div>
              <div className="text-center">
                <Eye className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold">2.1k</p>
                <p className="text-sm text-muted-foreground">Profile views</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}