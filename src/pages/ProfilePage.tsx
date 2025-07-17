import { User, MapPin, Link as LinkIcon, Calendar, GitBranch, Users, Star } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const profileData = {
    name: 'John Developer',
    username: 'johndeveloper',
    email: 'john@developer.com',
    bio: 'Full-stack developer passionate about open source and modern web technologies. Building the future one commit at a time.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    location: 'San Francisco, CA',
    website: 'https://johndeveloper.dev',
    joined: 'March 2020',
    followers: 1247,
    following: 892,
    repositories: 56,
    contributions: 1847
  };

  const pinnedRepos = [
    {
      name: "github-dashboard",
      description: "A modern GitHub dashboard with glassmorphism design",
      stars: 127,
      language: "TypeScript"
    },
    {
      name: "portfolio-site",
      description: "Personal portfolio website built with React and Tailwind",
      stars: 45,
      language: "JavaScript"
    },
    {
      name: "api-wrapper",
      description: "A lightweight wrapper for GitHub API with TypeScript support",
      stars: 89,
      language: "TypeScript"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 ring-4 ring-primary/20"
                  />
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  <p className="text-muted-foreground">@{profileData.username}</p>
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
                    <a href={profileData.website} className="text-primary hover:underline">
                      {profileData.website}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {profileData.joined}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="font-bold text-lg">{profileData.followers}</p>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div>
                    <p className="font-bold text-lg">{profileData.following}</p>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>

                <Button className="w-full mt-6">
                  Edit Profile
                </Button>
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
                  <p className="text-2xl font-bold">{profileData.repositories}</p>
                  <p className="text-sm text-muted-foreground">Repositories</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">287</p>
                  <p className="text-sm text-muted-foreground">Stars Earned</p>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{profileData.contributions}</p>
                  <p className="text-sm text-muted-foreground">Contributions</p>
                </CardContent>
              </Card>
            </div>

            {/* Pinned Repositories */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Pinned Repositories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {pinnedRepos.map((repo, index) => (
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
                              <span>{repo.language}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              <span>{repo.stars}</span>
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

      <Footer />
    </div>
  );
}