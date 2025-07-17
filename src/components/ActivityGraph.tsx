import { useEffect, useState } from 'react';
import { Calendar, TrendingUp, GitCommit, Star } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { githubApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityData {
  date: string;
  count: number;
  level: number;
}

export function ActivityGraph() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchActivityData();
    }
  }, [isAuthenticated]);

  const fetchActivityData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getActivity();
      setActivityData(data);
    } catch (error) {
      console.error('Failed to fetch activity data:', error);
      setError('Failed to load activity data');
      // Fallback to mock data for demonstration
      generateMockActivityData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivityData = () => {
    const data: ActivityData[] = [];
    const today = new Date();
    
    // Generate 365 days of activity data
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate random activity with some patterns
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const baseActivity = isWeekend ? 0.3 : 0.7;
      
      const randomFactor = Math.random();
      const activityLevel = Math.floor(randomFactor * baseActivity * 6);
      
      data.push({
        date: date.toISOString().split('T')[0],
        count: activityLevel * 2,
        level: Math.min(activityLevel, 5)
      });
    }
    
    setActivityData(data);
  };

  const getContributionClass = (level: number) => {
    const classes = [
      'contribution-0',
      'contribution-1',
      'contribution-2',
      'contribution-3',
      'contribution-4',
      'contribution-5'
    ];
    return classes[Math.min(level, 5)];
  };

  const getMonthLabels = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labels = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(date.getMonth() - i);
      labels.push(months[date.getMonth()]);
    }
    
    return labels;
  };

  const getWeekLabels = () => {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  };

  const getActivityStats = () => {
    const totalContributions = activityData.reduce((sum, day) => sum + day.count, 0);
    const activeDays = activityData.filter(day => day.count > 0).length;
    const maxStreak = calculateMaxStreak();
    const currentStreak = calculateCurrentStreak();
    
    return {
      totalContributions,
      activeDays,
      maxStreak,
      currentStreak
    };
  };

  const calculateMaxStreak = () => {
    let maxStreak = 0;
    let currentStreak = 0;
    
    for (const day of activityData) {
      if (day.count > 0) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return maxStreak;
  };

  const calculateCurrentStreak = () => {
    let streak = 0;
    
    for (let i = activityData.length - 1; i >= 0; i--) {
      if (activityData[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (!isAuthenticated) {
    return (
      <section className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Activity Graph</h2>
          <p className="text-muted-foreground">Please log in to view your activity graph</p>
        </div>
      </section>
    );
  }

  const stats = getActivityStats();

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Activity Graph</h2>
      </div>
      
      {loading ? (
        <div className="glass-card p-6 rounded-lg animate-pulse">
          <div className="h-4 bg-muted rounded w-1/3 mb-6"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="flex space-x-1">
                {Array.from({ length: 53 }, (_, j) => (
                  <div key={j} className="w-3 h-3 bg-muted rounded-sm"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchActivityData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className={`glass-card p-6 rounded-lg ${isIntersecting ? 'scroll-float' : ''}`}>
          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-2">
                <GitCommit className="w-6 h-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.totalContributions}</div>
              <div className="text-sm text-muted-foreground">Total Contributions</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-2">
                <Calendar className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{stats.activeDays}</div>
              <div className="text-sm text-muted-foreground">Active Days</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{stats.maxStreak}</div>
              <div className="text-sm text-muted-foreground">Max Streak</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/10 rounded-lg mx-auto mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
          </div>

          {/* Activity Grid */}
          <div className="relative">
            {/* Month labels */}
            <div className="flex justify-between text-xs text-muted-foreground mb-2 ml-6">
              {getMonthLabels().map((month, index) => (
                <span key={index} className="w-10 text-center">{month}</span>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col justify-between text-xs text-muted-foreground mr-2 h-[104px]">
                {getWeekLabels().map((day, index) => (
                  <span key={index} className="h-3 leading-3">{day}</span>
                ))}
              </div>

              {/* Activity grid */}
              <div className="grid grid-cols-53 gap-1 grid-rows-7">
                {activityData.map((day, index) => (
                  <div
                    key={index}
                    className={`contribution-square ${getContributionClass(day.level)}`}
                    title={`${day.count} contributions on ${day.date}`}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex items-center space-x-1">
                {[0, 1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`contribution-square ${getContributionClass(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}