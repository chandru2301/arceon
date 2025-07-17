import { Settings, Moon, Sun, Bell, Eye, Lock, User } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="w-8 h-8 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-toggle">Dark Mode</Label>
                  <div className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </div>
                </div>
                <Switch
                  id="theme-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </div>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <div className="text-sm text-muted-foreground">
                    Get notified about new activity
                  </div>
                </div>
                <Switch id="push-notifications" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <div className="text-sm text-muted-foreground">
                    Weekly summary of your activity
                  </div>
                </div>
                <Switch id="weekly-digest" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility">Public Profile</Label>
                  <div className="text-sm text-muted-foreground">
                    Make your profile visible to everyone
                  </div>
                </div>
                <Switch id="profile-visibility" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="activity-visibility">Show Activity</Label>
                  <div className="text-sm text-muted-foreground">
                    Display your contribution activity
                  </div>
                </div>
                <Switch id="activity-visibility" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-visibility">Show Email</Label>
                  <div className="text-sm text-muted-foreground">
                    Display your email on your profile
                  </div>
                </div>
                <Switch id="email-visibility" />
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Account
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  defaultValue="John Developer"
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  defaultValue="Full-stack developer passionate about open source"
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  defaultValue="San Francisco, CA"
                  className="glass-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  defaultValue="https://johndeveloper.dev"
                  className="glass-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <div className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
              <div className="pt-4 border-t border-white/10">
                <Button variant="outline" className="mr-3">
                  Change Password
                </Button>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Changes */}
          <div className="flex justify-end gap-3">
            <Button variant="outline">Cancel</Button>
            <Button>Save Changes</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}