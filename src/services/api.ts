import axios from 'axios';
import config from '../config';

export interface GitHubUser {
  login: string;
  id: number;
  name: string;
  avatar_url: string;
  html_url: string;
  email: string;
  [key: string]: any;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || config.apiBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('github_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Utility for handling OAuth errors
const parseOAuthError = (error: string | null, errorDescription: string | null) => {
  if (!error) return null;
  
  const errorMap: Record<string, string> = {
    'access_denied': 'You denied access to your GitHub account.',
    'invalid_request': 'Invalid OAuth request. Please try again.',
    'unauthorized_client': 'This application is not authorized for GitHub OAuth.',
    'unsupported_response_type': 'GitHub OAuth response type not supported.',
    'server_error': 'GitHub server error occurred during authentication.',
    'temporarily_unavailable': 'GitHub authentication service is temporarily unavailable.',
  };
  
  return {
    code: error,
    message: errorDescription || errorMap[error] || `Authentication error: ${error}`
  };
};

export const authApi = {
  // Directly handles OAuth callback with code
  handleOAuthCallback: async (code: string) => {
    try {
      console.log('🔄 API: Exchanging OAuth code for token...');
      const response = await api.get(`/api/token?code=${code}`);
      
      if (response.data?.token) {
        localStorage.setItem('github_token', response.data.token);
        console.log('✅ Token saved successfully');
        return { success: true, token: response.data.token };
      } else {
        console.error('❌ No token in response:', response.data);
        return { success: false, error: 'No token received from server' };
      }
    } catch (error) {
      console.error('💥 OAuth callback API error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Failed to exchange code for token' 
      };
    }
  },
  
  // Check if the user is authenticated
  checkAuth: async () => {
    try {
      console.log('🔄 API: Checking authentication status...');
      const response = await api.get('/api/user');
      return { 
        isAuthenticated: true, 
        user: response.data 
      };
    } catch (error) {
      console.log('❌ Not authenticated:', error);
      return { 
        isAuthenticated: false, 
        user: null 
      };
    }
  },
  
  // Log out the user
  logout: async () => {
    try {
      console.log('🔄 API: Logging out...');
      await api.post('/api/logout');
      localStorage.removeItem('github_token');
      return true;
    } catch (error) {
      console.error('💥 Logout error:', error);
      // Still remove the token
      localStorage.removeItem('github_token');
      throw error;
    }
  }
};

export const githubApi = {
  // Get user repositories
  getUserRepositories: async () => {
    try {
      const response = await api.get('/api/github/repositories');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/api/github/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

  // Get user pull requests
  getUserPullRequests: async () => {
    try {
      const response = await api.get('/api/github/pull-requests');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pull requests:', error);
      throw error;
    }
  },

  // Get user commits
  getUserCommits: async () => {
    try {
      const response = await api.get('/api/github/commits');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch commits:', error);
      throw error;
    }
  },

  // Get issues
  getUserIssues: async () => {
    try {
      const response = await api.get('/api/github/user-issues');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch issues:', error);
      throw error;
    }
  },

  // Get activity
  getActivity: async () => {
    try {
      const response = await api.get('/api/github/activity');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch activity:', error);
      throw error;
    }
  },

  // Get user starred repositories
  getUserStarredRepositories: async () => {
    try {
      console.log('🔄 API: Fetching starred repositories...');
      const response = await api.get('/api/github/starred');
      console.log('🔄 API: Starred repositories fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch starred repositories:', error);
      throw error;
    }
  },

  // Get trending repositories
  getTrendingRepositories: async () => {
    try {
      const response = await api.get('/api/github/trending');
      console.log('🔄 API: Trending repositories fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch trending repositories:', error);
      throw error;
    }
  },

  // Get user events
  getUserEvents: async () => {
    try {
      const response = await api.get('/api/github/activity');
      console.log('🔄 API: User events fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  },

  // Get user contributions
  getUserContributions: async () => {
    try {
      const response = await api.post('/api/github/contributions');
      console.log('🔄 API: User contributions fetched:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      throw error;
    }
  },

  // Get total stars
  getTotalStars: async () => {
    try {
      const response = await api.get('/api/github/stars');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch total stars:', error);
      throw error;
    }
  },

  // Get pinned repositories
  getPinnedRepos: async () => {
    try {
      const response = await api.post('/api/github/pinned');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pinned repositories:', error);
      throw error;
    }
  }
};

export { parseOAuthError };
export default api; 