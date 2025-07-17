import React, { useState } from 'react';
import { githubApi, authApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BackendConfigTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { success: true, data: result } 
      }));
    } catch (error: any) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.response?.data || error.message 
        } 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = [
    {
      name: 'Health Check',
      function: () => githubApi.healthCheck(),
      description: 'Test basic connectivity to backend'
    },
    {
      name: 'Auth Check',
      function: () => authApi.checkAuth(),
      description: 'Test authentication status'
    },
    {
      name: 'Get JWT Token',
      function: () => authApi.getJwtToken(),
      description: 'Test JWT token generation'
    },
    {
      name: 'User Profile',
      function: () => githubApi.getUserProfile(),
      description: 'Test GitHub profile endpoint'
    },
    {
      name: 'User Repositories',
      function: () => githubApi.getUserRepositories(5),
      description: 'Test repositories endpoint'
    },
    {
      name: 'User Followers',
      function: () => githubApi.getFollowers(),
      description: 'Test followers endpoint'
    },
    {
      name: 'Starred Repositories',
      function: () => githubApi.getUserStarredRepositories(),
      description: 'Test starred repos endpoint'
    },
    {
      name: 'Trending Repositories',
      function: () => githubApi.getTrendingRepositories(),
      description: 'Test trending repos endpoint'
    },
    {
      name: 'User Contributions',
      function: () => githubApi.getUserContributions(),
      description: 'Test GraphQL contributions endpoint'
    },
    {
      name: 'Pinned Repositories',
      function: () => githubApi.getPinnedRepos(),
      description: 'Test GraphQL pinned repos endpoint'
    }
  ];

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.function);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const getResultColor = (testName: string) => {
    const result = testResults[testName];
    if (!result) return 'bg-gray-100';
    return result.success ? 'bg-green-100' : 'bg-red-100';
  };

  const getResultIcon = (testName: string) => {
    const result = testResults[testName];
    if (!result) return '⏳';
    return result.success ? '✅' : '❌';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔧 Backend Configuration Test
            <Badge variant="outline">Debug Tool</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button 
                onClick={runAllTests}
                disabled={Object.values(loading).some(Boolean)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                🚀 Run All Tests
              </Button>
              <Button 
                onClick={() => setTestResults({})}
                variant="outline"
              >
                🗑️ Clear Results
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {tests.map((test) => (
                <Card key={test.name} className={getResultColor(test.name)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {getResultIcon(test.name)} {test.name}
                      </CardTitle>
                      <Button
                        size="sm"
                        onClick={() => runTest(test.name, test.function)}
                        disabled={loading[test.name]}
                        variant="outline"
                      >
                        {loading[test.name] ? '⏳' : '▶️'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                    {testResults[test.name] && (
                      <div className="text-xs">
                        {testResults[test.name].success ? (
                          <div className="text-green-700">
                            <strong>Success:</strong> 
                            <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-20">
                              {JSON.stringify(testResults[test.name].data, null, 2)}
                            </pre>
                          </div>
                        ) : (
                          <div className="text-red-700">
                            <strong>Error:</strong> 
                            <pre className="mt-1 p-2 bg-white rounded text-xs overflow-auto max-h-20">
                              {JSON.stringify(testResults[test.name].error, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">📊 Test Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Total Tests:</strong> {tests.length}
                </div>
                <div>
                  <strong>Passed:</strong> {Object.values(testResults).filter(r => r?.success).length}
                </div>
                <div>
                  <strong>Failed:</strong> {Object.values(testResults).filter(r => !r?.success).length}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackendConfigTest; 