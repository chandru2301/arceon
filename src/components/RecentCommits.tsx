import { useEffect, useState } from 'react';
import { Star, Calendar, User } from 'lucide-react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useAuth } from '@/contexts/AuthContext';
import { githubApi } from '@/services/api';

interface WatchEventActor {
  id: number;
  login: string;
  display_login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

interface WatchEventRepo {
  id: number;
  name: string;
  url: string;
}

interface WatchEventOrg {
  id: number;
  login: string;
  gravatar_id: string;
  url: string;
  avatar_url: string;
}

interface WatchEventPayload {
  action: string;
}

interface PushEventPayload {
  push_id: number;
  size: number;
  distinct_size: number;
  ref: string;
  head: string;
  before: string;
  commits: Array<{
    sha: string;
    author: {
      email: string;
      name: string;
    };
    message: string;
    distinct: boolean;
    url: string;
  }>;
}

interface CreateEventPayload {
  ref: string;
  ref_type: string;
  master_branch: string;
  description: string;
  pusher_type: string;
}

interface ForkEventPayload {
  forkee: {
    id: number;
    name: string;
    full_name: string;
    private: boolean;
    owner: {
      login: string;
      id: number;
    };
  };
}

type EventPayload = WatchEventPayload | PushEventPayload | CreateEventPayload | ForkEventPayload;

interface WatchEvent {
  id: string;
  type: string;
  actor: WatchEventActor;
  repo: WatchEventRepo;
  payload: EventPayload;
  public: boolean;
  created_at: string;
  org?: WatchEventOrg;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
  return `${Math.ceil(diffDays / 365)} years ago`;
}

export function RecentCommits() {
  const { ref, isIntersecting } = useIntersectionObserver();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<WatchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await githubApi.getUserEvents();
      setEvents(data);
    } catch (err) {
      setError('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="w-full px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <p className="text-muted-foreground">Please log in to view your recent activity</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className={`w-full px-4 py-8 ${isIntersecting ? 'scroll-float' : ''}`}
    >
      <div className="scroll-reveal delay-1">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
      </div>

      {loading ? (
        <div className="glass-card p-6 rounded-lg">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className={`glass-card p-6 rounded-lg ${isIntersecting ? 'scroll-float' : ''}`}>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No recent activity found</h3>
                  <p className="text-muted-foreground max-w-md">
                    You haven't had any recent activity on GitHub. Start contributing to see your activity here.
                  </p>
                </div>
              </div>
            ) : (
              events.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors duration-200 ${
                    isIntersecting ? 'scroll-reveal' : ''
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={event.actor.avatar_url}
                      alt={event.actor.login}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-5 mb-1 break-words">
                          <span className="text-primary font-semibold">{event.actor.login}</span>{' '}
                          <span>
                            {event.type === 'WatchEvent' && 'action' in event.payload && event.payload.action === 'started' && (
                              <>
                                <span className="inline-flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 inline-block mr-1" />
                                  starred
                                </span>
                              </>
                            )}
                            {event.type === 'PushEvent' && (
                              <>
                                <span className="inline-flex items-center">
                                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1" />
                                  pushed to
                                </span>
                              </>
                            )}
                            {event.type === 'CreateEvent' && (
                              <>
                                <span className="inline-flex items-center">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mr-1" />
                                  created
                                </span>
                              </>
                            )}
                            {event.type === 'ForkEvent' && (
                              <>
                                <span className="inline-flex items-center">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full inline-block mr-1" />
                                  forked
                                </span>
                              </>
                            )}
                          </span>{' '}
                          <a
                            href={`https://github.com/${event.repo.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all"
                          >
                            {event.repo.name}
                          </a>
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{event.actor.login}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(event.created_at)}</span>
                          </div>
                          {event.org && (
                            <div className="flex items-center space-x-1">
                              <img
                                src={event.org.avatar_url}
                                alt={event.org.login}
                                className="w-3 h-3 rounded-full"
                              />
                              <span>{event.org.login}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <a
                        href={event.repo.url.replace('api.github.com/repos', 'github.com')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs flex-shrink-0"
                      >
                        View Repo
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </section>
  );
}