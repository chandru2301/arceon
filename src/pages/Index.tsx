import { GitHubHeader } from '@/components/GitHubHeader';
import { RepositoryOverview } from '@/components/RepositoryOverview';
import { PullRequestsSection } from '@/components/PullRequestsSection';
import { RecentCommits } from '@/components/RecentCommits';
import { IssuesNotifications } from '@/components/IssuesNotifications';
import { ActivityGraph } from '@/components/ActivityGraph';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <GitHubHeader />
      
      <main className="space-y-16 px-4 py-8">
        <section className="animate-fade-in">
          <RepositoryOverview />
        </section>
        <section className="animate-fade-in delay-1">
          <PullRequestsSection />
        </section>
        <section className="animate-fade-in delay-2">
          <RecentCommits />
        </section>
        <section className="animate-fade-in delay-3">
          <IssuesNotifications />
        </section>
        <section className="animate-fade-in delay-4">
          <ActivityGraph />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
