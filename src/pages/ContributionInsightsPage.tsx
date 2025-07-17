import { BarChart3, TrendingUp, GitCommit } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { ActivityGraph } from '@/components/ActivityGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContributionInsightsPage() {
  const stats = [
      { label: "Total Contributions", value: "1,247", change: "+12%" },
      { label: "Current Streak", value: "23 days", change: "+5 days" },
      { label: "Longest Streak", value: "89 days", change: "Personal best" },
      { label: "Average per Day", value: "3.4", change: "+0.8" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Contribution Insights
          </h1>
          <p className="text-muted-foreground">Your GitHub activity and contribution patterns</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">{stat.change}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activity Graph */}
        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-primary" />
              Contribution Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityGraph />
          </CardContent>
        </Card>

        {/* Monthly Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['January', 'February', 'March', 'April'].map((month, index) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm">{month}</span>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(index + 1) * 25}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{(index + 1) * 89} commits</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}