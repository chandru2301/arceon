import { Activity, AlertCircle, GitPullRequest, Star, GitFork, Loader2 } from 'lucide-react';
import { GitHubHeader } from '@/components/GitHubHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';
import { githubApi } from '@/services/api';

export default function RepoHealthPage() {
  const [repositories, setRepositories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Health calculation constants
  const HEALTH_WEIGHTS = {
    activity: 0.25,      // 25% - Recent activity and engagement
    community: 0.20,     // 20% - Stars, forks, contributors
    codeQuality: 0.20,   // 20% - Issues, PRs, CI/CD
    documentation: 0.15,  // 15% - README, docs, wiki
    security: 0.10,      // 10% - Security files, alerts
    maintenance: 0.10    // 10% - Dependencies, updates
  };

  // Calculate activity score based on recent commits and engagement
  const calculateActivityScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // Recent activity (40% of activity score)
    if (repo.pushed_at) {
      const lastPush = new Date(repo.pushed_at);
      const daysAgo = (Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysAgo < 7) score += 40;
      else if (daysAgo < 30) score += 30;
      else if (daysAgo < 90) score += 20;
      else if (daysAgo < 365) score += 10;
    }

    // Commit frequency (30% of activity score)
    const commitCount = repo.commits_count || 0;
    if (commitCount > 100) score += 30;
    else if (commitCount > 50) score += 20;
    else if (commitCount > 20) score += 15;
    else if (commitCount > 5) score += 10;

    // Issue and PR responsiveness (30% of activity score)
    const openIssues = repo.open_issues_count || 0;
    const openPRs = repo.openPRs || 0;
    const totalOpen = openIssues + openPRs;
    
    if (totalOpen === 0) score += 30; // No open issues/PRs is good
    else if (totalOpen <= 5) score += 25;
    else if (totalOpen <= 15) score += 15;
    else if (totalOpen <= 30) score += 5;

    return Math.min(score, maxScore);
  };

  // Calculate community engagement score
  const calculateCommunityScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // Stars (40% of community score)
    const stars = repo.stargazers_count || 0;
    if (stars > 1000) score += 40;
    else if (stars > 100) score += 30;
    else if (stars > 10) score += 20;
    else if (stars > 0) score += 10;

    // Forks (30% of community score)
    const forks = repo.forks_count || 0;
    if (forks > 500) score += 30;
    else if (forks > 50) score += 20;
    else if (forks > 5) score += 15;
    else if (forks > 0) score += 10;

    // Contributors (30% of community score)
    const contributors = repo.contributors_count || 1; // Default to 1 for owner
    if (contributors > 20) score += 30;
    else if (contributors > 10) score += 25;
    else if (contributors > 5) score += 20;
    else if (contributors > 1) score += 15;

    return Math.min(score, maxScore);
  };

  // Calculate code quality score
  const calculateCodeQualityScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // Issue management (40% of code quality score)
    const openIssues = repo.open_issues_count || 0;
    if (openIssues === 0) score += 40;
    else if (openIssues <= 5) score += 35;
    else if (openIssues <= 15) score += 25;
    else if (openIssues <= 30) score += 15;
    else score += 5;

    // PR management (30% of code quality score)
    const openPRs = repo.openPRs || 0;
    if (openPRs === 0) score += 30;
    else if (openPRs <= 3) score += 25;
    else if (openPRs <= 10) score += 15;
    else if (openPRs <= 20) score += 10;
    else score += 5;

    // CI/CD presence (30% of code quality score)
    const hasCI = repo.has_ci || repo.topics?.includes('ci') || repo.topics?.includes('github-actions');
    if (hasCI) score += 30;

    return Math.min(score, maxScore);
  };

  // Calculate documentation score
  const calculateDocumentationScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // README presence (40% of documentation score)
    const hasReadme = repo.has_readme || repo.readme || repo.description;
    if (hasReadme) score += 40;

    // Additional documentation files (30% of documentation score)
    const hasContributing = repo.has_contributing || repo.files?.includes('CONTRIBUTING.md');
    const hasCodeOfConduct = repo.has_code_of_conduct || repo.files?.includes('CODE_OF_CONDUCT.md');
    const hasLicense = repo.has_license || repo.license;
    const hasWiki = repo.has_wiki;

    if (hasContributing) score += 10;
    if (hasCodeOfConduct) score += 10;
    if (hasLicense) score += 5;
    if (hasWiki) score += 5;

    // Documentation quality (30% of documentation score)
    const description = repo.description || '';
    if (description.length > 100) score += 30;
    else if (description.length > 50) score += 20;
    else if (description.length > 10) score += 10;

    return Math.min(score, maxScore);
  };

  // Calculate security score
  const calculateSecurityScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // Security files (50% of security score)
    const hasSecurity = repo.has_security || repo.files?.includes('SECURITY.md');
    const hasDependabot = repo.has_dependabot || repo.topics?.includes('dependabot');
    
    if (hasSecurity) score += 30;
    if (hasDependabot) score += 20;

    // Vulnerability alerts (30% of security score)
    const vulnerabilityAlerts = repo.vulnerability_alerts_count || 0;
    if (vulnerabilityAlerts === 0) score += 30;
    else if (vulnerabilityAlerts <= 2) score += 20;
    else if (vulnerabilityAlerts <= 5) score += 10;

    // Security policy (20% of security score)
    const hasSecurityPolicy = repo.has_security_policy || repo.files?.includes('SECURITY.md');
    if (hasSecurityPolicy) score += 20;

    return Math.min(score, maxScore);
  };

  // Calculate maintenance score
  const calculateMaintenanceScore = (repo: any) => {
    let score = 0;
    const maxScore = 100;

    // Dependency updates (40% of maintenance score)
    const hasDependabot = repo.has_dependabot || repo.topics?.includes('dependabot');
    const hasRenovate = repo.has_renovate || repo.topics?.includes('renovate');
    
    if (hasDependabot || hasRenovate) score += 40;

    // Repository age and activity (30% of maintenance score)
    const createdAt = new Date(repo.created_at);
    const updatedAt = new Date(repo.updated_at);
    const daysSinceCreation = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysSinceUpdate < 30) score += 30;
    else if (daysSinceUpdate < 90) score += 20;
    else if (daysSinceUpdate < 365) score += 10;

    // Repository size and complexity (30% of maintenance score)
    const size = repo.size || 0;
    const language = repo.language;
    
    if (size < 1000) score += 30;
    else if (size < 10000) score += 20;
    else if (size < 50000) score += 10;

    return Math.min(score, maxScore);
  };

  // Enhanced health calculation with detailed breakdown
  const calculateHealth = (repo: any) => {
    const activityScore = calculateActivityScore(repo);
    const communityScore = calculateCommunityScore(repo);
    const codeQualityScore = calculateCodeQualityScore(repo);
    const documentationScore = calculateDocumentationScore(repo);
    const securityScore = calculateSecurityScore(repo);
    const maintenanceScore = calculateMaintenanceScore(repo);

    // Calculate weighted total score
    const totalScore = Math.round(
      activityScore * HEALTH_WEIGHTS.activity +
      communityScore * HEALTH_WEIGHTS.community +
      codeQualityScore * HEALTH_WEIGHTS.codeQuality +
      documentationScore * HEALTH_WEIGHTS.documentation +
      securityScore * HEALTH_WEIGHTS.security +
      maintenanceScore * HEALTH_WEIGHTS.maintenance
    );

    return {
      totalHealthScore: Math.max(0, Math.min(100, totalScore)),
      breakdown: {
        activity: activityScore,
        community: communityScore,
        codeQuality: codeQualityScore,
        documentation: documentationScore,
        security: securityScore,
        maintenance: maintenanceScore
      }
    };
  };

  // Enhanced health color function
  const getHealthColor = (health: number) => {
    if (health >= 85) return "text-green-500";
    if (health >= 70) return "text-blue-500";
    if (health >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  // Enhanced status function
  const getStatus = (health: number) => {
    if (health >= 85) return "Excellent";
    if (health >= 70) return "Good";
    if (health >= 50) return "Moderate";
    return "Needs Attention";
  };

  const getStatusVariant = (status: string) => {
    if (status === "Excellent") return "default";
    if (status === "Good") return "secondary";
    if (status === "Moderate") return "outline";
    return "destructive";
  };

  useEffect(() => {
    
    const fetchRepositories = async () => {
      const data = await githubApi.getUserRepositories();
      // Calculate health and status for each repo
      const reposWithHealth = (data || []).map((repo: any) => {
        const healthData = calculateHealth(repo);
        return {
          ...repo,
          health: healthData.totalHealthScore,
          status: getStatus(healthData.totalHealthScore),
          healthBreakdown: healthData.breakdown
        };
      });
      setRepositories(reposWithHealth);
      setLoading(false);
    };
    fetchRepositories();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <GitHubHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Activity className="w-8 h-8 text-primary" />
            Repository Health
          </h1>
          <p className="text-muted-foreground">Monitor the health and activity of your repositories</p>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            repositories.map((repo, index) => (
            <Card key={index} className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                      {repo.name}
                    <Badge variant={getStatusVariant(repo.status)}>
                      {repo.status}
                    </Badge>
                  </CardTitle>
                  <div className={`text-2xl font-bold ${getHealthColor(repo.health)}`}>
                    {repo.health}%
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Health Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Repository Health</span>
                      <span>{repo.health}%</span>
                    </div>
                    <Progress value={repo.health} className="h-2" />
                  </div>

                  {/* Health Breakdown */}
                  {repo.healthBreakdown && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-muted-foreground">Health Breakdown</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Activity</span>
                            <span className="font-medium">{repo.healthBreakdown.activity}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.activity} className="h-1" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Community</span>
                            <span className="font-medium">{repo.healthBreakdown.community}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.community} className="h-1" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Code Quality</span>
                            <span className="font-medium">{repo.healthBreakdown.codeQuality}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.codeQuality} className="h-1" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Documentation</span>
                            <span className="font-medium">{repo.healthBreakdown.documentation}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.documentation} className="h-1" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Security</span>
                            <span className="font-medium">{repo.healthBreakdown.security}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.security} className="h-1" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Maintenance</span>
                            <span className="font-medium">{repo.healthBreakdown.maintenance}%</span>
                          </div>
                          <Progress value={repo.healthBreakdown.maintenance} className="h-1" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Detailed Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Open Issues</p>
                        <p className="font-semibold">{repo.open_issues_count || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {repo.open_issues_count === 0 ? 'Perfect' : 
                           repo.open_issues_count <= 5 ? 'Good' : 
                           repo.open_issues_count <= 15 ? 'Moderate' : 'Needs attention'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitPullRequest className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Open PRs</p>
                        <p className="font-semibold">{repo.openPRs || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {repo.openPRs === 0 ? 'Perfect' : 
                           repo.openPRs <= 3 ? 'Good' : 
                           repo.openPRs <= 10 ? 'Moderate' : 'Needs attention'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Stars</p>
                        <p className="font-semibold">{repo.stargazers_count || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {repo.stargazers_count > 1000 ? 'Excellent' : 
                           repo.stargazers_count > 100 ? 'Good' : 
                           repo.stargazers_count > 10 ? 'Moderate' : 'Growing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitFork className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Forks</p>
                        <p className="font-semibold">{repo.forks_count || 0}</p>
                        <p className="text-xs text-muted-foreground">
                          {repo.forks_count > 500 ? 'Excellent' : 
                           repo.forks_count > 50 ? 'Good' : 
                           repo.forks_count > 5 ? 'Moderate' : 'Growing'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Activity</p>
                        <p className="font-semibold">
                          {repo.pushed_at ? 
                            (() => {
                              const daysAgo = Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24));
                              if (daysAgo < 7) return 'Very Active';
                              if (daysAgo < 30) return 'Active';
                              if (daysAgo < 90) return 'Moderate';
                              return 'Low';
                            })() : 'Unknown'
                          }
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {repo.pushed_at ? 
                            `${Math.floor((Date.now() - new Date(repo.pushed_at).getTime()) / (1000 * 60 * 60 * 24))} days ago` : 
                            'No recent activity'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Repository Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Repository Details</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Language: {repo.language || 'Unknown'}</p>
                        <p>Size: {repo.size ? `${Math.round(repo.size / 1024)} KB` : 'Unknown'}</p>
                        <p>Created: {repo.created_at ? new Date(repo.created_at).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Documentation</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>README: {repo.has_readme ? '✅' : '❌'}</p>
                        <p>License: {repo.license ? '✅' : '❌'}</p>
                        <p>Wiki: {repo.has_wiki ? '✅' : '❌'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Security & Maintenance</p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Security Policy: {repo.has_security_policy ? '✅' : '❌'}</p>
                        <p>Dependabot: {repo.has_dependabot ? '✅' : '❌'}</p>
                        <p>CI/CD: {repo.has_ci ? '✅' : '❌'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )))}
        </div>
      </main>

      <Footer />
    </div>
  );
}