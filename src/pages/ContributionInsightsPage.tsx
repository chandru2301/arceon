import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, GitCommit, Calendar, Activity } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { ActivityGraph } from '@/components/ActivityGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { githubApi } from '@/services/api';

interface MonthlyData {
  month: string;
  commits: number;
  percentage: number;
}

export default function ContributionInsightsPage() {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchContributionData();
    }
  }, [isAuthenticated]);

  const fetchContributionData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user contributions data
      const contributionsData = await githubApi.getUserContributions();
      
      if (contributionsData) {
        // Calculate contribution stats from contributions data
        const contributionStats = calculateContributionStats(contributionsData);
        console.log("contributionStats", contributionStats);
        setStats(contributionStats);

        // Calculate monthly breakdown from contributions data
        const monthlyBreakdown = calculateMonthlyBreakdown(contributionsData);
        console.log("monthlyBreakdown", monthlyBreakdown);
        setMonthlyData(monthlyBreakdown);
      } else {
        // Fallback to mock data
        setStats([
          { label: "Total Contributions", value: "1,247", change: "+12%", icon: GitCommit },
          { label: "Current Streak", value: "23 days", change: "+5 days", icon: Calendar },
          { label: "Longest Streak", value: "89 days", change: "Personal best", icon: TrendingUp },
          { label: "Average per Day", value: "3.4", change: "+0.8", icon: Activity }
        ]);
        setMonthlyData([
          { month: 'January', commits: 89, percentage: 25 },
          { month: 'February', commits: 178, percentage: 50 },
          { month: 'March', commits: 267, percentage: 75 },
          { month: 'April', commits: 356, percentage: 100 }
        ]);
      }
    } catch (error) {
      setError('Failed to load contribution data');
      // Fallback to mock data
      setStats([
        { label: "Total Contributions", value: "1,247", change: "+12%", icon: GitCommit },
        { label: "Current Streak", value: "23 days", change: "+5 days", icon: Calendar },
        { label: "Longest Streak", value: "89 days", change: "Personal best", icon: TrendingUp },
        { label: "Average per Day", value: "3.4", change: "+0.8", icon: Activity }
      ]);
      setMonthlyData([
        { month: 'January', commits: 89, percentage: 25 },
        { month: 'February', commits: 178, percentage: 50 },
        { month: 'March', commits: 267, percentage: 75 },
        { month: 'April', commits: 356, percentage: 100 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateContributionStats = (contributions: any) => {
    console.log("contributions", contributions);
    
    // Extract data from the nested structure
    const contributionCalendar = contributions?.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!contributionCalendar) {
      console.log("No contribution calendar data found");
      return [
        { label: "Total Contributions", value: "0", change: "+0%", icon: GitCommit },
        { label: "Current Streak", value: "0 days", change: "+0 days", icon: Calendar },
        { label: "Longest Streak", value: "0 days", change: "No data", icon: TrendingUp },
        { label: "Average per Day", value: "0.0", change: "+0.0", icon: Activity }
      ];
    }
    
    const totalContributions = contributionCalendar.totalContributions || 0;
    const weeks = contributionCalendar.weeks || [];
    
    console.log("totalContributions", totalContributions);
    console.log("weeks", weeks);
    
    // Calculate streaks from weeks data
    const { currentStreak, longestStreak } = calculateStreaks(weeks);
    const averagePerDay = totalContributions > 0 ? (totalContributions / 365).toFixed(1) : "0.0";
    
    console.log("currentStreak", currentStreak);
    console.log("longestStreak", longestStreak);
    console.log("averagePerDay", averagePerDay);

    return [
      { 
        label: "Total Contributions", 
        value: totalContributions.toLocaleString(), 
        change: "+12%", 
        icon: GitCommit 
      },
      { 
        label: "Current Streak", 
        value: `${currentStreak} days`, 
        change: "+5 days", 
        icon: Calendar 
      },
      { 
        label: "Longest Streak", 
        value: `${longestStreak} days`, 
        change: "Personal best", 
        icon: TrendingUp 
      },
      { 
        label: "Average per Day", 
        value: averagePerDay, 
        change: "+0.8", 
        icon: Activity 
      }
    ];
  };

  const calculateStreaks = (weeks: any[]) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Flatten all days from all weeks
    const allDays: any[] = [];
    weeks.forEach(week => {
      if (week.contributionDays && Array.isArray(week.contributionDays)) {
        allDays.push(...week.contributionDays);
      }
    });
    
    // Sort days by date (newest first)
    allDays.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate current streak (consecutive days with contributions)
    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i];
      if (day.contributionCount > 0) {
        currentStreak++;
      } else {
        break; // Streak ends when we find a day with no contributions
      }
    }
    
    // Calculate longest streak
    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i];
      if (day.contributionCount > 0) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }
    
    return { currentStreak, longestStreak };
  };

  const calculateMonthlyBreakdown = (contributions: any) => {
    // Extract weeks data from the nested structure
    const weeks = contributions?.data?.user?.contributionsCollection?.contributionCalendar?.weeks || [];
    
    if (!weeks || weeks.length === 0) {
      return [];
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    const monthlyCounts: { [key: string]: number } = {};
    
    // Initialize all months with 0
    months.forEach(month => {
      monthlyCounts[month] = 0;
    });

    // Count contributions by month from weeks data
    weeks.forEach((week: any) => {
      if (week.contributionDays && Array.isArray(week.contributionDays)) {
        week.contributionDays.forEach((day: any) => {
          if (day.date && day.contributionCount > 0) {
            const dayDate = new Date(day.date);
            const monthName = months[dayDate.getMonth()];
            monthlyCounts[monthName] += day.contributionCount;
          }
        });
      }
    });

    // Convert to array and calculate percentages
    const totalContributions = Object.values(monthlyCounts).reduce((sum, count) => sum + count, 0);
    const monthlyData = months.map(month => {
      const commits = monthlyCounts[month];
      const percentage = totalContributions > 0 ? (commits / totalContributions) * 100 : 0;
      return { month, commits, percentage };
    });

    // Return only months with data or last 4 months
    return monthlyData.slice(-4);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <GitHubHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Contribution Insights</h1>
            <p className="text-muted-foreground">Please log in to view your contribution insights</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            Contribution Insights
          </h1>
          <p className="text-muted-foreground">Your GitHub activity and contribution patterns</p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {/* Loading Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="glass-card animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading Activity Graph */}
            <Card className="glass-card animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>

            {/* Loading Monthly Breakdown */}
            <Card className="glass-card animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-muted rounded-full"></div>
                        <div className="h-4 bg-muted rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchContributionData}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className="flex items-center gap-1 text-primary">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{stat.change}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
                  {monthlyData.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No monthly data available</p>
                    </div>
                  ) : (
                    monthlyData.map((monthData, index) => (
                      <div key={monthData.month} className="flex items-center justify-between">
                        <span className="text-sm">{monthData.month}</span>
                        <div className="flex items-center gap-4">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${monthData.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{monthData.commits} commits</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}