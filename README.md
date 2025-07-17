# GitHub Flow Dashboard

A modern GitHub dashboard built with React, TypeScript, and Spring Boot for managing repositories, pull requests, and team collaboration.

## Features

- **Secure Authentication**: OAuth2 integration with GitHub
- **Repository Management**: Track and manage your repositories
- **Pull Request Tracking**: Monitor pull requests and reviews
- **Team Collaboration**: Work together with your team
- **Real-time Activity**: See commits, issues, and contributions
- **Dark/Light Theme**: Toggle between themes

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn/ui components
- Lucide React icons
- React Router for navigation
- TanStack Query for data fetching

### Backend
- Spring Boot 3.x
- Spring Security with OAuth2
- GitHub API integration
- Maven for dependency management

## Setup Instructions

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.8+
- GitHub OAuth App

### GitHub OAuth Setup
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App with:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:8080/login/oauth2/code/github`
3. Note down the Client ID and Client Secret

### Backend Setup
1. Navigate to the Spring Boot backend directory
2. Update `application.properties` with your GitHub OAuth credentials:
   ```properties
   spring.security.oauth2.client.registration.github.client-id=your_client_id
   spring.security.oauth2.client.registration.github.client-secret=your_client_secret
   ```
3. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Shadcn/ui components
│   ├── ActivityGraph.tsx   # GitHub activity visualization
│   ├── GitHubHeader.tsx    # Main header with user info
│   ├── login.tsx           # Login page component
│   └── ...
├── contexts/
│   └── ThemeContext.tsx    # Theme management
├── hooks/
│   └── useIntersectionObserver.ts
├── pages/
│   ├── Index.tsx           # Main dashboard
│   └── NotFound.tsx        # 404 page
└── ...
```

## Login Flow

1. User clicks "Continue with GitHub" on the login page
2. Redirects to Spring Boot OAuth2 endpoint: `/oauth2/authorization/github`
3. GitHub handles authentication and redirects back to Spring Boot
4. Spring Boot processes the OAuth callback and creates a session
5. User is redirected to the dashboard with authentication

## API Endpoints

### Authentication
- `GET /oauth2/authorization/github` - Initiate GitHub OAuth login
- `POST /logout` - Logout user
- `GET /api/user` - Get current user information

### Dashboard Data
- `GET /api/repositories` - Get user repositories
- `GET /api/pull-requests` - Get pull requests
- `GET /api/commits` - Get recent commits
- `GET /api/issues` - Get issues and notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
