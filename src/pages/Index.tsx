import { useEffect } from 'react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { RepositoryOverview } from '@/components/RepositoryOverview';
import { PullRequestsSection } from '@/components/PullRequestsSection';
import { RecentCommits } from '@/components/RecentCommits';
import { IssuesNotifications } from '@/components/IssuesNotifications';
import { ActivityGraph } from '@/components/ActivityGraph';
import { Footer } from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Initialize intersection observers for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GitHubHeader />
      
      <main className="space-y-16">
        <RepositoryOverview />
        <PullRequestsSection />
        <RecentCommits />
        <IssuesNotifications />
        <ActivityGraph />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
