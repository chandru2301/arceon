import { Calendar, TrendingUp } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

export function ActivityGraph() {
  const { ref, isIntersecting } = useIntersectionObserver();

  // Generate activity data for the past year (simplified)
  const generateActivityData = () => {
    const data = [];
    const now = new Date();
    
    // Generate data for 365 days
    for (let i = 364; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Simulate activity levels (0-5)
      const activity = Math.floor(Math.random() * 6);
      
      data.push({
        date: date.toISOString().split('T')[0],
        activity,
        contributions: activity * Math.floor(Math.random() * 3) + activity
      });
    }
    
    return data;
  };

  const activityData = generateActivityData();
  
  // Group data by weeks
  const groupByWeeks = (data: any[]) => {
    const weeks = [];
    for (let i = 0; i < data.length; i += 7) {
      weeks.push(data.slice(i, i + 7));
    }
    return weeks;
  };

  const weeks = groupByWeeks(activityData);
  
  const getActivityLevel = (activity: number) => {
    if (activity === 0) return 'contribution-0';
    if (activity === 1) return 'contribution-1';
    if (activity === 2) return 'contribution-2';
    if (activity === 3) return 'contribution-3';
    if (activity === 4) return 'contribution-4';
    return 'contribution-5';
  };

  const totalContributions = activityData.reduce((sum, day) => sum + day.contributions, 0);
  const currentStreak = activityData.reverse().findIndex(day => day.activity === 0) || activityData.length;
  
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <section 
      ref={ref}
      className={`container mx-auto px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Activity Graph</h2>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className={`${isIntersecting ? 'scroll-reveal delay-2' : ''}`}>
          {/* Stats Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{totalContributions}</span> contributions in the last year
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{currentStreak}</span> day current streak
                </span>
              </div>
            </div>
          </div>

          {/* Month Labels */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted-foreground pl-8">
              {months.map((month, index) => (
                <span key={month} className={index % 2 === 0 ? '' : 'opacity-0'}>
                  {month}
                </span>
              ))}
            </div>
          </div>

          {/* Activity Grid */}
          <div className="relative">
            {/* Day Labels */}
            <div className="absolute left-0 top-0 flex flex-col justify-between h-full text-xs text-muted-foreground py-1">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Contribution Squares */}
            <div className="pl-8 overflow-x-auto">
              <div className="flex space-x-1 min-w-max">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => {
                      if (!day) return <div key={dayIndex} className="w-3 h-3" />;
                      
                      return (
                        <div
                          key={day.date}
                          className={`contribution-square ${getActivityLevel(day.activity)} cursor-pointer`}
                          title={`${day.contributions} contributions on ${day.date}`}
                          style={{
                            animationDelay: `${(weekIndex * 7 + dayIndex) * 0.01}s`
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
            <span>Learn how we count contributions</span>
            <div className="flex items-center space-x-2">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="contribution-square contribution-0" />
                <div className="contribution-square contribution-1" />
                <div className="contribution-square contribution-2" />
                <div className="contribution-square contribution-3" />
                <div className="contribution-square contribution-4" />
                <div className="contribution-square contribution-5" />
              </div>
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}