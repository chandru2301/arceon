// Configuration for the application

const config = {
  // API base URL - points to the deployed backend on Render
//   apiBaseUrl: 'https://arceon-backend.onrender.com',
   // apiBaseUrl: 'http://localhost:8081',
   apiBaseUrl: 'https://arceon-backend.onrender.com',
  
  // GitHub OAuth settings
  github: {
    // The redirect URL after GitHub OAuth authentication
//     redirectUri: 'https://arceon.netlify.app/oauth/callback',
    //redirectUri: 'http://localhost:3000/oauth/callback',
    redirectUri: 'https://arceon.netlify.app/oauth/callback',
    // The OAuth authorization URL
    authorizationUrl: '/oauth2/authorization/github'
  }
};

export default config; 